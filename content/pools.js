/* Generator pools: "Who First?" patient cards, Trend Detective templates,
   ABG decoder data, and the Rhyme & Reason deck (mnemonics and hooks). */

/* ---------- WHO FIRST? ----------
   tier 1 = unstable / acute change (the answer). tier 2 = abnormal but expected / stable. tier 3 = routine / teaching / comfort.
   cue = the specific cue that makes (or would make) this client the priority. */
window.WHO_FIRST = [
  // Respiratory
  { tier: 1, sys: 'Resp', t: 'Heart failure: suddenly restless, RR 30, new crackles, SpO₂ falling from 96% to 91%.', cue: 'New crackles with a falling SpO₂ (acute change from baseline)', why: 'Acute change; may progress to respiratory failure.' },
  { tier: 2, sys: 'Resp', t: 'COPD: SpO₂ 89% on 2 L NC, unchanged from baseline over previous shifts.', cue: 'SpO₂ 89% on 2 L', why: 'Abnormal but expected and unchanged. Not first.' },
  { tier: 1, sys: 'Resp', t: 'Pneumonia: new confusion, BP 88/50, HR 124, decreased urine output.', cue: 'New confusion with hypotension and tachycardia (possible sepsis)', why: 'Signs of poor perfusion and organ dysfunction.' },
  { tier: 2, sys: 'Resp', t: 'Pneumonia: temp 101.1 °F, productive cough, antibiotics started 2 hours ago.', cue: 'Fever and productive cough', why: 'Expected pneumonia symptoms; treatment under way.' },
  { tier: 3, sys: 'Resp', t: 'Pneumonia: requests cough medicine; SpO₂ 94% on room air.', cue: 'Request for cough medication', why: 'Comfort need; stable.' },
  { tier: 3, sys: 'Resp', t: 'Pneumonia: needs incentive spirometer teaching before ambulation.', cue: 'Teaching need', why: 'Teaching waits.' },
  { tier: 1, sys: 'Resp', t: 'Asthma: after two nebulizer treatments, wheezing has become quiet, speaking single words, SpO₂ 86%.', cue: 'A silent chest with single-word speech after treatment', why: 'Silent chest = air is not moving. Status asthmaticus.' },
  { tier: 2, sys: 'Resp', t: 'Asthma: loud expiratory wheezes, speaks full sentences, SpO₂ 95%, peak flow 70% of personal best.', cue: 'Loud wheezes with full sentences', why: 'Moving air; moderate, stable.' },
  { tier: 1, sys: 'Resp', t: 'Post-op day 2 knee replacement: sudden pleuritic chest pain, RR 30, anxious, SpO₂ 88%.', cue: 'Sudden pleuritic pain with hypoxemia in a post-op client (possible PE)', why: 'Pulmonary embolism until proven otherwise.' },
  { tier: 1, sys: 'Resp', t: 'Client on the ventilator: high-pressure alarm, SpO₂ 84%, agitated, tracheal shift noted.', cue: 'Tracheal shift with hypoxemia on a ventilator (tension pneumothorax)', why: 'Airway/breathing emergency.' },
  { tier: 2, sys: 'Resp', t: 'Chest tube for pneumothorax: intermittent bubbling in the water-seal chamber on exhalation, drainage 40 mL/shift.', cue: 'Intermittent water-seal bubbling', why: 'Expected air leak while the lung re-expands.' },
  { tier: 3, sys: 'Resp', t: 'TB on RIPE therapy: asks why the urine is orange.', cue: 'Orange urine question', why: 'Expected rifampin effect; teaching.' },
  { tier: 1, sys: 'Resp', t: 'First dose of ceftriaxone: throat tightness and itching.', cue: 'Throat tightness after a new antibiotic (anaphylaxis)', why: 'Airway risk; stop the drug, assess, call for help.' },
  // Neuro
  { tier: 1, sys: 'Neuro', t: 'Post-alteplase: severe headache, vomiting, declining level of consciousness.', cue: 'Neuro decline during/after thrombolysis (hemorrhage until excluded)', why: 'Stop the drug and escalate.' },
  { tier: 1, sys: 'Neuro', t: 'Chronic T4 spinal cord injury: BP 202/108, pounding headache, kinked catheter.', cue: 'Severe hypertension with headache in a high SCI (autonomic dysreflexia)', why: 'Stroke-level pressure; remove the trigger now.' },
  { tier: 2, sys: 'Neuro', t: 'Post-seizure: sleepy but arousable, RR 16, SpO₂ 96%.', cue: 'Sleepy but arousable with normal breathing', why: 'Expected post-ictal state.' },
  { tier: 2, sys: 'Neuro', t: 'TBI observation: GCS 14, unchanged for four hours.', cue: 'GCS 14 unchanged', why: 'Stable; keep trending.' },
  { tier: 1, sys: 'Neuro', t: 'TBI observation: GCS was 14, now 11, with one pupil 5 mm and sluggish.', cue: 'A GCS drop with a newly dilated pupil', why: 'Rising ICP; impending herniation.' },
  { tier: 1, sys: 'Neuro', t: 'Admitted for dehydration: daughter says "she isn\'t talking right"; new facial droop and arm drift.', cue: 'New one-sided weakness and speech change (stroke)', why: 'Time is brain.' },
  { tier: 1, sys: 'Neuro', t: 'Older adult with UTI: newly confused, weak, "not acting like herself."', cue: 'New confusion in an older adult', why: 'Delirium signals acute illness: infection, hypoxia, dehydration, medication.' },
  { tier: 2, sys: 'Neuro', t: 'Older adult with UTI reports burning with urination.', cue: 'Burning with urination', why: 'Expected symptom of the diagnosis.' },
  { tier: 3, sys: 'Neuro', t: 'Older adult requests help calling a family member.', cue: 'Request to call family', why: 'Important, not urgent.' },
  { tier: 1, sys: 'Neuro', t: 'New spinal cord injury at T3: BP 82/48, HR 46, skin warm and dry.', cue: 'Hypotension with bradycardia and warm skin (neurogenic shock)', why: 'Needs circulatory support now.' },
  { tier: 1, sys: 'Neuro', t: 'Post-seizure after IV lorazepam: unresponsive, RR 8, SpO₂ 88%.', cue: 'RR 8 with SpO₂ 88% after a benzodiazepine', why: 'Respiratory depression; airway first.' },
  { tier: 2, sys: 'Neuro', t: 'Stroke, day 3: mild expressive aphasia unchanged since admission, swallowing screen passed.', cue: 'Unchanged deficit', why: 'Stable; rehab focus.' },
  // Fluids / metabolic / perfusion
  { tier: 1, sys: 'Fluids', t: 'Glucose 42 mg/dL, diaphoretic and confused.', cue: 'Symptomatic hypoglycemia', why: 'The brain depends on glucose; time-sensitive.' },
  { tier: 2, sys: 'Fluids', t: 'Potassium 3.4 mEq/L; routine replacement ordered; no symptoms, rhythm regular.', cue: 'Mildly low potassium without symptoms', why: 'Important but not immediate.' },
  { tier: 3, sys: 'Fluids', t: 'Stable post-op client needs sequential compression devices applied.', cue: 'SCDs due', why: 'Routine prevention; can be delegated.' },
  { tier: 3, sys: 'Fluids', t: 'Post-op day 2: incisional pain 6/10; scheduled analgesic is due.', cue: 'Scheduled pain medication due', why: 'Important but stable.' },
  { tier: 3, sys: 'Fluids', t: 'Diabetes: needs discharge teaching before going home tomorrow.', cue: 'Discharge teaching', why: 'Teaching waits.' },
  { tier: 1, sys: 'Fluids', t: 'Pancreatitis: increasingly restless, HR 92 → 126, BP 118/72 → 88/54, urine 15 mL/hr.', cue: 'Rising HR with falling BP and urine output (a trend toward shock)', why: 'Becoming unstable; report the trend.' },
  { tier: 1, sys: 'Fluids', t: 'Burn, 40% TBSA, hour 6: urine output 12 mL/hr, HR 128, restless.', cue: 'Urine output far below 0.5 mL/kg/hr during burn resuscitation', why: 'Under-resuscitation; burn shock.' },
  { tier: 2, sys: 'Fluids', t: 'Burn, 20% TBSA, hour 20: arms edematous, urine 45 mL/hr, alert.', cue: 'Edema with adequate urine output', why: 'Edema is expected; perfusion is fine.' },
  { tier: 1, sys: 'Fluids', t: 'Potassium 6.4 mEq/L with peaked T waves on the monitor.', cue: 'Hyperkalemia with ECG changes', why: 'Lethal dysrhythmia risk; calcium gluconate first.' },
  { tier: 1, sys: 'Fluids', t: 'Post-op abdominal surgery: pale, restless, HR 118, BP 96/58, new bright-red drainage.', cue: 'Tachycardia, falling BP and fresh bleeding', why: 'Hemorrhage; early shock.' },
  { tier: 1, sys: 'Fluids', t: 'DKA on an insulin drip for 3 hours: K⁺ now 2.9, muscle cramps, flattened T waves.', cue: 'Potassium plummeting on insulin (the potassium trap)', why: 'Hold or slow insulin per protocol, replace potassium.' },
  { tier: 2, sys: 'Fluids', t: 'DKA on an insulin drip: glucose fell from 520 to 380 in two hours, pH 7.22.', cue: 'Glucose falling as expected', why: 'Expected response; acidosis still resolving.' },
  { tier: 1, sys: 'Fluids', t: 'Heart failure after 1.5 L IV fluid: cannot lie flat, frothy cough, SpO₂ 88%.', cue: 'Frothy cough and orthopnea after IV fluids (pulmonary edema)', why: 'Fluid overload; sit up, oxygen, diuretic.' },
  { tier: 2, sys: 'Fluids', t: 'Heart failure: 1+ ankle edema at end of day, weight stable, lungs clear.', cue: 'Stable mild edema', why: 'Expected, stable.' },
  // Lifespan
  { tier: 1, sys: 'Lifespan', t: 'Infant with bronchiolitis: too tired to feed, fewer wet diapers, worsening retractions.', cue: 'Feeding fatigue with worsening work of breathing in an infant', why: 'Fatigue with feeding is a pediatric red flag; can deteriorate fast.' },
  { tier: 2, sys: 'Lifespan', t: 'Infant with bronchiolitis: mild wheezing, drinking formula normally.', cue: 'Mild wheeze, feeding well', why: 'Feeding well = compensating.' },
  { tier: 2, sys: 'Lifespan', t: 'Toddler: nasal congestion, temp 100.8 °F.', cue: 'Low-grade fever with congestion', why: 'Minor illness.' },
  { tier: 2, sys: 'Lifespan', t: 'Child: fussy but consolable, SpO₂ 95%.', cue: 'Consolable with normal SpO₂', why: 'Stable.' },
  { tier: 1, sys: 'Lifespan', t: '34 weeks pregnant: severe headache, blurred vision, BP 162/104.', cue: 'Severe-range BP with neurologic symptoms (preeclampsia with severe features)', why: 'Risk of seizure or stroke.' },
  { tier: 2, sys: 'Lifespan', t: '28 weeks pregnant: mild ankle edema at the end of the day.', cue: 'Mild dependent edema', why: 'Expected in pregnancy.' },
  { tier: 2, sys: 'Lifespan', t: '20 weeks pregnant: morning nausea, tolerating fluids.', cue: 'Nausea, tolerating fluids', why: 'Expected.' },
  { tier: 2, sys: 'Lifespan', t: '38 weeks pregnant: irregular contractions every 12–15 minutes.', cue: 'Irregular infrequent contractions', why: 'Early/false labor; stable.' },
  { tier: 1, sys: 'Lifespan', t: '12-year-old: vomiting, deep rapid breathing, fruity breath, BP 88/50.', cue: 'Kussmaul breathing with hypotension (DKA with hypovolemia)', why: 'Shock risk; fluids first.' },
  { tier: 3, sys: 'Lifespan', t: 'Teen with new type 1 diabetes: wants to learn to use the insulin pen before discharge.', cue: 'Teaching request', why: 'Teaching waits.' }
];

/* ---------- DELEGATION rounds: what must the RN address? ---------- */
window.DELEGATION = [
  { rn: 'A patient states, "I feel like I can\'t breathe."', why: 'New respiratory complaint needs RN assessment. UAP may report; RN evaluates.', others: ['Take vital signs on a stable client awaiting discharge.', 'Assist a stable client to the bathroom.', 'Feed a stable client without aspiration risk.', 'Apply sequential compression devices to a stable post-op client.', 'Record intake and output for a stable client.', 'Ambulate a stable post-op day 3 client in the hall.'] },
  { rn: 'Evaluate whether IV furosemide relieved a client\'s dyspnea.', why: 'Evaluation of a response to treatment is RN judgment.', others: ['Take vital signs on a stable client awaiting discharge.', 'Reposition a stable client every 2 hours.', 'Empty a urinary drainage bag and record the amount.', 'Provide oral care to a client on aspiration precautions who is alert.'] },
  { rn: 'Teach a newly diagnosed client how to use an inhaler with a spacer.', why: 'Initial teaching is RN scope; UAP may reinforce.', others: ['Take a stable client\'s blood glucose before breakfast.', 'Assist a stable client with a shower.', 'Deliver meal trays and set up a stable client to eat.', 'Weigh a stable client on the standing scale.'] },
  { rn: 'Perform the first neuro check on a client who was just admitted after a head injury.', why: 'Initial and unstable assessments stay with the RN.', others: ['Reapply a bed alarm for a stable client.', 'Transport a stable client to X-ray by wheelchair.', 'Assist a stable client to the bathroom.', 'Stock the linen cart.'] },
  { rn: 'Reassess a burn client whose urine output has dropped to 12 mL/hr.', why: 'A change in status is an RN assessment and escalation.', others: ['Record hourly urine output from a catheter bag.', 'Apply a warm blanket to a stable client.', 'Take vital signs on a stable client every 4 hours.', 'Help a stable client fill out the menu.'] }
];

/* ---------- TREND DETECTIVE templates ----------
   dir: 'up' | 'down' | 'flat'. worse: which direction is bad for this row. */
window.TREND_TEMPLATES = [
  { id: 'hemorrhage', title: 'Post-op abdominal surgery, 0800 → 0830', threat: 'Post-operative hemorrhage / hypovolemic shock', action: 'Focused assessment for bleeding; notify provider; prepare IV access and fluids',
    rows: [
      { t: 'HR', base: [80, 92], dir: 'up', delta: [24, 40], worse: 'up' },
      { t: 'BP', bp: true, base: [118, 130], dir: 'down', delta: [22, 34], worse: 'down' },
      { t: 'RR', base: [16, 18], dir: 'up', delta: [4, 8], worse: 'up' },
      { t: 'Skin', text: ['warm, pink', 'pale, cool'], dir: 'down', worse: 'down' },
      { t: 'Urine output (mL/hr)', base: [40, 55], dir: 'down', delta: [22, 32], worse: 'down' },
      { t: 'SpO₂ (%)', base: [96, 98], dir: 'flat' }
    ] },
  { id: 'burnshock', title: 'Burn resuscitation, hour 2 → hour 4', threat: 'Under-resuscitation: hypovolemia from capillary leak (burn shock)', action: 'Report the trend; anticipate increased fluid rate; hourly urine output; cardiac monitor for potassium',
    rows: [
      { t: 'HR', base: [100, 108], dir: 'up', delta: [18, 28], worse: 'up' },
      { t: 'BP', bp: true, base: [110, 118], dir: 'down', delta: [20, 28], worse: 'down' },
      { t: 'Urine output (mL/hr)', base: [40, 50], dir: 'down', delta: [24, 32], worse: 'down' },
      { t: 'Potassium', dec: 1, base: [4.0, 4.4], dir: 'up', delta: [1.0, 1.6], worse: 'up' },
      { t: 'Hematocrit (%)', base: [42, 44], dir: 'up', delta: [5, 8], worse: 'up' },
      { t: 'Mental status', text: ['alert', 'restless'], dir: 'down', worse: 'down' },
      { t: 'Temp (°F)', dec: 1, base: [98.2, 98.8], dir: 'flat' }
    ] },
  { id: 'sepsis', title: 'Pneumonia on the floor, 1400 → 1800', threat: 'Sepsis progressing to septic shock', action: 'Rapid response; sepsis bundle: cultures, antibiotics within the hour, 30 mL/kg fluids, lactate',
    rows: [
      { t: 'Temp (°F)', dec: 1, base: [100.2, 100.9], dir: 'up', delta: [1.0, 1.8], worse: 'up' },
      { t: 'HR', base: [96, 104], dir: 'up', delta: [18, 26], worse: 'up' },
      { t: 'BP', bp: true, base: [116, 126], dir: 'down', delta: [26, 36], worse: 'down' },
      { t: 'Urine output (mL/hr)', base: [35, 45], dir: 'down', delta: [18, 26], worse: 'down' },
      { t: 'Mental status', text: ['oriented ×4', 'confused'], dir: 'down', worse: 'down' },
      { t: 'Lactate', dec: 1, base: [1.6, 2.0], dir: 'up', delta: [2.2, 3.0], worse: 'up' },
      { t: 'Platelets (k)', base: [220, 260], dir: 'flat' }
    ] },
  { id: 'icp', title: 'Head injury observation, 1230 → 1315', threat: 'Rising intracranial pressure (Cushing\'s triad emerging)', action: 'Activate neuro emergency response; HOB up, head neutral; airway/oxygen; prepare for CT and osmotic therapy',
    rows: [
      { t: 'GCS', base: [14, 15], dir: 'down', delta: [3, 4], worse: 'down' },
      { t: 'Left pupil (mm)', base: [3, 3], dir: 'up', delta: [2, 3], worse: 'up' },
      { t: 'Systolic BP', base: [136, 146], dir: 'up', delta: [22, 32], worse: 'up' },
      { t: 'HR', base: [78, 86], dir: 'down', delta: [24, 34], worse: 'down' },
      { t: 'Respirations', text: ['16, regular', '10, irregular'], dir: 'down', worse: 'down' },
      { t: 'Emesis', text: ['none', 'repeated'], dir: 'down', worse: 'down' },
      { t: 'SpO₂ (%)', base: [96, 98], dir: 'flat' }
    ] },
  { id: 'statusasth', title: 'Asthma in the ED, 1100 → 1230', threat: 'Status asthmaticus (not responding to bronchodilators)', action: 'High-flow oxygen, epinephrine as ordered, prepare for possible intubation; continuous SpO₂',
    rows: [
      { t: 'RR', base: [22, 26], dir: 'up', delta: [10, 14], worse: 'up' },
      { t: 'HR', base: [96, 104], dir: 'up', delta: [22, 30], worse: 'up' },
      { t: 'SpO₂ (%)', base: [93, 95], dir: 'down', delta: [7, 10], worse: 'down' },
      { t: 'Speech', text: ['short phrases', 'single words'], dir: 'down', worse: 'down' },
      { t: 'Wheezing', text: ['loud, expiratory', 'faint (quiet chest)'], dir: 'down', worse: 'down' },
      { t: 'Temp (°F)', dec: 1, base: [98.0, 98.6], dir: 'flat' }
    ] },
  { id: 'neuroshock', title: 'New cervical spinal cord injury, EMS → ED', threat: 'Neurogenic shock (loss of sympathetic tone)', action: 'Maintain alignment; IV fluids and vasopressor as ordered; atropine available; monitor respiratory effort',
    rows: [
      { t: 'BP', bp: true, base: [112, 122], dir: 'down', delta: [28, 38], worse: 'down' },
      { t: 'HR', base: [84, 92], dir: 'down', delta: [34, 44], worse: 'down' },
      { t: 'Skin below injury', text: ['warm, dry', 'warm, dry, flushed'], dir: 'flat' },
      { t: 'Temp (°F)', dec: 1, base: [98.2, 98.6], dir: 'down', delta: [1.0, 1.6], worse: 'down' },
      { t: 'RR', base: [16, 18], dir: 'up', delta: [6, 8], worse: 'up' }
    ] },
  { id: 'benzo', title: 'After IV lorazepam for a seizure, 2140 → 2148', threat: 'Respiratory depression (benzodiazepine + post-ictal state)', action: 'Open the airway (side-lying, jaw thrust), oxygen, bag-mask ready, call for help',
    rows: [
      { t: 'RR', base: [24, 30], dir: 'down', delta: [16, 20], worse: 'down' },
      { t: 'SpO₂ (%)', base: [93, 95], dir: 'down', delta: [5, 8], worse: 'down' },
      { t: 'Response', text: ['seizing', 'unresponsive, snoring'], dir: 'down', worse: 'down' },
      { t: 'HR', base: [124, 136], dir: 'down', delta: [30, 40], worse: 'up' }, // slowing from seizure tachycardia is improvement
      { t: 'Glucose', base: [88, 98], dir: 'flat' }
    ] },
  // Improving templates
  { id: 'asthma_better', title: 'Asthma after nebulizers and steroid, 1130 → 1330', threat: 'Improving: acute asthma responding to treatment', action: 'Continue monitoring; begin teaching (peak flow, inhaler technique); prepare for discharge if sustained',
    rows: [
      { t: 'RR', base: [24, 26], dir: 'down', delta: [6, 8], worse: 'up' },
      { t: 'HR', base: [104, 110], dir: 'down', delta: [16, 22], worse: 'up' },
      { t: 'SpO₂ (%)', base: [90, 92], dir: 'up', delta: [5, 7], worse: 'down' },
      { t: 'Speech', text: ['few words', 'full sentences'], dir: 'up', worse: 'down' },
      { t: 'Temp (°F)', dec: 1, base: [98.2, 98.6], dir: 'flat' }
    ] },
  { id: 'sepsis_better', title: 'Septic shock after fluids and antibiotics, 1120 → 1400', threat: 'Improving: perfusion restored (watch lungs for overload)', action: 'Continue bundle; reassess lungs and urine output hourly; trend lactate',
    rows: [
      { t: 'BP', bp: true, base: [84, 90], dir: 'up', delta: [14, 22], worse: 'down' },
      { t: 'HR', base: [114, 122], dir: 'down', delta: [12, 18], worse: 'up' },
      { t: 'Urine output (mL/hr)', base: [12, 18], dir: 'up', delta: [18, 26], worse: 'down' },
      { t: 'Lactate', dec: 1, base: [4.2, 4.8], dir: 'down', delta: [1.4, 2.0], worse: 'up' },
      { t: 'Mental status', text: ['confused', 'confused'], dir: 'flat' },
      { t: 'Temp (°F)', dec: 1, base: [101.2, 101.8], dir: 'down', delta: [0.8, 1.4], worse: 'up' }
    ] },
  { id: 'overload_better', title: 'Pulmonary edema after IV furosemide, 0715 → 0815', threat: 'Improving: fluid overload responding to diuretic (watch potassium)', action: 'Continue oxygen and monitoring; check potassium; daily weight and I&O',
    rows: [
      { t: 'RR', base: [28, 32], dir: 'down', delta: [6, 10], worse: 'up' },
      { t: 'SpO₂ (%)', base: [87, 89], dir: 'up', delta: [6, 8], worse: 'down' },
      { t: 'Urine output (mL/hr)', base: [25, 35], dir: 'up', delta: [400, 600], worse: 'down' },
      { t: 'Crackles', text: ['bases to mid-fields', 'bases only'], dir: 'up', worse: 'down' },
      { t: 'Potassium', dec: 1, base: [3.9, 4.2], dir: 'down', delta: [0.6, 0.9], worse: 'down' },
      { t: 'Leg edema', text: ['2+', '2+'], dir: 'flat' }
    ] },
  { id: 'dka_mixed', title: 'DKA on insulin drip, hour 0 → hour 3', threat: 'Improving acidosis, but potassium is falling (the potassium trap)', action: 'Replace potassium as ordered once urine output is adequate; add dextrose when glucose nears 250; continue insulin',
    rows: [
      { t: 'pH', dec: 2, base: [7.12, 7.18], dir: 'up', delta: [0.10, 0.16], worse: 'down' },
      { t: 'HCO₃⁻', base: [10, 13], dir: 'up', delta: [4, 6], worse: 'down' },
      { t: 'Glucose', base: [480, 540], dir: 'down', delta: [180, 240], worse: 'up' },
      { t: 'Potassium', dec: 1, base: [5.2, 5.6], dir: 'down', delta: [2.0, 2.5], worse: 'down' },
      { t: 'HR', base: [128, 138], dir: 'down', delta: [22, 30], worse: 'up' },
      { t: 'Temp (°F)', dec: 1, base: [98.4, 99.0], dir: 'flat' }
    ] }
];

/* ---------- ABG DECODER ---------- */
window.ABG = {
  disorders: [
    { id: 'ra', name: 'Respiratory acidosis', causes: ['COPD exacerbation with CO₂ retention', 'Opioid or benzodiazepine over-sedation (hypoventilation)', 'Status asthmaticus with respiratory muscle fatigue', 'High cervical spinal cord injury weakening breathing'], action: 'Improve ventilation: sit up, stimulate, support breathing (bag-mask, BiPAP or intubation as ordered); check level of consciousness; trend ABGs', tip: 'Hypoventilation traps CO₂. CO₂ is an acid.' },
    { id: 'rk', name: 'Respiratory alkalosis', causes: ['Anxiety or pain with hyperventilation', 'Early pulmonary embolism', 'Early ARDS or early sepsis', 'Mechanical ventilator rate set too high'], action: 'Find the cause of the fast breathing: treat pain, anxiety or hypoxia; coach slow breathing; check for PE or sepsis', tip: 'Hyperventilation blows off CO₂. Losing acid = alkalosis.' },
    { id: 'ma', name: 'Metabolic acidosis', causes: ['Diabetic ketoacidosis', 'Septic shock with lactate build-up', 'Renal failure', 'Severe diarrhea (bicarbonate loss)'], action: 'Treat the cause: fluids and insulin for DKA, fluids and antibiotics for sepsis; monitor potassium and cardiac rhythm; watch for Kussmaul breathing', tip: 'Too much acid or too little bicarbonate. Lungs compensate by breathing deep and fast.' },
    { id: 'mk', name: 'Metabolic alkalosis', causes: ['Prolonged vomiting or NG suction (acid loss)', 'Loop diuretic use (furosemide)', 'Excess antacid or bicarbonate intake', 'Hypokalemia'], action: 'Stop the loss (antiemetics, review diuretics); replace fluids, potassium and chloride as ordered; monitor for shallow breathing', tip: 'Losing acid (vomiting) or gaining base. Lungs compensate by breathing slow and shallow.' }
  ]
};

/* ---------- RHYME & REASON deck ---------- */
window.RHYMES = [
  { cat: 'The Model', front: 'The six steps of the Clinical Judgment Measurement Model', back: 'Recognize → Analyze → Prioritize → Generate → Take action → Evaluate.\n\nRhyme: "Really Anxious Patients Get Treated Early."', tip: 'Every NGN case study asks exactly these six questions, in this order.' },
  { cat: 'The Model', front: 'Recognize cues', back: '"What\'s new, what\'s changed, what\'s worse than before? That\'s the cue you can\'t ignore."', tip: 'Compare to THIS patient\'s baseline, not the textbook.' },
  { cat: 'The Model', front: 'Analyze cues', back: '"Cues that cluster tell a story. Group them up before you worry."', tip: 'HR up + BP down + urine down = one story: perfusion.' },
  { cat: 'The Model', front: 'Prioritize hypotheses', back: '"Not the most likely, the most deadly first. Ask: which one gets me the worst?"', tip: 'The worst reasonable explanation wins.' },
  { cat: 'The Model', front: 'Generate solutions', back: '"List every fix that fits the threat, then cross out what makes things worse yet."', tip: 'NGN loves to hide one harmful option in the list.' },
  { cat: 'The Model', front: 'Take action', back: '"Do what dies first if delayed: airway, breathing, then the aid."', tip: 'Ask: what becomes unsafe if I wait 30 minutes?' },
  { cat: 'The Model', front: 'Evaluate outcomes', back: '"An action\'s not done till you look again: better, worse, or same, and then?"', tip: 'Compare to the previous value, not to normal. Watch for the side effect of what you did.' },
  { cat: 'Priority', front: 'The priority lens (5 questions)', back: '1. Who could deteriorate if I wait?\n2. What is new, unexpected, or worsening?\n3. Stable or unstable?\n4. Is there an immediate physiologic or safety threat?\n5. What must happen now?', tip: 'Priority = what becomes unsafe when delayed.' },
  { cat: 'Priority', front: 'Expected vs unexpected', back: '"Abnormal is not urgent. CHANGE is urgent."\n\nA COPD client at 89% is expected. A healthy 20-year-old at 89% is an emergency.', tip: 'Four patients with bad vitals? Pick the one with the unexpected complication.' },
  { cat: 'Priority', front: 'Who dies first?', back: 'ABCs → unstable beats stable → new beats chronic → acute change beats abnormal-but-expected → physiologic beats psychosocial beats teaching.', tip: 'Then name the cue that made it the priority.' },
  { cat: 'Priority', front: 'Delegation', back: '"Assess, Teach, Evaluate, Unstable: stays on the RN\'s table."\n\nUAP may report; the RN must evaluate.', tip: 'Any new complaint of "I can\'t breathe" is RN business.' },
  { cat: 'Priority', front: 'SBAR', back: 'Situation, Background, Assessment, Recommendation.\n\n"Report the TREND, not just the number."', tip: '"HR 92 to 126, BP 118/72 to 88/54, urine 15 mL/hr. Please evaluate now."' },
  { cat: 'Respiratory', front: 'ABG: ROME', back: 'Respiratory = Opposite (pH down, CO₂ up).\nMetabolic = Equal (pH down, HCO₃ down).', tip: 'pH 7.35–7.45 · PaCO₂ 35–45 · HCO₃ 22–26 · PaO₂ 80–100' },
  { cat: 'Respiratory', front: 'Compensation', back: 'Uncompensated: pH abnormal, the other system normal.\nPartial: pH abnormal, both systems abnormal.\nFull: pH normal, both systems abnormal.', tip: 'The kidneys are slow (days); the lungs are fast (minutes).' },
  { cat: 'Respiratory', front: 'COPD oxygen target', back: '"88 to 92 is the O₂ for you."\n\nToo much oxygen blunts the hypoxic drive and CO₂ climbs.', tip: 'Never titrate a COPD client to 95%+.' },
  { cat: 'Respiratory', front: 'Asthma danger sign', back: '"When the wheeze goes quiet, it\'s violent."\n\nA silent chest means no air is moving. Status asthmaticus.', tip: 'High-flow O₂, epinephrine, prepare to intubate.' },
  { cat: 'Respiratory', front: 'Asthma medications to avoid', back: 'Beta-blockers (block beta-2 in the lungs), NSAIDs and aspirin (bronchospasm).', tip: '"Labetalol and ibuprofen make the asthmatic\'s airway tighten."' },
  { cat: 'Respiratory', front: 'Pulmonary embolism', back: '"Sudden, sharp, and short of breath; a post-op clot can cause death."\n\nSudden dyspnea, pleuritic pain, hemoptysis, anxiety, tachycardia, swollen calf.', tip: 'ABG: respiratory alkalosis with hypoxemia. Never massage the calf.' },
  { cat: 'Respiratory', front: 'ARDS', back: 'Refractory hypoxemia: oxygen does not fix it.\nEarly ABG: respiratory alkalosis. Late: respiratory acidosis.', tip: 'Prone positioning, ventilation, treat the cause.' },
  { cat: 'Respiratory', front: 'TB: RIPE', back: 'Rifampin (orange fluids, liver), Isoniazid (neuropathy: give B6, liver), Pyrazinamide (gout, liver), Ethambutol (eyes: vision, red-green).', tip: 'Airborne precautions; direct observation therapy.' },
  { cat: 'Respiratory', front: 'Secretions', back: '"If it sits, it either clots or cultures."\n\nTurn, cough, deep breathe, incentive spirometer, fluids, ambulate.', tip: 'Never give a cough suppressant to a client with a productive infected cough.' },
  { cat: 'Neuro', front: 'Cushing\'s triad', back: '"Pressure HIGH, pulse LOW, breathing WEIRD."\n\nWidening pulse pressure, bradycardia, irregular respirations. A LATE sign of rising ICP.', tip: 'Earliest sign of ICP: a change in level of consciousness.' },
  { cat: 'Neuro', front: 'Things that raise ICP', back: 'Suctioning, coughing, Valsalva, hip flexion, lying flat, neck rotation, hypoxia, hypercapnia, pain, fever.', tip: 'HOB up 30°, head midline, oxygenate, keep calm.' },
  { cat: 'Neuro', front: 'Focal vs global', back: 'FOCAL (one side, one function) = stroke territory: face droop, arm drift, aphasia.\nGLOBAL (whole brain) = pressure: LOC down, pupils unequal, vomiting, new seizure, odd breathing.', tip: 'Focal → stroke pathway. Global → ICP pathway.' },
  { cat: 'Neuro', front: 'Stroke first minutes', back: '"Sugar, then scan, then the plan."\n\nGlucose (mimic), NPO, non-contrast CT (bleed vs clot), activate the team. NO aspirin before the CT.', tip: 'Thrombolysis BP threshold: below 185/110. Do not over-lower.' },
  { cat: 'Neuro', front: 'Decline during alteplase', back: '"Stop. Escalate. Stabilize. Confirm."\n\nAcute decline after thrombolysis is hemorrhage until excluded.', tip: 'Stop the drip, call the team, protect the airway, get the CT.' },
  { cat: 'Neuro', front: 'Hematoma patterns', back: 'EPIDURAL: lucid interval, then rapid decline (arterial).\nSUBDURAL: slow, over hours to days, anticoagulated older adult.\nINTRACEREBRAL: hypertension, headache, vomiting, weakness.', tip: '"Epi = quick, Sub = slow."' },
  { cat: 'Neuro', front: 'Spinal vs neurogenic shock', back: 'SPINAL shock: the NERVES go flat (flaccid, areflexic, resolves when reflexes return).\nNEUROGENIC shock: the PRESSURE goes flat (low BP, low HR, warm dry skin; T6 or above).', tip: 'Both can happen at once. Neurogenic needs circulatory support now.' },
  { cat: 'Neuro', front: 'Autonomic dysreflexia', back: '"SIT up, LOOSEN, DRAIN the trigger, RECHECK the pressure."\n\nTrigger below the injury (bladder first, then bowel, then skin) → BP skyrockets, pounding headache, flushed above, pale below.', tip: 'Never lay them flat. Injury at T6 or above.' },
  { cat: 'Neuro', front: 'After the seizure', back: '"After the benzo, the breathing is the danger."\n\nSide-lying, jaw thrust, oxygen, bag-mask ready. Nothing in the mouth.', tip: 'Expected post-ictal: sleepy but arousable. Unexpected: RR 8, SpO₂ 88%.' },
  { cat: 'Fluids', front: 'Tonicity', back: '"HYPO → IN → SWELL. HYPER → OUT → SHRINK. ISO → EVEN → SAME."', tip: 'Water moves toward the greater solute concentration.' },
  { cat: 'Fluids', front: 'Electrolyte jobs', back: 'Na = WATER + BRAIN.\nK = HEART + MUSCLE.\nCa = NERVES + MUSCLES.\nMg = RHYTHM + REFLEXES.\nPhosphate = ATP + STRENGTH.', tip: 'Forget the list? Start with what the electrolyte does.' },
  { cat: 'Fluids', front: 'Deficit vs excess', back: 'DEFICIT = dry and fast: tachycardia, orthostasis, low urine, weight down, tenting.\nEXCESS = wet and heavy: crackles, weight up, edema, JVD, orthopnea.', tip: 'Daily weight is the best single measure. 1 kg = 1 liter.' },
  { cat: 'Fluids', front: 'Rule of Nines', back: '"9 head, 9 each arm, 18 front, 18 back, 18 each leg, 1 down below."\n\nCount partial- and full-thickness only. Palm ≈ 1%.', tip: 'Anterior arm = 4.5%. Anterior leg = 9%.' },
  { cat: 'Fluids', front: 'Parkland formula', back: '4 mL × kg × %TBSA over 24 h (lactated Ringer\'s).\nHalf in the first 8 hours FROM THE TIME OF THE BURN, the rest over 16 h.', tip: 'Goal: urine 0.5 mL/kg/hr (about 30–50 mL/hr). The formula is a start; urine output is the truth.' },
  { cat: 'Fluids', front: 'The burn paradox', back: '"Swollen outside, empty inside."\n\nCapillary leak moves fluid into the tissues. Edema does NOT mean the vessels are full.', tip: 'Hct rises as plasma leaves. K⁺ rises from cell damage.' },
  { cat: 'Fluids', front: 'Burn pain and depth', back: 'Full-thickness can hurt LESS (nerves destroyed). Never judge severity by pain.', tip: 'Face, hands, feet, perineum, joints, and inhalation raise the stakes.' },
  { cat: 'Fluids', front: 'DKA sequence', back: '"FLUIDS first, INSULIN second, then watch the POTASSIUM plummet."\n\nAdd potassium once K⁺ falls and urine flows. If K⁺ < 3.3 at the start, potassium BEFORE insulin.', tip: 'Endpoint is the pH, not the glucose. Add dextrose near 250.' },
  { cat: 'Fluids', front: 'Hyperkalemia with ECG changes', back: '"Calcium to protect, insulin + dextrose to shift, then remove."\n\nPeaked T waves → calcium gluconate first.', tip: 'K = HEART.' },
  { cat: 'Fluids', front: 'Sepsis', back: '"HOT and FAST, then LOW and SLOW to pee. Lactate ≥ 4 with low BP: septic shock, you see."', tip: 'Cultures → antibiotics within the hour → 30 mL/kg fluids → pressors if still low.' },
  { cat: 'Fluids', front: 'Hypoglycemia', back: '"Cold and clammy, need some candy. Hot and dry, sugar high."', tip: 'Symptomatic hypoglycemia beats almost everything on the priority list.' },
  { cat: 'Lifespan', front: 'Older adult red flag', back: '"New confusion is never just aging."\n\nDelirium = infection, hypoxia, dehydration, or a medication until proven otherwise.', tip: 'Atypical presentation: no fever, no pain, just "not herself."' },
  { cat: 'Lifespan', front: 'Pediatric red flags', back: 'Feeding, behavior, work of breathing, wet diapers.\n\n"Too tired to feed is too tired to breathe."', tip: 'Fewer wet diapers = dehydration.' },
  { cat: 'Lifespan', front: 'Preeclampsia with severe features', back: 'BP ≥ 160/110 + headache, blurred vision, epigastric pain. Risk: seizure (eclampsia), stroke.', tip: '"Pair the symptom with the complication it may signal."' }
];

/* ---------- QUICK FIRE (from the Week 1 Kahoot; answers as the instructor marked them) ---------- */
window.QUICKFIRE = [
  { q: 'A client with a brain tumor has restlessness, increased drowsiness and agitation. What actions should the nurse take now? Select the 2 that apply.', multi: true, options: [
    { t: 'Maintain the body in a neutral position', ok: true, why: 'Head midline promotes venous drainage from the brain.' },
    { t: 'Hyperventilate the client', ok: true, why: 'Lowers CO₂ briefly, constricting cerebral vessels (a short-term rescue measure, as taught in class).' },
    { t: 'Place the client supine', ok: false, why: 'Flat raises ICP.' },
    { t: 'Ensure cerebral perfusion pressure is less than 70 mmHg', ok: false, why: 'Backwards: keep CPP adequate (about 60–70+).' },
    { t: 'Suction the client for at least 20 seconds', ok: false, why: 'Prolonged suctioning spikes ICP; limit to 10–15 seconds.' },
    { t: 'Administer a rapid IV bolus', ok: false, why: 'Sudden volume can raise ICP.' } ],
    rationale: 'Restless, drowsier, agitated = rising ICP. Protect drainage (neutral head), avoid anything that spikes pressure, and use the rescue measures the team orders.' },
  { q: 'PACU client: HR 115, RR 20, temp 97.2, BP 84/50. What should the nurse do first?', options: [
    { t: 'Assess for bleeding', ok: true, why: 'Fast heart + low pressure after surgery = hemorrhage until proven otherwise. Assess, then act.' },
    { t: 'Notify the provider', ok: false, why: 'You need the assessment to report.' },
    { t: 'Increase the rate of IV fluids', ok: false, why: 'Treats the number, not the cause.' },
    { t: 'Review the pre-op vital signs', ok: false, why: 'Useful context, not the first action.' } ],
    rationale: 'Nursing process: assess before you intervene. The likely cause of post-op tachycardia with hypotension is bleeding.' },
  { q: 'A client with type 1 diabetes had a splenectomy and is in the PACU. Which actions should the nurse take? Select the 2 that apply.', multi: true, options: [
    { t: 'Monitor the client\'s glucose levels', ok: true, why: 'Surgical stress and NPO status swing glucose both ways.' },
    { t: 'Maintain an intact dressing on the surgical site', ok: true, why: 'Bleeding risk after splenectomy.' },
    { t: 'Administer a bolus of IV dextrose', ok: false, why: 'No hypoglycemia identified.' },
    { t: 'Have the client eat a snack after awakening', ok: false, why: 'NPO until bowel function and swallowing are safe.' },
    { t: 'Ask about usual diabetes management', ok: false, why: 'Later; not a PACU priority.' },
    { t: 'Give orange juice when awake', ok: false, why: 'Not without a glucose reading and diet order.' } ],
    rationale: 'In PACU: monitor what the surgery and the disease can change (glucose, bleeding). Teaching and food wait.' },
  { q: 'Coronary artery disease: which data indicates a DECREASE in cardiac output?', options: [
    { t: 'Disorientation and 20 mL urine output over the last 2 hours', ok: true, why: 'Brain and kidneys are the first organs to show poor forward flow.' },
    { t: 'BP 108/60, ascites, crackles', ok: false, why: 'Congestion (backward failure), not output.' },
    { t: 'Reduced pulse pressure and heart murmur', ok: false, why: 'Suggestive but not the best evidence.' },
    { t: 'Jugular vein distention and postural BP changes', ok: false, why: 'Volume status, not output.' } ],
    rationale: 'Low cardiac output shows up where perfusion matters most: mental status and urine output.' },
  { q: 'A client is actively bleeding from esophageal varices. Which medication would the nurse MOST expect to be given?', options: [
    { t: 'Octreotide', ok: true, why: 'Reduces portal pressure to slow variceal bleeding.' },
    { t: 'Propranolol', ok: false, why: 'Prevents bleeding long term; not for an active bleed.' },
    { t: 'Spironolactone', ok: false, why: 'For ascites.' },
    { t: 'Lactulose', ok: false, why: 'For hepatic encephalopathy.' } ],
    rationale: '"Active bleed → octreotide. Prevent the bleed → propranolol."' },
  { q: 'A client with AIDS has a decreased appetite and is almost anorexic. What is the best action by the nurse?', options: [
    { t: 'Administer megestrol acetate', ok: true, why: 'An appetite stimulant treats the physiologic problem.' },
    { t: 'Ask the family to bring in foods the client enjoys', ok: false, why: 'Helpful, but does not fix anorexia.' },
    { t: 'Have the dietitian prepare favorite meals', ok: false, why: 'Same.' },
    { t: 'Talk with the client about the unwillingness to eat', ok: false, why: 'Assumes a choice; this is physiologic.' } ],
    rationale: 'When the cause is physiologic (disease-related anorexia), the best action targets the physiology.' },
  { q: 'Which client should be assessed first?', options: [
    { t: '85-year-old with COPD, increased wheezing, SpO₂ 89% on 2 L', ok: true, why: 'INCREASED wheezing is a change. The 89% alone would be expected; the change is not.' },
    { t: '62-year-old with emphysema who has 500 mL left in the IV bag', ok: false, why: 'Routine.' },
    { t: '74-year-old with chronic bronchitis, BP 128/58, HR 104, RR 26', ok: false, why: 'Mildly abnormal but stable for the disease.' },
    { t: '86-year-old admitted 30 minutes ago awaiting admission assessment', ok: false, why: 'Important, but no cue of instability.' } ],
    rationale: 'Expected vs unexpected: a COPD client at 89% is expected, but "increased wheezing" is a worsening trend. Change beats abnormal.' },
  { q: 'Teaching a parent of a child with cystic fibrosis when to perform chest physiotherapy. Which is correct?', options: [
    { t: 'Before meals', ok: true, why: 'Clears mucus before eating; avoids vomiting a full stomach.' },
    { t: 'Thirty minutes after meals', ok: false, why: 'Risk of vomiting.' },
    { t: 'During episodes of bronchospasm', ok: false, why: 'Worsens the spasm.' },
    { t: 'Immediately after exercise', ok: false, why: 'Not the standard timing.' } ],
    rationale: '"Clear the chest, then eat the rest."' },
  { q: 'A client at 30 weeks reports painless bright-red vaginal bleeding. What should the nurse do first?', options: [
    { t: 'Assess fetal heart rate', ok: true, why: 'Painless bright-red bleeding = placenta previa; check the fetus first.' },
    { t: 'Perform a vaginal exam', ok: false, why: 'NEVER with suspected previa: can tear the placenta.' },
    { t: 'Encourage ambulation', ok: false, why: 'Bed rest.' },
    { t: 'Apply a heating pad', ok: false, why: 'No.' } ],
    rationale: '"Painless and bright: previa. No fingers, no exam, check the heartbeat first."' },
  { q: 'A client with schizophrenia says, "The voices are now louder. I might do what they say." What should the nurse do first?', options: [
    { t: 'Ask what the voices are directing the client to do', ok: true, why: 'Assess the content: is it a command to harm self or others?' },
    { t: 'Move the client to a quiet area', ok: false, why: 'After assessing the danger.' },
    { t: 'Administer the PRN antipsychotic', ok: false, why: 'After assessment.' },
    { t: 'Notify the provider of the change', ok: false, why: 'You need to know what to report.' } ],
    rationale: 'Assess before you act: command hallucinations change the safety plan.' }
];

/* Extra Who-first cards from the Kahoot and Week 1 cases */
window.WHO_FIRST.push(
  { tier: 1, sys: 'Resp', t: '85-year-old with COPD: increased wheezing, SpO₂ 89% on 2 L.', cue: 'Increased wheezing (a worsening trend) in a COPD client', why: 'The 89% is expected; the increase in wheezing is the change.' },
  { tier: 3, sys: 'Resp', t: '62-year-old with emphysema who has 500 mL of IV fluid left in the bag.', cue: 'IV bag running low', why: 'Routine task; can be delegated or done later.' },
  { tier: 2, sys: 'Resp', t: '74-year-old with chronic bronchitis: BP 128/58, HR 104, RR 26.', cue: 'Mildly elevated HR and RR, stable', why: 'Abnormal but stable for the disease.' },
  { tier: 3, sys: 'Resp', t: '86-year-old admitted 30 minutes ago, awaiting the admission assessment.', cue: 'Admission assessment pending', why: 'Needs doing, but no cue of instability yet.' },
  { tier: 1, sys: 'Fluids', t: 'Post-op day 4 colectomy: temp 101.8 °F, HR 118, abdomen distended and diffusely tender, urine 25 mL/hr.', cue: 'Fever with new diffuse abdominal tenderness and falling urine output after bowel surgery', why: 'Anastomotic leak until proven otherwise; sepsis risk.' },
  { tier: 1, sys: 'Fluids', t: 'PACU client: HR 115, BP 84/50, temp 97.2 °F.', cue: 'Post-op tachycardia with hypotension', why: 'Bleeding until proven otherwise.' },
  { tier: 1, sys: 'Neuro', t: 'Stroke client with dysphagia: continuous tube feeding running, head of bed at 15°, coughing, SpO₂ 90%.', cue: 'Coughing with a falling SpO₂ during tube feeding at a low head-of-bed angle', why: 'Aspiration; stop the feeding and sit up.' },
  { tier: 1, sys: 'Lifespan', t: '30 weeks pregnant: painless bright-red vaginal bleeding.', cue: 'Painless bright-red bleeding in the third trimester (placenta previa)', why: 'Check fetal heart rate; no vaginal exam.' },
  { tier: 1, sys: 'Trauma', t: 'Femur fracture after a car crash: HR 132, BP 86/52, thigh swelling increasing, no urine output.', cue: 'Tachycardia and hypotension with a swelling thigh', why: 'Hidden hemorrhage into the thigh.' }
);

/* Extra rhymes from the new material */
window.RHYMES.push(
  { cat: 'Priority', front: 'The A-to-I primary survey', back: 'Airway · Breathing · Circulation · Disability · Exposure · Full vitals & Family · Give comfort · Head-to-toe · Inspect the back.\n\n"A-B-C-D-E, then F-G-H-I: fix what kills, then find the rest."', tip: 'Disability = neuro check, AVPU, pupils, glucose.' },
  { cat: 'Priority', front: 'Seven prioritization frameworks', back: 'ABCs · Nursing process (assess before you act) · Least restrictive/least invasive · Stable vs unstable · Acute vs chronic · Maslow · Safety and risk reduction.', tip: 'When two answers both look right, ask which framework the question is testing.' },
  { cat: 'Priority', front: 'Assess before you act', back: '"Numbers say something is wrong; assessment says what. Look before you treat."\n\nPACU HR 115, BP 84/50 → assess for bleeding before calling or bolusing.', tip: 'Exception: an obvious airway or cardiac arrest gets action first.' },
  { cat: 'Neuro', front: 'ICP: what the nurse controls at the bedside', back: 'Head neutral and up · no hip flexion · suction ≤ 10–15 seconds · no rapid boluses · quiet room · treat fever and pain.', tip: '"Neutral, not supine. Short suction, slow fluids."' },
  { cat: 'Fluids', front: 'Hidden bleeding', back: '"A femur can hide a liter; a belly can hide more."\n\nFast heart + low pressure + no urine = hypovolemia. Fill the tank before the morphine.', tip: 'Morphine on an empty tank drops the pressure further.' },
  { cat: 'Fluids', front: 'Perfusion scorecard', back: 'MAP ≥ 65 · urine ≥ 0.5 mL/kg/hr · lactate falling · mentation clearing.\n\nFever and WBC track infection. SpO₂ tracks oxygenation. Do not mix the scorecards.', tip: 'Evaluate the outcome that matches the problem.' },
  { cat: 'Neuro', front: 'Meds through a feeding tube', back: '"One at a time, flush between; never crush ER, DR, or enteric-coated."\n\nCheck placement first, head up during and after, hold the beta-blocker if HR < 60.', tip: 'Subcutaneous insulin is not affected by NPO.' },
  { cat: 'Lifespan', front: 'Placenta previa', back: '"Painless and bright: previa. No fingers, no exam, check the heartbeat first."', tip: 'Abruption is painful with a rigid uterus.' },
  { cat: 'Respiratory', front: 'Cystic fibrosis chest physiotherapy', back: '"Clear the chest, then eat the rest": before meals, never during bronchospasm.', tip: '' },
  { cat: 'Fluids', front: 'Variceal bleeding', back: '"Active bleed → octreotide. Prevent the bleed → propranolol. Ammonia → lactulose. Ascites → spironolactone."', tip: 'Match the drug to the liver problem.' },
  { cat: 'Fluids', front: 'Low cardiac output', back: 'Shows up where perfusion matters most: confusion and a dry catheter bag.\n\n"Brain and kidneys tell on the heart."', tip: 'Crackles and JVD are congestion, a different story.' }
);

/* ---------- Source tagging (which material each item came from; drives the Focus setting) ----------
   'general' = framework/heuristic material that applies to every focus. */
(function () {
  const PRI = 'Complex Care Prioritization: Practical Examples', NEURO = 'Complex Cases: Neurological Conditions', BURNS = 'Burns, Fluids & Electrolytes', KAHOOT = 'Week 1 Kahoot', W1 = 'NGN Case Studies Week 1', RESP = 'Case Study – Respiratory Disorders (with answers)', ACID = 'Acid-Base Reference Sheet', ATOI = 'From Assessment to Action: Prioritization Matters';
  const wf = window.WHO_FIRST;
  wf.forEach((x, i) => { if (x.source) return; if (i >= 50) { x.source = [KAHOOT, KAHOOT, KAHOOT, KAHOOT, W1, KAHOOT, W1, KAHOOT, W1][i - 50] || PRI; return; } x.source = x.sys === 'Neuro' ? NEURO : x.sys === 'Fluids' ? BURNS : PRI; });
  window.DELEGATION.forEach(d => d.source = d.source || PRI);
  const T = { hemorrhage: PRI, burnshock: BURNS, sepsis: 'general', icp: NEURO, statusasth: RESP, neuroshock: NEURO, benzo: NEURO, asthma_better: RESP, sepsis_better: 'general', overload_better: 'general', dka_mixed: 'general' };
  window.TREND_TEMPLATES.forEach(t => t.source = t.source || T[t.id] || 'general');
  window.QUICKFIRE.forEach(q => q.source = q.source || KAHOOT);
  window.RHYMES.forEach((r, i) => { if (r.source) return; if (r.cat === 'The Model') r.source = 'general'; else if (r.cat === 'Priority') r.source = i >= 44 ? ATOI : PRI; else if (r.cat === 'Respiratory') r.source = /ABG|Compensation/.test(r.front) ? ACID : RESP; else if (r.cat === 'Neuro') r.source = NEURO; else if (r.cat === 'Fluids') r.source = i >= 44 ? W1 : BURNS; else r.source = PRI; });
})();
