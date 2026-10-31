'use client';

import { useEffect } from 'react';
import { CheckCircle2, ChevronDown, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { TOOTH_STATUS_OPTIONS, TOOTH_FINDING_OPTIONS, TOOTH_SEVERITY_OPTIONS, isWolfTooth } from './dentalData';
import { ToothFinding, ToothStatus, ToothSeverity } from './dentalTypes';

function FindingsDropdown({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const toggle = (option: string) => {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  };

  return (
    <details className="group rounded-lg border border-slate-200 dark:border-slate-700">
      <summary className="flex h-10 cursor-pointer list-none items-center justify-between rounded-lg px-3 text-xs text-slate-700 dark:text-slate-300 [&::-webkit-details-marker]:hidden">
        <span className={value.length === 0 ? 'text-slate-400' : ''}>
          {value.length === 0 ? 'Select findings' : `${value.length} selected`}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-1 border-t border-slate-200 p-2 dark:border-slate-700">
        {TOOTH_FINDING_OPTIONS.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2.5 rounded-md p-2 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => toggle(option)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary"
            />
            {option}
          </label>
        ))}
      </div>
    </details>
  );
}

interface ToothExamPanelProps {
  finding: ToothFinding;
  onChange: (patch: Partial<ToothFinding>) => void;
  onMarkStatus: (status: ToothStatus) => void;
  onClear: () => void;
  onClose: () => void;
}

/**
 * Single-tooth examination form. Desktop/tablet: rendered as a static
 * side panel by the parent page. Mobile: the parent wraps this in a
 * fixed bottom-sheet container (see the `dental-exam` page) — this
 * component itself has no positioning opinion, only the form.
 */
export function ToothExamPanel({ finding, onChange, onMarkStatus, onClear, onClose }: ToothExamPanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tooth {finding.toothNumber}</h3>
          {finding.examined && (
            <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Examined
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close examination panel"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {isWolfTooth(finding.toothNumber) && (
          <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/40">
            <Label className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              Wolf Tooth — Quick Mark
            </Label>
            <p className="text-[11px] leading-snug text-amber-700/80 dark:text-amber-400/80">
              Not every horse has this tooth — absence is normal, not a pathology. Flag whether it&apos;s present, and if so, whether it was extracted.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  onChange({ status: finding.status === 'absent' ? 'normal' : finding.status, examined: true })
                }
                className={cn(
                  'flex-1 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors',
                  finding.status !== 'absent'
                    ? 'border-transparent bg-emerald-600 text-white'
                    : 'border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                )}
              >
                Present
              </button>
              <button
                type="button"
                onClick={() => onChange({ status: 'absent', examined: true })}
                className={cn(
                  'flex-1 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors',
                  finding.status === 'absent'
                    ? 'border-transparent bg-slate-600 text-white'
                    : 'border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                )}
              >
                Not Present
              </button>
            </div>
            {finding.status !== 'absent' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onChange({ status: finding.status === 'extracted' ? 'normal' : finding.status, examined: true })
                  }
                  className={cn(
                    'flex-1 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors',
                    finding.status !== 'extracted'
                      ? 'border-transparent bg-sky-600 text-white'
                      : 'border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                  )}
                >
                  Intact
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ status: 'extracted', examined: true })}
                  className={cn(
                    'flex-1 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors',
                    finding.status === 'extracted'
                      ? 'border-transparent bg-orange-600 text-white'
                      : 'border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                  )}
                >
                  Extracted
                </button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Status</Label>
          <Select value={finding.status} onValueChange={(v) => onChange({ status: v as ToothStatus, examined: true })}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOOTH_STATUS_OPTIONS.map((option) => {
                // Radix's onValueChange only fires when the selected value
                // actually changes, so re-picking the status a tooth
                // already defaults to ('normal', pre-exam) would otherwise
                // never flip `examined` to true. Hook the same events
                // Radix itself treats as "select this item" (mouse click,
                // and Enter/Space while focused) so it fires every time,
                // regardless of whether the value changed.
                const markExamined = () => onChange({ status: option.value, examined: true });
                return (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    onClick={markExamined}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') markExamined();
                    }}
                  >
                    {option.glyph} {option.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Findings</Label>
          <FindingsDropdown
            value={finding.findings}
            onChange={(next) =>
              // Naming a lesion on a tooth that is still "normal" is a
              // contradiction, so ticking the first finding promotes the
              // status to Abnormal automatically (never the other way).
              onChange({
                findings: next,
                examined: true,
                ...(next.length > 0 && finding.status === 'normal' ? { status: 'abnormal' as ToothStatus } : {}),
              })
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Severity</Label>
          <div className="flex gap-2">
            {TOOTH_SEVERITY_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ severity: finding.severity === s ? ('' as ToothSeverity) : s })}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  finding.severity === s
                    ? 'border-transparent bg-primary text-primary-foreground'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Notes</Label>
          <Textarea
            value={finding.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            rows={2}
            placeholder="Additional notes..."
            className="text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="button" size="sm" variant="outline" onClick={() => onMarkStatus('normal')}>
            Mark as Normal
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => onMarkStatus('abnormal')}>
            Mark as Abnormal
          </Button>
          <Button type="button" size="sm" variant="ghost" className="text-destructive" onClick={onClear}>
            Clear Examination
          </Button>
        </div>
      </div>

      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <Button type="button" className="w-full" onClick={onClose}>
          Save &amp; Close
        </Button>
        {finding.updatedAt && (
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Last updated {new Date(finding.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}
