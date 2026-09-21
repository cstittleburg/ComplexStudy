# PulseEngine: feasibility review and build plan

A review of the "Adaptive Nursing Pedagogy Platform (PulseEngine)" spec against what
Shift Ready already is today, what it would cost to run, and what is safe to ship.

Written for someone who is not a coder. Jargon is explained the first time it appears.

---

## 0. Decisions so far

Answers gathered after the first draft. Everything below is written against these.

| Question | Decision |
| --- | --- |
| Who is it for? | **Multi-user.** A free pilot for nursing students at one university, to gather data and feedback, then a paid tier later. |
| Pilot size and timing | **About 200 students, next semester.** |
| Is this a product? | **Yes.** The intent is a commercial product. |
| Why the professor community layer? | It was a **backdoor to tailor content to a specific program.** The goal is program-specific tailoring; the community mechanism was a means, not the point. |
| Why Next.js? | Because it is multi-user. (Section 3 explains why those two things are not linked.) |
| Uploaded material | **Never shared. A NotebookLM-style sandbox:** each student's sources are private to them, and everything the app generates for them comes only from their own sources. |
| Budget | Flexible over time. The $50 figure was a guess at what a free starter group would cost the person running it. |
| Database | The Shift Ready Supabase project is `zenvotibmwyytvvcxjqx`. It is under a different Supabase account than the one connected to this session, so tables there will be created through the dashboard's SQL editor (as `docs/HOSTING.md` already describes) or after that account is connected. **No tables are being created now; this document is planning only.** |

### What "NotebookLM-style" commits you to

This is a useful framing because it is a product principle, not just a legal dodge:

1. **Sources are private.** A student's uploads are visible to that student and nobody
   else, including the app's operator in the normal course of things.
2. **Output is grounded.** Every generated case, card or question comes from that
   student's sources and can say which source it came from. Nothing is invented from
   general knowledge. (This is also the hallucination defence in section 7.)
3. **Nothing crosses notebooks.** No "other students in your course uploaded X." The
   only thing that crosses students is aggregate, anonymous performance data
   (section 6b), which is about the students, not the material.
4. **The student is responsible for what they upload.** NotebookLM's terms put the
   copyright responsibility on the user, who is uploading for their own study. The
   app's terms of service should say the same thing. This is standard, but it has to be
   written down, and a commercial product needs real terms and a real privacy policy,
   not a paragraph in a README.

---

## 1. The short version

The spec is three separate products wearing one hat:

| Part | Verdict |
| --- | --- |
| Private Sandbox (upload your files, the app reads them) | **Feasible.** Simpler than the spec says. Skip the vector database for now. |
| Adaptive Compilation Engine (Option B: generate content once, route it per student) | **Feasible and already half-built.** This is the part worth doing first. |
| Community Intelligence Layer (anonymous channels that profile professors) | **Replace it.** The goal behind it (program-specific tailoring) is reachable a safer way. Section 6. |

The biggest correction to the spec: it assumes a greenfield Next.js + React rewrite.
Shift Ready today is a **static site**, plain HTML and JavaScript files with no build
step, served directly by Netlify. Multi-user does not require the rewrite. Section 3.

The biggest thing the spec missed: **the existing built-in NURS 4620 content is derived
from a professor's packets.** That was fine for one student's private study tool. It is
not fine to serve to 200 students. Section 4 has the fix, and it needs deciding before
the pilot opens.

---

## 2. What already exists (and what the spec was unaware of)

The spec describes several things as "to build" that are already working in this repo:

- **The game shells.** `app.js` already has eight interactive item renderers:
  select-all, single, matrix, cloze, drag-to-order, highlight-the-phrase, trend
  comparison, and bow-tie. These are the "MnemonicMatch.tsx / VisualTimeline.tsx"
  components the spec wants, written in plain JavaScript instead of React.
- **The Master JSON Payload.** The spec's central idea is one big JSON blob per unit
  holding every modality. That is essentially what `content/*.js` already is. The format
  is documented in `docs/ADDING-CASES.md`.
- **The telemetry system.** `insights.js` already logs every answered item (mode, framework
  step, score, seconds taken, whether it was a retry of something missed) and computes
  accuracy, improvement over time, and retention per study method.
- **The adaptive router.** Partially. `courses.js` filters content by course and by enabled
  study method. What it does *not* yet do is pick a modality based on what is working for
  this student. That is a small addition on top of data already being collected.
- **Supabase auth and sync.** `sync.js` handles magic-link sign-in and pushes progress to
  a `progress` table with row-level security (a database rule that stops one user reading
  another's rows). Working today. **This means the app is already multi-user** in the
  sense that matters: two people can sign in and each sees only their own data.
- **A course setup wizard.** `courses.js` already walks through naming a course, listing
  materials, choosing study methods, and picking frameworks.

So PulseEngine is not a new product. It is roughly four additions to Shift Ready:
file upload and parsing, an LLM step that turns a file into content, modality routing,
and a proper events table so data can be studied across students.

---

## 3. Architecture: multi-user without the rewrite

### What "multi-user" actually requires

It is worth separating the things people bundle under "multi-user":

| Need | What provides it | Status |
| --- | --- | --- |
| Each person signs in and sees their own data | Supabase auth + row-level security | **Done** (`sync.js`, `0001_progress.sql`) |
| A secret (the Anthropic API key) that users must not see | Server-side code | Needs a Netlify Function (a small script Netlify runs on its servers) |
| Data that can be studied across all users | A real database table, not one JSON blob per user | Needs an `events` table (section 4) |
| Screens that update as the user acts | Any JavaScript | **Done** (the app already does this) |
| Paid tier later | A billing provider (Stripe) plus a `plan` column on the user | Later; nothing now blocks it |

None of these rows say "Next.js". Next.js is a framework for building websites with
React. It gives you a component system, a build step, server-rendered pages, and a large
ecosystem. Those are good things when a codebase is large or several developers work on
it. They have nothing to do with how many *users* the site has. A static site behind
Supabase serves 200 users exactly as well as it serves one.

**Recommendation: keep the static site for the pilot.** The honest trigger for a
framework migration is codebase size and team size, not user count. If the UI code
passes roughly 5,000 lines, or a second developer joins, or you find yourself wanting
reusable components badly, migrate then, with a working app and real users to test
against. Rewriting first means months with nothing shipped and no pilot data.

### The shape

```
Browser (existing static site: index.html, app.js, courses.js, insights.js, sync.js)
   |
   |  uploads a file, or asks for a study session, or answers a question
   v
Netlify Functions  (server-side scripts; Netlify already hosts the site,
   |                so this is a folder in the repo, not a new service)
   |
   +--> Anthropic API (Claude): runs ONCE per uploaded unit, returns the Master JSON
   |
   +--> Supabase: Postgres database + file storage + auth (already connected)
```

Why this shape:

- **No build step to maintain.** The site stays deploy-on-merge.
- **The API key stays secret.** An Anthropic API key must never be in `config.js` or any
  browser file, because anything in the browser is public and someone could run up your
  bill. A Netlify Function is server-side, so the key lives in Netlify's environment
  variables and the browser never sees it.
- **Netlify Functions are free at this scale.** 125k invocations/month on the free tier.

### Drop pgvector from the MVP

The spec calls for RAG (retrieval-augmented generation: chopping documents into chunks,
storing them as numeric vectors, and fetching the most relevant chunks at question time).
That is the right tool when documents are too big to fit in the model's context window.

A nursing unit's material is a slide deck and a case packet, typically 10,000 to 60,000
tokens (a token is roughly three-quarters of a word). Claude's context window is
1,000,000 tokens. **The whole unit fits in a single prompt.** Chunking and vectorizing it
adds a database extension, an embedding pipeline, a retrieval step, and a new class of
bug (the retriever fetches the wrong chunk and the case study quietly contradicts the
professor's answer key) in exchange for nothing.

Add pgvector later if a course's material genuinely exceeds what fits, or when students
want a "search my notes" feature.

### Option A vs Option B

Option B (generate once per unit, route per student) is correct and the spec already
recommends it. Two additions:

1. **Option A is not needed as an alternative.** It is needed as a *narrow supplement*:
   one small on-demand call for "explain why I got this wrong, in the context of what I
   just answered." A few hundred tokens, and the one place where per-session generation
   earns its cost. Budget for it separately.
2. **Option B needs a regeneration path.** If the LLM writes a case with a wrong answer
   key, there must be a way to flag it and rebuild that one item. `unit_payloads` should
   be versioned rather than overwritten.

---

## 4. Data model and the copyright problem

### The problem with the existing content

The README says the built-in cases are "taken directly from the professor's case-study
packets" with "the professor's answer keys." For one student's private tool, that is
ordinary personal study use. Serving it to every nursing student at the university is
redistributing the professor's material, and the app would be the one doing it.

This is the same reason uploaded material stays per-student, applied to content that is
currently baked into the repo. Three options:

| Option | What it means | Trade-off |
| --- | --- | --- |
| **A. Make the built-in pack the pilot student's private course** | Move `content/*.js` behind the same owner-scoping as uploads. Only the account it was built for sees it. | Cleanest. New pilot users start with an empty course and upload their own material. |
| **B. Get the professor's permission** | Ask. Some instructors are glad to have their cases used this way. | Best outcome if yes; a written yes is needed, not a verbal one. |
| **C. Replace with original content** | Write new cases that teach the same topics without reproducing the packets. | Real work, and loses the "this is exactly how your professor tests" value. |

Recommendation: **A now, pursue B in parallel.** A is a few hours of work and removes the
risk before anyone outside the household signs in.

### New tables

Building on the existing `progress` table. All rows are owner-scoped with row-level
security keyed to `auth.uid()`, the same pattern `0001_progress.sql` uses.

| Table | Holds | Why |
| --- | --- | --- |
| `events` | one row per answered item: user, course, mode, framework step, score, ms, retry flag, timestamp | Today these live inside the `progress.state` JSON blob. That works for one user and is useless for studying 200. A real table lets you ask "across all NURS 4620 students, which framework step is missed most?" in one query. This is the table the pilot's data-gathering depends on. |
| `documents` | one row per uploaded file: owner, course, filename, storage path, extracted text, status | The private sandbox. |
| `unit_payloads` | the Master JSON for one unit, plus version, source document ids, model used, cost | Owner-scoped. Never shared. |
| `generation_jobs` | queue: pending / running / done / failed, with error text | Needed because generation takes minutes and Netlify Functions time out (section 7). |
| `program_profiles` | per course code at the university: syllabus-derived exam blueprint, unit list, framework in use | The replacement for the professor-profiling layer. Section 6. |
| `feedback` | free-text and one-tap ratings from pilot users | The pilot is for feedback; give it a place to land. |

`events` is the one that changes existing code: `app.js` currently appends to
`S.events` and `insights.js` reads it. The migration is to keep the local array for
offline use and also insert each event as a row when signed in. Small, and `sync.js`
already has the hook.

---

## 5. Cost model

Two scenarios, because the pilot and the eventual scale are different questions.

Pricing used (Anthropic, per million tokens): Claude Opus 5 $5 in / $25 out.
Claude Sonnet 5 $2 in / $10 out. Cached input is charged at a fraction of the input rate.

### Per-unit generation cost

| Line | Opus 5 | Sonnet 5 |
| --- | --- | --- |
| Input (course material + format instructions, ~40k tokens) | $0.20 | $0.08 |
| Output (Master JSON: cases, cards, questions, ~25k tokens) | $0.63 | $0.25 |
| **Per unit** | **~$0.83** | **~$0.33** |
| With prompt caching on the shared instruction prefix | ~$0.70 | ~$0.28 |

Content generation from a supplied answer key is extraction and reformatting, not hard
reasoning. Sonnet 5 is a genuinely good fit. Use Opus 5 only if pilot users report
quality problems.

### The pilot: 200 students, one semester (what you would personally pay)

Assumptions: 200 sign-ups, 6 units uploaded each, Sonnet 5 with caching, plus the small
per-miss explanation calls. A four-month semester.

| Line | Amount |
| --- | --- |
| Generation: 200 x 6 x $0.28 | ~$340 for the semester |
| Explanations: 200 students x ~200 misses x ~$0.003 | ~$120 for the semester |
| Supabase Pro (needed at this size: no pausing, 8GB database, 100GB storage) | $25/month, ~$100 |
| Netlify (free tier covers 100GB bandwidth; a static site this small stays under it) | $0 |
| Netlify Functions (free tier, 125k calls/month) | $0 |
| **Total** | **~$560 for the semester, ~$140/month** |

Two honest adjustments to that number:

- **Not everyone who signs up uploads six units.** In most pilots, roughly half of
  sign-ups become regular users. A realistic figure is $300 to $400 for the semester.
- **Upload caps are the cost control that matters.** A cap of 8 units per student per
  semester keeps the worst case bounded at about $450 in generation even if every single
  student maxes out. Set the cap; raise it for people who ask.

Per active student, that is roughly **$2 to $3 for the whole semester.** That is the
number the paid tier is built on.

### Smaller pilot, for comparison

Thirty students runs about $70 for the semester on free tiers (Supabase Pro is optional
at that size, though the pause-on-inactivity problem still applies).

### The paid tier

At $2 to $3 per student per semester in costs, a $5/month or $15/semester tier has a
comfortable margin, and a free tier with a low upload cap is affordable as a funnel.
Stripe integration is a few days of work and a Netlify Function; nothing in the pilot
design blocks it. Do not build it until the pilot says people would pay, but do collect
"would you pay for this?" in the pilot feedback form, because that is the question the
pilot exists to answer.

### Two things that catch people

- **Supabase free tier pauses projects after a week of inactivity.** Fine during a
  semester; a nasty surprise over winter break when a student opens the app and it is
  down. The $25/month Pro tier removes this and is the first paid thing worth turning on
  once real users depend on it.
- **A hard monthly cap on the Anthropic side.** Set a spending limit in the Anthropic
  console before the pilot opens. If something loops, the bill stops at the cap.

---

## 6. Program-specific tailoring without profiling professors

The goal is clear now: make the content match *this* program, *this* course, *this* way
of testing. The community layer was one route there. It is a bad route, and not only
for the legal reasons in the earlier draft: it does not work at pilot scale. With 30
students across many courses, most professor channels would hold a handful of posts, and
an LLM asked to find patterns in six posts will confidently invent them.

Three sources of program-specific signal that are legitimate, available from day one,
and stronger than anonymous posts:

### a. The syllabus and exam blueprint

Every course publishes a syllabus with learning outcomes, a unit schedule, and usually an
exam blueprint (how many questions per topic). Nursing programs also state which
framework they use (CJMM, nursing process, and so on). This is *exactly* what the
"instructor profile" was trying to reconstruct from gossip, except it is written by the
instructor, published on purpose, and accurate.

The student uploads it once. Claude extracts a `program_profiles` row: units, weights,
framework, question styles named in the syllabus. That row shapes every later
generation for that course. This is a small extension of the upload pipeline already
being built.

### b. Cohort telemetry (the pilot's own data)

Once `events` is a real table, "students in NURS 4620 miss *prioritize hypotheses* items
at twice the rate of *recognize cues* items" is a single query. That is program-specific
tailoring built from the students' own performance, which they consented to when they
signed up, and it gets *better* with more users rather than worse. Aggregate only; never
expose one student's data to another.

This is also the most valuable thing the pilot can produce for the paid-tier pitch.

### c. Personal instructor notes

Each student records, privately, what they have noticed about how this course tests.
Free text on the course, fed into the generation prompt. First-person, consented, private.
The existing course materials list already has a notes field; this is that field, used
on purpose.

### What about a community feature at all?

If students want to talk to each other, build a plain course-scoped discussion board with
moderation tools, scoped to the course code and not to a named professor, and with no
LLM reading it to build profiles. That is a forum, it is honest about being a forum, and
it can be added any time. It is not on the pilot's critical path.

---

## 7. Real technical risks

| Risk | Why it bites | Mitigation |
| --- | --- | --- |
| **Hallucinated clinical content** | The app teaches nursing. A generated case with a wrong answer key teaches the wrong thing, and the student will not know. This is the most serious risk in the whole project, and it gets worse with 200 users because nobody is checking each one's content. | Generate only from supplied material with an explicit "use only the attached answer key" instruction. Mark every generated item as unverified in the UI until the student confirms it against their packet. Give every item a one-tap "this is wrong" flag that feeds `feedback`. Never generate clinical facts the source did not contain. |
| **Parsing .pptx and .docx** | Most nursing material is PowerPoint and Word, not PDF. Text extraction from these is fiddly and images (which often carry the content) are lost. | `mammoth` for .docx and a pptx text extractor in the function. Accept that image-heavy slides will extract poorly and say so to the student. Claude reads PDFs natively, so PDF is the best-supported path; tell students "export to PDF" as the happy path. |
| **The function timeout** | Netlify Functions time out at 10s (background functions at 15 minutes). A generation call takes minutes. | Use a Netlify **background function** plus the `generation_jobs` table, and have the browser poll for status. |
| **Cost runaway from abuse** | A signed-in user could upload a hundred files. | Per-user monthly generation cap enforced in the function, checked before the API call. Plus the console-level spending cap. |
| **Supabase free-tier storage** | 1GB fills fast with slide decks. | Extract the text, store the text, delete the original file after a successful parse. Also better for the copyright position: the app holds a derived text, not the original file. |
| **Pilot data and consent** | Collecting study behaviour from students at a university, even for product feedback, needs a privacy note and a consent checkbox at sign-up. If the intent is ever to *publish* findings, the university's IRB (research ethics board) will need to approve it first. | Write the privacy note before the pilot. Ask the pilot student whether a formal study is intended; if yes, talk to the IRB early, since retroactive approval is not a thing. |
| **Losing the current app's simplicity** | Every feature here adds moving parts to something that currently works offline with zero dependencies. | Every new feature degrades gracefully: with no keys configured, the app must still run exactly as it does today. `sync.js` already sets this precedent. |

---

## 8. Suggested build order and whether "next semester" is realistic

Each phase is shippable on its own. Phases 0 and 1 are the pre-pilot gate.

**On the timeline.** If next semester starts in January, there are about three and a
half months. With Claude doing the building and one person directing, phases 0 through 3
are comfortable in that window and phase 4 (generation) is achievable but is the one
with real uncertainty, because the quality of generated nursing content has to be checked
by someone who knows nursing before 200 students see it. The safe plan is to **open the
pilot with phases 0 to 3 and ship generation a few weeks in**, to the students already
signed up, rather than hold the launch for it. An app where 200 students upload their
material and use the existing study modes with adaptive routing is already a real pilot
that produces real data.

Rough effort, in working sessions rather than calendar time:

| Phase | Sessions | Notes |
| --- | --- | --- |
| 0. Safe to open | 1 to 2 | Owner-scope the built-in pack, consent, spending cap, terms and privacy policy drafts |
| 1. Events table | 1 | Small code change plus one migration |
| 2. Modality routing | 1 to 2 | No new infrastructure |
| 3. Upload and extract | 3 to 4 | First Netlify Function, file parsing, storage |
| 4. Generation and review screen | 4 to 6 | The prompt, the queue, the versioned payloads, and the review UI; then nursing-side quality checking |
| 5. Per-item explanation | 1 | Reuses phase 4 plumbing |

**Phase 0: make it safe to open the door.**
Owner-scope the built-in NURS 4620 pack (section 4, option A). Add the privacy note and
consent checkbox to sign-up. Set the Anthropic spending cap. A day or two.

**Phase 1: the events table.**
Insert one row per answered item when signed in; keep the local array for offline.
This is what makes the pilot produce data worth having. Also small.

**Phase 2: modality routing (no API cost).**
Use the telemetry already in `insights.js` to pick which study mode to open next. If
flashcards are producing 85% retention and plain questions 40%, lead with flashcards.
This is the spec's core promise, needs no LLM, and tells you whether adaptive routing
actually helps before you spend money on generation.

**Phase 3: upload and extract.**
File upload to Supabase Storage, a function that extracts text, the `documents` table,
and the syllabus-to-`program_profiles` extraction. No case generation yet.

**Phase 4: generation.**
The `generation_jobs` queue, the background function, the Claude call, versioned
`unit_payloads`, and a review screen where the student checks generated items against
their packet before they go live. The review screen is not optional.

**Phase 5: per-item explanation (narrow Option A).**
On a missed question, one small call for a tailored explanation.

**Phase 6: paid tier, community board.**
Only if the pilot says so.

---

## 9. Open questions

Remaining after two rounds of answers.

1. **When exactly does next semester start, and how are students recruited?** The
   timeline in section 8 assumes January. Recruiting through the nursing program (a
   flyer, a class announcement) is a different conversation with the school than
   recruiting through a group chat, and the school's answer to question 3 depends on it.
2. **Is a formal study intended, or product feedback only?** If anyone plans to write
   this up as research, the university's IRB must approve before data collection starts.
   For product feedback a privacy policy and consent checkbox are enough.
3. **Does the nursing program have a policy on third-party study tools?** A commercial
   app that students upload course material into is exactly the kind of thing some
   programs have rules about. One email to the program office before recruiting beats
   "the school said no" after launch. This matters more now that it is a product.
4. **The existing NURS 4620 pack.** Option A (owner-scope it), B (ask the professor), or
   C (rewrite)? A is the default if there is no answer, and it needs to happen before
   the first outside login.
5. **Who does the nursing-side quality check on generated content?** Phase 4 needs a
   nurse or nursing student to read generated cases against the source packet before
   they go to 200 people. Is that the pilot student, and does she have the time in the
   weeks before launch?
6. **Terms of service and privacy policy.** A commercial product needs real ones. Who
   writes them? A template plus a one-hour review by a lawyer is the usual pilot-stage
   answer.
