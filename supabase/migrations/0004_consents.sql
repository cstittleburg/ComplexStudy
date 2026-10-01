-- Shift Ready: a record of each account accepting a version of the terms of service and privacy policy.
-- Only adds a table; safe to run on the live database.

create table if not exists public.consents (
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  version     text not null,               -- e.g. 2026-10-draft; bump it in legal.js when the documents change
  accepted_at timestamptz not null,
  recorded_at timestamptz not null default now(),
  primary key (user_id, version)
);

alter table public.consents enable row level security;
grant select, insert on table public.consents to authenticated;

drop policy if exists "consents: owner can read" on public.consents;
create policy "consents: owner can read" on public.consents
  for select using (auth.uid() = user_id);
drop policy if exists "consents: owner can insert" on public.consents;
create policy "consents: owner can insert" on public.consents
  for insert with check (auth.uid() = user_id);
