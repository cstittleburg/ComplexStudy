/* Adaptive delivery: choice first, evidence over time.

   1. Favourites. The student picks up to two favourite study methods per course (course.favorites).
   2. The mix. Every shift is one exam-format anchor (an unfolding case; in a course without cases, a question
      set) plus quick rounds drawn from the student's switched-on methods by weight. Favourites start at about
      70% of the quick rounds, every other switched-on method keeps at least 10%, switched-off methods get none.
   3. The yardstick. Every answer is logged with a topic area. For each day a method was used on an area, the app
      looks at the next time the student met that area's exam-format items (at least 20 hours and at most 7 days
      later) and records how they did. That is the method's result for that area. The same item is never used as
      its own yardstick, so replaying a case does not count as proof that cases work.
   4. The reveal. Methods are compared only when each has 15+ linked results, and the app speaks up only when a
      gap of 10+ points (or a tie within 5) holds both now and a week ago. It tells the student whichever way it
      goes, and gives them a choice.
   5. Movement. When a method is clearly ahead, the quick-round mix moves toward it by at most 10 points a week.
      Favourites never drop below 30% in total. "Keep my mix" undoes the move.

   Everything is computed in the browser from the event log (state.events). Every threshold lives in RULES. */
(function () {
'use strict';
const { el, toast } = SR;
const S = () => SR.state();
const H = 36e5, D = 864e5;

const RULES = {
  MIN_N: 15,            // linked results each method needs before it is compared
  GAP: 0.10,            // a gap this big that holds now and a week ago is a finding
  TIE: 0.05,            // closer than this, now and a week ago, is a tie
  DELAY_MIN: 20 * H,    // the next exam-format meeting counts only if it is at least this long after the practice...
  DELAY_MAX: 7 * D,     // ...and no longer than this
  FAV_SHARE: 0.70,      // favourites' starting share of the quick rounds
  FLOOR: 0.10,          // every switched-on method keeps at least this share
  FAV_FLOOR: 0.30,      // favourites together never drop below this
  STEP: 0.10,           // the most any method's share moves in one week
  BOOST: 0.15,          // how much share a clearly better method is moved toward, in total
  QUICK: 5,             // quick rounds per shift (3 when the shift has two cases)
  RESURFACE: 28 * D     // a finding the student waved off comes back after this long, or if its gap grows by GAP
};

/* ---------------- methods ---------------- */
/* Each practice mode belongs to one study method (the ids used by course.methods). */
const MODE_METHOD = { case: 'cases', bowtie: 'cases', whofirst: 'whofirst', delegation: 'whofirst', trend: 'trend', abg: 'abg', rates: 'rates', quickfire: 'questions', rhymes: 'flashcards' };
const SHORT = { cases: 'Cases', whofirst: 'Prioritization', trend: 'Trend reading', abg: 'ABG decoding', rates: 'Rate drills', questions: 'Practice questions', flashcards: 'Flashcards' };
const methodName = m => SHORT[m] || m;
const pct = x => Math.round(x * 100) + '%';
const avg = a => a.reduce((x, y) => x + y, 0) / a.length;

/* ---------------- topic areas ---------------- */
/* Practice and exam-format items are matched by topic area. Items can carry an explicit `area`; otherwise the
   area comes from their topic label (case system, card category, question topic), then from their text.
   Order matters: the first matching rule wins. */
const AREAS = [
  ['resp', 'respiratory', /\bresp\b|respirat|asthma|copd|pneumon|\bards\b|pulmon|\btb\b|tubercul|airway|bronch|inhal|breath|dyspn/i],
  ['neuro', 'neuro', /neuro|stroke|seiz|intracranial|\bicp\b|brain|spinal|dysreflexia|head inj|case study 2|cushing|glasgow/i],
  ['fluids', 'fluids, burns and electrolytes', /fluid|burn|tbsa|sodium|potassium|calcium|magnes|phosph|electrolyte|overload|\bdka\b|diure/i],
  ['shock', 'shock and sepsis', /shock|sepsis|septic|hemorrhag|hypovol|trauma|perfusion|bleed/i],
  ['acidbase', 'acid-base', /acid|\babg|alkal/i],
  ['priority', 'prioritization', /priorit|delegat|clinical judg|the model/i],
  ['prevention', 'levels of prevention', /prevent|screening/i],
  ['infection', 'infection and immunity', /infect|transmission|immun|vaccin|outbreak/i],
  ['epi', 'epidemiology', /epidem|incidence|prevalence|mortality|\brates\b|denominator|causal|natural history|disease pattern|study design|triangle/i],
  ['culture', 'culture', /cultur/i],
  ['family', 'families', /famil/i],
  ['vulnerable', 'vulnerable populations', /vulnerab|homeless|poverty/i],
  ['community', 'community and public health', /communit|public health|core function|essential service|practice setting|program plan|planning process|smart objective|aggregate|population|nurse roles/i],
  ['lifespan', 'lifespan', /lifespan|pediatric|older adult|infant|child|pregnan|geriatric/i]
];
const AREA_NAME = Object.fromEntries(AREAS.map(a => [a[0], a[1]]));
/* Trend templates describe a story rather than a system, so they are mapped by hand. */
const TREND_AREA = { hemorrhage: 'shock', burnshock: 'fluids', sepsis: 'shock', icp: 'neuro', statusasth: 'resp', neuroshock: 'neuro', benzo: 'neuro', asthma_better: 'resp', sepsis_better: 'shock', overload_better: 'fluids', dka_mixed: 'fluids' };

function classify(text) { if (!text) return null; for (const [id, , re] of AREAS) if (re.test(text)) return id; return null; }
/* kind: 'case' | 'whofirst' | 'delegation' | 'trend' | 'quickfire' | 'rhyme' */
function areaOf(x, kind) {
  if (!x) return null;
  if (x.area) return x.area;
  if (kind === 'trend' && TREND_AREA[x.id]) return TREND_AREA[x.id];
  const label = kind === 'case' ? x.system : kind === 'whofirst' ? x.sys : kind === 'quickfire' ? x.topic : kind === 'rhyme' ? x.cat : kind === 'trend' ? x.threat : null;
  const text = kind === 'case' ? x.title : kind === 'whofirst' ? x.t : kind === 'quickfire' ? x.q : kind === 'rhyme' ? x.front : kind === 'trend' ? x.title : kind === 'delegation' ? x.rn : '';
  return classify(label) || classify(text) || (kind === 'rhyme' ? classify(x.back) : null);
}
const abgArea = id => id === 'ra' || id === 'rk' ? 'resp' : id ? 'acidbase' : null;

/* Events recorded before areas were logged carry no `a`; their area is worked out from the item key. */
let index = null; const areaCache = new Map();
function buildIndex() {
  index = { qf: new Map(), wf: new Map(), del: new Map(), cases: new Map(), trends: new Map() };
  (window.QUICKFIRE || []).forEach(q => index.qf.set(q.q.slice(0, 40), q));
  Object.values(S().courses || {}).forEach(c => ((c.custom && c.custom.questions) || []).forEach(q => { const k = q.q.slice(0, 40); if (!index.qf.has(k)) index.qf.set(k, q); }));
  (window.WHO_FIRST || []).forEach(w => index.wf.set(w.t.slice(0, 40), w));
  (window.DELEGATION || []).forEach(d => index.del.set(d.rn.slice(0, 40), d));
  (window.CASES || []).forEach(c => index.cases.set(c.id, c));
  (window.TREND_TEMPLATES || []).forEach(t => index.trends.set(t.id, t));
}
function eventArea(e) {
  if (e.a !== undefined) return e.a;
  const ck = e.m + '|' + (e.k || '');
  if (areaCache.has(ck)) return areaCache.get(ck);
  if (!index) buildIndex();
  const k = e.k || ''; let a = null;
  if (e.m === 'case' || e.m === 'bowtie') a = areaOf(index.cases.get(k.split('#')[0]), 'case');
  else if (e.m === 'whofirst') a = areaOf(index.wf.get(k.replace(/^wfc?:/, '')), 'whofirst');
  else if (e.m === 'delegation') a = areaOf(index.del.get(k.replace(/^del:/, '')), 'delegation');
  else if (e.m === 'trend') a = areaOf(index.trends.get(k.replace(/^trend2?:/, '')), 'trend');
  else if (e.m === 'abg') a = abgArea(k.split(':')[1]);
  else if (e.m === 'rates') a = 'epi';
  else if (e.m === 'quickfire') a = areaOf(index.qf.get(k.replace(/^qf:/, '')), 'quickfire');
  areaCache.set(ck, a); return a;
}
/* What counts as "the same item" when excluding it from its own yardstick: a whole case, or one question. */
const contentId = e => (e.m === 'case' || e.m === 'bowtie') ? 'case:' + (e.k || '').split('#')[0] : (e.k || e.m + ':' + e.t);

/* ---------------- course helpers ---------------- */
function state(course) { if (!course.adapt) course.adapt = { seen: {} }; if (!course.adapt.seen) course.adapt.seen = {}; return course.adapt; }
const isOn = (course, m) => !course || !course.methods || course.methods.includes(m);
function favorites(course) { return (course.favorites || []).filter(m => isOn(course, m)); }
/* The exam-format item this course is measured on, which is also the anchor of every shift. */
function yardstick(course, content) {
  if (isOn(course, 'cases') && content.cases.length) return 'case';
  if (content.quickfire.length) return 'quickfire';
  return null;
}
const yardName = ym => ym === 'case' ? 'case questions' : 'practice questions';
/* Methods that can fill a quick round in this course right now (switched on, with content to draw from). */
function slotMethods(course, content) {
  const on = m => isOn(course, m); const out = [];
  const wf = content.whofirst.some(x => x.tier === 1) && content.whofirst.length >= 4;
  if (on('whofirst') && (wf || content.delegation.length)) out.push('whofirst');
  if (on('trend') && content.trends.length >= 4) out.push('trend');
  if (on('abg')) out.push('abg');
  if (on('rates')) out.push('rates');
  if (on('questions') && content.quickfire.length) out.push('questions');
  if (on('flashcards') && content.rhymes.length) out.push('flashcards');
  return out;
}
/* Methods a student can meaningfully pick as a favourite: the quick-round ones plus cases when the course has them. */
function choosable(course, content) {
  const out = slotMethods(course, content);
  if (isOn(course, 'cases') && content.cases.length) out.unshift('cases');
  return out;
}
/* When there is no explicit favourite, the method tapped most often in the after-shift "which round helped" question. */
function ratedFavorite(course) {
  const n = {};
  S().ratings.filter(r => r.c === course.id).forEach(r => { const m = MODE_METHOD[r.m]; if (m) n[m] = (n[m] || 0) + 1; });
  const top = Object.entries(n).sort((a, b) => b[1] - a[1])[0];
  return top && top[1] >= 3 ? top[0] : null;
}
function stated(course) { const f = favorites(course); if (f.length) return { list: f, how: 'picked' }; const r = ratedFavorite(course); return r ? { list: [r], how: 'rated' } : { list: [], how: null }; }

/* ---------------- measurement ---------------- */
function localDay(t) { return Math.floor((t - new Date(t).getTimezoneOffset() * 6e4) / D); }
function weekIndex(t = Date.now()) { return Math.floor((localDay(t) - 4) / 7); }   // weeks start on Monday
function firstAtOrAfter(list, t) { let lo = 0, hi = list.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (list[mid].t0 < t) lo = mid + 1; else hi = mid; } return list[lo] || null; }

/* For every (method, area, day) the student practised, find the next exam-format session on that area in the
   delay window and record its average score. Returns results per method, per area and method, and a baseline
   of exam-format sessions that had no practice on their area in the week before. */
function analyze(course, cutoff, content) {
  content = content || SR.content();
  const ym = yardstick(course, content);
  const out = { ym, methods: {}, areas: {}, none: { n: 0, sum: 0, mean: null }, linked: 0 };
  if (!ym) return out;
  const sessions = {}, units = {};
  for (const e of S().events) {
    if (e.c !== course.id || e.t > cutoff) continue;
    const a = eventArea(e); const m = MODE_METHOD[e.m]; if (!a || !m) continue;
    const day = localDay(e.t), id = contentId(e);
    if (e.m === ym) { const k = a + '|' + day; const s = sessions[k] || (sessions[k] = { a, t0: e.t, items: [] }); if (e.t < s.t0) s.t0 = e.t; s.items.push({ id, sc: e.sc }); }
    const k = m + '|' + a + '|' + day; const u = units[k] || (units[k] = { m, a, t: e.t, ids: new Set() }); if (e.t > u.t) u.t = e.t; u.ids.add(id);
  }
  const byArea = {}, unitsByArea = {};
  for (const s of Object.values(sessions)) (byArea[s.a] = byArea[s.a] || []).push(s);
  for (const l of Object.values(byArea)) l.sort((x, y) => x.t0 - y.t0);
  const add = (o, m, v) => { const b = o[m] || (o[m] = { n: 0, sum: 0 }); b.n++; b.sum += v; };
  for (const u of Object.values(units)) {
    (unitsByArea[u.a] = unitsByArea[u.a] || []).push(u);
    const list = byArea[u.a]; if (!list) continue;
    const s = firstAtOrAfter(list, u.t + RULES.DELAY_MIN);
    if (!s || s.t0 > Math.min(u.t + RULES.DELAY_MAX, cutoff)) continue;
    const sc = s.items.filter(i => !u.ids.has(i.id)).map(i => i.sc); if (!sc.length) continue;
    const v = avg(sc); add(out.methods, u.m, v); add(out.areas[u.a] || (out.areas[u.a] = {}), u.m, v); out.linked++;
  }
  for (const [a, list] of Object.entries(byArea)) for (const s of list) {
    const practised = (unitsByArea[a] || []).some(u => u.t <= s.t0 - RULES.DELAY_MIN && u.t >= s.t0 - RULES.DELAY_MAX);
    if (!practised) { out.none.n++; out.none.sum += avg(s.items.map(i => i.sc)); }
  }
  const fin = o => { for (const b of Object.values(o)) b.mean = b.n ? b.sum / b.n : null; };
  fin(out.methods); Object.values(out.areas).forEach(fin); out.none.mean = out.none.n ? out.none.sum / out.none.n : null;
  return out;
}

/* Compare methods on one scope (the whole course, or one area). c = now, p = a week ago. */
function judge(c, p, favs) {
  const ready = m => c[m] && c[m].n >= RULES.MIN_N && p[m] && p[m].n >= RULES.MIN_N;
  const ms = Object.keys(c).filter(ready).sort((a, b) => c[b].mean - c[a].mean);
  if (ms.length < 2) return null;
  const gap = (o, a, b) => o[a].mean - o[b].mean;
  const held = (a, b, test) => test(gap(c, a, b)) && test(gap(p, a, b));
  const big = g => g >= RULES.GAP, even = g => Math.abs(g) < RULES.TIE;
  const mk = (type, a, b) => ({ type, a, b, am: c[a].mean, bm: c[b].mean, an: c[a].n, bn: c[b].n, gap: gap(c, a, b) });
  const top = ms[0], fav = ms.find(m => favs.includes(m));
  if (fav && fav !== top) { if (held(top, fav, big)) return mk('better', top, fav); if (held(top, fav, even)) return mk('tied', fav, top); return null; }
  const rival = ms[1];
  if (fav) { if (held(fav, rival, big)) return mk('confirmed', fav, rival); if (held(fav, rival, even)) return mk('tied', fav, rival); return null; }
  return held(top, rival, big) ? mk('best', top, rival) : null;
}
function scoped(f, area) { if (!f) return null; f.area = area; f.id = [f.type, area || 'all', f.a, f.b].join(':'); return f; }
function evaluate(course, content) {
  content = content || SR.content();
  const now = Date.now();
  const cur = analyze(course, now, content), prev = analyze(course, now - 7 * D, content);
  const st = stated(course);
  const finding = scoped(judge(cur.methods, prev.methods, st.list), null);
  let areaFinding = null;
  for (const a of Object.keys(cur.areas)) {
    const f = judge(cur.areas[a], prev.areas[a] || {}, st.list);
    if (f && f.type !== 'tied' && (!areaFinding || Math.abs(f.gap) > Math.abs(areaFinding.gap))) areaFinding = scoped(f, a);
  }
  return { cur, prev, finding, areaFinding, stated: st };
}

/* The home screen asks for the same evaluation several times per render; reuse it until the data changes
   (or a minute passes, since "a week ago" moves with the clock). */
let memo = { key: null, val: null };
function evaluateCached(course, content) {
  const st = S(); const ev = st.events; const last = ev.length ? ev[ev.length - 1].t : 0;
  const key = [course.id, ev.length, last, (course.favorites || []).join(','), (course.methods || []).join(','), (content.focus || []).join(','), st.ratings.length, content.cases.length, content.quickfire.length, Math.floor(Date.now() / 6e4)].join('|');
  if (memo.key !== key) memo = { key, val: evaluate(course, content) };
  return memo.val;
}

/* ---------------- the quick-round mix ---------------- */
function baseWeights(slots, favs) {
  const F = slots.filter(m => favs.includes(m)), O = slots.filter(m => !favs.includes(m)); const w = {};
  if (!F.length || !O.length) { slots.forEach(m => w[m] = 1 / slots.length); return w; }
  const share = Math.min(RULES.FAV_SHARE, 1 - RULES.FLOOR * O.length);
  F.forEach(m => w[m] = share / F.length); O.forEach(m => w[m] = (1 - share) / O.length);
  return w;
}
/* Enforce the floors (each method, favourites together) and make the shares add up to 1. */
function clampWeights(w, slots, favs) {
  const out = {}; const n = slots.length; if (!n) return out;
  const floor = Math.min(RULES.FLOOR, 1 / n);
  slots.forEach(m => out[m] = Math.max(0, w[m] || 0));
  for (let pass = 0; pass < 6; pass++) {
    slots.forEach(m => { if (out[m] < floor) out[m] = floor; });
    const sum = slots.reduce((a, m) => a + out[m], 0); slots.forEach(m => out[m] /= sum);
    const F = slots.filter(m => favs.includes(m)), O = slots.filter(m => !favs.includes(m));
    if (F.length && O.length) {
      const fs = F.reduce((a, m) => a + out[m], 0);
      if (fs < RULES.FAV_FLOOR - 1e-9) { const need = RULES.FAV_FLOOR - fs, os = 1 - fs; F.forEach(m => out[m] += need * out[m] / fs); O.forEach(m => out[m] -= need * out[m] / os); }
    }
  }
  return out;
}
function dismissed(ad, f) { const s = ad.seen[f.id]; return !!(s && s.choice === 'keep' && !(f.gap >= s.gap + RULES.GAP || Date.now() - s.at > RULES.RESURFACE)); }
/* Where the mix is heading: the favourite-based start, shifted toward a clearly better quick-round method. */
function targetWeights(slots, favs, finding, ad) {
  const w = baseWeights(slots, favs);
  if (finding && !finding.area && (finding.type === 'better' || finding.type === 'best') && slots.includes(finding.a) && !dismissed(ad, finding)) {
    // take the share from the method it beat first, then from the others, never below the floor
    let want = RULES.BOOST;
    const take = list => { const room = list.reduce((a, m) => a + Math.max(0, w[m] - RULES.FLOOR), 0); if (room <= 0) return; const t = Math.min(want, room); list.forEach(m => { const r = Math.max(0, w[m] - RULES.FLOOR); w[m] -= t * r / room; }); w[finding.a] += t; want -= t; };
    if (slots.includes(finding.b)) take([finding.b]);
    if (want > 1e-9) take(slots.filter(m => m !== finding.a && m !== finding.b));
  }
  return clampWeights(w, slots, favs);
}
function stepToward(cur, target, slots, favs) {
  const w = {}; slots.forEach(m => { const d = (target[m] || 0) - (cur[m] || 0); w[m] = (cur[m] || 0) + Math.max(-RULES.STEP, Math.min(RULES.STEP, d)); });
  return clampWeights(w, slots, favs);
}
function activeWeights(ad, slots, favs) { const base = baseWeights(slots, favs); const w = {}; slots.forEach(m => w[m] = ad.w && ad.w[m] !== undefined ? ad.w[m] : base[m]); return clampWeights(w, slots, favs); }
function snapshot(ad, w) { ad.hist = (ad.hist || []).concat([{ wk: weekIndex(), w: Object.fromEntries(Object.entries(w).map(([m, v]) => [m, Math.round(v * 100) / 100])) }]).slice(-12); }

/* Bring the course's mix up to date: start it from the favourites the first time (or whenever the favourites
   change), and move it one step toward the target the first time the course is opened in a new week. */
function refresh(course, content) {
  content = content || SR.content();
  const ad = state(course); const slots = slotMethods(course, content);
  const favs = favorites(course).filter(m => slots.includes(m));
  const ev = evaluateCached(course, content);
  // restart only when the favourites themselves change; a Focus setting that hides some methods must not wipe the mix
  const basis = favorites(course).slice().sort().join(',');
  let changed = false;
  if (!ad.w || ad.basis !== basis) { ad.w = clampWeights(baseWeights(slots, favs), slots, favs); ad.basis = basis; ad.week = weekIndex(); snapshot(ad, ad.w); changed = true; }
  let w = activeWeights(ad, slots, favs);
  const target = targetWeights(slots, favs, ev.finding, ad);
  if (ad.week !== weekIndex()) { w = stepToward(w, target, slots, favs); Object.assign(ad.w, w); ad.week = weekIndex(); snapshot(ad, w); changed = true; }
  if (changed) SR.save();
  return { slots, favs, w, target, ev };
}

/* Pick k quick rounds. Each pick goes to the method furthest behind its share over recent shifts, so even a 10%
   method turns up regularly instead of by luck. */
function pickSlots(ad, w, k) {
  const served = ad.served || {}; for (const m of Object.keys(served)) served[m] *= 0.85;
  const picks = [];
  for (let i = 0; i < k; i++) {
    const total = Object.keys(w).reduce((a, m) => a + (served[m] || 0), 0) + 1;
    let best = null, bestD = -Infinity;
    for (const m of Object.keys(w)) {
      let d = w[m] * total - (served[m] || 0);
      if (picks[picks.length - 1] === m) d -= 0.6;    // avoid the same method twice in a row when there is a choice
      d += Math.random() * 0.02;
      if (d > bestD) { bestD = d; best = m; }
    }
    picks.push(best); served[best] = (served[best] || 0) + 1;
  }
  ad.served = served;
  return picks;
}
/* What the next shift holds: the anchor (1 or 2 cases, or a question set) and the quick-round methods. */
function planShift(course) {
  const content = SR.content(); const r = refresh(course, content); const ad = state(course);
  const ym = r.ev.cur.ym;
  const anchors = ym === 'case' ? (ad.anchorCount === 2 && content.cases.length > 1 ? 2 : 1) : ym ? 1 : 0;
  const picks = r.slots.length ? pickSlots(ad, r.w, anchors === 2 ? 3 : RULES.QUICK) : [];
  SR.save();
  return { ym, anchors, picks };
}

/* ---------------- reveals ---------------- */
function pending(course, ev) {
  const ad = state(course);
  for (const f of [ev.finding, ev.areaFinding]) {
    if (!f) continue;
    const s = ad.seen[f.id];
    if (!s) return f;
    if (s.choice === 'keep' && (f.gap >= s.gap + RULES.GAP || Date.now() - s.at > RULES.RESURFACE)) return f;
  }
  return null;
}
const moves = f => !f.area && (f.type === 'better' || f.type === 'best');
const anchorOnly = (m, ym) => m === 'cases' && ym === 'case';
function describe(f, ev, course) {
  const yard = yardName(ev.cur.ym); const N = methodName;
  const where = f.area ? ' for ' + AREA_NAME[f.area] : '';
  const said = ev.stated.how === 'rated' ? 'You said ' + N(f.b) + ' helped most' : 'You prefer ' + N(f.b);
  const nums = (a, am, b, bm) => 'After practising a topic with ' + N(a) + ', you scored ' + pct(am) + ' the next time you met that topic\'s ' + yard + ' (a day or more later), versus ' + pct(bm) + ' after ' + N(b) + '.';
  const next = f.area ? '' : anchorOnly(f.a, ev.cur.ym) ? ' Tap “Use more of it” to add a second case to each shift.'
    : !slotMethods(course, SR.content()).includes(f.a) ? ' ' + N(f.a) + ' is switched off for this course right now; switch it back on under Course settings → Edit course if you want more of it.'
    : ' We\'ll mix in a little more ' + N(f.a) + '. You can change this any time.';
  if (f.type === 'better') return { head: N(f.a) + ' is what sticks for you' + where + '.', body: said + ', but here is what the numbers say. ' + nums(f.a, f.am, f.b, f.bm) + next };
  if (f.type === 'best') return { head: N(f.a) + ' is what sticks best for you' + where + '.', body: nums(f.a, f.am, f.b, f.bm) + next };
  if (f.type === 'confirmed') return { head: 'You were right: ' + N(f.a) + ' is what sticks for you' + where + '.', body: nums(f.a, f.am, f.b, f.bm) + ' Keep doing what you are doing.' };
  return { head: N(f.a) + ' and ' + N(f.b) + ' work about equally for you' + where + '.', body: pct(f.am) + ' versus ' + pct(f.bm) + ' on later ' + yard + '. We\'ll keep using what you prefer.' };
}
function respond(course, f, choice) {
  const content = SR.content(); const ad = state(course); const ym = yardstick(course, content);
  ad.seen[f.id] = { at: Date.now(), choice, gap: f.gap };
  const slots = slotMethods(course, content); const favs = favorites(course).filter(m => slots.includes(m));
  if (choice === 'more') {
    if (anchorOnly(f.a, ym)) ad.anchorCount = 2;
    else if (slots.includes(f.a)) { const w = stepToward(activeWeights(ad, slots, favs), targetWeights(slots, favs, f, ad), slots, favs); ad.w = Object.assign(ad.w || {}, w); snapshot(ad, w); }
  }
  if (choice === 'keep') {
    if (anchorOnly(f.a, ym)) ad.anchorCount = 1;
    const w = targetWeights(slots, favs, f, ad);   // the finding is now dismissed, so this is the mix without the move
    ad.w = Object.assign(ad.w || {}, w); snapshot(ad, w);
  }
  SR.save();
}

/* ---------------- UI pieces ---------------- */
function toggleFav(list, m) { const i = list.indexOf(m); if (i >= 0) list.splice(i, 1); else { if (list.length >= 2) list.shift(); list.push(m); } return list; }
function favChips(methods, favs, onToggle) {
  const wrap = el('div', { class: 'row favs' });
  methods.forEach(m => { const on = favs.includes(m); wrap.append(el('button', { class: 'btn sm' + (on ? ' on' : ''), type: 'button', 'aria-pressed': on ? 'true' : 'false', onclick: () => onToggle(m) }, (on ? '★ ' : '☆ ') + methodName(m))); });
  return wrap;
}
function favPrompt(course, methods) {
  const picked = []; const card = el('div', { class: 'card reveal', style: 'margin-bottom:18px' });
  const save = () => { course.favorites = picked.slice(); course.favAsked = true; SR.save(); toast('Saved. Your shifts now lean toward ' + picked.map(methodName).join(' and ') + '.'); SR.homeView(); };
  const draw = () => {
    card.innerHTML = '';
    card.append(el('div', { class: 'eyebrow' }, 'Make it yours'), el('h2', {}, 'Which ways of studying do you like best?'),
      el('p', { class: 'lead', style: 'margin:8px 0 12px' }, 'Pick up to two. Every shift leans toward them. As you study, the app checks what actually sticks for you, and tells you when it knows.'),
      favChips(methods, picked, m => { toggleFav(picked, m); draw(); }),
      el('div', { class: 'actions' }, el('button', { class: 'btn primary', type: 'button', disabled: !picked.length, onclick: save }, 'Save'), el('button', { class: 'btn ghost', type: 'button', onclick: () => { course.favAsked = true; SR.save(); SR.homeView(); } }, 'Not now')));
  };
  draw(); return card;
}
/* The finding card. `after` redraws whichever screen it sits on; `more` adds the "Tell me more" link to Insights. */
function revealCard(course, f, ev, after = () => SR.homeView(), more = true) {
  const d = describe(f, ev, course);
  const card = el('div', { class: 'card reveal lift', style: 'margin-bottom:18px' }, el('div', { class: 'eyebrow' }, 'What actually works for you'), el('h2', {}, d.head), el('p', { class: 'lead', style: 'margin-top:8px' }, d.body));
  const act = (choice, msg) => () => { respond(course, f, choice); if (msg) toast(msg); after(); };
  const canMove = moves(f) && (anchorOnly(f.a, ev.cur.ym) || slotMethods(course, SR.content()).includes(f.a));
  const btns = canMove
    ? [el('button', { class: 'btn primary', type: 'button', onclick: act('more', anchorOnly(f.a, ev.cur.ym) ? 'Shifts now include a second case.' : 'Mixing in more ' + methodName(f.a) + '.') }, 'Use more of it'), el('button', { class: 'btn', type: 'button', onclick: act('keep', 'Kept your mix. The app keeps measuring.') }, 'Keep my mix')]
    : [el('button', { class: 'btn primary', type: 'button', onclick: act('ok') }, 'Good to know')];
  if (more) btns.push(el('button', { class: 'btn ghost', type: 'button', onclick: () => SR.insights.view() }, 'Tell me more'));
  card.append(el('div', { class: 'actions' }, ...btns));
  return card;
}
/* Cards for the course home: the one-time favourites question, then any finding waiting to be told. */
function homeCards(course) {
  const content = SR.content(); const r = refresh(course, content); const out = [];
  const methods = choosable(course, content);
  if (!favorites(course).length && !course.favAsked && methods.length > 1) out.push(favPrompt(course, methods));
  const f = pending(course, r.ev); if (f) out.push(revealCard(course, f, r.ev));
  return out;
}
/* One line under the Start button: what a shift holds right now. */
function mixLine(course) {
  const content = SR.content(); const r = refresh(course, content); const ad = state(course);
  if (!r.slots.length) return null;
  const ym = r.ev.cur.ym; const two = ym === 'case' && ad.anchorCount === 2 && content.cases.length > 1;
  const anchor = ym === 'case' ? (favorites(course).includes('cases') ? '★ ' : '') + (two ? '2 cases' : '1 case') : ym === 'quickfire' ? 'a question set' : null;
  const parts = r.slots.slice().sort((a, b) => r.w[b] - r.w[a]).map(m => (r.favs.includes(m) ? '★ ' : '') + methodName(m) + ' ' + pct(r.w[m]));
  return el('p', { class: 'hint mixline', style: 'margin:12px 0 0' }, 'Each shift: ' + (anchor ? anchor + ' + ' : '') + (two ? 3 : RULES.QUICK) + ' quick rounds · ' + parts.join(' · ') + ' · ', el('button', { class: 'linkbtn', type: 'button', onclick: () => SR.insights.view() }, 'how this works'));
}
/* Favourite picker for course settings. */
function settingsPanel(course, onChange) {
  const content = SR.content(); const methods = choosable(course, content);
  const favs = favorites(course).slice();
  const wrap = el('div', {});
  if (methods.length < 2) { wrap.append(el('p', { class: 'hint' }, 'Switch on at least two ways of studying (Edit course) to pick favourites.')); return wrap; }
  wrap.append(...[el('p', { class: 'hint' }, 'Tap up to two favourites. Shifts lean toward them; the app tells you if something else turns out to work better.'),
    favChips(methods, favs, m => { toggleFav(favs, m); course.favorites = favs.slice(); course.favAsked = true; SR.save(); onChange(); }), mixLine(course)].filter(Boolean));
  return wrap;
}
/* The top card on the Insights page. */
function insightsCard(course) {
  const content = SR.content(); const r = refresh(course, content); const ev = r.ev; const ad = state(course);
  const ym = ev.cur.ym; const yard = yardName(ym);
  const card = el('div', { class: 'card lift' }, el('div', { class: 'eyebrow' }, 'What actually works for you'));
  if (!ym) { card.append(el('h2', {}, 'Nothing to measure against yet'), el('p', { class: 'lead', style: 'margin-top:8px' }, 'This course has no cases or practice questions yet. Those exam-style items are the yardstick every study method is measured on.')); return card; }
  const f = ev.finding || ev.areaFinding;
  if (f) {
    const d = describe(f, ev, course); card.append(el('h2', {}, d.head), el('p', { class: 'lead', style: 'margin-top:8px' }, d.body));
    if (pending(course, ev) === f) card.append(revealCard(course, f, ev, () => SR.insights.view(), false).querySelector('.actions'));
  } else {
    card.append(el('h2', {}, 'Still learning what works for you'), el('p', { class: 'lead', style: 'margin-top:8px' }, 'After you practise a topic, the app looks at how you do on that topic\'s ' + yard + ' the next time you meet them, a day or more later. Each method needs about ' + RULES.MIN_N + ' of those before it can be compared. Keep studying the way you like; the numbers below fill in on their own.'));
  }
  const rows = [...new Set([...choosable(course, content), ...Object.keys(ev.cur.methods)])];
  const tb = el('tbody');
  const ratedN = {}; S().ratings.filter(x => x.c === course.id).forEach(x => { const m = MODE_METHOD[x.m]; if (m) ratedN[m] = (ratedN[m] || 0) + 1; });
  rows.forEach(m => {
    const b = ev.cur.methods[m]; const fav = favorites(course).includes(m);
    const said = fav ? '★ favourite' : ratedN[m] ? 'helped most ' + ratedN[m] + '×' : '';
    const share = !isOn(course, m) ? 'off' : anchorOnly(m, ym) ? (ad.anchorCount === 2 ? '2 per shift' : '1 per shift') : r.w[m] !== undefined ? pct(r.w[m]) : '—';
    const res = b && b.n ? pct(b.mean) + ' · ' + b.n + ' linked' + (b.n < RULES.MIN_N ? ' (needs ' + RULES.MIN_N + ')' : '') : 'not linked yet';
    tb.append(el('tr', {}, el('td', {}, methodName(m)), el('td', {}, said), el('td', { class: 'num' }, share), el('td', { class: 'num' }, res)));
  });
  card.append(el('div', { class: 'tablewrap' }, el('table', { class: 'mixtable' }, el('thead', {}, el('tr', {}, el('th', {}, 'Method'), el('th', {}, 'You said'), el('th', {}, 'Share of quick rounds'), el('th', {}, 'Later ' + yard))), tb)));
  if (ev.cur.none.n) card.append(el('p', { class: 'hint', style: 'margin-top:8px' }, 'For comparison: ' + yard + ' on a topic you had not practised in the week before averaged ' + pct(ev.cur.none.mean) + ' (' + ev.cur.none.n + ' sessions).'));
  const areas = Object.entries(ev.cur.areas).filter(([, o]) => Object.keys(o).length);
  if (areas.length) {
    const t = el('tbody');
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
    areas.sort((a, b) => (AREA_NAME[a[0]] || a[0]).localeCompare(AREA_NAME[b[0]] || b[0])).forEach(([a, o]) => t.append(el('tr', {}, el('td', {}, cap(AREA_NAME[a] || a)), el('td', {}, Object.entries(o).sort((x, y) => y[1].mean - x[1].mean).map(([m, v]) => methodName(m) + ' ' + pct(v.mean) + ' (' + v.n + ')').join(' · ')))));
    card.append(el('details', { style: 'margin-top:10px' }, el('summary', { class: 'hint', style: 'cursor:pointer' }, 'By topic'), el('div', { class: 'tablewrap' }, el('table', { class: 'mixtable' }, el('thead', {}, el('tr', {}, el('th', {}, 'Topic'), el('th', {}, 'Later ' + yard + ' after each method (linked results)'))), t))));
  }
  card.append(el('p', { class: 'hint', style: 'margin-top:12px' }, 'How this works: every shift has ' + (ym === 'case' ? 'an unfolding case' : 'a set of practice questions') + ' (the exam format, and the yardstick) plus quick rounds. The quick rounds lean toward your favourites, and every method you have switched on keeps at least 10%. The app only compares methods once each has ' + RULES.MIN_N + ' linked results, and only speaks up when a gap of 10 points or more holds two weeks in a row. Your mix then moves at most 10 points a week, your favourites never drop below 30% together, and you can always keep your own mix.'));
  return card;
}

SR.adapt = { RULES, MODE_METHOD, AREAS, AREA_NAME, areaOf, eventArea, abgArea, methodName, favorites, choosable, slotMethods, yardstick, analyze, evaluate, judge, baseWeights, clampWeights, targetWeights, stepToward, refresh, planShift, pickSlots, respond, pending, describe, favChips, toggleFav, homeCards, mixLine, settingsPanel, insightsCard, weekIndex };
})();
