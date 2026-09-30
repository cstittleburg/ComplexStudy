# Shift Ready

A study app for **NURS 4620/4720 Complex Healthcare Problems Across the Lifespan**.
It turns the course's case studies into short, replayable "shifts" that walk through the
**Clinical Judgment Measurement Model** (Recognize cues → Analyze cues → Prioritize hypotheses →
Generate solutions → Take action → Evaluate outcomes), the same six-question structure the
Next Generation NCLEX and the course exams use.

## Open it

No install, no server. Open `index.html` in any browser, or host the folder on GitHub Pages or Netlify
(see `docs/HOSTING.md`). Progress is saved in the browser; with Supabase keys in `config.js` it also syncs
to an account so it follows her across devices.

## What's inside

| Mode | What it practices |
| --- | --- |
| Start a shift | One unfolding case (all six steps; in a course without cases, a set of practice questions) plus five quick rounds, weighted toward the ways you like to study. About 12 minutes. See "The adaptive mix" below. |
| Pick a case | 7 unfolding cases taken directly from the professor's case-study packets: acute asthma, COPD exacerbation, pneumonia, acute respiratory failure (respiratory packet) and femur fracture with hemorrhagic shock, stroke with feeding-tube medications, anastomotic leak with septic shock (Week 1 NGN packet). Answer keys are the professor's. |
| Who first? | Four clients, choose who to see first, then name the cue that decided it. Randomly assembled from 50 patient cards. |
| Trend Detective | Two columns of a flowsheet with fresh numbers every time. Better, worse, same? Then name the threat. |
| ABG Decoder | Randomly generated blood gases: disorder, compensation, cause, action. |
| Bow-tie builder | The NGN drag-and-drop item, tap style. |
| What stays with the RN? | Delegation calls. |
| Quick Fire | Fast questions: the class Kahoot plus a 95-question pack built from the Exam 1 study guide. |
| Rhyme & Reason | Mnemonic and rhyme cards to flip through, plus "Quiz me one at a time": say it, check it, mark it "Got it" or "Not yet". |
| Muddy points | Everything missed, ready to replay. |
| Insights | What actually works for you (every method measured on the same exam-style items), then each method on its own terms: accuracy, improvement, retention, time per item, and one-tap ratings after each shift. |

## The adaptive mix

Each course asks once which ways of studying you like best (up to two favourites; change them any time in
course settings). Every shift then leans toward them: favourites get about 70% of the quick rounds, and every
other method you have switched on keeps at least 10%, so the app can keep checking it.

Behind the scenes, every answer is tagged with its topic (respiratory, neuro, epidemiology, ...). After you
practise a topic, the app looks at how you do on that topic's exam-style items (the unfolding case, or practice
questions in courses without cases) the next time you meet them, a day or more later. Once each method has 15 of
those results, it compares them. When one method is clearly ahead (10 points or more, holding two weeks in a
row), it tells you, whether that confirms your favourite or surprises you, and the mix moves toward it by at
most 10 points a week. "Keep my mix" always wins. All of this runs in the browser from the event log; the rules
live at the top of `adapt.js`.

## Focus

In course settings, tick one or more materials (for example the Exam 1 study guide) and every mode limits
itself to items built from those materials. Framework and heuristic cards stay in. Untick everything to use
all material. Every content item carries a `source` tag naming its material.

## Courses

The home screen lists courses. Two are built in: NURS 4620 (Complex Healthcare Problems) and NURS 4510 (Community Health Nursing, Exam 1: 100+ questions from the learning objectives, the epidemiology quiz and the study guide, plus a Rate Drill that generates fresh epidemiology rate problems). "Create a course" walks through a short setup: name the course, list the material, choose how to study (cases, prioritization, trends, ABGs, practice questions, flashcards), and pick the frameworks. Flashcards and practice questions can be written in the app; cases and other packs are built by Claude from the exported course spec plus the files.

Every wrong answer gets a short, kind explanation and the case continues to the next step,
exactly like the exam. Names, ages and answer order change on every replay.

## Files

```
index.html            page + styles
app.js                the engine (item types, modes, scoring, chart panel, event log)
courses.js            course picker, setup wizard, course settings, flashcard/question editors
insights.js           the Insights page (method effectiveness)
adapt.js              the adaptive mix: favourites, topic areas, the what-works comparison, shift planning
sync.js               optional accounts + cloud sync (Supabase), and the upload of answered items
config.js             database keys: the live one for the live site, a practice one for test copies
netlify.toml          Netlify static-site config
supabase/migrations/  SQL: 0001 the progress table, 0002 the events table (one row per answered item)
docs/HOSTING.md       Netlify + Supabase setup steps
content/frameworks.js thinking models (CJMM, Priority Lens, A-to-I survey, SBAR) — add new frameworks here
content/resp.js       respiratory cases
content/neuro.js      neuro cases
content/fluids.js     burns, fluids/electrolytes, sepsis, lifespan cases
content/week1.js      Week 1 NGN packet cases (trauma, stroke meds, anastomotic leak)
content/studyguide.js Exam 1 study guide pack: 95 questions + 28 cards, one per guide heading
content/community.js  NURS 4510 Community pack: questions from objectives, epi quiz, study guide; cards
content/pools.js      Who-first cards, trend templates, ABG data, quick-fire questions, rhyme deck
docs/ADDING-CASES.md  how to add cases, cards, rhymes, or a new framework
docs/PULSEENGINE-FEASIBILITY.md  the plan for the multi-student version, and what is built so far
docs/TERMS.md, docs/PRIVACY.md   draft terms of service and privacy policy (need a lawyer's review)
```

See `docs/ADDING-CASES.md` for the content format. The plan is to grow this to cover the whole course.
