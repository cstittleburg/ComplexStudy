/* Insights: which study methods are paying off. Everything here is computed from the event log
   (one row per answered item: mode, framework step, score, time, whether it was a retry of a missed item). */
(function () {
'use strict';
const { el, show } = SR;
const NAMES = { case: 'Unfolding cases', whofirst: 'Who first?', trend: 'Trend Detective', abg: 'ABG Decoder', delegation: 'Delegation', quickfire: 'Quick Fire', bowtie: 'Bow-tie', rhymes: 'Flashcards' };
const MIN_N = 12;

function stats(events) {
  const by = {};
  for (const e of events) { const m = e.m || 'other'; const b = by[m] || (by[m] = { m, n: 0, sum: 0, ms: 0, msN: 0, first: [], last: [], retryN: 0, retryOk: 0, perfect: 0 }); b.n++; b.sum += e.sc; if (e.ms) { b.ms += e.ms; b.msN++; } if (e.sc === 1) b.perfect++; if (e.re) { b.retryN++; if (e.sc === 1) b.retryOk++; } }
  for (const b of Object.values(by)) {
    const list = events.filter(e => (e.m || 'other') === b.m); const third = Math.max(1, Math.floor(list.length / 3));
    const early = list.slice(0, third), late = list.slice(-third);
    b.acc = b.n ? b.sum / b.n : 0;
    b.early = early.reduce((a, e) => a + e.sc, 0) / early.length; b.late = late.reduce((a, e) => a + e.sc, 0) / late.length; b.gain = b.n >= MIN_N ? b.late - b.early : null;
    b.retention = b.retryN >= 3 ? b.retryOk / b.retryN : null;
    b.secs = b.msN ? b.ms / b.msN / 1000 : null;
  }
  return Object.values(by).sort((a, b) => b.n - a.n);
}

/* A single-hue horizontal bar list: one series, so no legend; values in text ink; hover title. */
function barList(rows, fmt, max = 1) {
  const wrap = el('div', { class: 'bars' });
  for (const r of rows) {
    const pct = Math.max(0, Math.min(100, 100 * (r.v / max)));
    wrap.append(el('div', { class: 'barrow', title: r.title || '' }, el('div', { class: 'lbl' }, r.label), el('div', { class: 'track' }, el('div', { class: 'fill', style: 'width:' + pct.toFixed(1) + '%' })), el('div', { class: 'val mono' }, r.v === null || r.v === undefined || isNaN(r.v) ? '—' : fmt(r.v))));
  }
  return wrap;
}

function view() {
  const S = SR.state(); const course = SR.courses.active();
  const events = S.events.filter(e => e.c === (course ? course.id : null));
  const st = stats(events);
  const total = events.length;
  const ratings = S.ratings.filter(r => r.c === (course ? course.id : null));
  const rateBy = {}; ratings.forEach(r => rateBy[r.m] = (rateBy[r.m] || 0) + 1);
  const pctF = v => Math.round(v * 100) + '%';

  // Case scores by day: the exam-like measure
  const byDay = {};
  events.filter(e => e.m === 'case').forEach(e => { const d = new Date(e.t).toISOString().slice(0, 10); const b = byDay[d] || (byDay[d] = { n: 0, sum: 0 }); b.n++; b.sum += e.sc; });
  const days = Object.keys(byDay).sort();
  const trend = el('div', { class: 'daybars' });
  days.slice(-14).forEach(d => { const b = byDay[d]; const v = b.sum / b.n; trend.append(el('div', { class: 'daycol', title: d + ': ' + pctF(v) + ' over ' + b.n + ' items' }, el('div', { class: 'dtrack' }, el('div', { class: 'dfill', style: 'height:' + Math.round(v * 100) + '%' })), el('div', { class: 'dlbl mono' }, d.slice(5)))); });

  // Recommendation: only with enough data
  const eligible = st.filter(b => b.n >= MIN_N);
  let rec = null;
  if (eligible.length >= 2) {
    const score = b => (b.gain ?? 0) * 2 + (b.retention ?? b.acc) + (rateBy[b.m] ? 0.1 * Math.min(3, rateBy[b.m]) : 0);
    const ranked = eligible.slice().sort((a, b) => score(b) - score(a));
    rec = { best: ranked[0], least: ranked[ranked.length - 1] };
  }
  const stepRows = [];
  for (const fwId of (course && course.frameworks) || ['cjmm']) { const fw = SR.FRAMEWORKS[fwId]; if (!fw) continue; fw.steps.forEach(s => { const m = S.mastery[fw.id + ':' + s.id]; if (m && m.n) stepRows.push({ label: fw.short + ' · ' + s.label, v: m.s / m.n, title: m.n + ' items' }); }); }

  show(el('div', {}, SR.backRow('Insights'),
    el('div', { class: 'card lift' }, el('div', { class: 'eyebrow' }, course ? course.name : ''), el('h2', {}, total < MIN_N ? 'Not enough data yet' : rec ? `Lean on ${NAMES[rec.best.m] || rec.best.m}.` : 'Early read'),
      el('p', { class: 'lead' }, total < MIN_N ? `Answer about ${MIN_N - total} more items and this page starts comparing methods.` : rec ? `Across ${total} answered items, ${NAMES[rec.best.m] || rec.best.m} shows the best combination of improvement over time and retention of things you had missed. ${NAMES[rec.least.m] || rec.least.m} shows the least so far. Keep using both; the picture sharpens with every shift.` : `${total} items answered. Two methods need at least ${MIN_N} items each before they can be compared.`),
      el('p', { class: 'hint' }, 'How this is measured: accuracy (average score), improvement (last third of attempts vs first third), retention (how often an item you previously missed is right the next time), time per item, and your one-tap ratings after shifts. Small numbers wobble; trust trends over 50+ items.')),
    el('div', { class: 'grid2', style: 'margin-top:16px' },
      el('div', { class: 'card' }, el('h3', {}, 'Accuracy by method'), el('p', { class: 'hint' }, 'Average score per item.'), barList(st.map(b => ({ label: (NAMES[b.m] || b.m) + ' (' + b.n + ')', v: b.acc, title: b.n + ' items' })), pctF)),
      el('div', { class: 'card' }, el('h3', {}, 'Improvement over time'), el('p', { class: 'hint' }, 'Last third of attempts minus first third. Needs ' + MIN_N + '+ items per method.'), barList(st.map(b => ({ label: NAMES[b.m] || b.m, v: b.gain === null ? null : Math.max(0, b.gain), title: b.gain === null ? 'not enough items yet' : (b.gain >= 0 ? '+' : '') + Math.round(b.gain * 100) + ' points' })), v => (v >= 0 ? '+' : '') + Math.round(v * 100), 0.5)),
      el('div', { class: 'card' }, el('h3', {}, 'Retention'), el('p', { class: 'hint' }, 'When you retry something you had missed, how often is it right? Needs 3+ retries per method.'), barList(st.map(b => ({ label: NAMES[b.m] || b.m, v: b.retention, title: b.retryN + ' retries' })), pctF)),
      el('div', { class: 'card' }, el('h3', {}, 'Seconds per item'), el('p', { class: 'hint' }, 'Time from seeing the question to pressing Check.'), barList(st.map(b => ({ label: NAMES[b.m] || b.m, v: b.secs, title: '' })), v => Math.round(v) + 's', Math.max(60, ...st.map(b => b.secs || 0))))),
    el('div', { class: 'grid2', style: 'margin-top:16px' },
      el('div', { class: 'card' }, el('h3', {}, 'Case scores by day'), el('p', { class: 'hint' }, 'Unfolding cases are the closest thing to the exam. This is the number to watch.'), days.length ? trend : el('p', { class: 'hint' }, 'No cases played yet.')),
      el('div', { class: 'card' }, el('h3', {}, 'What you said helped'), el('p', { class: 'hint' }, 'Your one-tap answer after each shift.'), Object.keys(rateBy).length ? barList(Object.entries(rateBy).sort((a, b) => b[1] - a[1]).map(([m, n]) => ({ label: NAMES[m] || m, v: n })), v => v + '×', Math.max(...Object.values(rateBy))) : el('p', { class: 'hint' }, 'No ratings yet. Finish a shift and tap the round that helped most.'))),
    stepRows.length ? el('div', { class: 'card', style: 'margin-top:16px' }, el('h3', {}, 'Mastery by framework step'), barList(stepRows, pctF)) : null,
    el('div', { class: 'card', style: 'margin-top:16px' }, el('h3', {}, 'Export'), el('p', { class: 'hint' }, 'Copy the raw event log (JSON) to analyze elsewhere or share with Claude.'), el('button', { class: 'btn sm', type: 'button', onclick: () => { const t = JSON.stringify({ events, ratings }, null, 1); if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => SR.toast('Copied ' + events.length + ' events'), () => SR.toast('Copy failed')); } }, 'Copy event log'))
  ));
}
SR.insights = { view, stats };
})();
