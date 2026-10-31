'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Bone, Activity, Eye, Camera } from 'lucide-react';

import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DentalReportData, ToothFinding, ToothStatus } from '@/lib/types';

const SOFT_TISSUE_CATEGORIES = [
  { label: 'Cheeks', normalIdx: 0, abnormalIdx: 1 },
  { label: 'Tongue', normalIdx: 2, abnormalIdx: 3 },
  { label: 'Palate', normalIdx: 4, abnormalIdx: 5 },
  { label: 'Gingiva', normalIdx: 6, abnormalIdx: 7 },
] as const;

const SOFT_TISSUE_UNSET = '__unset__';
import { EquineDentalChart } from '@/components/dental/EquineDentalChart';
import { ToothExamPanel } from '@/components/dental/ToothExamPanel';
import { DentalLegend } from '@/components/dental/DentalLegend';
import { DENTAL_CHART_SIDES, createEmptyFinding } from '@/components/dental/dentalData';
import { ExamMeasurementsSection } from './exam-measurements';
import { PhotoUpload } from './photo-upload';

export function Step3Charting() {
  const { watch, setValue, register } = useFormContext<DentalReportData>();
  const pathologies = watch('pathologies');
  const softTissue = watch('softTissue');
  const teethData = watch('teeth');
  const photos = watch('photos');
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);

  const selectedFinding = selectedTooth ? teethData[selectedTooth] ?? createEmptyFinding(selectedTooth) : null;

  const updateTooth = (toothNumber: string, patch: Partial<ToothFinding>) => {
    const current = teethData[toothNumber] ?? createEmptyFinding(toothNumber);
    setValue(`teeth.${toothNumber}`, {
      ...current,
      ...patch,
      toothNumber,
      updatedAt: new Date().toISOString(),
    });
  };

  const setToothStatus = (toothNumber: string, status: ToothStatus) => {
    updateTooth(toothNumber, { status, examined: true });
  };

  const clearTooth = (toothNumber: string) => {
    setValue(`teeth.${toothNumber}`, createEmptyFinding(toothNumber));
  };

  const togglePathology = (idx: number) => {
    const current = pathologies[idx];
    setValue(`pathologies.${idx}.checked`, !current.checked);
  };

  const setSoftTissueCategory = (normalIdx: number, abnormalIdx: number, value: string) => {
    setValue(`softTissue.${normalIdx}.checked`, value === softTissue[normalIdx].label);
    setValue(`softTissue.${abnormalIdx}.checked`, value === softTissue[abnormalIdx].label);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Dental Examination Charting
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Tap a tooth to log its status and findings. Whole-mouth (arcade-level) findings are below.
        </p>
      </div>

      {/* Dental arcade chart — real anatomical reference for cheek teeth,
          schematic grid for incisors (no reference photo supplied) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Bone className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Dental Arcade Chart</CardTitle>
              <CardDescription>
                Modified Triadan — tap any tooth to log status, findings, severity, and notes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <DentalLegend />
          {DENTAL_CHART_SIDES.map((side) => (
            <div key={side.id} className="space-y-1.5">
              <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400">
                {side.label}
              </p>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <EquineDentalChart
                  side={side}
                  exam={{ teeth: teethData, generalNotes: '' }}
                  selectedTooth={selectedTooth}
                  onSelectTooth={setSelectedTooth}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedFinding && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
          <div className="flex h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl dark:bg-slate-900 sm:h-auto sm:max-h-[90vh] sm:max-w-md sm:rounded-xl">
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

      <ExamMeasurementsSection />

      {/* Pathology toggles */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Whole-Mouth Findings</CardTitle>
              <CardDescription>
                Arcade-level conditions only — anything on a single tooth is charted on that tooth above
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {pathologies.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePathology(idx)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border-2 p-3 text-left text-sm font-medium transition-all active:scale-95 touch-target',
                  p.checked
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                )}
              >
                <div
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                    p.checked
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-slate-300 dark:border-slate-600'
                  )}
                >
                  {p.checked && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="leading-tight">{p.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Soft tissue evaluation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Eye className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Soft Tissue Evaluation</CardTitle>
              <CardDescription>
                Cheeks, tongue, palate, and gingiva assessment
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SOFT_TISSUE_CATEGORIES.map(({ label, normalIdx, abnormalIdx }) => {
              const normal = softTissue[normalIdx];
              const abnormal = softTissue[abnormalIdx];
              const current = normal.checked ? normal.label : abnormal.checked ? abnormal.label : SOFT_TISSUE_UNSET;
              return (
                <div key={label} className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">{label}</label>
                  <Select
                    value={current}
                    onValueChange={(v) => setSoftTissueCategory(normalIdx, abnormalIdx, v)}
                  >
                    <SelectTrigger
                      className={cn(
                        'h-11 text-sm',
                        normal.checked && 'border-emerald-500 text-emerald-700 dark:text-emerald-400',
                        abnormal.checked && 'border-amber-500 text-amber-700 dark:text-amber-400'
                      )}
                    >
                      <SelectValue placeholder="Not evaluated" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SOFT_TISSUE_UNSET}>Not evaluated</SelectItem>
                      <SelectItem value={normal.label}>{normal.label}</SelectItem>
                      <SelectItem value={abnormal.label}>{abnormal.label}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Clinical photographs */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Clinical Photographs</CardTitle>
              <CardDescription>
                Intra-oral or facial photos to include in the report — add a caption and link to a tooth
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PhotoUpload photos={photos} onChange={(next) => setValue('photos', next, { shouldDirty: true })} />
        </CardContent>
      </Card>

      {/* Charting notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Charting Notes</CardTitle>
          <CardDescription>Additional observations from the examination</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g. Grade 2 wave mouth affecting 106-108 and 206-208. Sharp enamel points on buccal edges of upper arcades..."
            className="min-h-[120px] text-base"
            {...register('chartingNotes')}
          />
        </CardContent>
      </Card>
    </div>
  );
}
