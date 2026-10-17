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
 * Traced directly from the artwork's own pixel boundaries: a neutral-
 * color (low-saturation, excluding the purple fill) wall mask, flood
 * filled per tooth from a seed, with crown/root components merged
 * across the diagonal interdental line (never treated as a tooth
 * boundary, per spec) via a small local closing before contour
 * extraction. All 8 upper teeth (111-104) were fully re-traced in this
 * pass — the previous polygons were full of real cross-tooth overlap
 * (confirmed visually and by pairwise intersection area). 105/405 are
 * small isolated ovals; 104/404 are open hook/sickle-shaped canines
 * with no simple flood-fillable interior, traced by unioning their two
 * enclosed sub-regions (loop + shaft) with a local bridge. Every
 * pairwise polygon intersection across all 16 teeth on this side is
 * zero.
 */
const SIDE_104_111_REGIONS = [
  { toothNumber: '111', points: '600,392 596,396 597,404 623,458 637,505 647,582 655,590 678,596 696,610 705,611 708,607 707,571 700,523 685,473 662,417 647,395 639,395 636,411 629,415 609,396', labelX: 652, labelY: 487 },
  { toothNumber: '110', points: '689,403 685,411 706,529 710,563 710,609 716,617 728,623 748,621 764,629 771,629 776,624 773,529 766,500 752,470 743,418 738,411 731,409 725,415 722,429 715,432 698,407', labelX: 731, labelY: 508 },
  { toothNumber: '109', points: '765,432 762,434 776,531 778,575 803,585 779,579 778,625 784,633 800,643 826,641 839,647 848,647 854,639 853,549 847,518 831,483 816,439 805,433 801,439 801,456 797,462 791,462 775,439', labelX: 804, labelY: 534 },
  { toothNumber: '108', points: '839,442 838,457 859,564 858,642 873,656 894,654 919,662 926,653 927,579 917,524 900,492 883,439 878,437 875,440 871,458 866,464 861,463 844,443', labelX: 879, labelY: 526 },
  { toothNumber: '107', points: '921,469 916,476 916,490 931,579 929,655 947,669 973,665 991,671 997,670 1004,660 1006,592 993,492 986,483 979,482 969,504 958,508 948,499 934,474', labelX: 961, labelY: 557 },
  { toothNumber: '106', points: '1017,496 1010,504 1007,518 1011,592 1008,664 1024,674 1054,670 1074,675 1080,668 1090,579 1090,527 1081,511 1068,508 1059,524 1049,529 1041,521 1031,500', labelX: 1046, labelY: 568 },
  { toothNumber: '105', points: '1102,620 1095,623 1092,635 1093,660 1097,665 1104,661 1109,643 1108,628', labelX: 1100, labelY: 641 },
  { toothNumber: '104', points: '1250,607 1240,616 1239,632 1268,667 1278,690 1285,727 1291,736 1295,736 1304,715 1308,691 1302,652 1293,633 1279,616 1264,607', labelX: 1278, labelY: 666 },
  { toothNumber: '411', points: '631,629 614,668 607,672 607,681 597,696 574,720 580,725 615,725 621,737 620,755 615,762 619,771 628,769 662,730 680,701 695,669 691,663 664,651', labelX: 628, labelY: 706 },
  { toothNumber: '410', points: '702,668 702,680 695,705 688,714 688,724 684,728 683,738 668,767 666,784 671,789 691,766 700,766 702,780 695,794 705,800 726,780 743,757 764,717 773,689 742,682', labelX: 704, labelY: 741 },
  { toothNumber: '409', points: '782,692 775,730 770,735 766,763 762,766 761,777 757,780 749,802 753,808 761,805 780,780 788,780 791,799 786,811 793,815 811,799 829,767 842,732 842,721 845,720 847,706', labelX: 790, labelY: 766 },
  { toothNumber: '408', points: '861,680 854,690 849,740 836,817 839,822 843,822 858,806 866,806 869,826 876,827 891,807 909,765 918,730 921,698 917,691 907,686 884,687 869,680', labelX: 875, labelY: 754 },
  { toothNumber: '407', points: '936,690 924,698 915,821 919,828 925,828 939,808 948,808 952,830 959,834 966,828 975,811 987,777 996,729 996,704 992,698 983,694 954,695', labelX: 956, labelY: 769 },
  { toothNumber: '406', points: '1055,696 1028,698 1013,695 1005,698 1000,704 999,721 1008,795 1014,825 1020,836 1024,836 1029,829 1039,792 1049,794 1058,821 1066,817 1070,807 1075,779 1070,714 1067,703', labelX: 1036, labelY: 766 },
  { toothNumber: '405', points: '1094,718 1089,724 1088,745 1091,754 1098,756 1105,746 1103,723', labelX: 1095, labelY: 738 },
  { toothNumber: '404', points: '1326,810 1322,809 1308,830 1281,849 1265,856 1228,863 1243,868 1263,869 1284,865 1302,857 1321,839 1327,823', labelX: 1289, labelY: 844 },
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
 * canine (204) and its lower counterpart (304) are open hook/sickle
 * shapes like 104/404, traced the same way (union of their enclosed
 * sub-regions). 209-211 previously stopped at the diagonal interdental
 * line instead of continuing to their real root/base — re-traced in
 * this pass to cover the full tooth, matching 206-208's style. Every
 * pairwise polygon intersection across all 16 teeth on this side is
 * zero.
 */
const SIDE_205_211_REGIONS = [
  { toothNumber: '204', points: '285,610 270,614 255,627 246,640 234,669 230,709 234,730 244,751 248,751 254,741 267,688 298,642 298,622 292,613', labelX: 261, labelY: 671 },
  { toothNumber: '205', points: '392,659 385,669 385,683 390,700 397,704 401,696 401,667 396,659', labelX: 393, labelY: 679 },
  { toothNumber: '206', points: '486,548 476,548 470,553 461,576 454,585 446,583 445,570 438,565 425,568 417,579 412,614 413,709 418,716 449,713 469,717 488,706 487,633 493,593 491,553', labelX: 454, labelY: 612 },
  { toothNumber: '207', points: '578,513 568,516 555,542 546,551 537,547 534,531 530,528 517,531 511,541 497,588 492,623 492,705 498,711 519,707 549,710 562,705 569,697 570,618 583,540 583,519', labelX: 539, labelY: 596 },
  { toothNumber: '208', points: '672,479 664,483 649,503 643,503 636,478 633,475 625,476 619,486 604,535 584,565 577,596 573,638 573,696 579,703 588,703 602,697 631,699 648,686 651,599 675,491', labelX: 621, labelY: 574 },
  { toothNumber: '209', points: '738,474 732,478 721,501 714,508 707,502 706,475 701,475 695,482 678,531 663,558 655,595 653,638 693,633 721,623 726,624 698,635 653,641 652,683 656,689 663,690 683,683 708,685 716,681 727,668 729,583 741,495 741,479', labelX: 698, labelY: 581 },
  { toothNumber: '210', points: '822,442 812,447 795,472 787,470 780,451 771,451 762,460 756,507 749,528 741,540 734,575 731,669 735,673 743,673 763,664 787,665 802,653 804,575 813,515 826,460 826,447', labelX: 778, labelY: 539 },
  { toothNumber: '211', points: '915,428 905,432 885,452 878,450 876,434 868,433 856,448 839,482 821,526 809,570 805,603 805,653 808,656 814,656 832,642 856,635 866,627 869,579 877,535 890,495 917,441 918,431', labelX: 859, labelY: 527 },
  { toothNumber: '304', points: '181,833 179,845 182,856 191,871 205,884 222,894 241,900 265,902 277,899 252,894 225,882 201,859 189,835', labelX: 216, labelY: 873 },
  { toothNumber: '305', points: '396,756 389,759 384,773 385,788 392,796 399,793 402,783 402,765', labelX: 393, labelY: 778 },
  { toothNumber: '306', points: '425,741 415,749 412,774 414,822 421,848 428,861 437,864 444,840 457,839 465,870 471,879 477,880 484,871 492,836 492,746 482,738 459,742', labelX: 452, labelY: 798 },
  { toothNumber: '307', points: '562,732 541,736 511,735 500,740 495,748 508,824 521,857 536,875 543,873 547,859 561,859 571,871 578,871 583,866 572,742', labelX: 539, labelY: 786 },
  { toothNumber: '308', points: '638,721 615,728 589,728 575,738 578,780 590,824 610,862 625,874 631,869 633,857 647,857 660,869 669,869 673,865 657,803 648,728', labelX: 618, labelY: 792 },
  { toothNumber: '309', points: '711,708 689,715 665,715 652,726 658,771 672,813 691,846 707,863 715,858 715,830 729,830 753,854 760,850 759,840 749,829 748,818 730,774 727,741 721,734 723,714', labelX: 702, labelY: 794 },
  { toothNumber: '310', points: '734,705 727,716 737,757 754,793 777,825 811,853 818,842 818,824 832,824 849,837 853,833 852,826 829,784 814,742 811,720 804,715 799,695 789,689 766,700', labelX: 784, labelY: 770 },
  { toothNumber: '311', points: '873,653 851,671 817,682 808,690 808,696 821,732 848,777 881,814 889,820 899,821 902,812 896,788 900,780 906,775 913,775 927,783 939,784 943,782 944,775 914,736 896,696 883,656', labelX: 884, labelY: 749 },
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
