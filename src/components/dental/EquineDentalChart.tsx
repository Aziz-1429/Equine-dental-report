'use client';

import { DentalChartSide, DentalExam } from './dentalTypes';
import { createEmptyFinding } from './dentalData';
import { Tooth } from './Tooth';

interface EquineDentalChartProps {
  side: DentalChartSide;
  exam: DentalExam;
  selectedTooth: string | null;
  onSelectTooth: (toothNumber: string) => void;
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
 */
export function EquineDentalChart({ side, exam, selectedTooth, onSelectTooth }: EquineDentalChartProps) {
  return (
    <svg
      viewBox={`0 0 ${side.viewBoxWidth} ${side.viewBoxHeight}`}
      className="h-auto w-full select-none"
      role="group"
      aria-label={side.label}
    >
      <image
        href={side.backgroundSrc}
        x={0}
        y={0}
        width={side.viewBoxWidth}
        height={side.viewBoxHeight}
        preserveAspectRatio="xMidYMid meet"
      />

      {side.regions.map((region) => (
        <Tooth
          key={region.toothNumber}
          region={region}
          finding={exam.teeth[region.toothNumber] ?? createEmptyFinding(region.toothNumber)}
          selected={selectedTooth === region.toothNumber}
          onSelect={onSelectTooth}
        />
      ))}
    </svg>
  );
}
