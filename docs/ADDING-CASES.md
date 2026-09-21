# Adding content to Shift Ready

Everything the app teaches lives in plain text files in `content/`. You never need to touch
`app.js` to add a case, a "Who first?" card, a rhyme, or even a new thinking framework.
The easiest way to add content is to ask Claude: "Add an unfolding case about ___ in the same
format as `content/resp.js`." This page explains the format so you can check the result.

## 0. Which course does content belong to?

Every item (case, card, template, question, rhyme) belongs to a course. Items with no `course` field belong to
the built-in course `nurs4620`. For another course, add `course: '<course id>'` to each item; the id is shown
in the course's settings (it is generated when the course is created in the app, e.g. `c1a2b3c`).

Each item can also carry `source: '<material name>'`, the exact name of a material in the course's list. The
Focus setting in course settings uses it to limit practice to chosen materials. Use `source: 'general'` for
framework or heuristic items that should stay in every focus.

## 1. An unfolding case

A case is one `window.CASES.push({...})` block. Copy an existing one and change the words.

```js
window.CASES.push({
  id: 'resp-something',          // unique, no spaces
  title: 'Short title',
  system: 'Respiratory',         // shows on the case card
  setting: 'Emergency Department',
  patient: { sex: 'F', ageRange: [40, 70], names: ['Optional', 'Name', 'Pool'] },
  hook: 'A rhyme or mnemonic shown before the case and on the summary.',
  tagline: 'One line that makes her want to open it.',
  chart: {                        // what the nurse sees on the chart at the start
    profile: 'History, allergies, weight…',
    notes: [{ time: '0800', text: 'Nurse\'s note. You can write {name}, {he}, {his}.' }],
    vitals: { cols: ['0800'], rows: [['HR', '88'], ['BP', '124/76']] },
    labs: [['WBC', '14.2 k', '4.5–10.5 k']],
    diagnostics: ['Chest X-ray: …'],
    orders: ['…']
  },
  items: [ /* six questions, one per CJMM step, in order */ ],
  bowtie: { /* optional bonus item */ }
});
```

`{name}`, `{age}`, `{he}`, `{He}`, `{his}`, `{His}`, `{him}` are replaced with the randomly drawn patient.

### The six items

Each item has a `step` (one of `recognize`, `analyze`, `prioritize`, `generate`, `action`, `evaluate`),
a `type`, a `prompt`, a short `rationale` (one to three sentences, kind in tone), and optionally a
`chart` block with new information that appears when the item is reached (new notes, vitals columns,
labs, diagnostics, orders). New information is what makes the case "unfold".

Question types:

| type | shape | notes |
| --- | --- | --- |
| `sata` | `options: [{ t, ok, why }]`, optional `n` (how many are correct) | select all that apply; scored NGN style (+1 correct, −1 incorrect) |
| `single` | `options: [{ t, ok, why }]` | one answer |
| `matrix` | `cols: [...]`, `rows: [{ t, ans: 0, why }]`; set `multi: true` and `ans: [0, 2]` for rows with several answers | the "click to specify" grid |
| `cloze` | `parts: ['text ', { options: [...], ans: 2 }, ' more text']` | drop-down sentence |
| `order` | `items: [{ t }]` in the correct order (the app shuffles them) | tap to rank |
| `highlight` | `text: ['plain ', { t: 'phrase', ok: true, why }, ' plain']` | tap phrases in a note |
| `trend` | `rows: [{ t, before, after, ans: 'improved' \| 'declined' \| 'unchanged', why }]` | flowsheet comparison |
| `bowtie` | `conditions`, `actions`, `params` each `[{ t, ok }]` (1 condition, 2 actions, 2 params correct) | the bow-tie diagram |

Keep every `why` to one short sentence. She sees it only for the options she missed or chose wrongly.

## 2. "Who first?" cards (`content/pools.js`, `WHO_FIRST`)

```js
{ tier: 1, sys: 'Resp', t: 'What the nurse hears in report.', cue: 'The one cue that makes this the priority', why: 'One-sentence reason.' }
```

`tier: 1` = unstable or an acute change (the correct answer). `tier: 2` = abnormal but expected, stable.
`tier: 3` = routine, teaching, comfort. Each round draws one tier-1 card and three others.

## 3. Trend templates (`TREND_TEMPLATES`)

Each template describes a story (hemorrhage, burn shock, sepsis…). Rows have a starting range
(`base`), a direction (`dir: 'up' | 'down' | 'flat'`), a change range (`delta`), and which direction is
bad for that row (`worse`). The app generates fresh numbers every time.

## 4. Quick-fire questions (`QUICKFIRE`)

```js
{ q: 'The question text', options: [{ t, ok, why }], rationale: '…' }          // one answer
{ q: '…', multi: true, options: [...], rationale: '…' }                           // select-all
```

## 5. Rhymes (`RHYMES`)

```js
{ cat: 'Neuro', front: 'Cushing\'s triad', back: 'Pressure HIGH, pulse LOW, breathing WEIRD.', tip: 'A late sign.' }
```

## 6. A new framework (`content/frameworks.js`)

Add an entry with an `id`, `name`, `short`, `mnemonic`, and `steps: [{ id, label, question, rhyme }]`.
Then tag items with those step ids and set `framework: 'yourid'` on a case. The step ribbon and the
mastery tracking come along automatically.

## 7. Loading a new content file

If you create a new file (for example `content/cardiac.js`), add one line to `index.html` next to the
other `<script src="content/…">` lines. That is the only edit outside `content/` you will ever need.
