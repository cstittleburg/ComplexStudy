/* Generated (not from the course packet). Archived on request; not loaded by index.html. */
window.CASES = window.CASES || [];

window.CASES.push({
  id: 'resp-pe',
  title: 'Sudden dyspnea after surgery',
  system: 'Respiratory',
  setting: 'Orthopedic Unit',
  patient: { sex: 'F', ageRange: [48, 66] },
  tagline: 'Post-op day 2 and "something is wrong, I can\'t breathe."',
  chart: {
    profile: 'Post-op day 2, right total knee arthroplasty. History: obesity, oral contraceptive use until last year, smoker. Refused sequential compression devices overnight.',
    notes: [
      { time: '0640', text: 'Called to room by call light. {name} sitting bolt upright, anxious, reports sudden sharp right-sided chest pain that is worse with breathing and "a feeling that something terrible is about to happen." Coughed once with a streak of blood. Right calf swollen and tender compared to left. Skin pale and diaphoretic.' }
    ],
    vitals: { cols: ['0200', '0640'], rows: [['Temp', '98.9', '99.1'], ['HR', '84', '124'], ['RR', '16', '30'], ['BP', '128/76', '104/62'], ['SpO₂', '96% RA', '88% RA']] },
    labs: [['D-dimer', 'elevated', 'normal'], ['pH', '7.49', '7.35–7.45'], ['PaCO₂', '30', '35–45'], ['PaO₂', '62', '80–100'], ['HCO₃⁻', '23', '22–26']]
  },
  items: [
    { step: 'recognize', type: 'highlight',
      prompt: 'Click to highlight the cues in the note that require immediate follow-up.',
      text: [{ t: 'Sitting bolt upright, anxious', ok: true, why: 'Distress and a sense of doom.' }, ', reports ', { t: 'sudden sharp right-sided chest pain worse with breathing', ok: true, why: 'Pleuritic chest pain.' }, ' and a feeling that something terrible is about to happen. ', { t: 'Coughed once with a streak of blood', ok: true, why: 'Hemoptysis.' }, '. ', { t: 'Right calf swollen and tender', ok: true, why: 'Deep vein thrombosis: the likely source.' }, ' compared to left. Dressing on the knee is dry and intact. ', { t: 'Skin pale and diaphoretic', ok: true, why: 'Poor perfusion, sympathetic response.' }, '. Ate 50% of dinner last evening.'],
      rationale: 'Sudden dyspnea, pleuritic pain, hemoptysis, anxiety and a swollen calf in a post-op client are the textbook picture of pulmonary embolism. The dressing and the dinner are noise.' },
    { step: 'analyze', type: 'matrix', cols: ['Risk factor for PE', 'Not a risk factor'],
      prompt: 'For each item from the history, specify whether it is a risk factor for pulmonary embolism.',
      rows: [
        { t: 'Recent orthopedic surgery', ans: 0, why: 'Trauma to vessels + immobility.' },
        { t: 'Refused sequential compression devices', ans: 0, why: 'Venous stasis.' },
        { t: 'Obesity', ans: 0, why: 'Hypercoagulability and stasis.' },
        { t: 'Smoking', ans: 0, why: 'Vessel injury and clotting.' },
        { t: 'History of oral contraceptive use', ans: 0, why: 'Estrogen increases clotting.' },
        { t: 'Ate 50% of dinner', ans: 1, why: 'Irrelevant.' },
        { t: 'Blood type O', ans: 1, why: 'Not a recognized risk factor for this exam.' }
      ],
      rationale: 'Virchow\'s triad: stasis (immobility, no SCDs), vessel injury (surgery), and hypercoagulability (estrogen, smoking, obesity).' },
    { step: 'prioritize', type: 'cloze',
      prompt: 'Complete the sentence.',
      parts: ['{name} is most likely experiencing a ', { options: ['pulmonary embolism', 'myocardial infarction', 'pneumothorax', 'panic attack'], ans: 0 }, ', and the ABG shows ', { options: ['respiratory alkalosis from hyperventilation', 'respiratory acidosis from hypoventilation', 'metabolic acidosis from shock', 'a normal result'], ans: 0 }, '.'],
      rationale: 'pH 7.49 with PaCO₂ 30: she is blowing off CO₂ (respiratory alkalosis) while remaining hypoxemic (PaO₂ 62). That combination, with pleuritic pain, hemoptysis and a DVT, is PE until proven otherwise. A panic attack does not drop PaO₂ to 62.' },
    { step: 'generate', type: 'sata', n: 5,
      prompt: 'Which interventions should the nurse anticipate? Select the 5 that apply.',
      options: [
        { t: 'Apply oxygen and titrate to SpO₂ goal', ok: true, why: 'Correct the hypoxemia.' },
        { t: 'Keep in high-Fowler\'s position', ok: true, why: 'Eases breathing.' },
        { t: 'Establish IV access and prepare for IV heparin', ok: true, why: 'Anticoagulation prevents clot extension.' },
        { t: 'Prepare for CT pulmonary angiography', ok: true, why: 'Preferred diagnostic test.' },
        { t: 'Continuous cardiac monitoring and frequent vital signs', ok: true, why: 'Watch for shock and dysrhythmia.' },
        { t: 'Massage the swollen calf to improve circulation', ok: false, why: 'Could dislodge more clot.' },
        { t: 'Ambulate in the hall to prevent further clots', ok: false, why: 'Bed rest during the acute phase.' },
        { t: 'Give aspirin 81 mg as the anticoagulant', ok: false, why: 'Aspirin is antiplatelet; PE needs heparin or a DOAC.' }
      ],
      rationale: 'Oxygen, positioning, IV access, anticoagulation, monitoring, and imaging. Never massage a DVT, and rest until anticoagulated.' },
    { step: 'action', type: 'order',
      prompt: 'Place the nurse\'s actions in the order they should be performed.',
      items: [
        { t: 'Apply oxygen and raise the head of the bed' },
        { t: 'Notify the provider / rapid response with SBAR including the trend' },
        { t: 'Obtain IV access and prepare anticoagulant as ordered' },
        { t: 'Send for CT pulmonary angiography as ordered' },
        { t: 'Teach about bleeding precautions with anticoagulants' }
      ],
      rationale: 'Airway and breathing first, then escalate with the trend (HR 84 → 124, SpO₂ 96 → 88), then treatment, then diagnostics, then teaching.' },
    { step: 'evaluate', type: 'trend',
      prompt: 'Two hours after oxygen and heparin: for each finding, specify whether it improved, declined or is unchanged.',
      rows: [
        { t: 'Heart rate', before: '124', after: '98', ans: 'improved', why: 'Less strain.' },
        { t: 'SpO₂', before: '88% RA', after: '95% on 4 L', ans: 'improved', why: 'Oxygenation restored.' },
        { t: 'Chest pain', before: '8/10 pleuritic', after: '3/10', ans: 'improved', why: 'Less inflammation.' },
        { t: 'Calf swelling', before: 'swollen, tender', after: 'swollen, tender', ans: 'unchanged', why: 'DVT takes time.' },
        { t: 'Gums', before: 'no bleeding', after: 'oozing when brushing', ans: 'declined', why: 'Heparin side effect: report and check aPTT.' }
      ],
      rationale: 'Improvement is shown by the original cues resolving. A new cue (gum bleeding) is a new hypothesis: anticoagulant excess. Check aPTT and report.' }
  ],
  bowtie: {
    prompt: 'Complete the bow-tie for {name} at 0640.',
    conditions: [{ t: 'Pulmonary embolism', ok: true }, { t: 'Pneumonia', ok: false }, { t: 'Acute asthma', ok: false }, { t: 'Cardiac tamponade', ok: false }],
    actions: [{ t: 'Administer oxygen', ok: true }, { t: 'Prepare anticoagulant therapy', ok: true }, { t: 'Massage the calf', ok: false }, { t: 'Encourage ambulation', ok: false }, { t: 'Administer a cough suppressant', ok: false }],
    params: [{ t: 'SpO₂ and respiratory rate', ok: true }, { t: 'Signs of bleeding / aPTT', ok: true }, { t: 'Peak flow', ok: false }, { t: 'Sputum color', ok: false }, { t: 'Bowel sounds', ok: false }],
    rationale: 'PE: sudden dyspnea, pleuritic pain, hemoptysis, hypoxemia, DVT source. Actions: oxygen and anticoagulation. Monitor oxygenation and for bleeding once anticoagulated.'
  }
});
