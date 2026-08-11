'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { EquineDentalChart } from '@/components/dental/EquineDentalChart';
import { ToothExamPanel } from '@/components/dental/ToothExamPanel';
import { DentalExamSummary } from '@/components/dental/DentalExamSummary';
import { DentalLegend } from '@/components/dental/DentalLegend';
import { DENTAL_CHART_SIDES } from '@/components/dental/dentalData';
import { useDentalExam } from '@/hooks/useDentalExam';

const side = DENTAL_CHART_SIDES[0];

export default function DentalExamPage() {
  const { exam, updateTooth, setToothStatus, clearTooth, setGeneralNotes, clearAll, hydrated } = useDentalExam(side);
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const [confirmingClearAll, setConfirmingClearAll] = useState(false);

  const selectedFinding = selectedTooth ? exam.teeth[selectedTooth] : null;

  const handleClearAll = () => {
    clearAll();
    setSelectedTooth(null);
    setConfirmingClearAll(false);
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-400">Loading exam...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Equine Dental Examination Chart</h1>
          <p className="mt-0.5 text-sm text-slate-500">{side.label}</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-4">
          <DentalExamSummary side={side} exam={exam} />
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <DentalLegend />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setConfirmingClearAll(true)}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear all examination data
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
          {/* Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <EquineDentalChart
              side={side}
              exam={exam}
              selectedTooth={selectedTooth}
              onSelectTooth={setSelectedTooth}
            />
          </div>

          {/* Exam panel — static column on desktop */}
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block">
            {selectedFinding ? (
              <ToothExamPanel
                key={selectedFinding.toothNumber}
                finding={selectedFinding}
                onChange={(patch) => updateTooth(selectedFinding.toothNumber, patch)}
                onMarkStatus={(status) => setToothStatus(selectedFinding.toothNumber, status)}
                onClear={() => clearTooth(selectedFinding.toothNumber)}
                onClose={() => setSelectedTooth(null)}
              />
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center p-6 text-center">
                <p className="text-sm text-slate-400">Select a tooth on the chart to begin its examination.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <Label className="text-xs font-semibold">General exam notes</Label>
          <Textarea
            value={exam.generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            rows={3}
            placeholder="Overall impressions, sedation notes, follow-up plan..."
            className="mt-1.5 text-sm"
          />
        </div>
      </main>

      {/* Mobile/tablet bottom sheet */}
      {selectedFinding && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close examination panel"
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedTooth(null)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-slate-900">
            <ToothExamPanel
              key={selectedFinding.toothNumber}
              finding={selectedFinding}
              onChange={(patch) => updateTooth(selectedFinding.toothNumber, patch)}
              onMarkStatus={(status) => setToothStatus(selectedFinding.toothNumber, status)}
              onClear={() => clearTooth(selectedFinding.toothNumber)}
              onClose={() => setSelectedTooth(null)}
            />
          </div>
        </div>
      )}

      {/* Clear-all confirmation */}
      {confirmingClearAll && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Clear all examination data?</h3>
            <p className="mt-1.5 text-sm text-slate-500">
              This permanently deletes every tooth&apos;s findings and general notes for this chart. This cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setConfirmingClearAll(false)}>
                Cancel
              </Button>
              <Button type="button" size="sm" variant="destructive" onClick={handleClearAll}>
                Clear everything
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
