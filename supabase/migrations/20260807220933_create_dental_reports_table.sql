/*
# Create dental_reports table (single-tenant, no auth)

1. New Tables
- `dental_reports`
  - `id` (uuid, primary key)
  - `report_data` (jsonb, not null) — the full DentalReportData object
  - `horse_name` (text) — denormalized for quick listing
  - `client_name` (text) — denormalized for quick listing
  - `exam_date` (text) — denormalized for quick listing
  - `status` (text, default 'draft') — 'draft' | 'finalized'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on dental_reports.
- Allow anon + authenticated full CRUD (single-tenant, no sign-in).
- USING (true) is acceptable because this is intentionally shared/public data.

3. Notes
- The app stores the entire form as JSON in report_data so the schema
  can evolve without migrations.
- Denormalized horse_name/client_name/exam_date are extracted for fast
  dashboard listing without parsing JSON.
*/

CREATE TABLE IF NOT EXISTS dental_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_data jsonb NOT NULL,
  horse_name text DEFAULT '',
  client_name text DEFAULT '',
  exam_date text DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE dental_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_dental_reports" ON dental_reports;
CREATE POLICY "anon_select_dental_reports" ON dental_reports FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_dental_reports" ON dental_reports;
CREATE POLICY "anon_insert_dental_reports" ON dental_reports FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_dental_reports" ON dental_reports;
CREATE POLICY "anon_update_dental_reports" ON dental_reports FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_dental_reports" ON dental_reports;
CREATE POLICY "anon_delete_dental_reports" ON dental_reports FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_dental_reports_created_at ON dental_reports (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dental_reports_horse_name ON dental_reports (horse_name);
