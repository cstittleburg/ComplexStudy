-- Shift Ready: exam debriefs a student chose to share. A debrief describes an exam in the student's own words:
-- rough length, the mix of question formats, and the heaviest topic areas. Free-text notes never leave the
-- student's browser and are not stored here. Only adds a table and a function; safe to run on the live database.
--
-- Pooling rules (see docs/PULSEENGINE-FEASIBILITY.md, "Exam debriefs"):
--   - keyed to the course and exam ("nurs 4620|fall 2026" + "exam 1"), never to a professor;
--   - a debrief counts only once its exam date is at least 7 days past, so one section's notes cannot reach
--     another section before it sits the same exam;
--   - nothing is returned until at least 5 different students have shared; only totals come back, never rows.

create table if not exists public.exam_debriefs (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  course_key text not null,
  exam_key   text not null,
  taken_on   date not null,
  questions  integer check (questions is null or questions between 1 and 500),
  minutes    integer check (minutes is null or minutes between 1 and 600),
  formats    jsonb not null default '{}'::jsonb,  -- {"sata":0-2,"single":0-2,"case":0-2,"calc":0-2,"priority":0-2}
  heavy      text[] not null default '{}',        -- topic area ids, e.g. {resp,fluids}
  created_at timestamptz not null default now(),
  unique (user_id, course_key, exam_key)
);
create index if not exists exam_debriefs_course_exam on public.exam_debriefs (course_key, exam_key);

alter table public.exam_debriefs enable row level security;
grant select, insert, update, delete on table public.exam_debriefs to authenticated;

drop policy if exists "exam_debriefs: owner can read" on public.exam_debriefs;
create policy "exam_debriefs: owner can read" on public.exam_debriefs for select using (auth.uid() = user_id);
drop policy if exists "exam_debriefs: owner can insert" on public.exam_debriefs;
create policy "exam_debriefs: owner can insert" on public.exam_debriefs for insert with check (auth.uid() = user_id);
drop policy if exists "exam_debriefs: owner can update" on public.exam_debriefs;
create policy "exam_debriefs: owner can update" on public.exam_debriefs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "exam_debriefs: owner can delete" on public.exam_debriefs;
create policy "exam_debriefs: owner can delete" on public.exam_debriefs for delete using (auth.uid() = user_id);

-- The pooled view of one exam. Runs with the owner's rights (security definer) so it can count everyone's shared
-- debriefs, but it only ever returns totals, and nothing at all below 5 students.
create or replace function public.pooled_exam_profile(p_course text, p_exam text)
returns table (students integer, avg_questions integer, avg_minutes integer, formats jsonb, heavy jsonb)
language sql
security definer
set search_path = public
stable
as $$
  with d as (
    select * from public.exam_debriefs
    where course_key = p_course and exam_key = p_exam and taken_on <= current_date - 7
  )
  select
    (select count(distinct user_id) from d)::integer,
    (select round(avg(questions)) from d)::integer,
    (select round(avg(minutes)) from d)::integer,
    coalesce((select jsonb_object_agg(k, v) from (
      select f.key as k, round(avg(f.value::numeric), 2) as v
      from d, jsonb_each_text(d.formats) as f group by f.key) s), '{}'::jsonb),
    coalesce((select jsonb_object_agg(t, n) from (
      select h.t, count(distinct d.user_id) as n from d, unnest(d.heavy) as h(t) group by h.t) s), '{}'::jsonb)
  where (select count(distinct user_id) from d) >= 5;
$$;

revoke all on function public.pooled_exam_profile(text, text) from public;
grant execute on function public.pooled_exam_profile(text, text) to authenticated;
