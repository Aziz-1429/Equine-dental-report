'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import {
  User, Heart, Bone, Stethoscope, FileCheck, Check,
  ChevronLeft, ChevronRight, Save, RotateCcw, WifiOff, Cloud, List,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';
import {
  DentalReportData, createInitialReport,
} from '@/lib/types';
import { loadDraft, saveDraft, clearDraft, getSavedTimestamp } from '@/lib/storage';
import { saveReport } from '@/lib/supabase';
import { Step1Administrative } from '@/components/wizard/step1-administrative';
import { Step2Patient } from '@/components/wizard/step2-patient';
import { Step3Charting } from '@/components/wizard/step3-charting';
import { Step4Treatment } from '@/components/wizard/step4-treatment';
import { Step5Finalize } from '@/components/wizard/step5-finalize';

const STEPS = [
  { id: 1, label: 'Admin Info', icon: User },
  { id: 2, label: 'Patient', icon: Heart },
  { id: 3, label: 'Charting', icon: Bone },
  { id: 4, label: 'Treatment', icon: Stethoscope },
  { id: 5, label: 'Finalize', icon: FileCheck },
] as const;

function HomeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [showSaved, setShowSaved] = useState(false);
  const [dbSaving, setDbSaving] = useState(false);
  const [dbId, setDbId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const methods = useForm<DentalReportData>({
    defaultValues: createInitialReport(),
    mode: 'onChange',
  });

  const { watch, reset, getValues } = methods;
  const formData = watch();

  // Load draft or saved report on mount
  useEffect(() => {
    const reportId = searchParams.get('id');
    if (reportId) {
      (async () => {
        try {
          const { supabase } = await import('@/lib/supabase');
          const { data, error } = await supabase
            .from('dental_reports')
            .select('*')
            .eq('id', reportId)
            .maybeSingle();
          if (error) throw error;
          if (data) {
            reset(data.report_data as DentalReportData);
            setDbId(data.id);
            setSavedAt(new Date(data.updated_at));
          } else {
            setLoadError('Report not found. Starting a new one.');
            const draft = loadDraft();
            reset(draft);
            setSavedAt(getSavedTimestamp());
          }
        } catch {
          setLoadError('Could not load report from database. Using local draft.');
          const draft = loadDraft();
          reset(draft);
          setSavedAt(getSavedTimestamp());
        }
        setMounted(true);
      })();
    } else {
      const draft = loadDraft();
      reset(draft);
      setSavedAt(getSavedTimestamp());
      setMounted(true);
    }
  }, [reset, searchParams]);

  // Track online status
  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  // Local auto-save with debounce
  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      saveDraft(getValues());
      setSavedAt(new Date());
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }, 800);
    return () => clearTimeout(timer);
  }, [formData, mounted, getValues]);

  // Database auto-save (debounced, only if online)
  useEffect(() => {
    if (!mounted || !isOnline) return;
    if (!formData.clientName && !formData.horseName) return;
    const timer = setTimeout(async () => {
      setDbSaving(true);
      try {
        const saved = await saveReport(getValues(), 'draft', dbId || undefined);
        if (!dbId) setDbId(saved.id);
      } catch {
        // silently fail — local save still works
      } finally {
        setDbSaving(false);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [formData, mounted, isOnline, dbId, getValues]);

  const handleReset = () => {
    if (confirm('Clear all form data and start a new report? This cannot be undone.')) {
      clearDraft();
      reset(createInitialReport());
      setCurrentStep(0);
      setSavedAt(null);
      setDbId(null);
      router.push('/');
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < STEPS.length) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const next = () => goToStep(currentStep + 1);
  const prev = () => goToStep(currentStep - 1);
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
          <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <Logo />

              <div className="flex items-center gap-2">
                {showSaved && (
                  <Badge variant="secondary" className="animate-in fade-in duration-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <Cloud className="mr-1 h-3 w-3" /> Saved
                  </Badge>
                )}
                {dbSaving && (
                  <Badge variant="secondary" className="animate-in fade-in duration-300 bg-primary/10 text-primary">
                    <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-primary" /> Syncing
                  </Badge>
                )}
                {!isOnline && (
                  <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
                    <WifiOff className="mr-1 h-3 w-3" /> Offline
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={() => router.push('/reports')} className="text-slate-600 dark:text-slate-400">
                  <List className="mr-1.5 h-3.5 w-3.5" /> Reports
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-600 hover:text-destructive dark:text-slate-400">
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> New
                </Button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <Progress value={progress} className="h-1.5 flex-1" />
              <span className="shrink-0 text-xs font-medium text-slate-500">
                {currentStep + 1} / {STEPS.length}
              </span>
            </div>
          </div>
        </header>

        <nav className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="no-scrollbar flex items-center gap-1 overflow-x-auto py-2">
              {STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isActive = idx === currentStep;
                const isComplete = idx < currentStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => goToStep(idx)}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all touch-target ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isComplete
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isComplete ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="sm:hidden">{step.id}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          {loadError && (
            <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
              {loadError}
            </div>
          )}
          {savedAt && (
            <div className="mb-4 flex items-center gap-1.5 text-xs text-slate-400">
              <Save className="h-3 w-3" />
              <span>
                Auto-saved at {savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}

          <div key={currentStep} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {currentStep === 0 && <Step1Administrative />}
            {currentStep === 1 && <Step2Patient />}
            {currentStep === 2 && <Step3Charting />}
            {currentStep === 3 && <Step4Treatment />}
            {currentStep === 4 && <Step5Finalize dbId={dbId} />}
          </div>

          <Separator className="my-6" />

          <div className="flex items-center justify-between gap-3 pb-8">
            <Button variant="outline" onClick={prev} disabled={currentStep === 0} size="lg" className="touch-target">
              <ChevronLeft className="mr-1 h-5 w-5" /> Back
            </Button>
            <div className="hidden text-center text-xs text-slate-400 sm:block">
              Step {currentStep + 1} of {STEPS.length}
            </div>
            {currentStep < STEPS.length - 1 ? (
              <Button onClick={next} size="lg" className="touch-target">
                Next <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            ) : (
              <Button onClick={() => router.push('/reports')} variant="secondary" size="lg" className="touch-target">
                <Check className="mr-1 h-5 w-5" /> Done
              </Button>
            )}
          </div>
        </main>
      </div>
    </FormProvider>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <HomeInner />
    </Suspense>
  );
}
