import type jsPDF from 'jspdf';
import { DentalReportData } from './types';
import { DENTAL_CHART_SIDES, getStatusOption, TOOTH_STATUS_OPTIONS } from '@/components/dental/dentalData';

const BRAND_RGB: [number, number, number] = [68, 23, 82];
const MUTED_RGB: [number, number, number] = [100, 116, 139];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function loadImageAsDataUrl(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

/** Draws one tooth's boundary as a stroked (never filled) closed
 * polygon, so the anatomical artwork underneath always stays visible —
 * this is the PDF equivalent of the web chart's edge-only highlight. */
function drawToothOutline(
  pdf: jsPDF,
  points: string,
  originX: number,
  originY: number,
  scaleX: number,
  scaleY: number,
  colorHex: string,
  dashed: boolean,
  lineWidth: number
) {
  const coords = points
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x, y] = pair.split(',').map(Number);
      return [originX + x * scaleX, originY + y * scaleY];
    });
  if (coords.length < 2) return;

  const [r, g, b] = hexToRgb(colorHex);
  pdf.setDrawColor(r, g, b);
  pdf.setLineWidth(lineWidth);
  pdf.setLineDashPattern(dashed ? [1.6, 1.2] : [], 0);

  const [startX, startY] = coords[0];
  const deltas = coords.slice(1).map((c, i) => [c[0] - coords[i][0], c[1] - coords[i][1]]);
  pdf.lines(deltas, startX, startY, [1, 1], 'S', true);
  pdf.setLineDashPattern([], 0);
}

/**
 * Renders the full dental arcade chart as its own dedicated PDF page:
 * the original anatomical reference images (added as real embedded
 * images, not a DOM screenshot) plus vector-drawn edge-only outlines
 * for any examined tooth, using the exact same data model and status
 * colors as the interactive web chart. Draws directly with jsPDF's own
 * primitives rather than rasterizing an SVG, so it renders reliably
 * across viewers/printers.
 */
export async function renderDentalChartPage(pdf: jsPDF, data: DentalReportData): Promise<void> {
  pdf.addPage();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  let cursorY = margin;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(...BRAND_RGB);
  pdf.text('DENTAL ARCADE CHART', pageWidth / 2, cursorY + 4, { align: 'center' });
  cursorY += 13;

  const photoSides = DENTAL_CHART_SIDES.filter((s) => s.backgroundSrc);
  const schematicSides = DENTAL_CHART_SIDES.filter((s) => !s.backgroundSrc);

  const imgDisplayWidth = contentWidth * 0.72;
  const imgX = margin + (contentWidth - imgDisplayWidth) / 2;

  for (const side of photoSides) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(...MUTED_RGB);
    pdf.text(side.label.toUpperCase(), pageWidth / 2, cursorY + 3, { align: 'center' });
    cursorY += 6;

    const imgDisplayHeight = imgDisplayWidth * (side.viewBoxHeight / side.viewBoxWidth);
    const dataUrl = await loadImageAsDataUrl(side.backgroundSrc);
    pdf.addImage(dataUrl, 'PNG', imgX, cursorY, imgDisplayWidth, imgDisplayHeight);

    const scaleX = imgDisplayWidth / side.viewBoxWidth;
    const scaleY = imgDisplayHeight / side.viewBoxHeight;
    for (const region of side.regions) {
      const finding = data.teeth[region.toothNumber];
      if (!finding?.examined) continue;
      const status = getStatusOption(finding.status);
      const dashed = finding.status === 'missing' || finding.status === 'extracted';
      drawToothOutline(pdf, region.points, imgX, cursorY, scaleX, scaleY, status.hex, dashed, 0.9);
    }
    cursorY += imgDisplayHeight + 7;
  }

  for (const side of schematicSides) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(...MUTED_RGB);
    pdf.text(side.label.toUpperCase(), pageWidth / 2, cursorY + 3, { align: 'center' });
    cursorY += 6;

    const gridWidth = contentWidth * 0.55;
    const gridHeight = gridWidth * (side.viewBoxHeight / side.viewBoxWidth);
    const gridX = margin + (contentWidth - gridWidth) / 2;
    const scaleX = gridWidth / side.viewBoxWidth;
    const scaleY = gridHeight / side.viewBoxHeight;

    for (const region of side.regions) {
      const finding = data.teeth[region.toothNumber];
      const examined = Boolean(finding?.examined);
      const status = getStatusOption(finding?.status ?? 'normal');

      const coords = region.points
        .trim()
        .split(/\s+/)
        .map((pair) => pair.split(',').map(Number));
      const xs = coords.map((c) => c[0]);
      const ys = coords.map((c) => c[1]);
      const x0 = gridX + Math.min(...xs) * scaleX;
      const y0 = cursorY + Math.min(...ys) * scaleY;
      const w = (Math.max(...xs) - Math.min(...xs)) * scaleX;
      const h = (Math.max(...ys) - Math.min(...ys)) * scaleY;

      const [dr, dg, db] = examined ? hexToRgb(status.hex) : [203, 213, 225];
      pdf.setDrawColor(dr, dg, db);
      pdf.setFillColor(255, 255, 255);
      pdf.setLineWidth(examined ? 0.7 : 0.3);
      pdf.rect(x0, y0, w, h, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(30, 41, 59);
      pdf.text(region.toothNumber, x0 + w / 2, y0 + h / 2 + 1.4, { align: 'center' });
    }
    cursorY += gridHeight + 8;
  }

  const usedStatuses = new Set(
    Object.values(data.teeth)
      .filter((t) => t.examined)
      .map((t) => t.status)
  );
  const legendEntries = TOOTH_STATUS_OPTIONS.filter((o) => usedStatuses.has(o.value));
  if (legendEntries.length > 0) {
    cursorY += 3;
    let legendX = margin;
    pdf.setFontSize(7.5);
    for (const entry of legendEntries) {
      const [r, g, b] = hexToRgb(entry.hex);
      pdf.setLineDashPattern([], 0);
      pdf.setDrawColor(r, g, b);
      pdf.setLineWidth(0.9);
      pdf.line(legendX, cursorY, legendX + 5, cursorY);
      pdf.setTextColor(...MUTED_RGB);
      pdf.setFont('helvetica', 'normal');
      pdf.text(entry.label, legendX + 7, cursorY + 1);
      legendX += 7 + pdf.getTextWidth(entry.label) + 6;
      if (legendX > pageWidth - margin - 30) {
        legendX = margin;
        cursorY += 5;
      }
    }
  }
}
