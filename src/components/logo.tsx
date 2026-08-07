import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Geometric horse silhouette logo
// The horse faces right in a dressage/collected trot pose
function HorseIcon({ size = 40, color = '#441752' }: { size?: number; color?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      {/* Body — main torso polygon */}
      <polygon points="55,58 72,52 80,44 74,30 62,28 50,34 42,44 44,58" fill={color} />
      {/* Neck & head */}
      <polygon points="62,28 74,30 78,18 72,10 62,12 56,20 58,28" fill={color} />
      {/* Head detail */}
      <polygon points="72,10 80,12 82,20 78,18" fill={color} />
      {/* Ear */}
      <polygon points="78,10 82,4 86,8 82,12" fill={color} />
      {/* Muzzle / nose */}
      <polygon points="80,16 88,18 86,24 80,22" fill={color} />
      {/* Front raised leg */}
      <polygon points="50,58 54,58 56,70 60,78 56,80 52,72 48,62" fill={color} />
      {/* Front supporting leg */}
      <polygon points="44,58 48,58 48,72 44,78 40,76 42,68 40,58" fill={color} />
      {/* Hind raised leg */}
      <polygon points="70,58 74,56 76,68 72,76 68,74 70,66 68,58" fill={color} />
      {/* Hind supporting leg */}
      <polygon points="62,60 66,60 64,72 60,80 56,78 60,68 60,60" fill={color} />
      {/* Tail */}
      <polygon points="80,44 88,40 90,52 84,58 78,56 80,50" fill={color} />
      {/* Mane along neck */}
      <polygon points="64,14 68,10 72,14 68,20 64,18" fill={color} opacity="0.7" />
    </svg>
  );
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
  const titleClass = size === 'sm' ? 'text-sm font-bold' : size === 'lg' ? 'text-xl font-bold' : 'text-base font-bold';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-xl bg-primary',
          size === 'sm' ? 'h-8 w-8 rounded-lg' : size === 'lg' ? 'h-14 w-14' : 'h-10 w-10'
        )}
        style={{ padding: size === 'sm' ? 4 : size === 'lg' ? 8 : 5 }}
      >
        <HorseIcon size={iconSize - (size === 'sm' ? 8 : size === 'lg' ? 16 : 10)} color="#ffffff" />
      </div>
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
    <div
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-xl bg-primary p-1.5',
        className
      )}
    >
      <HorseIcon size={28} color="#ffffff" />
    </div>
  );
}

// For use in PDF reports (returns plain SVG string props for inline use)
export function HorseLogoForPDF({ size = 44 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        backgroundColor: '#441752',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size - 12, height: size - 12 }}
      >
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
  );
}
