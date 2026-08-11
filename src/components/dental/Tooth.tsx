'use client';

import { KeyboardEvent } from 'react';
import { ToothFinding, ToothRegion } from './dentalTypes';
import { getStatusOption } from './dentalData';

interface ToothProps {
  region: ToothRegion;
  finding: ToothFinding;
  selected: boolean;
  onSelect: (toothNumber: string) => void;
  /** False for schematic (no reference photo) sides, e.g. incisors —
   * those need a permanently visible box outline and number since
   * there's no underlying image to show either. */
  hasBackground: boolean;
}

/**
 * One tooth's clickable SVG region: `<g id="tooth-{number}">` containing
 * a polygon hit area plus its Triadan label. Purely presentational —
 * reads the finding it's given, never holds exam state itself.
 */
export function Tooth({ region, finding, selected, onSelect, hasBackground }: ToothProps) {
  const status = getStatusOption(finding.status);
  const isUntouched = !finding.examined;

  const handleKeyDown = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(region.toothNumber);
    }
  };

  return (
    <g
      id={`tooth-${region.toothNumber}`}
      role="button"
      tabIndex={0}
      aria-label={
        isUntouched
          ? `Tooth ${region.toothNumber} — not yet examined. Click to examine.`
          : `Tooth ${region.toothNumber} — ${status.label}. Click to edit.`
      }
      aria-pressed={selected}
      onClick={() => onSelect(region.toothNumber)}
      onKeyDown={handleKeyDown}
      className="cursor-pointer outline-none"
    >
      <title>{`Tooth ${region.toothNumber} — Click to examine`}</title>

      <polygon
        points={region.points}
        className={[
          'transition-colors duration-150',
          // fill: reflects examined status, independent of selection
          isUntouched
            ? hasBackground
              ? 'fill-transparent hover:fill-primary/10'
              : 'fill-white hover:fill-primary/10'
            : `${status.fillClassName} fill-opacity-55`,
          // stroke: selection always wins over the untouched/examined state,
          // so the two never compete for the same CSS property
          selected
            ? 'stroke-[5px] stroke-primary drop-shadow-[0_0_6px_rgba(68,23,82,0.55)]'
            : isUntouched
              ? hasBackground
                ? 'stroke-transparent hover:stroke-primary/40 stroke-2'
                : 'stroke-slate-300 hover:stroke-primary/40 stroke-2'
              : 'stroke-2',
        ]
          .filter(Boolean)
          .join(' ')}
        strokeDasharray={finding.status === 'missing' || finding.status === 'extracted' ? '10 6' : undefined}
        vectorEffect="non-scaling-stroke"
      />

      {/* On schematic (no-image) charts there's no baked-in tooth number
          to rely on, so the number is always drawn. */}
      {!hasBackground && (
        <text
          x={region.labelX}
          y={region.labelY + (isUntouched ? 6 : -6)}
          textAnchor="middle"
          className="pointer-events-none select-none fill-slate-700 text-[26px] font-bold"
        >
          {region.toothNumber}
        </text>
      )}

      {/* Non-color status glyph — keeps the chart legible for
          color-vision-deficient users without relying on hue alone. */}
      {!isUntouched && (
        <text
          x={region.labelX}
          y={hasBackground ? region.labelY - 26 : region.labelY + 26}
          textAnchor="middle"
          className="pointer-events-none select-none fill-slate-700 text-[22px] font-bold"
        >
          {status.glyph}
        </text>
      )}
    </g>
  );
}
