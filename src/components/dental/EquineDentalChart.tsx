'use client';

import { DentalChartSide, DentalExam } from './dentalTypes';
import { createEmptyFinding, INCISOR_MIDLINE_X } from './dentalData';
import { Tooth } from './Tooth';

interface EquineDentalChartProps {
  side: DentalChartSide;
  exam: DentalExam;
  selectedTooth: string | null;
  onSelectTooth: (toothNumber: string) => void;
  /** Verification overlay: draws every tooth's hit-area boundary and
   * Triadan number at once, regardless of exam status, so alignment
   * against the underlying artwork can be checked tooth by tooth. */
  showAllOutlines?: boolean;
}

/**
 * Renders the supplied anatomical reference image as a background layer
 * and overlays one clickable SVG region per tooth on top of it. The
 * image itself is never redrawn or altered — only precise transparent
 * hit areas are added over it, each addressable as `#tooth-{number}`.
 *
 * `viewBox` matches the reference image's native pixel size, so every
 * tooth region's coordinates are defined once, in the image's own
 * coordinate space, and scale correctly at any rendered size.
 *
 * A side may have no `backgroundSrc` (e.g. incisors, for which no
 * reference photo was supplied) — in that case the chart falls back to
 * a plain schematic grid so teeth stay visible and clickable without
 * anatomy that was never provided.
 */
export function EquineDentalChart({
  side,
  exam,
  selectedTooth,
  onSelectTooth,
  showAllOutlines = false,
}: EquineDentalChartProps) {
  const hasBackground = Boolean(side.backgroundSrc);

  return (
    <svg
      viewBox={`0 0 ${side.viewBoxWidth} ${side.viewBoxHeight}`}
      className="h-auto w-full select-none"
      role="group"
      aria-label={side.label}
    >
      {hasBackground ? (
        <image
          href={side.backgroundSrc}
          x={0}
          y={0}
          width={side.viewBoxWidth}
          height={side.viewBoxHeight}
          preserveAspectRatio="xMidYMid meet"
        />
      ) : (
        <>
          <rect
            x={0}
            y={0}
            width={side.viewBoxWidth}
            height={side.viewBoxHeight}
            className="fill-slate-50"
          />
          {/* Midline between the right and left incisor quadrants,
              matching the clinic's printed exam form. */}
          <line
            x1={INCISOR_MIDLINE_X}
            y1={0}
            x2={INCISOR_MIDLINE_X}
            y2={side.viewBoxHeight}
            className="stroke-red-500"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}

      {side.regions.map((region) => (
        <Tooth
          key={region.toothNumber}
          region={region}
          finding={exam.teeth[region.toothNumber] ?? createEmptyFinding(region.toothNumber)}
          selected={selectedTooth === region.toothNumber}
          onSelect={onSelectTooth}
          hasBackground={hasBackground}
        />
      ))}

      {showAllOutlines && (
        <g pointerEvents="none">
          {side.regions.map((region) => (
            <g key={`verify-${region.toothNumber}`}>
              <polygon
                points={region.points}
                fill="none"
                stroke="#2563eb"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={region.labelX}
                y={region.labelY}
                textAnchor="middle"
                fill="#2563eb"
                className="text-[16px] font-bold"
                style={{ paintOrder: 'stroke', stroke: '#fff', strokeWidth: 2.5 }}
              >
                {region.toothNumber}
              </text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
