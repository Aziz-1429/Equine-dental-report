'use client';

import { useFormContext } from 'react-hook-form';
import { Info, Ruler } from 'lucide-react';

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

/**
 * Clinician-facing helper text, shown on screen only (never printed in
 * the report). Collapsed by default behind an ⓘ so the form stays
 * compact for experienced users.
 */
function Hint({ children }: { children: React.ReactNode }) {
  return (
    <details className="group">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-primary [&::-webkit-details-marker]:hidden">
        <Info className="h-3 w-3" /> How to assess
      </summary>
      <div className="mt-1.5 rounded-md border border-sky-100 bg-sky-50 p-2.5 text-[11px] leading-relaxed text-slate-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-slate-300">
        {children}
      </div>
    </details>
  );
}

const HINTS = {
  lateral: (
    <>
      Head level, mouth closed. Slide the mandible to one side until the cheek teeth first touch and the incisors begin
      to separate. <b>Smooth</b> — glides evenly. <b>Step</b> — catches or jumps (uneven arcade / overgrowth).{' '}
      <b>Mouth opens to slide</b> — incisors must separate before the molars meet (overlong incisors). Compare both
      sides; asymmetry matters more than the absolute value.
    </>
  ),
  occlusion: (
    <>
      How far the mandible slides before the cheek teeth make contact, relative to what is normal for this horse.
      Record it the same way before and after floating so the change is visible. (In the literature this is
      measured as a distance — mean ≈ 12 mm, range 4–30 mm.)
    </>
  ),
  rostrocaudal: (
    <>
      Mouth closed, flex and extend the poll: the mandible should glide forward and back a few millimetres freely.{' '}
      <b>Reduced</b> — restricted glide. <b>Painful</b> — resentment or TMJ discomfort on movement.
    </>
  ),
  table: (
    <>
      Angle of the cheek-tooth occlusal surface relative to horizontal (≈ 10–15° upper, steeper lower).{' '}
      <b>Flat</b> — worn level, poor grinding. <b>Steep</b> — exaggerated, shear-mouth tendency. Incisor angle is judged
      in profile.
    </>
  ),
  tmj: (
    <>
      Firm digital pressure over each temporomandibular joint and along the masseter; grade the horse&apos;s reaction.
    </>
  ),
};

/** Qualitative Flat / Normal / Steep pills, before and after. */
function TableAngleBlock({ title, angleKey }: { title: string; angleKey: AngleKey }) {
  const { watch, setValue } = useFormContext<DentalReportData>();
  const a = watch(`examMeasurements.${angleKey}`);
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</p>
      {(['before', 'after'] as const).map((phase) => (
        <div key={phase} className="space-y-1.5">
          <Label className="text-xs font-semibold">{phase === 'before' ? 'Before' : 'After'} Dental Work</Label>
          <PillGroup
            options={TABLE_ANGLE_OPTIONS}
            value={a[phase]}
            onChange={(v) => setValue(`examMeasurements.${angleKey}.${phase}`, v)}
          />
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
              <Hint>{HINTS.lateral}</Hint>
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
            <Hint>{HINTS.occlusion}</Hint>
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
              <Hint>{HINTS.rostrocaudal}</Hint>
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
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TableAngleBlock title="Molar Table Angle (Right)" angleKey="molarAngleFarside" />
            <TableAngleBlock title="Incisor Table Angle" angleKey="incisorAngle" />
            <TableAngleBlock title="Molar Table Angle (Left)" angleKey="molarAngleNearside" />
          </div>
          <Hint>{HINTS.table}</Hint>
        </div>

        {/* TMJ pain scale */}
        <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">TMJ Pain Scale</p>
          <Hint>{HINTS.tmj}</Hint>
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
