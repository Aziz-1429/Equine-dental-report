import { DentalReportData, ToothRecord, createInitialReport } from './types';

const STORAGE_KEY = 'equine-dental-report-draft';
const SAVED_KEY = 'equine-dental-report-saved-at';

// Fills in fields added to ToothRecord after a draft may have been saved
// (e.g. findings/severity/note), so old localStorage drafts don't crash
// components that assume the current shape.
function normalizeTeeth(
  teeth: Record<string, Partial<ToothRecord>> | undefined,
  fallback: Record<string, ToothRecord>
): Record<string, ToothRecord> {
  if (!teeth) return fallback;
  const normalized: Record<string, ToothRecord> = {};
  for (const id of Object.keys(fallback)) {
    const saved = teeth[id];
    normalized[id] = {
      id,
      status: saved?.status ?? 'normal',
      findings: saved?.findings ?? [],
      severity: saved?.severity ?? '',
      note: saved?.note ?? '',
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
      teeth: normalizeTeeth(parsed.teeth, base.teeth),
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
