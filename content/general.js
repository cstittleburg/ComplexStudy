/* General material: cards, trend templates and blood-gas data drawn from general nursing knowledge rather than
   from any course's handouts. Unlike the course packs (resp.js, week1.js, pools.js, studyguide.js, community.js),
   this file stays public in every deployment, including the pilot. It must load before pools.js: pools.js
   appends to these lists and labels its cards by position, so the six model cards have to come first. */

/* ---------- ABG DECODER ---------- */
window.ABG = {
  disorders: [
    { id: 'ra', name: 'Respiratory acidosis', causes: ['COPD exacerbation with CO₂ retention', 'Opioid or benzodiazepine over-sedation (hypoventilation)', 'Status asthmaticus with respiratory muscle fatigue', 'High cervical spinal cord injury weakening breathing'], action: 'Improve ventilation: sit up, stimulate, support breathing (bag-mask, BiPAP or intubation as ordered); check level of consciousness; trend ABGs', tip: 'Hypoventilation traps CO₂. CO₂ is an acid.' },
    { id: 'rk', name: 'Respiratory alkalosis', causes: ['Anxiety or pain with hyperventilation', 'Early pulmonary embolism', 'Early ARDS or early sepsis', 'Mechanical ventilator rate set too high'], action: 'Find the cause of the fast breathing: treat pain, anxiety or hypoxia; coach slow breathing; check for PE or sepsis', tip: 'Hyperventilation blows off CO₂. Losing acid = alkalosis.' },
    { id: 'ma', name: 'Metabolic acidosis', causes: ['Diabetic ketoacidosis', 'Septic shock with lactate build-up', 'Renal failure', 'Severe diarrhea (bicarbonate loss)'], action: 'Treat the cause: fluids and insulin for DKA, fluids and antibiotics for sepsis; monitor potassium and cardiac rhythm; watch for Kussmaul breathing', tip: 'Too much acid or too little bicarbonate. Lungs compensate by breathing deep and fast.' },
    { id: 'mk', name: 'Metabolic alkalosis', causes: ['Prolonged vomiting or NG suction (acid loss)', 'Loop diuretic use (furosemide)', 'Excess antacid or bicarbonate intake', 'Hypokalemia'], action: 'Stop the loss (antiemetics, review diuretics); replace fluids, potassium and chloride as ordered; monitor for shallow breathing', tip: 'Losing acid (vomiting) or gaining base. Lungs compensate by breathing slow and shallow.' }
  ]
};

/* Trend templates that describe general physiology, not a particular handout */
window.TREND_TEMPLATES.push(
  { source: 'general', id: 'sepsis', title: 'Pneumonia on the floor, 1400 → 1800', threat: 'Sepsis progressing to septic shock', action: 'Rapid response; sepsis bundle: cultures, antibiotics within the hour, 30 mL/kg fluids, lactate',
    rows: [
      { t: 'Temp (°F)', dec: 1, base: [100.2, 100.9], dir: 'up', delta: [1.0, 1.8], worse: 'up' },
      { t: 'HR', base: [96, 104], dir: 'up', delta: [18, 26], worse: 'up' },
      { t: 'BP', bp: true, base: [116, 126], dir: 'down', delta: [26, 36], worse: 'down' },
      { t: 'Urine output (mL/hr)', base: [35, 45], dir: 'down', delta: [18, 26], worse: 'down' },
      { t: 'Mental status', text: ['oriented ×4', 'confused'], dir: 'down', worse: 'down' },
      { t: 'Lactate', dec: 1, base: [1.6, 2.0], dir: 'up', delta: [2.2, 3.0], worse: 'up' },
      { t: 'Platelets (k)', base: [220, 260], dir: 'flat' }
    ] },
  { source: 'general', id: 'sepsis_better', title: 'Septic shock after fluids and antibiotics, 1120 → 1400', threat: 'Improving: perfusion restored (watch lungs for overload)', action: 'Continue bundle; reassess lungs and urine output hourly; trend lactate',
    rows: [
      { t: 'BP', bp: true, base: [84, 90], dir: 'up', delta: [14, 22], worse: 'down' },
      { t: 'HR', base: [114, 122], dir: 'down', delta: [12, 18], worse: 'up' },
      { t: 'Urine output (mL/hr)', base: [12, 18], dir: 'up', delta: [18, 26], worse: 'down' },
      { t: 'Lactate', dec: 1, base: [4.2, 4.8], dir: 'down', delta: [1.4, 2.0], worse: 'up' },
      { t: 'Mental status', text: ['confused', 'confused'], dir: 'flat' },
      { t: 'Temp (°F)', dec: 1, base: [101.2, 101.8], dir: 'down', delta: [0.8, 1.4], worse: 'up' }
    ] },
  { source: 'general', id: 'overload_better', title: 'Pulmonary edema after IV furosemide, 0715 → 0815', threat: 'Improving: fluid overload responding to diuretic (watch potassium)', action: 'Continue oxygen and monitoring; check potassium; daily weight and I&O',
    rows: [
      { t: 'RR', base: [28, 32], dir: 'down', delta: [6, 10], worse: 'up' },
      { t: 'SpO₂ (%)', base: [87, 89], dir: 'up', delta: [6, 8], worse: 'down' },
      { t: 'Urine output (mL/hr)', base: [25, 35], dir: 'up', delta: [400, 600], worse: 'down' },
      { t: 'Crackles', text: ['bases to mid-fields', 'bases only'], dir: 'up', worse: 'down' },
      { t: 'Potassium', dec: 1, base: [3.9, 4.2], dir: 'down', delta: [0.6, 0.9], worse: 'down' },
      { t: 'Leg edema', text: ['2+', '2+'], dir: 'flat' }
    ] },
  { source: 'general', id: 'dka_mixed', title: 'DKA on insulin drip, hour 0 → hour 3', threat: 'Improving acidosis, but potassium is falling (the potassium trap)', action: 'Replace potassium as ordered once urine output is adequate; add dextrose when glucose nears 250; continue insulin',
    rows: [
      { t: 'pH', dec: 2, base: [7.12, 7.18], dir: 'up', delta: [0.10, 0.16], worse: 'down' },
      { t: 'HCO₃⁻', base: [10, 13], dir: 'up', delta: [4, 6], worse: 'down' },
      { t: 'Glucose', base: [480, 540], dir: 'down', delta: [180, 240], worse: 'up' },
      { t: 'Potassium', dec: 1, base: [5.2, 5.6], dir: 'down', delta: [2.0, 2.5], worse: 'down' },
      { t: 'HR', base: [128, 138], dir: 'down', delta: [22, 30], worse: 'up' },
      { t: 'Temp (°F)', dec: 1, base: [98.4, 99.0], dir: 'flat' }
    ] }
);

/* The six steps of the Clinical Judgment Measurement Model */
window.RHYMES.push(
  { source: 'general', cat: 'The Model', front: 'The six steps of the Clinical Judgment Measurement Model', back: 'Recognize → Analyze → Prioritize → Generate → Take action → Evaluate.\n\nRhyme: "Really Anxious Patients Get Treated Early."', tip: 'Every NGN case study asks exactly these six questions, in this order.' },
  { source: 'general', cat: 'The Model', front: 'Recognize cues', back: '"What\'s new, what\'s changed, what\'s worse than before? That\'s the cue you can\'t ignore."', tip: 'Compare to THIS patient\'s baseline, not the textbook.' },
  { source: 'general', cat: 'The Model', front: 'Analyze cues', back: '"Cues that cluster tell a story. Group them up before you worry."', tip: 'HR up + BP down + urine down = one story: perfusion.' },
  { source: 'general', cat: 'The Model', front: 'Prioritize hypotheses', back: '"Not the most likely, the most deadly first. Ask: which one gets me the worst?"', tip: 'The worst reasonable explanation wins.' },
  { source: 'general', cat: 'The Model', front: 'Generate solutions', back: '"List every fix that fits the threat, then cross out what makes things worse yet."', tip: 'NGN loves to hide one harmful option in the list.' },
  { source: 'general', cat: 'The Model', front: 'Take action', back: '"Do what dies first if delayed: airway, breathing, then the aid."', tip: 'Ask: what becomes unsafe if I wait 30 minutes?' },
  { source: 'general', cat: 'The Model', front: 'Evaluate outcomes', back: '"An action\'s not done till you look again: better, worse, or same, and then?"', tip: 'Compare to the previous value, not to normal. Watch for the side effect of what you did.' }
);
