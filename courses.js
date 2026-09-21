/* Courses: the course model, the course picker home, the "build your study environment" wizard,
   course settings, and in-app editors for flashcards, practice questions and mnemonics.
   Built-in content (content/*.js) belongs to the built-in course unless an item carries `course: '<id>'`. */
(function () {
'use strict';
const { el, show, toast, shuffle } = SR;
const S = () => SR.state();

const BUILTIN_ID = 'nurs4620';
const BUILTIN = {
  id: BUILTIN_ID, builtin: true,
  name: 'NURS 4620 · Complex Healthcare Problems Across the Lifespan',
  short: 'NURS 4620', term: 'Fall 2026',
  blurb: 'Short, real-feeling cases from your course, walked through the Clinical Judgment Measurement Model one step at a time. One shift takes about twelve minutes. Then take a break; you earned it.',
  frameworks: ['cjmm', 'lens', 'atoi', 'sbar'],
  methods: ['cases', 'whofirst', 'trend', 'abg', 'questions', 'flashcards'],
  materials: [
    { name: 'Case Study – Respiratory Disorders (with answers)', type: 'Case packet', week: 'Week 3' },
    { name: 'NGN Case Studies Week 1', type: 'Case packet', week: 'Week 1' },
    { name: 'Week 1 Kahoot', type: 'Quiz', week: 'Week 1' },
    { name: 'Complex Cases: Neurological Conditions', type: 'Slides', week: 'Week 2' },
    { name: 'Burns, Fluids & Electrolytes', type: 'Slides', week: 'Week 1' },
    { name: 'Complex Care Prioritization: Practical Examples', type: 'Slides', week: '' },
    { name: 'From Assessment to Action: Prioritization Matters', type: 'Slides', week: '' },
    { name: 'Acid-Base Reference Sheet', type: 'Reference', week: 'Week 3' },
    { name: 'NURS 4620/4720 Exam 1 Study Guide', type: 'Study guide', week: 'Exam 1' }
  ],
  custom: { flashcards: [], questions: [] }
};

/* Study methods a course can enable. `method` on a Mode maps to these ids. */
const METHODS = [
  { id: 'cases', name: 'Unfolding case studies', d: 'Six-step NGN-style cases with a live chart. Built by Claude from your case packets.', source: 'pack' },
  { id: 'whofirst', name: 'Prioritization & delegation', d: '"Who first?" rounds and delegation calls from patient cards.', source: 'pack' },
  { id: 'trend', name: 'Trend reading', d: 'Flowsheet columns with fresh numbers each time: better, worse, or same.', source: 'pack' },
  { id: 'abg', name: 'ABG decoding', d: 'Randomly generated blood gases (works for any course).', source: 'builtin' },
  { id: 'questions', name: 'Practice questions', d: 'Quick single-answer and select-all questions. You can write these in the app.', source: 'editor' },
  { id: 'flashcards', name: 'Flashcards & mnemonics', d: 'Front/back cards, rhymes, hooks. You can write these in the app.', source: 'editor' }
];

function all() {
  const c = S().courses;
  if (!c[BUILTIN_ID]) { c[BUILTIN_ID] = JSON.parse(JSON.stringify(BUILTIN)); }
  else { // merge any materials added to the built-in pack since this browser first stored the course
    const have = new Set((c[BUILTIN_ID].materials || []).map(m => m.name));
    BUILTIN.materials.forEach(m => { if (!have.has(m.name)) (c[BUILTIN_ID].materials = c[BUILTIN_ID].materials || []).push(JSON.parse(JSON.stringify(m))); });
  }
  return c;
}
function active() { const c = all(); return c[S().activeCourse] || null; }
function setActive(id) { S().activeCourse = id; SR.save(); }
function courseOf(item) { return item.course || BUILTIN_ID; }

/* Content visible to the active course: built-in packs tagged for it plus what she wrote in the editors. */
function content() {
  const c = active(); const id = c ? c.id : BUILTIN_ID;
  const custom = (c && c.custom) || { flashcards: [], questions: [] };
  const focus = (c && c.focus && c.focus.length) ? new Set(c.focus) : null;
  const inFocus = x => !focus || !x.source || x.source === 'general' || focus.has(x.source);
  const mine = x => courseOf(x) === id && inFocus(x);
  const rhymes = window.RHYMES.filter(mine).concat(custom.flashcards.filter(inFocus).map(f => ({ cat: f.cat || 'My cards', front: f.front, back: f.back, tip: f.tip || '', custom: true, id: f.id, source: f.source })));
  const quickfire = window.QUICKFIRE.filter(mine).concat(custom.questions.filter(inFocus).map(q => ({ q: q.q, multi: q.multi, options: q.options, rationale: q.rationale, custom: true, id: q.id, source: q.source })));
  return {
    cases: window.CASES.filter(mine),
    whofirst: window.WHO_FIRST.filter(mine),
    trends: window.TREND_TEMPLATES.filter(mine),
    delegation: window.DELEGATION.filter(mine),
    quickfire, rhymes, focus: focus ? [...focus] : null
  };
}

/* ---------------- course picker (the new home) ---------------- */
function picker() {
  const courses = Object.values(all());
  const grid = el('div', { class: 'caselist' });
  for (const c of courses) {
    const ev = S().events.filter(e => e.c === c.id); const n = ev.length; const acc = n ? Math.round(100 * ev.reduce((a, e) => a + e.sc, 0) / n) : null;
    grid.append(el('button', { class: 'casecard', type: 'button', onclick: () => { setActive(c.id); SR.homeView(); } },
      el('span', { class: 'sys' }, (c.term || '') + (c.builtin ? ' · built-in pack' : ' · your course')),
      el('span', { class: 't' }, c.name),
      el('span', { class: 'tl' }, (c.methods || []).map(m => (METHODS.find(x => x.id === m) || {}).name).filter(Boolean).join(' · ')),
      el('span', { class: 'done' }, n ? `${n} items answered · ${acc}% average` : 'not started')));
  }
  grid.append(el('button', { class: 'casecard newcourse', type: 'button', onclick: () => wizard() }, el('span', { class: 'sys' }, 'New'), el('span', { class: 't' }, '＋ Create a course'), el('span', { class: 'tl' }, 'Build your study environment: add the material, choose how you want to study, pick a framework.')));
  show(el('div', {},
    el('div', { class: 'card lift', style: 'margin-bottom:18px' }, el('div', { class: 'eyebrow' }, 'Shift Ready'), el('h1', {}, 'Your courses'), el('p', { class: 'lead' }, 'Pick a course to study, or set up a new one. Each course keeps its own material, methods and frameworks; your progress is tracked across all of them.')),
    grid));
}

/* ---------------- "build your study environment" wizard ---------------- */
function wizard(existing) {
  const draft = existing ? JSON.parse(JSON.stringify(existing)) : { id: 'c' + Date.now().toString(36), name: '', short: '', term: '', blurb: '', frameworks: ['cjmm'], methods: ['cases', 'questions', 'flashcards'], materials: [], custom: { flashcards: [], questions: [] } };
  let step = 0;
  const steps = ['Course', 'Material', 'How you study', 'Frameworks', 'Review'];
  function frame(body, canNext = true) {
    const ribbon = el('div', { class: 'ribbon' }); steps.forEach((s, i) => ribbon.append(el('div', { class: 'node' + (i === step ? ' current' : '') + (i < step ? ' done' : '') }, el('span', { class: 'i' }, 'STEP ' + (i + 1)), s)));
    show(el('div', {}, el('div', { class: 'row spread', style: 'margin-bottom:8px' }, el('div', {}, el('div', { class: 'eyebrow' }, existing ? 'Edit course' : 'Build your study environment'), el('h2', {}, steps[step])), el('button', { class: 'btn sm ghost', type: 'button', onclick: () => existing ? settings() : picker() }, 'Cancel')), ribbon,
      el('div', { class: 'qcard' }, body, el('div', { class: 'actions' }, step > 0 ? el('button', { class: 'btn', type: 'button', onclick: () => { step--; render(); } }, '← Back') : null, el('span', { class: 'spacer' }), el('button', { class: 'btn primary', type: 'button', onclick: () => { if (!validate()) return; if (step < steps.length - 1) { step++; render(); } else finish(); } }, step === steps.length - 1 ? (existing ? 'Save course' : 'Create course') : 'Next →')))));
  }
  function validate() { if (step === 0 && !draft.name.trim()) { toast('Give the course a name.'); return false; } if (step === 2 && !draft.methods.length) { toast('Pick at least one way to study.'); return false; } if (step === 3 && !draft.frameworks.length) { toast('Pick at least one framework.'); return false; } return true; }
  const input = (label, key, ph, hint) => { const i = el('input', { type: 'text', value: draft[key] || '', placeholder: ph || '', style: 'width:100%' }); i.addEventListener('input', () => draft[key] = i.value); return el('label', { class: 'field' }, el('span', { class: 'lbl' }, label), i, hint ? el('span', { class: 'hint' }, hint) : null); };
  function render() {
    if (step === 0) frame(el('div', { class: 'form' }, el('p', { class: 'hint' }, 'What is this course? The name shows on the home screen.'), input('Course name', 'name', 'e.g. NURS 4630 Leadership & Management'), input('Short name', 'short', 'e.g. NURS 4630'), input('Term', 'term', 'e.g. Spring 2027'), input('One-line description (optional)', 'blurb', 'What this course is about, in your words')));
    if (step === 1) {
      const list = el('div', { class: 'matlist' });
      const draw = () => { list.innerHTML = ''; if (!draft.materials.length) list.append(el('p', { class: 'hint' }, 'No material added yet. Add the files, slide decks, packets and notes you have. Claude uses this list to build cases and cards; you can also paste key notes here for quick reference.')); draft.materials.forEach((m, i) => list.append(el('div', { class: 'mat' }, el('div', {}, el('strong', {}, m.name), el('div', { class: 'hint' }, [m.type, m.week].filter(Boolean).join(' · ') + (m.notes ? ' · notes attached' : ''))), el('button', { class: 'btn sm ghost', type: 'button', onclick: () => { draft.materials.splice(i, 1); draw(); } }, 'Remove')))); };
      const name = el('input', { type: 'text', placeholder: 'File or material name (e.g. Week 4 Cardiac slides)', style: 'flex:2;min-width:200px' });
      const type = el('select', {}, ...['Case packet', 'Slides', 'Quiz', 'Reading', 'Reference', 'My notes', 'Other'].map(t => el('option', { value: t }, t)));
      const week = el('input', { type: 'text', placeholder: 'Week / unit', style: 'width:120px' });
      const notes = el('textarea', { placeholder: 'Optional: paste key notes, an answer key, or a summary of this material', rows: 3, style: 'width:100%' });
      const file = el('input', { type: 'file', multiple: true, accept: '.doc,.docx,.ppt,.pptx,.pdf,.txt,.md,.zip', style: 'display:none' });
      file.addEventListener('change', () => { for (const f of file.files) draft.materials.push({ name: f.name, type: guessType(f.name), week: week.value, size: f.size, addedAt: Date.now() }); draw(); toast(file.files.length + ' file name(s) added. The file itself stays on your computer; send it to Claude to build content from it.'); file.value = ''; });
      const add = () => { if (!name.value.trim()) return toast('Type a name for the material.'); draft.materials.push({ name: name.value.trim(), type: type.value, week: week.value.trim(), notes: notes.value.trim(), addedAt: Date.now() }); name.value = ''; notes.value = ''; draw(); };
      draw();
      frame(el('div', { class: 'form' }, el('p', {}, 'Add everything the professor gave you for this course. Files are listed by name (the app never uploads them); the notes box is for anything you want to keep with the course.'), el('div', { class: 'row' }, name, type, week), notes, el('div', { class: 'row' }, el('button', { class: 'btn sm', type: 'button', onclick: add }, '＋ Add material'), el('button', { class: 'btn sm ghost', type: 'button', onclick: () => file.click() }, 'Pick files from my computer'), file), el('h3', { style: 'margin-top:14px' }, 'Materials (' + draft.materials.length + ')'), list));
    }
    if (step === 2) {
      const grid = el('div', { class: 'choices' });
      METHODS.forEach(m => { const on = draft.methods.includes(m.id); grid.append(el('button', { class: 'choice' + (on ? ' on' : ''), type: 'button', 'aria-pressed': on, onclick: () => { const k = draft.methods.indexOf(m.id); if (k >= 0) draft.methods.splice(k, 1); else draft.methods.push(m.id); render(); } }, el('span', { class: 'box' }), el('span', {}, el('strong', {}, m.name), el('span', { class: 'hint', style: 'display:block' }, m.d), el('span', { class: 'tag' }, m.source === 'editor' ? 'You can write these in the app' : m.source === 'builtin' ? 'Works for any course' : 'Needs a content pack built from your material')))); });
      frame(el('div', {}, el('p', { class: 'hint' }, 'How do you want to study this course? You can change this later. The Insights page will tell you which of these actually pays off for you.'), grid));
    }
    if (step === 3) {
      const grid = el('div', { class: 'choices' });
      Object.values(SR.FRAMEWORKS).forEach(f => { const on = draft.frameworks.includes(f.id); grid.append(el('button', { class: 'choice' + (on ? ' on' : ''), type: 'button', 'aria-pressed': on, onclick: () => { const k = draft.frameworks.indexOf(f.id); if (k >= 0) draft.frameworks.splice(k, 1); else draft.frameworks.push(f.id); render(); } }, el('span', { class: 'box' }), el('span', {}, el('strong', {}, f.name), el('span', { class: 'hint', style: 'display:block' }, f.steps.map(s => s.label).join(' → '))))); });
      const custom = el('div', { class: 'form', style: 'margin-top:12px' });
      const fname = el('input', { type: 'text', placeholder: 'New framework name (e.g. Nursing Process)', style: 'width:100%' });
      const fsteps = el('input', { type: 'text', placeholder: 'Steps, comma-separated (e.g. Assess, Diagnose, Plan, Implement, Evaluate)', style: 'width:100%' });
      custom.append(el('h3', {}, 'Add a framework the course uses'), fname, fsteps, el('button', { class: 'btn sm', type: 'button', onclick: () => { const nm = fname.value.trim(); const st = fsteps.value.split(',').map(x => x.trim()).filter(Boolean); if (!nm || st.length < 2) return toast('Name it and list at least two steps.'); const id = 'fw_' + nm.toLowerCase().replace(/[^a-z0-9]+/g, '_'); SR.FRAMEWORKS[id] = { id, name: nm, short: nm, mnemonic: '', custom: true, steps: st.map((l, i) => ({ id: 's' + i, label: l, question: '' })) }; S().customFrameworks = S().customFrameworks || {}; S().customFrameworks[id] = SR.FRAMEWORKS[id]; draft.frameworks.push(id); SR.save(); render(); } }, '＋ Add framework'));
      frame(el('div', {}, el('p', { class: 'hint' }, 'The first framework you pick becomes the map on the course home screen. Questions in content packs are tagged with framework steps so mastery can be tracked per step.'), grid, custom));
    }
    if (step === 4) {
      frame(el('div', {}, el('div', { class: 'ptbanner' }, el('div', { class: 'avatar' }, (draft.short || draft.name).slice(0, 1).toUpperCase()), el('div', {}, el('strong', {}, draft.name), el('div', { class: 'hint', style: 'margin:0' }, [draft.short, draft.term].filter(Boolean).join(' · ')))),
        el('ul', { class: 'list', style: 'margin-top:12px' }, el('li', {}, el('strong', {}, 'Material: '), draft.materials.length + ' item(s)'), el('li', {}, el('strong', {}, 'Study methods: '), draft.methods.map(m => METHODS.find(x => x.id === m).name).join(', ')), el('li', {}, el('strong', {}, 'Frameworks: '), draft.frameworks.map(f => (SR.FRAMEWORKS[f] || {}).name || f).join(', '))),
        el('div', { class: 'rhymebox' }, 'What happens next: flashcards and practice questions can be written right away in course settings. Cases, "who first" cards and trend templates come from a content pack; use “Export course spec” in settings and send it to Claude with the files to have one built.')));
    }
  }
  function finish() { all()[draft.id] = draft; setActive(draft.id); SR.save(); toast(existing ? 'Course saved' : 'Course created'); SR.homeView(); }
  render();
}
function guessType(n) { n = n.toLowerCase(); if (/ppt|slide/.test(n)) return 'Slides'; if (/case/.test(n)) return 'Case packet'; if (/kahoot|quiz/.test(n)) return 'Quiz'; if (/\.pdf$|\.docx?$/.test(n)) return 'Reading'; return 'Other'; }

/* ---------------- course settings ---------------- */
function settings() {
  const c = active(); if (!c) return picker();
  const cnt = content();
  const card = el('div', { class: 'card' },
    el('div', { class: 'row spread' }, el('div', {}, el('div', { class: 'eyebrow' }, c.term || ''), el('h2', {}, c.name)), el('div', { class: 'row' }, el('button', { class: 'btn sm', type: 'button', onclick: () => wizard(c) }, 'Edit course'), !c.builtin ? el('button', { class: 'btn sm ghost', type: 'button', onclick: () => { if (confirm('Delete this course and its custom cards and questions? Progress events are kept.')) { delete all()[c.id]; S().activeCourse = BUILTIN_ID; SR.save(); picker(); } } }, 'Delete') : null)),
    el('div', { class: 'scoreline', style: 'margin-top:14px' }, el('div', { class: 's' }, el('div', { class: 'b' }, cnt.cases.length), el('div', { class: 'l' }, 'cases')), el('div', { class: 's' }, el('div', { class: 'b' }, cnt.whofirst.length), el('div', { class: 'l' }, 'priority cards')), el('div', { class: 's' }, el('div', { class: 'b' }, cnt.trends.length), el('div', { class: 'l' }, 'trend templates')), el('div', { class: 's' }, el('div', { class: 'b' }, cnt.quickfire.length), el('div', { class: 'l' }, 'questions')), el('div', { class: 's' }, el('div', { class: 'b' }, cnt.rhymes.length), el('div', { class: 'l' }, 'flashcards'))),
    el('h3', { style: 'margin-top:18px' }, 'Focus'),
    el('p', { class: 'hint' }, 'Limit practice to items built from particular material. Untick everything to use all of it. Framework and heuristic cards always stay in.'),
    focusPanel(c),
    el('h3', { style: 'margin-top:18px' }, 'Add content yourself'),
    el('div', { class: 'row', style: 'margin-top:8px' }, el('button', { class: 'btn', type: 'button', onclick: () => editor('flashcards') }, '＋ Flashcard or mnemonic'), el('button', { class: 'btn', type: 'button', onclick: () => editor('questions') }, '＋ Practice question')),
    el('h3', { style: 'margin-top:18px' }, 'Have Claude build a content pack'),
    el('p', { class: 'hint' }, 'Cases, priority cards and trend templates are written from your course files. Export the course spec (materials, methods, frameworks, and anything you wrote) and send it to Claude along with the files.'),
    el('div', { class: 'row', style: 'margin-top:8px' }, el('button', { class: 'btn', type: 'button', onclick: () => exportSpec(c) }, 'Copy course spec to clipboard'), el('button', { class: 'btn ghost', type: 'button', onclick: () => importCustom(c) }, 'Import cards/questions (JSON)')),
    el('h3', { style: 'margin-top:18px' }, 'Materials (' + (c.materials || []).length + ')'),
    el('ul', { class: 'list' }, ...(c.materials || []).map(m => el('li', {}, el('strong', {}, m.name), ' ', el('span', { class: 'hint', style: 'display:inline' }, [m.type, m.week].filter(Boolean).join(' · '))))),
    (c.custom.flashcards.length || c.custom.questions.length) ? el('div', {}, el('h3', { style: 'margin-top:18px' }, 'Your cards and questions'), customList(c)) : null);
  show(el('div', {}, SR.backRow('Course settings'), card));
}
function focusPanel(c) {
  const mats = (c.materials || []).map(m => m.name);
  const counts = {}; const id = c.id;
  const bump = x => { if (courseOf(x) === id && x.source && x.source !== 'general') counts[x.source] = (counts[x.source] || 0) + 1; };
  window.CASES.forEach(bump); window.WHO_FIRST.forEach(bump); window.TREND_TEMPLATES.forEach(bump); window.DELEGATION.forEach(bump); window.QUICKFIRE.forEach(bump); window.RHYMES.forEach(bump);
  (c.custom.flashcards || []).forEach(bump); (c.custom.questions || []).forEach(bump);
  const names = [...new Set([...mats, ...Object.keys(counts)])];
  const wrap = el('div', { class: 'choices' });
  const sel = new Set(c.focus || []);
  names.forEach(n => { const on = sel.has(n); wrap.append(el('button', { class: 'choice' + (on ? ' on' : ''), type: 'button', 'aria-pressed': on, onclick: () => { if (sel.has(n)) sel.delete(n); else sel.add(n); c.focus = [...sel]; SR.save(); settings(); } }, el('span', { class: 'box' }), el('span', {}, el('strong', {}, n), el('span', { class: 'hint', style: 'display:block' }, (counts[n] || 0) + ' item' + (counts[n] === 1 ? '' : 's') + ' built from this')))); });
  if (!names.length) wrap.append(el('p', { class: 'hint' }, 'No material listed yet.'));
  return el('div', {}, wrap, sel.size ? el('div', { class: 'row', style: 'margin-top:8px' }, el('span', { class: 'hint' }, 'Focused on ' + sel.size + ' material' + (sel.size === 1 ? '' : 's') + '.'), el('button', { class: 'btn sm ghost', type: 'button', onclick: () => { c.focus = []; SR.save(); settings(); } }, 'Clear focus')) : null);
}
function customList(c) {
  const ul = el('ul', { class: 'list' });
  c.custom.flashcards.forEach((f, i) => ul.append(el('li', {}, el('strong', {}, 'Card: '), f.front, ' ', el('button', { class: 'btn sm ghost', type: 'button', onclick: () => { c.custom.flashcards.splice(i, 1); SR.save(); settings(); } }, 'remove'))));
  c.custom.questions.forEach((q, i) => ul.append(el('li', {}, el('strong', {}, 'Question: '), q.q.slice(0, 80), ' ', el('button', { class: 'btn sm ghost', type: 'button', onclick: () => { c.custom.questions.splice(i, 1); SR.save(); settings(); } }, 'remove'))));
  return ul;
}
function exportSpec(c) {
  const spec = { app: 'Shift Ready', version: 1, course: { id: c.id, name: c.name, short: c.short, term: c.term, frameworks: c.frameworks.map(f => SR.FRAMEWORKS[f] || f), methods: c.methods, materials: c.materials, custom: c.custom }, request: 'Please build a Shift Ready content pack for this course in the format described in docs/ADDING-CASES.md, using only the attached course materials for the answer keys.' };
  const text = JSON.stringify(spec, null, 2);
  const done = () => toast('Course spec copied. Paste it to Claude with the files.');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => fallback(text)); else fallback(text);
  function fallback(t) { const ta = el('textarea', { rows: 12, style: 'width:100%' }); ta.value = t; show(el('div', {}, SR.backRow('Course spec'), el('div', { class: 'card' }, el('p', { class: 'hint' }, 'Select all and copy.'), ta))); ta.select(); }
}
function importCustom(c) {
  const ta = el('textarea', { rows: 10, style: 'width:100%', placeholder: '{ "flashcards": [{ "front": "...", "back": "...", "cat": "..." }], "questions": [{ "q": "...", "multi": false, "options": [{ "t": "...", "ok": true, "why": "..." }], "rationale": "..." }] }' });
  show(el('div', {}, SR.backRow('Import cards and questions'), el('div', { class: 'card' }, el('p', { class: 'hint' }, 'Paste JSON that Claude (or you) produced. Flashcards need front and back; questions need q and options with one or more ok: true.'), ta, el('div', { class: 'actions' }, el('button', { class: 'btn primary', type: 'button', onclick: () => { try { const j = JSON.parse(ta.value); let n = 0; (j.flashcards || []).forEach(f => { if (f.front && f.back) { c.custom.flashcards.push({ id: 'f' + Date.now().toString(36) + n, front: f.front, back: f.back, cat: f.cat || 'My cards', tip: f.tip || '', source: f.source }); n++; } }); (j.questions || []).forEach(q => { if (q.q && Array.isArray(q.options) && q.options.some(o => o.ok)) { c.custom.questions.push({ id: 'q' + Date.now().toString(36) + n, q: q.q, multi: !!q.multi, options: q.options, rationale: q.rationale || '', source: q.source }); n++; } }); SR.save(); toast('Imported ' + n + ' item(s)'); settings(); } catch (e) { toast('That is not valid JSON.'); } } }, 'Import')))));
}

/* ---------------- editors ---------------- */
function editor(kind) {
  const c = active(); if (!c) return picker();
  if (kind === 'flashcards') {
    const front = el('input', { type: 'text', placeholder: 'Front (the prompt, e.g. "Cushing\'s triad")', style: 'width:100%' });
    const back = el('textarea', { rows: 4, placeholder: 'Back (the answer, rhyme or mnemonic)', style: 'width:100%' });
    const cat = el('input', { type: 'text', placeholder: 'Category (e.g. Neuro, Mnemonic)', style: 'width:100%' });
    const tip = el('input', { type: 'text', placeholder: 'Optional tip shown under the back', style: 'width:100%' });
    const src = sourceSelect(c);
    show(el('div', {}, SR.backRow('New flashcard'), el('div', { class: 'card form' }, front, back, cat, tip, el('label', { class: 'field' }, el('span', { class: 'lbl' }, 'Built from which material?'), src), el('div', { class: 'actions' }, el('button', { class: 'btn primary', type: 'button', onclick: () => { if (!front.value.trim() || !back.value.trim()) return toast('Front and back are both needed.'); c.custom.flashcards.push({ id: 'f' + Date.now().toString(36), front: front.value.trim(), back: back.value.trim(), cat: cat.value.trim() || 'My cards', tip: tip.value.trim(), source: src.value || undefined }); SR.save(); toast('Card added'); front.value = back.value = tip.value = ''; front.focus(); } }, 'Save and add another'), el('button', { class: 'btn', type: 'button', onclick: () => SR.Modes.find(m => m.id === 'rhymes').start() }, 'Done')))));
  } else {
    const q = el('textarea', { rows: 3, placeholder: 'The question', style: 'width:100%' });
    const multi = el('select', {}, el('option', { value: '0' }, 'One correct answer'), el('option', { value: '1' }, 'Select all that apply'));
    const opts = el('div', { class: 'form' }); const rows = [];
    const addRow = () => { const t = el('input', { type: 'text', placeholder: 'Answer option', style: 'flex:2;min-width:180px' }); const ok = el('input', { type: 'checkbox', title: 'Correct?' }); const why = el('input', { type: 'text', placeholder: 'One-line why (shown if she misses it)', style: 'flex:2;min-width:180px' }); rows.push({ t, ok, why }); opts.append(el('div', { class: 'row' }, el('label', { class: 'row', style: 'gap:6px' }, ok, 'correct'), t, why)); };
    for (let i = 0; i < 4; i++) addRow();
    const rat = el('textarea', { rows: 2, placeholder: 'Rationale (one to three kind sentences)', style: 'width:100%' });
    const src = sourceSelect(c);
    show(el('div', {}, SR.backRow('New practice question'), el('div', { class: 'card form' }, q, multi, el('h3', {}, 'Options'), opts, el('button', { class: 'btn sm ghost', type: 'button', onclick: addRow }, '＋ option'), rat, el('label', { class: 'field' }, el('span', { class: 'lbl' }, 'Built from which material?'), src),
      el('div', { class: 'actions' }, el('button', { class: 'btn primary', type: 'button', onclick: () => { const options = rows.filter(r => r.t.value.trim()).map(r => ({ t: r.t.value.trim(), ok: r.ok.checked, why: r.why.value.trim() })); if (!q.value.trim() || options.length < 2 || !options.some(o => o.ok)) return toast('Need a question, at least two options, and one marked correct.'); c.custom.questions.push({ id: 'q' + Date.now().toString(36), q: q.value.trim(), multi: multi.value === '1', options, rationale: rat.value.trim(), source: src.value || undefined }); SR.save(); toast('Question added'); editor('questions'); } }, 'Save and add another'), el('button', { class: 'btn', type: 'button', onclick: settings }, 'Done')))));
  }
}

function sourceSelect(c) { return el('select', {}, el('option', { value: '' }, 'Not tied to a material'), ...(c.materials || []).map(m => el('option', { value: m.name }, m.name))); }

function boot() {
  const st = S(); all();
  if (st.customFrameworks) Object.assign(SR.FRAMEWORKS, st.customFrameworks);
  if (!st.activeCourse || !st.courses[st.activeCourse]) { st.activeCourse = BUILTIN_ID; }
  const n = Object.keys(st.courses).length;
  if (n === 1) SR.homeView(); else picker();
}

SR.courses = { BUILTIN_ID, METHODS, all, active, setActive, content, picker, wizard, settings, editor, boot };
})();
