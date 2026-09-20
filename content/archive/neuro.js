/* Neurological unfolding cases — built from the Week 2 "Complex Cases: Neurological Conditions" deck
   (stroke, increased ICP, spinal cord injury, autonomic dysreflexia, seizure). */
window.CASES = window.CASES || [];

window.CASES.push({
  id: 'neuro-stroke',
  title: 'Something is different about Lan',
  system: 'Neuro',
  setting: 'Medical Unit → Stroke pathway',
  patient: { sex: 'F', ageRange: [62, 79], names: ['Lan', 'Hoa', 'Linh', 'Mai Anh'] },
  hook: 'Time is brain. Sugar first, CT before pill: no aspirin till you know it\'s not a bleed.',
  tagline: '12:18 PM. Her daughter says, "She isn\'t talking right."',
  chart: {
    profile: 'Admitted yesterday for dizziness and dehydration. History: hypertension, type 2 diabetes, atrial fibrillation. Vietnamese is her preferred language. Daughter, Mai, at the bedside.',
    notes: [
      { time: '12:18', text: 'Daughter states, "Something is wrong with my mom. She isn\'t talking right."' },
      { time: '12:22', text: 'Neuro check: awake, follows simple commands inconsistently. New expressive difficulty with dysarthria. Right facial droop. Right arm drift, right grip weaker. Pupils 3 mm, equal and brisk. POC glucose 104.' }
    ],
    vitals: { cols: ['12:22'], rows: [['BP', '176/94'], ['HR', '88 irregular'], ['RR', '18'], ['SpO₂', '97% RA'], ['Glucose', '104']] }
  },
  items: [
    { step: 'recognize', type: 'sata', n: 4,
      prompt: 'Which findings are the strongest changes from {name}\'s baseline? Select the 4 that apply.',
      options: [
        { t: 'New expressive difficulty and dysarthria', ok: true, why: 'New language deficit.' },
        { t: 'Right facial droop', ok: true, why: 'New focal deficit.' },
        { t: 'Right arm drift with weaker right grip', ok: true, why: 'New unilateral weakness.' },
        { t: 'Follows commands inconsistently', ok: true, why: 'Change in cognition.' },
        { t: 'Pupils 3 mm, equal and brisk', ok: false, why: 'Normal, and reassuring against a global process.' },
        { t: 'POC glucose 104', ok: false, why: 'Normal. Rules out hypoglycemia as the mimic.' },
        { t: 'Vietnamese is her preferred language', ok: false, why: 'Important for communication, but not a change from baseline.' }
      ],
      rationale: 'Start with what changed. Speech, face, arm, and cognition are all new and all on one side. Normal pupils and normal glucose are useful negatives, not cues of deterioration.' },
    { step: 'analyze', type: 'matrix', cols: ['Focal change', 'Global deterioration', 'Neither'],
      prompt: 'Sort each finding: is it a focal neurological change, a sign of global deterioration, or neither?',
      rows: [
        { t: 'Right facial droop', ans: 0, why: 'One-sided = focal.' },
        { t: 'Aphasia / dysarthria', ans: 0, why: 'Language center on one side.' },
        { t: 'Right arm drift', ans: 0, why: 'Unilateral weakness.' },
        { t: 'Declining level of consciousness', ans: 1, why: 'Whole brain affected.' },
        { t: 'Unequal or non-reactive pupils', ans: 1, why: 'Pressure on the brainstem.' },
        { t: 'Irregular atrial fibrillation rhythm', ans: 2, why: 'A cardiac risk factor (clot source), not a neuro finding.' }
      ],
      rationale: 'Focal signs (one side of face, arm, or speech) point to a vessel territory: stroke. Global signs (LOC, pupils, vomiting, breathing pattern) point to rising intracranial pressure. {name}\'s findings are focal, and her A-fib is the likely clot source.' },
    { step: 'prioritize', type: 'cloze',
      chart: { notes: [{ time: '12:24', text: 'Last known well 11:40. CT scanner available now. Video interpreter ETA 8 minutes. Mai: "I can translate for her." {name} gives inconsistent yes/no responses.' }] },
      prompt: 'Complete the sentence with the worst reasonable explanation.',
      parts: ['The priority hypothesis is ', { options: ['acute stroke', 'hypoglycemia', 'delirium from dehydration', 'Bell\'s palsy'], ans: 0 }, ', and the most important number right now is the ', { options: ['last known well time (11:40)', 'blood pressure (176/94)', 'heart rate (88)', 'SpO₂ (97%)'], ans: 0 }, '.'],
      rationale: 'Sudden one-sided deficits in a client with atrial fibrillation = stroke until proven otherwise. Glucose is normal, so hypoglycemia is excluded. The treatment window is counted from last known well, so 11:40 is the clock that is running.' },
    { step: 'generate', type: 'sata', n: 3,
      prompt: '{name}\'s first five minutes. Select the THREE immediate actions (one option is unsafe).',
      options: [
        { t: 'Activate the stroke response and notify the appropriate team', ok: true, why: 'Starts the pathway; imaging, neurology, pharmacy all move in parallel.' },
        { t: 'Check point-of-care glucose while continuing the focused assessment', ok: true, why: 'Hypoglycemia mimics stroke.' },
        { t: 'Keep NPO and prepare for urgent non-contrast head CT', ok: true, why: 'Aspiration risk; CT decides bleed vs clot.' },
        { t: 'Give aspirin immediately before imaging', ok: false, why: 'UNSAFE: could worsen a hemorrhage. Nothing antithrombotic before the CT excludes bleeding.' }
      ],
      rationale: 'What can happen simultaneously so nothing delays the pathway: activate, glucose, NPO and CT. Aspirin waits until hemorrhage is excluded.' },
    { step: 'action', type: 'single',
      chart: { notes: [{ time: '12:51', text: 'Imaging back.' }], diagnostics: ['Non-contrast CT: no acute intracranial hemorrhage.', 'CTA: left M1 large-vessel occlusion.', 'NIHSS 12; aphasia and right weakness are disabling.', 'Platelets 226,000, INR 1.0. Current BP 174/92.'] },
      prompt: 'Which recommendation best reflects {name}\'s current data?',
      options: [
        { t: 'Begin an eligible IV thrombolytic pathway and urgently evaluate for thrombectomy', ok: true, why: 'Ischemic stroke, no bleed, within the window, with a large-vessel occlusion.' },
        { t: 'Delay all treatment until MRI confirms infarction', ok: false, why: 'MRI is not required before eligible reperfusion.' },
        { t: 'Give aspirin and reassess the neuro exam in one hour', ok: false, why: 'Aspirin does not replace reperfusion in an eligible client.' },
        { t: 'Lower systolic pressure below 120 before any reperfusion decision', ok: false, why: 'Would starve the brain. Threshold for thrombolysis is < 185/110.' }
      ],
      rationale: 'No hemorrhage + disabling deficits + inside the window = reperfusion. With a large-vessel occlusion, thrombectomy evaluation happens in parallel, not after waiting to see whether thrombolysis works. BP only has to be below 185/110.' },
    { step: 'evaluate', type: 'order',
      chart: { notes: [{ time: '13:35', text: 'During alteplase: sudden severe headache, vomiting, difficult to arouse. New sluggish left pupil.' }], vitals: { cols: ['13:35'], rows: [['BP', '184/102'], ['SpO₂', '93%']] } },
      prompt: '{name} deteriorates during the alteplase infusion. Put the nurse\'s response in order.',
      items: [
        { t: 'STOP the alteplase infusion' },
        { t: 'ESCALATE: activate the emergency/stroke response and notify the provider' },
        { t: 'STABILIZE: airway, oxygenation, circulation, positioning' },
        { t: 'CONFIRM: prepare for emergent CT and ordered labs' }
      ],
      rationale: 'Acute decline after thrombolysis is hemorrhage until excluded. Stop. Escalate. Stabilize. Confirm. Then reassess LOC, pupils, motor, airway and BP continuously. A new change needs a new hypothesis.' }
  ],
  bowtie: {
    prompt: 'Complete the bow-tie for {name} at 13:35, during the alteplase infusion.',
    conditions: [{ t: 'Intracranial hemorrhage', ok: true }, { t: 'Recurrent ischemic stroke', ok: false }, { t: 'Hypoglycemia', ok: false }, { t: 'Anxiety reaction', ok: false }],
    actions: [{ t: 'Stop the alteplase infusion', ok: true }, { t: 'Activate emergency response and prepare for CT', ok: true }, { t: 'Increase the alteplase rate to finish faster', ok: false }, { t: 'Give aspirin', ok: false }, { t: 'Lay flat and dim the lights', ok: false }],
    params: [{ t: 'Level of consciousness and pupils', ok: true }, { t: 'Blood pressure', ok: true }, { t: 'Urine output', ok: false }, { t: 'Bowel sounds', ok: false }, { t: 'Peak flow', ok: false }],
    rationale: 'Severe headache, vomiting, falling LOC and a new sluggish pupil during a thrombolytic = bleeding. Stop the drug, escalate, and monitor the neuro exam and BP minute to minute.'
  }
});

window.CASES.push({
  id: 'neuro-icp',
  title: 'Jordan is deteriorating',
  system: 'Neuro',
  setting: 'Trauma / Neuro Unit',
  patient: { sex: 'M', ageRange: [19, 41], names: ['Jordan', 'Devin', 'Tyler', 'Malik'] },
  hook: 'Cushing\'s triad: pressure HIGH, pulse LOW, breathing WEIRD. The skull has no room to spare.',
  tagline: 'GCS 14 at noon. Thirty minutes later he is vomiting.',
  chart: {
    profile: 'Fell from a ladder this morning; head strike, brief loss of consciousness. Admitted for observation.',
    notes: [{ time: '12:30', text: 'Alert. GCS 14. Pupils 3 mm brisk bilaterally. Moves all extremities. Headache 4/10.' }],
    vitals: { cols: ['12:30'], rows: [['BP', '142/78'], ['HR', '82'], ['RR', '16 regular'], ['SpO₂', '97% RA']] }
  },
  items: [
    { step: 'recognize', type: 'trend',
      chart: { notes: [{ time: '13:15', text: 'Drowsy, arouses to voice. GCS 11 (E3 V3 M5). Repeated vomiting. Left pupil 5 mm, sluggish. Right side weaker, localizes to pain. Respirations becoming irregular.' }], vitals: { cols: ['12:45', '13:00', '13:15'], rows: [['BP', '150/74', '158/66', '168/58'], ['HR', '76', '61', '52'], ['RR', '16', '14', '12 irregular'], ['SpO₂', '97%', '96%', '95%']] } },
      prompt: 'Chart the trend from 12:30 to 13:15. For each row, is {name} improving, declining, or unchanged?',
      rows: [
        { t: 'Level of consciousness', before: 'Alert', after: 'Drowsy, arouses to voice', ans: 'declined', why: 'LOC is the earliest, most sensitive sign of rising ICP.' },
        { t: 'GCS', before: '14', after: '11', ans: 'declined', why: 'A drop of 2 or more points is an emergency.' },
        { t: 'Left pupil', before: '3 mm brisk', after: '5 mm sluggish', ans: 'declined', why: 'Pressure on cranial nerve III.' },
        { t: 'Motor', before: 'Moves ×4', after: 'Right weaker, localizes', ans: 'declined', why: 'New focal weakness opposite the pupil.' },
        { t: 'Emesis', before: 'none', after: 'repeated', ans: 'declined', why: 'Vomiting without nausea = pressure.' },
        { t: 'BP / HR', before: '142/78 • 82', after: '168/58 • 52', ans: 'declined', why: 'Widening pulse pressure with bradycardia: Cushing\'s.' },
        { t: 'SpO₂', before: '97%', after: '95%', ans: 'unchanged', why: 'Within normal; not the row to escalate on.' }
      ],
      rationale: 'A score is only useful when you interpret the change. Every neuro row is worsening in the same direction, which is exactly the pattern of rising intracranial pressure. The oxygen saturation is the distractor.' },
    { step: 'analyze', type: 'sata', n: 3,
      prompt: 'Which THREE findings together make up Cushing\'s triad, the late sign that compensation is failing?',
      options: [
        { t: 'Rising systolic BP with widening pulse pressure (168/58)', ok: true, why: 'The brain forces perfusion pressure up.' },
        { t: 'Bradycardia (HR 52)', ok: true, why: 'Reflex slowing.' },
        { t: 'Irregular respirations', ok: true, why: 'Brainstem compression.' },
        { t: 'Repeated vomiting', ok: false, why: 'A sign of ICP but not part of the triad.' },
        { t: 'Sluggish dilated pupil', ok: false, why: 'Sign of herniation pressure, not part of the triad.' },
        { t: 'Headache', ok: false, why: 'Early, non-specific.' }
      ],
      rationale: 'Cushing\'s triad: hypertension with widening pulse pressure, bradycardia, irregular breathing. Memory hook: pressure HIGH, pulse LOW, breathing WEIRD. It is late. Do not wait for it.' },
    { step: 'prioritize', type: 'single',
      prompt: 'What is the worst reasonable explanation that connects the trend?',
      options: [
        { t: 'Expanding intracranial hematoma causing rising ICP and impending herniation', ok: true, why: 'Lucid interval after head trauma then rapid decline = classic epidural pattern.' },
        { t: 'Motion sickness from the transport stretcher', ok: false, why: 'Does not explain pupils or GCS.' },
        { t: 'Anxiety about hospitalization', ok: false, why: 'Anxiety raises HR; his is falling.' },
        { t: 'Opioid over-sedation from pain medication', ok: false, why: 'Would give small pupils and slow, regular breathing, not a unilateral dilated pupil.' }
      ],
      rationale: 'Brief LOC, awake and talking, then sudden decline with one blown pupil is the deceptive lucid interval of an epidural hematoma. Blood is filling a fixed box; the next step is herniation.' },
    { step: 'generate', type: 'sata', n: 2,
      prompt: 'Two of these actions would HARM {name}. Select the two harmful actions.',
      options: [
        { t: 'Perform repeated deep suctioning to stimulate a response', ok: true, why: 'Suctioning spikes ICP.' },
        { t: 'Place flat with hips flexed to increase venous return', ok: true, why: 'Flat and flexed blocks venous drainage from the head; ICP rises.' },
        { t: 'Activate the trauma/neurosurgical emergency response and report the trend', ok: false, why: 'Safe and necessary.' },
        { t: 'Support airway and oxygenation while maintaining cervical alignment', ok: false, why: 'Hypoxia and hypercapnia raise ICP; protect the spine.' },
        { t: 'Elevate the head of bed as permitted; keep head and neck neutral', ok: false, why: 'Promotes venous drainage.' },
        { t: 'Prepare for emergent imaging and ordered ICP-directed therapy', ok: false, why: 'Mannitol or hypertonic saline, possible surgery.' }
      ],
      rationale: 'Anything that raises ICP is harmful: suctioning, coughing, hip flexion, lying flat, neck rotation, Valsalva, hypoxia, hypercapnia. Everything that drains or decompresses is safe.' },
    { step: 'action', type: 'order',
      prompt: 'Rank {name}\'s first four nursing actions. This is sequencing while calling for help.',
      items: [
        { t: 'Activate the trauma/neurosurgical emergency response and report the trend' },
        { t: 'Support airway and oxygenation while maintaining cervical alignment' },
        { t: 'Elevate HOB as permitted; keep head and neck neutral' },
        { t: 'Prepare for emergent imaging and ordered ICP-directed therapy' }
      ],
      rationale: 'Call for help first because you cannot decompress a skull at the bedside, then protect the airway (hypoxia raises ICP), then position to drain, then prepare for CT and osmotic therapy. Defend the order with the cue: a blown pupil is minutes from herniation.' },
    { step: 'evaluate', type: 'matrix', cols: ['Meaningful improvement', 'False reassurance'],
      prompt: 'After treatment, sort each observation: is it meaningful improvement or false reassurance?',
      rows: [
        { t: 'GCS trends back toward baseline', ans: 0, why: 'The brain is waking up.' },
        { t: 'Pupils become equal and reactive', ans: 0, why: 'Pressure off the nerve.' },
        { t: 'Motor response improves', ans: 0, why: 'Real recovery.' },
        { t: 'Client becomes quieter', ans: 1, why: 'Quiet can mean falling LOC.' },
        { t: 'Pain appears reduced without reassessment', ans: 1, why: 'Less complaining is not less pressure.' },
        { t: 'Monitor values look better while LOC declines', ans: 1, why: 'The exam beats the monitor.' },
        { t: 'BP remains high and no one trends the full picture', ans: 1, why: 'Untrended data hides deterioration.' }
      ],
      rationale: 'An intervention is incomplete without an outcome. In the brain, "calmer" can be "worse." Trust the neuro exam trend, not a quiet room.' }
  ],
  bowtie: {
    prompt: 'Complete the bow-tie for {name} at 13:15.',
    conditions: [{ t: 'Increased intracranial pressure / expanding hematoma', ok: true }, { t: 'Opioid overdose', ok: false }, { t: 'Hypoglycemia', ok: false }, { t: 'Vasovagal episode', ok: false }],
    actions: [{ t: 'Elevate HOB, keep head neutral', ok: true }, { t: 'Activate emergency response; prepare for CT and osmotic therapy', ok: true }, { t: 'Deep suction every 15 minutes', ok: false }, { t: 'Place flat with hips flexed', ok: false }, { t: 'Give naloxone', ok: false }],
    params: [{ t: 'GCS and pupils', ok: true }, { t: 'BP, HR and respiratory pattern', ok: true }, { t: 'Blood glucose every 6 hours', ok: false }, { t: 'Bowel sounds', ok: false }, { t: 'Peak flow', ok: false }],
    rationale: 'Rising ICP: protect drainage and oxygenation, call neurosurgery, and trend GCS, pupils and the Cushing vitals.'
  }
});

window.CASES.push({
  id: 'neuro-sci',
  title: 'Marcus after the fall',
  system: 'Neuro',
  setting: 'Emergency Department',
  patient: { sex: 'M', ageRange: [22, 45], names: ['Marcus', 'Andre', 'Caleb', 'Luis'] },
  hook: 'Spinal shock: the NERVES go flat. Neurogenic shock: the PRESSURE goes flat (low BP, low HR, warm skin).',
  tagline: '2:05 PM. Weakness in both legs, and his blood pressure is drifting down.',
  chart: {
    profile: 'Fell 12 feet from a roof. Cervical collar and backboard in place from EMS.',
    notes: [{ time: '14:05', text: 'Reports he cannot feel or move his legs. Weak hand grips, can shrug shoulders. Sensation absent below the nipple line. Abdominal breathing, shallow. Absent reflexes in lower extremities. Skin warm and dry below the injury, flushed. Bladder distended on scan (600 mL).' }],
    vitals: { cols: ['13:40 (EMS)', '14:05'], rows: [['BP', '118/70', '84/50'], ['HR', '88', '48'], ['RR', '18', '24 shallow'], ['SpO₂', '97%', '93% RA'], ['Temp', '98.4', '97.2']] }
  },
  items: [
    { step: 'recognize', type: 'sata', n: 5,
      prompt: 'Which findings are cues of an acute spinal cord injury complication? Select the 5 that apply.',
      options: [
        { t: 'BP falling from 118/70 to 84/50', ok: true, why: 'Hypotension from lost sympathetic tone.' },
        { t: 'HR falling from 88 to 48', ok: true, why: 'Unopposed vagal tone.' },
        { t: 'Warm, dry, flushed skin below the injury', ok: true, why: 'Vasodilation, not the cold clammy skin of hypovolemia.' },
        { t: 'Shallow abdominal breathing, RR 24', ok: true, why: 'Intercostal paralysis; diaphragm doing all the work.' },
        { t: 'Bladder distended, 600 mL', ok: true, why: 'Loss of bladder tone; also a future dysreflexia trigger.' },
        { t: 'Can shrug shoulders', ok: false, why: 'Expected; C4 and above intact.' },
        { t: 'Cervical collar in place', ok: false, why: 'Correct care, not a cue.' }
      ],
      rationale: 'Level of injury (sensation absent at the nipple line ≈ T4), breathing effort, BP/HR pattern, reflexes and bladder are the five things to assess in SCI. Recognize the hemodynamic pattern: low BP + low HR + warm skin.' },
    { step: 'analyze', type: 'matrix', cols: ['Spinal shock', 'Neurogenic shock', 'Both'],
      prompt: 'Sort each cue. Which problem does it belong to?',
      rows: [
        { t: 'Flaccid paralysis and absent reflexes below the injury', ans: 0, why: 'Neurologic phenomenon.' },
        { t: 'Hypotension 84/50', ans: 1, why: 'Hemodynamic: lost sympathetic tone.' },
        { t: 'Bradycardia 48', ans: 1, why: 'Unopposed parasympathetic.' },
        { t: 'Warm, dry skin from vasodilation', ans: 1, why: 'Peripheral vasodilation.' },
        { t: 'Loss of bladder and bowel function', ans: 0, why: 'Reflex loss.' },
        { t: 'Can occur at the same time after a T6-or-higher injury', ans: 2, why: 'They coexist; they are not synonyms.' }
      ],
      rationale: 'Spinal shock = a NERVE problem (flaccidity, areflexia, lost function; resolves when reflexes return). Neurogenic shock = a CIRCULATION problem (T6 or above: hypotension, bradycardia, warm dry skin). One patient can have both.' },
    { step: 'prioritize', type: 'cloze',
      prompt: 'Complete the sentence.',
      parts: ['The complication that needs circulatory support right now is ', { options: ['neurogenic shock', 'spinal shock', 'hypovolemic shock', 'autonomic dysreflexia'], ans: 0 }, ', and the cue that proves it is not hypovolemia is the ', { options: ['bradycardia with warm dry skin', 'distended bladder', 'shallow breathing', 'absent reflexes'], ans: 0 }, '.'],
      rationale: 'Hypovolemic shock is fast heart, cold clammy skin. Neurogenic shock is slow heart, warm dry skin. Both drop BP, but the treatment differs (vasopressors and atropine versus volume), so the distinguishing cue matters.' },
    { step: 'generate', type: 'sata', n: 5,
      prompt: 'Which interventions should the nurse anticipate for {name}? Select the 5 that apply.',
      options: [
        { t: 'Maintain spinal alignment with log-roll for all moves', ok: true, why: 'Prevent the second injury.' },
        { t: 'Support airway and breathing; monitor for respiratory fatigue', ok: true, why: 'Diaphragm-only breathing tires.' },
        { t: 'IV fluids and vasopressors as ordered to maintain perfusion pressure', ok: true, why: 'Cord perfusion depends on MAP.' },
        { t: 'Atropine available for symptomatic bradycardia', ok: true, why: 'Unopposed vagal tone.' },
        { t: 'Insert urinary catheter for retention', ok: true, why: 'Bladder 600 mL; prevents overdistension.' },
        { t: 'Sit upright in a chair to improve breathing', ok: false, why: 'Breaks spinal precautions.' },
        { t: 'Apply warm blankets and allow the room to warm to reverse shock', ok: false, why: 'He cannot regulate temperature; monitor, but warmth does not treat neurogenic shock.' },
        { t: 'Delegate the neuro checks to unlicensed personnel', ok: false, why: 'Assessment of an unstable client stays with the RN.' }
      ],
      rationale: 'Alignment, airway, perfusion, bradycardia plan, bladder. Assessment of instability is never delegated; transfers need a team.' },
    { step: 'action', type: 'single',
      prompt: 'During the team log-roll for imaging, which finding should make the nurse STOP the transfer and escalate?',
      options: [
        { t: 'New difficulty breathing with SpO₂ dropping to 88%', ok: true, why: 'Ascending cord edema can paralyze the diaphragm. Airway first.' },
        { t: 'Client asks for his phone', ok: false, why: 'Not a threat.' },
        { t: 'Skin remains warm and dry', ok: false, why: 'Expected in neurogenic shock.' },
        { t: 'Reflexes still absent in the legs', ok: false, why: 'Expected during spinal shock.' }
      ],
      rationale: 'In SCI, the second injury you prevent is respiratory. A new drop in breathing effort or oxygenation stops everything.' },
    { step: 'evaluate', type: 'trend',
      prompt: 'After fluids and a vasopressor, compare 14:05 to 15:00. For each row: improved, declined, or unchanged?',
      rows: [
        { t: 'BP', before: '84/50', after: '104/64', ans: 'improved', why: 'Perfusion pressure restored.' },
        { t: 'HR', before: '48', after: '58', ans: 'improved', why: 'Less profound bradycardia.' },
        { t: 'Reflexes below injury', before: 'absent', after: 'absent', ans: 'unchanged', why: 'Spinal shock resolves over days to weeks.' },
        { t: 'Urine output (after catheter)', before: 'retained 600 mL', after: '40 mL/hr', ans: 'improved', why: 'Adequate perfusion and drainage.' },
        { t: 'SpO₂', before: '93%', after: '90%', ans: 'declined', why: 'Watch for respiratory fatigue; reassess and escalate.' }
      ],
      rationale: 'Neurogenic shock improves when circulation stabilizes; spinal shock improves when reflexes return. They resolve on different timelines, so evaluate them separately. The falling SpO₂ is the next problem.' }
  ]
});

window.CASES.push({
  id: 'neuro-ad',
  title: 'A kinked catheter becomes an emergency',
  system: 'Neuro',
  setting: 'Rehabilitation Unit',
  patient: { sex: 'M', ageRange: [24, 58], names: ['Marcus', 'Elijah', 'Sam', 'Reggie'] },
  hook: 'Dysreflexia drill: SIT up, LOOSEN, DRAIN the trigger, RECHECK the pressure.',
  tagline: 'Chronic T4 injury. Pounding headache, sweating, and a blood pressure of 202/108.',
  chart: {
    profile: 'Chronic T4 spinal cord injury (3 years). Indwelling urinary catheter. Usual BP 100/60.',
    notes: [{ time: '09:10', text: 'Calls out with a pounding headache. Face flushed, sweating on the forehead and neck. Skin pale and cool below the chest. Nasal congestion. Catheter tubing is kinked under his leg; bag has been empty for 3 hours.' }],
    vitals: { cols: ['08:00', '09:10'], rows: [['BP', '102/62', '202/108'], ['HR', '72', '54'], ['RR', '16', '18'], ['SpO₂', '98%', '98%']] }
  },
  items: [
    { step: 'recognize', type: 'highlight',
      prompt: 'Click to highlight the cues that make this a hypertensive emergency.',
      text: ['Calls out with a ', { t: 'pounding headache', ok: true, why: 'Classic symptom.' }, '. ', { t: 'Face flushed, sweating on the forehead and neck', ok: true, why: 'Above the injury: parasympathetic response.' }, '. ', { t: 'Skin pale and cool below the chest', ok: true, why: 'Below the injury: massive sympathetic vasoconstriction.' }, '. Nasal congestion. Asks for the television remote. ', { t: 'Catheter tubing is kinked; bag empty for 3 hours', ok: true, why: 'The trigger: bladder distension.' }, '. ', { t: 'BP 202/108', ok: true, why: 'Double his baseline of 100/60.' }, ' with HR 54.'],
      rationale: 'Autonomic dysreflexia: a stimulus below the injury (a full bladder is the most common) sets off a massive sympathetic reflex that the cord injury prevents the brain from switching off. Above the lesion: flushing, sweating, headache. Below: pale, cool. BP skyrockets; HR may drop.' },
    { step: 'analyze', type: 'matrix', cols: ['Common trigger', 'Not a trigger'],
      prompt: 'For each item, specify whether it is a common trigger of autonomic dysreflexia.',
      rows: [
        { t: 'Bladder distension or kinked catheter', ans: 0, why: 'The most common trigger.' },
        { t: 'Constipation or fecal impaction', ans: 0, why: 'Second most common.' },
        { t: 'Tight clothing or leg straps', ans: 0, why: 'Skin stimulus.' },
        { t: 'Pressure injury or ingrown toenail', ans: 0, why: 'Painful stimulus below the lesion.' },
        { t: 'Watching television', ans: 1, why: 'No.' },
        { t: 'Injury at L2 (below T6)', ans: 1, why: 'Dysreflexia occurs with injuries at or above T6.' }
      ],
      rationale: 'Think: trigger → reflex → hypertension. Bladder, bowel, skin. Injuries at T6 or above.' },
    { step: 'prioritize', type: 'single',
      prompt: 'Why is a BP of 202/108 an emergency for {name} specifically?',
      options: [
        { t: 'His baseline is 100/60; a sudden doubling risks stroke, seizure, or hemorrhage', ok: true, why: 'Relative rise matters; treat within minutes.' },
        { t: 'It is above the normal adult range', ok: false, why: 'True but misses the urgency: it is the acute change.' },
        { t: 'It will cause bradycardia', ok: false, why: 'Bradycardia is a reflex effect, not the danger.' },
        { t: 'It always requires IV antihypertensives first', ok: false, why: 'Remove the trigger first; medication only if BP stays high.' }
      ],
      rationale: 'Expected vs unexpected: 202/108 in a client whose usual pressure is 100/60 is a catastrophic change. The danger is intracranial hemorrhage. The fastest treatment is removing the trigger.' },
    { step: 'generate', type: 'sata', n: 4,
      prompt: 'Which actions are appropriate right now? Select the 4 that apply.',
      options: [
        { t: 'Sit the client upright', ok: true, why: 'Gravity lowers cerebral pressure and pools blood in the legs.' },
        { t: 'Loosen restrictive clothing and straps', ok: true, why: 'Removes a possible trigger.' },
        { t: 'Straighten the catheter tubing; if no flow, irrigate or replace it', ok: true, why: 'Restores bladder drainage.' },
        { t: 'Recheck BP every 2 to 5 minutes', ok: true, why: 'Track the response.' },
        { t: 'Lay the client flat to rest', ok: false, why: 'Flat raises cerebral BP.' },
        { t: 'Perform a quick manual disimpaction before anything else', ok: false, why: 'Bladder first; bowel check comes after, with anesthetic gel, because stimulation can worsen the reflex.' },
        { t: 'Wait 30 minutes and recheck', ok: false, why: 'Too slow for a stroke-level pressure.' }
      ],
      rationale: 'SIT, LOOSEN, DRAIN, RECHECK. Bladder first, then bowel, then skin. Medication if the pressure stays high after the trigger is removed.' },
    { step: 'action', type: 'order',
      prompt: 'Order the response.',
      items: [{ t: 'Sit upright' }, { t: 'Loosen restrictive clothing' }, { t: 'Restore bladder drainage (straighten, irrigate, or replace the catheter)' }, { t: 'Recheck BP frequently; notify provider if it stays elevated' }],
      rationale: 'Sitting upright buys time in seconds, loosening takes seconds, then hunt the trigger with the bladder first. Reassess constantly. Why not lie him flat? Because flat pushes more blood pressure into the head.' },
    { step: 'evaluate', type: 'cloze',
      chart: { notes: [{ time: '09:20', text: 'Catheter straightened; 700 mL drained. Headache easing.' }], vitals: { cols: ['09:20'], rows: [['BP', '128/74'], ['HR', '68']] } },
      prompt: 'Complete the evaluation.',
      parts: ['At 09:20 the client\'s status is ', { options: ['improving', 'deteriorating', 'unchanged'], ans: 0 }, ' as shown by the ', { options: ['BP falling toward baseline and headache easing', '700 mL of urine', 'heart rate of 68'], ans: 0 }, '. The nurse should now ', { options: ['continue to monitor BP and teach trigger prevention', 'give an IV antihypertensive', 'lay the client flat'], ans: 0 }, '.'],
      rationale: 'Removing the trigger fixed the cause: BP fell from 202/108 to 128/74 and the headache is easing. Now reassess for a while and teach: catheter care, bowel program, skin checks, and how to recognize the early signs.' }
  ]
});

window.CASES.push({
  id: 'neuro-seizure',
  title: 'The seizure stopped. Is Ava safe?',
  system: 'Neuro',
  setting: 'Emergency Department',
  patient: { sex: 'F', ageRange: [17, 36], names: ['Ava', 'Zoe', 'Nia', 'Priya'] },
  hook: 'After the benzo, the breathing is the danger. Protect first, then check what the drug changed.',
  tagline: 'Six minutes of generalized seizure, IV lorazepam, and now RR 8.',
  chart: {
    profile: 'Known epilepsy; missed two days of levetiracetam. Brought in by roommate.',
    notes: [{ time: '21:40', text: 'Generalized tonic-clonic seizure lasting 6 minutes. Side-lying, padded rails, nothing in mouth. IV lorazepam 4 mg given per order at 21:44. Movements stopped at 21:46.' }, { time: '21:48', text: 'Unresponsive to voice and sternal rub. Snoring respirations. RR 8. SpO₂ 88% on room air. Pupils 3 mm sluggish. Small amount of blood-tinged saliva; tongue laceration.' }],
    vitals: { cols: ['21:40', '21:48'], rows: [['HR', '132', '96'], ['RR', '28', '8'], ['BP', '148/90', '110/68'], ['SpO₂', '94%', '88% RA'], ['Glucose', '—', '92']] }
  },
  items: [
    { step: 'recognize', type: 'sata', n: 4,
      prompt: 'Which findings at 21:48 require immediate follow-up? Select the 4 that apply.',
      options: [
        { t: 'RR 8', ok: true, why: 'Respiratory depression from lorazepam plus the post-ictal state.' },
        { t: 'SpO₂ 88%', ok: true, why: 'Hypoxemia.' },
        { t: 'Snoring respirations', ok: true, why: 'Tongue obstructing the airway.' },
        { t: 'Unresponsive to sternal rub', ok: true, why: 'Deeply sedated; cannot protect her own airway.' },
        { t: 'Tongue laceration', ok: false, why: 'Common after seizure; not urgent.' },
        { t: 'Glucose 92', ok: false, why: 'Normal: hypoglycemia excluded.' },
        { t: 'HR 96', ok: false, why: 'Improved from 132.' }
      ],
      rationale: 'The seizure is over; the new threat is the airway and breathing. Snoring means obstruction; RR 8 with SpO₂ 88% means hypoventilation. A post-ictal client is expected to be sleepy, but unresponsive plus RR 8 after a benzodiazepine is unexpected and dangerous.' },
    { step: 'analyze', type: 'matrix', cols: ['Expected post-ictal', 'Unexpected: act now'],
      prompt: 'Expected vs unexpected. Sort each finding.',
      rows: [
        { t: 'Drowsy but arousable for 30–60 minutes', ans: 0, why: 'Normal post-ictal recovery.' },
        { t: 'Confusion and headache on waking', ans: 0, why: 'Expected.' },
        { t: 'Tongue bite, sore muscles', ans: 0, why: 'Expected.' },
        { t: 'RR 8 with SpO₂ 88%', ans: 1, why: 'Respiratory depression: benzodiazepine effect.' },
        { t: 'Unresponsive to painful stimulus', ans: 1, why: 'Too deep; airway unprotected.' },
        { t: 'Seizure activity restarting before she wakes', ans: 1, why: 'Status epilepticus.' }
      ],
      rationale: 'Knowing the expected abnormal (post-ictal sleepiness) lets you spot the unexpected (hypoventilation, unresponsiveness, recurrent seizure).' },
    { step: 'prioritize', type: 'single',
      prompt: 'What is the priority now?',
      options: [
        { t: 'Airway and breathing: reposition, open the airway, oxygen, prepare for bag-mask ventilation', ok: true, why: 'She is hypoventilating with an obstructed airway.' },
        { t: 'Load levetiracetam to prevent the next seizure', ok: false, why: 'Important next, not first.' },
        { t: 'Suture the tongue laceration', ok: false, why: 'Not a threat.' },
        { t: 'Obtain a detailed seizure history from the roommate', ok: false, why: 'Later.' }
      ],
      rationale: 'The treatment created the new problem: lorazepam stopped the seizure and depressed her breathing. ABCs: fix the airway before anything else.' },
    { step: 'generate', type: 'sata', n: 5,
      prompt: 'Which actions should the nurse take? Select the 5 that apply.',
      options: [
        { t: 'Side-lying position with head tilt / jaw thrust to open the airway', ok: true, why: 'Relieves tongue obstruction, protects from aspiration.' },
        { t: 'Apply oxygen; have bag-valve-mask and suction at the bedside', ok: true, why: 'Support ventilation; be ready.' },
        { t: 'Continuous SpO₂ and capnography if available; frequent RR checks', ok: true, why: 'Monitor ventilation, not just oxygenation.' },
        { t: 'Notify the provider / rapid response; anticipate airway support', ok: true, why: 'Escalate a threat to the airway.' },
        { t: 'Prepare an anti-seizure medication load as ordered', ok: true, why: 'Prevent recurrence once breathing is supported.' },
        { t: 'Give a second dose of lorazepam now to be safe', ok: false, why: 'She is not seizing; more benzo deepens respiratory depression.' },
        { t: 'Insert an oral airway between clenched teeth', ok: false, why: 'Never force anything into the mouth; use a nasal airway if needed.' },
        { t: 'Give flumazenil routinely to reverse the lorazepam', ok: false, why: 'Can precipitate seizures in a client with epilepsy; not routine.' }
      ],
      rationale: 'Support the airway and breathing, monitor ventilation, escalate, then prevent the next seizure. Avoid extra sedation, forcing the mouth open, or routine reversal in epilepsy.' },
    { step: 'action', type: 'order',
      prompt: 'Order the nurse\'s first actions.',
      items: [{ t: 'Open the airway: side-lying, jaw thrust; suction secretions' }, { t: 'Apply oxygen and prepare bag-valve-mask; call for help' }, { t: 'Continuous SpO₂ and respiratory rate monitoring' }, { t: 'Administer ordered anti-seizure medication load' }, { t: 'Document seizure duration, description, and post-ictal findings' }],
      rationale: 'Airway, then breathing with help on the way, then monitoring, then prevention, then documentation.' },
    { step: 'evaluate', type: 'trend',
      prompt: 'At 22:05, after repositioning and oxygen: improved, declined, or unchanged?',
      rows: [
        { t: 'RR', before: '8', after: '14', ans: 'improved', why: 'Ventilation recovering.' },
        { t: 'SpO₂', before: '88% RA', after: '96% on 4 L', ans: 'improved', why: 'Oxygenation restored.' },
        { t: 'Airway sounds', before: 'snoring', after: 'clear', ans: 'improved', why: 'Obstruction relieved.' },
        { t: 'Response', before: 'unresponsive', after: 'opens eyes to voice', ans: 'improved', why: 'Lightening.' },
        { t: 'Seizure activity', before: 'none', after: 'none', ans: 'unchanged', why: 'Good: keep monitoring.' }
      ],
      rationale: 'Improvement is the reversal of the exact cues you acted on: rate up, saturation up, airway clear, waking. Keep watching: the drug\'s effect can outlast your relief.' }
  ]
});
