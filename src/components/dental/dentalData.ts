import {
  DentalChartSide,
  DentalExam,
  ToothFinding,
  ToothStatus,
  ToothStatusOption,
} from './dentalTypes';

/**
 * Examination statuses. This is the single source of truth for the
 * status vocabulary — the <select> in the exam panel, the legend, and
 * each tooth's visual state are all derived from this list, so adding a
 * new status (e.g. "attrition") is a one-line change here, not a UI
 * rewrite.
 *
 * Every status pairs a color with a glyph and a distinct border/fill
 * treatment, so the chart stays legible without relying on hue alone
 * (color-vision-deficiency accessible).
 */
export const TOOTH_STATUS_OPTIONS: ToothStatusOption[] = [
  {
    value: 'normal',
    label: 'Normal',
    glyph: '✓',
    fillClassName: 'fill-emerald-100 stroke-emerald-500',
    swatchClassName: 'bg-emerald-100 border-emerald-500 text-emerald-700',
  },
  {
    value: 'abnormal',
    label: 'Abnormal',
    glyph: '!',
    fillClassName: 'fill-red-100 stroke-red-600',
    swatchClassName: 'bg-red-100 border-red-600 text-red-700',
  },
  {
    value: 'missing',
    label: 'Missing',
    glyph: '×',
    fillClassName: 'fill-slate-200 stroke-slate-400',
    swatchClassName: 'bg-slate-200 border-slate-400 text-slate-600',
  },
  {
    value: 'extracted',
    label: 'Extracted',
    glyph: '⊘',
    fillClassName: 'fill-slate-300 stroke-slate-500',
    swatchClassName: 'bg-slate-300 border-slate-500 text-slate-700',
  },
  {
    value: 'fractured',
    label: 'Fractured',
    glyph: '⚡',
    fillClassName: 'fill-orange-100 stroke-orange-600',
    swatchClassName: 'bg-orange-100 border-orange-600 text-orange-700',
  },
  {
    value: 'caries',
    label: 'Caries',
    glyph: '●',
    fillClassName: 'fill-amber-100 stroke-amber-600',
    swatchClassName: 'bg-amber-100 border-amber-600 text-amber-700',
  },
  {
    value: 'periodontal-disease',
    label: 'Periodontal disease',
    glyph: '◆',
    fillClassName: 'fill-rose-100 stroke-rose-600',
    swatchClassName: 'bg-rose-100 border-rose-600 text-rose-700',
  },
  {
    value: 'eruption-issue',
    label: 'Eruption issue',
    glyph: '↑',
    fillClassName: 'fill-sky-100 stroke-sky-600',
    swatchClassName: 'bg-sky-100 border-sky-600 text-sky-700',
  },
  {
    value: 'malocclusion',
    label: 'Malocclusion (wave/step/ramp)',
    glyph: '~',
    fillClassName: 'fill-violet-100 stroke-violet-600',
    swatchClassName: 'bg-violet-100 border-violet-600 text-violet-700',
  },
  {
    value: 'overgrowth',
    label: 'Overgrowth',
    glyph: '▲',
    fillClassName: 'fill-fuchsia-100 stroke-fuchsia-600',
    swatchClassName: 'bg-fuchsia-100 border-fuchsia-600 text-fuchsia-700',
  },
  {
    value: 'painful',
    label: 'Painful',
    glyph: '✦',
    fillClassName: 'fill-red-200 stroke-red-700',
    swatchClassName: 'bg-red-200 border-red-700 text-red-800',
  },
  {
    value: 'other',
    label: 'Other',
    glyph: '?',
    fillClassName: 'fill-stone-100 stroke-stone-500',
    swatchClassName: 'bg-stone-100 border-stone-500 text-stone-700',
  },
];

export function getStatusOption(status: ToothStatus): ToothStatusOption {
  return TOOTH_STATUS_OPTIONS.find((o) => o.value === status) ?? TOOTH_STATUS_OPTIONS[0];
}

/**
 * Tooth hit-area geometry for the "104–111 / 404–411" reference chart
 * (public/dental-chart/triadan-104-111-side.png, 1536×1024 — the exact
 * asset supplied, an AI-generated raster wrapped in an SVG <image> tag
 * with no real vector paths of its own).
 *
 * ASSUMPTION: since the source has no per-tooth vector data, these
 * polygons were hand-traced by inspecting the image on a pixel grid —
 * they closely hug each tooth's visible outline but are not
 * pixel-perfect auto-traced paths. Tooth 105 and 404/104 are small,
 * thin shapes in the source image; their hit areas are intentionally a
 * little more generous than their visible outline so they stay easily
 * tappable on a tablet.
 */
const SIDE_104_111_REGIONS = [
  { toothNumber: '111', points: '598,398 630,393 655,405 658,460 650,530 638,558 618,555 600,530 592,460', labelX: 623, labelY: 495 },
  { toothNumber: '110', points: '665,398 695,393 722,403 725,465 715,535 700,560 682,555 668,530 662,460', labelX: 693, labelY: 495 },
  { toothNumber: '109', points: '730,405 760,398 795,402 822,415 825,470 815,560 795,635 775,600 755,560 735,470', labelX: 778, labelY: 500 },
  { toothNumber: '108', points: '835,415 860,408 890,415 895,470 890,545 875,650 858,645 840,545 833,470', labelX: 863, labelY: 505 },
  { toothNumber: '107', points: '900,425 925,418 955,422 970,470 968,545 955,655 935,650 915,545 898,470', labelX: 933, labelY: 512 },
  { toothNumber: '106', points: '980,432 1005,425 1035,428 1055,470 1052,545 1038,650 1018,645 998,545 982,470', labelX: 1014, labelY: 520 },
  { toothNumber: '105', points: '1044,628 1064,624 1080,640 1082,678 1072,704 1052,702 1042,676 1040,650', labelX: 1085, labelY: 598 },
  { toothNumber: '104', points: '1192,622 1220,612 1252,624 1258,662 1246,706 1218,718 1196,694 1190,656', labelX: 1234, labelY: 645 },
  { toothNumber: '411', points: '595,608 625,600 658,612 662,680 655,745 635,758 615,745 598,700 590,650', labelX: 623, labelY: 690 },
  { toothNumber: '410', points: '668,608 698,600 730,612 735,690 728,760 710,778 690,760 672,700 662,650', labelX: 697, labelY: 700 },
  { toothNumber: '409', points: '735,615 765,608 798,618 825,650 822,700 808,760 788,790 768,755 748,700 738,650', labelX: 778, labelY: 725 },
  { toothNumber: '408', points: '835,660 860,652 890,658 895,700 888,755 872,780 850,775 835,720', labelX: 862, labelY: 728 },
  { toothNumber: '407', points: '900,670 925,662 955,668 965,700 958,760 940,790 920,782 900,720', labelX: 932, labelY: 736 },
  { toothNumber: '406', points: '975,680 1000,672 1030,678 1050,710 1042,760 1022,790 1000,782 978,730', labelX: 1013, labelY: 745 },
  { toothNumber: '405', points: '1024,690 1046,686 1064,702 1067,730 1056,754 1036,752 1022,726 1020,706', labelX: 1080, labelY: 755 },
  { toothNumber: '404', points: '1190,786 1222,780 1258,796 1262,822 1236,840 1204,832 1190,808', labelX: 1220, labelY: 810 },
];

export const DENTAL_CHART_SIDES: DentalChartSide[] = [
  {
    id: '104-111',
    label: 'Right side — Triadan 104–111 / 404–411',
    backgroundSrc: '/dental-chart/triadan-104-111-side.png',
    viewBoxWidth: 1536,
    viewBoxHeight: 1024,
    regions: SIDE_104_111_REGIONS,
  },
];

export function createEmptyFinding(toothNumber: string): ToothFinding {
  return {
    toothNumber,
    examined: false,
    status: 'normal',
    findings: '',
    treatment: '',
    recommendation: '',
    notes: '',
  };
}

export function createInitialExam(side: DentalChartSide): DentalExam {
  const teeth: Record<string, ToothFinding> = {};
  for (const region of side.regions) {
    teeth[region.toothNumber] = createEmptyFinding(region.toothNumber);
  }
  return { teeth, generalNotes: '' };
}
