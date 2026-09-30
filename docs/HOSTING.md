# Hosting on Netlify and turning on accounts

Shift Ready is a static site (no build step), so hosting is a few clicks. Accounts and cloud sync
are optional: with no keys in `config.js` the app runs local-only and progress stays in the browser.

## 1. Netlify (a few minutes)

1. In Netlify, choose **Add new site → Import an existing project → GitHub** and pick `cstittleburg/ComplexStudy`.
2. Branch to deploy: `main`. Build command: leave empty. Publish directory: `.` (the repository root). `netlify.toml` already says this.
3. Deploy. Netlify gives you a `something.netlify.app` address; rename it under Site settings → Site details if you like.

Every merge to `main` redeploys automatically.

## 2. Supabase (accounts + progress in the cloud)

1. At supabase.com create a **new project** for this app (keep it separate from other projects).
2. Open **SQL editor**, paste the contents of `supabase/migrations/0001_progress.sql`, run it. This creates one `progress` row per user with row-level security so each person can only read their own row.
3. Under **Authentication → Sign In / Providers**, make sure the **Email** provider is enabled and that **Allow new users to sign up** is on. There is no separate "magic link" switch: the app calls the one-time-link sign-in, which the Email provider handles. Under **Authentication → Emails** you can edit the "Magic Link" and "Confirm signup" templates if you like.
4. Under **Authentication → URL configuration**, set the Site URL to your Netlify address and add it to the redirect list.
5. Under **Project settings → API keys**, copy the **Project URL** and the **publishable** key (`sb_publishable_...`). The older `anon` JWT key also works, but the publishable key is the current one.
6. Put them in the `LIVE` block of `config.js`:

```js
const LIVE = {
  supabaseUrl: 'https://xxxx.supabase.co',
  supabaseAnonKey: 'sb_publishable_...'
};
```

The publishable key is meant to be public; the row-level security policy is what protects the data.
Commit, merge, and the deployed site will show a sign-in box under Settings → Account.

## Test copies and the practice database

`config.js` holds two sets of keys. The **live** set is used only on the live site
(`shiftreadynursing.netlify.app`, or any address without `--` in it). Everything else is a **test copy**:
Netlify preview and branch links (their addresses contain `--`), a copy opened as a file, or `localhost`.
Test copies use the **practice** set instead, so testing can never touch anyone's real progress.

With the practice set empty (the default), a test copy simply runs with sign-in switched off. Everything done
there stays in that browser, and a yellow banner at the top says so. That is all you need to try new features.

You only need a practice database to test the parts that talk to the cloud (sign-in, sync, the events upload):

1. In Supabase, create a second project, for example `shift-ready-practice`.
2. In its SQL editor, run `supabase/migrations/0001_progress.sql`, then `0002_events.sql`.
3. Under Authentication → URL configuration, add the preview address you test on to the redirect list.
4. Copy its Project URL and publishable key into the `PRACTICE` block of `config.js`.

## The events table (`0002_events.sql`)

One row per answered item: when, course, mode, study method, topic area, score, time, and a short fingerprint of
the item (never its text). It is what lets you look at study patterns across students. The table is only added,
nothing existing changes, and the current live app never touches it, so it is safe to run on the live database
whenever you are ready. Until it exists, the new app notices, stops trying to upload, and carries on normally.

## How sync behaves

- Signed out: everything is saved in the browser, exactly as before.
- Signed in: every save is also pushed to the `progress` row (debounced by three seconds). New answered items
  then go to the `events` table, if it exists.
- Signing in on a new browser: if the cloud copy is newer and the browser has no progress, it loads silently; if both have progress, the app asks which to keep.
