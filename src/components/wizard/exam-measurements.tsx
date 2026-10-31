'use client';

import { useFormContext } from 'react-hook-form';
import { Ruler } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  DentalReportData,
  LATERAL_EXCURSION_OPTIONS,
  ROSTROCAUDAL_EXCURSION_OPTIONS,
  TABLE_ANGLE_OPTIONS,
  TMJ_PAIN_OPTIONS,
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

type AngleKey = 'molarAngleFarside' | 'incisorAngle' | 'molarAngleNearside';

/** Qualitative Flat / Normal / Steep pills plus an optional measured
 * value in degrees for when a gauge was used — before and after. */
function TableAngleBlock({ title, angleKey }: { title: string; angleKey: AngleKey }) {
  const { watch, setValue, register } = useFormContext<DentalReportData>();
  const a = watch(`examMeasurements.${angleKey}`);
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</p>
      {(['before', 'after'] as const).map((phase) => (
        <div key={phase} className="space-y-1.5">
          <Label className="text-xs font-semibold">{phase === 'before' ? 'Before' : 'After'} Dental Work</Label>
          <div className="flex flex-wrap items-center gap-1.5">
            <PillGroup
              options={TABLE_ANGLE_OPTIONS}
              value={a[phase]}
              onChange={(v) => setValue(`examMeasurements.${angleKey}.${phase}`, v)}
            />
            <div className="relative">
              <Input
                type="number"
                min="0"
                max="90"
                step="1"
                inputMode="numeric"
                placeholder="°"
                aria-label={`${title} ${phase} dental work, degrees`}
                className="h-7 w-[64px] pr-5 text-xs"
                {...register(`examMeasurements.${angleKey}.${phase}Degrees`)}
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">°</span>
            </div>
          </div>
        </div>
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

        {/* Table angles — qualitative pill plus optional measured degrees */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TableAngleBlock title="Molar Table Angle (Right)" angleKey="molarAngleFarside" />
          <TableAngleBlock title="Incisor Table Angle" angleKey="incisorAngle" />
          <TableAngleBlock title="Molar Table Angle (Left)" angleKey="molarAngleNearside" />
        </div>

        {/* TMJ pain scale */}
        <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">TMJ Pain Scale</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Right</Label>
              <Select
                value={m.tmjPainFarside}
                onValueChange={(v) => setValue('examMeasurements.tmjPainFarside', v as (typeof TMJ_PAIN_OPTIONS)[number])}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {TMJ_PAIN_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Left</Label>
              <Select
                value={m.tmjPainNearside}
                onValueChange={(v) => setValue('examMeasurements.tmjPainNearside', v as (typeof TMJ_PAIN_OPTIONS)[number])}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {TMJ_PAIN_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
