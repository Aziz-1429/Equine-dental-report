/**
 * Data model for the equine dental exam chart. Kept independent of any
 * rendering concern (SVG, React, etc.) so it can be persisted to
 * localStorage today and swapped for a database-backed API later without
 * touching the chart UI.
 */

/** A single selectable examination status. Data-driven, not hard-coded
 * into components — add/remove/reorder entries in `dentalData.ts` and
 * every component (legend, select, visual state) picks it up. */
export type ToothStatus =
  | 'normal'
  | 'abnormal'
  | 'missing'
  | 'extracted'
  | 'fractured'
  | 'caries'
  | 'periodontal-disease'
  | 'eruption-issue'
  | 'malocclusion'
  | 'overgrowth'
  | 'painful'
  | 'other';

export interface ToothStatusOption {
  value: ToothStatus;
  label: string;
  /** Short glyph/symbol shown on the chart as a non-color indicator
   * (accessibility: distinguishable without relying on hue alone). */
  glyph: string;
  /** Tailwind classes for the tooth fill when this status is active. */
  fillClassName: string;
  /** Tailwind classes for the legend swatch / badge. */
  swatchClassName: string;
}

/** The examination record for one tooth. This is the source of truth —
 * the SVG only ever reads from this, never stores exam data itself. */
export interface ToothFinding {
  toothNumber: string;
  examined: boolean;
  status: ToothStatus;
  findings: string;
  treatment: string;
  recommendation: string;
  notes: string;
  updatedAt?: string;
}

export interface DentalExam {
  teeth: Record<string, ToothFinding>;
  generalNotes: string;
}

/** Geometry for one tooth's clickable region on the chart, expressed in
 * the background image's own coordinate space (the SVG's viewBox), so it
 * never depends on screen pixels and stays correct at any render size. */
export interface ToothRegion {
  toothNumber: string;
  /** Polygon points hugging the tooth's visible outline in the reference
   * image, as "x,y x,y ..." — used as an SVG <polygon> hit area. */
  points: string;
  /** Where to center the tooth-number label. */
  labelX: number;
  labelY: number;
}

/** One anatomical side/quadrant-pair of the chart (its background image
 * plus the tooth regions traced against it). Lets a second side be added
 * later without touching chart logic. */
export interface DentalChartSide {
  id: string;
  label: string;
  backgroundSrc: string;
  viewBoxWidth: number;
  viewBoxHeight: number;
  regions: ToothRegion[];
}
