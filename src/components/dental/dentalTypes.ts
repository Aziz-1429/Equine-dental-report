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

/**
 * One charting code. `code` is what is STORED on a tooth / in the report
 * data; `name` is display-only, so the clinic can stop printing names
 * later (see `findingLabel`) without touching any saved data.
 *
 * Codes marked `fromReference` come from the clinic's illustrated
 * reference (Equine Dental Terms, figs 28–57 + additional terms). The
 * others are short clinic codes for findings that reference has no code
 * for; they follow AVDC style but are NOT taken from it.
 */
export interface FindingCode {
  code: string;
  name: string;
  fromReference: boolean;
}

/** Per-tooth lesion vocabulary — the single source for the exam panel
 * checklist, the report, and legacy migration. Kept here (not in
 * dentalData.ts) so `ToothFinding` can reference it without a cycle. */
export const TOOTH_FINDING_CATALOG: FindingCode[] = [
  { code: 'PTS', name: 'Sharp enamel points', fromReference: true },
  { code: 'HK', name: 'Hook', fromReference: true },
  { code: 'RMP', name: 'Ramp', fromReference: true },
  { code: 'STP', name: 'Step', fromReference: true },
  { code: 'WV', name: 'Wave', fromReference: true },
  { code: 'ETR', name: 'Excessive transverse ridges', fromReference: true },
  { code: 'TO', name: 'Overlong tooth / overgrowth', fromReference: true },
  { code: 'CUPD', name: 'Cupped tooth', fromReference: true },
  { code: 'EXP', name: 'Expired tooth', fromReference: true },
  { code: 'EXP/RTR', name: 'Expired tooth with retained roots', fromReference: true },
  { code: 'RD', name: 'Retained deciduous tooth / cap', fromReference: true },
  { code: 'TU', name: 'Unerupted / blind tooth', fromReference: true },
  { code: 'SN', name: 'Supernumerary tooth', fromReference: false },
  { code: 'FX', name: 'Fracture', fromReference: true },
  { code: 'FX/SAG', name: 'Sagittal fracture', fromReference: true },
  { code: 'FX/WDG', name: 'Wedge fracture', fromReference: true },
  { code: 'FX/CHP', name: 'Chip fracture', fromReference: true },
  { code: 'PE', name: 'Pulp exposure', fromReference: false },
  { code: 'MOB', name: 'Mobile tooth', fromReference: false },
  { code: 'RRT', name: 'Retained root tip / fragment', fromReference: true },
  { code: 'RTR', name: 'Retained tooth root', fromReference: true },
  { code: 'AB', name: 'Dental abrasion', fromReference: true },
  { code: 'DIA', name: 'Diastema / feed packing', fromReference: false },
  { code: 'PP', name: 'Periodontal pocket', fromReference: true },
  { code: 'PD', name: 'Periodontal disease', fromReference: true },
  { code: 'INF/CA', name: 'Infundibular caries', fromReference: true },
  { code: 'CA', name: 'Caries (other location)', fromReference: true },
];

/** Codes a tooth can be ticked with, in checklist order. */
export const TOOTH_FINDING_OPTIONS: readonly string[] = TOOTH_FINDING_CATALOG.map((f) => f.code);

const FINDING_BY_CODE = new Map(TOOTH_FINDING_CATALOG.map((f) => [f.code, f]));

/** Whether the report prints "CODE — Name" (now) or just "CODE" (once
 * the team knows the codes). Flip this one flag to drop the names. */
export const SHOW_FINDING_NAMES = true;

/** Display text for a stored finding code. Unknown codes (e.g. free
 * text from a very old draft) are shown as-is. */
export function findingLabel(code: string): string {
  const f = FINDING_BY_CODE.get(code);
  if (!f) return code;
  return SHOW_FINDING_NAMES ? `${f.code} — ${f.name}` : f.code;
}

export const INFUNDIBULAR_CARIES_CODE = 'INF/CA';

/** Infundibular caries grading (0–4) per the clinic's reference image. */
export const INFUNDIBULAR_CARIES_GRADES = [
  { grade: '0', description: 'Normal — no macroscopic infundibular caries visible' },
  { grade: '1', description: 'Only cementum affected' },
  { grade: '2', description: 'Cementum and underlying enamel affected' },
  { grade: '3', description: 'Cementum, enamel and dentine affected' },
  { grade: '4', description: 'Tooth integrity affected (secondary dental fracture present)' },
] as const;

export type InfundibularCariesGrade = (typeof INFUNDIBULAR_CARIES_GRADES)[number]['grade'] | '';

/** The examination record for one tooth. This is the source of truth —
 * the SVG only ever reads from this, never stores exam data itself. */
export interface ToothFinding {
  toothNumber: string;
  examined: boolean;
  status: ToothStatus;
  /** Checklist of finding CODES (from TOOTH_FINDING_CATALOG), never
   * free text — keeps charting consistent across exams/practitioners.
   * This is the ONLY place a tooth-level lesion is named (the status is
   * deliberately coarse), so each lesion has exactly one code. */
  findings: string[];
  /** Required when `findings` includes INF/CA; otherwise ''. */
  infundibularCariesGrade: InfundibularCariesGrade;
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
