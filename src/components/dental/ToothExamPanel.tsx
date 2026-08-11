'use client';

import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

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
import { TOOTH_STATUS_OPTIONS } from './dentalData';
import { ToothFinding, ToothStatus } from './dentalTypes';

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
    <div className="flex h-full flex-col">
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
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Status</Label>
          <Select value={finding.status} onValueChange={(v) => onChange({ status: v as ToothStatus, examined: true })}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOOTH_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.glyph} {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Findings</Label>
          <Textarea
            value={finding.findings}
            onChange={(e) => onChange({ findings: e.target.value })}
            rows={2}
            placeholder="Clinical findings for this tooth..."
            className="text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Treatment</Label>
          <Textarea
            value={finding.treatment}
            onChange={(e) => onChange({ treatment: e.target.value })}
            rows={2}
            placeholder="Treatment performed, if any..."
            className="text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Recommendation</Label>
          <Textarea
            value={finding.recommendation}
            onChange={(e) => onChange({ recommendation: e.target.value })}
            rows={2}
            placeholder="Follow-up recommendation..."
            className="text-sm"
          />
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
