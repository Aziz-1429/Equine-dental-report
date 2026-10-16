'use client';

import { KeyboardEvent } from 'react';
import { ToothFinding, ToothRegion } from './dentalTypes';
import { getStatusOption, toothDomePath, isUpperIncisor } from './dentalData';

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
 * a transparent hit area plus an edge-only status outline. On real
 * anatomical-photo sides the tooth is NEVER filled — the reference
 * artwork underneath must stay fully visible, so examination status is
 * communicated purely by the outline color/style traced along the
 * tooth's own boundary. The schematic (no-photo) incisor grid has no
 * artwork to protect, so it gets a visible tooth-crown silhouette
 * (see `toothDomePath`) instead, with the same edge-only status outline
 * traced along that shape.
 */
export function Tooth({ region, finding, selected, onSelect, hasBackground }: ToothProps) {
  const status = getStatusOption(finding.status);
  const isUntouched = !finding.examined;
  const isBroken = finding.status === 'missing' || finding.status === 'extracted';
  const domePath = !hasBackground ? toothDomePath(region.points, isUpperIncisor(region.toothNumber)) : null;

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

      {/* Interaction layer: the hit area is always the tooth's full
          rectangular bounding box (generous and consistent to tap),
          kept invisible — the visible shape below can be a tighter
          silhouette without shrinking what's actually clickable. */}
      <polygon points={region.points} className="fill-transparent stroke-none" vectorEffect="non-scaling-stroke" />

      {/* Base shape: real-photo sides stay edge-only so the anatomy
          underneath is never obscured. The schematic incisor grid has
          no artwork to protect, so it gets a visible tooth-crown
          silhouette (flat gumline, rounded biting edge) instead of a
          plain box. */}
      {hasBackground ? null : (
        <path
          d={domePath ?? undefined}
          className={
            isUntouched
              ? 'fill-white stroke-slate-300 stroke-2 hover:fill-primary/10'
              : 'fill-white stroke-2'
          }
          vectorEffect="non-scaling-stroke"
        />
      )}

      {/* Highlight layer: edge-only outline, fill="none" always, traced
          along the same shape as the base (artwork outline on
          real-photo sides, tooth-crown silhouette on the schematic
          grid). Only rendered when the tooth has something to show —
          selection or an exam status. */}
      {(selected || !isUntouched) && (
        hasBackground ? (
          <polygon
            points={region.points}
            fill="none"
            className={
              selected
                ? 'stroke-primary drop-shadow-[0_0_4px_rgba(68,23,82,0.6)]'
                : status.strokeClassName
            }
            strokeWidth={selected ? 4 : 2}
            strokeDasharray={!selected && isBroken ? '10 6' : undefined}
            vectorEffect="non-scaling-stroke"
          />
        ) : (
          <path
            d={domePath ?? undefined}
            fill="none"
            className={
              selected
                ? 'stroke-primary drop-shadow-[0_0_4px_rgba(68,23,82,0.6)]'
                : status.strokeClassName
            }
            strokeWidth={selected ? 4 : 2}
            strokeDasharray={!selected && isBroken ? '10 6' : undefined}
            vectorEffect="non-scaling-stroke"
          />
        )
      )}

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
          y={hasBackground ? region.labelY - 26 : region.labelY - 30}
          textAnchor="middle"
          className="pointer-events-none select-none fill-slate-900 text-[20px] font-bold"
          style={{ paintOrder: 'stroke', stroke: '#fff', strokeWidth: 3 }}
        >
          {status.glyph}
        </text>
      )}
    </g>
  );
}
