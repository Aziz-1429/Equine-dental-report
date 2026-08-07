'use client';

import { ToothStatus, ToothRecord } from '@/lib/types';

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  normal:    { fill: '#ffffff', stroke: '#94a3b8', text: '#334155', label: 'Normal' },
  attention: { fill: '#fef3c7', stroke: '#f59e0b', text: '#92400e', label: 'Attention' },
  pathology: { fill: '#fee2e2', stroke: '#ef4444', text: '#991b1b', label: 'Pathology' },
  absent:    { fill: '#e2e8f0', stroke: '#64748b', text: '#94a3b8', label: 'Absent'   },
} as const;

const STATUS_ORDER: ToothStatus[] = ['normal', 'attention', 'pathology', 'absent'];
export function cycleStatus(s: ToothStatus): ToothStatus {
  return STATUS_ORDER[(STATUS_ORDER.indexOf(s) + 1) % STATUS_ORDER.length];
}

// ─── Skull silhouette backdrop ────────────────────────────────────────────────
// A stylized horse-skull side profile drawn in the same 234×180 coordinate
// space as the tooth grid below, so it frames the chart like an anatomical
// diagram. Base orientation has the muzzle on the left (incisors near x≈10);
// panels whose incisors sit on the right instead (`flip`) mirror it.
export function SkullBackdrop({ flip = false }: { flip?: boolean }) {
  return (
    <g transform={flip ? 'translate(234,0) scale(-1,1)' : undefined}>
      <path
        d="M4,66
           C4,58 7,53 12,52
           C15,42 24,33 36,27
           C62,16 96,10 132,8
           C158,7 182,8 200,12
           C204,4 210,0 216,1
           C220,4 220,10 216,15
           C222,24 226,42 224,62
           C227,72 227,88 223,98
           C226,108 223,120 214,124
           C207,136 192,146 170,151
           C142,158 106,161 74,157
           C50,154 32,148 20,139
           C11,142 5,137 6,129
           C11,124 15,118 16,111
           C8,103 3,90 3,78
           C2,74 3,69 4,66 Z"
        fill="none"
        stroke="#94a3b8"
        strokeWidth={1.4}
        opacity={0.5}
      />
      <circle cx={178} cy={42} r={9} fill="none" stroke="#94a3b8" strokeWidth={1.2} opacity={0.5} />
      <path
        d="M10,58 C8,62 8,68 12,71 C16,68 16,61 12,58 Z"
        fill="none"
        stroke="#94a3b8"
        strokeWidth={1.2}
        opacity={0.5}
      />
    </g>
  );
}

// ─── Tooth geometry helpers ──────────────────────────────────────────────────
type ToothDef = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
  ry?: number;
  label?: string;
};

// Upper arcade right side: 111 110 109 | 108 107 106 [gap] 104 103 102 101
const URX: ToothDef[] = [
  { id:'111', x:10,  y:30, w:22, h:60, rx:4 },
  { id:'110', x:34,  y:30, w:22, h:60, rx:4 },
  { id:'109', x:58,  y:30, w:22, h:60, rx:4 },
  { id:'108', x:86,  y:32, w:20, h:56, rx:4 },
  { id:'107', x:108, y:32, w:20, h:56, rx:4 },
  { id:'106', x:130, y:32, w:20, h:56, rx:4 },
  { id:'104', x:166, y:36, w:14, h:48, rx:5 },
  { id:'103', x:182, y:40, w:12, h:42, rx:5 },
  { id:'102', x:196, y:42, w:12, h:38, rx:5 },
  { id:'101', x:210, y:44, w:12, h:34, rx:5 },
];

// Lower arcade right side: 411 410 409 | 408 407 406 [gap] 404 403 402 401
const LRX: ToothDef[] = [
  { id:'411', x:10,  y:108, w:22, h:54, rx:4 },
  { id:'410', x:34,  y:108, w:22, h:54, rx:4 },
  { id:'409', x:58,  y:108, w:22, h:54, rx:4 },
  { id:'408', x:86,  y:110, w:20, h:50, rx:4 },
  { id:'407', x:108, y:110, w:20, h:50, rx:4 },
  { id:'406', x:130, y:110, w:20, h:50, rx:4 },
  { id:'404', x:166, y:114, w:14, h:42, rx:5 },
  { id:'403', x:182, y:118, w:12, h:36, rx:5 },
  { id:'402', x:196, y:120, w:12, h:32, rx:5 },
  { id:'401', x:210, y:122, w:12, h:28, rx:5 },
];

// Left-side arcade (quadrants 2 & 3 — teeth 201-211, 301-311)
const ULX: ToothDef[] = [
  { id:'201', x:10,  y:44, w:12, h:34, rx:5 },
  { id:'202', x:24,  y:42, w:12, h:38, rx:5 },
  { id:'203', x:38,  y:40, w:12, h:42, rx:5 },
  { id:'204', x:52,  y:36, w:14, h:48, rx:5 },
  { id:'206', x:82,  y:32, w:20, h:56, rx:4 },
  { id:'207', x:104, y:32, w:20, h:56, rx:4 },
  { id:'208', x:126, y:32, w:20, h:56, rx:4 },
  { id:'209', x:150, y:30, w:22, h:60, rx:4 },
  { id:'210', x:174, y:30, w:22, h:60, rx:4 },
  { id:'211', x:198, y:30, w:22, h:60, rx:4 },
];

const LLX: ToothDef[] = [
  { id:'301', x:10,  y:122, w:12, h:28, rx:5 },
  { id:'302', x:24,  y:120, w:12, h:32, rx:5 },
  { id:'303', x:38,  y:118, w:12, h:36, rx:5 },
  { id:'304', x:52,  y:114, w:14, h:42, rx:5 },
  { id:'306', x:82,  y:110, w:20, h:50, rx:4 },
  { id:'307', x:104, y:110, w:20, h:50, rx:4 },
  { id:'308', x:126, y:110, w:20, h:50, rx:4 },
  { id:'309', x:150, y:108, w:22, h:54, rx:4 },
  { id:'310', x:174, y:108, w:22, h:54, rx:4 },
  { id:'311', x:198, y:108, w:22, h:54, rx:4 },
];

// ─── Sub-component: Single interactive tooth ─────────────────────────────────
function SvgTooth({
  def,
  record,
  onClick,
  compact = false,
}: {
  def: ToothDef;
  record: ToothRecord;
  onClick: () => void;
  compact?: boolean;
}) {
  const c = C[record.status];
  const fs = def.w < 14 ? 6.5 : compact ? 7 : 8;
  const cx = def.x + def.w / 2;
  const cy = def.y + def.h / 2;

  return (
    <g
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label={`Tooth ${def.id} — ${c.label}`}
    >
      <rect
        x={def.x}
        y={def.y}
        width={def.w}
        height={def.h}
        rx={def.rx ?? 3}
        ry={def.ry ?? def.rx ?? 3}
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth={1.5}
        style={{ transition: 'all 0.15s ease' }}
      />
      <line
        x1={def.x + 3}
        y1={def.y + 4}
        x2={def.x + def.w - 3}
        y2={def.y + 4}
        stroke={c.stroke}
        strokeWidth={0.8}
        opacity={0.5}
      />
      <text
        x={cx}
        y={cy + fs / 3}
        textAnchor="middle"
        fontSize={fs}
        fontWeight="700"
        fill={c.text}
        fontFamily="system-ui, sans-serif"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {def.id}
      </text>
    </g>
  );
}

// ─── One complete side-view panel ─────────────────────────────────────────────
function ArcadePanel({
  title,
  upperTeeth,
  lowerTeeth,
  teethData,
  onToggle,
  viewBox,
  molarsOnLeft,
}: {
  title: string;
  upperTeeth: ToothDef[];
  lowerTeeth: ToothDef[];
  teethData: Record<string, ToothRecord>;
  onToggle: (id: string) => void;
  viewBox: string;
  molarsOnLeft: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="text-center text-xs font-bold uppercase tracking-widest text-slate-400">
        {title}
      </div>
      <div className="overflow-x-auto rounded-xl border border-[#E8E8E8] bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <svg
          viewBox={viewBox}
          width="100%"
          style={{ minWidth: 260, display: 'block' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="234" height="180" fill="transparent" />

          <SkullBackdrop flip={molarsOnLeft} />

          {/* Jaw labels */}
          <text x="2" y="22" fontSize="8" fontWeight="700" fill="#441752" fontFamily="system-ui" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }} opacity={0.8}>
            UPPER
          </text>
          <text x="2" y="174" fontSize="8" fontWeight="700" fill="#441752" fontFamily="system-ui" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }} opacity={0.8}>
            LOWER
          </text>

          {/* Occlusal plane dashed line */}
          <line x1="8" y1="96" x2="226" y2="96" stroke="#441752" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.3" />
          <text x="100" y="94" fontSize="6.5" fill="#441752" fontFamily="system-ui" opacity="0.45" textAnchor="middle">
            OCCLUSAL PLANE
          </text>

          {/* Group labels */}
          {molarsOnLeft ? (
            <>
              <text x="11" y="27" fontSize="7" fill="#64748b" fontFamily="system-ui">Molars</text>
              <text x="83" y="27" fontSize="7" fill="#64748b" fontFamily="system-ui">Premolars</text>
              <text x="158" y="27" fontSize="7" fill="#64748b" fontFamily="system-ui">Canine / Incisor</text>
            </>
          ) : (
            <>
              <text x="11" y="27" fontSize="7" fill="#64748b" fontFamily="system-ui">Incisor / Canine</text>
              <text x="82" y="27" fontSize="7" fill="#64748b" fontFamily="system-ui">Premolars</text>
              <text x="152" y="27" fontSize="7" fill="#64748b" fontFamily="system-ui">Molars</text>
            </>
          )}

          {/* Upper teeth */}
          {upperTeeth.map((def) => (
            <SvgTooth
              key={def.id}
              def={def}
              record={teethData[def.id] ?? { id: def.id, status: 'normal' }}
              onClick={() => onToggle(def.id)}
            />
          ))}

          {/* Lower teeth */}
          {lowerTeeth.map((def) => (
            <SvgTooth
              key={def.id}
              def={def}
              record={teethData[def.id] ?? { id: def.id, status: 'normal' }}
              onClick={() => onToggle(def.id)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

// ─── Exported interactive chart ───────────────────────────────────────────────
export function DentalArcadeChart({
  teethData,
  onToggle,
}: {
  teethData: Record<string, ToothRecord>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#E8E8E8] bg-[#fafafa] px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
        <span className="text-xs font-semibold text-slate-500">Tap tooth to cycle:</span>
        {STATUS_ORDER.map((s) => {
          const cfg = C[s];
          return (
            <div key={s} className="flex items-center gap-1.5">
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: cfg.fill, border: `1.5px solid ${cfg.stroke}` }}
              />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Right side arcade — quadrants 1 (upper) & 4 (lower) */}
      <ArcadePanel
        title="Right Side — Quadrants 1 & 4"
        upperTeeth={URX}
        lowerTeeth={LRX}
        teethData={teethData}
        onToggle={onToggle}
        viewBox="0 0 234 180"
        molarsOnLeft={true}
      />

      {/* Left side arcade — quadrants 2 (upper) & 3 (lower) */}
      <ArcadePanel
        title="Left Side — Quadrants 2 & 3"
        upperTeeth={ULX}
        lowerTeeth={LLX}
        teethData={teethData}
        onToggle={onToggle}
        viewBox="0 0 234 180"
        molarsOnLeft={false}
      />
    </div>
  );
}

// ─── Static read-only version for the PDF report ──────────────────────────────
function StaticTooth({ def, record }: { def: ToothDef; record?: ToothRecord }) {
  const status = record?.status ?? 'normal';
  const c = C[status];
  const fs = def.w < 14 ? 6 : 7;
  const cx = def.x + def.w / 2;
  const cy = def.y + def.h / 2;
  return (
    <g key={def.id}>
      <rect x={def.x} y={def.y} width={def.w} height={def.h} rx={def.rx ?? 3} fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
      <text x={cx} y={cy + fs / 3} textAnchor="middle" fontSize={fs} fontWeight="700" fill={c.text} fontFamily="Helvetica, sans-serif">
        {def.id}
      </text>
    </g>
  );
}

function StaticArcadeSVG({
  upper,
  lower,
  teethData,
  flip,
}: {
  upper: ToothDef[];
  lower: ToothDef[];
  teethData: Record<string, ToothRecord>;
  flip: boolean;
}) {
  return (
    <svg viewBox="0 0 234 180" width="100%" style={{ maxWidth: 350, display: 'block' }} xmlns="http://www.w3.org/2000/svg">
      <SkullBackdrop flip={flip} />
      <line x1="8" y1="96" x2="226" y2="96" stroke="#441752" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.3" />
      {upper.map((def) => (
        <StaticTooth key={def.id} def={def} record={teethData[def.id]} />
      ))}
      {lower.map((def) => (
        <StaticTooth key={def.id} def={def} record={teethData[def.id]} />
      ))}
    </svg>
  );
}

export function DentalArcadeChartStatic({
  teethData,
}: {
  teethData: Record<string, ToothRecord>;
}) {
  return (
    <div style={{ display: 'flex', gap: 20, justifyContent: 'space-between' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: '#441752', letterSpacing: 0.5, marginBottom: 4 }}>
          RIGHT SIDE — QUADS 1 &amp; 4
        </div>
        <StaticArcadeSVG upper={URX} lower={LRX} teethData={teethData} flip={true} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: '#441752', letterSpacing: 0.5, marginBottom: 4 }}>
          LEFT SIDE — QUADS 2 &amp; 3
        </div>
        <StaticArcadeSVG upper={ULX} lower={LLX} teethData={teethData} flip={false} />
      </div>
    </div>
  );
}
