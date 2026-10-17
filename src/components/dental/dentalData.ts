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
  },
  {
    value: 'abnormal',
    label: 'Abnormal',
    glyph: '!',
  },
  {
    value: 'missing',
    label: 'Missing',
    glyph: '×',
  },
  {
    value: 'extracted',
    label: 'Extracted',
    glyph: '⊘',
  },
  {
    value: 'fractured',
    label: 'Fractured',
    glyph: '⚡',
  },
  {
    value: 'caries',
    label: 'Caries',
    glyph: '●',
  },
  {
    value: 'periodontal-disease',
    label: 'Periodontal disease',
    glyph: '◆',
  },
  {
    value: 'eruption-issue',
    label: 'Eruption issue',
    glyph: '↑',
  },
  {
    value: 'malocclusion',
    label: 'Malocclusion (wave/step/ramp)',
    glyph: '~',
  },
  {
    value: 'overgrowth',
    label: 'Overgrowth',
    glyph: '▲',
  },
  {
    value: 'painful',
    label: 'Painful',
    glyph: '✦',
  },
  {
    value: 'other',
    label: 'Other',
    glyph: '?',
  },
];

export function getStatusOption(status: ToothStatus): ToothStatusOption {
  return TOOTH_STATUS_OPTIONS.find((o) => o.value === status) ?? TOOTH_STATUS_OPTIONS[0];
}

/** The chart's outline color is deliberately simplified to just two
 * colors (plus purple for the currently-selected tooth, handled
 * separately) — green for normal, red for every other status — so the
 * arcade reads at a glance. The SPECIFIC finding is still visible via
 * each status's own glyph; only the outline color is binary. */
export function getOutlineClassName(status: ToothStatus): string {
  return status === 'normal' ? 'stroke-emerald-500' : 'stroke-red-600';
}

export function getOutlineHex(status: ToothStatus): string {
  return status === 'normal' ? '#10b981' : '#dc2626';
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
 * Traced directly from the artwork's own pixel boundaries: a grayscale
 * wall mask (outline strokes = walls), connected-component flood fill
 * from a seed inside each tooth, then contour-extracted and simplified.
 * The lower arcade (404-411) was fully re-verified and re-traced in this
 * pass after a pairwise polygon-overlap check turned up real bugs: 405
 * had been placed over 406's crown instead of its own small distal oval,
 * and 409/410's prior coordinates overlapped each other by ~25% of their
 * area. All eight lower teeth now have zero overlap with one another,
 * confirmed by computing every pairwise intersection area. 111's label
 * position (not its hit-area shape) was also corrected — it previously
 * fell outside its own polygon.
 */
const SIDE_104_111_REGIONS = [
  { toothNumber: '111', points: '599,401 598,416 623,455 639,495 646,543 651,544 650,547 646,547 648,570 655,579 667,584 667,447 647,407 641,404 634,420 625,423 606,403', labelX: 649, labelY: 475 },
  { toothNumber: '110', points: '684,408 703,541 700,541 669,452 669,585 682,589 692,604 704,604 704,558 708,569 709,603 721,614 743,615 764,623 767,543 747,482 737,417 728,411 716,431 708,433 693,412', labelX: 718, labelY: 515 },
  { toothNumber: '109', points: '798,433 792,444 788,470 780,469 772,454 772,540 781,531 772,565 774,622 786,631 815,628 832,636 836,591 823,586 837,586 835,556 829,524 810,482', labelX: 804, labelY: 534 },
  { toothNumber: '108', points: '821,441 842,568 839,634 855,649 881,647 902,653 898,537 892,511 869,473 864,435 854,441 849,458 841,458', labelX: 865, labelY: 553 },
  { toothNumber: '107', points: '898,471 894,488 907,558 911,647 930,661 962,658 973,662 981,642 983,600 963,486 957,479 947,482 944,505 929,511 913,479', labelX: 941, labelY: 574 },
  { toothNumber: '106', points: '995,496 984,507 989,572 986,656 1000,665 1041,666 1049,656 1049,619 1056,590 1055,522 1046,506 1030,501 1029,518 1024,523 1015,523 1009,518 1002,498', labelX: 1020, labelY: 585 },
  { toothNumber: '105', points: '1062,633 1061,643 1060,653 1064,655 1066,654 1069,650 1072,645 1073,636 1072,635 1068,634 1065,633', labelX: 1066, labelY: 643 },
  { toothNumber: '104', points: '1211,624 1209,629 1214,639 1249,675 1257,686 1259,693 1276,700 1279,690 1278,675 1266,653 1250,637 1241,631 1220,623', labelX: 1248, labelY: 658 },
  { toothNumber: '411', points: '631,629 614,668 607,672 607,681 597,696 574,720 580,725 615,725 621,737 620,755 615,762 619,771 628,769 662,730 680,701 695,669 691,663 664,651', labelX: 638, labelY: 698 },
  { toothNumber: '410', points: '702,668 702,680 695,705 688,714 688,724 684,728 683,738 668,767 666,784 671,789 691,766 700,766 702,780 695,794 705,800 726,780 743,757 764,717 773,689 742,682', labelX: 720, labelY: 733 },
  { toothNumber: '409', points: '782,692 775,730 770,735 766,763 762,766 761,777 757,780 749,802 753,808 761,805 780,780 788,780 791,799 786,811 793,815 811,799 829,767 842,732 842,721 845,720 847,706', labelX: 802, labelY: 749 },
  { toothNumber: '408', points: '861,680 854,690 849,740 836,817 839,822 843,822 858,806 866,806 869,826 876,827 891,807 909,765 918,730 921,698 917,691 907,686 884,687 869,680', labelX: 880, labelY: 752 },
  { toothNumber: '407', points: '936,690 924,698 915,821 919,828 925,828 939,808 948,808 952,830 959,834 966,828 975,811 987,777 996,729 996,704 992,698 983,694 954,695', labelX: 956, labelY: 753 },
  { toothNumber: '406', points: '1055,696 1028,698 1013,695 1005,698 1000,704 999,721 1008,795 1014,825 1020,836 1024,836 1029,829 1039,792 1049,794 1058,821 1066,817 1070,807 1075,779 1070,714 1067,703', labelX: 1038, labelY: 750 },
  { toothNumber: '405', points: '1087,731 1088,750 1092,755 1098,755 1105,740 1100,735', labelX: 1095, labelY: 745 },
  { toothNumber: '404', points: '1322,834 1304,828 1290,841 1271,852 1249,858 1230,859 1227,862 1246,868 1281,865 1306,853 1318,842', labelX: 1296, labelY: 847 },
];

/**
 * Tooth hit-area geometry for the "205–211 / 305–311" reference chart
 * (public/dental-chart/triadan-205-211-side.png, 1536×1024 — a
 * full-resolution replacement of the earlier asset, supplied with every
 * Triadan number already correct). Traced directly from the artwork's
 * own pixel boundaries, same wall-mask flood-fill method as the 104-111
 * side. 306-311's root-fork shading used to read as a false interior
 * "wall" to naive contour tracing, cutting the fill off partway down —
 * fixed in this pass by closing that false gap morphologically before
 * tracing, so 306-311 are now precise full-tooth contours (crown and
 * both root prongs), not bounding boxes. 305 (the small wolf-tooth oval)
 * had also been mistraced on top of 306's own crown; it's now at its
 * real, separate location forward of 306, matching the artwork. The
 * canine (204) and its lower counterpart (304) are real clickable
 * regions here, matching 104/404 on the other side. Every pairwise
 * polygon intersection across all 16 teeth on this side was checked and
 * is zero.
 */
const SIDE_205_211_REGIONS = [
  { toothNumber: '204', points: '266,690 230,690 231,714 239,712 232,717 232,723 239,744 245,751 253,741 260,705', labelX: 248, labelY: 720 },
  { toothNumber: '205', points: '383,662 391,662 397,668 397,689 391,695 383,695 377,689 377,668', labelX: 387, labelY: 678 },
  { toothNumber: '206', points: '487,549 479,548 471,553 460,580 452,587 447,585 445,570 440,566 427,568 421,573 413,610 413,673 448,665 487,663 488,625 494,590 493,561', labelX: 453, labelY: 610 },
  { toothNumber: '207', points: '571,515 555,544 546,552 537,547 535,533 531,529 523,529 515,535 495,598 495,662 527,656 570,653', labelX: 533, labelY: 588 },
  { toothNumber: '208', points: '631,475 623,480 605,535 583,571 576,609 574,652 620,647 646,639 646,505 640,499 637,480', labelX: 610, labelY: 563 },
  { toothNumber: '209', points: '704,476 695,486 680,530 665,557 657,593 654,638 673,633 696,632 719,623 719,506 714,510 707,506 707,489 704,487 707,482', labelX: 686, labelY: 557 },
  { toothNumber: '210', points: '777,451 769,452 761,465 755,512 738,553 732,620 762,611 794,606 794,473 786,471 782,457', labelX: 763, labelY: 535 },
  { toothNumber: '211', points: '873,433 868,433 860,442 832,498 812,558 806,604 846,589 861,587 867,582 870,553 868,559 867,553 868,549 872,548 879,522 879,452 875,448', labelX: 842, labelY: 518 },
  { toothNumber: '304', points: '299,840 261,840 248,847 207,858 231,881 247,888 279,894 281,900 275,904 249,905 224,899 201,886 184,867 168,881 202,899 239,909 238,912 203,916 199,919 299,917', labelX: 233, labelY: 879 },
  { toothNumber: '305', points: '396,756 389,759 384,773 385,788 392,796 399,793 402,783 402,765', labelX: 393, labelY: 778 },
  { toothNumber: '306', points: '425,741 415,749 412,774 414,822 421,848 428,861 437,864 444,840 457,839 465,870 471,879 477,880 484,871 492,836 492,746 482,738 459,742', labelX: 452, labelY: 798 },
  { toothNumber: '307', points: '562,732 541,736 511,735 500,740 495,748 508,824 521,857 536,875 543,873 547,859 561,859 571,871 578,871 583,866 572,742', labelX: 539, labelY: 786 },
  { toothNumber: '308', points: '638,721 615,728 589,728 575,738 578,780 590,824 610,862 625,874 631,869 633,857 647,857 660,869 669,869 673,865 657,803 648,728', labelX: 618, labelY: 792 },
  { toothNumber: '309', points: '711,708 689,715 665,715 652,726 658,771 672,813 691,846 707,863 715,858 715,830 729,830 753,854 760,850 759,840 749,829 748,818 730,774 727,741 721,734 723,714', labelX: 702, labelY: 794 },
  { toothNumber: '310', points: '734,705 727,716 737,757 754,793 777,825 811,853 818,842 818,824 832,824 849,837 853,833 852,826 829,784 814,742 811,720 804,715 799,695 789,689 766,700', labelX: 784, labelY: 770 },
  { toothNumber: '311', points: '884,674 857,693 814,714 828,744 852,781 883,815 898,820 899,812 894,803 897,777 915,775 927,782 938,783 941,775 914,744 912,733 906,731 904,717 895,707', labelX: 883, labelY: 760 },
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
