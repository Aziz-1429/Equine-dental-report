'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Download, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ReportPreview } from './report-preview';
import { DentalReportData } from '@/lib/types';
import { saveReport } from '@/lib/supabase';

export function Step5Finalize({ dbId }: { dbId?: string | null }) {
  const { watch } = useFormContext<DentalReportData>();
  const [showPreview, setShowPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const formData = watch() as DentalReportData;

  const checkedPathologies = formData.pathologies.filter((p) => p.checked);
  const checkedTreatments = formData.treatments.filter((t) => t.checked);
  const checkedSoftTissue = formData.softTissue.filter((s) => s.checked);

  const canFinalize =
    formData.clientName.trim() !== '' &&
    formData.horseName.trim() !== '' &&
    formData.examDate !== '';

  const handleDownload = async () => {
    if (!canFinalize) return;
    setDownloading(true);
    try {
      // Save to database as finalized
      try {
        await saveReport(formData, 'finalized', dbId || undefined);
      } catch {
        // local save still works — don't block PDF download
      }
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const { renderDentalChartPage, stampPageFooters, drawLetterheadHeader, drawTitleBanner } =
        await import('@/lib/pdfDentalChart');

      const container = document.getElementById('pdf-report-content');
      if (!container) return;
      const sections = Array.from(container.querySelectorAll<HTMLElement>('[data-pdf-section]'));

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      // Keeps content clear of the "Page X of Y" pill stamped afterward.
      const FOOTER_RESERVE_MM = 14;
      const maxContentY = pdfHeight - FOOTER_RESERVE_MM;

      // The branded letterhead header is drawn natively with jsPDF on
      // EVERY page (never captured from the DOM), so the logo and clinic
      // details are guaranteed to appear identically everywhere —
      // including any continuation page this loop creates below.
      let headerHeight = await drawLetterheadHeader(pdf);
      const formattedDate = formData.examDate
        ? new Date(formData.examDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : '—';
      const bannerHeight = drawTitleBanner(pdf, headerHeight + 4, 'Equine Dental Report', formattedDate);
      let cursorY = headerHeight + 4 + bannerHeight;

      const startNewPage = async () => {
        pdf.addPage();
        headerHeight = await drawLetterheadHeader(pdf);
        cursorY = headerHeight + 8;
      };

      // Each section (one card's worth of content) is captured and placed
      // as its own image, so a page break only ever falls BETWEEN
      // sections — never through the middle of one — unless a single
      // section alone is taller than a full page, handled by the slicing
      // fallback below.
      for (const section of sections) {
        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });
        const imgData = canvas.toDataURL('image/png');
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        const usablePageHeight = maxContentY - headerHeight - 8;

        if (imgHeight > usablePageHeight) {
          if (cursorY > headerHeight + 8) await startNewPage();
          let position = cursorY;
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          let consumed = maxContentY - cursorY;
          while (consumed < imgHeight - 0.5) {
            await startNewPage();
            position = cursorY - consumed;
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            consumed += maxContentY - cursorY;
          }
          cursorY = maxContentY;
          continue;
        }

        if (cursorY + imgHeight > maxContentY) {
          await startNewPage();
        }
        pdf.addImage(imgData, 'PNG', 0, cursorY, pdfWidth, imgHeight);
        cursorY += imgHeight;
      }

      // The dental arcade chart is drawn directly with jsPDF's own vector
      // primitives (real embedded images + stroked outlines) on its own
      // page, rather than captured from the DOM — see lib/pdfDentalChart.ts.
      await renderDentalChartPage(pdf, formData);

      // Page numbers are stamped last, once every page (text + chart) exists,
      // since only then is the final page count known.
      stampPageFooters(pdf);

      const safeName = formData.horseName.replace(/[^a-zA-Z0-9]/g, '_') || 'horse';
      pdf.save(`dental_report_${safeName}_${formData.examDate}.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Review &amp; Finalize Report
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Verify the details, sign, and generate your PDF.
        </p>
      </div>

      {/* Summary preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Eye className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Report Summary</CardTitle>
              <CardDescription>Quick overview of the examination</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <SummaryField label="Client" value={formData.clientName} />
            <SummaryField label="Horse" value={formData.horseName} />
            <SummaryField label="Exam Date" value={formData.examDate} />
            <SummaryField label="Breed" value={formData.breed} />
            <SummaryField label="Age" value={formData.age} />
            <SummaryField label="Sex" value={formData.sex} />
            <SummaryField label="BCS" value={formData.bodyConditionScore} />
            <SummaryField label="Color" value={formData.color} />
          </div>

          <Separator />

          {checkedPathologies.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pathologies ({checkedPathologies.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {checkedPathologies.map((p) => (
                  <Badge key={p.id} variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                    {p.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {checkedSoftTissue.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Soft Tissue ({checkedSoftTissue.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {checkedSoftTissue.map((s) => (
                  <Badge key={s.id} variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                    {s.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {checkedTreatments.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Procedures Performed ({checkedTreatments.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {checkedTreatments.map((t) => (
                  <Badge key={t.id} variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    {t.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <SummaryField label="Follow-up" value={formData.followUpTimeline} />
            <SummaryField label="Sedation" value={formData.sedationUsed ? `${formData.sedationDrugs.filter(d => d.drug).map(d => d.drug).join(', ')}` : 'No'} />
          </div>
        </CardContent>
      </Card>

      {/* Validation warning */}
      {!canFinalize && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Client name, horse name, and exam date are required to finalize the report.
            Go back to Step 1 to fill them in.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 touch-target"
          onClick={() => setShowPreview(!showPreview)}
          disabled={!canFinalize}
        >
          <Eye className="mr-2 h-5 w-5" />
          {showPreview ? 'Hide Preview' : 'Preview PDF'}
        </Button>
        <Button
          size="lg"
          className="flex-1 touch-target"
          onClick={handleDownload}
          disabled={!canFinalize || downloading}
        >
          <Download className="mr-2 h-5 w-5" />
          {downloading ? 'Generating...' : 'Download PDF'}
        </Button>
      </div>

      {/* Inline preview */}
      {showPreview && canFinalize && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">PDF Preview</CardTitle>
            <CardDescription>
              This is a visual rendering of your final report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto" style={{ width: '794px' }}>
                <ReportPreview data={formData} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden element for PDF generation — always rendered off-screen */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          pointerEvents: 'none',
        }}
      >
        <ReportPreview data={formData} />
      </div>
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-medium text-slate-700 dark:text-slate-300">
        {value || '—'}
      </p>
    </div>
  );
}
