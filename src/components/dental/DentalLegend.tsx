import { TOOTH_STATUS_OPTIONS } from './dentalData';

/**
 * Status legend. The chart's outline color is deliberately simplified to
 * green (normal), red (any other status), and purple (selected) so the
 * arcade reads at a glance — so the legend's swatches follow that same
 * two-color scheme rather than each status's own distinct color, with
 * the glyph still identifying the specific finding.
 */
export function DentalLegend() {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Legend</p>
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
          <span className="h-2.5 w-2.5 rounded-full border border-slate-300" />
          Not examined
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-primary bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-primary" />
          Selected
        </span>
        {TOOTH_STATUS_OPTIONS.map((option) => (
          <span
            key={option.value}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
              option.value === 'normal'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-red-600 bg-red-50 text-red-700'
            }`}
          >
            <span className="w-3 text-center font-bold">{option.glyph}</span>
            {option.label}
          </span>
        ))}
      </div>
    </div>
  );
}
