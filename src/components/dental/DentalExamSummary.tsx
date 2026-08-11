import { DentalChartSide, DentalExam } from './dentalTypes';
import { getStatusOption } from './dentalData';

interface DentalExamSummaryProps {
  side: DentalChartSide;
  exam: DentalExam;
}

/**
 * Examined/normal/abnormal counts, computed live from the exam data and
 * the actual number of teeth in this chart side — never hard-coded.
 */
export function DentalExamSummary({ side, exam }: DentalExamSummaryProps) {
  const total = side.regions.length;
  const findings = side.regions.map((r) => exam.teeth[r.toothNumber]).filter(Boolean);
  const examined = findings.filter((f) => f.examined).length;
  const abnormal = findings.filter((f) => f.examined && f.status !== 'normal' && f.status !== 'missing' && f.status !== 'extracted').length;
  const missing = findings.filter((f) => f.examined && (f.status === 'missing' || f.status === 'extracted')).length;
  const normal = findings.filter((f) => f.examined && f.status === 'normal').length;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <SummaryStat label="Examined" value={`${examined} / ${total}`} />
      <SummaryStat label={getStatusOption('normal').label} value={normal} tone="emerald" />
      <SummaryStat label="Abnormal findings" value={abnormal} tone="red" />
      <SummaryStat label="Missing / extracted" value={missing} tone="slate" />
    </div>
  );
}

function SummaryStat({
  label,
  value,
  tone = 'primary',
}: {
  label: string;
  value: string | number;
  tone?: 'primary' | 'emerald' | 'red' | 'slate';
}) {
  const toneClass = {
    primary: 'text-primary',
    emerald: 'text-emerald-600',
    red: 'text-red-600',
    slate: 'text-slate-500',
  }[tone];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-0.5 text-xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}
