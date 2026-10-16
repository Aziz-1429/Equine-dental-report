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
    strokeClassName: 'stroke-emerald-500',
    swatchClassName: 'bg-emerald-100 border-emerald-500 text-emerald-700',
    hex: '#10b981',
  },
  {
    value: 'abnormal',
    label: 'Abnormal',
    glyph: '!',
    strokeClassName: 'stroke-red-600',
    swatchClassName: 'bg-red-100 border-red-600 text-red-700',
    hex: '#dc2626',
  },
  {
    value: 'missing',
    label: 'Missing',
    glyph: '×',
    strokeClassName: 'stroke-slate-400',
    swatchClassName: 'bg-slate-200 border-slate-400 text-slate-600',
    hex: '#94a3b8',
  },
  {
    value: 'extracted',
    label: 'Extracted',
    glyph: '⊘',
    strokeClassName: 'stroke-slate-500',
    swatchClassName: 'bg-slate-300 border-slate-500 text-slate-700',
    hex: '#64748b',
  },
  {
    value: 'fractured',
    label: 'Fractured',
    glyph: '⚡',
    strokeClassName: 'stroke-orange-600',
    swatchClassName: 'bg-orange-100 border-orange-600 text-orange-700',
    hex: '#ea580c',
  },
  {
    value: 'caries',
    label: 'Caries',
    glyph: '●',
    strokeClassName: 'stroke-amber-600',
    swatchClassName: 'bg-amber-100 border-amber-600 text-amber-700',
    hex: '#d97706',
  },
  {
    value: 'periodontal-disease',
    label: 'Periodontal disease',
    glyph: '◆',
    strokeClassName: 'stroke-rose-600',
    swatchClassName: 'bg-rose-100 border-rose-600 text-rose-700',
    hex: '#e11d48',
  },
  {
    value: 'eruption-issue',
    label: 'Eruption issue',
    glyph: '↑',
    strokeClassName: 'stroke-sky-600',
    swatchClassName: 'bg-sky-100 border-sky-600 text-sky-700',
    hex: '#0284c7',
  },
  {
    value: 'malocclusion',
    label: 'Malocclusion (wave/step/ramp)',
    glyph: '~',
    strokeClassName: 'stroke-violet-600',
    swatchClassName: 'bg-violet-100 border-violet-600 text-violet-700',
    hex: '#7c3aed',
  },
  {
    value: 'overgrowth',
    label: 'Overgrowth',
    glyph: '▲',
    strokeClassName: 'stroke-fuchsia-600',
    swatchClassName: 'bg-fuchsia-100 border-fuchsia-600 text-fuchsia-700',
    hex: '#c026d3',
  },
  {
    value: 'painful',
    label: 'Painful',
    glyph: '✦',
    strokeClassName: 'stroke-red-700',
    swatchClassName: 'bg-red-200 border-red-700 text-red-800',
    hex: '#b91c1c',
  },
  {
    value: 'other',
    label: 'Other',
    glyph: '?',
    strokeClassName: 'stroke-stone-500',
    swatchClassName: 'bg-stone-100 border-stone-500 text-stone-700',
    hex: '#78716c',
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
 * Traced directly from the artwork's own pixel boundaries (flood-filled
 * from inside each tooth's drawn outline, contour-extracted, then
 * simplified) rather than hand-eyeballed, so each hit area hugs its
 * tooth's actual silhouette instead of an approximate box. A handful of
 * teeth whose boundary gap connects to open background (111/110/109/409
 * and the row-end molars) were corrected by direct pixel-grid reading
 * against the source image instead, since flood fill alone couldn't
 * resolve them. Tooth 105/104/404 are small, thin shapes in the source
 * image; their hit areas stay close to the visible outline.
 */
const SIDE_104_111_REGIONS = [
  { toothNumber: '111', points: '599,401 598,416 623,455 639,495 646,543 651,544 650,547 646,547 648,570 655,579 667,584 667,447 647,407 641,404 634,420 625,423 606,403', labelX: 632, labelY: 492 },
  { toothNumber: '110', points: '684,408 703,541 700,541 669,452 669,585 682,589 692,604 704,604 704,558 708,569 709,603 721,614 743,615 764,623 767,543 747,482 737,417 728,411 716,431 708,433 693,412', labelX: 718, labelY: 515 },
  { toothNumber: '109', points: '798,433 792,444 788,470 780,469 772,454 772,540 781,531 772,565 774,622 786,631 815,628 832,636 836,591 823,586 837,586 835,556 829,524 810,482', labelX: 804, labelY: 534 },
  { toothNumber: '108', points: '821,441 842,568 839,634 855,649 881,647 902,653 898,537 892,511 869,473 864,435 854,441 849,458 841,458', labelX: 865, labelY: 553 },
  { toothNumber: '107', points: '898,471 894,488 907,558 911,647 930,661 962,658 973,662 981,642 983,600 963,486 957,479 947,482 944,505 929,511 913,479', labelX: 941, labelY: 574 },
  { toothNumber: '106', points: '995,496 984,507 989,572 986,656 1000,665 1041,666 1049,656 1049,619 1056,590 1055,522 1046,506 1030,501 1029,518 1024,523 1015,523 1009,518 1002,498', labelX: 1020, labelY: 585 },
  { toothNumber: '105', points: '1062,633 1061,643 1060,653 1064,655 1066,654 1069,650 1072,645 1073,636 1072,635 1068,634 1065,633', labelX: 1066, labelY: 643 },
  { toothNumber: '104', points: '1211,624 1209,629 1214,639 1249,675 1257,686 1259,693 1276,700 1279,690 1278,675 1266,653 1250,637 1241,631 1220,623', labelX: 1248, labelY: 658 },
  { toothNumber: '411', points: '641,606 633,608 600,694 575,719 586,724 598,717 608,717 625,729 623,756 633,755 647,743 702,649 695,640 657,621', labelX: 643, labelY: 678 },
  { toothNumber: '410', points: '714,643 706,649 667,758 667,776 671,779 688,757 696,757 698,788 717,776 736,753 759,708 768,676 768,666 762,659 732,653', labelX: 718, labelY: 712 },
  { toothNumber: '409', points: '748,618 790,600 825,600 820,650 810,700 800,740 800,790 765,755 730,785 718,740 715,700 725,660', labelX: 770, labelY: 695 },
  { toothNumber: '408', points: '848,675 843,679 840,690 834,761 826,798 830,801 841,789 849,789 859,808 887,755 895,730 898,701 894,684', labelX: 862, labelY: 735 },
  { toothNumber: '407', points: '908,684 903,687 907,727 897,790 902,800 911,805 923,788 932,788 937,805 942,807 951,796 961,764 968,726 969,696 959,687 932,688', labelX: 933, labelY: 741 },
  { toothNumber: '406', points: '980,688 975,697 991,801 997,809 1004,792 1005,771 1013,762 1025,763 1032,794 1039,784 1044,756 1037,720 1038,699 1025,691', labelX: 1009, labelY: 736 },
  { toothNumber: '405', points: '976,692 975,697 976,712 1021,713 1037,711 1038,699 1034,694 1030,692 999,691 985,688 980,688', labelX: 1005, labelY: 702 },
  { toothNumber: '404', points: '1288,817 1273,812 1268,819 1255,830 1237,835 1201,840 1214,843 1230,843 1253,838 1277,829 1286,822', labelX: 1254, labelY: 830 },
];

/**
 * Tooth hit-area geometry for the "205–211 / 305–311" reference chart
 * (public/dental-chart/triadan-205-211-side.png, 1536×1024 — same kind
 * of asset as the other side: an SVG wrapping a single AI-generated
 * raster with no vector tooth data, traced the same way — see the
 * 104-111 side's comment above for how).
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
  { toothNumber: '205', points: '436,698 436,706 438,712 439,716 442,722 444,723 446,721 448,720 448,707 447,697 440,697', labelX: 442, labelY: 709 },
  { toothNumber: '206', points: '518,561 506,565 501,585 490,595 481,592 480,577 477,573 459,577 449,592 449,662 458,689 463,689 458,693 459,726 462,734 472,734 482,729 504,731 515,727 521,720 519,681 504,680 519,677 521,639 527,606 527,569', labelX: 488, labelY: 647 },
  { toothNumber: '207', points: '551,540 545,552 541,580 531,603 528,618 528,676 596,672 599,643 599,540 590,558 581,568 574,568 569,561 569,540', labelX: 563, labelY: 608 },
  { toothNumber: '208', points: '645,490 641,493 641,513 636,535 616,570 611,586 600,671 628,668 671,656 673,610 681,565 681,504 672,518 666,521 661,516 655,500', labelX: 640, labelY: 580 },
  { toothNumber: '209', points: '751,495 742,503 730,527 722,523 721,506 717,495 707,497 702,534 682,578 682,654 739,635 745,540 752,504', labelX: 717, labelY: 574 },
  { toothNumber: '210', points: '819,495 768,495 767,529 758,558 758,630 804,624 819,520', labelX: 788, labelY: 562 },
  { toothNumber: '211', points: '901,495 849,495 820,567 820,621 848,609 865,606 876,548 888,517', labelX: 860, labelY: 558 },
  { toothNumber: '305', points: '440,779 439,780 439,790 442,789 444,788 447,787 450,786 452,786 452,784 451,779 449,778', labelX: 446, labelY: 784 },
  { toothNumber: '306', points: '473,759 467,766 464,837 476,856 482,832 489,827 500,829 505,839 507,866 514,879 520,881 530,814 530,760 523,755', labelX: 499, labelY: 804 },
  { toothNumber: '307', points: '600,752 545,754 537,762 538,782 552,849 568,879 572,876 577,858 586,858 598,878 603,876 606,868 602,807 605,757', labelX: 574, labelY: 808 },
  { toothNumber: '308', points: '663,741 643,749 619,751 609,772 610,796 619,828 640,867 651,879 656,875 660,858 668,858 678,872 685,868 673,819 669,807 671,807 669,759', labelX: 645, labelY: 806 },
  { toothNumber: '309', points: '679,735 672,743 677,780 716,860 729,872 726,843 735,842 751,862 764,866 765,858 743,813 733,734 725,728', labelX: 715, labelY: 792 },
  { toothNumber: '310', points: '812,734 773,751 744,758 778,825 797,846 814,859 816,849 813,827 816,823 827,827 827,775', labelX: 785, labelY: 796 },
  { toothNumber: '311', points: '883,690 851,714 819,731 861,799 882,823 889,825 892,819 884,805 888,795 905,783 926,792 935,791 938,785 908,753 899,733 887,690', labelX: 878, labelY: 757 },
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

/** X position of the midline divider between the right and left
 * incisor quadrants, matching the clinic's printed exam form. */
export const INCISOR_MIDLINE_X = 3 * (INCISOR_BOX.w + 10) + 20;

/** True for upper-arcade incisors (101-103/201-203), whose gumline is
 * at the top of their box; false for lower-arcade ones (301-303/401-403),
 * whose gumline is at the bottom — the reference exam form draws each
 * row as a proper tooth silhouette (flat at the gum, a gentle rounded
 * point at the biting edge) rather than a plain box. */
export function isUpperIncisor(toothNumber: string): boolean {
  return toothNumber[0] === '1' || toothNumber[0] === '2';
}

interface ToothDomeGeometry {
  corner1: [number, number];
  corner2: [number, number];
  curveStart: [number, number];
  curveEnd: [number, number];
  controlPoint: [number, number];
}

function toothDomeGeometry(points: string, upper: boolean): ToothDomeGeometry {
  const coords = points
    .trim()
    .split(/\s+/)
    .map((p) => p.split(',').map(Number));
  const xs = coords.map((c) => c[0]);
  const ys = coords.map((c) => c[1]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  const w = x1 - x0;
  const h = y1 - y0;
  const taper = w * 0.18;
  const midX = x0 + w / 2;

  return upper
    ? {
        corner1: [x0, y0],
        corner2: [x1, y0],
        curveStart: [x1 - taper, y0 + h * 0.78],
        curveEnd: [x0 + taper, y0 + h * 0.78],
        controlPoint: [midX, y1 + h * 0.08],
      }
    : {
        corner1: [x0, y1],
        corner2: [x1, y1],
        curveStart: [x1 - taper, y0 + h * 0.22],
        curveEnd: [x0 + taper, y0 + h * 0.22],
        controlPoint: [midX, y0 - h * 0.08],
      };
}

/** Builds a simple tooth-crown silhouette (flat gumline, gently rounded
 * biting edge) from a region's rectangular bounding box, so the
 * schematic incisor grid reads as actual teeth instead of plain boxes. */
export function toothDomePath(points: string, upper: boolean): string {
  const { corner1, corner2, curveStart, curveEnd, controlPoint } = toothDomeGeometry(points, upper);
  return `M ${corner1[0]},${corner1[1]} L ${corner2[0]},${corner2[1]} L ${curveStart[0]},${curveStart[1]} Q ${controlPoint[0]},${controlPoint[1]} ${curveEnd[0]},${curveEnd[1]} Z`;
}

/** Same tooth-crown silhouette as `toothDomePath`, but as a sampled
 * point list — for consumers (like the PDF's jsPDF vector drawing)
 * that can't render an SVG quadratic-curve path string directly. */
export function toothDomePoints(points: string, upper: boolean, curveSteps = 8): [number, number][] {
  const { corner1, corner2, curveStart, curveEnd, controlPoint } = toothDomeGeometry(points, upper);
  const curvePoints: [number, number][] = [];
  for (let i = 0; i <= curveSteps; i++) {
    const t = i / curveSteps;
    const x = (1 - t) ** 2 * curveStart[0] + 2 * (1 - t) * t * controlPoint[0] + t ** 2 * curveEnd[0];
    const y = (1 - t) ** 2 * curveStart[1] + 2 * (1 - t) * t * controlPoint[1] + t ** 2 * curveEnd[1];
    curvePoints.push([x, y]);
  }
  return [corner1, corner2, ...curvePoints];
}

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

/**
 * Wolf teeth (first premolars) are naturally absent in a large share of
 * horses — charting needs a fast way to flag "never had one" versus
 * "had one, removed this exam" without digging through the full status
 * list. See ToothExamPanel's quick-mark block.
 */
export const WOLF_TOOTH_NUMBERS = ['105', '205', '305', '405'] as const;

export function isWolfTooth(toothNumber: string): boolean {
  return (WOLF_TOOTH_NUMBERS as readonly string[]).includes(toothNumber);
}

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
