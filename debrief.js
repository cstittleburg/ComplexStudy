/* Exam debriefs: after an exam, the student describes it in their own words.

   A debrief is facts about the test, never its questions: roughly how long it was, the mix of question formats,
   and which topic areas felt heaviest, plus private notes. It shapes the student's own practice straight away:
   questions, cards and cases from the heavy topics come up more often, and Quick Fire leans toward the formats
   the exam used. It does not change the study-method mix (adapt.js); that stays a fair measurement.

   Sharing is opt-in, per debrief, and needs sign-in. Shared debriefs (format and topics only, never the notes)
   go to `exam_debriefs` (0005_exam_debriefs.sql). The pooled view only counts debriefs whose exam was at least
   7 days ago, and shows nothing until 5 students have shared, keyed to the course and exam, never a professor. */
(function () {
'use strict';
const { el, show, toast } = SR;
const FORMATS = [
  { id: 'sata', name: 'Select all that apply', short: 'select-all' },
  { id: 'single', name: 'Single answer', short: 'single-answer' },
  { id: 'case', name: 'Case studies (NGN, bow-tie, matrix)', short: 'case studies' },
  { id: 'calc', name: 'Calculations (doses, drips, rates)', short: 'calculations' },
  { id: 'priority', name: 'Prioritization and delegation', short: 'prioritization' }
];
const LEVELS = ['None', 'Some', 'Lots'];
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const courseKey = c => norm(c.short || c.name) + '|' + norm(c.term);
const examKey = name => norm(name);
let shareState = 'idle';   // idle | ok | missing | error

/* ---------- the student's own exam profile ---------- */
function profile(course) {
  const ex = (course && course.exams) || []; if (!ex.length) return null;
  const formats = {}; FORMATS.forEach(f => formats[f.id] = avg(ex.map(e => (e.formats || {})[f.id] || 0)));
  const heavy = {}; ex.forEach(e => (e.heavy || []).forEach(a => heavy[a] = (heavy[a] || 0) + 1));
  const top = Object.entries(heavy).sort((a, b) => b[1] - a[1]).map(x => x[0]);
  const qs = ex.map(e => e.questions).filter(Boolean), mins = ex.map(e => e.minutes).filter(Boolean);
  return { n: ex.length, formats, heavy, top, questions: qs.length ? Math.round(avg(qs)) : null, minutes: mins.length ? Math.round(avg(mins)) : null };
}
const leaning = course => !!course && course.examLean !== false;
/* How much more often an item should come up. Topic: 2x for a heavy area. Quick Fire: 1.5x for a format the
   exams used a lot. Used by the app when it picks questions, cards, who-first cards and cases. */
function weight(item, kind) {
  const course = SR.courses.active(); if (!leaning(course)) return 1;
  const p = profile(course); if (!p) return 1;
  let w = 1;
  const area = SR.adapt ? SR.adapt.areaOf(item, kind) : null;
  if (area && p.heavy[area]) w *= 2;
  if (kind === 'quickfire') { if (item.multi && p.formats.sata >= 1.5) w *= 1.5; if (!item.multi && p.formats.single >= 1.5) w *= 1.5; }
  return w;
}
function summary(p) {
  if (!p) return '';
  const lots = FORMATS.filter(f => p.formats[f.id] >= 1.5).map(f => f.short);
  const some = FORMATS.filter(f => p.formats[f.id] >= 0.5 && p.formats[f.id] < 1.5).map(f => f.short);
  const areas = p.top.slice(0, 4).map(a => (SR.adapt && SR.adapt.AREA_NAME[a]) || a);
  return [p.questions ? 'about ' + p.questions + ' questions' + (p.minutes ? ' in ' + p.minutes + ' minutes' : '') : null,
    lots.length ? 'lots of ' + lots.join(', ') : null, some.length ? 'some ' + some.join(', ') : null,
    areas.length ? 'heaviest on ' + areas.join(', ') : null].filter(Boolean).join('; ') + '.';
}

/* ---------- notes screening: descriptions yes, reconstructed questions no ---------- */
function looksLikeQuestion(text) {
  const t = String(text || '');
  if (!t.trim()) return null;
  if (/which of the following|select all that apply|what (?:is|would be) the (?:priority|first|best|most)|which (?:client|patient) should|the nurse (?:should|would|will) (?:first )?(?:do|take|say|assess)/i.test(t)) return 'it contains wording from a question';
  if (/(?:^|\s)\(?[a-d][).:]\s+\S[\s\S]*(?:^|\s)\(?[b-e][).:]\s+\S/im.test(t)) return 'it lists answer options';
  if ((t.match(/\?/g) || []).length >= 2) return 'it reads like a list of questions';
  if (/["“][^"”]{70,}["”]/.test(t)) return 'it quotes a long passage';
  return null;
}

/* Topic areas that exist in this course's content, for the "heaviest topics" chips. */
function courseAreas() {
  const c = SR.content(); const A = SR.adapt; if (!A) return [];
  const seen = new Set();
  c.cases.forEach(x => seen.add(A.areaOf(x, 'case'))); c.quickfire.forEach(x => seen.add(A.areaOf(x, 'quickfire')));
  c.rhymes.forEach(x => seen.add(A.areaOf(x, 'rhyme'))); c.whofirst.forEach(x => seen.add(A.areaOf(x, 'whofirst'))); c.trends.forEach(x => seen.add(A.areaOf(x, 'trend')));
  return A.AREAS.map(a => a[0]).filter(a => seen.has(a));
}

/* ---------- sharing ---------- */
async function upload(course, exam) {
  const A = SR.account; if (!A || !A.client || !A.user || shareState === 'missing') return;
  const key = courseKey(course) + '#' + examKey(exam.name);
  if (exam.sharedAs && exam.sharedAs !== key) await unshareKey(exam.sharedAs);   // renamed since it was shared
  if (!exam.share) { if (exam.sharedAs) { await unshareKey(exam.sharedAs); delete exam.sharedAs; SR.save(); } return; }
  const row = { user_id: A.user.id, course_key: courseKey(course), exam_key: examKey(exam.name), taken_on: exam.takenOn, questions: exam.questions || null, minutes: exam.minutes || null, formats: exam.formats || {}, heavy: exam.heavy || [] };
  const { error } = await A.client.from('exam_debriefs').upsert(row, { onConflict: 'user_id,course_key,exam_key' });
  if (!error) { exam.sharedAs = key; shareState = 'ok'; SR.save(); }
  else { shareState = A.isMissing(error) ? 'missing' : 'error'; if (shareState === 'error') console.warn('debrief not shared:', error.message); }
}
async function unshareKey(key) {
  const A = SR.account; if (!A || !A.client || !A.user) return;
  const [ck, ek] = key.split('#');
  const { error } = await A.client.from('exam_debriefs').delete().eq('user_id', A.user.id).eq('course_key', ck).eq('exam_key', ek);
  if (error && !A.isMissing(error)) console.warn('debrief not removed:', error.message);
}
(SR.hooks.signedIn = SR.hooks.signedIn || []).push(() => {
  const st = SR.state();
  Object.values(st.courses || {}).forEach(c => (c.exams || []).forEach(e => { if (e.share && !e.sharedAs) upload(c, e); }));
});
async function pooled(course, name) {
  const A = SR.account; if (!A || !A.client || !A.user || shareState === 'missing') return null;
  const { data, error } = await A.client.rpc('pooled_exam_profile', { p_course: courseKey(course), p_exam: examKey(name) });
  if (error) { if (A.isMissing(error)) shareState = 'missing'; return null; }
  return (data && data[0]) || null;
}

/* ---------- screens ---------- */
function form(existing) {
  const course = SR.courses.active(); if (!course) return SR.courses.picker();
  const d = existing ? JSON.parse(JSON.stringify(existing)) : { id: 'x' + Date.now().toString(36), name: '', takenOn: new Date().toISOString().slice(0, 10), questions: null, minutes: null, formats: {}, heavy: [], notes: '', share: false };
  const names = [...new Set(['Exam 1', 'Exam 2', 'Exam 3', 'Midterm', 'Final', ...(course.exams || []).map(e => e.name)])];
  const name = el('input', { type: 'text', value: d.name, placeholder: 'e.g. Exam 2', list: 'examNames', style: 'width:100%' });
  const list = el('datalist', { id: 'examNames' }, ...names.map(n => el('option', { value: n })));
  const date = el('input', { type: 'date', value: d.takenOn });
  const qn = el('input', { type: 'number', min: 1, max: 500, value: d.questions || '', placeholder: 'about how many?', style: 'width:150px' });
  const mn = el('input', { type: 'number', min: 1, max: 600, value: d.minutes || '', placeholder: 'minutes', style: 'width:150px' });
  const fmt = el('div', { class: 'form' });
  FORMATS.forEach(f => {
    const seg = el('div', { class: 'tri', role: 'group', 'aria-label': f.name });
    const draw = () => { seg.innerHTML = ''; LEVELS.forEach((L, i) => seg.append(el('button', { type: 'button', class: (d.formats[f.id] || 0) === i ? 'sel' : '', 'aria-pressed': (d.formats[f.id] || 0) === i ? 'true' : 'false', onclick: () => { d.formats[f.id] = i; draw(); } }, L))); };
    draw(); fmt.append(el('div', { class: 'row spread' }, el('span', {}, f.name), seg));
  });
  const areaWrap = el('div', { class: 'row favs' });
  const drawAreas = () => { areaWrap.innerHTML = ''; courseAreas().forEach(a => { const on = d.heavy.includes(a); areaWrap.append(el('button', { class: 'btn sm' + (on ? ' on' : ''), type: 'button', 'aria-pressed': on ? 'true' : 'false', onclick: () => { const i = d.heavy.indexOf(a); if (i >= 0) d.heavy.splice(i, 1); else if (d.heavy.length < 4) d.heavy.push(a); else toast('Pick up to four.'); drawAreas(); } }, SR.adapt.AREA_NAME[a] || a)); }); };
  drawAreas();
  const notes = el('textarea', { rows: 3, style: 'width:100%', placeholder: 'e.g. more delegation than I expected; two questions on potassium replacement; ran short on time' });
  notes.value = d.notes || '';
  const warn = el('p', { class: 'hint', style: 'color:var(--bad);margin:4px 0 0', hidden: true });
  notes.addEventListener('input', () => { warn.hidden = true; });
  const canShare = SR.account && SR.account.enabled;
  const share = el('input', { type: 'checkbox', id: 'shareBox' }); share.checked = !!d.share;
  const save = () => {
    if (!name.value.trim()) return toast('Name the exam, e.g. Exam 2.');
    const why = looksLikeQuestion(notes.value);
    if (why) { warn.textContent = 'This looks like it might repeat an exam question (' + why + '). Describe what was tested instead, for example “two questions on potassium replacement”. Recreating exam questions is against academic integrity rules, and the app will not store them.'; warn.hidden = false; notes.focus(); return; }
    Object.assign(d, { name: name.value.trim(), takenOn: date.value || new Date().toISOString().slice(0, 10), questions: +qn.value || null, minutes: +mn.value || null, notes: notes.value.trim(), share: canShare && share.checked, at: Date.now() });
    course.exams = (course.exams || []).filter(e => e.id !== d.id).concat([d]).sort((a, b) => (a.takenOn || '').localeCompare(b.takenOn || ''));
    SR.save(); upload(course, d);
    toast('Saved. Your practice now leans toward this exam\'s format and topics.'); listView();
  };
  show(el('div', {}, SR.backRow(existing ? 'Edit exam debrief' : 'Exam debrief'), el('div', { class: 'card form' },
    el('p', { class: 'lead' }, 'Describe the exam in your own words: how long it was, what kinds of questions, which topics. Never the questions themselves.'),
    el('div', { class: 'row' }, el('label', { class: 'field', style: 'flex:2;min-width:180px' }, el('span', { class: 'lbl' }, 'Which exam?'), name, list), el('label', { class: 'field' }, el('span', { class: 'lbl' }, 'Date you took it'), date)),
    el('div', { class: 'row' }, el('label', { class: 'field' }, el('span', { class: 'lbl' }, 'Questions'), qn), el('label', { class: 'field' }, el('span', { class: 'lbl' }, 'Time allowed'), mn)),
    el('h3', { style: 'margin-top:8px' }, 'What kinds of questions?'), fmt,
    el('h3', { style: 'margin-top:8px' }, 'Which topics felt heaviest? (up to four)'), areaWrap,
    el('label', { class: 'field', style: 'margin-top:8px' }, el('span', { class: 'lbl' }, 'Anything that surprised you? (private, stays on this device)'), notes, warn),
    canShare ? el('label', { class: 'consent', for: 'shareBox' }, share, el('span', {}, 'Share this debrief anonymously with other students in this course: format and topics only, never your notes. It is added a week after the exam date, and pooled results appear once 5 students have shared.')) : null,
    el('div', { class: 'actions' }, el('button', { class: 'btn primary', type: 'button', onclick: save }, 'Save debrief'), existing ? el('button', { class: 'btn ghost', type: 'button', onclick: () => { if (!confirm('Delete this debrief?')) return; if (d.sharedAs) unshareKey(d.sharedAs); course.exams = course.exams.filter(e => e.id !== d.id); SR.save(); listView(); } }, 'Delete') : null))));
}
function listView() {
  const course = SR.courses.active(); if (!course) return SR.courses.picker();
  show(el('div', {}, SR.backRow('Exam debriefs', el('button', { class: 'btn sm primary', type: 'button', onclick: () => form() }, '＋ Debrief an exam')), panel(course, listView)));
}
/* The Exams section: used on its own screen and in course settings. */
function panel(course, redraw) {
  const p = profile(course); const wrap = el('div', { class: 'card' });
  if (!p) { wrap.append(el('h3', {}, 'No exams yet'), el('p', { class: 'hint', style: 'margin-top:4px' }, 'After each exam, take two minutes to describe it: length, kinds of questions, heaviest topics. Your practice then leans toward that format and those topics.'), el('button', { class: 'btn sm primary', type: 'button', onclick: () => form() }, '＋ Debrief an exam')); return wrap; }
  const lean = el('button', { class: 'switch' + (leaning(course) ? ' on' : ''), type: 'button', role: 'switch', 'aria-checked': leaning(course) ? 'true' : 'false', onclick: () => { course.examLean = !leaning(course); SR.save(); redraw(); } });
  wrap.append(el('div', { class: 'eyebrow' }, 'Your exam profile · ' + p.n + ' exam' + (p.n === 1 ? '' : 's')), el('p', { style: 'margin-top:6px' }, summary(p).replace(/^./, c => c.toUpperCase())),
    el('div', { class: 'setting' }, el('div', {}, el('strong', {}, 'Lean practice toward this'), el('div', { class: 'hint', style: 'margin:0' }, 'Questions, cards and cases from the heaviest topics come up about twice as often; Quick Fire leans toward the formats used most.')), lean));
  const ul = el('ul', { class: 'list', style: 'margin-top:10px' });
  (course.exams || []).slice().reverse().forEach(e => {
    const pool = el('div', { class: 'hint', style: 'margin:2px 0 0' });
    ul.append(el('li', {}, el('strong', {}, e.name), ' ', el('span', { class: 'hint', style: 'display:inline' }, e.takenOn + (e.share ? ' · shared' : '')), ' ', el('button', { class: 'btn sm ghost', type: 'button', onclick: () => form(e) }, 'edit'), pool));
    pooled(course, e.name).then(r => { if (r) pool.textContent = 'Pooled from ' + r.students + ' students: ' + summary({ n: r.students, formats: r.formats || {}, heavy: r.heavy || {}, top: Object.entries(r.heavy || {}).sort((a, b) => b[1] - a[1]).map(x => x[0]), questions: r.avg_questions, minutes: r.avg_minutes }); });
  });
  wrap.append(ul, el('div', { class: 'row', style: 'margin-top:8px' }, el('button', { class: 'btn sm primary', type: 'button', onclick: () => form() }, '＋ Debrief an exam')));
  return wrap;
}

SR.debrief = { FORMATS, profile, weight, summary, looksLikeQuestion, courseKey, examKey, form, listView, panel, pooled, get shareState() { return shareState; } };
})();
