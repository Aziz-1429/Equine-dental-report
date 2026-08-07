import { DentalReportData, createInitialReport } from './types';

const STORAGE_KEY = 'equine-dental-report-draft';
const SAVED_KEY = 'equine-dental-report-saved-at';

export function loadDraft(): DentalReportData {
  if (typeof window === 'undefined') return createInitialReport();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialReport();
    const parsed = JSON.parse(raw) as Partial<DentalReportData>;
    const base = createInitialReport();
    return { ...base, ...parsed };
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
