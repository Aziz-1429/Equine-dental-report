import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Trotting horse silhouette — matches the EquiDentum brand mark
export function HorseIcon({ size = 40, color = '#3b1450' }: { size?: number; color?: string }) {
  return (
    <svg
      viewBox="0 0 240 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={(size * 170) / 240}
    >
      <g transform="translate(240,0) scale(-1,1)" fill={color}>
        {/* Tail */}
        <path d="M62,78 C46,84 28,95 16,113 C25,109 34,101 40,95 C34,106 27,117 24,129 C33,120 41,108 47,98 C45,104 44,110 45,116 C52,103 58,89 62,78 Z" />
        {/* Body */}
        <path d="M58,88 C56,78 62,68 74,64 L140,58 C150,57 158,60 163,66 L168,72 C170,76 170,82 168,88 L166,96 C164,104 156,110 146,110 L80,110 C66,110 55,100 58,88 Z" />
        {/* Neck */}
        <polygon points="140,58 163,66 172,24 150,48" />
        {/* Chest facet line */}
        <rect x="148" y="50" width="18" height="2.5" />
        {/* Head */}
        <polygon points="150,48 172,24 192,8 205,14 222,30 206,40 185,46 166,50" />
        {/* Mane spike */}
        <polygon points="168,26 174,22 180,4 186,10 176,20" />
        {/* Hind leg — lifted/trailing */}
        <path d="M70,106 L82,105 L84,122 L74,140 L64,136 L72,120 Z" />
        {/* Hind leg — planted */}
        <path d="M90,108 L100,108 L97,158 L89,158 L87,120 Z" />
        {/* Front leg — raised/reaching */}
        <path d="M120,102 L132,100 L138,122 L148,134 L138,142 L126,128 Z" />
        {/* Front leg — planted */}
        <path d="M142,106 L152,106 L150,158 L142,158 L140,120 Z" />
      </g>
    </svg>
  );
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const iconSize = size === 'sm' ? 34 : size === 'lg' ? 52 : 42;
  const titleClass = size === 'sm' ? 'text-sm font-bold' : size === 'lg' ? 'text-xl font-bold' : 'text-base font-bold';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <HorseIcon size={iconSize} color="#3b1450" />
      <div>
        <div className={cn(titleClass, 'tracking-tight text-slate-900 dark:text-white')}>
          EquiDentum
        </div>
        {size !== 'sm' && (
          <p className="hidden text-xs text-muted-foreground sm:block">
            Equine Dental Report System
          </p>
        )}
      </div>
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <div className={className}>
      <HorseIcon size={40} color="#3b1450" />
    </div>
  );
}

// For use in PDF reports (plain inline-styled div, no Tailwind dependency needed)
export function HorseLogoForPDF({ size = 48 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      <HorseIcon size={size} color="#3b1450" />
    </div>
  );
}
