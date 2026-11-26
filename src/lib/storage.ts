import {
  CodedOption,
  DentalReportData,
  NerveBlockEntry,
  OcclusalContact,
  PATHOLOGY_CATALOG,
  PathologyFinding,
  ReportPhoto,
  SOFT_TISSUE_CATALOG,
  TableAngle,
  ToothFinding,
  TreatmentPerformed,
  codedLabel,
  createInitialReport,
} from './types';
import { INFUNDIBULAR_CARIES_CODE, TOOTH_FINDING_OPTIONS, ToothStatus } from '@/components/dental/dentalTypes';

const STORAGE_KEY = 'equine-dental-report-draft';
const SAVED_KEY = 'equine-dental-report-saved-at';

// ---------------------------------------------------------------------------
// Vocabulary migrations
//
// The report's controlled vocabularies were revised after a clinical review
// (status list collapsed to presence + normal/abnormal; one canonical
// per-tooth lesion list; procedures separated from findings). Anything
// saved before that — a localStorage draft or a Supabase row — is upgraded
// here so no recorded information is silently lost. Where an old value has
// no exact new equivalent the detail is appended to the tooth's notes
// rather than guessed.
// ---------------------------------------------------------------------------

/** Legacy per-tooth statuses that were really lesions → finding CODE. */
const LEGACY_STATUS_TO_FINDING: Record<string, string> = {
  fractured: 'FX',
  'periodontal-disease': 'PP',
  'eruption-issue': 'TU',
  overgrowth: 'TO',
};

/** Legacy statuses that carry information but map to no single finding. */
const LEGACY_STATUS_TO_NOTE: Record<string, string> = {
  caries: 'Caries (type not recorded)',
  malocclusion: 'Malocclusion (wave/step/ramp)',
  painful: 'Painful on examination',
  other: 'Other abnormality',
};

/** Every earlier spelling of a per-tooth finding (lower-cased) → the
 * reference CODE now stored. Findings were stored by name until the
 * clinic's illustrated code reference was adopted. */
const LEGACY_FINDING_TO_CODE: Record<string, string> = {
  'sharp enamel points': 'PTS',
  hook: 'HK',
  ramp: 'RMP',
  step: 'STP',
  'step mouth': 'STP',
  wave: 'WV',
  'wave mouth': 'WV',
  'excessive transverse ridges (etr)': 'ETR',
  'excessive transverse ridges': 'ETR',
  overgrowth: 'TO',
  'retained deciduous cap': 'RD',
  'cap fragment': 'RD',
  'impacted / delayed eruption': 'TU',
  supernumerary: 'SN',
  fracture: 'FX',
  'pulp exposure': 'PE',
  'mobile tooth': 'MOB',
  'diastema / feed packing': 'DIA',
  'periodontal pocket': 'PP',
  'caries — infundibular': 'INF/CA',
  'caries — peripheral': 'CA',
};
const KNOWN_FINDING_CODES = new Set(TOOTH_FINDING_OPTIONS);

function appendNote(notes: string, extra: string): string {
  if (!extra || notes.includes(extra)) return notes;
  return notes ? `${notes}; ${extra}` : extra;
}

export function migrateTooth(toothNumber: string, saved: Record<string, unknown> | undefined): ToothFinding {
  const rawStatus = typeof saved?.status === 'string' ? saved.status : 'normal';
  const rawFindings = Array.isArray(saved?.findings) ? (saved!.findings as unknown[]) : [];
  let notes = (saved?.notes as string) ?? (saved?.note as string) ?? '';

  let status: ToothStatus;
  const findings = new Set<string>();

  switch (rawStatus) {
    case 'normal':
    case 'abnormal':
    case 'absent':
    case 'extracted':
      status = rawStatus;
      break;
    case 'missing':
      status = 'absent';
      break;
    default:
      status = 'abnormal';
      if (LEGACY_STATUS_TO_FINDING[rawStatus]) findings.add(LEGACY_STATUS_TO_FINDING[rawStatus]);
      else if (LEGACY_STATUS_TO_NOTE[rawStatus]) notes = appendNote(notes, LEGACY_STATUS_TO_NOTE[rawStatus]);
  }

  for (const f of rawFindings) {
    if (typeof f !== 'string') continue;
    const key = f.trim().toLowerCase();
    if (key === 'missing tooth') {
      // "Missing" was a finding; it is now the presence status.
      if (status === 'normal' || status === 'abnormal') status = 'absent';
      continue;
    }
    // already a code → keep; old name → its code; anything else is kept
    // verbatim so no recorded detail is lost (it shows as-is).
    findings.add(KNOWN_FINDING_CODES.has(f) ? f : (LEGACY_FINDING_TO_CODE[key] ?? f));
  }

  // A named lesion on a "normal" tooth is a contradiction — promote.
  if (findings.size > 0 && status === 'normal') status = 'abnormal';

  const rawGrade = saved?.infundibularCariesGrade;
  const infundibularCariesGrade =
    findings.has(INFUNDIBULAR_CARIES_CODE) && typeof rawGrade === 'string' && ['0', '1', '2', '3', '4'].includes(rawGrade)
      ? (rawGrade as ToothFinding['infundibularCariesGrade'])
      : '';

  return {
    toothNumber,
    examined: typeof saved?.examined === 'boolean' ? saved.examined : Boolean(saved),
    status,
    findings: [...findings],
    infundibularCariesGrade,
    severity: (saved?.severity as ToothFinding['severity']) ?? '',
    treatment: (saved?.treatment as string) ?? '',
    recommendation: (saved?.recommendation as string) ?? '',
    notes,
    updatedAt: saved?.updatedAt as string | undefined,
  };
}

function normalizeTeeth(
  teeth: Record<string, Record<string, unknown>> | undefined,
  fallback: Record<string, ToothFinding>
): Record<string, ToothFinding> {
  if (!teeth) return fallback;
  const normalized: Record<string, ToothFinding> = {};
  for (const toothNumber of Object.keys(fallback)) {
    normalized[toothNumber] = migrateTooth(toothNumber, teeth[toothNumber]);
  }
  return normalized;
}

/** Rebuilds a checklist (pathologies / soft tissue / treatments) against
 * the CURRENT option list, keeping any tick whose label still exists
 * (case-insensitive) — or, when `aliases` is given, whose label was an
 * earlier spelling of the same entry. Ticks for labels that no longer
 * exist are dropped — they were either mis-filed (a finding under
 * "procedures") or renamed beyond safe matching, and the per-tooth chart
 * still holds the clinical detail. */
function normalizeChecklist<T extends { id: string; label: string; checked: boolean; note?: string }>(
  saved: unknown,
  fallback: T[],
  aliases?: (label: string) => string[]
): T[] {
  if (!Array.isArray(saved)) return fallback;
  const byLabel = new Map<string, { checked: boolean; note?: string }>();
  for (const item of saved as Array<Record<string, unknown>>) {
    if (typeof item?.label === 'string') {
      byLabel.set(item.label.trim().toLowerCase(), {
        checked: Boolean(item.checked),
        note: typeof item.note === 'string' ? item.note : undefined,
      });
    }
  }
  return fallback.map((item) => {
    const keys = [item.label, ...(aliases ? aliases(item.label) : [])].map((k) => k.toLowerCase());
    const match = keys.map((k) => byLabel.get(k)).find(Boolean);
    return match ? { ...item, checked: match.checked, ...(match.note ? { note: match.note } : {}) } : item;
  });
}

/** Earlier spellings of a coded checklist entry, from its catalog. */
function catalogAliases(catalog: CodedOption[]) {
  const byLabel = new Map<string, string[]>();
  for (const o of catalog) {
    const label = catalog === SOFT_TISSUE_CATALOG && o.name.endsWith('— normal') ? o.name : codedLabel(o);
    byLabel.set(label, [o.name, ...(o.aliases ?? [])]);
  }
  return (label: string) => byLabel.get(label) ?? [];
}

function normalizeOcclusalContact(v: unknown): OcclusalContact {
  return v === 'Full' || v === 'Partial' || v === 'Minimal' ? v : '';
}

function normalizeExcursion(
  saved: Record<string, unknown> | undefined,
  fallback: DentalReportData['examMeasurements']['farside']
): DentalReportData['examMeasurements']['farside'] {
  if (!saved) return fallback;
  return {
    excursion: (saved.excursion as typeof fallback.excursion) ?? '',
    postDentalExcursion: (saved.postDentalExcursion as typeof fallback.excursion) ?? '',
    // the old free-text "percent of occlusion" has no safe mapping to the
    // new Full / Partial / Minimal pills, so it is left unset
    occlusalContact: normalizeOcclusalContact(saved.occlusalContact),
    postDentalOcclusalContact: normalizeOcclusalContact(saved.postDentalOcclusalContact),
  };
}

const LEGACY_BLOCK_RENAMES: Record<string, string> = {
  'mental nerve': 'Middle mental',
  mandibular: 'Inferior alveolar (mandibular foramen)',
  'local block': 'Intra-oral local infiltration',
};

function normalizeNerveBlocks(saved: unknown, fallback: NerveBlockEntry[]): NerveBlockEntry[] {
  if (!Array.isArray(saved) || saved.length === 0) return fallback;
  return (saved as Array<Record<string, unknown>>).map((b, i) => {
    const block = typeof b.block === 'string' ? b.block : '';
    return {
      id: typeof b.id === 'string' ? b.id : `block-${i}`,
      block: LEGACY_BLOCK_RENAMES[block.trim().toLowerCase()] ?? block,
      side: (b.side as NerveBlockEntry['side']) ?? '',
      drug: typeof b.drug === 'string' ? b.drug : 'Lidocaine',
      // the field was called "dose" before it was made explicit as a volume
      volume: typeof b.volume === 'string' ? b.volume : typeof b.dose === 'string' ? b.dose : '',
    };
  });
}

function normalizeTableAngle(v: unknown): TableAngle {
  if (v === 'Excessive') return 'Steep';
  if (v === 'Flat' || v === 'Normal' || v === 'Steep') return v;
  return '';
}

function normalizeExamMeasurements(
  saved: Partial<DentalReportData['examMeasurements']> | undefined,
  fallback: DentalReportData['examMeasurements']
): DentalReportData['examMeasurements'] {
  if (!saved) return fallback;
  const angle = (key: 'molarAngleFarside' | 'incisorAngle' | 'molarAngleNearside') => {
    const s = (saved[key] ?? {}) as Partial<DentalReportData['examMeasurements'][typeof key]>;
    return { before: normalizeTableAngle(s.before), after: normalizeTableAngle(s.after) };
  };
  return {
    ...fallback,
    ...saved,
    farside: normalizeExcursion(saved.farside as Record<string, unknown> | undefined, fallback.farside),
    nearside: normalizeExcursion(saved.nearside as Record<string, unknown> | undefined, fallback.nearside),
    molarAngleFarside: angle('molarAngleFarside'),
    incisorAngle: angle('incisorAngle'),
    molarAngleNearside: angle('molarAngleNearside'),
  };
}

function normalizePhotos(saved: unknown): ReportPhoto[] {
  if (!Array.isArray(saved)) return [];
  return (saved as Array<Record<string, unknown>>)
    .filter((p) => typeof p?.dataUrl === 'string' && (p.dataUrl as string).startsWith('data:image/'))
    .map((p, i) => ({
      id: typeof p.id === 'string' ? p.id : `photo-${i}`,
      dataUrl: p.dataUrl as string,
      caption: typeof p.caption === 'string' ? p.caption : '',
      toothNumber: typeof p.toothNumber === 'string' ? p.toothNumber : '',
    }));
}

/**
 * Upgrades any previously-saved report (local draft OR database row) to
 * the current schema and vocabularies. Safe to call on current data —
 * it is a no-op then.
 */
export function normalizeReport(parsed: Partial<DentalReportData> | null | undefined): DentalReportData {
  const base = createInitialReport();
  if (!parsed || typeof parsed !== 'object') return base;
  const raw = parsed as Record<string, unknown>;
  return {
    ...base,
    ...parsed,
    weightKg: typeof raw.weightKg === 'string' ? raw.weightKg : '',
    teeth: normalizeTeeth(parsed.teeth as Record<string, Record<string, unknown>> | undefined, base.teeth),
    pathologies: normalizeChecklist<PathologyFinding>(parsed.pathologies, base.pathologies, catalogAliases(PATHOLOGY_CATALOG)),
    treatments: normalizeChecklist<TreatmentPerformed>(parsed.treatments, base.treatments),
    softTissue: normalizeChecklist(parsed.softTissue, base.softTissue, catalogAliases(SOFT_TISSUE_CATALOG)),
    physicalExam: Array.isArray(raw.physicalExam)
      ? (raw.physicalExam as unknown[]).filter((r): r is string => typeof r === 'string')
      : [],
    nerveBlocks: normalizeNerveBlocks(parsed.nerveBlocks, base.nerveBlocks),
    examMeasurements: normalizeExamMeasurements(parsed.examMeasurements, base.examMeasurements),
    photos: normalizePhotos(raw.photos),
    recommendations: Array.isArray(raw.recommendations)
      ? (raw.recommendations as unknown[]).filter((r): r is string => typeof r === 'string')
      : [],
  };
}

export function loadDraft(): DentalReportData {
  if (typeof window === 'undefined') return createInitialReport();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialReport();
    return normalizeReport(JSON.parse(raw) as Partial<DentalReportData>);
  } catch {
    return createInitialReport();
  }
}

/** True when the last save failed because the browser's storage quota
 * was hit (almost always: too many / too large photos). The UI reads
 * this to warn instead of silently dropping the draft. */
let lastSaveQuotaExceeded = false;
export function didLastSaveExceedQuota(): boolean {
  return lastSaveQuotaExceeded;
}

export function saveDraft(data: DentalReportData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(SAVED_KEY, new Date().toISOString());
    lastSaveQuotaExceeded = false;
  } catch (err) {
    // storage may be full or unavailable — remember why so the UI can say so
    lastSaveQuotaExceeded =
      err instanceof DOMException && (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED');
  }
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SAVED_KEY);
}

export function getSavedTimestamp(): Date | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SAVED_KEY);
  if (!raw) return null;
  try {
    return new Date(raw);
  } catch {
    return null;
  }
}
