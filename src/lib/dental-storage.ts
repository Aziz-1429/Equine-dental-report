import { DentalExam } from '@/components/dental/dentalTypes';

/**
 * Persistence for a dental exam. This is the ONLY file that knows the
 * exam is currently stored in localStorage — everything else talks to
 * `loadExam`/`saveExam`/`clearExam` by name. To move to a real backend
 * later (REST endpoint, server action, Prisma call), reimplement these
 * three functions against your API and nothing in the chart/panel/
 * summary components needs to change.
 *
 * Suggested next step for a database-backed version:
 *   - loadExam(sideId)   -> GET  /api/exams/:sideId
 *   - saveExam(sideId,e) -> PUT  /api/exams/:sideId   (or a server action)
 *   - clearExam(sideId)  -> DELETE /api/exams/:sideId
 * Keeping the same function signatures means EquineDentalChart doesn't
 * need to change at all.
 */

function storageKey(sideId: string): string {
  return `equine-dental-exam:${sideId}`;
}

export function loadExam(sideId: string): DentalExam | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(storageKey(sideId));
    if (!raw) return null;
    return JSON.parse(raw) as DentalExam;
  } catch {
    return null;
  }
}

export function saveExam(sideId: string, exam: DentalExam): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(sideId), JSON.stringify(exam));
  } catch {
    // storage may be full or unavailable — silently ignore
  }
}

export function clearExam(sideId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(storageKey(sideId));
}
