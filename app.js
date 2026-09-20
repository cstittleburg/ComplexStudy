/* Shift Ready — engine.
   Registries (add to these to extend the app without touching the flow code):
     FRAMEWORKS  (content/frameworks.js)  the thinking models; cases tag items with step ids
     CASES       (content/*.js)           unfolding cases
     ItemTypes   (below)                  question renderers + graders
     Modes       (below)                  practice modes (shift, case, who-first, trend, abg, bowtie, delegation, rhymes)
*/
(function () {
'use strict';

/* ---------------- utilities ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const app = $('#app');
function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined && v !== false) e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k !== null && k !== undefined && k !== false) e.append(k.nodeType ? k : document.createTextNode(k));
  return e;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function sample(arr, n) { return shuffle(arr).slice(0, n); }
const todayKey = () => new Date().toISOString().slice(0, 10);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

/* ---------------- persistent state ---------------- */
const KEY = 'shift-ready-v1';
const DEFAULT = { xp: 0, streak: { last: null, count: 0 }, shifts: 0, answered: 0, perfect: 0, mastery: {}, muddy: {}, badges: [], settings: { sound: false, theme: 'system', timerMin: 10 }, seen: {}, courses: {}, activeCourse: null, events: [], ratings: [], updatedAt: 0 };
let S = load();
function load() { try { const raw = localStorage.getItem(KEY); if (raw) return Object.assign({}, DEFAULT, JSON.parse(raw)); } catch (e) { } return JSON.parse(JSON.stringify(DEFAULT)); }
function save() { S.updatedAt = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } if (window.SR && SR.hooks.onSave) SR.hooks.onSave(S); }
function applyTheme() { const t = S.settings.theme; if (t === 'system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t); }
applyTheme();

/* ---------------- header / feedback plumbing ---------------- */
function updateHeader() { $('#xpStat').textContent = S.xp; $('#streakStat').textContent = S.streak.count; }
function touchStreak() {
  const t = todayKey();
  if (S.streak.last === t) return;
  const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  S.streak.count = (S.streak.last === y) ? S.streak.count + 1 : 1;
  S.streak.last = t; save(); updateHeader();
}
let toastT;
function toast(msg) { const old = $('.toast'); if (old) old.remove(); const t = el('div', { class: 'toast' }, msg); document.body.append(t); clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 2200); }
function beep(kind) {
  if (!S.settings.sound) return;
  try {
    const ctx = beep.ctx || (beep.ctx = new (window.AudioContext || window.webkitAudioContext)());
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = kind === 'good' ? 660 : kind === 'perfect' ? 880 : 330;
    g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    o.start(); o.stop(ctx.currentTime + 0.4);
  } catch (e) { }
}
function confetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = $('#confetti'); c.hidden = false; c.width = innerWidth; c.height = innerHeight;
  const ctx = c.getContext('2d'); const cs = getComputedStyle(document.documentElement);
  const colors = [cs.getPropertyValue('--accent'), cs.getPropertyValue('--good'), cs.getPropertyValue('--warn'), cs.getPropertyValue('--focus')];
  const ps = Array.from({ length: 90 }, () => ({ x: innerWidth / 2 + rand(-80, 80), y: innerHeight * 0.35, vx: (Math.random() - .5) * 14, vy: rand(-14, -6), r: rand(4, 8), c: pick(colors), a: Math.random() * 6 }));
  let t = 0;
  (function frame() {
    ctx.clearRect(0, 0, c.width, c.height);
    for (const p of ps) { p.x += p.vx; p.y += p.vy; p.vy += 0.45; p.a += 0.1; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6); ctx.restore(); }
    if (++t < 75) requestAnimationFrame(frame); else { ctx.clearRect(0, 0, c.width, c.height); c.hidden = true; }
  })();
}

/* ---------------- scoring / mastery ---------------- */
let currentMode = null;          // set by whichever mode is running; logged with every answer
function setMode(m) { currentMode = m; }
function record({ framework = 'cjmm', step, score, key, label, ms }) {
  S.answered++;
  const wasMuddy = !!(key && S.muddy[key]);
  S.events.push({ t: Date.now(), c: S.activeCourse, m: currentMode, k: key, f: framework, s: step, sc: +score.toFixed(2), ms: ms || 0, re: wasMuddy ? 1 : 0 });
  if (S.events.length > 6000) S.events.splice(0, S.events.length - 6000);
  const xp = Math.round(score * 10) + (score === 1 ? 3 : 0);
  S.xp += xp;
  if (score === 1) S.perfect++;
  if (step) {
    const mk = framework + ':' + step; const m = S.mastery[mk] || { n: 0, s: 0 };
    m.n++; m.s += score; S.mastery[mk] = m;
  }
  if (key) {
    if (score < 1) { const mm = S.muddy[key] || { count: 0, label }; mm.count++; mm.label = label; mm.last = Date.now(); S.muddy[key] = mm; }
    else if (S.muddy[key]) { S.muddy[key].count = Math.max(0, S.muddy[key].count - 1); if (S.muddy[key].count === 0) delete S.muddy[key]; }
  }
  touchStreak(); checkBadges(); save(); updateHeader();
  return xp;
}
const BADGES = [
  { id: 'first', name: 'First Shift', d: 'Complete one full shift', test: s => s.shifts >= 1 },
  { id: 'five', name: 'Five Shifts', d: 'Complete five shifts', test: s => s.shifts >= 5 },
  { id: 'streak3', name: 'Three-Day Streak', d: 'Study three days in a row', test: s => s.streak.count >= 3 },
  { id: 'streak7', name: 'Week Warrior', d: 'Study seven days in a row', test: s => s.streak.count >= 7 },
  { id: 'cue', name: 'Cue Catcher', d: '10 perfect Recognize-cues items', test: s => (s.mastery['cjmm:recognize'] || {}).s >= 10 },
  { id: 'trend', name: 'Trend Spotter', d: '10 perfect Evaluate-outcomes items', test: s => (s.mastery['cjmm:evaluate'] || {}).s >= 10 },
  { id: 'hundred', name: 'Century', d: 'Answer 100 items', test: s => s.answered >= 100 },
  { id: 'xp500', name: 'Charge Nurse', d: 'Earn 500 XP', test: s => s.xp >= 500 }
];
function checkBadges() { for (const b of BADGES) if (!S.badges.includes(b.id) && b.test(S)) { S.badges.push(b.id); setTimeout(() => toast('Badge earned: ' + b.name), 600); } }

/* ---------------- templating ---------------- */
const NAMES = { M: ['Marcus', 'Daniel', 'Roy', 'Jamal', 'Victor', 'Ethan', 'Samuel', 'Luis', 'Omar', 'Henry'], F: ['Grace', 'Rosa', 'Lan', 'Nadia', 'Ellen', 'Priya', 'Beatrice', 'Claire', 'Yara', 'Margaret'] };
function makePatient(c) {
  const p = c.patient || { sex: 'F', ageRange: [40, 70] };
  const name = pick(p.names || NAMES[p.sex]);
  const age = rand(p.ageRange[0], p.ageRange[1]);
  const f = p.sex === 'F';
  return { name, age, sex: p.sex, he: f ? 'she' : 'he', He: f ? 'She' : 'He', his: f ? 'her' : 'his', His: f ? 'Her' : 'His', him: f ? 'her' : 'him' };
}
function fill(s, pt) { return String(s).replace(/\{(name|age|he|He|his|His|him)\}/g, (_, k) => pt[k]); }

/* ---------------- item types ---------------- */
/* Each renderer returns { grade(): {score, misses:[string]} }. `box` is the container it draws into. */
const ItemTypes = {};

ItemTypes.sata = function (item, box, pt) {
  const opts = shuffle(item.options.map((o, i) => ({ ...o, i })));
  const sel = new Set();
  const list = el('div', { class: 'opts' });
  if (item.n) box.append(el('p', { class: 'hint' }, `Select ${item.n}.`));
  for (const o of opts) {
    const b = el('button', { class: 'opt', type: 'button', 'data-i': o.i }, el('span', { class: 'box' }), el('span', {}, fill(o.t, pt)));
    b.addEventListener('click', () => { if (box.classList.contains('graded')) return; if (sel.has(o.i)) { sel.delete(o.i); b.classList.remove('sel'); } else { sel.add(o.i); b.classList.add('sel'); } });
    list.append(b);
  }
  box.append(list);
  return {
    grade() {
      const nOk = item.options.filter(o => o.ok).length; let hit = 0, wrong = 0; const misses = [];
      for (const b of list.children) {
        const o = item.options[+b.dataset.i]; const s = sel.has(+b.dataset.i);
        if (o.ok && s) { hit++; b.classList.add('hit'); }
        else if (o.ok && !s) { b.classList.add('miss'); misses.push('Missed: ' + fill(o.t, pt) + (o.why ? ' — ' + o.why : '')); }
        else if (!o.ok && s) { wrong++; b.classList.add('wrong'); misses.push('Not this one: ' + fill(o.t, pt) + (o.why ? ' — ' + o.why : '')); }
        else b.classList.add('quiet');
        if (o.why) b.append(el('span', { class: 'why' }, o.why));
      }
      return { score: clamp((hit - wrong) / nOk, 0, 1), misses };
    }
  };
};

ItemTypes.single = function (item, box, pt) {
  const opts = shuffle(item.options.map((o, i) => ({ ...o, i })));
  let sel = null; const list = el('div', { class: 'opts' });
  for (const o of opts) {
    const b = el('button', { class: 'opt radio', type: 'button', 'data-i': o.i }, el('span', { class: 'box' }), el('span', {}, fill(o.t, pt)));
    b.addEventListener('click', () => { if (box.classList.contains('graded')) return; sel = o.i; for (const x of list.children) x.classList.toggle('sel', +x.dataset.i === sel); });
    list.append(b);
  }
  box.append(list);
  return {
    grade() {
      const misses = []; let score = 0;
      for (const b of list.children) {
        const o = item.options[+b.dataset.i]; const s = sel === +b.dataset.i;
        if (o.ok && s) { score = 1; b.classList.add('hit'); } else if (o.ok) b.classList.add('miss'); else if (s) { b.classList.add('wrong'); misses.push('You chose: ' + fill(o.t, pt) + (o.why ? ' — ' + o.why : '')); } else b.classList.add('quiet');
        if (o.why) b.append(el('span', { class: 'why' }, o.why));
      }
      if (sel === null) misses.push('No answer selected.');
      return { score, misses };
    }
  };
};

ItemTypes.matrix = function (item, box, pt) {
  const rows = shuffle(item.rows.map((r, i) => ({ ...r, i })));
  const multi = !!item.multi;
  const table = el('table', { class: 'matrix' });
  table.append(el('thead', {}, el('tr', {}, el('th', {}, ''), ...item.cols.map(c => el('th', {}, c)))));
  const tb = el('tbody'); const state = {};
  if (multi) box.append(el('p', { class: 'hint' }, 'Each row may have more than one answer.'));
  for (const r of rows) {
    state[r.i] = new Set();
    const tr = el('tr', { 'data-i': r.i }, el('td', {}, fill(r.t, pt)));
    item.cols.forEach((c, ci) => {
      const cell = el('button', { class: 'cell' + (multi ? '' : ' round'), type: 'button', 'aria-label': c, 'data-c': ci });
      cell.addEventListener('click', () => { if (box.classList.contains('graded')) return; if (multi) { if (state[r.i].has(ci)) state[r.i].delete(ci); else state[r.i].add(ci); } else { state[r.i] = new Set([ci]); } for (const x of tr.querySelectorAll('.cell')) x.classList.toggle('sel', state[r.i].has(+x.dataset.c)); });
      tr.append(el('td', { class: 'c' }, cell));
    });
    tb.append(tr);
  }
  table.append(tb); box.append(el('div', { class: 'tablewrap' }, table));
  return {
    grade() {
      let ok = 0; const misses = [];
      for (const tr of tb.children) {
        const ri = +tr.dataset.i; const r = item.rows[ri]; const want = new Set(Array.isArray(r.ans) ? r.ans : [r.ans]); const got = state[ri];
        const same = want.size === got.size && [...want].every(x => got.has(x));
        if (same) { ok++; tr.classList.add('rowok'); } else { tr.classList.add('rowbad'); misses.push(fill(r.t, pt) + ' → ' + [...want].map(x => item.cols[x]).join(' + ') + (r.why ? ' — ' + r.why : '')); }
        for (const cell of tr.querySelectorAll('.cell')) if (want.has(+cell.dataset.c)) cell.classList.add('want');
        if (r.why) tr.firstChild.append(el('span', { class: 'rowwhy' }, r.why));
      }
      return { score: ok / item.rows.length, misses };
    }
  };
};

ItemTypes.cloze = function (item, box, pt) {
  const p = el('p', { class: 'cloze' }); const selects = [];
  for (const part of item.parts) {
    if (typeof part === 'string') p.append(fill(part, pt));
    else {
      const order = shuffle(part.options.map((o, i) => ({ o, i })));
      const s = el('select', { 'aria-label': 'Choose' }, el('option', { value: '' }, 'Select…'), ...order.map(x => el('option', { value: x.i }, fill(x.o, pt))));
      selects.push({ s, part }); p.append(s);
    }
  }
  box.append(p);
  return {
    grade() {
      let ok = 0; const misses = [];
      for (const { s, part } of selects) {
        s.disabled = true;
        if (+s.value === part.ans && s.value !== '') { ok++; s.classList.add('ok'); } else { s.classList.add('bad'); s.after(el('span', { class: 'ans' }, ' ✓ ' + fill(part.options[part.ans], pt) + ' ')); misses.push('Blank: ' + fill(part.options[part.ans], pt)); }
      }
      return { score: ok / selects.length, misses };
    }
  };
};

ItemTypes.order = function (item, box, pt) {
  const items = shuffle(item.items.map((x, i) => ({ ...x, i })));
  const seq = [];
  box.append(el('p', { class: 'hint' }, 'Tap the actions in the order you would do them. Tap again to remove.'));
  const bank = el('div', { class: 'col' }, el('h4', {}, 'Available')); const chosen = el('div', { class: 'col' }, el('h4', {}, 'Your order'));
  function draw() {
    bank.querySelectorAll('.chip').forEach(c => c.remove()); chosen.querySelectorAll('.chip').forEach(c => c.remove());
    for (const x of items) if (!seq.includes(x.i)) bank.append(el('button', { class: 'chip', type: 'button', onclick: () => { if (box.classList.contains('graded')) return; seq.push(x.i); draw(); } }, el('span', { class: 'n' }, '+'), fill(x.t, pt)));
    seq.forEach((i, k) => { const x = item.items[i]; chosen.append(el('button', { class: 'chip', type: 'button', 'data-i': i, onclick: () => { if (box.classList.contains('graded')) return; seq.splice(k, 1); draw(); } }, el('span', { class: 'n' }, (k + 1) + '.'), fill(x.t, pt))); });
  }
  draw(); box.append(el('div', { class: 'order' }, bank, chosen));
  return {
    grade() {
      let ok = 0; const misses = [];
      const answer = item.answer || item.items.map((_, i) => i);
      chosen.querySelectorAll('.chip').forEach((c, k) => { if (answer[k] === +c.dataset.i) { ok++; c.classList.add('ok'); } else c.classList.add('bad'); });
      if (ok < answer.length) misses.push('Correct order: ' + answer.map((i, k) => (k + 1) + '. ' + fill(item.items[i].t, pt)).join('  '));
      return { score: ok / answer.length, misses };
    }
  };
};

ItemTypes.highlight = function (item, box, pt) {
  const p = el('p', { class: 'hltext' }); const spans = [];
  box.append(el('p', { class: 'hint' }, 'Tap a phrase to highlight it.'));
  for (const t of item.text) {
    if (typeof t === 'string') p.append(fill(t, pt));
    else { const s = el('span', { class: 'hl', role: 'button', tabindex: 0 }, fill(t.t, pt)); const tog = () => { if (box.classList.contains('graded')) return; s.classList.toggle('sel'); }; s.addEventListener('click', tog); s.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); tog(); } }); spans.push({ s, t }); p.append(s); }
  }
  box.append(p);
  return {
    grade() {
      const nOk = spans.filter(x => x.t.ok).length; let hit = 0, wrong = 0; const misses = [];
      for (const { s, t } of spans) { const sel = s.classList.contains('sel'); if (t.ok && sel) { hit++; s.classList.add('hit'); } else if (t.ok) { s.classList.add('miss'); misses.push('Missed: ' + fill(t.t, pt) + (t.why ? ' — ' + t.why : '')); } else if (sel) { wrong++; s.classList.add('wrong'); misses.push('Not a priority cue: ' + fill(t.t, pt) + (t.why ? ' — ' + t.why : '')); } }
      return { score: clamp((hit - wrong) / nOk, 0, 1), misses };
    }
  };
};

ItemTypes.trend = function (item, box, pt) {
  const LAB = { improved: 'Improved', declined: 'Declined', unchanged: 'Unchanged' };
  const table = el('table', { class: 'trend' });
  table.append(el('thead', {}, el('tr', {}, el('th', {}, 'Finding'), el('th', {}, item.beforeLabel || 'Before'), el('th', {}, ''), el('th', {}, item.afterLabel || 'After'), el('th', {}, 'Your call'))));
  const tb = el('tbody'); const state = {};
  item.rows.forEach((r, i) => {
    const tri = el('div', { class: 'tri' });
    for (const k of ['improved', 'declined', 'unchanged']) tri.append(el('button', { type: 'button', 'data-k': k, onclick: (e) => { if (box.classList.contains('graded')) return; state[i] = k; for (const b of tri.children) b.classList.toggle('sel', b.dataset.k === k); } }, LAB[k]));
    tb.append(el('tr', { 'data-i': i }, el('td', {}, fill(r.t, pt)), el('td', { class: 'v' }, r.before), el('td', { class: 'arrow' }, '→'), el('td', { class: 'v' }, r.after), el('td', {}, tri)));
  });
  table.append(tb); box.append(el('div', { class: 'tablewrap' }, table));
  return {
    grade() {
      let ok = 0; const misses = [];
      for (const tr of tb.children) {
        const r = item.rows[+tr.dataset.i]; const got = state[+tr.dataset.i];
        for (const b of tr.querySelectorAll('.tri button')) { if (b.dataset.k === r.ans) b.classList.add('want'); if (b.classList.contains('sel') && b.dataset.k !== r.ans) b.classList.add('bad'); }
        if (got === r.ans) { ok++; tr.classList.add('rowok'); } else { tr.classList.add('rowbad'); misses.push(fill(r.t, pt) + ' → ' + LAB[r.ans] + (r.why ? ' — ' + r.why : '')); }
        if (r.why) tr.firstChild.append(el('span', { class: 'rowwhy' }, r.why));
      }
      return { score: ok / item.rows.length, misses };
    }
  };
};

ItemTypes.bowtie = function (item, box, pt) {
  const groups = { actions: shuffle(item.actions), conditions: shuffle(item.conditions), params: shuffle(item.params) };
  const slots = { actions: [null, null], conditions: [null], params: [null, null] };
  box.append(el('p', { class: 'hint' }, 'Tap a choice to place it in the next open box of its type. Tap a filled box to clear it.'));
  const mk = (g, k) => el('button', { class: 'slot', type: 'button', 'data-g': g, 'data-k': k, onclick: () => { if (box.classList.contains('graded')) return; slots[g][k] = null; draw(); } }, '');
  const left = el('div', { class: 'side' }, el('h4', {}, 'Actions to take'), mk('actions', 0), mk('actions', 1));
  const mid = el('div', { class: 'mid' }, el('h4', {}, 'Condition most likely'), mk('conditions', 0));
  const right = el('div', { class: 'side' }, el('h4', {}, 'Parameters to monitor'), mk('params', 0), mk('params', 1));
  const bank = el('div', { class: 'bank' });
  const bankCols = { actions: el('div', {}, el('h4', {}, 'Actions')), conditions: el('div', {}, el('h4', {}, 'Potential conditions')), params: el('div', {}, el('h4', {}, 'Parameters')) };
  bank.append(bankCols.actions, bankCols.conditions, bankCols.params);
  function draw() {
    for (const g of Object.keys(slots)) {
      box.querySelectorAll(`.slot[data-g="${g}"]`).forEach(s => { const v = slots[g][+s.dataset.k]; s.textContent = v ? fill(v.t, pt) : ''; s.classList.toggle('filled', !!v); if (!v) s.textContent = 'Drop here'; });
      bankCols[g].querySelectorAll('.chip').forEach(c => c.remove());
      for (const o of groups[g]) { const used = slots[g].includes(o); bankCols[g].append(el('button', { class: 'chip' + (used ? ' used' : ''), type: 'button', onclick: () => { if (box.classList.contains('graded')) return; const k = slots[g].indexOf(null); if (k < 0) { toast('That box is full. Tap a filled box to clear it.'); return; } slots[g][k] = o; draw(); } }, fill(o.t, pt))); }
    }
  }
  draw(); box.append(el('div', { class: 'bowtie' }, left, mid, right), bank);
  return {
    grade() {
      let ok = 0; const misses = [];
      for (const g of Object.keys(slots)) {
        box.querySelectorAll(`.slot[data-g="${g}"]`).forEach(s => { const v = slots[g][+s.dataset.k]; if (v && v.ok) { ok++; s.classList.add('ok'); } else s.classList.add('bad'); });
        const want = item[g].filter(o => o.ok).map(o => fill(o.t, pt)); const got = slots[g].filter(Boolean).map(o => fill(o.t, pt));
        if (!want.every(w => got.includes(w))) misses.push((g === 'conditions' ? 'Condition' : g === 'actions' ? 'Actions' : 'Parameters') + ': ' + want.join(' & '));
      }
      return { score: ok / 5, misses };
    }
  };
};

/* ---------------- feedback ---------------- */
const PRAISE = ['Yes. That is the cue that decides it.', 'Exactly right.', 'Clean clinical judgment.', 'You saw the pattern.', 'That is how a nurse thinks at 0700.'];
const NUDGE = ['Close. Here is the one thing that changes the answer.', 'Not yet, and that is what practice is for.', 'Almost. Look at the trend, not the single number.', 'Good instinct; one piece was missing.'];
const GENTLE = ['Not this time, and that is fine. Here is the cue that matters.', 'This one is tricky. Read the "why" once, then move on.', 'Every miss here is one you will not miss on the exam.'];
function showFeedback(box, res, item, xp, pt) {
  const kind = res.score === 1 ? 'good' : res.score >= 0.5 ? 'part' : 'bad';
  const head = res.score === 1 ? pick(PRAISE) : res.score >= 0.5 ? pick(NUDGE) : pick(GENTLE);
  const fb = el('div', { class: 'feedback ' + kind },
    el('div', { class: 'head' }, (kind === 'good' ? '✓ ' : kind === 'part' ? '◐ ' : '○ ') + head, el('span', { class: 'xp' }, '+' + xp + ' XP')),
    item.rationale ? el('p', { class: 'rat' }, fill(item.rationale, pt)) : null);
  if (res.misses.length) { const ul = el('ul', { class: 'misses' }); res.misses.slice(0, 4).forEach(m => ul.append(el('li', {}, m))); fb.append(ul); if (res.misses.length > 4) fb.append(el('p', { class: 'hint' }, `+ ${res.misses.length - 4} more, marked above.`)); }
  box.append(fb); fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  if (res.score === 1) { beep('perfect'); confetti(); } else if (res.score >= 0.5) beep('good'); else beep('bad');
}
/* Renders one item into a question card. onDone(score) fires when the learner presses Next. */
function questionCard({ item, pt = {}, framework = 'cjmm', stepIndex, key, label, nextLabel = 'Next', onDone, extraTop }) {
  const fw = FRAMEWORKS[framework]; const step = fw && item.step ? fw.steps.find(s => s.id === item.step) : null;
  const card = el('div', { class: 'qcard' });
  if (extraTop) card.append(extraTop);
  if (step) card.append(el('div', { class: 'stepchip' }, el('span', { class: 'num' }, (stepIndex ?? fw.steps.indexOf(step)) + 1), step.label, el('span', { class: 'q' }, '· ' + step.question)));
  card.append(el('p', { class: 'prompt' }, fill(item.prompt, pt)));
  if (item.unverified) card.append(el('p', { class: 'hint' }, 'The packet did not include an answer key for this question; the key here was supplied from the course materials.'));
  const box = el('div'); card.append(box);
  const r = ItemTypes[item.type](item, box, pt); const t0 = Date.now();
  const actions = el('div', { class: 'actions' });
  const check = el('button', { class: 'btn primary', type: 'button' }, 'Check');
  const next = el('button', { class: 'btn', type: 'button', hidden: true }, nextLabel + ' →');
  let done = false;
  check.addEventListener('click', () => {
    if (done) return; done = true; box.classList.add('graded');
    let res; try { res = r.grade(); } catch (err) { console.error(err); res = { score: 0, misses: ['This item could not be graded (a content error). You can keep going.'] }; }
    const xp = record({ framework, step: item.step, score: res.score, key, label, ms: Date.now() - t0 });
    showFeedback(box, res, item, xp, pt); check.hidden = true; next.hidden = false; next.focus();
    next.addEventListener('click', () => onDone(res.score), { once: true });
  });
  actions.append(check, el('span', { class: 'spacer' }), next);
  card.append(actions);
  return card;
}

/* ---------------- chart (EHR) panel ---------------- */
function chartPanel(c, pt) {
  const state = { profile: null, notes: [], vitals: { cols: [], rows: {} }, labs: [], diagnostics: [], orders: [] };
  const wrap = el('aside', { class: 'chart' });
  const header = el('header', {}, el('div', { class: 'avatar' }, pt.name[0]), el('div', {}, el('div', { class: 'pt' }, pt.name + ', ' + pt.age), el('div', { class: 'meta' }, c.setting)), el('button', { class: 'btn sm chartToggle', type: 'button', onclick: () => { wrap.classList.toggle('collapsed'); } }, 'Chart'));
  const tabs = el('div', { class: 'tabs' }); const pane = el('div', { class: 'pane' });
  const TABS = ['Notes', 'Vitals', 'Labs', 'Diagnostics', 'Orders']; let active = 'Notes'; const fresh = new Set();
  wrap.append(header, tabs, pane);
  let initial = true;
  function apply(u) {
    if (!u) return;
    if (u.profile) state.profile = u.profile;
    if (u.notes) { u.notes.forEach(n => { n._new = !initial; }); state.notes.forEach(n => n._new = false); state.notes.push(...u.notes); fresh.add('Notes'); }
    if (u.vitals) { u.vitals.cols.forEach((col, ci) => { state.vitals.cols.push(col); u.vitals.rows.forEach(r => { (state.vitals.rows[r[0]] = state.vitals.rows[r[0]] || {})[col] = r[ci + 1]; }); }); fresh.add('Vitals'); }
    if (u.labs) { state.labs.push(...u.labs); fresh.add('Labs'); }
    if (u.diagnostics) { state.diagnostics.push(...u.diagnostics); fresh.add('Diagnostics'); }
    if (u.orders) { state.orders.push(...u.orders); fresh.add('Orders'); }
    if (!initial) { /* keep dots */ } else fresh.clear();
    initial = false;
    draw();
  }
  function draw() {
    tabs.innerHTML = '';
    for (const t of TABS) { const has = t === 'Notes' ? (state.notes.length || state.profile) : t === 'Vitals' ? state.vitals.cols.length : t === 'Labs' ? state.labs.length : t === 'Diagnostics' ? state.diagnostics.length : state.orders.length; if (!has) continue; tabs.append(el('button', { class: 'tab' + (t === active ? ' active' : ''), type: 'button', onclick: () => { active = t; fresh.delete(t); draw(); } }, t, fresh.has(t) && t !== active ? el('span', { class: 'dot' }) : null)); }
    pane.innerHTML = '';
    if (active === 'Notes') { if (state.profile) pane.append(el('div', { class: 'note' }, el('div', { class: 'tm' }, 'Profile'), fill(state.profile, pt))); state.notes.forEach(n => pane.append(el('div', { class: 'note' + (n._new ? ' new' : '') }, el('div', { class: 'tm' }, n.time), fill(n.text, pt)))); }
    if (active === 'Vitals') { const t = el('table'); t.append(el('thead', {}, el('tr', {}, el('th', {}, ''), ...state.vitals.cols.map(c => el('th', {}, c))))); const tb = el('tbody'); for (const [k, v] of Object.entries(state.vitals.rows)) tb.append(el('tr', {}, el('td', {}, k), ...state.vitals.cols.map(c => el('td', { class: 'v' }, v[c] ?? '')))); t.append(tb); pane.append(el('div', { class: 'tablewrap' }, t)); }
    if (active === 'Labs') { const t = el('table'); t.append(el('thead', {}, el('tr', {}, el('th', {}, 'Lab'), el('th', {}, 'Result'), el('th', {}, 'Reference')))); const tb = el('tbody'); state.labs.forEach(l => tb.append(el('tr', {}, el('td', {}, l[0]), el('td', { class: 'v' }, l[1]), el('td', { class: 'ref' }, l[2] || '')))); t.append(tb); pane.append(el('div', { class: 'tablewrap' }, t)); }
    if (active === 'Diagnostics') state.diagnostics.forEach(d => pane.append(el('div', { class: 'note' }, fill(d, pt))));
    if (active === 'Orders') state.orders.forEach(d => pane.append(el('div', { class: 'note' }, fill(d, pt))));
    fresh.delete(active);
  }
  apply(c.chart);
  return { el: wrap, apply };
}

/* ---------------- views ---------------- */
function show(node) { app.innerHTML = ''; const v = el('div', { class: 'view' }, node); app.append(v); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function masteryPct(fw, step) { const m = S.mastery[fw + ':' + step]; return m && m.n ? Math.round(100 * m.s / m.n) : 0; }

function homeView() {
  const course = SR.courses.active(); if (!course) return SR.courses.picker();
  const fwId = (course.frameworks && course.frameworks[0]) || 'cjmm'; const fw = FRAMEWORKS[fwId] || FRAMEWORKS.cjmm;
  const mastery = el('div', { class: 'mastery', style: fw.steps.length > 6 ? 'grid-template-columns:repeat(auto-fit,minmax(110px,1fr))' : '' });
  fw.steps.forEach((s, i) => { const p = masteryPct(fw.id, s.id); const m = S.mastery[fw.id + ':' + s.id]; mastery.append(el('button', { class: 'mstep', type: 'button', onclick: () => toast(s.rhyme || s.question || s.label) }, el('div', { class: 'l' }, (i + 1) + '. ' + s.label), el('div', { class: 'bar' }, el('div', { style: 'width:' + p + '%' })), el('div', { class: 'pct' }, m ? p + '% · ' + m.n : 'not yet'))); });
  const modes = el('div', { class: 'modes' });
  const content = SR.content();
  for (const m of Modes) { if (m.hidden) continue; if (m.method && course.methods && !course.methods.includes(m.method)) continue; const ok = !m.available || m.available(content); modes.append(el('button', { class: 'mode' + (ok ? '' : ' off'), type: 'button', onclick: () => ok ? m.start() : toast(m.emptyMsg || 'Nothing here for this course yet.') }, el('span', { class: 'k' }, m.name), el('span', { class: 'd' }, m.d), el('span', { class: 'tag' }, ok ? (typeof m.tag === 'function' ? m.tag(content) : m.tag) : 'no content yet'))); }
  const badges = el('div', { class: 'badges' }); BADGES.forEach(b => badges.append(el('span', { class: 'badge' + (S.badges.includes(b.id) ? '' : ' locked'), title: b.d }, (S.badges.includes(b.id) ? '★ ' : '☆ ') + b.name)));
  const muddyN = Object.keys(S.muddy).length;
  const greet = S.shifts === 0 ? 'Welcome to your first shift.' : `Shift ${S.shifts + 1}. ${pick(['Notice the change.', 'Name the threat.', 'Act, then reassess.', 'Map it, don\'t memorize it.'])}`;
  const canShift = content.cases.length > 0;
  const rhyme = content.rhymes.length ? pick(content.rhymes).back.split('\n')[0] : (fw.mnemonic || '');
  show(el('div', {},
    el('div', { class: 'hero' },
      el('div', { class: 'card lift' }, el('div', { class: 'row spread' }, el('div', { class: 'eyebrow' }, course.name), el('button', { class: 'btn sm ghost', type: 'button', onclick: () => SR.courses.picker() }, 'Switch course')), el('h1', {}, greet), el('p', { class: 'lead' }, course.blurb || 'Short practice sessions built from your course material. One shift takes about twelve minutes. Then take a break; you earned it.'),
        el('div', { class: 'row', style: 'margin-top:16px' }, canShift ? el('button', { class: 'btn primary', type: 'button', onclick: () => Modes[0].start() }, '▶ Start a shift') : el('button', { class: 'btn primary', type: 'button', onclick: () => SR.courses.settings() }, '＋ Add content'), content.cases.length ? el('button', { class: 'btn', type: 'button', onclick: () => caseListView() }, 'Pick a case') : null, muddyN ? el('button', { class: 'btn', type: 'button', onclick: () => muddyView() }, `Muddy points (${muddyN})`) : null, el('button', { class: 'btn', type: 'button', onclick: () => SR.insights.view() }, 'Insights')),
        rhyme ? el('div', { class: 'rhymebox' }, '“' + rhyme + '”') : null),
      el('div', { class: 'card' }, el('div', { class: 'eyebrow' }, 'Your map of the model · ' + fw.short), el('p', { class: 'hint', style: 'margin:4px 0 10px' }, 'Tap a step for its rhyme. Bars fill as you get items right.'), mastery,
        el('div', { class: 'scoreline', style: 'margin-top:14px' }, el('div', { class: 's' }, el('div', { class: 'b' }, S.shifts), el('div', { class: 'l' }, 'shifts')), el('div', { class: 's' }, el('div', { class: 'b' }, S.answered), el('div', { class: 'l' }, 'items')), el('div', { class: 's' }, el('div', { class: 'b' }, S.answered ? Math.round(100 * S.perfect / S.answered) + '%' : '—'), el('div', { class: 'l' }, 'perfect'))))),
    el('div', { class: 'row spread', style: 'margin:6px 0 12px' }, el('h2', {}, 'Practice modes'), el('button', { class: 'btn sm ghost', type: 'button', onclick: () => SR.courses.settings() }, 'Course settings')), modes,
    el('div', { class: 'card', style: 'margin-top:22px' }, el('div', { class: 'eyebrow' }, 'Badges'), el('div', { style: 'height:8px' }), badges)
  ));
}

function caseListView() {
  const list = el('div', { class: 'caselist' });
  const CC = SR.content().cases;
  if (!CC.length) { show(el('div', {}, backRow('Pick a case'), el('div', { class: 'card' }, el('p', {}, 'This course has no unfolding cases yet. Cases are built from your course packets; export the course spec from the course settings and ask Claude to build a case pack, or study with flashcards and practice questions in the meantime.')))); return; }
  for (const c of CC) list.append(el('button', { class: 'casecard', type: 'button', onclick: () => runCase(c) }, el('span', { class: 'sys' }, c.system), el('span', { class: 't' }, c.title), el('span', { class: 'tl' }, c.tagline), el('span', { class: 'done' }, S.seen[c.id] ? `played ${S.seen[c.id]}× · best ${S.seen[c.id + ':best'] || 0}%` : 'new')));
  show(el('div', {}, backRow('Pick a case'), el('p', { class: 'hint' }, 'Names, ages, and answer order change every time. The clinical story is from your course.'), list));
}
function backRow(title, extra) { return el('div', { class: 'row spread', style: 'margin-bottom:14px' }, el('h1', {}, title), el('div', { class: 'row' }, extra, el('button', { class: 'btn sm', type: 'button', onclick: () => homeView() }, '← Home'))); }

/* ---------------- case runner ---------------- */
function runCase(c, opts = {}) {
  setMode('case');
  const pt = makePatient(c); const fwId = c.framework || 'cjmm'; const fw = FRAMEWORKS[fwId];
  const items = c.items.slice(); if (c.bowtie) items.push({ ...c.bowtie, type: 'bowtie', step: null, bonus: true });
  const scores = []; let idx = 0;
  const chart = chartPanel(c, pt);
  S.seen[c.id] = (S.seen[c.id] || 0) + 1; save();
  function ribbon() {
    const r = el('div', { class: 'ribbon' });
    fw.steps.forEach((s, i) => { const done = i < Math.min(idx, c.items.length); const sc = scores[i]; r.append(el('div', { class: 'node' + (i === idx ? ' current' : '') + (done ? ' done' + (sc === 1 ? '' : sc >= .5 ? ' partial' : ' miss') : '') }, el('span', { class: 'i' }, 'STEP ' + (i + 1)), s.label)); });
    if (c.bowtie) r.append(el('div', { class: 'node' + (idx === c.items.length ? ' current' : '') + (idx > c.items.length ? ' done' + (scores[c.items.length] === 1 ? '' : scores[c.items.length] >= .5 ? ' partial' : ' miss') : '') }, el('span', { class: 'i' }, 'BONUS'), 'Bow-tie'));
    return r;
  }
  function frame(inner) {
    show(el('div', {}, el('div', { class: 'row spread', style: 'margin-bottom:8px' }, el('div', {}, el('div', { class: 'eyebrow' }, c.system + ' · ' + fw.short), el('h2', {}, c.title)), el('button', { class: 'btn sm ghost', type: 'button', onclick: () => { if (confirm('Leave this case? Progress on it will not be saved.')) (opts.onQuit || homeView)(); } }, 'Exit')), ribbon(), el('div', { class: 'caseview' }, inner, chart.el)));
  }
  function intro() {
    frame(el('div', { class: 'qcard intro' }, el('div', { class: 'ptbanner' }, el('div', { class: 'avatar' }, pt.name[0]), el('div', {}, el('strong', {}, pt.name + ', ' + pt.age + ' · ' + c.setting), el('div', { class: 'hint', style: 'margin:0' }, fill(c.tagline, pt)))),
      el('p', {}, 'Read the chart on the side (Notes, Vitals, Labs). New information appears as the case unfolds; a dot marks a tab with something new. You will move through all six steps no matter how each one goes, exactly like the exam.'),
      c.hook ? el('div', { class: 'rhymebox' }, '“' + c.hook + '”') : null,
      el('div', { class: 'actions' }, el('button', { class: 'btn primary', type: 'button', onclick: () => step() }, 'Begin the case →'))));
  }
  function step() {
    if (idx >= items.length) return summary();
    const item = items[idx]; chart.apply(item.chart);
    const card = questionCard({ item, pt, framework: fwId, stepIndex: idx, key: c.id + '#' + idx, label: c.title + ' · ' + (item.step ? fw.steps.find(s => s.id === item.step).label : 'Bow-tie'), nextLabel: idx === items.length - 1 ? 'Finish case' : 'Next step', onDone: s => { scores[idx] = s; idx++; step(); } });
    frame(card);
  }
  function summary() {
    const total = scores.reduce((a, b) => a + b, 0) / scores.length; const pct = Math.round(total * 100);
    S.seen[c.id + ':best'] = Math.max(S.seen[c.id + ':best'] || 0, pct); save();
    const line = el('div', { class: 'scoreline' });
    c.items.forEach((it, i) => { const st = fw.steps.find(s => s.id === it.step); line.append(el('div', { class: 's' }, el('div', { class: 'b', style: 'color:' + (scores[i] === 1 ? 'var(--good)' : scores[i] >= .5 ? 'var(--warn)' : 'var(--bad)') }, Math.round(scores[i] * 100) + '%'), el('div', { class: 'l' }, st ? st.label : ''))); });
    const weakest = c.items.map((it, i) => ({ it, i })).sort((a, b) => scores[a.i] - scores[b.i])[0];
    const wStep = fw.steps.find(s => s.id === weakest.it.step);
    frame(el('div', { class: 'qcard' }, el('div', { class: 'eyebrow' }, 'Case complete'), el('h2', {}, pct >= 90 ? 'Excellent shift.' : pct >= 70 ? 'Solid work.' : 'You finished it. That is the whole point.'), el('div', { class: 'bigxp' }, pct + '%'), el('div', { style: 'height:10px' }), line,
      scores[weakest.i] < 1 && wStep ? el('div', { class: 'rhymebox' }, 'Step to revisit: ' + wStep.label + '. “' + wStep.rhyme + '”') : el('div', { class: 'rhymebox' }, '“' + (c.hook || fw.mnemonic) + '”'),
      el('div', { class: 'actions' }, el('button', { class: 'btn primary', type: 'button', onclick: () => (opts.onDone || homeView)(total) }, opts.onDone ? 'Continue shift →' : 'Home'), el('button', { class: 'btn', type: 'button', onclick: () => runCase(c, opts) }, 'Replay with a new patient'))));
  }
  intro();
}

/* ---------------- generated rounds ---------------- */
function plain(title, sub, card, onBack) { return el('div', {}, el('div', { class: 'row spread', style: 'margin-bottom:12px' }, el('div', {}, el('div', { class: 'eyebrow' }, sub), el('h2', {}, title)), el('button', { class: 'btn sm ghost', type: 'button', onclick: onBack || homeView }, 'Exit')), card); }
const LET = ['A', 'B', 'C', 'D'];

function whoFirstRound(onDone) {
  setMode('whofirst');
  const POOL = SR.content().whofirst; const t0 = Date.now();
  const urgent = pick(POOL.filter(x => x.tier === 1));
  const others = sample(POOL.filter(x => x.tier !== 1), 3);
  const cards = shuffle([urgent, ...others]);
  let sel = null; let phase = 1; let s1 = 0;
  const card = el('div', { class: 'qcard' });
  card.append(el('div', { class: 'stepchip' }, el('span', { class: 'num' }, '?'), 'Who first?', el('span', { class: 'q' }, '· Priority Lens: who could deteriorate if I wait?')), el('p', { class: 'prompt' }, 'Morning report, four clients. Which client should the nurse assess first?'));
  const grid = el('div', { class: 'ptcards' }); const box = el('div'); box.append(grid);
  cards.forEach((x, i) => grid.append(el('button', { class: 'ptcard', type: 'button', 'data-i': i, onclick: () => { if (box.classList.contains('graded')) return; sel = i; for (const g of grid.children) g.classList.toggle('sel', +g.dataset.i === i); } }, el('span', { class: 'letter' }, LET[i]), el('span', {}, x.t))));
  card.append(box);
  const actions = el('div', { class: 'actions' }); const check = el('button', { class: 'btn primary', type: 'button' }, 'Check'); const next = el('button', { class: 'btn', type: 'button', hidden: true }, 'Next →'); actions.append(check, el('span', { class: 'spacer' }), next); card.append(actions);
  check.addEventListener('click', () => {
    if (phase !== 1) return; box.classList.add('graded');
    cards.forEach((x, i) => { const g = grid.children[i]; if (x === urgent) g.classList.add('hit'); else if (sel === i) g.classList.add('wrong'); g.append(el('span', { class: 'why' }, x.why)); });
    s1 = sel !== null && cards[sel] === urgent ? 1 : 0; const xp = record({ framework: 'lens', step: 'wait', score: s1, key: 'wf:' + urgent.t.slice(0, 40), label: 'Who first: ' + urgent.t.slice(0, 60), ms: Date.now() - t0 });
    showFeedback(box, { score: s1, misses: s1 ? [] : ['First: ' + LET[cards.indexOf(urgent)] + '. ' + urgent.why] }, { rationale: 'The change from baseline is the clue. Abnormal-but-expected findings wait; new, worsening, or unstable findings do not.' }, xp, {});
    check.hidden = true; next.hidden = false; phase = 2;
  });
  next.addEventListener('click', () => {
    // phase 2: which cue made it the priority
    const item = { type: 'single', step: 'new', prompt: 'What specific cue made client ' + LET[cards.indexOf(urgent)] + ' the priority?', options: cards.map(x => ({ t: x.cue, ok: x === urgent, why: x === urgent ? 'This is the risk-of-delay cue.' : 'A real finding, but for a different client and not the priority.' })), rationale: 'Defend every priority with a cue. On the exam, the cue is what separates the right answer from the plausible one.' };
    show(plain('Who first?', 'Priority Lens · step 2', questionCard({ item, framework: 'lens', stepIndex: 1, key: 'wfc:' + urgent.t.slice(0, 40), label: 'Cue for: ' + urgent.t.slice(0, 60), nextLabel: 'Done', onDone: s => onDone((s1 + s) / 2) })));
  });
  show(plain('Who first?', 'Priority Lens · step 1', card));
}

function delegationRound(onDone) {
  setMode('delegation');
  const d = pick(SR.content().delegation);
  const item = { type: 'single', step: 'now', prompt: 'The RN is working with an unlicensed assistive person. Which of these must the RN address personally?', options: [{ t: d.rn, ok: true, why: d.why }, ...sample(d.others, 3).map(t => ({ t, ok: false, why: 'Stable client, routine task: can be delegated.' }))], rationale: 'Delegation is prioritization of nursing judgment. Assessment, teaching, evaluation, and unstable clients stay with the RN. “Assess, Teach, Evaluate, Unstable: stays on the RN’s table.”' };
  show(plain('What stays with the RN?', 'Delegation', questionCard({ item, framework: 'lens', stepIndex: 4, key: 'del:' + d.rn.slice(0, 40), label: 'Delegation: ' + d.rn.slice(0, 60), nextLabel: 'Done', onDone })));
}

function genTrend(tpl) {
  const rows = tpl.rows.map(r => {
    const f = v => r.dec ? v.toFixed(r.dec) : String(Math.round(v));
    const rnd = (a, b) => a + Math.random() * (b - a);
    let before, after;
    if (r.text) { before = r.text[0]; after = r.text[1]; }
    else if (r.bp) { const sys = Math.round(rnd(r.base[0], r.base[1])); const dia = sys - rand(44, 56); if (r.dir === 'flat') { before = after = sys + '/' + dia; } else { const d = rand(r.delta[0], r.delta[1]) * (r.dir === 'up' ? 1 : -1); before = sys + '/' + dia; after = (sys + d) + '/' + (dia + Math.round(d * 0.55)); } }
    else { const b = rnd(r.base[0], r.base[1]); before = f(b); after = r.dir === 'flat' ? before : f(b + rnd(r.delta[0], r.delta[1]) * (r.dir === 'up' ? 1 : -1)); }
    const ans = r.dir === 'flat' ? 'unchanged' : (r.dir === r.worse ? 'declined' : 'improved');
    return { t: r.t, before, after, ans, why: r.why };
  });
  return rows;
}
function trendRound(onDone) {
  setMode('trend');
  const TT = SR.content().trends; const tpl = pick(TT); const rows = genTrend(tpl);
  const item = { type: 'trend', step: 'evaluate', prompt: tpl.title + '. For each finding, is the client improving, declining, or unchanged?', rows, rationale: 'Compare each value to the previous one, not to the normal range. Then read all the rows together: they tell one story.' };
  let s1 = 0;
  const q2 = () => {
    const threats = shuffle([tpl, ...sample(TT.filter(t => t !== tpl), 3)]);
    const item2 = { type: 'single', step: 'prioritize', prompt: 'What is the story these rows tell together?', options: threats.map(t => ({ t: t.threat, ok: t === tpl })), rationale: 'Cues that cluster tell a story. Name the threat, then the first action: ' + tpl.action + '.' };
    show(plain('Trend Detective', 'Step 2 · name the threat', questionCard({ item: item2, stepIndex: 2, key: 'trend2:' + tpl.id, label: 'Trend threat: ' + tpl.title, nextLabel: 'Done', onDone: s => onDone((s1 + s) / 2) })));
  };
  show(plain('Trend Detective', 'Step 1 · read the flowsheet', questionCard({ item, stepIndex: 5, key: 'trend:' + tpl.id, label: 'Trend: ' + tpl.title, nextLabel: 'Next', onDone: s => { s1 = s; q2(); } })));
}

function genABG() {
  const d = pick(ABG.disorders); const comp = pick(['none', 'partial', 'full']);
  const r = (a, b, dec = 0) => +(a + Math.random() * (b - a)).toFixed(dec);
  let pH, co2, hco3;
  if (d.id === 'ra') { co2 = r(50, 68); if (comp === 'none') { hco3 = r(22, 26); pH = r(7.20, 7.32, 2); } else if (comp === 'partial') { hco3 = r(27, 32); pH = r(7.26, 7.34, 2); } else { hco3 = r(30, 36); pH = r(7.35, 7.39, 2); } }
  if (d.id === 'rk') { co2 = r(22, 32); if (comp === 'none') { hco3 = r(22, 26); pH = r(7.48, 7.58, 2); } else if (comp === 'partial') { hco3 = r(17, 21); pH = r(7.46, 7.52, 2); } else { hco3 = r(15, 19); pH = r(7.41, 7.45, 2); } }
  if (d.id === 'ma') { hco3 = r(10, 19); if (comp === 'none') { co2 = r(36, 44); pH = r(7.15, 7.30, 2); } else if (comp === 'partial') { co2 = r(25, 33); pH = r(7.25, 7.34, 2); } else { co2 = r(22, 30); pH = r(7.35, 7.39, 2); } }
  if (d.id === 'mk') { hco3 = r(30, 40); if (comp === 'none') { co2 = r(36, 44); pH = r(7.48, 7.58, 2); } else if (comp === 'partial') { co2 = r(46, 54); pH = r(7.46, 7.52, 2); } else { co2 = r(48, 56); pH = r(7.41, 7.45, 2); } }
  const pao2 = d.id === 'ra' || Math.random() < 0.4 ? r(55, 78) : r(80, 98);
  return { d, comp, pH: pH.toFixed(2), co2, hco3, pao2 };
}
function abgRound(onDone) {
  setMode('abg');
  const g = genABG(); const scores = [];
  const vals = el('div', { class: 'abgvals' },
    el('div', { class: 'v' + (g.pH < 7.35 ? ' lo' : g.pH > 7.45 ? ' hi' : '') }, el('div', { class: 'n' }, g.pH), el('div', { class: 'l' }, 'pH'), el('div', { class: 'ref' }, '7.35–7.45')),
    el('div', { class: 'v' + (g.co2 < 35 ? ' lo' : g.co2 > 45 ? ' hi' : '') }, el('div', { class: 'n' }, g.co2), el('div', { class: 'l' }, 'PaCO₂'), el('div', { class: 'ref' }, '35–45')),
    el('div', { class: 'v' + (g.hco3 < 22 ? ' lo' : g.hco3 > 26 ? ' hi' : '') }, el('div', { class: 'n' }, g.hco3), el('div', { class: 'l' }, 'HCO₃⁻'), el('div', { class: 'ref' }, '22–26')),
    el('div', { class: 'v' + (g.pao2 < 80 ? ' lo' : '') }, el('div', { class: 'n' }, g.pao2), el('div', { class: 'l' }, 'PaO₂'), el('div', { class: 'ref' }, '80–100')));
  const qs = [
    { type: 'single', step: 'analyze', prompt: 'Name the primary acid-base disorder.', options: ABG.disorders.map(x => ({ t: x.name, ok: x === g.d })), rationale: 'ROME: Respiratory = Opposite (pH and CO₂ move opposite ways). Metabolic = Equal (pH and HCO₃⁻ move the same way). ' + g.d.tip },
    { type: 'single', step: 'analyze', prompt: 'How much has the body compensated?', options: [{ t: 'Uncompensated (pH abnormal, the other system still normal)', ok: g.comp === 'none' }, { t: 'Partially compensated (pH abnormal, both systems abnormal)', ok: g.comp === 'partial' }, { t: 'Fully compensated (pH back in range, both systems abnormal)', ok: g.comp === 'full' }], rationale: 'Look at the pH first: normal pH with abnormal CO₂ and HCO₃⁻ means full compensation. Then check whether the "other" system has moved yet.' },
    { type: 'single', step: 'prioritize', prompt: 'Which situation is the most likely cause?', options: shuffle([{ t: pick(g.d.causes), ok: true }, ...sample(ABG.disorders.filter(x => x !== g.d).flatMap(x => x.causes), 3).map(t => ({ t, ok: false }))]), rationale: 'Match the disorder to its mechanism: retained CO₂ (hypoventilation), lost CO₂ (hyperventilation), gained acid or lost base (metabolic acidosis), lost acid or gained base (metabolic alkalosis).' },
    { type: 'single', step: 'action', prompt: 'What is the priority nursing action?', options: shuffle([{ t: g.d.action, ok: true }, ...sample(ABG.disorders.filter(x => x !== g.d), 3).map(x => ({ t: x.action, ok: false }))]), rationale: g.d.tip + (g.pao2 < 80 ? ' The PaO₂ of ' + g.pao2 + ' also means hypoxemia: oxygen and monitoring.' : '') }
  ];
  let i = 0;
  function nextQ() {
    if (i >= qs.length) return onDone(scores.reduce((a, b) => a + b, 0) / scores.length);
    const item = qs[i];
    show(plain('ABG Decoder', 'Question ' + (i + 1) + ' of 4', questionCard({ item, stepIndex: i === 3 ? 4 : i === 2 ? 2 : 1, key: 'abg:' + g.d.id + ':' + i, label: 'ABG: ' + g.d.name + ' Q' + (i + 1), nextLabel: i === qs.length - 1 ? 'Done' : 'Next', onDone: s => { scores.push(s); i++; nextQ(); }, extraTop: vals.cloneNode(true) })));
  }
  nextQ();
}

function quickFireRound(onDone, n = 3) {
  setMode('quickfire');
  const qs = sample(SR.content().quickfire, n); const scores = []; let i = 0;
  if (!qs.length) { toast('No quick-fire questions in this course yet.'); return onDone(0); }
  function nextQ() {
    if (i >= qs.length) return onDone(scores.reduce((a, b) => a + b, 0) / scores.length);
    const q = qs[i]; const item = { type: q.multi ? 'sata' : 'single', step: 'action', prompt: q.q, options: q.options, rationale: q.rationale, n: q.multi ? q.options.filter(o => o.ok).length : undefined };
    show(plain('Quick Fire', 'Question ' + (i + 1) + ' of ' + qs.length + ' · from the class Kahoot', questionCard({ item, stepIndex: 4, key: 'qf:' + q.q.slice(0, 40), label: 'Quick fire: ' + q.q.slice(0, 60), nextLabel: i === qs.length - 1 ? 'Done' : 'Next', onDone: s => { scores.push(s); i++; nextQ(); } })));
  }
  nextQ();
}

function bowtieRound(onDone) {
  setMode('bowtie');
  const withBT = SR.content().cases.filter(x => x.bowtie); if (!withBT.length) { toast('No bow-tie items in this course yet.'); return onDone(0); }
  const c = pick(withBT); const pt = makePatient(c);
  const chart = chartPanel(c, pt); if (c.bowtie.chart) chart.apply(c.bowtie.chart);
  const item = { ...c.bowtie, type: 'bowtie' };
  const card = questionCard({ item, pt, key: c.id + '#bowtie', label: c.title + ' · Bow-tie', nextLabel: 'Done', onDone });
  show(el('div', {}, el('div', { class: 'row spread', style: 'margin-bottom:12px' }, el('div', {}, el('div', { class: 'eyebrow' }, 'Bow-tie builder · ' + c.system), el('h2', {}, c.title)), el('button', { class: 'btn sm ghost', type: 'button', onclick: homeView }, 'Exit')), el('div', { class: 'caseview' }, card, chart.el)));
}

/* ---------------- rhymes ---------------- */
function rhymesView() {
  setMode('rhymes'); const R = SR.content().rhymes;
  const cats = [...new Set(R.map(r => r.cat))]; let active = 'All'; let quiz = false;
  const filters = el('div', { class: 'filters' }); const deck = el('div', { class: 'deck' });
  function draw() {
    filters.innerHTML = ''; ['All', ...cats].forEach(c => filters.append(el('button', { class: 'btn sm' + (c === active ? ' on' : ''), type: 'button', onclick: () => { active = c; draw(); } }, c)));
    filters.append(el('button', { class: 'btn sm' + (quiz ? ' on' : ''), type: 'button', onclick: () => { quiz = !quiz; draw(); } }, quiz ? 'Quiz me: on' : 'Quiz me'));
    deck.innerHTML = '';
    let list = R.filter(r => active === 'All' || r.cat === active); if (quiz) list = shuffle(list);
    for (const r of list) { const f = el('div', { class: 'flip', role: 'button', tabindex: 0 }, el('div', { class: 'inner' }, el('div', { class: 'face' }, el('div', { class: 'cat' }, r.cat), el('div', { class: 'f' }, r.front), el('div', { class: 'tip' }, quiz ? 'Say it out loud, then tap to check.' : 'Tap to flip')), el('div', { class: 'face back' }, el('div', { class: 'cat' }, r.cat), r.back, el('div', { class: 'tip' }, r.tip || '')))); const tog = () => f.classList.toggle('on'); f.addEventListener('click', tog); f.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); tog(); } }); deck.append(f); }
  }
  draw();
  show(el('div', {}, backRow('Rhyme & Reason', el('button', { class: 'btn sm', type: 'button', onclick: () => SR.courses.editor('flashcards') }, '+ Add a card')), el('p', { class: 'hint' }, 'Mnemonics, rhymes and heuristics for this course. Tap a card to flip it. “Quiz me” shuffles the deck so you say the back before you see it.'), filters, deck));
}

/* ---------------- muddy points ---------------- */
function muddyView() {
  const entries = Object.entries(S.muddy).sort((a, b) => b[1].count - a[1].count);
  const ul = el('ul', { class: 'list muddy' });
  entries.forEach(([k, v]) => ul.append(el('li', {}, el('strong', {}, v.label), ' ', el('span', { class: 'hint', style: 'display:inline' }, `(missed ${v.count}×)`))));
  const caseIds = [...new Set(entries.map(([k]) => k.split('#')[0]).filter(id => CASES.some(c => c.id === id)))];
  const replay = el('div', { class: 'row', style: 'margin-top:14px' });
  caseIds.forEach(id => { const c = CASES.find(x => x.id === id); replay.append(el('button', { class: 'btn sm', type: 'button', onclick: () => runCase(c) }, 'Replay: ' + c.title)); });
  show(el('div', {}, backRow('Muddy points', el('button', { class: 'btn sm ghost', type: 'button', onclick: () => { if (confirm('Clear the muddy points list?')) { S.muddy = {}; save(); muddyView(); } } }, 'Clear')), el('div', { class: 'card' }, entries.length ? [el('p', {}, 'Items you have missed. Each one you get right afterwards drops off the list. Replaying a case draws a new patient with the same clinical story.'), ul, replay] : el('p', {}, 'Nothing muddy yet. Everything you miss lands here so you can go back to it.'))));
}

/* ---------------- settings ---------------- */
function settingsView() {
  const sw = (on, fn) => { const b = el('button', { class: 'switch' + (on ? ' on' : ''), type: 'button', role: 'switch', 'aria-checked': on ? 'true' : 'false' }); b.addEventListener('click', () => { const v = !b.classList.contains('on'); b.classList.toggle('on', v); b.setAttribute('aria-checked', v); fn(v); }); return b; };
  const theme = el('select', {}, ...['system', 'light', 'dark'].map(t => el('option', { value: t, selected: S.settings.theme === t }, t))); theme.addEventListener('change', () => { S.settings.theme = theme.value; save(); applyTheme(); });
  const tm = el('select', {}, ...[5, 10, 15, 20, 25].map(m => el('option', { value: m, selected: S.settings.timerMin === m }, m + ' minutes'))); tm.addEventListener('change', () => { S.settings.timerMin = +tm.value; save(); });
  show(el('div', {}, backRow('Settings'), el('div', { class: 'card' },
    el('div', { class: 'setting' }, el('div', {}, el('strong', {}, 'Sounds'), el('div', { class: 'hint' }, 'A soft tone on check.')), sw(S.settings.sound, v => { S.settings.sound = v; save(); })),
    el('div', { class: 'setting' }, el('div', {}, el('strong', {}, 'Theme'), el('div', { class: 'hint' }, 'System follows your device.')), theme),
    el('div', { class: 'setting' }, el('div', {}, el('strong', {}, 'Focus sprint length'), el('div', { class: 'hint' }, 'The ⏱ button starts a countdown. When it ends, take a break.')), tm),
    el('div', { class: 'setting' }, el('div', {}, el('strong', {}, 'Reset progress'), el('div', { class: 'hint' }, 'Clears XP, streak, mastery and muddy points on this device.')), el('button', { class: 'btn sm', type: 'button', onclick: () => { if (confirm('Reset all progress on this device?')) { S = JSON.parse(JSON.stringify(DEFAULT)); save(); updateHeader(); toast('Progress reset'); homeView(); } } }, 'Reset')),
    el('p', { class: 'hint', style: 'margin-top:14px' }, 'Content across all courses: ' + CASES.length + ' cases, ' + WHO_FIRST.length + ' priority cards, ' + TREND_TEMPLATES.length + ' trend templates, ' + QUICKFIRE.length + ' quick-fire questions, ' + RHYMES.length + ' rhyme cards.')),
    SR.hooks.settingsPanel ? SR.hooks.settingsPanel() : el('div', { class: 'card', style: 'margin-top:14px' }, el('div', { class: 'eyebrow' }, 'Account'), el('p', { class: 'hint' }, 'Sign-in is not configured on this copy. Progress stays in this browser.'))));
}

/* ---------------- focus timer ---------------- */
let timer = null;
function toggleTimer() {
  const stat = $('#timerStat'); const fg = $('#ringFg'); const txt = $('#timerText');
  if (timer) { clearInterval(timer); timer = null; stat.hidden = true; toast('Timer stopped'); return; }
  const total = S.settings.timerMin * 60; let left = total; stat.hidden = false;
  const draw = () => { txt.textContent = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0'); fg.style.strokeDashoffset = (94.2 * (1 - left / total)).toFixed(1); };
  draw(); toast('Focus sprint: ' + S.settings.timerMin + ' minutes. One shift, then a break.');
  timer = setInterval(() => { left--; draw(); if (left <= 0) { clearInterval(timer); timer = null; beep('perfect'); alert('Sprint complete. Stand up, drink some water, and come back when you are ready.'); stat.hidden = true; } }, 1000);
}

/* ---------------- modes registry ---------------- */
const Modes = [
  { id: 'shift', method: 'cases', name: 'Start a shift', tag: '≈ 12 minutes', d: 'One random case through all six steps, plus quick rounds: who first, a trend, an ABG, a delegation call, quick fire.', available: c => c.cases.length > 0, emptyMsg: 'A shift needs at least one case. Add a case pack first.', start() { runShift(); } },
  { id: 'case', method: 'cases', name: 'Pick a case', tag: c => c.cases.length + ' cases', d: 'Choose a scenario from your course and walk it step by step.', available: c => c.cases.length > 0, start: caseListView },
  { id: 'whofirst', method: 'whofirst', name: 'Who first?', tag: 'Priority lens', d: 'Four clients at 0700. Choose who you see first, then name the cue that decided it.', available: c => c.whofirst.filter(x => x.tier === 1).length > 0 && c.whofirst.length >= 4, start() { whoFirstRound(() => homeView()); } },
  { id: 'trend', method: 'trend', name: 'Trend Detective', tag: 'Evaluate outcomes', d: 'Two columns of a flowsheet with new numbers every time. Better, worse, or same? Then name the threat.', available: c => c.trends.length >= 4, start() { trendRound(() => homeView()); } },
  { id: 'abg', method: 'abg', name: 'ABG Decoder', tag: 'Analyze cues', d: 'Randomly generated blood gases. Name the disorder, the compensation, the cause, and the action.', start() { abgRound(() => homeView()); } },
  { id: 'bowtie', method: 'cases', name: 'Bow-tie builder', tag: 'NGN item', d: 'Condition, two actions, two parameters to monitor. Drag-and-drop practice, tap style.', available: c => c.cases.some(x => x.bowtie), start() { bowtieRound(() => homeView()); } },
  { id: 'delegation', method: 'whofirst', name: 'What stays with the RN?', tag: 'Delegation', d: 'Quick calls on what cannot be delegated.', available: c => c.delegation.length > 0, start() { delegationRound(() => homeView()); } },
  { id: 'quickfire', method: 'questions', name: 'Quick Fire', tag: c => c.quickfire.length + ' questions', d: 'Five fast questions. Assess before you act.', available: c => c.quickfire.length > 0, emptyMsg: 'Add practice questions in course settings.', start() { quickFireRound(() => homeView(), 5); } },
  { id: 'rhymes', method: 'flashcards', name: 'Rhyme & Reason', tag: c => c.rhymes.length + ' cards', d: 'Flashcards, mnemonics, rhymes and heuristics. Flip, or quiz yourself.', available: c => c.rhymes.length > 0, emptyMsg: 'Add flashcards in course settings.', start: rhymesView },
  { id: 'muddy', name: 'Muddy points', tag: 'Review', d: 'Everything you have missed, ready to replay.', start: muddyView },
  { id: 'insights', name: 'Insights', tag: 'What works', d: 'Which study methods are paying off, with real numbers.', start() { SR.insights.view(); } }
];

/* ---------------- shift runner ---------------- */
function runShift() {
  setMode('case');
  const content = SR.content(); if (!content.cases.length) { toast('No cases in this course yet.'); return homeView(); }
  const leastSeen = content.cases.slice().sort((a, b) => (S.seen[a.id] || 0) - (S.seen[b.id] || 0)); const c = pick(leastSeen.slice(0, Math.max(3, Math.ceil(content.cases.length / 3))));
  const queue = [];
  const has = m => !SR.courses.active().methods || SR.courses.active().methods.includes(m);
  if (has('whofirst') && content.whofirst.length >= 4) queue.push({ name: 'Who first?', mode: 'whofirst', run: d => whoFirstRound(d) });
  queue.push({ name: c.title, mode: 'case', run: d => runCase(c, { onDone: d, onQuit: endShift }) });
  if (has('trend') && content.trends.length >= 4) queue.push({ name: 'Trend Detective', mode: 'trend', run: d => trendRound(d) });
  if (has('abg')) queue.push({ name: 'ABG Decoder', mode: 'abg', run: d => abgRound(d) });
  if (has('whofirst') && content.delegation.length) queue.push({ name: 'Delegation', mode: 'delegation', run: d => delegationRound(d) });
  if (has('questions') && content.quickfire.length) queue.push({ name: 'Quick Fire', mode: 'quickfire', run: d => quickFireRound(d, 3) });
  if (has('whofirst') && content.whofirst.length >= 4) queue.push({ name: 'Who first?', mode: 'whofirst', run: d => whoFirstRound(d) });
  const results = []; let i = 0; const bar = $('#shiftbar'); bar.hidden = false; const shiftId = Date.now();
  function setBar() { bar.firstElementChild.style.width = (100 * i / queue.length) + '%'; }
  function next(score) { if (score !== undefined) results.push(score); i++; setBar(); if (i >= queue.length) return finish(); queue[i].run(next); }
  function endShift() { bar.hidden = true; homeView(); }
  function finish() {
    S.shifts++; checkBadges(); save(); bar.hidden = true;
    const avg = results.reduce((a, b) => a + b, 0) / results.length; const pct = Math.round(avg * 100);
    const modesUsed = [...new Set(queue.map(q => q.mode))];
    const rate = el('div', { class: 'row', style: 'margin-top:8px' });
    const names = { case: 'The case', whofirst: 'Who first?', trend: 'Trend Detective', abg: 'ABG Decoder', delegation: 'Delegation', quickfire: 'Quick Fire' };
    let rated = false;
    modesUsed.forEach(m => rate.append(el('button', { class: 'btn sm', type: 'button', onclick: (e) => { if (rated) return; rated = true; S.ratings.push({ t: Date.now(), c: S.activeCourse, shift: shiftId, m }); save(); for (const b of rate.children) b.classList.toggle('primary', b === e.currentTarget); toast('Noted. This feeds the Insights page.'); } }, names[m] || m)));
    show(el('div', {}, el('div', { class: 'card lift' }, el('div', { class: 'eyebrow' }, 'Shift complete'), el('h1', {}, pct >= 85 ? 'Charge-nurse level.' : pct >= 65 ? 'Good shift. Real progress.' : 'You showed up and finished. That is the habit that passes exams.'), el('div', { class: 'bigxp' }, pct + '% · ' + S.xp + ' XP total'),
      el('div', { class: 'scoreline', style: 'margin-top:12px' }, ...queue.map((q, k) => el('div', { class: 's' }, el('div', { class: 'b', style: 'color:' + (results[k] === 1 ? 'var(--good)' : results[k] >= .5 ? 'var(--warn)' : 'var(--bad)') }, Math.round(results[k] * 100) + '%'), el('div', { class: 'l' }, q.name)))),
      el('div', { class: 'card', style: 'margin-top:14px;background:var(--surface2)' }, el('strong', {}, 'One tap: which round helped you understand something best today?'), rate),
      el('p', { style: 'margin-top:12px' }, 'Take a real break now. Ten minutes away from the screen makes the next shift stick better.'),
      el('div', { class: 'actions' }, el('button', { class: 'btn primary', type: 'button', onclick: homeView }, 'Home'), el('button', { class: 'btn', type: 'button', onclick: runShift }, 'Another shift')))));
  }
  setBar(); queue[0].run(next);
}

/* ---------------- public API for the other modules ---------------- */
window.SR = {
  el, show, toast, shuffle, sample, pick, rand, fill, makePatient, esc,
  state: () => S, save, record, setMode, questionCard, backRow, plain, chartPanel, runCase, homeView, settingsView, caseListView,
  ItemTypes, Modes, BADGES, FRAMEWORKS, masteryPct,
  hooks: {},            // onSave(state) — set by sync.js
  courses: null,        // set by courses.js
  insights: null,       // set by insights.js
  content: () => (SR.courses ? SR.courses.content() : { cases: CASES, whofirst: WHO_FIRST, trends: TREND_TEMPLATES, quickfire: QUICKFIRE, rhymes: RHYMES, delegation: DELEGATION }),
  replaceState(next) { S = Object.assign({}, DEFAULT, next); save(); updateHeader(); applyTheme(); homeView(); }
};

/* ---------------- boot ---------------- */
$('#brandBtn').addEventListener('click', () => SR.courses ? SR.courses.picker() : homeView());
$('#settingsBtn').addEventListener('click', settingsView);
$('#timerBtn').addEventListener('click', toggleTimer);
updateHeader();
window.addEventListener('DOMContentLoaded', () => { if (SR.courses) SR.courses.boot(); else homeView(); });
})();
