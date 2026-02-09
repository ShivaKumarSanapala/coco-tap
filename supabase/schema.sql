-- Run this in Supabase SQL Editor to create the samples table.
-- No RLS needed for hackathon; use anon key with permissive policies if you prefer.

create table if not exists public.samples (
  id uuid primary key default gen_random_uuid(),
  audio_path text not null,
  label text not null check (label in ('tender', 'medium', 'mature')),
  environment text check (environment in ('indoor', 'outdoor')),
  num_taps smallint check (num_taps in (3, 4, 5)),
  recording_duration_sec numeric(5,2),
  recorded_at timestamptz not null default now(),
  device_type text,
  browser text,
  os text,
  created_at timestamptz not null default now()
);

-- Allow anon insert/select for no-auth uploads (hackathon).
alter table public.samples enable row level security;

drop policy if exists "Allow anon insert" on public.samples;
create policy "Allow anon insert"
  on public.samples for insert
  to anon
  with check (true);

drop policy if exists "Allow anon select" on public.samples;
create policy "Allow anon select"
  on public.samples for select
  to anon
  using (true);
