'use client';

import { useFormContext } from 'react-hook-form';
import { Stethoscope, CalendarClock, ClipboardList, ChevronDown } from 'lucide-react';

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
import { DentalReportData, FOLLOW_UP_OPTIONS, TreatmentPerformed } from '@/lib/types';

function ProceduresDropdown({
  treatments,
  onToggle,
}: {
  treatments: TreatmentPerformed[];
  onToggle: (idx: number) => void;
}) {
  const checkedCount = treatments.filter((t) => t.checked).length;

  return (
    <details className="group rounded-lg border border-slate-200 dark:border-slate-700">
      <summary className="flex h-12 cursor-pointer list-none items-center justify-between rounded-lg px-4 text-base text-slate-700 dark:text-slate-300 [&::-webkit-details-marker]:hidden">
        <span className={checkedCount === 0 ? 'text-slate-400' : ''}>
          {checkedCount === 0 ? 'Select procedures performed' : `${checkedCount} selected`}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="grid grid-cols-1 gap-1 border-t border-slate-200 p-2 sm:grid-cols-2 dark:border-slate-700">
        {treatments.map((t, idx) => (
          <label
            key={t.id}
            className="flex items-center gap-2.5 rounded-md p-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <input
              type="checkbox"
              checked={t.checked}
              onChange={() => onToggle(idx)}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            {t.label}
          </label>
        ))}
      </div>
    </details>
  );
}

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
          <ProceduresDropdown treatments={treatments} onToggle={toggleTreatment} />
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
