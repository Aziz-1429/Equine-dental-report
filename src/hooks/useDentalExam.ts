'use client';

import { useCallback, useEffect, useState } from 'react';
import { DentalChartSide, DentalExam, ToothFinding, ToothStatus } from '@/components/dental/dentalTypes';
import { createEmptyFinding, createInitialExam } from '@/components/dental/dentalData';
import { clearExam, loadExam, saveExam } from '@/lib/dental-storage';

export function useDentalExam(side: DentalChartSide) {
  // Start from the deterministic empty exam so server and first client
  // render match, then hydrate from storage once mounted.
  const [exam, setExam] = useState<DentalExam>(() => createInitialExam(side));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage on mount — localStorage isn't
    // available during SSR, so this can't be done in the lazy useState
    // initializer above and has to run as a mount effect instead.
    const stored = loadExam(side.id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExam(stored ?? createInitialExam(side));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [side.id]);

  useEffect(() => {
    if (!hydrated) return;
    saveExam(side.id, exam);
  }, [exam, hydrated, side.id]);

  const updateTooth = useCallback((toothNumber: string, patch: Partial<ToothFinding>) => {
    setExam((prev) => {
      const current = prev.teeth[toothNumber] ?? createEmptyFinding(toothNumber);
      return {
        ...prev,
        teeth: {
          ...prev.teeth,
          [toothNumber]: {
            ...current,
            ...patch,
            toothNumber,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const setToothStatus = useCallback(
    (toothNumber: string, status: ToothStatus) => {
      updateTooth(toothNumber, { status, examined: true });
    },
    [updateTooth]
  );

  const clearTooth = useCallback((toothNumber: string) => {
    setExam((prev) => ({
      ...prev,
      teeth: { ...prev.teeth, [toothNumber]: createEmptyFinding(toothNumber) },
    }));
  }, []);

  const setGeneralNotes = useCallback((generalNotes: string) => {
    setExam((prev) => ({ ...prev, generalNotes }));
  }, []);

  const clearAll = useCallback(() => {
    const fresh = createInitialExam(side);
    setExam(fresh);
    clearExam(side.id);
  }, [side]);

  return { exam, updateTooth, setToothStatus, clearTooth, setGeneralNotes, clearAll, hydrated };
}
