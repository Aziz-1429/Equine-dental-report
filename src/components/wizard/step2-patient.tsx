'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Heart, Syringe, Plus, Trash2, ClipboardList, Activity, ChevronDown } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
  HORSE_BREEDS,
  SEX_OPTIONS,
  BCS_OPTIONS,
  HORSE_COLOR_OPTIONS,
  SEDATION_DRUGS,
  HISTORY_OPTIONS,
  NERVE_BLOCK_OPTIONS,
  NERVE_BLOCK_SIDE_OPTIONS,
  LOCAL_ANESTHETIC_DRUGS,
  NerveBlockSide,
} from '@/lib/types';

function HistoryDropdown({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const toggle = (option: string) => {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  };

  return (
    <details className="group rounded-lg border border-slate-200 dark:border-slate-700">
      <summary className="flex h-12 cursor-pointer list-none items-center justify-between rounded-lg px-4 text-base text-slate-700 dark:text-slate-300 [&::-webkit-details-marker]:hidden">
        <span className={value.length === 0 ? 'text-slate-400' : ''}>
          {value.length === 0 ? 'Select presenting signs' : `${value.length} selected`}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-1 border-t border-slate-200 p-2 dark:border-slate-700">
        {HISTORY_OPTIONS.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2.5 rounded-md p-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => toggle(option)}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            {option}
          </label>
        ))}
      </div>
    </details>
  );
}

export function Step2Patient() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DentalReportData>();

  const sedationUsed = watch('sedationUsed');
  const nerveBlockUsed = watch('nerveBlockUsed');
  const history = watch('history');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sedationDrugs',
  });

  const addDrug = () => {
    append({ id: `sed-${Date.now()}`, drug: '', dose: '' });
  };

  const {
    fields: blockFields,
    append: appendBlock,
    remove: removeBlock,
  } = useFieldArray({
    control,
    name: 'nerveBlocks',
  });

  const addBlock = () => {
    appendBlock({ id: `block-${Date.now()}`, block: '', side: '', drug: 'Lidocaine', volume: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Patient Information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Horse details and sedation record for the examination.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Heart className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Horse Details</CardTitle>
              <CardDescription>Basic patient information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="horseName" className="text-sm font-semibold">
                Horse Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="horseName"
                placeholder="e.g. Thunder"
                className="h-12 text-base"
                {...register('horseName', { required: 'Horse name is required' })}
              />
              {errors.horseName && (
                <p className="text-sm text-destructive">{errors.horseName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-semibold">
                Age (years)
              </Label>
              <Input
                id="age"
                type="number"
                min="0"
                placeholder="e.g. 8"
                className="h-12 text-base"
                {...register('age')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="horseCode" className="text-sm font-semibold">
                Horse Code
              </Label>
              <Input
                id="horseCode"
                placeholder="e.g. EQ-2024-017"
                className="h-12 text-base"
                {...register('horseCode')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weightKg" className="text-sm font-semibold">
                Weight (kg)
              </Label>
              <Input
                id="weightKg"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                placeholder="e.g. 450 (estimated or weighed)"
                className="h-12 text-base"
                {...register('weightKg')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Breed</Label>
              <Select
                value={watch('breed')}
                onValueChange={(v) => setValue('breed', v)}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select breed" />
                </SelectTrigger>
                <SelectContent>
                  {HORSE_BREEDS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Sex</Label>
              <Select
                value={watch('sex')}
                onValueChange={(v) => setValue('sex', v)}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  {SEX_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Body Condition Score</Label>
              <Select
                value={watch('bodyConditionScore')}
                onValueChange={(v) => setValue('bodyConditionScore', v)}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select BCS (1–9)" />
                </SelectTrigger>
                <SelectContent>
                  {BCS_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Color</Label>
              <Select
                value={watch('color')}
                onValueChange={(v) => setValue('color', v)}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {HORSE_COLOR_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ClipboardList className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">History</CardTitle>
              <CardDescription>Presenting signs reported by the owner</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <HistoryDropdown value={history} onChange={(next) => setValue('history', next)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Syringe className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Sedation Record</CardTitle>
              <CardDescription>Drugs administered for the examination</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <button
            type="button"
            onClick={() => setValue('sedationUsed', !sedationUsed)}
            className={cn(
              'flex w-full items-center justify-between rounded-lg border-2 p-4 text-left transition-all touch-target',
              sedationUsed
                ? 'border-primary bg-primary/5'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
            )}
          >
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Sedation used during exam
              </p>
              <p className="text-xs text-slate-500">Toggle on if the horse was sedated</p>
            </div>
            <div
              className={cn(
                'relative h-7 w-12 shrink-0 rounded-full transition-colors',
                sedationUsed ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
              )}
            >
              <div
                className={cn(
                  'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
                  sedationUsed ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </div>
          </button>

          {sedationUsed && (
            <div className="space-y-4">
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Drug {idx + 1}
                    </p>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(idx)}
                        className="h-8 text-slate-400 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Drug</Label>
                      <Select
                        value={watch(`sedationDrugs.${idx}.drug`)}
                        onValueChange={(v) => setValue(`sedationDrugs.${idx}.drug`, v)}
                      >
                        <SelectTrigger className="h-11 text-sm">
                          <SelectValue placeholder="Select drug" />
                        </SelectTrigger>
                        <SelectContent>
                          {SEDATION_DRUGS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Dose</Label>
                      <Input
                        placeholder="e.g. 0.5 mL"
                        className="h-11 text-sm"
                        {...register(`sedationDrugs.${idx}.dose`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addDrug}
                className="w-full touch-target"
              >
                <Plus className="mr-1.5 h-4 w-4" /> Add Another Drug
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Nerve Block</CardTitle>
              <CardDescription>Local anesthesia administered for the examination</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <button
            type="button"
            onClick={() => setValue('nerveBlockUsed', !nerveBlockUsed)}
            className={cn(
              'flex w-full items-center justify-between rounded-lg border-2 p-4 text-left transition-all touch-target',
              nerveBlockUsed
                ? 'border-primary bg-primary/5'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
            )}
          >
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Nerve block used during exam
              </p>
              <p className="text-xs text-slate-500">Toggle on if a local block was performed</p>
            </div>
            <div
              className={cn(
                'relative h-7 w-12 shrink-0 rounded-full transition-colors',
                nerveBlockUsed ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
              )}
            >
              <div
                className={cn(
                  'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
                  nerveBlockUsed ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </div>
          </button>

          {nerveBlockUsed && (
            <div className="space-y-4">
              {blockFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Block {idx + 1}
                    </p>
                    {blockFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBlock(idx)}
                        className="h-8 text-slate-400 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Block</Label>
                      <Select
                        value={watch(`nerveBlocks.${idx}.block`)}
                        onValueChange={(v) => setValue(`nerveBlocks.${idx}.block`, v)}
                      >
                        <SelectTrigger className="h-11 text-sm">
                          <SelectValue placeholder="Select block" />
                        </SelectTrigger>
                        <SelectContent>
                          {NERVE_BLOCK_OPTIONS.map((b) => (
                            <SelectItem key={b} value={b}>
                              {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Side</Label>
                      <Select
                        value={watch(`nerveBlocks.${idx}.side`)}
                        onValueChange={(v) => setValue(`nerveBlocks.${idx}.side`, v as NerveBlockSide)}
                      >
                        <SelectTrigger className="h-11 text-sm">
                          <SelectValue placeholder="Left / Right" />
                        </SelectTrigger>
                        <SelectContent>
                          {NERVE_BLOCK_SIDE_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Drug</Label>
                      <Select
                        value={watch(`nerveBlocks.${idx}.drug`)}
                        onValueChange={(v) => setValue(`nerveBlocks.${idx}.drug`, v)}
                      >
                        <SelectTrigger className="h-11 text-sm">
                          <SelectValue placeholder="Select drug" />
                        </SelectTrigger>
                        <SelectContent>
                          {LOCAL_ANESTHETIC_DRUGS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Volume (mL)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        inputMode="decimal"
                        placeholder="e.g. 5"
                        className="h-11 text-sm"
                        {...register(`nerveBlocks.${idx}.volume`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addBlock}
                className="w-full touch-target"
              >
                <Plus className="mr-1.5 h-4 w-4" /> Add Another Block
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
