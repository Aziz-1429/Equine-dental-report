'use client';

import { useEffect, useState } from 'react';
import { X, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  ToothRecord,
  ToothStatus,
  ToothSeverity,
  TOOTH_FINDING_OPTIONS,
  TOOTH_SEVERITY_OPTIONS,
  toothType,
} from '@/lib/types';

const STATUS_OPTIONS: { value: ToothStatus; label: string; dot: string }[] = [
  { value: 'normal', label: 'Normal', dot: 'bg-slate-300' },
  { value: 'attention', label: 'Attention', dot: 'bg-amber-500' },
  { value: 'pathology', label: 'Pathology', dot: 'bg-red-500' },
  { value: 'absent', label: 'Absent', dot: 'bg-slate-500' },
];

export interface ToothModalProps {
  open: boolean;
  toothId: string | null;
  record: ToothRecord | null;
  onSave: (toothId: string, record: Omit<ToothRecord, 'id'>) => void;
  onClose: () => void;
}

export function ToothModal({ open, toothId, record, onSave, onClose }: ToothModalProps) {
  const [status, setStatus] = useState<ToothStatus>('normal');
  const [findings, setFindings] = useState<string[]>([]);
  const [severity, setSeverity] = useState<ToothSeverity>('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) {
      setStatus(record?.status ?? 'normal');
      setFindings(record?.findings ?? []);
      setSeverity(record?.severity ?? '');
      setNote(record?.note ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, toothId]);

  if (!open || !toothId) return null;

  const toggleFinding = (f: string) => {
    setFindings((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const handleSave = () => {
    onSave(toothId, { status, findings, severity, note });
    onClose();
  };

  const handleClear = () => {
    setStatus('normal');
    setFindings([]);
    setSeverity('');
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white shadow-xl dark:bg-slate-900">
        <div className="flex items-center justify-between rounded-t-xl bg-primary px-5 py-4">
          <div>
            <h3 className="text-lg font-bold leading-tight text-primary-foreground">
              Tooth {toothId}
            </h3>
            <p className="text-xs text-primary-foreground/70">{toothType(toothId)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-primary-foreground/80 hover:text-primary-foreground"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
                    status === s.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full', s.dot)} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Findings
            </label>
            <div className="grid grid-cols-1 gap-2">
              {TOOTH_FINDING_OPTIONS.map((f) => (
                <label
                  key={f}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <input
                    type="checkbox"
                    checked={findings.includes(f)}
                    onChange={() => toggleFinding(f)}
                    className="h-4 w-4 accent-primary"
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Severity
            </label>
            <div className="flex gap-2">
              {TOOTH_SEVERITY_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(severity === s ? '' : s)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    severity === s
                      ? 'border-transparent bg-primary text-primary-foreground'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Clinical note
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Additional observations for this tooth..."
              className="text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 dark:border-slate-800">
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-destructive"
          >
            <Trash2 size={14} /> Clear
          </button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save finding
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
