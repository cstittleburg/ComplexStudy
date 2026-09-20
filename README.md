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
| Start a shift | One random unfolding case (all six steps) plus quick rounds: Who first?, a trend, an ABG, delegation. About 12 minutes. |
| Pick a case | 7 unfolding cases taken directly from the professor's case-study packets: acute asthma, COPD exacerbation, pneumonia, acute respiratory failure (respiratory packet) and femur fracture with hemorrhagic shock, stroke with feeding-tube medications, anastomotic leak with septic shock (Week 1 NGN packet). Answer keys are the professor's. |
| Who first? | Four clients, choose who to see first, then name the cue that decided it. Randomly assembled from 50 patient cards. |
| Trend Detective | Two columns of a flowsheet with fresh numbers every time. Better, worse, same? Then name the threat. |
| ABG Decoder | Randomly generated blood gases: disorder, compensation, cause, action. |
| Bow-tie builder | The NGN drag-and-drop item, tap style. |
| What stays with the RN? | Delegation calls. |
| Quick Fire | Fast questions from the class Kahoot. |
| Rhyme & Reason | 55 mnemonic and rhyme cards, with a quiz-me mode. |
| Muddy points | Everything missed, ready to replay. |
| Insights | Which study methods are paying off: accuracy, improvement over time, retention of missed items, time per item, and one-tap ratings after each shift. |

## Courses

The home screen lists courses. NURS 4620 is built in. "Create a course" walks through a short setup: name the course, list the material, choose how to study (cases, prioritization, trends, ABGs, practice questions, flashcards), and pick the frameworks. Flashcards and practice questions can be written in the app; cases and other packs are built by Claude from the exported course spec plus the files.

Every wrong answer gets a short, kind explanation and the case continues to the next step,
exactly like the exam. Names, ages and answer order change on every replay.

## Files

```
index.html            page + styles
app.js                the engine (item types, modes, scoring, chart panel, event log)
courses.js            course picker, setup wizard, course settings, flashcard/question editors
insights.js           the Insights page (method effectiveness)
sync.js               optional accounts + cloud sync (Supabase); off until config.js has keys
config.js             deployment keys (empty = local-only)
netlify.toml          Netlify static-site config
supabase/migrations/  SQL for the progress table
docs/HOSTING.md       Netlify + Supabase setup steps
content/frameworks.js thinking models (CJMM, Priority Lens, A-to-I survey, SBAR) — add new frameworks here
content/resp.js       respiratory cases
content/neuro.js      neuro cases
content/fluids.js     burns, fluids/electrolytes, sepsis, lifespan cases
content/week1.js      Week 1 NGN packet cases (trauma, stroke meds, anastomotic leak)
content/pools.js      Who-first cards, trend templates, ABG data, quick-fire questions, rhyme deck
docs/ADDING-CASES.md  how to add cases, cards, rhymes, or a new framework
```

See `docs/ADDING-CASES.md` for the content format. The plan is to grow this to cover the whole course.
