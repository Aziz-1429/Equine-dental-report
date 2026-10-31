/**
 * Data model for the equine dental exam chart. Kept independent of any
 * rendering concern (SVG, React, etc.) so it can be persisted to
 * localStorage today and swapped for a database-backed API later without
 * touching the chart UI.
 */

/** A single selectable examination status. Data-driven, not hard-coded
 * into components — add/remove/reorder entries in `dentalData.ts` and
 * every component (legend, select, visual state) picks it up. */
/**
 * Status answers only two questions — is the tooth present, and is it
 * normal. *What* is wrong lives in the multi-select `findings` list, so a
 * tooth that is fractured AND carious can be recorded faithfully. "Not
 * examined" is `examined: false`, not a status. Legacy values (fractured,
 * caries, …) are migrated in lib/storage.ts.
 */
export type ToothStatus = 'normal' | 'abnormal' | 'absent' | 'extracted';

export interface ToothStatusOption {
  value: ToothStatus;
  label: string;
  /** Short glyph/symbol shown on the chart as a non-color indicator
   * (accessibility: distinguishable without relying on hue alone). */
  glyph: string;
  /** Tailwind class for this status's own outline stroke / legend
   * border — each status gets a visually distinct color so the chart
   * reads at a glance which specific finding a tooth has, not just
   * normal-vs-not. Outline only, never a fill, so the underlying
   * anatomical artwork stays fully visible. */
  strokeClassName: string;
  /** Tailwind classes for the legend swatch / badge (border + bg + text). */
  swatchClassName: string;
  /** Same color as a hex string, for the PDF's direct vector drawing
   * (jsPDF draws its own lines — it can't read Tailwind classes). */
  hex: string;
}

export type ToothSeverity = 'Mild' | 'Moderate' | 'Severe' | '';

/** Canonical per-tooth lesion vocabulary — the single source for the exam
 * panel checklist, the report, and legacy migration. Kept here (not in
 * dentalData.ts) so `ToothFinding` can reference it without a cycle. */
export const TOOTH_FINDING_OPTIONS = [
  'Sharp enamel points',
  'Hook',
  'Ramp',
  'Step',
  'Wave',
  'Excessive transverse ridges (ETR)',
  'Overgrowth',
  'Retained deciduous cap',
  'Cap fragment',
  'Impacted / delayed eruption',
  'Supernumerary',
  'Fracture',
  'Pulp exposure',
  'Mobile tooth',
  'Diastema / feed packing',
  'Periodontal pocket',
  'Caries — infundibular',
  'Caries — peripheral',
] as const;

export type ToothFindingLabel = (typeof TOOTH_FINDING_OPTIONS)[number];

/** The examination record for one tooth. This is the source of truth —
 * the SVG only ever reads from this, never stores exam data itself. */
export interface ToothFinding {
  toothNumber: string;
  examined: boolean;
  status: ToothStatus;
  /** Checklist of specific findings (from TOOTH_FINDING_OPTIONS), not
   * free text — keeps charting consistent across exams/practitioners.
   * This is the ONLY place a tooth-level lesion is named (the status is
   * deliberately coarse), so each lesion has exactly one spelling. */
  findings: string[];
  severity: ToothSeverity;
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
