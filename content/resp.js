/* Respiratory unfolding cases — built from the course's own case-study packet
   (Acute Asthma, COPD, Pneumonia, Acute Respiratory Failure) plus the respiratory lecture.
   Every item is tagged with a Clinical Judgment Measurement Model step. */
window.CASES = window.CASES || [];

window.CASES.push({
  id: 'resp-asthma',
  title: 'Acute asthma in the ED',
  system: 'Respiratory',
  setting: 'Emergency Department',
  patient: { sex: 'M', ageRange: [19, 34] },
  tagline: 'Two days of tightness, now speaking in short phrases.',
  chart: {
    notes: [
      { time: '1100', text: 'Reports shortness of breath and chest tightness that has progressively worsened for 2 to 3 days. History of seasonal allergies, non-smoker, lives with {his} mother who is a current smoker. Denies fever or vomiting. Fatigued, with a dry cough at night.' },
      { time: '1115', text: 'Audible expiratory wheezing throughout both lung fields. Increased respiratory rate. Capillary refill < 3 sec, skin warm. Chest wall symmetrical. Sits upright leaning forward with hands on knees (tripod position) and speaks only a few words between breaths. Tenderness on palpation of chest wall. Trachea midline. Labs drawn, chest X-ray ordered.' }
    ],
    vitals: { cols: ['1115'], rows: [['Temp', '97.8 °F'], ['HR', '98'], ['RR', '26'], ['BP', '114/78'], ['SpO₂', '95% RA']] },
    labs: [['Hct', '48%', '42–52%'], ['Hgb', '15 g/dL', '13–18'], ['WBC', '8,000', '4.5–10.5 k'], ['K⁺', '4.0', '3.5–5.0'], ['Na⁺', '138', '135–145']]
  },
  items: [
    { step: 'recognize', type: 'sata', n: 7,
      prompt: 'The nurse assesses {name} on arrival. Which findings require immediate follow-up? Select all that apply.',
      options: [
        { t: 'Shortness of breath', ok: true, why: 'Subjective cue of respiratory distress.' },
        { t: 'Chest tightness', ok: true, why: 'Classic bronchoconstriction symptom.' },
        { t: 'Respiratory rate 26', ok: true, why: 'Tachypnea = increased work of breathing.' },
        { t: 'Dry cough at night', ok: true, why: 'Nocturnal cough is a hallmark of poorly controlled asthma.' },
        { t: 'Audible expiratory wheezing', ok: true, why: 'Sign of narrowed airways.' },
        { t: 'Tripod position', ok: true, why: 'Positioning to recruit accessory muscles = distress.' },
        { t: 'Speaks only a few words between breaths', ok: true, why: 'Inability to speak in sentences signals a severe attack.' },
        { t: 'Blood pressure 114/78', ok: false, why: 'Normal. Not urgent.' },
        { t: 'Tenderness of chest wall', ok: false, why: 'Musculoskeletal, from coughing. Not urgent.' }
      ],
      rationale: 'Objective data (tachypnea, cough, wheezing, tripod position, short phrases) and subjective data (dyspnea, tightness) point to respiratory distress from bronchoconstriction. The BP and chest-wall tenderness do not need immediate follow-up.' },
    { step: 'analyze', type: 'matrix', cols: ['Risk factor', 'Not a risk factor'],
      prompt: 'For each finding, specify whether it is a risk factor for asthma.',
      rows: [
        { t: 'Family history', ans: 0, why: 'Asthma has a strong hereditary component.' },
        { t: 'Allergies', ans: 0, why: 'Allergens are common triggers.' },
        { t: 'Beta-blockers', ans: 0, why: 'Non-selective beta-blockers block beta-2 (lung) receptors so airways cannot dilate.' },
        { t: 'Edema', ans: 1, why: 'Not related to asthma.' },
        { t: 'Viral infections', ans: 0, why: 'Infections trigger exacerbations.' },
        { t: 'Second-hand smoke', ans: 0, why: 'His mother smokes at home.' },
        { t: 'Overweight', ans: 0, why: 'Obesity increases asthma risk and severity.' },
        { t: 'Diabetes', ans: 1, why: 'Not a risk factor for asthma.' }
      ],
      rationale: 'Risk factors: family history, allergies, NSAIDs/aspirin/beta-blockers, smoking or second-hand smoke, viral infections, GERD, and being overweight.' },
    { step: 'prioritize', type: 'cloze',
      chart: { diagnostics: ['Chest X-ray: hyperinflation of lungs with flattened diaphragm.'] },
      prompt: 'Labs and the chest X-ray return. Complete the sentence.',
      parts: ['The nurse should recognize that {name} is most likely experiencing ',
        { options: ['pneumonia', 'pulmonary edema', 'acute asthma onset', 'pneumothorax', 'sleep apnea'], ans: 2 },
        ' as most evidenced by the ',
        { options: ['vital signs', 'shortness of breath', 'expiratory wheezing', 'orthopnea', 'fatigue'], ans: 2 },
        '.'],
      rationale: 'Expiratory wheezing is the sound of bronchoconstriction and is often the first sign of an asthma attack. The hyperinflated X-ray with a flat diaphragm fits air trapping, not consolidation (pneumonia) or collapse (pneumothorax).' },
    { step: 'generate', type: 'sata', n: 4,
      prompt: '{name} is diagnosed with acute asthma. Which interventions should the nurse anticipate in the plan of care? Select the 4 that apply.',
      options: [
        { t: 'Administer 2 L oxygen for SpO₂ < 93% as needed', ok: true, why: 'Oxygen supports gas exchange during the attack.' },
        { t: 'Administer albuterol nebulizer every 4 hours as needed', ok: true, why: 'Short-acting beta-2 agonist = rescue bronchodilator.' },
        { t: 'Raise the head of the bed', ok: true, why: 'Decreases work of breathing.' },
        { t: 'Administer methylprednisolone (Solu-Medrol) IV once STAT', ok: true, why: 'Corticosteroid reduces airway inflammation.' },
        { t: 'Place the client supine', ok: false, why: 'Supine worsens work of breathing.' },
        { t: 'Administer low-dose aspirin daily', ok: false, why: 'Aspirin and NSAIDs can induce bronchospasm.' },
        { t: 'Administer labetalol twice daily', ok: false, why: 'Beta-blocker blocks beta-2 receptors; airways cannot dilate.' },
        { t: 'Administer ibuprofen every 6 hours for pain', ok: false, why: 'NSAID; can trigger bronchospasm.' },
        { t: 'Offer oral fluids now', ok: false, why: 'Labored breathing raises aspiration risk; encourage fluids once breathing eases.' }
      ],
      rationale: 'Emergent asthma care: short-acting beta-2 agonist (albuterol), anticholinergic (ipratropium), oxygen, and corticosteroids. Avoid beta-blockers, NSAIDs, aspirin, and lying flat.' },
    { step: 'action', type: 'matrix', cols: ['Immediately', 'Within the hour', 'Before end of shift'],
      chart: { orders: ['Continuous pulse oximetry; 2 L O₂ via NC PRN to keep SpO₂ > 93%', 'Albuterol 2.5 mg neb q1–4h PRN', 'Ipratropium 250 mcg neb q6h PRN (may give with albuterol)', 'Peripheral IV; methylprednisolone 125 mg IV STAT once', 'Instruct on peak flow meter use at least twice daily'] },
      prompt: 'The nurse reviews the orders. For each action, specify when the nurse should implement it.',
      rows: [
        { t: 'Apply continuous pulse oximeter', ans: 0, why: 'Monitoring starts now.' },
        { t: 'Administer 2 L oxygen by nasal cannula', ans: 0, why: 'Support oxygenation now.' },
        { t: 'Administer albuterol and ipratropium nebulizer', ans: 0, why: 'Open the airways now.' },
        { t: 'Administer methylprednisolone IV', ans: 0, why: 'Start reducing inflammation now.' },
        { t: 'Instruct on pursed-lip breathing', ans: 1, why: 'Teach once the client is upright and calmer.' },
        { t: 'Instruct on peak flow meter use', ans: 2, why: 'Teaching happens after stabilization.' },
        { t: 'Instruct on home medications', ans: 2, why: 'Discharge teaching comes last.' }
      ],
      rationale: 'Treat the airway first (oxygen, bronchodilators, steroid, monitoring). Teaching is only effective when the client can breathe and focus.' },
    { step: 'evaluate', type: 'cloze',
      chart: {
        notes: [{ time: '1330', text: 'Nebulizer treatments and methylprednisolone given. Denies shortness of breath. Breath sounds improving. Speaks in full sentences and tolerates activity. No fatigue.' }],
        vitals: { cols: ['1130', '1330'], rows: [['Temp', '98.2', '98.5'], ['HR', '108', '88'], ['RR', '25', '18'], ['BP', '122/72', '116/78'], ['SpO₂', '91% RA', '98% RA']] }
      },
      prompt: 'The nurse reassesses {name} at 1330 after implementing the orders. Complete the sentence.',
      parts: ['The client\'s status is ', { options: ['improving', 'deteriorating', 'unchanged'], ans: 0 }, ', so the nurse should now ',
        { options: ['prepare the client for discharge home', 'resume the breathing treatment', 'call a rapid response'], ans: 0 }, '.'],
      rationale: 'Dyspnea resolved, SpO₂ rose from 91% to 98% on room air, RR fell from 25 to 18, and he speaks in full sentences. Symptoms improved with steroids, albuterol, ipratropium and oxygen. Prepare for discharge with teaching.' }
  ],
  bowtie: {
    chart: {
      notes: [{ time: '1230', text: 'Bronchodilators and corticosteroid complete. Extreme labored breathing, confusion, increased heart rate. Blue-tinged lips, prolonged expiratory wheezing with chest tightness. Cannot catch breath lying down.' }],
      vitals: { cols: ['1100', '1130', '1230'], rows: [['HR', '98', '108', '128'], ['RR', '20', '25', '38'], ['BP', '114/78', '122/72', '142/88'], ['SpO₂', '95% RA', '93% RA', '85% RA']] }
    },
    prompt: 'A different afternoon: at 1230, after treatment, {name} is worse. Complete the bow-tie.',
    conditions: [{ t: 'Status asthmaticus', ok: true }, { t: 'Anaphylactic reaction', ok: false }, { t: 'Bronchiolitis', ok: false }, { t: 'Pulmonary edema', ok: false }],
    actions: [{ t: 'Administer high-flow oxygen', ok: true }, { t: 'Administer epinephrine', ok: true }, { t: 'Obtain sputum culture', ok: false }, { t: 'Suction airway', ok: false }, { t: 'Administer a diuretic', ok: false }],
    params: [{ t: 'Pulse oximetry', ok: true }, { t: 'Respirations', ok: true }, { t: 'Temperature', ok: false }, { t: 'Troponin', ok: false }, { t: 'Urine output', ok: false }],
    rationale: 'Status asthmaticus is a life-threatening attack that does not respond to standard bronchodilators and steroids. Give high-flow oxygen (non-rebreather) and epinephrine for a client who has not responded to albuterol. Monitor SpO₂ and respirations: muscle fatigue leads to respiratory failure; hypoxia causes the confusion.'
  }
});

window.CASES.push({
  id: 'resp-copd',
  title: 'COPD exacerbation with pneumonia',
  system: 'Respiratory',
  setting: 'Medical-Surgical Unit',
  patient: { sex: 'M', ageRange: [58, 72] },
  tagline: 'Fifty pack-years, a cold that turned rusty.',
  chart: {
    profile: 'Weight 65 kg. Allergies: penicillin, aspirin, milk products.',
    notes: [
      { time: 'Day 1 1300', text: 'Admitted from ED with moderate shortness of breath and a productive cough of purulent rust-colored sputum. Emphysema and chronic bronchitis since age 42; former 2 pack/day smoker × 25 years (50 pack-years) who restarted 6 months ago. Uses salmeterol/fluticasone inhaler q12h and ipratropium MDI 4×/day, plus "a pill for blood pressure, cholesterol and reflux." Caught a cold a week ago that worsened over 3 days. Weak and cachexic, poor appetite, too tired to eat. Mild clubbing of fingers. Unable to work at the chemical factory for months. Wants the pneumococcal vaccine but has not felt up to leaving the house. Sputum culture and chest X-ray pending.' }
    ],
    vitals: { cols: ['1300'], rows: [['Temp', '101.4 °F'], ['HR', '98'], ['RR', '28'], ['BP', '140/72'], ['SpO₂', '85% on 2 L']] },
    labs: [['K⁺', '4.2', '3.5–5.0'], ['Na⁺', '144', '135–145'], ['Glucose', '78', '< 99'], ['WBC', '14.2 k', '4.5–10.5 k'], ['ABG pH', '7.31', '7.35–7.45'], ['PaO₂', '72', '75–100'], ['PaCO₂', '51', '35–45'], ['HCO₃⁻', '28', '22–26']]
  },
  items: [
    { step: 'recognize', type: 'sata', n: 3,
      prompt: 'Which 3 assessment findings are most significant?',
      options: [
        { t: 'Temperature 101.4 °F', ok: true, why: 'Fever signals infection.' },
        { t: 'Pulse oximetry 85% on 2 L', ok: true, why: 'Below even the COPD target of 88–92%.' },
        { t: 'Productive cough of purulent rust-colored sputum', ok: true, why: 'Classic bacterial pneumonia.' },
        { t: 'Pulse 98', ok: false, why: 'Within normal limits.' },
        { t: 'BP 140/72', ok: false, why: 'Not urgent.' },
        { t: 'Poor appetite', ok: false, why: 'Will improve once infection resolves.' },
        { t: 'ABG PaCO₂ 51', ok: false, why: 'Expected: chronic CO₂ retention in COPD.' },
        { t: 'ABG HCO₃⁻ 28', ok: false, why: 'Expected renal compensation for chronic respiratory acidosis.' }
      ],
      rationale: 'Oxygenation is compromised (SpO₂ 85%). Purulent rust-colored sputum with fever indicates bacterial pneumonia. A mildly elevated CO₂ and bicarbonate are the COPD baseline, not an acute change. Remember: abnormal is not the same as urgent.' },
    { step: 'analyze', type: 'matrix', cols: ['Associated with COPD', 'Not associated'],
      prompt: 'For each finding, specify whether it is associated with COPD.',
      rows: [
        { t: 'Occupation at a chemical factory', ans: 0, why: 'Inhalation exposure damages lungs.' },
        { t: 'Hypertension', ans: 1, why: 'Not a COPD risk factor.' },
        { t: 'Pulse oximeter 87%', ans: 0, why: 'Hypoxemia from impaired gas exchange.' },
        { t: '50 pack-year smoking history', ans: 0, why: 'The number one cause.' },
        { t: 'Productive cough', ans: 0, why: 'Chronic bronchitis component.' },
        { t: 'Clubbing of the fingers', ans: 0, why: 'Sign of long-term hypoxia.' },
        { t: 'ABG PaCO₂ 51', ans: 0, why: 'Chronic respiratory acidosis from CO₂ retention.' },
        { t: 'Vaccine status', ans: 1, why: 'Relates to the pneumonia, not COPD itself.' }
      ],
      rationale: 'Group the cues: smoking history and occupational exposure caused the disease; clubbing and chronic CO₂ retention are its long-term effects; cough and low SpO₂ are the exacerbation.' },
    { step: 'prioritize', type: 'cloze',
      chart: { notes: [{ time: '1315', text: 'Chest X-ray back. Provider notified. Oxygen increased to 35% via Venturi mask. Sputum culture obtained.' }], diagnostics: ['Chest X-ray: left lower lobe pneumonia.'] },
      prompt: 'The chest X-ray returns and the provider is notified. Complete the sentence.',
      parts: ['The top priority for this client is to ', { options: ['reduce the temperature', 'improve the PaCO₂', 'evaluate nutritional intake', 'treat the pneumonia', 'assess readiness to stop smoking', 'address vaccination status'], ans: 3 }, '.'],
      rationale: 'Treat the source. Clearing the pneumonia will fix the fever and improve breathing and oxygenation. Nutrition, smoking and vaccines wait until he is stable. The fever is uncomfortable but not life-threatening.' },
    { step: 'generate', type: 'matrix', cols: ['Appropriate', 'Not appropriate'],
      prompt: 'For each potential intervention, specify whether it is appropriate for the plan of care.',
      rows: [
        { t: 'Administer IV methylprednisolone', ans: 0, why: 'Reduces airway inflammation.' },
        { t: 'Administer PO acetaminophen PRN for fever', ans: 0, why: 'Comfort and fever control.' },
        { t: 'Titrate oxygen to SpO₂ of at least 95%', ans: 1, why: 'COPD target is 88–92%; too much O₂ blunts the hypoxic drive.' },
        { t: 'Encourage flutter valve or Acapella every 2 hours', ans: 0, why: 'Positive expiratory pressure mobilizes secretions.' },
        { t: 'Administer PO cough suppressant', ans: 1, why: 'He needs to cough up purulent secretions.' },
        { t: 'Administer IV ampicillin/sulbactam', ans: 1, why: 'Contains a penicillin. He is allergic!' },
        { t: 'Restrict PO fluids', ans: 1, why: 'Fluids thin secretions.' },
        { t: 'Encourage pursed-lip breathing', ans: 0, why: 'Prolongs exhalation, releases trapped CO₂.' },
        { t: 'Monitor WBC', ans: 0, why: 'Tracks antibiotic effectiveness.' },
        { t: 'Encourage milk, ice cream and cheese for protein', ans: 1, why: 'Milk allergy, and dairy thickens mucus.' }
      ],
      rationale: 'Check the allergy band before every order. Penicillin-class antibiotics and dairy are both contraindicated here. Keep SpO₂ 88–92%, mobilize secretions, never suppress the cough.' },
    { step: 'action', type: 'sata', n: 5,
      chart: {
        notes: [{ time: '1400', text: 'RR 21; SpO₂ 87%; mild SOB with exertion; resting comfortably.' }, { time: 'Day 2 0900', text: 'Temp 98.8 °F after acetaminophen, two doses IV antibiotic and IV methylprednisolone. RR 18, SpO₂ 92% on 2 L NC. No SOB; up in chair, ate 75% of breakfast. Orders to discharge this afternoon.' }],
        labs: [['ABG pH (Day 2)', '7.32', '7.35–7.45'], ['PaO₂ (Day 2)', '88', '75–100'], ['PaCO₂ (Day 2)', '50', '35–45'], ['HCO₃⁻ (Day 2)', '26', '22–26']],
        orders: ['Discharge on home oxygen 2 L/min', 'Levofloxacin 500 mg PO daily', 'Prednisone 40 mg PO daily × 5 days', 'Roflumilast 500 mcg PO daily']
      },
      prompt: 'Day 2: the nurse prepares {name} for discharge. What should the nurse teach about the treatment plan? Select the 5 that apply.',
      options: [
        { t: 'Continue to increase fluid intake', ok: true, why: 'Thins secretions.' },
        { t: 'Continue flutter valve or Acapella 3–4 times daily', ok: true, why: 'Keeps mobilizing secretions.' },
        { t: 'Obtain pneumococcal and flu vaccines at the next visit', ok: true, why: 'Prevents future exacerbations.' },
        { t: 'Eat smaller, more frequent high-calorie, high-protein meals', ok: true, why: 'Optimizes intake when breathing makes eating tiring.' },
        { t: 'Consider strategies to stop smoking', ok: true, why: 'Never too late to benefit.' },
        { t: 'Stop the prednisone once you feel better', ok: false, why: 'Finish the steroid course as prescribed.' },
        { t: 'Increase oxygen to 5–6 L whenever short of breath', ok: false, why: 'Keep the lowest flow that holds SpO₂ 88–92%.' },
        { t: 'Avoid all exercise for 3 months', ok: false, why: 'Mild exercise as tolerated is important.' }
      ],
      rationale: 'Discharge teaching for COPD: fluids, airway clearance devices, vaccines, small frequent high-calorie meals, smoking cessation, complete all medications, low-flow oxygen, activity as tolerated.' },
    { step: 'evaluate', type: 'matrix', cols: ['Understanding', 'No understanding'],
      prompt: 'After discharge teaching, for each client statement specify whether it indicates understanding.',
      rows: [
        { t: '"I should take the prednisone in the morning with food."', ans: 0, why: 'Mimics diurnal cortisol, protects the stomach.' },
        { t: '"I can get back to my previous level of activity as I recover."', ans: 0, why: 'Activity as tolerated.' },
        { t: '"I can stop the antibiotic now that I feel better."', ans: 1, why: 'Finish the course to clear infection and prevent resistance.' },
        { t: '"I should use a spacer with my metered-dose inhalers."', ans: 0, why: 'Improves the dose delivered.' },
        { t: '"I can keep smoking since the damage is already done."', ans: 1, why: 'Quitting still slows decline.' },
        { t: '"I should do pursed-lip breathing several times daily."', ans: 0, why: 'Prolongs exhalation, releases CO₂.' },
        { t: '"I should avoid crowds during cold and flu season."', ans: 0, why: 'Reduces infection risk.' }
      ],
      rationale: 'Evaluate outcomes by what the client can say back to you. Two statements need re-teaching: stopping antibiotics early and continuing to smoke.' }
  ],
  bowtie: {
    prompt: 'Complete the bow-tie for {name} on admission (Day 1, 1300).',
    conditions: [{ t: 'Exacerbation of COPD', ok: true }, { t: 'Pulmonary edema', ok: false }, { t: 'Tension pneumothorax', ok: false }, { t: 'Pulmonary embolism', ok: false }],
    actions: [{ t: 'Administer IV glucocorticoid', ok: true }, { t: 'Administer IV antibiotic', ok: true }, { t: 'Administer cough suppressant', ok: false }, { t: 'Maintain client supine', ok: false }, { t: 'Assist with chest tube placement', ok: false }],
    params: [{ t: 'Arterial blood gases', ok: true }, { t: 'WBC', ok: true }, { t: 'Blood pressure', ok: false }, { t: 'Hematocrit', ok: false }, { t: 'Daily chest X-rays', ok: false }],
    rationale: 'COPD exacerbation caused by pneumonia: SOB, purulent rust-colored sputum, fever. Treat with IV steroid and antibiotic; trend ABGs and WBC. Never lay a short-of-breath client flat, and never suppress a productive cough.'
  }
});

window.CASES.push({
  id: 'resp-pneumonia-sepsis',
  title: 'Pneumonia that turns into sepsis',
  system: 'Respiratory',
  setting: 'Emergency Department → MICU',
  patient: { sex: 'M', ageRange: [34, 52] },
  tagline: 'A wet cough, then "I can\'t get enough air."',
  chart: {
    profile: 'Weight 80 kg. Smokes 2 packs/day, "a few beers on weekends."',
    notes: [
      { time: '0830', text: 'Brought in by {his} wife for increasing frequent wet cough and shortness of breath. Neuro WNL but somewhat lethargic. S1S2, peripheral pulses 1+ bilaterally, 2+ pretibial edema, denies chest pain. Coarse rales bilaterally, diminished in bases; mild chest tightness, no accessory muscle use; scattered wheezes and rhonchi; hyper-resonant to percussion; moderate kyphosis. Skin pale and moist. Sitting in high-Fowler\'s. Frequent wet cough productive of thick greenish-yellow secretions. O₂ 4 L NC started. Sepsis bundle initiated.' }
    ],
    vitals: { cols: ['0830'], rows: [['Temp', '101.8 °F'], ['HR', '114'], ['RR', '32'], ['BP', '98/60'], ['SpO₂', '92% RA']] },
    labs: [['pH', '7.47', '7.35–7.45'], ['PaCO₂', '34', '35–45'], ['HCO₃⁻', '22', '22–26'], ['PaO₂', '80', '80–100'], ['WBC', '16,000', '4.5–10.5 k'], ['Hgb', '12.8', '13–18'], ['Platelets', '245,000', '140–450 k'], ['Na⁺', '142', '135–145'], ['K⁺', '4.5', '3.5–5.0'], ['BUN', '12', '7–20'], ['Creatinine', '0.9', '0.6–1.2'], ['Glucose', '182', '70–99']]
  },
  items: [
    { step: 'recognize', type: 'sata', n: 4,
      prompt: 'Which 4 clinical findings require immediate reporting to the provider?',
      options: [
        { t: 'Heart rate 114', ok: true, why: 'Sympathetic response to tissue oxygen demand and possible early sepsis.' },
        { t: 'Respiratory rate 32', ok: true, why: 'Impaired gas exchange; also meets a sepsis criterion (> 22).' },
        { t: 'WBC 16,000', ok: true, why: 'Marked leukocytosis = infection.' },
        { t: 'Coarse rales bilaterally', ok: true, why: 'Fluid-filled alveoli; secretions consolidating.' },
        { t: 'Potassium 4.5', ok: false, why: 'Normal.' },
        { t: 'Hemoglobin 12.8', ok: false, why: 'Barely low, not urgent.' },
        { t: 'BUN 12', ok: false, why: 'Normal.' }
      ],
      rationale: 'Report the cues that show the body is straining: tachycardia, tachypnea, leukocytosis and worsening lung sounds. Normal labs are noise.' },
    { step: 'analyze', type: 'matrix', multi: true, cols: ['Pneumonia', 'COPD', 'Influenza'],
      prompt: 'For each finding, specify which condition(s) it is consistent with. Each finding may support more than one.',
      rows: [
        { t: 'Generalized muscle aches', ans: [0, 1, 2], why: 'Inflammation and frequent coughing cause aches in all three.' },
        { t: 'Wet cough productive of thick greenish-yellow secretions', ans: [0], why: 'Purulent sputum = bacterial pneumonia.' },
        { t: 'Coarse rales bilaterally, diminished in bases', ans: [0], why: 'Fluid/exudate in alveoli.' },
        { t: 'Temperature 101.8 °F', ans: [0, 1, 2], why: 'Fever accompanies infection or an infected COPD exacerbation.' },
        { t: 'Sinus tachycardia 114', ans: [0, 1], why: 'Meeting oxygen demand in pneumonia and COPD.' }
      ],
      rationale: 'Cues can belong to several hypotheses. Purulent sputum and rales are the cues that specifically point to pneumonia.' },
    { step: 'prioritize', type: 'cloze',
      prompt: 'Complete the sentence.',
      parts: ['{name} is at greatest risk for developing ', { options: ['dysrhythmias', 'hypoxia', 'deep vein thrombosis', 'cerebrovascular accident'], ans: 1 }, ' as evidenced by the ', { options: ['cardiovascular assessment', 'neurological assessment', 'neurovascular assessment', 'respiratory assessment'], ans: 3 }, '.'],
      rationale: 'Inflammatory exudate blocks gas exchange. The lungs compensate with a faster rate, but as secretions consolidate the client tips into hypoxia. The evidence is respiratory: RR 32, coarse and diminished breath sounds, falling SpO₂.' },
    { step: 'generate', type: 'matrix', cols: ['Indicated', 'Contraindicated'],
      prompt: 'For each potential intervention, specify whether it is indicated or contraindicated.',
      rows: [
        { t: 'Increase supplemental oxygen per order', ans: 0, why: 'Signs of respiratory distress.' },
        { t: 'Elevate the head of the bed 30–45°', ans: 0, why: 'Better chest expansion and gas exchange.' },
        { t: 'Restrict oral intake', ans: 1, why: 'Fluids thin secretions and improve perfusion.' },
        { t: 'Maintain O₂ saturation > 92%', ans: 0, why: 'Adequate oxygen for tissue perfusion.' },
        { t: 'Insert a peripheral IV', ans: 0, why: 'IV antibiotics and fluids are coming.' }
      ],
      rationale: 'Improve oxygenation, decrease work of breathing, thin secretions, and secure access for IV antibiotics.' },
    { step: 'action', type: 'sata', n: 4,
      prompt: 'From the list, identify the top 4 nursing interventions that are priority to implement for {name}.',
      options: [
        { t: 'Increase oxygen to 50% per Venturi mask', ok: true, why: 'Supplemental oxygen increases the oxygen available for gas exchange and perfusion.' },
        { t: 'Encourage oral fluids of at least 8 glasses of water per day', ok: true, why: 'Decreases the viscosity of secretions so they are easier to mobilize.' },
        { t: 'Promote turning side to side, coughing, and deep breathing every two hours while awake', ok: true, why: 'Increases lung expansion and mobilizes secretions. "If it sits, it either clots or cultures."' },
        { t: 'Elevate the head of the bed 30–45 degrees', ok: true, why: 'Better chest expansion and gas exchange.' },
        { t: 'Administer albuterol 2 puffs by inhalation PRN every 4–6 hours as prescribed', ok: false, why: 'Not among the four priorities for improving oxygenation in this client.' },
        { t: 'Instruct on incentive spirometer use every two hours while awake', ok: false, why: 'Helpful, but not one of the top four here.' }
      ],
      rationale: 'Priority nursing interventions are directed at improving oxygenation and decreasing work of breathing: elevate the head of the bed, add supplemental oxygen, increase fluids to thin secretions, and turn, cough and deep-breathe to expand the lungs and mobilize secretions. Decreased mobility promotes stasis of secretions: "If it sits, it either clots or cultures."' },
    { step: 'evaluate', type: 'sata', n: 5,
      prompt: 'Later in the week: which findings tell the nurse the interventions for pneumonia were effective? Select the 5 that apply.',
      options: [
        { t: 'WBC within normal limits', ok: true, why: 'Infection clearing.' },
        { t: 'No fever; HR and RR within normal limits', ok: true, why: 'Body no longer straining.' },
        { t: 'Clear lung sounds', ok: true, why: 'Alveoli cleared of exudate.' },
        { t: 'SpO₂ on room air within normal limits', ok: true, why: 'Gas exchange restored.' },
        { t: 'Increased appetite and activity, consistent nicotine patch use', ok: true, why: 'Recovery plus prevention.' },
        { t: 'Client reports the cough is gone because he takes cough suppressant hourly', ok: false, why: 'Suppressing a productive cough traps secretions.' },
        { t: 'Urine output 15 mL/hr', ok: false, why: 'Oliguria signals poor perfusion.' }
      ],
      rationale: 'Evaluation closes the loop: compare the outcome data against the original cues. Normal WBC, vitals, breath sounds and SpO₂ on room air are your proof.' }
  ]
});

window.CASES.push({
  id: 'resp-arf',
  title: 'Acute respiratory failure in the ICU',
  system: 'Respiratory',
  setting: 'Medical ICU',
  patient: { sex: 'F', ageRange: [70, 86] },
  tagline: 'On a non-rebreather and still 87%.',
  chart: {
    notes: [
      { time: '0900', text: 'Admitted to the ICU in respiratory distress after minimal response to high-flow oxygen for SpO₂ 83% on room air. Crackles bilaterally in lower lobes, diminished right middle lobe. S1S2. Bowel sounds ×4. Skin warm, dry, intact. Pain 0/10.' }
    ],
    vitals: { cols: ['0900'], rows: [['Temp', '99.8 °F'], ['HR', '110'], ['RR', '30'], ['BP', '168/90'], ['SpO₂', '87% on 100% NRB']] },
    labs: [['pH', '7.20', '7.35–7.45'], ['PaO₂', '75', '75–100'], ['PaCO₂', '51', '35–45'], ['HCO₃⁻', '28', '22–26'], ['WBC', '35,000', '4.5–10.5 k'], ['Platelets', '250,000', '140–450 k'], ['K⁺', '4.0', '3.5–5.0'], ['Na⁺', '140', '135–145'], ['Mg²⁺', '1.5', '1.5–2.1'], ['Lactate', '4.5', '0.5–2.2'], ['Blood culture', 'Gram-negative cocci', 'negative'], ['Urine / sputum culture', 'pending', 'negative']]
  },
  items: [
    { step: 'recognize', type: 'sata', n: 4,
      prompt: 'Which 4 findings are most urgent?',
      options: [
        { t: 'pH 7.20', ok: true, why: 'Severe acidemia.' },
        { t: 'PaCO₂ 51', ok: true, why: 'CO₂ retention: ventilation is failing.' },
        { t: 'Respiratory rate 30', ok: true, why: 'Tachypnea, heading for exhaustion.' },
        { t: 'SpO₂ 87% on 100% non-rebreather', ok: true, why: 'Refractory hypoxemia despite maximum oxygen.' },
        { t: 'BP 168/90', ok: false, why: 'Elevated but not critical.' },
        { t: 'WBC 35,000', ok: false, why: 'Infection, but the respiratory failure will kill first.' },
        { t: 'Lactate 4.5', ok: false, why: 'Important for sepsis, but oxygenation is the immediate threat.' },
        { t: 'Gram-negative cocci', ok: false, why: 'Guides antibiotics, not the immediate threat.' }
      ],
      rationale: 'She has infection AND respiratory failure. The most urgent cues are the ones that describe the failure: acidosis, rising CO₂, tachypnea, and hypoxemia that oxygen cannot fix.' },
    { step: 'analyze', type: 'matrix', multi: true, cols: ['Acute respiratory failure', 'Pneumonia'],
      prompt: 'For each finding, indicate which condition(s) it is consistent with. Each finding may support more than one.',
      rows: [
        { t: 'Crackles in bilateral lower lobes', ans: [0, 1], why: 'Common to both.' },
        { t: 'SpO₂ 87% on 100% oxygen', ans: [0, 1], why: 'Either condition can cause low oxygen.' },
        { t: 'PaCO₂ 51', ans: [0], why: 'Hypercapnia defines ventilatory failure.' },
        { t: 'pH 7.20', ans: [0], why: 'Respiratory acidosis = failure.' }
      ],
      rationale: 'Shared cues (crackles, hypoxemia) cannot separate the hypotheses. The ABG does: a high PaCO₂ with a low pH is respiratory failure.' },
    { step: 'prioritize', type: 'single',
      prompt: 'What does the nurse determine is the priority for {name}\'s care?',
      options: [
        { t: 'Intubating for mechanical ventilation support', ok: true, why: 'Maximum oxygen has failed; she needs ventilation.' },
        { t: 'Administering corticosteroids to reduce inflammation', ok: false, why: 'Part of the plan, not the priority.' },
        { t: 'Opening airways with aerosol treatments', ok: false, why: 'Not as critical as ventilation.' },
        { t: 'Treating the infection with antibiotics', ok: false, why: 'Next, after the airway is secured.' }
      ],
      rationale: 'Acute respiratory failure means the lungs cannot oxygenate or ventilate. She has failed 100% oxygen by non-rebreather, so mechanical ventilation comes first. Antibiotics for the pneumonia come right after.' },
    { step: 'generate', type: 'matrix', cols: ['Indicated', 'Not indicated'],
      chart: { notes: [{ time: '0930', text: 'Intubated with #6 ETT; assist-control ventilation rate 14, PEEP 5, FiO₂ 60%. Restless.' }], vitals: { cols: ['0930'], rows: [['Temp', '99.8 °F'], ['HR', '110'], ['RR', '14'], ['BP', '180/90'], ['SpO₂', '96% on 60%']] } },
      prompt: 'The nurse plans care after mechanical ventilation begins. For each intervention, specify whether it is indicated.',
      rows: [
        { t: 'Administer sedatives', ans: 0, why: 'Prevents fighting the ventilator and self-extubation.' },
        { t: 'Repeat chest X-ray', ans: 0, why: 'Confirms ETT placement.' },
        { t: 'Schedule suctioning every 2 hours', ans: 1, why: 'Suction as needed only; routine suctioning damages the trachea.' },
        { t: 'Administer amiodarone', ans: 1, why: 'No dysrhythmia identified.' },
        { t: 'Administer IV antibiotics', ans: 0, why: 'Treat the pneumonia.' },
        { t: 'Position supine with head midline', ans: 1, why: 'Semi-Fowler\'s or prone helps drainage and oxygenation.' },
        { t: 'Obtain an electrocardiogram', ans: 0, why: 'Tachycardia and hypertension warrant a rhythm check.' }
      ],
      rationale: 'After intubation: sedate, confirm tube placement by X-ray, treat the infection, check the rhythm. Suction PRN, never on a schedule. Keep the head of bed up.' },
    { step: 'action', type: 'sata', n: 3,
      chart: { orders: ['Nursing: insert urinary catheter; suction ETT PRN; titrate O₂ to keep SpO₂ ≥ 95%', 'Medications: start 0.9% NaCl at 75 mL/hr; amoxicillin 500 mg IVPB q12h; midazolam 2–4 mg IVP q1h PRN agitation; acetaminophen 650 mg PR q8h PRN temp > 100.8 °F', 'Monitoring: 12-lead ECG; chest X-ray; blood gas in 30 minutes'] },
      prompt: 'The nurse receives orders. Which 3 orders should the nurse implement first?',
      options: [
        { t: 'Call for chest X-ray', ok: true, why: 'Confirm ETT placement.' },
        { t: 'Start IV of 0.9% normal saline at 75 mL/hr', ok: true, why: 'No venous access yet; needed for every medication.' },
        { t: 'Midazolam 2–4 mg IVP for agitation', ok: true, why: 'Restless, BP 180/90: risk of self-extubation.' },
        { t: 'Perform 12-lead ECG', ok: false, why: 'Next, after the three above.' },
        { t: 'Amoxicillin 500 mg IVPB every 12 hours', ok: false, why: 'Next, after IV access is established.' },
        { t: 'Titrate oxygen to keep SpO₂ ≥ 95%', ok: false, why: 'Already 96%; no change needed.' },
        { t: 'Suction endotracheal tube', ok: false, why: 'No indication right now.' },
        { t: 'Blood gas in 30 minutes', ok: false, why: 'Not yet due.' },
        { t: 'Insert urinary catheter', ok: false, why: 'Can wait.' }
      ],
      rationale: 'Sequence by risk of delay: confirm the tube, get access, calm the agitation before she pulls the tube. ECG and antibiotics follow. Oxygen is already above goal, no suction cue, gas not due, catheter can wait.' },
    { step: 'evaluate', type: 'trend',
      chart: { notes: [{ time: '1000', text: 'Chest X-ray obtained. IV placed, midazolam given. ECG: sinus tachycardia. Drowsy, sedation scale −1.' }], vitals: { cols: ['1000'], rows: [['Temp', '99.8 °F'], ['HR', '100'], ['RR', '14'], ['BP', '150/70'], ['SpO₂', '93% on 60%']] } },
      prompt: 'The nurse reassesses at 1000 and compares to 0930. For each finding, specify whether the status improved, declined, or is unchanged.',
      rows: [
        { t: 'Heart rate', before: '110', after: '100', ans: 'improved', why: 'Down toward normal.' },
        { t: 'Temperature', before: '99.8', after: '99.8', ans: 'unchanged', why: 'Same.' },
        { t: 'Respiratory rate', before: '14', after: '14', ans: 'unchanged', why: 'Set by the ventilator.' },
        { t: 'Blood pressure', before: '180/90', after: '150/70', ans: 'improved', why: 'Down from hypertensive.' },
        { t: 'Pulse oximetry', before: '96%', after: '93%', ans: 'declined', why: 'Slight drop: assess lung sounds, consider suction or vent changes.' },
        { t: 'Agitation', before: 'restless', after: 'drowsy (−1)', ans: 'improved', why: 'Sedation working.' }
      ],
      rationale: 'Evaluate each parameter against the previous value, not against normal. The one that declined (SpO₂) is the one you act on next.' }
  ]
});
