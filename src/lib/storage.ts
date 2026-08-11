import { DentalReportData, ToothFinding, createInitialReport } from './types';

const STORAGE_KEY = 'equine-dental-report-draft';
const SAVED_KEY = 'equine-dental-report-saved-at';

// Fills in fields ToothFinding has picked up across schema revisions —
// `note` -> `notes`, `id` -> `toothNumber`, findings as string -> string[],
// plus the newer `examined`/`severity`/`treatment`/`recommendation`
// fields — so an old localStorage draft never crashes a component that
// assumes the current shape.
function normalizeTeeth(
  teeth: Record<string, Record<string, unknown>> | undefined,
  fallback: Record<string, ToothFinding>
): Record<string, ToothFinding> {
  if (!teeth) return fallback;
  const normalized: Record<string, ToothFinding> = {};
  for (const toothNumber of Object.keys(fallback)) {
    const saved = teeth[toothNumber];
    const findings = saved?.findings;
    normalized[toothNumber] = {
      toothNumber,
      examined: typeof saved?.examined === 'boolean' ? saved.examined : Boolean(saved),
      status: (saved?.status as ToothFinding['status']) ?? 'normal',
      findings: Array.isArray(findings) ? findings : [],
      severity: (saved?.severity as ToothFinding['severity']) ?? '',
      treatment: (saved?.treatment as string) ?? '',
      recommendation: (saved?.recommendation as string) ?? '',
      notes: (saved?.notes as string) ?? (saved?.note as string) ?? '',
      updatedAt: saved?.updatedAt as string | undefined,
    };
  }
  return normalized;
}

export function loadDraft(): DentalReportData {
  if (typeof window === 'undefined') return createInitialReport();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialReport();
    const parsed = JSON.parse(raw) as Partial<DentalReportData>;
    const base = createInitialReport();
    return {
      ...base,
      ...parsed,
      teeth: normalizeTeeth(parsed.teeth as Record<string, Record<string, unknown>> | undefined, base.teeth),
    };
  } catch {
    return createInitialReport();
  }
}

export function saveDraft(data: DentalReportData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(SAVED_KEY, new Date().toISOString());
  } catch {
    // storage may be full or unavailable — silently ignore
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
