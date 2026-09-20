/* Week 1 NGN case studies — rebuilt from the course's "NGN Case Studies Week 1 (Answers)" packet
   (femur fracture with hemorrhagic shock; stroke with NG-tube medications; anastomotic leak with septic shock).
   Answer keys follow the instructor's marked answers. Items the packet did not mark carry `unverified: true`,
   which shows a note on screen; replace them with the class key when it is available. */
window.CASES = window.CASES || [];

window.CASES.push({
  id: 'w1-femur-shock',
  title: 'The shortened, rotated leg',
  system: 'Trauma / Perfusion',
  setting: 'Emergency Department',
  patient: { sex: 'F', ageRange: [38, 56] },
  hook: 'A femur can hide a liter of blood. Fast heart + low pressure + no urine = fill the tank before you treat the pain.',
  tagline: 'Restrained driver, driver-side impact, and a thigh that is getting bigger.',
  chart: {
    profile: 'History: hypertension, type 2 diabetes. Home meds: metformin 1,000 mg twice daily, lisinopril 20 mg daily. No known drug allergies. EMS: struck on the driver\'s side, airbags deployed, alert at the scene, denies loss of consciousness. Traction splint applied to the left leg.',
    notes: [{ time: 'Arrival', text: 'Severe pain in the left thigh, 10/10. Left leg shortened and externally rotated with swelling and deformity. Alert and oriented ×4. Left pedal pulse 1+, left foot cool compared with right, capillary refill in left toes 4 seconds. Urinary output 0 mL.' }],
    vitals: { cols: ['Arrival'], rows: [['Temp', '98.4 °F'], ['HR', '132'], ['RR', '24'], ['BP', '86/52'], ['SpO₂', '96% RA'], ['Glucose', '238']] }
  },
  items: [
    { step: 'recognize', type: 'sata', n: 6,
      prompt: 'Which findings require the nurse\'s immediate attention? Select all that apply.',
      options: [
        { t: 'Heart rate 132', ok: true, why: 'Compensating for blood loss.' },
        { t: 'Blood pressure 86/52', ok: true, why: 'Hypotension: compensation is already failing.' },
        { t: 'Pain rating 10/10', ok: true, why: 'Severe pain needs treatment, timed with hemodynamics.' },
        { t: 'Left pedal pulse 1+', ok: true, why: 'Weak distal pulse: perfusion to the limb is threatened.' },
        { t: 'Left foot cool compared with the right', ok: true, why: 'Neurovascular compromise.' },
        { t: 'Capillary refill 4 seconds in the left toes', ok: true, why: 'Delayed refill confirms poor limb perfusion.' },
        { t: 'Blood glucose 238', ok: false, why: 'Stress hyperglycemia; not the immediate threat.' },
        { t: 'History of hypertension', ok: false, why: 'Background, not a cue.' }
      ],
      rationale: 'Two stories are running at once: whole-body perfusion (HR 132, BP 86/52, no urine) and limb perfusion (weak pulse, cool foot, slow refill). Both need immediate attention. Glucose and history are distractors.' },
    { step: 'analyze', type: 'matrix', multi: true, cols: ['Impaired perfusion / blood loss', 'Physiologic stress', 'Diabetes'],
      chart: { labs: [['Hemoglobin', '10.1 g/dL', '12–16'], ['Hematocrit', '30%', '36–46%'], ['WBC', '14,200', '4,500–11,000'], ['Platelets', '245,000', '150–450 k'], ['Glucose', '246', '70–110'], ['Creatinine', '0.9', '0.6–1.3']] },
      prompt: 'Labs return. For each finding, indicate what it is most consistent with. A finding may fit more than one.',
      rows: [
        { t: 'Heart rate 112', ans: [0, 1], why: 'Blood loss and the stress response both drive tachycardia.' },
        { t: 'Hemoglobin 10.1 g/dL', ans: [0], why: 'Blood is leaving the vessels.' },
        { t: 'WBC 14,200', ans: [1], why: 'Stress leukocytosis after trauma.' },
        { t: 'Glucose 246', ans: [1, 2], why: 'Stress hormones plus diabetes.' },
        { t: 'Cool left foot with delayed capillary refill', ans: [0], why: 'Impaired limb perfusion.' }
      ],
      rationale: 'Connect each cue to a mechanism. Hemoglobin, hematocrit and the cool limb are perfusion. WBC is stress. Glucose is both stress and diabetes. Heart rate is both blood loss and stress.' },
    { step: 'prioritize', type: 'single',
      chart: { notes: [{ time: '+20 min', text: 'Skin pale and cool. States "I feel really weak and dizzy." Left thigh swelling has increased.' }], vitals: { cols: ['+20 min'], rows: [['HR', '124'], ['RR', '26'], ['BP', '88/54'], ['SpO₂', '95% RA']] } },
      prompt: 'Twenty minutes later. Which condition is the nurse\'s priority concern?',
      options: [
        { t: 'Hypovolemic shock related to internal blood loss', ok: true, why: 'Thigh growing, pale, dizzy, tachycardic, hypotensive, no urine.' },
        { t: 'Acute pain related to the femur fracture', ok: false, why: 'Real, but not what kills first.' },
        { t: 'Hyperglycemia related to type 2 diabetes', ok: false, why: 'Manage later.' },
        { t: 'Infection related to traumatic injury', ok: false, why: 'Too early; no infection cues.' }
      ],
      rationale: 'The thigh is swelling because it is filling with blood. A femur fracture can hide more than a liter. Pale, cool, dizzy, HR up, BP down and zero urine: hypovolemic shock.' },
    { step: 'generate', type: 'sata', n: 6,
      prompt: 'The provider is notified. Which interventions should the nurse anticipate? Select all that apply.',
      options: [
        { t: 'Establish or maintain two large-bore IV access sites', ok: true, why: 'Volume needs big pipes.' },
        { t: 'Administer isotonic IV fluids as prescribed', ok: true, why: 'Restore circulating volume.' },
        { t: 'Obtain a type and crossmatch', ok: true, why: 'Blood is coming.' },
        { t: 'Prepare for possible blood product administration', ok: true, why: 'Replace what was lost.' },
        { t: 'Perform frequent neurovascular assessments of the affected leg', ok: true, why: 'Limb perfusion is threatened.' },
        { t: 'Administer prescribed IV analgesia while monitoring hemodynamic status', ok: true, why: 'Treat pain, watch the pressure.' },
        { t: 'Encourage oral fluids', ok: false, why: 'Likely surgery: NPO. Oral fluids cannot fix shock.' },
        { t: 'Allow the patient to ambulate to check weight bearing', ok: false, why: 'Never on a femur fracture.' }
      ],
      rationale: 'Two lines, fluids, type and cross, blood on standby, neurovascular checks, analgesia timed with the blood pressure. Nothing by mouth and no weight bearing.' },
    { step: 'action', type: 'single',
      chart: { orders: ['Lactated Ringer\'s 1,000 mL IV bolus', 'Type and crossmatch for 2 units PRBC', 'Morphine 2 mg IV q2h PRN severe pain', 'Blood glucose every 4 hours', 'Orthopedic surgery consult', 'Neurovascular assessment of left leg every hour'], vitals: { cols: ['Orders'], rows: [['HR', '128'], ['BP', '84/50'], ['Pain', '10/10'], ['Urine', '0 mL']] } },
      prompt: 'BP 84/50, HR 128, pain 10/10, urine output still zero. Which action should the nurse take first?',
      options: [
        { t: 'Initiate the lactated Ringer\'s IV bolus', ok: true, why: 'Circulation first: fill the tank.' },
        { t: 'Administer morphine 2 mg IV', ok: false, why: 'Morphine drops BP; give it once volume is running.' },
        { t: 'Check the patient\'s blood glucose', ok: false, why: 'Not the threat.' },
        { t: 'Complete the hourly neurovascular assessment', ok: false, why: 'Important, but after the bolus is started.' }
      ],
      rationale: 'With a pressure of 84/50 the first action is volume. Morphine on an empty tank can crash the pressure further. Once fluids are running, treat the pain and reassess the limb.' },
    { step: 'evaluate', type: 'sata', n: 7,
      prompt: 'After IV fluids and one unit of packed red cells, which findings indicate the interventions were effective? Select all that apply.',
      options: [
        { t: 'Heart rate decreases from 128 to 94', ok: true, why: 'Less compensation needed.' },
        { t: 'Blood pressure increases from 84/50 to 112/70', ok: true, why: 'Perfusion pressure restored.' },
        { t: 'Urine output is 40 mL/hr', ok: true, why: 'Kidneys are perfused.' },
        { t: 'Patient reports pain of 7/10', ok: true, why: 'Pain is easing from 10/10.' },
        { t: 'Skin is warm and color has improved', ok: true, why: 'Tissue perfusion.' },
        { t: 'Patient is no longer complaining of dizziness', ok: true, why: 'Brain perfused.' },
        { t: 'Capillary refill in the left toes is 2 seconds', ok: true, why: 'Limb perfusion restored.' },
        { t: 'Left pedal pulse is absent', ok: false, why: 'A NEW emergency: compartment syndrome or vascular injury. Report immediately.' }
      ],
      rationale: 'Effective = the shock cues reverse: HR down, BP up, urine flowing, warm skin, no dizziness, refill normal, pain easing. An absent pedal pulse is not improvement; it is a new threat to the leg.' }
  ]
});

window.CASES.push({
  id: 'w1-stroke-meds',
  title: 'Morning meds and a feeding tube',
  system: 'Neuro / Medication safety',
  setting: 'Medical Unit',
  patient: { sex: 'M', ageRange: [66, 80] },
  hook: 'NPO means the pills need a new plan. Check the rate before the beta-blocker, never crush ER or DR, and keep the head up while the tube feeds.',
  tagline: 'Six days after an ischemic stroke, dysphagia, and seven medications ordered "PO."',
  chart: {
    profile: 'Ischemic stroke 6 days ago: right-sided weakness, expressive aphasia, dysphagia. History: hypertension, type 2 diabetes, hyperlipidemia. Understands speech, follows commands, answers yes/no by nodding. Swallow evaluation: high aspiration risk. NPO; continuous enteral feeding via nasogastric tube.',
    notes: [{ time: '0800', text: 'Alert, follows commands. Expressive aphasia. NG tube secured, continuous feeding infusing.' }],
    vitals: { cols: ['0800'], rows: [['Temp', '98.4 °F'], ['HR', '54 regular'], ['RR', '18'], ['BP', '128/72'], ['SpO₂', '96% RA'], ['Glucose', '204'], ['K⁺', '3.2']] },
    orders: ['Aspirin chewable 81 mg PO daily', 'Metoprolol tartrate 50 mg PO twice daily', 'Potassium chloride extended-release 20 mEq PO daily', 'Pantoprazole delayed-release 40 mg PO daily', 'Insulin glargine 18 units subcut daily', 'Insulin lispro subcut q6h per correction scale', 'Acetaminophen 650 mg PO q6h PRN']
  },
  items: [
    { step: 'recognize', type: 'sata', n: 2,
      prompt: 'Which findings are most important to recognize BEFORE giving the morning medications? Select all that apply.',
      options: [
        { t: 'Heart rate 54', ok: true, why: 'Metoprolol is ordered; hold parameters matter.' },
        { t: 'Patient is NPO because of dysphagia', ok: true, why: 'Every "PO" order needs a new route.' },
        { t: 'Blood pressure 128/72', ok: false, why: 'Normal.' },
        { t: 'SpO₂ 96% on room air', ok: false, why: 'Normal.' },
        { t: 'Expressive aphasia', ok: false, why: 'He still understands and can nod; not a medication barrier.' },
        { t: 'Temperature 98.4 °F', ok: false, why: 'Normal.' },
        { t: 'Right-sided weakness', ok: false, why: 'Baseline.' }
      ],
      rationale: 'Two cues change the medication plan: a heart rate of 54 with a beta-blocker due, and an NPO status with every tablet ordered by mouth.' },
    { step: 'analyze', type: 'matrix', unverified: true, cols: ['Administer as prescribed', 'Hold and clarify', 'Give by the prescribed non-enteral route'],
      prompt: 'For each medication, indicate the most appropriate nursing action.',
      rows: [
        { t: 'Aspirin chewable 81 mg PO', ans: 1, why: 'Ordered PO in an NPO patient: clarify the route (NG).' },
        { t: 'Metoprolol tartrate 50 mg PO', ans: 1, why: 'HR 54 and route: clarify hold parameters.' },
        { t: 'Potassium chloride extended-release 20 mEq PO', ans: 1, why: 'Extended-release cannot be crushed; needs the liquid form.' },
        { t: 'Pantoprazole delayed-release tablet 40 mg PO', ans: 1, why: 'Delayed-release cannot be crushed; needs the oral suspension.' },
        { t: 'Insulin glargine 18 units subcut', ans: 2, why: 'Subcutaneous; NPO does not stop basal insulin (monitor glucose).' },
        { t: 'Insulin lispro per correction scale subcut', ans: 2, why: 'Subcutaneous; glucose is 204.' }
      ],
      rationale: 'Nothing goes down the tube until the route and formulation are right. Subcutaneous insulin is unaffected by NPO.' },
    { step: 'prioritize', type: 'single', unverified: true,
      chart: { orders: ['NEW: Aspirin 81 mg via NG daily', 'NEW: Hold metoprolol for HR < 60', 'NEW: Potassium chloride liquid 20 mEq via NG daily', 'NEW: Pantoprazole delayed-release oral suspension 40 mg via NG daily', 'Continue insulin glargine and lispro'], notes: [{ time: '0820', text: 'Head of bed at about 15 degrees. Patient coughing repeatedly. Continuous feeding infusing. SpO₂ has decreased from 96% to 90%.' }] },
      prompt: 'New orders arrive. Entering the room, the nurse finds the head of the bed at 15 degrees, repeated coughing, feeding infusing, SpO₂ 90%. Which problem should the nurse prioritize?',
      options: [
        { t: 'Aspiration related to enteral feeding and impaired swallowing', ok: true, why: 'Coughing + low HOB + feeding running + falling SpO₂.' },
        { t: 'Hyperglycemia related to diabetes', ok: false, why: 'Not the airway.' },
        { t: 'Bradycardia related to beta-blocker therapy', ok: false, why: 'Metoprolol is being held.' },
        { t: 'Hypokalemia related to inadequate intake', ok: false, why: 'Being replaced.' },
        { t: 'Ineffective communication related to aphasia', ok: false, why: 'Psychosocial; airway first.' }
      ],
      rationale: 'Airway and breathing. A dysphagic patient lying nearly flat with a feeding running and a dropping saturation is aspirating until proven otherwise. Stop the feeding, raise the head of the bed.' },
    { step: 'generate', type: 'sata', n: 2,
      prompt: 'The nurse stops the feeding and raises the head of the bed. Which additional actions are appropriate for safe medication administration through the NG tube? Select all that apply.',
      options: [
        { t: 'Verify NG-tube placement per facility policy before giving medications', ok: true, why: 'A tube in the lung is fatal.' },
        { t: 'Administer each medication separately and flush the tube between medications', ok: true, why: 'Prevents clogging and interactions.' },
        { t: 'Crush all medications together to reduce flushes', ok: false, why: 'Clogs tubes and mixes drugs.' },
        { t: 'Mix crushed medications into the feeding formula', ok: false, why: 'Unpredictable dosing.' },
        { t: 'Place the patient flat immediately after medications', ok: false, why: 'Aspiration.' },
        { t: 'Crush the extended-release potassium tablet if the liquid is unavailable', ok: false, why: 'Crushing ER dumps the whole dose at once.' }
      ],
      rationale: 'Verify placement, give each drug separately with flushes, keep the head up. Never crush extended-release or delayed-release forms.' },
    { step: 'action', type: 'single',
      chart: { notes: [{ time: '0840', text: 'SpO₂ back to 96% on room air, coughing subsided, NG placement verified. Metoprolol held for HR 56.' }] },
      prompt: 'Which action demonstrates correct medication administration through the NG tube?',
      options: [
        { t: 'Administer each enteral medication separately using the appropriate preparation and flushing technique', ok: true, why: 'The safe standard.' },
        { t: 'Combine aspirin, potassium and pantoprazole in one syringe', ok: false, why: 'Interactions and clogging.' },
        { t: 'Add the medications to the feeding formula', ok: false, why: 'Unsafe.' },
        { t: 'Crush the pantoprazole granules before giving them', ok: false, why: 'Destroys the enteric coating.' },
        { t: 'Give the metoprolol last because the blood pressure is normal', ok: false, why: 'HR 56: the hold parameter applies.' }
      ],
      rationale: 'One drug at a time, flush between, protect delayed-release granules, honor the hold parameter.' },
    { step: 'evaluate', type: 'sata', n: 2,
      chart: { notes: [{ time: '1040', text: 'Reassessment two hours after medications.' }], vitals: { cols: ['1040'], rows: [['HR', '62'], ['BP', '126/70'], ['RR', '18'], ['SpO₂', '96% RA'], ['Lungs', 'clear bilaterally'], ['NG tube', 'patent'], ['Glucose', '168'], ['K⁺', '3.6'], ['Neuro', 'unchanged from baseline']] } },
      prompt: 'Two hours after medication administration, which findings best demonstrate that the medication-administration interventions were effective? Select all that apply.',
      options: [
        { t: 'NG tube remains patent', ok: true, why: 'Separate administration with flushing kept the tube open.' },
        { t: 'Potassium increased from 3.2 to 3.6 mEq/L', ok: true, why: 'The liquid potassium was delivered and absorbed.' },
        { t: 'Neurologic status is unchanged', ok: false, why: 'Stable, but not evidence about the medication administration.' },
        { t: 'Blood pressure is 126/70 mm Hg', ok: false, why: 'Not a medication-administration outcome here.' },
        { t: 'SpO₂ is 96% with clear lung sounds', ok: false, why: 'Reflects aspiration prevention, not the administration technique.' },
        { t: 'Heart rate is 62 beats/min', ok: false, why: 'Reflects holding the metoprolol, not the administration technique.' }
      ],
      rationale: 'The two findings that speak directly to how the medications were given: the tube stayed patent (technique) and the potassium rose (the drug reached the patient).' }
  ]
});

window.CASES.push({
  id: 'w1-anastomotic-leak',
  title: '"I just don\'t feel right today"',
  system: 'Surgical / Sepsis',
  setting: 'Surgical Unit',
  patient: { sex: 'M', ageRange: [58, 76] },
  hook: 'Post-op day 4 with a fever and a belly that hurts more, not less: the gut is leaking. Cultures, antibiotics, fluids, then the OR.',
  tagline: 'Four days after a colectomy, the recovery reverses.',
  chart: {
    profile: 'Partial colectomy with primary anastomosis 4 days ago for a descending colon tumor. History: hypertension, hyperlipidemia. Recovery initially uncomplicated: ambulating with assistance, tolerating a soft diet.',
    notes: [{ time: '0730', text: '"I just don\'t feel right today. My stomach hurts more than it did yesterday." Alert and oriented ×4. Abdomen distended and diffusely tender. Bowel sounds hypoactive. Incision well approximated, no drainage. Urine output 25 mL in the previous hour.' }],
    vitals: { cols: ['0730'], rows: [['Temp', '101.8 °F'], ['HR', '118'], ['RR', '24'], ['BP', '106/64'], ['SpO₂', '95% RA'], ['Pain', '7/10 diffuse']] }
  },
  items: [
    { step: 'recognize', type: 'sata', unverified: true,
      prompt: 'Which assessment findings are most concerning for a postoperative complication? Select all that apply.',
      options: [
        { t: 'Temperature 101.8 °F (38.8 °C)', ok: true, why: 'New fever on post-op day 4.' },
        { t: 'Heart rate 118 beats/min', ok: true, why: 'Tachycardia.' },
        { t: 'Blood pressure 106/64 mm Hg', ok: false, why: 'Not flagged as a complication cue in this item.' },
        { t: 'SpO₂ 95% on room air', ok: false, why: 'Acceptable.' },
        { t: 'Diffuse abdominal tenderness and distention', ok: true, why: 'Worsening, spreading abdominal findings.' },
        { t: 'Hypoactive bowel sounds', ok: true, why: 'The gut is not recovering.' },
        { t: 'Surgical incision is well approximated', ok: false, why: 'Reassuring finding.' },
        { t: 'Pain rating of 7/10', ok: true, why: 'Pain that is worse than the day before.' }
      ],
      rationale: 'Recovery should move forward each day. New fever, tachycardia, worsening diffuse pain with distention, a quiet gut and falling urine output all point inward, toward the anastomosis.' },
    { step: 'analyze', type: 'sata', n: 2, unverified: true,
      chart: { labs: [['WBC', '18,600', '4,500–11,000'], ['Hemoglobin', '11.2', '12–16'], ['Platelets', '182,000', '150–450 k'], ['Creatinine', '1.7 (pre-op 0.9)', '0.6–1.3'], ['Lactate', '3.8', '0.5–2.2'], ['Glucose', '164', '70–110']] },
      prompt: 'Labs return. Which findings provide the strongest evidence that the condition is progressing beyond a localized infection to systemic hypoperfusion? Select all that apply.',
      options: [
        { t: 'Creatinine increased from 0.9 to 1.7', ok: true, why: 'Kidneys are underperfused: organ dysfunction.' },
        { t: 'Lactate 3.8', ok: true, why: 'Tissues are starved of oxygen.' },
        { t: 'WBC 18,600', ok: false, why: 'Infection, but not proof of hypoperfusion.' },
        { t: 'Temperature 101.8 °F', ok: false, why: 'Infection sign.' },
        { t: 'Hemoglobin 11.2', ok: false, why: 'Mild post-op anemia.' },
        { t: 'Glucose 164', ok: false, why: 'Stress response.' }
      ],
      rationale: 'Separate "infection" cues (fever, WBC) from "perfusion failing" cues (rising creatinine, rising lactate). The second group is what makes sepsis into shock.' },
    { step: 'prioritize', type: 'single', unverified: true,
      chart: { diagnostics: ['CT abdomen: extraluminal air and fluid adjacent to the colonic anastomosis, consistent with an anastomotic leak.'], notes: [{ time: '+30 min', text: 'Restless, answers questions slowly. Urine output 10 mL in the past hour.' }], vitals: { cols: ['+30 min'], rows: [['Temp', '102.4 °F'], ['HR', '132'], ['RR', '28'], ['BP', '86/50'], ['SpO₂', '94% on 2 L']] } },
      prompt: 'The CT confirms a leak. Thirty minutes later he is restless, BP 86/50, urine 10 mL/hr. Which hypothesis should the nurse prioritize?',
      options: [
        { t: 'Septic shock secondary to an anastomotic leak', ok: true, why: 'Infection source + hypotension + organ dysfunction.' },
        { t: 'Postoperative paralytic ileus', ok: false, why: 'Does not cause shock.' },
        { t: 'Acute kidney injury related to dehydration', ok: false, why: 'The kidney injury is a result, not the cause.' },
        { t: 'Acute postoperative pain', ok: false, why: 'Not the threat.' },
        { t: 'Pulmonary embolism', ok: false, why: 'No pleuritic pain or sudden dyspnea; the CT explains everything.' }
      ],
      rationale: 'Bowel contents leaking into the abdomen seed infection; the infection triggers vasodilation and organ failure. Name the worst reasonable explanation that fits ALL the cues.' },
    { step: 'generate', type: 'sata', n: 3, unverified: true,
      prompt: 'Rapid response and the surgeon are notified. Which interventions should the nurse anticipate as priorities? Select all that apply.',
      options: [
        { t: 'Obtain blood cultures before antibiotics if it does not significantly delay treatment', ok: true, why: 'Identify the organism.' },
        { t: 'Administer broad-spectrum IV antibiotics promptly', ok: true, why: 'Within the hour.' },
        { t: 'Administer an isotonic crystalloid IV bolus', ok: true, why: 'Refill the dilated vessels.' },
        { t: 'Give an antipyretic and reassess the temperature in an hour', ok: false, why: 'Comfort only; does not treat shock.' },
        { t: 'Insert an NG tube and begin enteral feeding', ok: false, why: 'A leaking gut is not fed.' },
        { t: 'Give the scheduled oral antihypertensive', ok: false, why: 'BP is 86/50.' },
        { t: 'Encourage oral fluids', ok: false, why: 'NPO for emergency surgery; oral fluid cannot fix shock.' }
      ],
      rationale: 'The sepsis bundle: cultures, antibiotics, fluids. Hold anything that lowers pressure or feeds a leaking bowel.' },
    { step: 'action', type: 'single', unverified: true,
      chart: { orders: ['Lactated Ringer\'s 2,000 mL IV bolus', 'Piperacillin/tazobactam IV', 'Blood cultures ×2', 'Acetaminophen 650 mg PR for temp > 101 °F', 'Norepinephrine infusion if hypotension persists after fluids', 'Insert indwelling urinary catheter', 'Prepare for emergency exploratory surgery'], vitals: { cols: ['Orders'], rows: [['HR', '136'], ['RR', '30'], ['BP', '82/46'], ['SpO₂', '95% on 2 L']] } },
      prompt: 'Two patent large-bore IVs are in place. BP 82/46, HR 136. Which action should the nurse take first?',
      options: [
        { t: 'Begin the prescribed IV crystalloid bolus', ok: true, why: 'Circulation: pressure is critical now.' },
        { t: 'Administer the first dose of IV antibiotic', ok: false, why: 'Next, right after fluids are running and cultures drawn.' },
        { t: 'Administer acetaminophen', ok: false, why: 'Comfort, not survival.' },
        { t: 'Insert the urinary catheter', ok: false, why: 'Monitoring; after resuscitation starts.' },
        { t: 'Prepare for transport to the operating room', ok: false, why: 'He must be resuscitated to survive anesthesia.' }
      ],
      rationale: 'With a pressure of 82/46 the first action is volume. Antibiotics follow within the hour; the catheter measures the response; the OR fixes the source once he is stable enough to go.' },
    { step: 'evaluate', type: 'sata', n: 3, unverified: true,
      prompt: 'After fluids, antibiotics, norepinephrine and emergency surgery: which findings provide the strongest evidence that tissue perfusion has improved? Select all that apply.',
      options: [
        { t: 'Mean arterial pressure 80 mmHg', ok: true, why: 'Organs are perfused (goal ≥ 65).' },
        { t: 'Lactate decreased to 2.1', ok: true, why: 'Tissues are getting oxygen.' },
        { t: 'Urine output 38 mL/hr', ok: true, why: 'Kidneys are perfused.' },
        { t: 'Temperature decreased to 100.6 °F', ok: false, why: 'Infection response, not perfusion.' },
        { t: 'WBC remains 17,900', ok: false, why: 'Still fighting infection; not a perfusion marker.' },
        { t: 'SpO₂ 96% on 2 L', ok: false, why: 'Oxygenation, not perfusion.' }
      ],
      rationale: 'Perfusion has its own scorecard: MAP, lactate, urine output (and mental status). Fever and WBC track infection; SpO₂ tracks oxygenation. Match the evidence to the question.' }
  ]
});
