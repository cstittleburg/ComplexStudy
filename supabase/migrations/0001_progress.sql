-- Shift Ready: one progress row per signed-in user. Run this in the Supabase SQL editor
-- (or with the Supabase CLI) on the project you create for the app.

create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Each user can read and write only their own row.
create policy "progress: owner can read" on public.progress
  for select using (auth.uid() = user_id);
create policy "progress: owner can insert" on public.progress
  for insert with check (auth.uid() = user_id);
create policy "progress: owner can update" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
