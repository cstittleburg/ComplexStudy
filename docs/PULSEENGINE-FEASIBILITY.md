# PulseEngine: feasibility review and build plan

A review of the "Adaptive Nursing Pedagogy Platform (PulseEngine)" spec against what
Shift Ready already is today, what it would cost to run, and what is safe to ship.

Written for someone who is not a coder. Jargon is explained the first time it appears.

---

## 1. The short version

The spec is three separate products wearing one hat:

| Part | Verdict |
| --- | --- |
| Private Sandbox (upload your files, the app reads them) | **Feasible.** Simpler than the spec says. Skip the vector database for now. |
| Adaptive Compilation Engine (Option B: generate content once, route it per student) | **Feasible and already half-built.** This is the part worth doing first. |
| Community Intelligence Layer (anonymous channels that profile professors) | **Feasible to build, risky to ship.** See section 6. This is the one I would cut or reshape. |

The cost target of under $50/month for 200 users is realistic **only** with Option B,
and only if uploads are throttled. Option A would be roughly 10-40x that. Numbers in section 5.

The biggest correction to the spec: it assumes a greenfield Next.js + React rewrite.
Shift Ready today is a **static site** — plain HTML and JavaScript files with no build
step, served directly by Netlify. That is a real asset, not a limitation, and throwing it
away would cost months. Section 3 explains how to get everything the spec wants without
the rewrite.

---

## 2. What already exists (and what the spec was unaware of)

The spec describes several things as "to build" that are already working in this repo:

- **The React game shells.** `app.js` already has eight interactive item renderers:
  select-all, single, matrix, cloze, drag-to-order, highlight-the-phrase, trend
  comparison, and bow-tie. These are the "MnemonicMatch.tsx / VisualTimeline.tsx"
  components the spec wants, just written in plain JavaScript instead of React.
- **The Master JSON Payload.** The spec's central idea is one big JSON blob per unit
  holding every modality. That is essentially what `content/*.js` already is. The format
  is documented in `docs/ADDING-CASES.md`.
- **The telemetry system.** `insights.js` already logs every answered item (mode, framework
  step, score, seconds taken, whether it was a retry of something missed) and computes
  accuracy, improvement over time, and retention per study method. The spec's "student
  telemetry" layer exists.
- **The adaptive router.** Partially. `courses.js` filters content by course and by enabled
  study method. What it does *not* yet do is pick a modality based on what is working for
  this student. That is a small addition on top of data that is already being collected.
- **Supabase auth and sync.** `sync.js` handles magic-link sign-in and pushes progress to
  a `progress` table with row-level security (a database rule that stops one user reading
  another's rows). Working today.
- **A course setup wizard.** `courses.js` already walks through naming a course, listing
  materials, choosing study methods, and picking frameworks. The spec's onboarding is built.

So PulseEngine is not a new product. It is roughly three additions to Shift Ready:
file upload and parsing, an LLM step that turns a file into content, and modality routing.

---

## 3. Architecture recommendation

### Keep the static site. Add serverless functions.

The spec's stack (Next.js, pgvector, cron workers) is a reasonable enterprise design and
the wrong size for this. Here is the smaller version that does the same job.

```
Browser (existing static site: index.html, app.js, courses.js, insights.js)
   |
   |  uploads a file, or asks for a study session
   v
Netlify Functions  (small server-side scripts; Netlify already hosts the site,
   |                so this is a folder, not a new service)
   |
   +--> Anthropic API (Claude) -- runs ONCE per uploaded unit, returns the Master JSON
   |
   +--> Supabase (Postgres database + file storage + auth, already connected)
```

Why this shape:

- **No build step to maintain.** The site stays deploy-on-merge, which is why it has
  been easy to change so far.
- **The API key stays secret.** This matters. An Anthropic API key must never be in
  `config.js` or any browser file, because anything in the browser is public and someone
  could run up your bill. A Netlify Function is server-side, so the key lives in Netlify's
  environment variables and the browser never sees it.
- **Netlify Functions are free at this scale.** 125k invocations/month on the free tier.
  200 students uploading a few files each is nowhere near that.

### Drop pgvector from the MVP

The spec calls for RAG (retrieval-augmented generation: chopping documents into chunks,
storing them as numeric vectors, and fetching the most relevant chunks at question time).
That is the right tool when documents are too big to fit in the model's context window.

A nursing unit's material is a slide deck and a case packet. That is typically
10,000-60,000 tokens (a token is roughly three-quarters of a word). Claude's context
window is 1,000,000 tokens. **The whole unit fits in a single prompt.** Chunking and
vectorizing it adds a database extension, an embedding pipeline, a retrieval step, and a
new class of bug (the retriever fetches the wrong chunk and the case study quietly
contradicts the professor's answer key) in exchange for nothing.

Add pgvector later if and when a course's material genuinely exceeds what fits, or when
students want a "search my notes" feature. Not for the MVP.

### Option A vs Option B

Option B is correct and the spec already recommends it. Two things to add:

1. **Option A is not actually needed as an alternative.** It is needed as a *narrow
   supplement*: one small on-demand call for "explain why I got this wrong, in the context
   of what I just answered." That is a few hundred tokens and is the one place where
   per-session generation earns its cost. Budget for it separately.
2. **Option B needs a regeneration path.** If the LLM writes a case study with a wrong
   answer key, there must be a way to flag it and rebuild that one item. Plan for
   `unit_payloads` to be versioned rather than overwritten.

---

## 4. Proposed data model

Building on the existing `progress` table. New tables:

| Table | Holds | Access rule |
| --- | --- | --- |
| `documents` | one row per uploaded file: owner, course, filename, storage path, extracted text, status | owner only |
| `unit_payloads` | the Master JSON for one unit, plus version, source document ids, model used, generation cost | owner only (see caveat below) |
| `generation_jobs` | queue: pending / running / done / failed, with the error text | owner only |

All three get row-level security keyed to `auth.uid()`, the same pattern
`supabase/migrations/0001_progress.sql` already uses.

**The sharing caveat.** If a payload generated from one student's uploaded copyrighted
PDF is then served to other students, that is redistribution of the professor's
material, and it is the single most likely thing to get this app shut down by a school.
Keep `unit_payloads` owner-scoped in the MVP. Sharing is a separate decision with a
separate legal conversation, and the spec's own "out of scope" list already says the
uploaded PDFs are not to be hosted publicly — this is the same principle applied to
what is derived from them.

---

## 5. Cost model

Assumptions: 200 students, each uploading 6 units over a semester, Claude Opus 5 at
$5 per million input tokens and $25 per million output tokens.

**Option B (generate once per unit):**

| Line | Amount |
| --- | --- |
| Input per unit (course material + instructions) | ~40,000 tokens = $0.20 |
| Output per unit (Master JSON: cases, cards, questions) | ~25,000 tokens = $0.625 |
| Cost per unit | ~$0.83 |
| 200 students x 6 units | ~$990 per semester, ~$220/month |

That is over the $50 target. Three levers close the gap:

1. **Use Claude Sonnet 5 for generation** ($2 / $10 per million). Same unit drops to
   ~$0.33. Monthly: ~$88. Content generation from a supplied answer key is extraction and
   reformatting, not hard reasoning — Sonnet is a genuinely good fit here.
2. **Cache the shared prompt.** The instructions describing the output format are
   identical on every call and are large. Prompt caching charges a fraction for repeated
   prefixes. Realistically another 20-30% off.
3. **Share generation within a course.** This is the big one: if 40 students in NURS 4620
   upload the *same* professor's respiratory packet, that is 40 identical generations.
   Detecting the duplicate (hash the extracted text) and reusing the payload cuts cost by
   roughly the size of the largest cohort — but it runs straight into the sharing caveat
   in section 4. Cheap and legally awkward. Decide deliberately.

With Sonnet plus caching and no sharing: **roughly $60-70/month at 200 active students.**
Just over target, and the target is met at ~150 students or with a per-student upload cap.

Everything else is free or near-free at this scale: Netlify free tier, Supabase free tier
(500MB database, 1GB file storage — watch the storage, PDFs add up), Netlify Functions free tier.

**Option A, for contrast:** if each student runs 4 study sessions a week for 15 weeks and
each session costs even $0.05, that is 200 x 60 x $0.05 = $600 per semester on top of
everything else, and it scales with engagement — the app gets more expensive precisely
when it is working. This is why Option B is right.

---

## 6. The Community Intelligence Layer: my recommendation is to cut it

I want to be direct about this one, because it is the part of the spec I would not build
as written.

**What it does:** students post anonymously in per-professor channels; an LLM reads those
posts nightly and extracts a structured profile of that professor's "testing biases,"
"focus areas," and "traps," which then shapes the study content.

**The problems, in order of severity:**

1. **It builds a dossier on a named, identifiable person who did not consent.** A
   structured, machine-generated profile of a specific professor, derived from anonymous
   student claims, stored in a database, is a different object from a Rate My Professor
   review. Under GDPR and similar laws it is automated profiling of an identifiable
   individual. If a professor discovers it, the outcome is not a bug report.
2. **Anonymous plus about a named person plus an LLM that reads it is an unmoderated
   defamation channel.** Anonymity removes the cost of writing something false or cruel.
   You would own that content and need real moderation, which is a staffed job, not a
   feature.
3. **Academic integrity.** Depending on how the extracted "testing biases" read, a school
   may treat this as coordinated exam-content sharing. That risk lands on the students
   using it, not just on the app.
4. **It does not work early.** Extraction needs volume. With a beta cohort of 200 spread
   across many professors, most channels have a handful of posts, and an LLM asked to find
   patterns in six posts will confidently invent them. The feature is weakest exactly when
   you would be evaluating it.

**What to build instead, which gets most of the value:**

- **Personal instructor notes.** The student records, for their own use, what they have
  noticed about how this course tests. Private, first-person, consented, and it feeds the
  generation prompt exactly the same way. Roughly 80% of the pedagogical benefit, none
  of the legal exposure. This also fits the existing course-settings screen, where
  materials already carry a free-text notes field.
- **Past-exam-style calibration from the professor's own handed-out material.** The
  answer keys in `content/week1.js` already encode how this professor tests. That signal
  is legitimate, already present, and underused.

If the community layer is important to you, the version I would be comfortable building
is: channels scoped to a **course**, not a named professor; no LLM profile extraction;
plain discussion with moderation tools. That is a forum, it is honest about being a forum,
and it can be added any time.

---

## 7. Real technical risks

| Risk | Why it bites | Mitigation |
| --- | --- | --- |
| **Hallucinated clinical content** | The app teaches nursing. A generated case with a wrong answer key teaches the wrong thing, and the student will not know. This is the most serious risk in the whole project. | Generate only from supplied material with an explicit "use only the attached answer key" instruction. Mark every generated item as unverified in the UI until the student confirms it against their packet. Never generate clinical facts the source did not contain. |
| **Parsing .pptx and .docx** | Most nursing material is PowerPoint and Word, not PDF. Text extraction from these is fiddly and images (which often carry the content) are lost. | Use `mammoth` for .docx and a pptx text extractor in the Netlify Function. Accept that image-heavy slides will extract poorly and say so to the student. Claude can read PDFs natively, so PDF is the best-supported path. |
| **The 10-second function timeout** | Netlify Functions time out at 10s (26s on background functions). A generation call takes minutes. | Use a Netlify **background function** plus the `generation_jobs` table, and have the browser poll for status. This is why the job table exists. |
| **Cost runaway from abuse** | A signed-in user could upload a hundred files. | Per-user monthly generation cap enforced in the function, checked before the API call, not after. |
| **Supabase free-tier storage** | 1GB fills fast with slide decks. | Extract the text, store the text, delete the original file after a successful parse. Also better for the copyright position. |
| **Losing the current app's simplicity** | Every feature here adds moving parts to something that currently works offline with zero dependencies. | Every new feature degrades gracefully: with no keys configured, the app must still run exactly as it does today. `sync.js` already sets this precedent. |

---

## 8. Suggested build order

Each phase is shippable on its own.

**Phase 1 — Modality routing (no new infrastructure, no API cost).**
Use the telemetry already in `insights.js` to pick which study mode to open next.
If flashcards are producing 85% retention and plain questions 40%, the app should
lead with flashcards. This is the spec's core promise, it needs no LLM, no upload,
and no new service, and it can ship this week. Do this first — it also tells you
whether adaptive routing actually helps before you spend money on generation.

**Phase 2 — Upload and extract.**
File upload to Supabase Storage, a Netlify Function that extracts text, the
`documents` table. No LLM yet. The payoff is that the course materials list stops
being just filenames.

**Phase 3 — Generation.**
The `generation_jobs` queue, the background function, the Claude call, the
`unit_payloads` table, and a review screen where the student checks generated items
against their packet before the items go live. The review screen is not optional.

**Phase 4 — Per-item explanation (narrow Option A).**
On a missed question, one small call for a tailored explanation. Cheap, high value,
and the place where on-demand generation is genuinely better than pre-generated.

**Phase 5 — Community, if at all.**
Per the reshaping in section 6.

---

## 9. Open questions

These change the design, so they are worth answering before Phase 2.

1. **Who is this for?** Is PulseEngine for one student (the current app's clear, and
   frankly strong, design center) or a 200-person cohort? Multi-tenant changes the data
   model, the cost model, and the legal exposure. The spec assumes the cohort; the repo
   assumes one person.
2. **Which Supabase project?** `config.js` points at `zenvotibmwyytvvcxjqx`, which is not
   in the Supabase account this session can see (that account has "Jette Clinical" and
   "jette-staging"). Is the Shift Ready project under a different login?
3. **Is the Next.js rewrite a requirement or an assumption?** My recommendation is to keep
   the static site. If a rewrite is wanted for other reasons, say so and the plan changes
   substantially.
4. **Is the community layer the point, or a nice-to-have?** If it is the point, I would
   want to talk through section 6 properly rather than just building around it.
5. **Whose material gets uploaded?** Only the student's own course files, or is the
   ambition a shared library? The answer decides section 4's sharing caveat and most of
   the cost model.
6. **What is the real budget?** $50/month is achievable with the compromises in section 5.
   If the true ceiling is $150, the design gets simpler and the model choice gets better.
