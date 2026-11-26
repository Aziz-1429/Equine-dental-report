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
import {
  TOOTH_STATUS_OPTIONS,
  TOOTH_FINDING_CATALOG,
  TOOTH_SEVERITY_OPTIONS,
  INFUNDIBULAR_CARIES_CODE,
  INFUNDIBULAR_CARIES_GRADES,
  findingLabel,
  isWolfTooth,
} from './dentalData';
import { InfundibularCariesGrade, ToothFinding, ToothStatus, ToothSeverity } from './dentalTypes';

/** Checklist of finding CODES. The summary shows the codes that are
 * ticked (e.g. "PTS, HK") so the doctor sees the shorthand every time. */
function FindingsDropdown({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const toggle = (code: string) => {
    onChange(value.includes(code) ? value.filter((v) => v !== code) : [...value, code]);
  };

  return (
    <details className="group rounded-lg border border-slate-200 dark:border-slate-700">
      <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-300 [&::-webkit-details-marker]:hidden">
        <span className={value.length === 0 ? 'text-slate-400' : 'font-semibold'}>
          {value.length === 0 ? 'Select findings' : value.join(', ')}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-0.5 border-t border-slate-200 p-2 dark:border-slate-700">
        {TOOTH_FINDING_CATALOG.map((option) => (
          <label
            key={option.code}
            className="flex items-center gap-2.5 rounded-md p-2 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <input
              type="checkbox"
              checked={value.includes(option.code)}
              onChange={() => toggle(option.code)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="w-16 shrink-0 font-mono text-[11px] font-bold text-primary">{option.code}</span>
            <span>{option.name}</span>
          </label>
        ))}
      </div>
    </details>
  );
}

/** Grade 0–4 picker, shown only when INF/CA is ticked on the tooth. */
function InfundibularCariesGradePicker({
  value,
  onChange,
}: {
  value: InfundibularCariesGrade;
  onChange: (grade: InfundibularCariesGrade) => void;
}) {
  return (
    <div className="space-y-2 rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-900 dark:bg-rose-950/40">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-rose-800 dark:text-rose-300">
          {findingLabel(INFUNDIBULAR_CARIES_CODE)} — Grade
        </Label>
        {!value && <span className="text-[11px] font-medium text-rose-600">Required</span>}
      </div>
      <div className="flex gap-1.5">
        {INFUNDIBULAR_CARIES_GRADES.map((g) => (
          <button
            key={g.grade}
            type="button"
            onClick={() => onChange(g.grade)}
            title={g.description}
            className={cn(
              'h-9 flex-1 rounded-md border text-sm font-bold transition-colors',
              value === g.grade
                ? 'border-transparent bg-rose-600 text-white'
                : 'border-rose-300 bg-white text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300'
            )}
          >
            {g.grade}
          </button>
        ))}
      </div>
      <p className="text-[11px] leading-snug text-rose-700/90 dark:text-rose-400/90">
        {value
          ? INFUNDIBULAR_CARIES_GRADES.find((g) => g.grade === value)?.description
          : '0 normal · 1 cementum · 2 cementum + enamel · 3 cementum, enamel + dentine · 4 tooth integrity affected (secondary fracture)'}
      </p>
    </div>
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
/** Reference code for an unerupted ("blind") wolf tooth. */
const BLIND_WOLF_CODE = 'TU';

export function ToothExamPanel({ finding, onChange, onMarkStatus, onClear, onClose }: ToothExamPanelProps) {
  const isBlindWolf = finding.status !== 'absent' && finding.findings.includes(BLIND_WOLF_CODE);

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
              Not every horse has this tooth — absence is normal, not a pathology. Flag whether it&apos;s erupted, blind
              (unerupted, under the gum — code TU) or not present, and whether it was extracted.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    status: finding.status === 'absent' ? 'normal' : finding.status,
                    findings: finding.findings.filter((f) => f !== BLIND_WOLF_CODE),
                    examined: true,
                  })
                }
                className={cn(
                  'flex-1 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors',
                  finding.status !== 'absent' && !isBlindWolf
                    ? 'border-transparent bg-emerald-600 text-white'
                    : 'border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                )}
              >
                Erupted
              </button>
              <button
                type="button"
                onClick={() =>
                  // A blind wolf tooth is present but unerupted: charted as
                  // abnormal with the reference code TU on the tooth.
                  onChange({
                    status: finding.status === 'extracted' ? 'extracted' : 'abnormal',
                    findings: finding.findings.includes(BLIND_WOLF_CODE)
                      ? finding.findings
                      : [...finding.findings, BLIND_WOLF_CODE],
                    examined: true,
                  })
                }
                className={cn(
                  'flex-1 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors',
                  isBlindWolf
                    ? 'border-transparent bg-amber-600 text-white'
                    : 'border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                )}
              >
                Blind (TU)
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    status: 'absent',
                    findings: finding.findings.filter((f) => f !== BLIND_WOLF_CODE),
                    examined: true,
                  })
                }
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
                    onChange({
                      status:
                        finding.status === 'extracted' ? (isBlindWolf ? 'abnormal' : 'normal') : finding.status,
                      examined: true,
                    })
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
                // grade only makes sense while INF/CA is ticked
                ...(next.includes(INFUNDIBULAR_CARIES_CODE) ? {} : { infundibularCariesGrade: '' as InfundibularCariesGrade }),
                ...(next.length > 0 && finding.status === 'normal' ? { status: 'abnormal' as ToothStatus } : {}),
              })
            }
          />
          {finding.findings.includes(INFUNDIBULAR_CARIES_CODE) && (
            <InfundibularCariesGradePicker
              value={finding.infundibularCariesGrade}
              onChange={(grade) => onChange({ infundibularCariesGrade: grade, examined: true })}
            />
          )}
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
