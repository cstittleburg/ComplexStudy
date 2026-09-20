/* Burns, fluids & electrolytes, sepsis, and lifespan cases — from the Week 1 Burns/F&E deck,
   the prioritization deck, the respiratory lecture (septic shock), and the Gemini DKA walkthrough. */
window.CASES = window.CASES || [];

window.CASES.push({
  id: 'fe-burn',
  title: 'Swollen but empty: the burn patient',
  system: 'Burns / Fluids',
  setting: 'Burn Unit',
  patient: { sex: 'M', ageRange: [28, 55] },
  hook: 'Parkland: 4 × kg × %TBSA. Half in the first 8 hours FROM THE TIME OF THE BURN. Swollen outside can still be empty inside.',
  tagline: 'Coming on shift: 36% TBSA, and the urine output is falling.',
  chart: {
    profile: 'Weight 70 kg. House fire at 1200, rescued from an enclosed room. Partial- and full-thickness burns to both anterior arms, anterior trunk, and anterior left leg. Singed nasal hair, hoarse voice. Two large-bore IVs; lactated Ringer\'s running per protocol.',
    notes: [{ time: '1400', text: 'Alert, oriented. Reports pain 8/10. Edema developing in both arms. Hoarse voice, carbonaceous sputum.' }],
    vitals: { cols: ['1400'], rows: [['HR', '104'], ['BP', '112/72'], ['RR', '22'], ['SpO₂', '96%'], ['Urine output', '45 mL/hr'], ['Mental status', 'Alert']] },
    labs: [['K⁺ (1400)', '4.2', '3.5–5.0'], ['Hct (1400)', '43%', '42–52%']]
  },
  items: [
    { step: 'recognize', type: 'cloze',
      prompt: 'Estimate the burn using the adult Rule of Nines (count partial- and full-thickness only). Complete the calculation.',
      parts: ['Both anterior arms = ', { options: ['4.5% + 4.5% = 9%', '9% + 9% = 18%', '1% + 1% = 2%'], ans: 0 }, '; anterior trunk = ', { options: ['9%', '18%', '36%'], ans: 1 }, '; anterior left leg = ', { options: ['4.5%', '9%', '18%'], ans: 1 }, '. Total TBSA = ', { options: ['27%', '36%', '45%'], ans: 1 }, '.'],
      rationale: 'Rule of Nines: head/neck 9, each arm 9, anterior trunk 18, posterior trunk 18, each leg 18, perineum 1. "Anterior" halves each limb value. 9 + 18 + 9 = 36% TBSA. Superficial burns are not counted.' },
    { step: 'analyze', type: 'trend',
      chart: { notes: [{ time: '1600', text: 'Restless, pulling at IV lines. Arms markedly swollen. Urine dark amber.' }], vitals: { cols: ['1600'], rows: [['HR', '126'], ['BP', '88/54'], ['RR', '28'], ['SpO₂', '92%'], ['Urine output', '18 mL/hr'], ['Mental status', 'Restless']] }, labs: [['K⁺ (1600)', '5.6', '3.5–5.0'], ['Hct (1600)', '50%', '42–52%']] },
      prompt: 'Compare 1400 to 1600. For each row: improved, declined, or unchanged?',
      rows: [
        { t: 'Heart rate', before: '104', after: '126', ans: 'declined', why: 'Compensating for low volume.' },
        { t: 'Blood pressure', before: '112/72', after: '88/54', ans: 'declined', why: 'Hypotension: compensation failing.' },
        { t: 'Respirations', before: '22', after: '28', ans: 'declined', why: 'Possible inhalation injury plus acidosis.' },
        { t: 'SpO₂', before: '96%', after: '92%', ans: 'declined', why: 'Airway swelling / inhalation injury.' },
        { t: 'Urine output', before: '45 mL/hr', after: '18 mL/hr', ans: 'declined', why: 'Below 0.5 mL/kg/hr (35 mL/hr for 70 kg).' },
        { t: 'Potassium', before: '4.2', after: '5.6', ans: 'declined', why: 'Cell lysis releases K⁺; cardiac risk.' },
        { t: 'Hematocrit', before: '43%', after: '50%', ans: 'declined', why: 'Hemoconcentration: plasma has left the vessels.' },
        { t: 'Mental status', before: 'Alert', after: 'Restless', ans: 'declined', why: 'Early sign of poor cerebral perfusion or hypoxia.' }
      ],
      rationale: 'Every row moves the same direction. Group them: HR up + BP down + urine down + restlessness = worsening perfusion (burn shock). Rising hematocrit proves plasma left the vessels. K⁺ 5.6 has cardiac implications. The respiratory trend needs its own reassessment.' },
    { step: 'prioritize', type: 'cloze',
      prompt: 'Complete the sentence.',
      parts: ['The trend most likely indicates ', { options: ['hypovolemia from capillary leak (burn shock)', 'fluid overload from resuscitation', 'sepsis from wound infection', 'opioid over-sedation'], ans: 0 }, '; the paradox is that ', { options: ['the client looks swollen while the vessels are empty', 'the client looks dry while the vessels are full', 'urine output rises as BP falls'], ans: 0 }, '.'],
      rationale: 'Major burn → inflammation → capillary permeability → fluid and protein leak into the interstitial space → edema PLUS reduced circulating volume → poor perfusion. The fluid moved to the wrong compartment. Edema never means adequate intravascular volume.' },
    { step: 'generate', type: 'cloze',
      prompt: 'The provider confirms the Parkland formula. Complete the calculation (70 kg, 36% TBSA, burn at 1200).',
      parts: ['Total for the first 24 hours = 4 mL × 70 × 36 = ', { options: ['5,040 mL', '10,080 mL', '20,160 mL'], ans: 1 }, '. Half of that (', { options: ['2,520 mL', '5,040 mL', '10,080 mL'], ans: 1 }, ') is due by ', { options: ['2000 (8 hours after the burn)', '2200 (8 hours after admission)', '1200 tomorrow'], ans: 0 }, '. The adult urine output target is about ', { options: ['0.5 mL/kg/hr (35 mL/hr for 70 kg)', '2 mL/kg/hr', '10 mL/hr'], ans: 0 }, '.'],
      rationale: '4 × 70 × 36 = 10,080 mL of lactated Ringer\'s in 24 hours; 5,040 mL in the first 8 hours counted from the TIME OF THE BURN (1200), so by 2000. The formula is a starting estimate; urine output tells you whether it is working.' },
    { step: 'action', type: 'sata', n: 4,
      prompt: 'At 1600, which are the priority nursing actions? Select the 4 that apply.',
      options: [
        { t: 'Reassess airway: hoarseness, stridor, work of breathing; notify provider of SpO₂ 92% and RR 28', ok: true, why: 'Inhalation injury swells fast; airway before everything.' },
        { t: 'Notify the provider of the perfusion trend (HR, BP, urine output) and anticipate increased fluid rate', ok: true, why: 'Under-resuscitation.' },
        { t: 'Place on continuous cardiac monitoring for K⁺ 5.6', ok: true, why: 'Hyperkalemia causes dysrhythmias.' },
        { t: 'Measure hourly urine output via indwelling catheter', ok: true, why: 'The best bedside gauge of resuscitation.' },
        { t: 'Slow the IV fluids because the arms are swollen', ok: false, why: 'Edema is expected; the vessels are empty.' },
        { t: 'Give a potassium supplement for expected losses', ok: false, why: 'K⁺ is already high.' },
        { t: 'Apply ice to the burns to reduce swelling', ok: false, why: 'Causes hypothermia and deepens injury.' }
      ],
      rationale: 'Airway first (enclosed-space fire, hoarse voice, carbonaceous sputum), then perfusion (report the trend, more fluid), then the cardiac risk of hyperkalemia, all guided by hourly urine output.' },
    { step: 'evaluate', type: 'sata', n: 4,
      prompt: 'Two hours after the fluid rate is increased, which findings tell the nurse resuscitation is working? Select the 4 that apply.',
      options: [
        { t: 'Urine output 40 mL/hr', ok: true, why: 'At target.' },
        { t: 'HR 98, BP 118/74', ok: true, why: 'Perfusion restored.' },
        { t: 'Alert and oriented again', ok: true, why: 'Brain perfused.' },
        { t: 'Hematocrit trending down toward 44%', ok: true, why: 'Plasma volume restored.' },
        { t: 'Arm edema is visibly less', ok: false, why: 'Edema will persist or worsen for 24–48 h; not the endpoint.' },
        { t: 'Client reports less pain', ok: false, why: 'Important, but pain is not a perfusion marker.' }
      ],
      rationale: 'How do you know the fluids worked? Urine output, hemodynamics, mental status, and labs. Both under- and over-resuscitation harm; the swelling is not your yardstick.' }
  ],
  bowtie: {
    prompt: 'Complete the bow-tie for the 1600 assessment.',
    conditions: [{ t: 'Hypovolemic (burn) shock', ok: true }, { t: 'Fluid volume excess', ok: false }, { t: 'Septic shock', ok: false }, { t: 'Anaphylaxis', ok: false }],
    actions: [{ t: 'Increase IV lactated Ringer\'s per protocol / provider', ok: true }, { t: 'Reassess airway and notify provider', ok: true }, { t: 'Administer IV furosemide', ok: false }, { t: 'Restrict fluids', ok: false }, { t: 'Give potassium chloride IV', ok: false }],
    params: [{ t: 'Hourly urine output', ok: true }, { t: 'HR, BP and mental status', ok: true }, { t: 'Degree of arm edema', ok: false }, { t: 'Bowel sounds', ok: false }, { t: 'Pain score only', ok: false }],
    rationale: 'Burn shock is hypovolemia from capillary leak. More fluid, airway vigilance, and monitor urine output and hemodynamics.'
  }
});

window.CASES.push({
  id: 'fe-dka',
  title: 'The 12-year-old who breathes "funny"',
  system: 'Endocrine / Fluids',
  setting: 'Pediatric Emergency Department',
  patient: { sex: 'M', ageRange: [11, 14], names: ['Eli', 'Noah', 'Jaden', 'Owen'] },
  hook: 'DKA order: FLUIDS first, INSULIN second, then watch the POTASSIUM plummet. Sugar falling is not DKA resolving; the pH rising is.',
  tagline: 'Drinking constantly, wetting the bed, and now vomiting with deep rapid breaths.',
  chart: {
    profile: 'Parents report one week of lethargy, constant thirst, and bedwetting. Today: vomiting and breathing that "looks funny."',
    notes: [{ time: '1015', text: 'Lethargic but arousable. Mucous membranes dry, poor skin turgor. Breath has a strong sweet, fruity odor. Respirations deep and rapid. Abdominal pain 7/10.' }],
    vitals: { cols: ['1015'], rows: [['HR', '135'], ['RR', '32 deep'], ['BP', '88/50'], ['SpO₂', '98% RA'], ['Temp', '98.9 °F']] },
    labs: [['Glucose', '520', '70–99'], ['pH', '7.15', '7.35–7.45'], ['HCO₃⁻', '12', '22–26'], ['K⁺', '5.5', '3.5–5.0'], ['Urine ketones', 'positive', 'negative']]
  },
  items: [
    { step: 'recognize', type: 'sata', n: 6,
      prompt: 'Filter the noise. Which findings are the critical cues? Select the 6 that apply.',
      options: [
        { t: 'HR 135', ok: true, why: 'Tachycardia: compensating for volume loss.' },
        { t: 'BP 88/50', ok: true, why: 'Hypotension: hypovolemia.' },
        { t: 'Deep, rapid respirations with fruity breath', ok: true, why: 'Kussmaul breathing blowing off acid.' },
        { t: 'Glucose 520', ok: true, why: 'Hyperglycemia driving osmotic diuresis.' },
        { t: 'pH 7.15', ok: true, why: 'Severe metabolic acidosis.' },
        { t: 'Positive urine ketones', ok: true, why: 'Fat breakdown.' },
        { t: 'SpO₂ 98%', ok: false, why: 'Normal: distractor.' },
        { t: 'Temp 98.9 °F', ok: false, why: 'Normal: distractor.' }
      ],
      rationale: 'Cues that matter: circulation (HR, BP), acid-base (pH, Kussmaul, ketones), and the driver (glucose). Normal oxygen and temperature are there to distract you.' },
    { step: 'analyze', type: 'matrix', cols: ['Hypovolemia (osmotic diuresis)', 'Metabolic acidosis compensation', 'Potassium shift'],
      prompt: 'Connect each cue to its physiological cause.',
      rows: [
        { t: 'BP 88/50, HR 135, dry mucous membranes', ans: 0, why: 'Glucose pulls water out in the urine.' },
        { t: 'RR 32 deep, fruity breath, pH 7.15', ans: 1, why: 'Kussmaul respirations blow off CO₂ to raise pH.' },
        { t: 'K⁺ 5.5 while total body potassium is depleted', ans: 2, why: 'Acidosis pushes K⁺ out of cells; polyuria and vomiting drained the real stores.' }
      ],
      rationale: 'Map the chain: no insulin → glucose cannot enter cells → fat breakdown → ketones → acidosis; glucose in urine drags water → dehydration. The K⁺ of 5.5 is a false high.' },
    { step: 'prioritize', type: 'cloze',
      prompt: 'Complete the sentence.',
      parts: ['The most likely condition is ', { options: ['diabetic ketoacidosis (new type 1 diabetes)', 'gastroenteritis with dehydration', 'appendicitis', 'hyperosmolar hyperglycemic state'], ans: 0 }, ' and the most immediate threat to life is ', { options: ['hypovolemic shock', 'the high blood sugar', 'the abdominal pain', 'hyperkalemia'], ans: 0 }, '.'],
      rationale: 'The blood is acidic and sugary, but what kills first is the lack of circulating volume. ABCs and Maslow: circulation before chemistry.' },
    { step: 'generate', type: 'sata', n: 4,
      prompt: 'Which interventions are appropriate for the plan? Select the 4 that apply.',
      options: [
        { t: 'Establish two large-bore IVs', ok: true, why: 'Fluids and insulin need separate lines.' },
        { t: 'Isotonic IV fluid (0.9% normal saline) bolus', ok: true, why: 'Restore volume.' },
        { t: 'Continuous IV regular insulin infusion', ok: true, why: 'Stops ketone production.' },
        { t: 'Continuous cardiac monitoring', ok: true, why: 'Potassium shifts affect the heart.' },
        { t: 'Subcutaneous long-acting insulin now', ok: false, why: 'Too slow and unpredictable in shock.' },
        { t: 'Sodium bicarbonate routinely to fix the pH', ok: false, why: 'Not routine; insulin fixes the acidosis.' },
        { t: 'Oral fluids with sugar-free flavoring', ok: false, why: 'Vomiting; needs IV.' }
      ],
      rationale: 'Fix the fluid deficit, stop ketone production, and watch the electrolytes on a monitor.' },
    { step: 'action', type: 'matrix', cols: ['First', 'Second', 'Contraindicated right now'],
      prompt: 'The potassium trap. For each action, specify its place in the sequence.',
      rows: [
        { t: 'Administer 0.9% normal saline bolus', ans: 0, why: 'Volume before glucose.' },
        { t: 'Start the IV regular insulin drip', ans: 1, why: 'After fluids are running.' },
        { t: 'Push IV potassium now', ans: 2, why: 'K⁺ is 5.5 and urine output is unconfirmed. Add potassium once insulin drives K⁺ down AND the kidneys are making urine.' }
      ],
      rationale: 'Insulin pushes potassium back into cells, so the serum level will plummet within hours. Replace it as soon as the level falls and urine output is adequate; never before. If K⁺ were below 3.3 at the start, potassium would come BEFORE insulin.' },
    { step: 'evaluate', type: 'matrix', cols: ['True sign DKA is resolving', 'Expected but not the endpoint'],
      prompt: 'Two hours later. Sort each finding.',
      rows: [
        { t: 'pH rises from 7.15 to 7.32', ans: 0, why: 'Acidosis resolving is the goal.' },
        { t: 'HCO₃⁻ rises from 12 to 18', ans: 0, why: 'Buffer recovering.' },
        { t: 'Anion gap closing', ans: 0, why: 'Ketones cleared.' },
        { t: 'Glucose drops from 520 to 350', ans: 1, why: 'Expected, but glucose alone does not mean DKA is over.' },
        { t: 'Child asks for water', ans: 1, why: 'Nice, not the endpoint.' }
      ],
      rationale: 'Resolution of the ACIDOSIS is the endpoint of DKA treatment. Falling glucose is the distractor: when it reaches about 250, dextrose is added so the insulin can keep clearing ketones.' }
  ]
});

window.CASES.push({
  id: 'fe-septic',
  title: 'Fever, confusion, and 15 mL of urine',
  system: 'Sepsis / Perfusion',
  setting: 'Emergency Department',
  patient: { sex: 'M', ageRange: [76, 90] },
  hook: 'Sepsis rhyme: HOT and FAST, then LOW and SLOW to pee. Lactate ≥ 4 with low BP = septic shock, you see.',
  tagline: 'Pneumonia in an 84-year-old with warm, flushed skin and a BP of 88/54.',
  chart: {
    profile: 'History: type 2 diabetes, hypertension, COPD, smoker, pacemaker, prior stroke. Chief complaint: fever, shortness of breath, confusion, weakness.',
    notes: [{ time: '1120', text: 'Crackles right lower lung. Warm, flushed skin. Confused and lethargic. Urine output 15 mL/hr. Blood cultures pending.' }],
    vitals: { cols: ['1120'], rows: [['Temp', '101.4 °F'], ['HR', '118'], ['RR', '28'], ['BP', '88/54'], ['SpO₂', '90% RA']] },
    labs: [['WBC', '18,500', '4.5–10.5 k'], ['Lactate', '4.5', '0.5–2.2'], ['Creatinine', '2.1', '0.6–1.2']]
  },
  items: [
    { step: 'recognize', type: 'sata', n: 5,
      prompt: 'Which findings show organ dysfunction, not just infection? Select the 5 that apply.',
      options: [
        { t: 'BP 88/54', ok: true, why: 'Hypotension: circulatory failure.' },
        { t: 'Confused and lethargic', ok: true, why: 'Brain hypoperfusion.' },
        { t: 'Urine output 15 mL/hr', ok: true, why: 'Kidney hypoperfusion.' },
        { t: 'Lactate 4.5', ok: true, why: 'Anaerobic metabolism: tissues starving.' },
        { t: 'Creatinine 2.1', ok: true, why: 'Acute kidney injury.' },
        { t: 'Temp 101.4 °F', ok: false, why: 'Infection sign, not organ dysfunction.' },
        { t: 'WBC 18,500', ok: false, why: 'Infection sign.' },
        { t: 'Crackles right lower lung', ok: false, why: 'The source, not the dysfunction.' }
      ],
      rationale: 'Infection becomes urgent when there are signs of poor perfusion or organ dysfunction. Hypotension, altered mental status, oliguria, high lactate and rising creatinine are those signs.' },
    { step: 'analyze', type: 'matrix', cols: ['Sepsis criteria (infection + response)', 'Septic shock criteria'],
      prompt: 'Sort the cues.',
      rows: [
        { t: 'Suspected pneumonia with HR > 90, RR > 22, temp > 101', ans: 0, why: 'Infection plus systemic response.' },
        { t: 'Hypotension persisting (88/54) requiring fluids/vasopressors', ans: 1, why: 'Shock.' },
        { t: 'Lactate ≥ 4', ans: 1, why: 'Shock threshold.' },
        { t: 'WBC 18,500', ans: 0, why: 'Response to infection.' }
      ],
      rationale: 'Sepsis = infection with a systemic response. Septic shock = sepsis plus hypotension and lactate ≥ 4 despite fluids. This client is in septic shock.' },
    { step: 'prioritize', type: 'single',
      prompt: 'Which problem is the priority?',
      options: [
        { t: 'Tissue hypoperfusion from septic shock', ok: true, why: 'Kills fastest.' },
        { t: 'Hyperglycemia from diabetes', ok: false, why: 'Manage, not first.' },
        { t: 'Smoking cessation', ok: false, why: 'Later.' },
        { t: 'Pacemaker check', ok: false, why: 'Not the change.' }
      ],
      rationale: 'The unexpected, changing problem wins: warm flushed skin with low BP, low urine output and confusion is distributive shock.' },
    { step: 'generate', type: 'sata', n: 6,
      prompt: 'Which provider orders should the nurse expect? Select the 6 that apply.',
      options: [
        { t: 'Obtain blood cultures (before antibiotics when possible)', ok: true, why: 'Identify the organism.' },
        { t: 'Administer broad-spectrum IV antibiotics within the hour', ok: true, why: 'Every hour of delay raises mortality.' },
        { t: 'Apply supplemental oxygen', ok: true, why: 'SpO₂ 90%.' },
        { t: '30 mL/kg IV crystalloid bolus', ok: true, why: 'Fill the dilated vessels.' },
        { t: 'Start vasopressor if hypotension persists after fluids', ok: true, why: 'Restore vascular tone.' },
        { t: 'Insert an indwelling urinary catheter', ok: true, why: 'Hourly urine output guides resuscitation.' },
        { t: 'Hold antibiotics until the culture results return', ok: false, why: 'Cultures first, but antibiotics within the hour.' },
        { t: 'Restrict fluids because of his age', ok: false, why: 'Shock needs volume; monitor lungs closely.' }
      ],
      rationale: 'The sepsis bundle: cultures, antibiotics, oxygen, fluids, vasopressors if needed, and a catheter to measure the response.' },
    { step: 'action', type: 'order',
      prompt: 'Sequence the orders.',
      items: [{ t: 'Apply oxygen' }, { t: 'Obtain blood cultures' }, { t: 'Administer IV antibiotics' }, { t: 'Teach about yearly influenza vaccination' }],
      rationale: 'Oxygen (breathing) first, cultures before the antibiotic so the organism can grow, antibiotics within the hour, teaching last. This matches the course\'s own review question (C, B, A, D).' },
    { step: 'evaluate', type: 'trend',
      prompt: 'At 1400 after 2 L of fluid, oxygen and antibiotics: improved, declined, or unchanged?',
      rows: [
        { t: 'BP', before: '88/54', after: '104/62', ans: 'improved', why: 'Perfusion pressure up.' },
        { t: 'HR', before: '118', after: '104', ans: 'improved', why: 'Less compensation needed.' },
        { t: 'Urine output', before: '15 mL/hr', after: '35 mL/hr', ans: 'improved', why: 'Kidneys perfused.' },
        { t: 'Lactate', before: '4.5', after: '2.8', ans: 'improved', why: 'Clearing.' },
        { t: 'Mental status', before: 'confused', after: 'confused', ans: 'unchanged', why: 'May lag; keep reassessing.' },
        { t: 'Lung sounds', before: 'crackles RLL', after: 'crackles bilateral bases', ans: 'declined', why: 'Watch for fluid overload in a COPD client after 2 L: reassess before more fluid.' }
      ],
      rationale: 'Trend every parameter. Perfusion improved, but new bilateral crackles are a new cue: this older client with COPD may be tipping into overload. Report the trend, not just the latest number.' }
  ]
});

window.CASES.push({
  id: 'fe-postop-bleed',
  title: 'The priority can change',
  system: 'Perfusion',
  setting: 'Surgical Unit',
  patient: { sex: 'F', ageRange: [35, 70] },
  hook: 'Pain at 0800, pale at 0830, passing out at 0845: the same patient is three different priorities.',
  tagline: 'Post-op abdominal surgery. Pain 7/10, and then everything changes.',
  chart: {
    profile: 'Post-op day 0, open abdominal surgery. Abdominal dressing dry at 0700.',
    notes: [{ time: '0800', text: 'Reports incisional pain 7/10. Alert, skin warm and pink. Dressing dry.' }],
    vitals: { cols: ['0800'], rows: [['HR', '88'], ['BP', '124/76'], ['RR', '18'], ['SpO₂', '97%']] }
  },
  items: [
    { step: 'recognize', type: 'single',
      prompt: 'At 0800, what is the priority cue and first nursing action?',
      options: [
        { t: 'Pain 7/10 with stable vitals: treat the pain and continue monitoring', ok: true, why: 'Stable client; pain is the problem.' },
        { t: 'Vitals are normal: nothing to do', ok: false, why: 'Untreated pain is a problem.' },
        { t: 'Call a rapid response', ok: false, why: 'No instability yet.' },
        { t: 'Remove the dressing to inspect the incision', ok: false, why: 'Not indicated; dressing is dry.' }
      ],
      rationale: 'At this moment the client is stable and in pain. Treat the pain, then keep watching. Priority is about what becomes unsafe if delayed.' },
    { step: 'analyze', type: 'sata', n: 4,
      chart: { notes: [{ time: '0830', text: 'Pale and restless. New bright-red drainage saturating the dressing.' }], vitals: { cols: ['0830'], rows: [['HR', '118'], ['BP', '96/58'], ['RR', '22'], ['SpO₂', '96%']] } },
      prompt: '0830. Which cues belong together to tell one story? Select the 4 that apply.',
      options: [
        { t: 'HR 88 → 118', ok: true, why: 'Compensating tachycardia.' },
        { t: 'BP 124/76 → 96/58', ok: true, why: 'Falling pressure.' },
        { t: 'Pale and restless', ok: true, why: 'Poor perfusion, early shock.' },
        { t: 'New bright-red drainage on the dressing', ok: true, why: 'The source.' },
        { t: 'SpO₂ 96%', ok: false, why: 'Still fine: distractor.' },
        { t: 'Pain was 7/10 at 0800', ok: false, why: 'No longer the main story.' }
      ],
      rationale: 'Tachycardia + hypotension + pallor + restlessness + visible bleeding = hemorrhage with early hypovolemic shock. The priority has changed from comfort to circulation.' },
    { step: 'prioritize', type: 'cloze',
      prompt: 'Complete the sentence.',
      parts: ['At 0830 the priority hypothesis is ', { options: ['post-operative hemorrhage', 'opioid over-sedation', 'wound infection', 'anxiety'], ans: 0 }, ' and the first nursing action is ', { options: ['focused assessment for bleeding and notify the provider', 'give another dose of pain medication', 'apply a warm blanket', 'document and recheck in an hour'], ans: 0 }, '.'],
      rationale: 'A pale, restless, tachycardic client with a soaking dressing is bleeding until proven otherwise. Assess (dressing, abdomen, drains, vitals) and escalate now.' },
    { step: 'generate', type: 'sata', n: 5,
      chart: { notes: [{ time: '0845', text: '"I feel like I\'m going to pass out." Skin cool and clammy. Dressing reinforced and soaking through again.' }], vitals: { cols: ['0845'], rows: [['HR', '132'], ['BP', '82/48'], ['RR', '26'], ['SpO₂', '94%']] } },
      prompt: '0845. Which actions are appropriate now? Select the 5 that apply.',
      options: [
        { t: 'Activate rapid response / emergency support', ok: true, why: 'Shock: get the team.' },
        { t: 'Lay flat, legs elevated as tolerated; apply oxygen', ok: true, why: 'Perfuse the brain; support oxygenation.' },
        { t: 'Apply firm pressure over the bleeding site', ok: true, why: 'Control the source.' },
        { t: 'Ensure large-bore IV access; anticipate fluid bolus and blood products', ok: true, why: 'Replace volume.' },
        { t: 'Obtain type and crossmatch, CBC as ordered', ok: true, why: 'Prepare for transfusion.' },
        { t: 'Give IV morphine for pain first', ok: false, why: 'Would drop the BP further.' },
        { t: 'Sit upright in a chair to help breathing', ok: false, why: 'Would cause syncope.' }
      ],
      rationale: 'At 0845 this is hemorrhagic shock: call for help, position, oxygen, pressure, access, volume, and prepare for blood. Pain medication waits.' },
    { step: 'action', type: 'matrix', cols: ['0800', '0830', '0845'],
      prompt: 'Match each nursing response to the time point where it was the priority.',
      rows: [
        { t: 'Treat pain and continue monitoring', ans: 0, why: 'Stable, in pain.' },
        { t: 'Focused assessment for bleeding; notify provider', ans: 1, why: 'Early deterioration.' },
        { t: 'Rapid response; manage shock', ans: 2, why: 'Unstable.' }
      ],
      rationale: 'This is an unfolding case: the priority changed three times in 45 minutes as the client moved from stable to deteriorating to unstable. Reassessment is what catches it.' },
    { step: 'evaluate', type: 'sata', n: 3,
      prompt: 'After a fluid bolus and 2 units of blood, which findings show the interventions worked? Select the 3 that apply.',
      options: [
        { t: 'BP 110/70, HR 96', ok: true, why: 'Perfusion restored.' },
        { t: 'Skin warm and pink, alert', ok: true, why: 'Tissues perfused.' },
        { t: 'Dressing dry after reinforcement; urine output 40 mL/hr', ok: true, why: 'Bleeding controlled, kidneys perfused.' },
        { t: 'Client falls asleep', ok: false, why: 'Sleep is not proof of stability; could be declining LOC.' },
        { t: 'Pain increases to 8/10', ok: false, why: 'Needs attention but is not the outcome measure for shock.' }
      ],
      rationale: 'Evaluate against the cues that defined the problem: pressure, heart rate, skin, mentation, bleeding, urine output.' }
  ]
});

window.CASES.push({
  id: 'fe-dehydration',
  title: '"She\'s not acting like herself"',
  system: 'Fluids / Older Adult',
  setting: 'Medical Unit',
  patient: { sex: 'F', ageRange: [79, 92] },
  hook: 'In an older adult, new confusion is never "just aging." Delirium is a vital sign.',
  tagline: 'UTI, poor appetite for two days, and now newly confused and weak.',
  chart: {
    profile: 'Admitted with urinary tract infection. Lives alone. Takes furosemide and lisinopril for heart failure. Baseline: alert, oriented, walks with a cane.',
    notes: [{ time: '0730', text: 'Daughter reports mother is "not acting like herself." Client drowsy, oriented to person only, weak, unable to stand without two assist. Dry oral mucosa, tongue furrowed, skin tenting on the sternum. Reports burning with urination. Has eaten and drunk little for two days. Dizzy when sitting up.' }],
    vitals: { cols: ['Yesterday 1600', '0730'], rows: [['HR', '78', '108'], ['BP lying', '132/78', '104/60'], ['BP sitting', '—', '86/50'], ['Temp', '99.0', '100.6'], ['Weight', '58 kg', '55.5 kg'], ['Urine', '400 mL/shift', '90 mL dark amber']] },
    labs: [['Na⁺', '148', '135–145'], ['K⁺', '3.2', '3.5–5.0'], ['BUN', '38', '7–20'], ['Creatinine', '1.6', '0.6–1.2'], ['Glucose', '128', '70–99'], ['WBC', '13,800', '4.5–10.5 k']]
  },
  items: [
    { step: 'recognize', type: 'sata', n: 6,
      prompt: 'Which findings signal a change in status that needs immediate follow-up? Select the 6 that apply.',
      options: [
        { t: 'New confusion (oriented to person only)', ok: true, why: 'Acute delirium = acute illness until proven otherwise.' },
        { t: 'HR 78 → 108', ok: true, why: 'Compensating for volume loss.' },
        { t: 'BP drops from 104/60 lying to 86/50 sitting', ok: true, why: 'Orthostatic hypotension: hypovolemia.' },
        { t: 'Weight down 2.5 kg in one day', ok: true, why: '2.5 L of fluid lost; the most reliable fluid measure.' },
        { t: 'Urine 90 mL dark amber', ok: true, why: 'Oliguria, concentrated.' },
        { t: 'Temp 100.6 with WBC 13,800', ok: true, why: 'Infection may be progressing toward sepsis.' },
        { t: 'Burning with urination', ok: false, why: 'Expected with a UTI.' },
        { t: 'Walks with a cane at baseline', ok: false, why: 'Baseline, not a change.' }
      ],
      rationale: 'Older adults present atypically: the first sign of infection or dehydration is often confusion, not fever. Compare every finding to HER baseline, not to a textbook range.' },
    { step: 'analyze', type: 'matrix', cols: ['Fluid volume deficit', 'Infection', 'Both'],
      prompt: 'Which problem does each cue belong to?',
      rows: [
        { t: 'Skin tenting, furrowed tongue, dry mucosa', ans: 0, why: 'Dehydration.' },
        { t: 'Orthostatic BP drop and dizziness', ans: 0, why: 'Low circulating volume.' },
        { t: 'BUN 38 with creatinine 1.6 (ratio > 20:1)', ans: 0, why: 'Pre-renal: kidneys underperfused.' },
        { t: 'Na⁺ 148', ans: 0, why: 'Water loss exceeds sodium loss: hypernatremia.' },
        { t: 'Temp 100.6, WBC 13,800', ans: 1, why: 'Infection.' },
        { t: 'New confusion', ans: 2, why: 'Either dehydration or infection (or both) can cause delirium.' }
      ],
      rationale: 'Two problems overlap. Dehydration is proven by the weight, orthostatics, skin, and pre-renal labs. Infection is proven by fever and WBC. Confusion could come from either, which is why both must be treated.' },
    { step: 'prioritize', type: 'cloze',
      prompt: 'Complete the sentence.',
      parts: ['The most immediate physiologic threat is ', { options: ['hypovolemia with poor perfusion (risk of falls, kidney injury, and shock)', 'hypernatremia', 'urinary burning', 'poor appetite'], ans: 0 }, '; the medication that made it worse is ', { options: ['furosemide (a loop diuretic)', 'lisinopril', 'the antibiotic', 'acetaminophen'], ans: 0 }, '.'],
      rationale: 'She kept taking a diuretic while barely drinking for two days. Volume deficit now threatens perfusion (orthostasis, oliguria, rising creatinine) and safety (falls). Sodium corrects as water is replaced.' },
    { step: 'generate', type: 'matrix', cols: ['Indicated', 'Not indicated'],
      prompt: 'For each intervention, specify whether it is indicated.',
      rows: [
        { t: 'Notify provider; anticipate IV isotonic fluids (with heart failure caution: slower rate, frequent lung checks)', ans: 0, why: 'Replace volume carefully.' },
        { t: 'Hold furosemide and clarify with provider', ans: 0, why: 'Diuretic is worsening deficit.' },
        { t: 'Fall precautions; bed alarm; assist with all transfers', ans: 0, why: 'Orthostatic and confused.' },
        { t: 'Strict intake and output, daily weight', ans: 0, why: 'Track the response.' },
        { t: 'Encourage oral fluids and offer them hourly', ans: 0, why: 'She is not drinking on her own.' },
        { t: 'Rapid 2 L bolus wide open', ans: 1, why: 'Heart failure: would flood the lungs. Slower boluses with reassessment.' },
        { t: 'Apply restraints for confusion', ans: 1, why: 'Restraints worsen delirium; use reorientation and supervision.' },
        { t: 'Restrict fluids because of hypernatremia', ans: 1, why: 'Backwards: hypernatremia here is from water loss.' }
      ],
      rationale: 'Replace fluid at a pace her heart can handle, stop the drug that is draining her, keep her safe, and measure everything.' },
    { step: 'action', type: 'single',
      prompt: 'Which action should the nurse take FIRST?',
      options: [
        { t: 'Keep her in bed with the call light and bed alarm on, then call the provider with SBAR including the trend', ok: true, why: 'Immediate safety, then escalate with data.' },
        { t: 'Walk her to the bathroom to collect a urine sample', ok: false, why: 'Orthostatic: she would fall.' },
        { t: 'Give the scheduled furosemide so she is not behind', ok: false, why: 'Would deepen the deficit.' },
        { t: 'Ask the daughter to feed her breakfast', ok: false, why: 'Aspiration risk while drowsy; not first.' }
      ],
      rationale: 'The safest first action prevents the immediate harm (a fall) and gets treatment started. SBAR: "HR from 78 to 108, BP drops to 86/50 sitting, weight down 2.5 kg, urine 90 mL, newly confused."' },
    { step: 'evaluate', type: 'trend',
      prompt: 'Next morning: improved, declined, or unchanged?',
      rows: [
        { t: 'Orientation', before: 'person only', after: 'person, place, time', ans: 'improved', why: 'Delirium clearing.' },
        { t: 'HR', before: '108', after: '82', ans: 'improved', why: 'Volume restored.' },
        { t: 'Orthostatic drop', before: '18 mmHg', after: '4 mmHg', ans: 'improved', why: 'Perfusion stable.' },
        { t: 'Weight', before: '55.5 kg', after: '57.2 kg', ans: 'improved', why: 'Fluid replaced.' },
        { t: 'Lung sounds', before: 'clear', after: 'fine crackles at both bases', ans: 'declined', why: 'Watch for overload in heart failure: report, slow fluids, reassess.' },
        { t: 'Na⁺', before: '148', after: '142', ans: 'improved', why: 'Corrected with water.' }
      ],
      rationale: 'The deficit is corrected, and now the opposite risk appears: crackles in a heart-failure client. Evaluation is never one-directional. Trend the whole picture.' }
  ]
});

window.CASES.push({
  id: 'fe-overload',
  title: 'Suddenly restless with new crackles',
  system: 'Fluids / Cardiac',
  setting: 'Telemetry Unit',
  patient: { sex: 'M', ageRange: [60, 84] },
  hook: 'Overload looks like: wet lungs, heavy weight, puffy legs, and a patient who cannot lie flat.',
  tagline: 'Heart failure admission. Morning rounds: RR 30 and the saturation is falling.',
  chart: {
    profile: 'Admitted with heart failure exacerbation. Received 1.5 L IV fluid overnight for "low BP" during a hypotensive episode after a sedative. Daily weight yesterday 82 kg.',
    notes: [{ time: '0700', text: 'Suddenly restless, sitting bolt upright, "I can\'t catch my breath." New crackles in both lung bases to mid-fields. Frothy cough. Jugular venous distension. 2+ pitting edema both legs. Weight this morning 84.3 kg.' }],
    vitals: { cols: ['2300', '0700'], rows: [['HR', '88', '112'], ['BP', '104/62', '146/90'], ['RR', '18', '30'], ['SpO₂', '96% RA', '91% → 88% RA']] }
  },
  items: [
    { step: 'recognize', type: 'sata', n: 5,
      prompt: 'Which findings indicate fluid volume excess with pulmonary congestion? Select the 5 that apply.',
      options: [
        { t: 'New crackles bases to mid-fields with frothy cough', ok: true, why: 'Fluid in the alveoli.' },
        { t: 'SpO₂ falling from 96% to 88%', ok: true, why: 'Gas exchange impaired.' },
        { t: 'Weight up 2.3 kg overnight', ok: true, why: '2.3 L retained.' },
        { t: 'Jugular venous distension and 2+ leg edema', ok: true, why: 'Venous congestion.' },
        { t: 'Cannot lie flat, RR 30', ok: true, why: 'Orthopnea; work of breathing.' },
        { t: 'BP 146/90', ok: false, why: 'Elevated but not the defining cue; expected with overload.' },
        { t: 'Received a sedative last night', ok: false, why: 'Context, not a cue of overload.' }
      ],
      rationale: 'The change from baseline is the clue: new restlessness, RR 30, new crackles, and a falling SpO₂ in a heart-failure client who received extra fluid. Wet lungs, heavy weight, puffy legs, cannot lie flat.' },
    { step: 'analyze', type: 'matrix', cols: ['Fluid volume excess', 'Fluid volume deficit'],
      prompt: 'Sort the classic signs.',
      rows: [
        { t: 'Weight gain, edema, crackles', ans: 0, why: 'Excess.' },
        { t: 'JVD, bounding pulse', ans: 0, why: 'Excess.' },
        { t: 'Orthopnea, frothy sputum', ans: 0, why: 'Pulmonary edema.' },
        { t: 'Orthostatic hypotension, tachycardia, weak pulse', ans: 1, why: 'Deficit.' },
        { t: 'Skin tenting, dry mucosa, concentrated urine', ans: 1, why: 'Deficit.' },
        { t: 'Rising BUN:creatinine ratio', ans: 1, why: 'Pre-renal from deficit.' }
      ],
      rationale: 'Do not memorize one finding; recognize the pattern. Excess = wet and heavy. Deficit = dry and fast.' },
    { step: 'prioritize', type: 'single',
      prompt: 'What could happen if this client waits 30 minutes?',
      options: [
        { t: 'Worsening pulmonary edema → need for higher oxygen support → respiratory failure', ok: true, why: 'The risk of delay is the reason he is the priority.' },
        { t: 'Nothing; heart failure clients always have crackles', ok: false, why: 'NEW crackles with falling SpO₂ is a change, not a baseline.' },
        { t: 'He will become dehydrated', ok: false, why: 'Opposite problem.' },
        { t: 'He will miss breakfast', ok: false, why: 'Not the point.' }
      ],
      rationale: 'The best priority answer is linked to what harm occurs if care is delayed. Pulmonary edema progresses fast.' },
    { step: 'generate', type: 'sata', n: 5,
      prompt: 'Which interventions should the nurse anticipate? Select the 5 that apply.',
      options: [
        { t: 'High-Fowler\'s position with legs dependent', ok: true, why: 'Reduces venous return to the lungs.' },
        { t: 'Oxygen; notify provider urgently', ok: true, why: 'SpO₂ 88%.' },
        { t: 'IV loop diuretic (furosemide) as ordered', ok: true, why: 'Remove volume.' },
        { t: 'Stop the IV fluids; fluid and sodium restriction', ok: true, why: 'No more volume.' },
        { t: 'Strict I&O, daily weights, insert catheter to measure diuresis', ok: true, why: 'Evaluate the response.' },
        { t: 'Lay flat to improve blood pressure', ok: false, why: 'Would drown him.' },
        { t: 'Encourage 2 L of oral fluids', ok: false, why: 'Wrong direction.' }
      ],
      rationale: 'Sit up, oxygen, diuretic, stop fluids, measure. The plan for excess is the mirror image of the plan for deficit.' },
    { step: 'action', type: 'single',
      prompt: 'After IV furosemide is given at 0715, when should the nurse reassess this client compared to others on the unit?',
      options: [
        { t: 'Earliest of all: within 15–30 minutes, because the intervention was given for instability', ok: true, why: 'Evaluate breathing response; risk if ineffective.' },
        { t: 'At the next scheduled vital signs in 4 hours', ok: false, why: 'Too late for pulmonary edema.' },
        { t: 'After the client who received a stool softener', ok: false, why: 'Stable, low risk.' },
        { t: 'Only if the call light goes on', ok: false, why: 'Reassessment closes the loop; it is your job, not the client\'s.' }
      ],
      rationale: 'Priority includes reassessment after a high-risk or acute intervention. A client who received IV furosemide for acute dyspnea and crackles needs the earliest reassessment.' },
    { step: 'evaluate', type: 'trend',
      prompt: 'At 0815, one hour after furosemide: improved, declined, or unchanged?',
      rows: [
        { t: 'RR', before: '30', after: '22', ans: 'improved', why: 'Less work of breathing.' },
        { t: 'SpO₂', before: '88% RA', after: '95% on 2 L', ans: 'improved', why: 'Gas exchange better.' },
        { t: 'Urine output', before: '30 mL/hr', after: '600 mL in 1 hr', ans: 'improved', why: 'Diuretic working.' },
        { t: 'Crackles', before: 'bases to mid-fields', after: 'bases only', ans: 'improved', why: 'Lungs clearing.' },
        { t: 'K⁺', before: '4.0', after: '3.3', ans: 'declined', why: 'Loop diuretics waste potassium; report and anticipate replacement, watch the rhythm.' },
        { t: 'Leg edema', before: '2+', after: '2+', ans: 'unchanged', why: 'Takes longer.' }
      ],
      rationale: 'The lungs improved. Now the treatment created a new risk (hypokalemia: K = HEART + MUSCLE). Evaluation always includes the side effects of what you did.' }
  ]
});
