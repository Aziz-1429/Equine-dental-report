'use client';

import {
  DentalReportData,
  ToothStatus,
  ToothRecord,
} from '@/lib/types';

const BRAND_COLOR = '#441752';
const SECONDARY_COLOR = '#E8E8E8';

const C: Record<ToothStatus, { fill: string; stroke: string; text: string; label: string }> = {
  normal:    { fill: '#ffffff', stroke: '#94a3b8', text: '#334155', label: 'Normal' },
  attention: { fill: '#fef3c7', stroke: '#f59e0b', text: '#92400e', label: 'Attention' },
  pathology: { fill: '#fee2e2', stroke: '#ef4444', text: '#991b1b', label: 'Pathology' },
  absent:    { fill: '#e2e8f0', stroke: '#64748b', text: '#94a3b8', label: 'Absent'   },
};

type ToothDef = { id: string; x: number; y: number; w: number; h: number; rx?: number };

const URX: ToothDef[] = [
  { id:'111', x:10,  y:30, w:22, h:60, rx:4 }, { id:'110', x:34, y:30, w:22, h:60, rx:4 },
  { id:'109', x:58,  y:30, w:22, h:60, rx:4 }, { id:'108', x:86, y:32, w:20, h:56, rx:4 },
  { id:'107', x:108, y:32, w:20, h:56, rx:4 }, { id:'106', x:130, y:32, w:20, h:56, rx:4 },
  { id:'104', x:166, y:36, w:14, h:48, rx:5 }, { id:'103', x:182, y:40, w:12, h:42, rx:5 },
  { id:'102', x:196, y:42, w:12, h:38, rx:5 }, { id:'101', x:210, y:44, w:12, h:34, rx:5 },
];
const LRX: ToothDef[] = [
  { id:'411', x:10,  y:108, w:22, h:54, rx:4 }, { id:'410', x:34, y:108, w:22, h:54, rx:4 },
  { id:'409', x:58,  y:108, w:22, h:54, rx:4 }, { id:'408', x:86, y:110, w:20, h:50, rx:4 },
  { id:'407', x:108, y:110, w:20, h:50, rx:4 }, { id:'406', x:130, y:110, w:20, h:50, rx:4 },
  { id:'404', x:166, y:114, w:14, h:42, rx:5 }, { id:'403', x:182, y:118, w:12, h:36, rx:5 },
  { id:'402', x:196, y:120, w:12, h:32, rx:5 }, { id:'401', x:210, y:122, w:12, h:28, rx:5 },
];
const ULX: ToothDef[] = [
  { id:'201', x:10,  y:44, w:12, h:34, rx:5 }, { id:'202', x:24, y:42, w:12, h:38, rx:5 },
  { id:'203', x:38,  y:40, w:12, h:42, rx:5 }, { id:'204', x:52, y:36, w:14, h:48, rx:5 },
  { id:'206', x:82,  y:32, w:20, h:56, rx:4 }, { id:'207', x:104, y:32, w:20, h:56, rx:4 },
  { id:'208', x:126, y:32, w:20, h:56, rx:4 }, { id:'209', x:150, y:30, w:22, h:60, rx:4 },
  { id:'210', x:174, y:30, w:22, h:60, rx:4 }, { id:'211', x:198, y:30, w:22, h:60, rx:4 },
];
const LLX: ToothDef[] = [
  { id:'301', x:10,  y:122, w:12, h:28, rx:5 }, { id:'302', x:24, y:120, w:12, h:32, rx:5 },
  { id:'303', x:38,  y:118, w:12, h:36, rx:5 }, { id:'304', x:52, y:114, w:14, h:42, rx:5 },
  { id:'306', x:82,  y:110, w:20, h:50, rx:4 }, { id:'307', x:104, y:110, w:20, h:50, rx:4 },
  { id:'308', x:126, y:110, w:20, h:50, rx:4 }, { id:'309', x:150, y:108, w:22, h:54, rx:4 },
  { id:'310', x:174, y:108, w:22, h:54, rx:4 }, { id:'311', x:198, y:108, w:22, h:54, rx:4 },
];

function StaticTooth({ def, record }: { def: ToothDef; record?: ToothRecord }) {
  const status = record?.status ?? 'normal';
  const c = C[status];
  const cx = def.x + def.w / 2;
  const cy = def.y + def.h / 2;
  return (
    <g key={def.id}>
      <rect x={def.x} y={def.y} width={def.w} height={def.h} rx={def.rx ?? 3} fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
      <text x={cx} y={cy + 3} textAnchor="middle" fontSize={7} fontWeight="700" fill={c.text} fontFamily="Helvetica, sans-serif">{def.id}</text>
    </g>
  );
}

function ArcadeSVG({ upper, lower, teethData }: { upper: ToothDef[]; lower: ToothDef[]; teethData: Record<string, ToothRecord> }) {
  return (
    <svg viewBox="0 0 234 180" width="100%" style={{ maxWidth: 350, display: 'block' }} xmlns="http://www.w3.org/2000/svg">
      <line x1="8" y1="96" x2="226" y2="96" stroke={BRAND_COLOR} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.3" />
      {upper.map((def) => <StaticTooth key={def.id} def={def} record={teethData[def.id]} />)}
      {lower.map((def) => <StaticTooth key={def.id} def={def} record={teethData[def.id]} />)}
    </svg>
  );
}

function FieldBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ width: '48%', border: `0.5px solid ${SECONDARY_COLOR}`, borderRadius: 4, padding: 8, backgroundColor: '#fafafa', marginBottom: 6 }}>
      <div style={{ fontSize: 8, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 11, color: value ? '#1e293b' : '#cbd5e1', fontWeight: 500, fontStyle: value ? 'normal' : 'italic' }}>{value || '—'}</div>
    </div>
  );
}

function Tag({ label, color = 'brand' }: { label: string; color?: 'brand' | 'amber' | 'green' }) {
  const colors = { brand: { bg: '#f3e8f7', text: BRAND_COLOR }, amber: { bg: '#fef3c7', text: '#92400e' }, green: { bg: '#dcfce7', text: '#166534' } };
  const c = colors[color];
  return <span style={{ display: 'inline-block', fontSize: 9, padding: '3px 8px', borderRadius: 4, backgroundColor: c.bg, color: c.text, margin: '2px 3px 2px 0', fontWeight: 600 }}>{label}</span>;
}

function BrandLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: BRAND_COLOR, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6, flexShrink: 0 }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 32, height: 32 }}>
          <polygon points="55,58 72,52 80,44 74,30 62,28 50,34 42,44 44,58" fill="#ffffff" />
          <polygon points="62,28 74,30 78,18 72,10 62,12 56,20 58,28" fill="#ffffff" />
          <polygon points="72,10 80,12 82,20 78,18" fill="#ffffff" />
          <polygon points="78,10 82,4 86,8 82,12" fill="#ffffff" />
          <polygon points="80,16 88,18 86,24 80,22" fill="#ffffff" />
          <polygon points="50,58 54,58 56,70 60,78 56,80 52,72 48,62" fill="#ffffff" />
          <polygon points="44,58 48,58 48,72 44,78 40,76 42,68 40,58" fill="#ffffff" />
          <polygon points="70,58 74,56 76,68 72,76 68,74 70,66 68,58" fill="#ffffff" />
          <polygon points="62,60 66,60 64,72 60,80 56,78 60,68 60,60" fill="#ffffff" />
          <polygon points="80,44 88,40 90,52 84,58 78,56 80,50" fill="#ffffff" />
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: BRAND_COLOR, letterSpacing: 1 }}>EquiDentum</div>
        <div style={{ fontSize: 8, color: '#64748b', marginTop: 2, letterSpacing: 0.5 }}>Equine Dental Report System</div>
      </div>
    </div>
  );
}

export function ReportPreview({ data }: { data: DentalReportData }) {
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
      <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_COLOR, marginBottom: 6, marginTop: 14, paddingBottom: 3, borderBottom: `0.5px solid ${SECONDARY_COLOR}`, textTransform: 'uppercase', letterSpacing: 0.5 }}>Client &amp; Administrative Information</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <FieldBox label="Client Name" value={data.clientName} />
        <FieldBox label="Phone" value={data.phone} />
        <FieldBox label="Email" value={data.email} />
        <FieldBox label="Stable Location" value={data.stableLocation} />
        <FieldBox label="Date of Exam" value={formattedDate} />
      </div>

      {/* Patient */}
      <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_COLOR, marginBottom: 6, marginTop: 14, paddingBottom: 3, borderBottom: `0.5px solid ${SECONDARY_COLOR}`, textTransform: 'uppercase', letterSpacing: 0.5 }}>Patient Information</div>
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
          <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_COLOR, marginBottom: 6, marginTop: 14, paddingBottom: 3, borderBottom: `0.5px solid ${SECONDARY_COLOR}`, textTransform: 'uppercase', letterSpacing: 0.5 }}>Sedation Record</div>
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
      <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_COLOR, marginBottom: 6, marginTop: 14, paddingBottom: 3, borderBottom: `0.5px solid ${SECONDARY_COLOR}`, textTransform: 'uppercase', letterSpacing: 0.5 }}>Dental Arcade Chart</div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 8, marginTop: 6 }}>
        {(Object.keys(C) as ToothStatus[]).map((s) => {
          const c = C[s];
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, border: `1px solid ${c.stroke}`, backgroundColor: c.fill }} />
              <span style={{ fontSize: 8, color: '#64748b' }}>{c.label}</span>
            </div>
          );
        })}
      </div>

      {/* SVG arcade charts */}
      <div style={{ display: 'flex', gap: 20, justifyContent: 'space-between', border: `0.5px solid ${SECONDARY_COLOR}`, borderRadius: 4, padding: 12, marginBottom: 6 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: BRAND_COLOR, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Right Side — Quads 1 &amp; 4</div>
          <ArcadeSVG upper={URX} lower={LRX} teethData={data.teeth} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: BRAND_COLOR, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Left Side — Quads 2 &amp; 3</div>
          <ArcadeSVG upper={ULX} lower={LLX} teethData={data.teeth} />
        </div>
      </div>

      {/* Pathologies */}
      {checkedPathologies.length > 0 && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_COLOR, marginBottom: 4, marginTop: 14, paddingBottom: 3, borderBottom: `0.5px solid ${SECONDARY_COLOR}`, textTransform: 'uppercase', letterSpacing: 0.5 }}>Pathologies Identified</div>
          <div>{checkedPathologies.map((p) => <Tag key={p.id} label={p.label} color="amber" />)}</div>
        </>
      )}

      {/* Soft tissue */}
      {checkedSoftTissue.length > 0 && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_COLOR, marginBottom: 4, marginTop: 14, paddingBottom: 3, borderBottom: `0.5px solid ${SECONDARY_COLOR}`, textTransform: 'uppercase', letterSpacing: 0.5 }}>Soft Tissue Evaluation</div>
          <div>{checkedSoftTissue.map((s) => <Tag key={s.id} label={s.label} color={s.label.includes('normal') ? 'green' : 'amber'} />)}</div>
        </>
      )}

      {/* Charting notes */}
      {data.chartingNotes && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_COLOR, marginBottom: 4, marginTop: 14, paddingBottom: 3, borderBottom: `0.5px solid ${SECONDARY_COLOR}`, textTransform: 'uppercase', letterSpacing: 0.5 }}>Charting Notes</div>
          <div style={{ border: `0.5px solid ${SECONDARY_COLOR}`, borderRadius: 4, padding: 10, backgroundColor: '#fafafa', fontSize: 10, color: '#334155', lineHeight: 1.5 }}>{data.chartingNotes}</div>
        </>
      )}

      {/* Treatments */}
      {checkedTreatments.length > 0 && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_COLOR, marginBottom: 4, marginTop: 14, paddingBottom: 3, borderBottom: `0.5px solid ${SECONDARY_COLOR}`, textTransform: 'uppercase', letterSpacing: 0.5 }}>Procedures Performed</div>
          <div>{checkedTreatments.map((t) => <Tag key={t.id} label={t.label} color="brand" />)}</div>
        </>
      )}

      {/* Recommendations */}
      <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_COLOR, marginBottom: 6, marginTop: 14, paddingBottom: 3, borderBottom: `0.5px solid ${SECONDARY_COLOR}`, textTransform: 'uppercase', letterSpacing: 0.5 }}>Recommendations</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <FieldBox label="Follow-Up Timeline" value={data.followUpTimeline} />
        <FieldBox label="Diet Recommendations" value={data.dietRecommendations} />
      </div>
      {data.additionalNotes && (
        <div style={{ border: `0.5px solid ${SECONDARY_COLOR}`, borderRadius: 4, padding: 10, backgroundColor: '#fafafa', fontSize: 10, color: '#334155', lineHeight: 1.5, marginTop: 6 }}>{data.additionalNotes}</div>
      )}

      {/* Signature */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, gap: 20 }}>
        <div style={{ width: '48%' }}>
          {data.signature ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.signature} style={{ width: 200, height: 70, objectFit: 'contain' }} alt="signature" />
          ) : (
            <div style={{ height: 70 }} />
          )}
          <div style={{ borderBottom: '1px solid #1e293b', marginTop: 8, paddingBottom: 4 }} />
          <div style={{ fontSize: 8, color: '#64748b', textTransform: 'uppercase', marginTop: 4, letterSpacing: 0.5, fontWeight: 600 }}>{data.practitionerName || 'Practitioner'} — {data.practitionerCredentials || 'DVM'}</div>
          {data.clinicName && <div style={{ fontSize: 8, color: '#64748b', textTransform: 'uppercase', marginTop: 2, letterSpacing: 0.5, fontWeight: 600 }}>{data.clinicName}</div>}
        </div>
        <div style={{ width: '48%' }}>
          <div style={{ height: 70 }} />
          <div style={{ borderBottom: '1px solid #1e293b', marginTop: 8, paddingBottom: 4 }} />
          <div style={{ fontSize: 8, color: '#64748b', textTransform: 'uppercase', marginTop: 4, letterSpacing: 0.5, fontWeight: 600 }}>Owner Acknowledgement</div>
          <div style={{ fontSize: 8, color: '#64748b', textTransform: 'uppercase', marginTop: 2, letterSpacing: 0.5, fontWeight: 600 }}>Date: {data.signatureDate || formattedDate}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', marginTop: 30, borderTop: `0.5px solid ${SECONDARY_COLOR}`, paddingTop: 6, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 8, color: '#94a3b8' }}>EquiDentum — Generated {new Date().toLocaleDateString()}</span>
        <span style={{ fontSize: 8, color: '#94a3b8' }}>Confidential Veterinary Document</span>
      </div>
    </div>
  );
}
