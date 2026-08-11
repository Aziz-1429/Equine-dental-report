'use client';

import { DentalReportData, ToothFinding, toothType } from '@/lib/types';
import { EquineDentalChart } from '@/components/dental/EquineDentalChart';
import { DENTAL_CHART_SIDES, getStatusOption, TOOTH_STATUS_OPTIONS } from '@/components/dental/dentalData';
import { HorseLogoForPDF } from '@/components/logo';

const BRAND_COLOR = '#441752';
const SECONDARY_COLOR = '#E8E8E8';

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

function FieldBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ width: '48%', border: `0.5px solid ${SECONDARY_COLOR}`, borderRadius: 4, padding: 8, backgroundColor: '#fafafa', marginBottom: 6 }}>
      <div style={{ fontSize: 8, color: '#64748b', marginBottom: 3, fontWeight: 600 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 11, color: value ? '#1e293b' : '#cbd5e1', fontWeight: 500, fontStyle: value ? 'normal' : 'italic' }}>{value || '—'}</div>
    </div>
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

function BrandLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <HorseLogoForPDF size={44} />
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: BRAND_COLOR }}>EquiDentum</div>
        <div style={{ fontSize: 8, color: '#64748b', marginTop: 2 }}>Equine Dental Report System</div>
      </div>
    </div>
  );
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

  return (
    <div id="pdf-report-content" style={{ width: '794px', minHeight: '1123px', padding: '40px', backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif', color: '#1e293b', fontSize: 10, lineHeight: 1.4, boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 12, borderBottom: `2px solid ${BRAND_COLOR}`, marginBottom: 20 }}>
        <BrandLogo />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Dental Examination Report</div>
          <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>{formattedDate}</div>
        </div>
      </div>

      {/* Administrative */}
      <SectionTitle>Client &amp; Administrative Information</SectionTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <FieldBox label="Client Name" value={data.clientName} />
        <FieldBox label="Phone" value={data.phone} />
        <FieldBox label="Email" value={data.email} />
        <FieldBox label="Stable Location" value={data.stableLocation} />
        <FieldBox label="Date of Exam" value={formattedDate} />
      </div>

      {/* Patient */}
      <SectionTitle>Patient Information</SectionTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <FieldBox label="Horse Name" value={data.horseName} />
        <FieldBox label="Age (years)" value={data.age} />
        <FieldBox label="Breed" value={data.breed} />
        <FieldBox label="Sex" value={data.sex} />
        <FieldBox label="Body Condition Score" value={data.bodyConditionScore} />
        <FieldBox label="Horse Use / Discipline" value={data.horseUse} />
      </div>

      {/* Sedation */}
      {data.sedationUsed && activeDrugs.length > 0 && (
        <>
          <SectionTitle>Sedation Record</SectionTitle>
          {activeDrugs.map((d, idx) => (
            <div key={d.id} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <FieldBox label={`Drug ${activeDrugs.length > 1 ? `#${idx + 1}` : ''}`} value={d.drug} />
              <FieldBox label="Dose" value={d.dose} />
              <FieldBox label="Time" value={d.time} />
            </div>
          ))}
        </>
      )}

      {/* Dental Chart */}
      <SectionTitle>Dental Arcade Chart</SectionTitle>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 8, marginTop: 6 }}>
        {TOOTH_STATUS_OPTIONS.map((option) => (
          <div key={option.value} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, border: '1px solid #94a3b8', backgroundColor: '#f8fafc', fontSize: 9, textAlign: 'center', lineHeight: '11px' }}>
              {option.glyph}
            </div>
            <span style={{ fontSize: 8, color: '#64748b' }}>{option.label}</span>
          </div>
        ))}
      </div>

      {/* Arcade charts — real anatomical reference for cheek teeth, schematic grid for incisors */}
      <div style={{ border: `0.5px solid ${SECONDARY_COLOR}`, borderRadius: 4, padding: 12, marginBottom: 6 }}>
        {DENTAL_CHART_SIDES.map((side) => (
          <div key={side.id} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 8, fontWeight: 600, color: '#64748b', marginBottom: 4, textAlign: 'center' }}>
              {side.label.toUpperCase()}
            </div>
            <EquineDentalChart
              side={side}
              exam={{ teeth: data.teeth, generalNotes: '' }}
              selectedTooth={null}
              onSelectTooth={() => {}}
            />
          </div>
        ))}
      </div>

      {/* Tooth-level findings */}
      {toothFindings.length > 0 && (
        <>
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
        </>
      )}

      {/* Pathologies */}
      {checkedPathologies.length > 0 && (
        <>
          <SectionTitle>Pathologies Identified</SectionTitle>
          <div>{checkedPathologies.map((p) => <Tag key={p.id} label={p.label} color="amber" />)}</div>
        </>
      )}

      {/* Soft tissue */}
      {checkedSoftTissue.length > 0 && (
        <>
          <SectionTitle>Soft Tissue Evaluation</SectionTitle>
          <div>{checkedSoftTissue.map((s) => <Tag key={s.id} label={s.label} color={s.label.includes('normal') ? 'green' : 'amber'} />)}</div>
        </>
      )}

      {/* Charting notes */}
      {data.chartingNotes && (
        <>
          <SectionTitle>Charting Notes</SectionTitle>
          <div style={{ border: `0.5px solid ${SECONDARY_COLOR}`, borderRadius: 4, padding: 10, backgroundColor: '#fafafa', fontSize: 10, color: '#334155', lineHeight: 1.5 }}>{data.chartingNotes}</div>
        </>
      )}

      {/* Treatments */}
      {checkedTreatments.length > 0 && (
        <>
          <SectionTitle>Procedures Performed</SectionTitle>
          <div>{checkedTreatments.map((t) => <Tag key={t.id} label={t.label} color="brand" />)}</div>
        </>
      )}

      {/* Recommendations */}
      <SectionTitle>Recommendations</SectionTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <FieldBox label="Follow-Up Timeline" value={data.followUpTimeline} />
        <FieldBox label="Diet Recommendations" value={data.dietRecommendations} />
      </div>
      {data.additionalNotes && (
        <div style={{ border: `0.5px solid ${SECONDARY_COLOR}`, borderRadius: 4, padding: 10, backgroundColor: '#fafafa', fontSize: 10, color: '#334155', lineHeight: 1.5, marginTop: 6 }}>{data.additionalNotes}</div>
      )}
    </div>
  );
}
