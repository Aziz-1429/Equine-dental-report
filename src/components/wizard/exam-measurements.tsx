'use client';

import { useFormContext } from 'react-hook-form';
import { Ruler } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  DentalReportData,
  LATERAL_EXCURSION_OPTIONS,
  ROSTROCAUDAL_EXCURSION_OPTIONS,
  TABLE_ANGLE_OPTIONS,
} from '@/lib/types';

function PillGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(value === option ? ('' as T) : option)}
          className={cn(
            'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors touch-target',
            value === option
              ? 'border-transparent bg-primary text-primary-foreground'
              : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function ExamMeasurementsSection() {
  const { watch, setValue, register } = useFormContext<DentalReportData>();
  const m = watch('examMeasurements');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Ruler className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-lg">Oral Examination Measurements</CardTitle>
            <CardDescription>Left / right excursion, occlusion, table angle, and TMJ pain scale</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lateral / rostro-caudal excursion */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Right Side</p>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Lateral Excursion</Label>
              <PillGroup
                options={LATERAL_EXCURSION_OPTIONS}
                value={m.farside.excursion}
                onChange={(v) => setValue('examMeasurements.farside.excursion', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Post Dental Work</Label>
              <PillGroup
                options={LATERAL_EXCURSION_OPTIONS}
                value={m.farside.postDentalExcursion}
                onChange={(v) => setValue('examMeasurements.farside.postDentalExcursion', v)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Percent of Occlusion</Label>
                <Input
                  placeholder="e.g. 90%"
                  className="h-9 text-sm"
                  {...register('examMeasurements.farside.percentOcclusion')}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Post Dental</Label>
                <Input
                  placeholder="e.g. 95%"
                  className="h-9 text-sm"
                  {...register('examMeasurements.farside.postDentalPercentOcclusion')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Protrusion | Retrusion Movement</p>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Rostro-caudal Excursion</Label>
              <PillGroup
                options={ROSTROCAUDAL_EXCURSION_OPTIONS}
                value={m.rostrocaudalExcursion}
                onChange={(v) => setValue('examMeasurements.rostrocaudalExcursion', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">R/C Post Dental Work</Label>
              <PillGroup
                options={ROSTROCAUDAL_EXCURSION_OPTIONS}
                value={m.postDentalRostrocaudalExcursion}
                onChange={(v) => setValue('examMeasurements.postDentalRostrocaudalExcursion', v)}
              />
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Left Side</p>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Lateral Excursion</Label>
              <PillGroup
                options={LATERAL_EXCURSION_OPTIONS}
                value={m.nearside.excursion}
                onChange={(v) => setValue('examMeasurements.nearside.excursion', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Post Dental Work</Label>
              <PillGroup
                options={LATERAL_EXCURSION_OPTIONS}
                value={m.nearside.postDentalExcursion}
                onChange={(v) => setValue('examMeasurements.nearside.postDentalExcursion', v)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Percent of Occlusion</Label>
                <Input
                  placeholder="e.g. 85%"
                  className="h-9 text-sm"
                  {...register('examMeasurements.nearside.percentOcclusion')}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Post Dental</Label>
                <Input
                  placeholder="e.g. 95%"
                  className="h-9 text-sm"
                  {...register('examMeasurements.nearside.postDentalPercentOcclusion')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table angles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Molar Table Angle (Right)</p>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Before Dental Work</Label>
              <PillGroup
                options={TABLE_ANGLE_OPTIONS}
                value={m.molarAngleFarside.before}
                onChange={(v) => setValue('examMeasurements.molarAngleFarside.before', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">After Dental Work</Label>
              <PillGroup
                options={TABLE_ANGLE_OPTIONS}
                value={m.molarAngleFarside.after}
                onChange={(v) => setValue('examMeasurements.molarAngleFarside.after', v)}
              />
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Incisor Table Angle</p>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Before Dental Work</Label>
              <PillGroup
                options={TABLE_ANGLE_OPTIONS}
                value={m.incisorAngle.before}
                onChange={(v) => setValue('examMeasurements.incisorAngle.before', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">After Dental Work</Label>
              <PillGroup
                options={TABLE_ANGLE_OPTIONS}
                value={m.incisorAngle.after}
                onChange={(v) => setValue('examMeasurements.incisorAngle.after', v)}
              />
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Molar Table Angle (Left)</p>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Before Dental Work</Label>
              <PillGroup
                options={TABLE_ANGLE_OPTIONS}
                value={m.molarAngleNearside.before}
                onChange={(v) => setValue('examMeasurements.molarAngleNearside.before', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">After Dental Work</Label>
              <PillGroup
                options={TABLE_ANGLE_OPTIONS}
                value={m.molarAngleNearside.after}
                onChange={(v) => setValue('examMeasurements.molarAngleNearside.after', v)}
              />
            </div>
          </div>
        </div>

        {/* TMJ pain scale */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">TMJ Pain Scale — Right</Label>
            <Textarea
              placeholder="e.g. None"
              rows={2}
              className="text-sm"
              {...register('examMeasurements.tmjPainFarside')}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">TMJ Pain Scale — Left</Label>
            <Textarea
              placeholder="e.g. None"
              rows={2}
              className="text-sm"
              {...register('examMeasurements.tmjPainNearside')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
