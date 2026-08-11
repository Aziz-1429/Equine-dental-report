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
 * Specific findings a tooth can be checked off with, independent of its
 * overall status. Reference: Floyd MR, "The Modified Triadan System:
 * Nomenclature for Veterinary Dentistry," J Vet Dent 1991;8(4):18-19.
 */
export const TOOTH_FINDING_OPTIONS = [
  'Excessive Transverse Ridges (ETR)',
  'Sharp Enamel Points',
  'Hook',
  'Ramp',
  'Step Mouth',
  'Wave Mouth',
  'Periodontal Pocket',
  'Diastema / Feed Packing',
  'Fracture',
  'Missing Tooth',
] as const;

export const TOOTH_SEVERITY_OPTIONS = ['Mild', 'Moderate', 'Severe'] as const;

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

/**
 * Tooth hit-area geometry for the "205–211 / 305–311" reference chart
 * (public/dental-chart/triadan-205-211-side.png, 1536×1024 — same kind
 * of asset as the other side: an SVG wrapping a single AI-generated
 * raster with no vector tooth data, hand-traced the same way).
 *
 * ASSUMPTION — label correction: the raster image itself has three
 * mislabeled teeth (a generation artifact in the source art, not
 * something introduced here):
 *   - the premolar before the purple molars is printed "202", which
 *     would be an incisor and can't be in this position — corrected to
 *     208, continuing 206, 207 in sequence.
 *   - the first purple molar is printed "205", duplicating the wolf
 *     tooth's label a few millimeters away — corrected to 209.
 *   - the first purple mandibular molar is printed "319", which isn't
 *     a valid Triadan number (max is 311) — corrected to 309.
 * Every other tooth in this image is printed correctly and used as-is.
 * The image also repeats "104"/"304" as anatomical landmarks near the
 * canine gap; those are omitted here since tooth 104 is already a
 * region on the 104–111 side and duplicating it under a second chart
 * side would create two independent hit areas writing to the same
 * exam record.
 */
const SIDE_205_211_REGIONS = [
  { toothNumber: '205', points: '410,655 428,650 442,665 444,695 432,712 415,708 408,680', labelX: 470, labelY: 665 },
  { toothNumber: '206', points: '450,545 480,538 515,558 518,610 508,648 490,652 468,648 448,610 445,570', labelX: 483, labelY: 595 },
  { toothNumber: '207', points: '525,535 555,528 592,538 596,600 588,640 570,648 548,645 528,605 524,565', labelX: 560, labelY: 590 },
  { toothNumber: '208', points: '600,525 628,518 662,528 668,595 660,638 642,648 618,645 602,600 598,560', labelX: 634, labelY: 585 },
  { toothNumber: '209', points: '678,468 705,460 738,468 748,530 745,600 735,645 715,650 692,610 680,540', labelX: 713, labelY: 555 },
  { toothNumber: '210', points: '748,455 778,448 808,462 815,530 810,598 798,642 775,648 755,600 748,530', labelX: 781, labelY: 550 },
  { toothNumber: '211', points: '818,442 850,432 888,445 905,470 900,540 888,610 865,655 838,648 820,590 815,510', labelX: 858, labelY: 545 },
  { toothNumber: '305', points: '440,758 460,752 468,775 465,805 450,812 435,798 436,772', labelX: 405, labelY: 800 },
  { toothNumber: '306', points: '450,755 480,748 515,758 520,805 512,842 492,850 468,845 448,805 446,775', labelX: 483, labelY: 800 },
  { toothNumber: '307', points: '525,752 558,748 592,758 596,802 588,842 568,850 545,845 527,802 524,770', labelX: 560, labelY: 798 },
  { toothNumber: '308', points: '600,752 630,748 665,758 670,802 662,845 642,850 618,845 602,800 598,770', labelX: 634, labelY: 798 },
  { toothNumber: '309', points: '678,745 708,742 742,752 748,800 742,845 722,858 698,850 680,802 676,770', labelX: 712, labelY: 800 },
  { toothNumber: '310', points: '748,740 780,735 812,748 818,800 812,845 792,855 768,848 750,800 746,762', labelX: 781, labelY: 798 },
  { toothNumber: '311', points: '818,730 852,722 888,735 908,760 902,810 892,845 868,855 842,848 822,795 815,755', labelX: 860, labelY: 790 },
];

/**
 * Incisors (101–103, 201–203, 301–303, 401–403) have no photographic
 * reference — neither supplied chart image shows them, both are
 * cheek-teeth lateral views. Rendered as a plain schematic grid (no
 * background image) rather than guessing at anatomy that was never
 * provided, laid out in the standard charting convention: right side
 * then left side, left-to-right as the practitioner faces the horse.
 */
const INCISOR_BOX = { w: 90, h: 110 };
function incisorRegion(toothNumber: string, col: number, row: 0 | 1): { toothNumber: string; points: string; labelX: number; labelY: number } {
  const gap = col >= 3 ? 40 : 0; // extra gap at the midline (between quadrants)
  const x = col * (INCISOR_BOX.w + 10) + gap;
  const y = row * (INCISOR_BOX.h + 20) + 20;
  const { w, h } = INCISOR_BOX;
  return {
    toothNumber,
    points: `${x},${y} ${x + w},${y} ${x + w},${y + h} ${x},${y + h}`,
    labelX: x + w / 2,
    labelY: y + h / 2,
  };
}
const INCISOR_REGIONS = [
  incisorRegion('103', 0, 0), incisorRegion('102', 1, 0), incisorRegion('101', 2, 0),
  incisorRegion('201', 3, 0), incisorRegion('202', 4, 0), incisorRegion('203', 5, 0),
  incisorRegion('403', 0, 1), incisorRegion('402', 1, 1), incisorRegion('401', 2, 1),
  incisorRegion('301', 3, 1), incisorRegion('302', 4, 1), incisorRegion('303', 5, 1),
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
  {
    id: '205-211',
    label: 'Left side — Triadan 205–211 / 305–311',
    backgroundSrc: '/dental-chart/triadan-205-211-side.png',
    viewBoxWidth: 1536,
    viewBoxHeight: 1024,
    regions: SIDE_205_211_REGIONS,
  },
  {
    id: 'incisors',
    label: 'Incisors — Triadan 101–103 / 201–203 / 301–303 / 401–403',
    backgroundSrc: '',
    viewBoxWidth: 650,
    viewBoxHeight: 280,
    regions: INCISOR_REGIONS,
  },
];

export function createEmptyFinding(toothNumber: string): ToothFinding {
  return {
    toothNumber,
    examined: false,
    status: 'normal',
    findings: [],
    severity: '',
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
