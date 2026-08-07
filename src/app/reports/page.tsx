'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, FileText, Trash2, Calendar, User,
  ChevronRight, ArrowLeft, Search, Loader2, AlertCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/logo';
import {
  Card, CardContent,
} from '@/components/ui/card';
import { fetchReports, deleteReport, SavedReport } from '@/lib/supabase';

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReports();
      setReports(data);
    } catch {
      setError('Could not load saved reports. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this report permanently? This cannot be undone.')) return;
    try {
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert('Failed to delete report. Please try again.');
    }
  };

  const openReport = (id: string) => {
    router.push(`/?id=${id}`);
  };

  const filtered = reports.filter((r) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      r.horse_name?.toLowerCase().includes(q) ||
      r.client_name?.toLowerCase().includes(q) ||
      r.exam_date?.includes(q)
    );
  });

  const formatDate = (iso: string) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <Logo />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="text-slate-600 dark:text-slate-400"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> New Report
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Saved Reports
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            All dental examination reports stored in your database.
          </p>
        </div>

        {/* Search + New */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by horse, client, or date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-10"
            />
          </div>
          <Button onClick={() => router.push('/')} size="lg" className="touch-target">
            <Plus className="mr-2 h-5 w-5" /> New Report
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={load} className="ml-auto">
              Retry
            </Button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="mb-3 h-12 w-12 text-slate-300 dark:text-slate-700" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                {search ? 'No reports found' : 'No saved reports yet'}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? 'Try a different search term.'
                  : 'Start a new dental examination to see it here.'}
              </p>
              {!search && (
                <Button onClick={() => router.push('/')} className="mt-4" size="lg">
                  <Plus className="mr-2 h-5 w-5" /> Create New Report
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Report list */}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((report) => {
              const data = report.report_data;
              const pathologies = data?.pathologies?.filter((p) => p.checked) || [];
              const treatments = data?.treatments?.filter((t) => t.checked) || [];
              return (
                <Card
                  key={report.id}
                  className="cursor-pointer transition-all hover:border-primary hover:shadow-md dark:hover:border-primary"
                  onClick={() => openReport(report.id)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FileText className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                          {report.horse_name || 'Unnamed horse'}
                        </h3>
                        <Badge
                          variant="outline"
                          className={
                            report.status === 'finalized'
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                              : 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-400'
                          }
                        >
                          {report.status}
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {report.client_name || 'No client'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(report.exam_date)}
                        </span>
                        {pathologies.length > 0 && (
                          <span className="text-amber-600 dark:text-amber-400">
                            {pathologies.length} pathology{pathologies.length > 1 ? 'ies' : ''}
                          </span>
                        )}
                        {treatments.length > 0 && (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {treatments.length} treatment{treatments.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Updated {formatDate(report.updated_at)} at{' '}
                        {new Date(report.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDelete(report.id, e)}
                        className="h-9 w-9 text-slate-400 hover:text-destructive"
                        aria-label="Delete report"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
