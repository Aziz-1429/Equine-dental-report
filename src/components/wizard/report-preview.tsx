'use client';

import { DentalReportData, ToothFinding, toothType } from '@/lib/types';
import { getStatusOption } from '@/components/dental/dentalData';
import { HorseLogoForPDF } from '@/components/logo';

const BRAND_COLOR = '#441752';
const SECONDARY_COLOR = '#E8E8E8';

// The clinic's own letterhead contact details — easy to update in one
// place if the practice's address/phone/email ever changes.
const CLINIC_ADDRESS = 'Riyadh, Saudi Arabia';
const CLINIC_PHONE = '+966 51 030 4423';
const CLINIC_EMAIL = 'info@equidentum.sa';

// Renders the heading text already uppercased in JS rather than via CSS
// text-transform + letter-spacing — that combination is what triggers
// html2canvas's text-doubling ("ghosting") bug at scale:2.
function SectionTitle({ children }: { children: string }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_COLOR, marginBottom: 6, marginTop: 14, paddingBottom: 3, borderBottom: `0.5px solid ${SECONDARY_COLOR}` }}>
      {children.toUpperCase()}
    </div>
  );
}

// The chevron/diagonal shapes use plain inline SVG <polygon> fills (no
// <image> href, no external asset) — html2canvas rasterizes those
// reliably; the async-load race that broke the old SVG chart only
// applies to <image href="..."> elements, which this avoids entirely.
function LetterheadHeader() {
  return (
    <div style={{ position: 'relative', height: 110, backgroundColor: SECONDARY_COLOR, overflow: 'hidden' }}>
      <svg width="794" height="110" viewBox="0 0 794 110" style={{ position: 'absolute', top: 0, left: 0 }}>
        <polygon points="0,0 340,0 280,110 0,110" fill={BRAND_COLOR} />
      </svg>
      <div style={{ position: 'absolute', left: 28, top: 0, height: '100%', display: 'flex', alignItems: 'center', gap: 10 }}>
        <HorseLogoForPDF size={42} color="#ffffff" />
        <div style={{ color: '#ffffff', fontWeight: 700, fontSize: 19, lineHeight: 1.15 }}>
          <div>Equi</div>
          <div>Dentum</div>
        </div>
      </div>
      {/* Same vertical-centering technique as the logo block above, so
          both halves land on the same level regardless of how many
          lines of contact info there are. */}
      <div style={{ position: 'absolute', left: 365, top: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: BRAND_COLOR }}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 3 }}>EquiDentum</div>
        <div style={{ fontSize: 9, fontWeight: 700 }}>{CLINIC_ADDRESS}</div>
        <div style={{ fontSize: 9, fontWeight: 700 }}>{CLINIC_PHONE}</div>
        <div style={{ fontSize: 9, fontWeight: 700 }}>{CLINIC_EMAIL}</div>
      </div>
    </div>
  );
}

function TitleBanner({ title }: { title: string }) {
  return (
    <div style={{ position: 'relative', height: 38, marginBottom: 18 }}>
      <svg width="794" height="38" viewBox="0 0 794 38" style={{ position: 'absolute', top: 0, left: 0 }}>
        <polygon points="36,0 794,0 794,38 0,38" fill={BRAND_COLOR} />
      </svg>
      <div style={{ position: 'absolute', left: 56, top: 9, color: '#ffffff', fontWeight: 700, fontSize: 15 }}>
        {title}
      </div>
    </div>
  );
}

// A fixed box height paired with a line-height of the SAME value is the
// one centering technique that survives html2canvas rasterization
// reliably — flex alignItems/justifyContent on the badge was confirmed
// to drift off-center in the actual downloaded PDF even though it
// looked correct in a live browser preview.
const FIELD_BOX_HEIGHT = 24;

function FieldBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ width: '48%', display: 'flex', marginBottom: 8, height: FIELD_BOX_HEIGHT }}>
      <div
        style={{
          backgroundColor: BRAND_COLOR,
          color: '#ffffff',
          fontWeight: 700,
          fontSize: 9,
          height: FIELD_BOX_HEIGHT,
          lineHeight: `${FIELD_BOX_HEIGHT}px`,
          padding: '0 9px',
          borderRadius: 3,
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginLeft: 8,
          fontSize: 11,
          height: FIELD_BOX_HEIGHT,
          lineHeight: `${FIELD_BOX_HEIGHT}px`,
          color: value ? '#1e293b' : '#cbd5e1',
          fontWeight: 500,
          fontStyle: value ? 'normal' : 'italic',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value || '—'}
      </div>
    </div>
  );
}

function PillRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, padding: '3px 0', borderBottom: `0.5px solid ${SECONDARY_COLOR}` }}>
      <span style={{ color: '#64748b', fontWeight: 600 }}>{label}</span>
      <span style={{ color: '#1e293b', fontWeight: 600 }}>{value || '—'}</span>
    </div>
  );
}

function hasExamMeasurements(data: DentalReportData): boolean {
  const m = data.examMeasurements;
  return Boolean(
    m.farside.excursion || m.nearside.excursion || m.rostrocaudalExcursion ||
    m.molarAngleFarside.before || m.incisorAngle.before || m.molarAngleNearside.before ||
    m.tmjPainFarside || m.tmjPainNearside
  );
}

function ExamMeasurementsBlock({ data }: { data: DentalReportData }) {
  if (!hasExamMeasurements(data)) return null;
  const m = data.examMeasurements;

  return (
    <>
      <SectionTitle>Oral Examination Measurements</SectionTitle>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9.5, marginBottom: 6 }}>
        <thead>
          <tr style={{ backgroundColor: '#fafafa' }}>
            <th style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 700, color: BRAND_COLOR, border: `0.5px solid ${SECONDARY_COLOR}` }}>RIGHT SIDE</th>
            <th style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 700, color: BRAND_COLOR, border: `0.5px solid ${SECONDARY_COLOR}` }}>PROTRUSION | RETRUSION MOVEMENT</th>
            <th style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 700, color: BRAND_COLOR, border: `0.5px solid ${SECONDARY_COLOR}` }}>LEFT SIDE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '6px', border: `0.5px solid ${SECONDARY_COLOR}`, verticalAlign: 'top' }}>
              <PillRow label="Lateral Excursion" value={m.farside.excursion} />
              <PillRow label="Post Dental Work" value={m.farside.postDentalExcursion} />
              <PillRow label="Percent of Occlusion" value={m.farside.percentOcclusion} />
              <PillRow label="Post Dental %" value={m.farside.postDentalPercentOcclusion} />
            </td>
            <td style={{ padding: '6px', border: `0.5px solid ${SECONDARY_COLOR}`, verticalAlign: 'top' }}>
              <PillRow label="Rostro-caudal Excursion" value={m.rostrocaudalExcursion} />
              <PillRow label="R/C Post Dental Work" value={m.postDentalRostrocaudalExcursion} />
            </td>
            <td style={{ padding: '6px', border: `0.5px solid ${SECONDARY_COLOR}`, verticalAlign: 'top' }}>
              <PillRow label="Lateral Excursion" value={m.nearside.excursion} />
              <PillRow label="Post Dental Work" value={m.nearside.postDentalExcursion} />
              <PillRow label="Percent of Occlusion" value={m.nearside.percentOcclusion} />
              <PillRow label="Post Dental %" value={m.nearside.postDentalPercentOcclusion} />
            </td>
          </tr>
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9.5, marginBottom: 6 }}>
        <thead>
          <tr style={{ backgroundColor: '#fafafa' }}>
            <th style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 700, color: BRAND_COLOR, border: `0.5px solid ${SECONDARY_COLOR}` }}>MOLAR TABLE ANGLE (RIGHT)</th>
            <th style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 700, color: BRAND_COLOR, border: `0.5px solid ${SECONDARY_COLOR}` }}>INCISOR TABLE ANGLE</th>
            <th style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 700, color: BRAND_COLOR, border: `0.5px solid ${SECONDARY_COLOR}` }}>MOLAR TABLE ANGLE (LEFT)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '6px', border: `0.5px solid ${SECONDARY_COLOR}`, verticalAlign: 'top' }}>
              <PillRow label="Before Dental Work" value={m.molarAngleFarside.before} />
              <PillRow label="After Dental Work" value={m.molarAngleFarside.after} />
            </td>
            <td style={{ padding: '6px', border: `0.5px solid ${SECONDARY_COLOR}`, verticalAlign: 'top' }}>
              <PillRow label="Before Dental Work" value={m.incisorAngle.before} />
              <PillRow label="After Dental Work" value={m.incisorAngle.after} />
            </td>
            <td style={{ padding: '6px', border: `0.5px solid ${SECONDARY_COLOR}`, verticalAlign: 'top' }}>
              <PillRow label="Before Dental Work" value={m.molarAngleNearside.before} />
              <PillRow label="After Dental Work" value={m.molarAngleNearside.after} />
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ width: '50%', border: `0.5px solid ${SECONDARY_COLOR}`, borderRadius: 4 }}>
          <div style={{ backgroundColor: '#fafafa', padding: '4px 8px', fontWeight: 700, fontSize: 9, color: BRAND_COLOR }}>TMJ PAIN SCALE — RIGHT</div>
          <div style={{ padding: 8, fontSize: 10, color: '#334155', minHeight: 20 }}>{m.tmjPainFarside || '—'}</div>
        </div>
        <div style={{ width: '50%', border: `0.5px solid ${SECONDARY_COLOR}`, borderRadius: 4 }}>
          <div style={{ backgroundColor: '#fafafa', padding: '4px 8px', fontWeight: 700, fontSize: 9, color: BRAND_COLOR }}>TMJ PAIN SCALE — LEFT</div>
          <div style={{ padding: 8, fontSize: 10, color: '#334155', minHeight: 20 }}>{m.tmjPainNearside || '—'}</div>
        </div>
      </div>
    </>
  );
}

function Tag({ label, color = 'brand' }: { label: string; color?: 'brand' | 'amber' | 'green' }) {
  const colors = { brand: { bg: '#f3e8f7', text: BRAND_COLOR }, amber: { bg: '#fef3c7', text: '#92400e' }, green: { bg: '#dcfce7', text: '#166534' } };
  const c = colors[color];
  return <span style={{ display: 'inline-block', fontSize: 9, padding: '3px 8px', borderRadius: 4, backgroundColor: c.bg, color: c.text, margin: '2px 3px 2px 0', fontWeight: 600 }}>{label}</span>;
}

function toothFindingsList(teeth: Record<string, ToothFinding>) {
  return Object.values(teeth)
    .filter((t) => t.status !== 'normal' || t.findings.length > 0 || Boolean(t.notes))
    .sort((a, b) => Number(a.toothNumber) - Number(b.toothNumber));
}

export function ReportPreview({ data }: { data: DentalReportData }) {
  const toothFindings = toothFindingsList(data.teeth);
  const checkedPathologies = data.pathologies.filter((p) => p.checked);
  const checkedSoftTissue = data.softTissue.filter((s) => s.checked);
  const checkedTreatments = data.treatments.filter((t) => t.checked);
  const activeDrugs = data.sedationDrugs.filter((d) => d.drug);

  const formattedDate = data.examDate
    ? new Date(data.examDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  // Each section below is wrapped in its own `data-pdf-section` div so
  // the PDF generator can rasterize and place sections one at a time —
  // the branded header (drawn natively on every PDF page by
  // lib/pdfDentalChart.ts) and title banner are deliberately excluded
  // from this list, so a page break can only ever fall BETWEEN two
  // sections, never through the middle of one.
  const sectionStyle = { padding: '0 40px', backgroundColor: '#ffffff' } as const;

  return (
    <div id="pdf-report-content" style={{ width: '794px', backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif', color: '#1e293b', fontSize: 10, lineHeight: 1.4, boxSizing: 'border-box' }}>
      {/* Shown in the on-screen/inline preview only — the real PDF draws
          its own vector header + title banner on every page instead. */}
      <LetterheadHeader />
      <div style={{ padding: '24px 40px 0' }}>
        <TitleBanner title="Equine Dental Report" />
        <div style={{ textAlign: 'right', fontSize: 9, color: '#64748b', marginTop: -12, marginBottom: 12 }}>
          {formattedDate}
        </div>
      </div>

      {/* Administrative */}
      <div data-pdf-section style={sectionStyle}>
        <SectionTitle>Client &amp; Administrative Information</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <FieldBox label="Owner" value={data.clientName} />
          <FieldBox label="Phone" value={data.phone} />
          <FieldBox label="Address" value={data.stableLocation} />
          <FieldBox label="Date" value={formattedDate} />
          <FieldBox label="Email" value={data.email} />
        </div>
      </div>

      {/* Patient */}
      <div data-pdf-section style={sectionStyle}>
        <SectionTitle>Patient Information</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <FieldBox label="Equine Name" value={data.horseName} />
          <FieldBox label="Horse Code" value={data.horseCode} />
          <FieldBox label="Breed" value={data.breed} />
          <FieldBox label="Gender" value={data.sex} />
          <FieldBox label="Age" value={data.age} />
          <FieldBox label="BCS" value={data.bodyConditionScore} />
          <FieldBox label="Color" value={data.color} />
        </div>
      </div>

      {/* Sedation */}
      {data.sedationUsed && activeDrugs.length > 0 && (
        <div data-pdf-section style={sectionStyle}>
          <SectionTitle>Sedation Record</SectionTitle>
          {activeDrugs.map((d, idx) => (
            <div key={d.id} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <FieldBox label={`Drug ${activeDrugs.length > 1 ? `#${idx + 1}` : ''}`} value={d.drug} />
              <FieldBox label="Dose" value={d.dose} />
              <FieldBox label="Time" value={d.time} />
            </div>
          ))}
        </div>
      )}

      {hasExamMeasurements(data) && (
        <div data-pdf-section style={sectionStyle}>
          <ExamMeasurementsBlock data={data} />
        </div>
      )}

      {/* The dental arcade chart itself (original skull artwork plus
          edge-outline exam highlights) is rendered as its own dedicated
          page directly by the PDF generator — see lib/pdfDentalChart.ts —
          rather than captured from this HTML preview, so the original
          anatomical images always come through intact in the download. */}

      {/* Tooth-level findings */}
      {toothFindings.length > 0 && (
        <div data-pdf-section style={sectionStyle}>
          <SectionTitle>Tooth-Level Findings</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9.5 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: `0.5px solid ${SECONDARY_COLOR}`, color: '#64748b' }}>
                <th style={{ padding: '3px 6px 3px 0', fontWeight: 600 }}>TOOTH</th>
                <th style={{ padding: '3px 6px', fontWeight: 600 }}>TYPE</th>
                <th style={{ padding: '3px 6px', fontWeight: 600 }}>STATUS</th>
                <th style={{ padding: '3px 6px', fontWeight: 600 }}>FINDINGS</th>
                <th style={{ padding: '3px 6px', fontWeight: 600 }}>SEVERITY</th>
                <th style={{ padding: '3px 0 3px 6px', fontWeight: 600 }}>NOTES</th>
              </tr>
            </thead>
            <tbody>
              {toothFindings.map((t) => (
                <tr key={t.toothNumber} style={{ borderBottom: '0.5px solid #f1f5f9', verticalAlign: 'top' }}>
                  <td style={{ padding: '4px 6px 4px 0', fontWeight: 700, color: BRAND_COLOR }}>{t.toothNumber}</td>
                  <td style={{ padding: '4px 6px', color: '#64748b' }}>{toothType(t.toothNumber)}</td>
                  <td style={{ padding: '4px 6px', color: '#334155' }}>{getStatusOption(t.status).label}</td>
                  <td style={{ padding: '4px 6px', color: '#334155' }}>{t.findings.join(', ') || '—'}</td>
                  <td style={{ padding: '4px 6px', color: '#334155' }}>{t.severity || '—'}</td>
                  <td style={{ padding: '4px 0 4px 6px', color: '#334155' }}>{t.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pathologies */}
      {checkedPathologies.length > 0 && (
        <div data-pdf-section style={sectionStyle}>
          <SectionTitle>Pathologies Identified</SectionTitle>
          <div>{checkedPathologies.map((p) => <Tag key={p.id} label={p.label} color="amber" />)}</div>
        </div>
      )}

      {/* Soft tissue */}
      {checkedSoftTissue.length > 0 && (
        <div data-pdf-section style={sectionStyle}>
          <SectionTitle>Soft Tissue Evaluation</SectionTitle>
          <div>{checkedSoftTissue.map((s) => <Tag key={s.id} label={s.label} color={s.label.includes('normal') ? 'green' : 'amber'} />)}</div>
        </div>
      )}

      {/* Charting notes */}
      {data.chartingNotes && (
        <div data-pdf-section style={sectionStyle}>
          <SectionTitle>Charting Notes</SectionTitle>
          <div style={{ border: `0.5px solid ${SECONDARY_COLOR}`, borderRadius: 4, padding: 10, backgroundColor: '#fafafa', fontSize: 10, color: '#334155', lineHeight: 1.5 }}>{data.chartingNotes}</div>
        </div>
      )}

      {/* Treatments */}
      {checkedTreatments.length > 0 && (
        <div data-pdf-section style={sectionStyle}>
          <SectionTitle>Procedures Performed</SectionTitle>
          <div>{checkedTreatments.map((t) => <Tag key={t.id} label={t.label} color="brand" />)}</div>
        </div>
      )}

      {/* Recommendations */}
      <div data-pdf-section style={{ ...sectionStyle, paddingBottom: 40 }}>
        <SectionTitle>Recommendations</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <FieldBox label="Follow-Up Timeline" value={data.followUpTimeline} />
          <FieldBox label="Diet Recommendations" value={data.dietRecommendations} />
        </div>
        {data.additionalNotes && (
          <div style={{ border: `0.5px solid ${SECONDARY_COLOR}`, borderRadius: 4, padding: 10, backgroundColor: '#fafafa', fontSize: 10, color: '#334155', lineHeight: 1.5, marginTop: 6 }}>{data.additionalNotes}</div>
        )}
      </div>
    </div>
  );
}
