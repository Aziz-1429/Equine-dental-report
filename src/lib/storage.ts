import {
  DentalReportData,
  NerveBlockEntry,
  PathologyFinding,
  ReportPhoto,
  TableAngle,
  ToothFinding,
  TreatmentPerformed,
  createInitialReport,
} from './types';
import { ToothStatus } from '@/components/dental/dentalTypes';

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

/** Legacy per-tooth statuses that were really lesions → new finding label. */
const LEGACY_STATUS_TO_FINDING: Record<string, string> = {
  fractured: 'Fracture',
  'periodontal-disease': 'Periodontal pocket',
  'eruption-issue': 'Impacted / delayed eruption',
  overgrowth: 'Overgrowth',
};

/** Legacy statuses that carry information but map to no single finding. */
const LEGACY_STATUS_TO_NOTE: Record<string, string> = {
  caries: 'Caries (type not recorded)',
  malocclusion: 'Malocclusion (wave/step/ramp)',
  painful: 'Painful on examination',
  other: 'Other abnormality',
};

/** Old finding spellings → canonical label. */
const LEGACY_FINDING_RENAMES: Record<string, string> = {
  'excessive transverse ridges (etr)': 'Excessive transverse ridges (ETR)',
  'sharp enamel points': 'Sharp enamel points',
  'step mouth': 'Step',
  'wave mouth': 'Wave',
  'periodontal pocket': 'Periodontal pocket',
  'diastema / feed packing': 'Diastema / feed packing',
};

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
    findings.add(LEGACY_FINDING_RENAMES[key] ?? f);
  }

  // A named lesion on a "normal" tooth is a contradiction — promote.
  if (findings.size > 0 && status === 'normal') status = 'abnormal';

  return {
    toothNumber,
    examined: typeof saved?.examined === 'boolean' ? saved.examined : Boolean(saved),
    status,
    findings: [...findings],
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

/** Rebuilds a checklist (pathologies / treatments) against the CURRENT
 * option list, keeping any tick whose label still exists (case-insensitive).
 * Ticks for labels that no longer exist are dropped — they were either
 * mis-filed (a finding under "procedures") or renamed beyond safe
 * matching, and the per-tooth chart still holds the clinical detail. */
function normalizeChecklist<T extends { id: string; label: string; checked: boolean; note?: string }>(
  saved: unknown,
  fallback: T[]
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
    const match = byLabel.get(item.label.toLowerCase());
    return match ? { ...item, checked: match.checked, ...(match.note ? { note: match.note } : {}) } : item;
  });
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
    farside: { ...fallback.farside, ...(saved.farside ?? {}) },
    nearside: { ...fallback.nearside, ...(saved.nearside ?? {}) },
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
    pathologies: normalizeChecklist<PathologyFinding>(parsed.pathologies, base.pathologies),
    treatments: normalizeChecklist<TreatmentPerformed>(parsed.treatments, base.treatments),
    softTissue: normalizeChecklist(parsed.softTissue, base.softTissue),
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
