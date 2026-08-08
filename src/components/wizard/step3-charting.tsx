'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Bone, Activity, Eye } from 'lucide-react';

import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DentalReportData, ToothRecord } from '@/lib/types';
import { DentalArcadeChart } from './dental-chart-svg';
import { ToothModal } from './tooth-modal';

export function Step3Charting() {
  const { watch, setValue, register } = useFormContext<DentalReportData>();
  const pathologies = watch('pathologies');
  const softTissue = watch('softTissue');
  const teethData = watch('teeth');
  const [selectedToothId, setSelectedToothId] = useState<string | null>(null);

  const saveTooth = (id: string, record: Omit<ToothRecord, 'id'>) => {
    setValue(`teeth.${id}`, { id, ...record });
  };

  const togglePathology = (idx: number) => {
    const current = pathologies[idx];
    setValue(`pathologies.${idx}.checked`, !current.checked);
  };

  const toggleSoftTissue = (idx: number) => {
    const current = softTissue[idx];
    setValue(`softTissue.${idx}.checked`, !current.checked);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Dental Examination Charting
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Tap a tooth to log its status and findings. Toggle whole-horse pathologies below.
        </p>
      </div>

      {/* Dental arcade SVG chart */}
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
        <CardContent>
          <DentalArcadeChart teethData={teethData} onToothClick={setSelectedToothId} />
        </CardContent>
      </Card>

      <ToothModal
        open={selectedToothId !== null}
        toothId={selectedToothId}
        record={selectedToothId ? teethData[selectedToothId] : null}
        onSave={saveTooth}
        onClose={() => setSelectedToothId(null)}
      />

      {/* Pathology toggles */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Common Pathologies</CardTitle>
              <CardDescription>
                Toggle any findings observed during examination
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
            {softTissue.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSoftTissue(idx)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border-2 p-3 text-left text-sm font-medium transition-all active:scale-95 touch-target',
                  s.checked
                    ? s.label.includes('normal')
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-950 dark:text-amber-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                )}
              >
                <div
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                    s.checked
                      ? s.label.includes('normal')
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-amber-500 bg-amber-500 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  )}
                >
                  {s.checked && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="leading-tight">{s.label}</span>
              </button>
            ))}
          </div>
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
