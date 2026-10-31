'use client';

import { useRef, useState } from 'react';
import { Camera, ImagePlus, Loader2, Trash2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { MAX_REPORT_PHOTOS, ReportPhoto } from '@/lib/types';
import { DENTAL_CHART_SIDES } from '@/components/dental/dentalData';

/** Longest edge after resize. 1280 px is plenty for an A4 report image
 * (printed at ~2 per row) while keeping each photo around 100–200 KB. */
const MAX_EDGE = 1280;
const JPEG_QUALITY = 0.8;

const NO_TOOTH = '__none__';

/** Every Triadan number on the chart, in display order, for the
 * "which tooth is this?" dropdown. */
const ALL_TOOTH_NUMBERS: string[] = DENTAL_CHART_SIDES.flatMap((s) => s.regions.map((r) => r.toothNumber)).sort(
  (a, b) => Number(a) - Number(b)
);

/**
 * Downscales and re-encodes an image file in the browser so it can live
 * inside the localStorage draft (which has a ~5 MB cap per site). Uses
 * createImageBitmap when available so EXIF orientation is honoured —
 * phone photos otherwise come out sideways.
 */
async function compressImage(file: File): Promise<string> {
  const bitmap = await loadBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  // Flatten transparency (PNG/HEIC screenshots) onto white, since JPEG
  // has no alpha and black backgrounds look like a failed capture.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  if ('close' in bitmap) bitmap.close();
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      // fall through to the <img> path (older Safari, unsupported codecs)
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read ${file.name}`));
    };
    img.src = url;
  });
}

interface PhotoUploadProps {
  photos: ReportPhoto[];
  onChange: (next: ReportPhoto[]) => void;
}

export function PhotoUpload({ photos, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = MAX_REPORT_PHOTOS - photos.length;

  const addFiles = async (files: FileList | File[]) => {
    const images = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (images.length === 0) return;
    if (remaining <= 0) {
      setError(`Maximum of ${MAX_REPORT_PHOTOS} photos per report.`);
      return;
    }
    const accepted = images.slice(0, remaining);
    setError(
      accepted.length < images.length
        ? `Only ${accepted.length} of ${images.length} added — maximum of ${MAX_REPORT_PHOTOS} photos per report.`
        : null
    );
    setBusy(true);
    try {
      const added: ReportPhoto[] = [];
      for (const file of accepted) {
        try {
          added.push({
            id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            dataUrl: await compressImage(file),
            caption: '',
            toothNumber: '',
          });
        } catch {
          setError(`Could not read "${file.name}" — is it an image?`);
        }
      }
      if (added.length > 0) onChange([...photos, ...added]);
    } finally {
      setBusy(false);
    }
  };

  const update = (id: string, patch: Partial<ReportPhoto>) =>
    onChange(photos.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const remove = (id: string) => onChange(photos.filter((p) => p.id !== id));

  return (
    <div className="space-y-4">
      {/* Drop zone / pickers */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void addFiles(e.dataTransfer.files);
        }}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors',
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40'
        )}
      >
        {busy ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : (
          <ImagePlus className="h-6 w-6 text-slate-400" />
        )}
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {busy ? 'Compressing…' : 'Drag photos here, or'}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            disabled={busy || remaining <= 0}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 touch-target"
          >
            <ImagePlus className="h-4 w-4" /> Choose files
          </button>
          <button
            type="button"
            disabled={busy || remaining <= 0}
            onClick={() => cameraRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 touch-target"
          >
            <Camera className="h-4 w-4" /> Take photo
          </button>
        </div>
        <p className="text-xs text-slate-400">
          {photos.length} / {MAX_REPORT_PHOTOS} · JPEG, PNG or HEIC · resized automatically
        </p>
        {/* Two inputs: a plain picker (gallery / files) and one with
            `capture` so phones open the rear camera directly. */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void addFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {error && <p className="text-sm text-amber-700 dark:text-amber-400">{error}</p>}

      {/* Thumbnails */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element -- data URL, not an optimizable asset */}
                <img src={photo.dataUrl} alt={photo.caption || `Clinical photograph ${idx + 1}`} className="h-full w-full object-contain" />
                <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(photo.id)}
                  aria-label={`Remove photo ${idx + 1}`}
                  className="absolute right-2 top-2 rounded-md bg-white/90 p-1.5 text-slate-500 shadow hover:text-destructive dark:bg-slate-900/90"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2 p-2.5">
                <Input
                  value={photo.caption}
                  onChange={(e) => update(photo.id, { caption: e.target.value })}
                  placeholder="Caption (e.g. buccal ulcer opposite 108)"
                  className="h-9 text-sm"
                />
                <Select
                  value={photo.toothNumber || NO_TOOTH}
                  onValueChange={(v) => update(photo.id, { toothNumber: v === NO_TOOTH ? '' : v })}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Linked tooth (optional)" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    <SelectItem value={NO_TOOTH}>No specific tooth</SelectItem>
                    {ALL_TOOTH_NUMBERS.map((n) => (
                      <SelectItem key={n} value={n}>
                        Tooth {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
