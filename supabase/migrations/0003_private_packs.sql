-- Shift Ready: course packs that belong to one account.
--
-- At pilot cutover the professor-derived packs stop being public files and move here, readable only by the account
-- they belong to (docs/PILOT-CUTOVER.md). Students cannot add or change rows: packs are loaded by the operator in
-- the SQL editor with tools/export-private-packs.mjs. Only adds a table; safe to run on the live database.

create table if not exists public.private_packs (
  user_id    uuid not null references auth.users (id) on delete cascade,
  pack       text not null,                  -- e.g. resp, week1, pools, studyguide, community
  data       jsonb not null,                 -- { "CASES": [...], "QUICKFIRE": [...], ... } in the content-file format
  updated_at timestamptz not null default now(),
  primary key (user_id, pack)
);

alter table public.private_packs enable row level security;
grant select on table public.private_packs to authenticated;

drop policy if exists "private_packs: owner can read" on public.private_packs;
create policy "private_packs: owner can read" on public.private_packs
  for select using (auth.uid() = user_id);
