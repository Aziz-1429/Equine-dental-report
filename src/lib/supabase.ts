import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DentalReportData } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Supabase env vars are optional — the app falls back to local-only drafts
// (see lib/storage.ts) when they're not set, so we must not throw at
// import time. Callers get a clear error only if they actually try to
// reach the database without credentials configured.
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (new Proxy(
      {},
      {
        get() {
          throw new Error(
            'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
          );
        },
      }
    ) as SupabaseClient);

export interface SavedReport {
  id: string;
  report_data: DentalReportData;
  horse_name: string;
  client_name: string;
  exam_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function fetchReports(): Promise<SavedReport[]> {
  const { data, error } = await supabase
    .from('dental_reports')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data || []) as SavedReport[];
}

export async function saveReport(
  reportData: DentalReportData,
  status: string = 'draft',
  existingId?: string
): Promise<SavedReport> {
  const payload = {
    report_data: reportData as any,
    horse_name: reportData.horseName,
    client_name: reportData.clientName,
    exam_date: reportData.examDate,
    status,
    updated_at: new Date().toISOString(),
  };

  if (existingId) {
    const { data, error } = await supabase
      .from('dental_reports')
      .update(payload)
      .eq('id', existingId)
      .select('*')
      .single();
    if (error) throw error;
    return data as SavedReport;
  }

  const { data, error } = await supabase
    .from('dental_reports')
    .insert(payload)
    .select('*')
    .single();
  if (error) throw error;
  return data as SavedReport;
}

export async function deleteReport(id: string): Promise<void> {
  const { error } = await supabase
    .from('dental_reports')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
