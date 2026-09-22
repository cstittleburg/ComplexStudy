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
6. Put them in `config.js`:

```js
window.SR_CONFIG = {
  supabaseUrl: 'https://xxxx.supabase.co',
  supabaseAnonKey: 'sb_publishable_...'
};
```

The publishable key is meant to be public; the row-level security policy is what protects the data.
Commit, merge, and the deployed site will show a sign-in box under Settings → Account.

## How sync behaves

- Signed out: everything is saved in the browser, exactly as before.
- Signed in: every save is also pushed to the `progress` row (debounced by three seconds).
- Signing in on a new browser: if the cloud copy is newer and the browser has no progress, it loads silently; if both have progress, the app asks which to keep.
