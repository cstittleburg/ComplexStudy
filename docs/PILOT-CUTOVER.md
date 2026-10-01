# Pilot cutover: the one-time steps before other students sign in

Today the app is one student's study tool, and the NURS 4620 and NURS 4510 packs ship as public files. Those packs
are built from a professor's handouts, so before anyone else gets a login they must stop being public. After this
checklist, they live in the database and load only for the account they belong to. Everyone else starts with their
own empty notebook.

Everything below is built and tested on the branch. None of it has been run against a real database.

## 1. Database (Supabase SQL editor, live project)

Run these files in order. Each one only adds tables or functions, nothing existing changes, and running one twice
is harmless. All five were tested against PostgreSQL 16, including the security rules.

1. `supabase/migrations/0002_events.sql`: one row per answered item, no item text.
2. `supabase/migrations/0003_private_packs.sql`: course packs that belong to one account.
3. `supabase/migrations/0004_consents.sql`: a record of each account accepting the terms.
4. `supabase/migrations/0005_exam_debriefs.sql`: shared exam debriefs and the pooled view (5 students minimum).

## 2. Move the packs into the owner's account

The owner must have signed in to the app at least once, so their account exists. Then, on a computer with Node:

```
node tools/export-private-packs.mjs owner@example.com > private-packs.sql
```

Paste `private-packs.sql` into the SQL editor and run it. The last line should list 5 packs: resp, week1, pools,
studyguide and community. The file contains the course material, so do not commit it or share it, and delete it
afterwards.

## 3. Stop shipping the pack files

1. In `config.js`, set `privatePacks: true` in the `LIVE` block.
2. Delete these files from the site: `content/resp.js`, `content/week1.js`, `content/pools.js`,
   `content/studyguide.js` and `content/community.js`.
3. In `index.html`, remove the five matching `<script src="content/...">` lines. Keep `registry.js`,
   `frameworks.js` and `general.js`: they are general material every student gets.
4. If the GitHub repository is public, its history still contains the files. Make the repository private, or ask
   for the history to be cleaned.

## 4. Check

- Signed out, or signed in as anyone else: the course list shows only "Create a course". ABG Decoder and the
  model flashcards still work in any course.
- Signed in as the owner: both built-in courses appear with all their content, and progress is untouched.
- Settings → Account: "Terms of Service · Privacy Policy" links open, and sign-in asks for the tick box.

## 5. Before the first outside sign-in

- Fill in the bracketed placeholders in `docs/TERMS.md` and `docs/PRIVACY.md`, and have a lawyer review them.
  When they change, bump `VERSION` in `legal.js` so everyone is asked to accept again.
- Set a monthly spending cap in the Anthropic console (needed once AI generation is built).
- Turn on Supabase Pro so the database never pauses between study sessions.
