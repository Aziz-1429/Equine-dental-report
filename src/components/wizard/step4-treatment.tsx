'use client';

import { useFormContext } from 'react-hook-form';
import { Stethoscope, CalendarClock, ClipboardList } from 'lucide-react';

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
import { DentalReportData, FOLLOW_UP_OPTIONS } from '@/lib/types';

export function Step4Treatment() {
  const { watch, setValue, register } = useFormContext<DentalReportData>();
  const treatments = watch('treatments');

  const toggleTreatment = (idx: number) => {
    const current = treatments[idx];
    setValue(`treatments.${idx}.checked`, !current.checked);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Treatment &amp; Recommendations
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Record procedures performed and follow-up guidance.
        </p>
      </div>

      {/* Treatments performed */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Stethoscope className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Procedures Performed</CardTitle>
              <CardDescription>Toggle all treatments carried out today</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {treatments.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTreatment(idx)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border-2 p-3 text-left text-sm font-medium transition-all active:scale-95 touch-target',
                  t.checked
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                )}
              >
                <div
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                    t.checked
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-slate-300 dark:border-slate-600'
                  )}
                >
                  {t.checked && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="leading-tight">{t.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Follow-up timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <CalendarClock className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Follow-Up Timeline</CardTitle>
              <CardDescription>When the horse should be re-examined</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Select
            value={watch('followUpTimeline')}
            onValueChange={(v) => setValue('followUpTimeline', v)}
          >
            <SelectTrigger className="h-11 text-sm">
              <SelectValue placeholder="Select a follow-up interval" />
            </SelectTrigger>
            <SelectContent>
              {FOLLOW_UP_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Instructions & recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ClipboardList className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Instructions &amp; Recommendations</CardTitle>
              <CardDescription>Anything else the client should know</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g. Transition to soaked hay pellets due to reduced grinding surface. Recommend re-check of EOTRH progression at next visit..."
            className="min-h-[100px] text-base"
            {...register('additionalNotes')}
          />
        </CardContent>
      </Card>
    </div>
  );
}
