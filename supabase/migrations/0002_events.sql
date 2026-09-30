-- Shift Ready: one row per answered item, so study patterns can be looked at across students.
--
-- This only ADDS a table. It does not touch the existing `progress` table, so it is safe to run on a database
-- the live app is using: the current app never reads or writes `events`. Run it in the Supabase SQL editor
-- (practice database first), or with the Supabase CLI. Running it twice is harmless.
--
-- What goes in a row: when, which course, which practice mode and study method, the topic area, the score and
-- time taken, and a short fingerprint of the item. Never the text of the student's course material.

create table if not exists public.events (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  cid        text not null,                 -- client event id (time + fingerprint); makes re-uploads harmless
  at         timestamptz not null,          -- when the item was answered
  course     text,                          -- course id, e.g. nurs4620
  mode       text,                          -- practice mode: case, quickfire, rhymes, trend, ...
  method     text,                          -- study method the mode belongs to: cases, questions, flashcards, ...
  area       text,                          -- topic area: resp, neuro, epi, ...
  item       text,                          -- fingerprint of the item (never its text)
  framework  text,
  step       text,
  score      real not null,
  ms         integer,                       -- time on the item, in milliseconds
  retry      boolean not null default false, -- the item had been missed before
  created_at timestamptz not null default now(),
  unique (user_id, cid)
);

create index if not exists events_user_at on public.events (user_id, at);
create index if not exists events_course_area on public.events (course, area);

alter table public.events enable row level security;
grant select, insert on table public.events to authenticated;

-- Each student can add and read only their own rows. There is no update or delete from the app: the log is
-- append-only, and deleting an account removes its rows (on delete cascade).
drop policy if exists "events: owner can read" on public.events;
create policy "events: owner can read" on public.events
  for select using (auth.uid() = user_id);
drop policy if exists "events: owner can insert" on public.events;
create policy "events: owner can insert" on public.events
  for insert with check (auth.uid() = user_id);
