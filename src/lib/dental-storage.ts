import { DentalExam, ToothFinding } from '@/components/dental/dentalTypes';
import { migrateTooth } from './storage';

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
    const parsed = JSON.parse(raw) as Partial<DentalExam>;
    // Upgrade any legacy status/finding vocabulary (see lib/storage.ts).
    const teeth: Record<string, ToothFinding> = {};
    for (const [toothNumber, saved] of Object.entries(parsed.teeth ?? {})) {
      teeth[toothNumber] = migrateTooth(toothNumber, saved as unknown as Record<string, unknown>);
    }
    return { teeth, generalNotes: parsed.generalNotes ?? '' };
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
