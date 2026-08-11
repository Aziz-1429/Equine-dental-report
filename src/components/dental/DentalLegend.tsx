import { TOOTH_STATUS_OPTIONS } from './dentalData';

/**
 * Status legend. Fully data-driven from TOOTH_STATUS_OPTIONS — adding a
 * status there automatically adds it here, no changes needed in this
 * file.
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
        {TOOTH_STATUS_OPTIONS.map((option) => (
          <span
            key={option.value}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${option.swatchClassName}`}
          >
            <span className="w-3 text-center font-bold">{option.glyph}</span>
            {option.label}
          </span>
        ))}
      </div>
    </div>
  );
}
