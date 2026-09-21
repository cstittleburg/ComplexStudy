/* Week 1 NGN case studies — rebuilt from the course's "NGN Case Studies Week 1" packet (the class version).
   Answer keys: where the same question appears in the professor's answers file, the marked key is used.
   Questions the packet did not key carry `unverified: true` (the app shows a note); those keys were supplied
   from the course materials and standard nursing practice. */
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
    vitals: { cols: ['Arrival'], rows: [['Temp', '98.4 °F'], ['HR', '102'], ['RR', '24'], ['BP', '136/92'], ['SpO₂', '96% RA'], ['Glucose', '238']] }
  },
  items: [
    { step: 'recognize', type: 'sata', unverified: true,
      prompt: 'Which findings require the nurse\'s immediate attention? Select all that apply.',
      options: [
        { t: 'Heart rate 102 beats/min', ok: false, why: 'Mildly elevated with pain; not yet an immediate threat on its own.' },
        { t: 'Blood pressure 136/92 mm Hg', ok: false, why: 'Not hypotensive; her history includes hypertension.' },
        { t: 'Pain rating of 10/10', ok: true, why: 'Severe pain needs treatment now.' },
        { t: 'Left pedal pulse 1+', ok: true, why: 'Weak distal pulse: limb perfusion is threatened.' },
        { t: 'Left foot cool compared with the right', ok: true, why: 'Neurovascular compromise.' },
        { t: 'Blood glucose 238 mg/dL', ok: false, why: 'Stress hyperglycemia; not the immediate threat.' },
        { t: 'Capillary refill of 4 seconds in the left toes', ok: true, why: 'Delayed refill confirms poor limb perfusion.' },
        { t: 'History of hypertension', ok: false, why: 'Background, not a cue.' }
      ],
      rationale: 'On arrival the vital signs are still holding. What cannot wait is the limb: weak pulse, cool foot, slow capillary refill point to compromised perfusion below the fracture, plus 10/10 pain. Glucose and history are distractors.' },
    { step: 'analyze', type: 'sata', unverified: true,
      chart: { labs: [['Hemoglobin', '10.1 g/dL', '12–16'], ['Hematocrit', '30%', '36–46%'], ['WBC', '14,200', '4,500–11,000'], ['Platelets', '245,000', '150–450 k'], ['Glucose', '246', '70–110'], ['Creatinine', '0.9', '0.6–1.3']] },
      prompt: 'Additional labs return. Which laboratory findings, analyzed with the current assessment, most increase the nurse\'s concern for acute blood loss? Select all that apply.',
      options: [
        { t: 'Hemoglobin 10.1 g/dL', ok: true, why: 'Low hemoglobin with a swelling thigh: blood is leaving the vessels.' },
        { t: 'Hematocrit 30%', ok: true, why: 'Low hematocrit points the same way.' },
        { t: 'WBC 14,200/mm³', ok: false, why: 'Stress leukocytosis after trauma, not blood loss.' },
        { t: 'Platelets 245,000/mm³', ok: false, why: 'Normal.' },
        { t: 'Glucose 246 mg/dL', ok: false, why: 'Stress response plus diabetes.' },
        { t: 'Creatinine 0.9 mg/dL', ok: false, why: 'Normal.' }
      ],
      rationale: 'Only the red-cell numbers speak to blood loss. Hemoglobin and hematocrit are both low, and the thigh is swelling: she is bleeding into the leg.' },
    { step: 'prioritize', type: 'single',
      chart: { notes: [{ time: '+20 min', text: 'Skin pale and cool. States "I feel really weak and dizzy." Left thigh swelling has increased.' }], vitals: { cols: ['+20 min'], rows: [['HR', '124'], ['RR', '26'], ['BP', '88/54'], ['SpO₂', '95% RA']] } },
      prompt: 'Twenty minutes later. Which condition is the nurse\'s priority concern?',
      options: [
        { t: 'Hypovolemic shock related to internal blood loss', ok: true, why: 'Thigh growing, pale, dizzy, tachycardic, hypotensive.' },
        { t: 'Acute pain related to the femur fracture', ok: false, why: 'Real, but not what kills first.' },
        { t: 'Hyperglycemia related to type 2 diabetes', ok: false, why: 'Manage later.' },
        { t: 'Infection related to traumatic injury', ok: false, why: 'Too early; no infection cues.' }
      ],
      rationale: 'The thigh is swelling because it is filling with blood. HR up from 102 to 124, BP down from 136/92 to 88/54, pale, cool and dizzy: hypovolemic shock.' },
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
        { t: 'Allow the patient to ambulate to determine whether the leg can bear weight', ok: false, why: 'Never on a femur fracture.' }
      ],
      rationale: 'Two lines, fluids, type and cross, blood on standby, neurovascular checks, analgesia timed with the blood pressure. Nothing by mouth and no weight bearing.' },
    { step: 'action', type: 'single',
      chart: { orders: ['Lactated Ringer\'s 1,000 mL IV bolus', 'Type and crossmatch for 2 units packed red blood cells', 'Morphine 2 mg IV every 2 hours PRN severe pain', 'Blood glucose every 4 hours', 'Orthopedic surgery consultation', 'Neurovascular assessment of the left leg every hour'], vitals: { cols: ['Orders'], rows: [['HR', '128'], ['BP', '84/50'], ['Pain', '10/10']] } },
      prompt: 'BP 84/50, HR 128, pain 10/10. Which action should the nurse take first?',
      options: [
        { t: 'Initiate the lactated Ringer\'s IV bolus', ok: true, why: 'Circulation first: fill the tank.' },
        { t: 'Administer morphine 2 mg IV', ok: false, why: 'Morphine lowers BP; give it once volume is running.' },
        { t: 'Check the patient\'s blood glucose', ok: false, why: 'Not the threat.' },
        { t: 'Complete the hourly neurovascular assessment', ok: false, why: 'Important, but after the bolus is started.' }
      ],
      rationale: 'With a pressure of 84/50 the first action is volume. Morphine on an empty tank can drop the pressure further. Once fluids are running, treat the pain and reassess the limb.' },
    { step: 'evaluate', type: 'sata', unverified: true,
      prompt: 'After IV fluids and one unit of packed red cells, which findings indicate that tissue perfusion has improved? Select all that apply.',
      options: [
        { t: 'Heart rate decreases from 128 to 94 beats/min', ok: true, why: 'Less compensation needed.' },
        { t: 'Urine output is 40 mL/hr', ok: true, why: 'Kidneys are perfused.' },
        { t: 'Blood pressure increases from 84/50 to 112/70 mm Hg', ok: true, why: 'Perfusion pressure restored.' },
        { t: 'Left thigh remains swollen', ok: false, why: 'The hematoma does not shrink quickly; not a perfusion marker.' },
        { t: 'Blood glucose is 228 mg/dL', ok: false, why: 'Not a perfusion marker.' },
        { t: 'Respiratory rate is 24 breaths/min', ok: false, why: 'Unchanged.' },
        { t: 'Temperature is 99.1 °F (37.3 °C)', ok: false, why: 'Not a perfusion marker.' }
      ],
      rationale: 'Perfusion has its own scorecard: heart rate, blood pressure, urine output (and skin, mentation). Swelling, glucose, respiratory rate and temperature do not answer the question that was asked.' }
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
    orders: ['Aspirin chewable 81 mg PO daily', 'Metoprolol tartrate 50 mg PO twice daily', 'Potassium chloride extended-release 20 mEq PO daily', 'Pantoprazole delayed-release 40 mg PO daily', 'Insulin glargine 18 units subcutaneous daily', 'Insulin lispro subcutaneous every 6 hours per correction scale', 'Acetaminophen immediate-release 650 mg PO every 6 hours PRN pain or fever']
  },
  items: [
    { step: 'recognize', type: 'sata', n: 2,
      prompt: 'Which findings are most important for the nurse to recognize before administering the morning medications? Select all that apply.',
      options: [
        { t: 'Heart rate 54 beats/min', ok: true, why: 'Metoprolol is ordered; hold parameters matter.' },
        { t: 'Patient is NPO because of dysphagia', ok: true, why: 'Every "PO" order needs a new route.' },
        { t: 'Blood pressure 128/72 mm Hg', ok: false, why: 'Normal.' },
        { t: 'SpO₂ 96% on room air', ok: false, why: 'Normal.' },
        { t: 'Expressive aphasia', ok: false, why: 'He understands and can nod; not a medication barrier.' },
        { t: 'Temperature 98.4 °F', ok: false, why: 'Normal.' },
        { t: 'Right-sided weakness', ok: false, why: 'Baseline.' }
      ],
      rationale: 'Two cues change the medication plan: a heart rate of 54 with a beta-blocker due, and NPO status with every tablet ordered by mouth.' },
    { step: 'analyze', type: 'matrix', unverified: true, cols: ['Administer as prescribed', 'Hold and clarify', 'Administer by prescribed non-enteral route'],
      prompt: 'The nurse reviews each medication. For each one, indicate the most appropriate nursing action.',
      rows: [
        { t: 'Aspirin chewable 81 mg', ans: 1, why: 'Ordered PO in an NPO patient: clarify the route.' },
        { t: 'Metoprolol tartrate 50 mg', ans: 1, why: 'Heart rate 54 and a PO route: clarify hold parameters and route.' },
        { t: 'Potassium chloride extended-release 20 mEq', ans: 1, why: 'Extended-release cannot be crushed; needs the liquid form.' },
        { t: 'Pantoprazole delayed-release tablet 40 mg', ans: 1, why: 'Delayed-release cannot be crushed; needs the oral suspension.' },
        { t: 'Insulin glargine 18 units', ans: 2, why: 'Subcutaneous; NPO does not change it.' },
        { t: 'Insulin lispro per correction scale', ans: 2, why: 'Subcutaneous; glucose is 204.' }
      ],
      rationale: 'Nothing goes down the tube until the route and formulation are right. Subcutaneous insulin is unaffected by NPO.' },
    { step: 'prioritize', type: 'single', unverified: true,
      chart: { orders: ['NEW: Aspirin 81 mg via NG tube daily', 'NEW: Hold metoprolol for heart rate less than 60', 'NEW: Potassium chloride liquid 20 mEq via NG tube daily', 'NEW: Pantoprazole delayed-release oral suspension 40 mg via NG tube daily', 'Continue insulin glargine and insulin lispro as prescribed'], notes: [{ time: '0820', text: 'Head of bed at approximately 15 degrees. Patient coughing repeatedly. Continuous enteral feeding infusing. SpO₂ has decreased from 96% to 90%.' }] },
      prompt: 'New prescriptions arrive. Entering the room, the nurse finds the head of the bed at about 15 degrees, repeated coughing, feeding infusing, and SpO₂ down to 90%. Which problem should the nurse prioritize?',
      options: [
        { t: 'Aspiration related to enteral feeding and impaired swallowing', ok: true, why: 'Coughing, low head of bed, feeding running, falling SpO₂.' },
        { t: 'Hyperglycemia related to diabetes mellitus', ok: false, why: 'Not the airway.' },
        { t: 'Bradycardia related to beta-blocker therapy', ok: false, why: 'Metoprolol is being held.' },
        { t: 'Hypokalemia related to inadequate potassium intake', ok: false, why: 'Being replaced.' },
        { t: 'Ineffective communication related to expressive aphasia', ok: false, why: 'Psychosocial; airway first.' }
      ],
      rationale: 'Airway and breathing first. A dysphagic patient lying nearly flat with a feeding running and a dropping saturation is aspirating until proven otherwise.' },
    { step: 'generate', type: 'sata', n: 2,
      prompt: 'The nurse stops the enteral feeding and raises the head of the bed. Which additional actions are appropriate for safe medication administration through the NG tube? Select all that apply.',
      options: [
        { t: 'Verify NG-tube placement according to facility policy before medication administration', ok: true, why: 'Confirm the tube is where it belongs.' },
        { t: 'Administer each medication separately and flush the tube between medications', ok: true, why: 'Prevents clogging and interactions.' },
        { t: 'Crush all medications together to reduce the number of tube flushes', ok: false, why: 'Clogs tubes and mixes drugs.' },
        { t: 'Mix crushed medications directly into the enteral feeding formula', ok: false, why: 'Unpredictable dosing.' },
        { t: 'Place the patient flat immediately after administering the medications', ok: false, why: 'Aspiration risk.' },
        { t: 'Crush the extended-release potassium tablet if the liquid formulation is unavailable', ok: false, why: 'Crushing ER delivers the whole dose at once.' }
      ],
      rationale: 'Verify placement, give each drug separately with flushes, keep the head up. Never crush extended-release or delayed-release forms.' },
    { step: 'action', type: 'single',
      chart: { notes: [{ time: '0840', text: 'SpO₂ back to 96% on room air, coughing subsided, NG-tube placement verified. Metoprolol held because heart rate remains 56.' }] },
      prompt: 'Which action by the nurse demonstrates correct medication administration through the NG tube?',
      options: [
        { t: 'Administer each enteral medication separately using the appropriate preparation and flushing technique', ok: true, why: 'The safe standard.' },
        { t: 'Combine the aspirin, potassium, and pantoprazole in one syringe', ok: false, why: 'Interactions and clogging.' },
        { t: 'Add the medications directly to the enteral feeding formula', ok: false, why: 'Unsafe.' },
        { t: 'Crush the pantoprazole granules before administering them through the tube', ok: false, why: 'Destroys the delayed-release coating.' },
        { t: 'Administer the metoprolol after all other medications because the blood pressure is normal', ok: false, why: 'Heart rate 56: the hold parameter applies.' }
      ],
      rationale: 'One drug at a time, flush between, protect delayed-release granules, honor the hold parameter.' },
    { step: 'evaluate', type: 'sata', n: 2,
      chart: { notes: [{ time: '1040', text: 'Reassessment two hours after medication administration.' }], vitals: { cols: ['1040'], rows: [['HR', '62'], ['BP', '126/70'], ['RR', '18'], ['SpO₂', '96% RA'], ['Lungs', 'clear bilaterally'], ['NG tube', 'patent'], ['Glucose', '168'], ['K⁺', '3.6'], ['Neuro', 'unchanged from baseline']] } },
      prompt: 'Two hours after medication administration, which findings best demonstrate that the medication-administration interventions were effective? Select all that apply.',
      options: [
        { t: 'NG tube remains patent', ok: true, why: 'Separate administration with flushing kept the tube open.' },
        { t: 'Potassium increased from 3.2 to 3.6 mEq/L', ok: true, why: 'The liquid potassium was delivered and absorbed.' },
        { t: 'Neurologic status is unchanged', ok: false, why: 'Stable, but not evidence about the medication administration.' },
        { t: 'Blood pressure is 126/70 mm Hg', ok: false, why: 'Not a medication-administration outcome here.' },
        { t: 'SpO₂ is 96% with clear lung sounds', ok: false, why: 'Reflects aspiration prevention rather than the administration technique.' },
        { t: 'Heart rate is 62 beats/min', ok: false, why: 'Reflects holding the metoprolol rather than the administration technique.' }
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
    profile: 'Partial colectomy with primary anastomosis 4 days ago for a descending colon tumor. History: hypertension, hyperlipidemia. Recovery initially uncomplicated: ambulating with assistance, tolerating small amounts of a soft diet.',
    notes: [{ time: 'Post-op day 4, 0730', text: '"I just don\'t feel right today. My stomach hurts more than it did yesterday." Alert and oriented ×4. Abdomen distended and diffusely tender. Bowel sounds hypoactive. Incision well approximated, no drainage.' }],
    vitals: { cols: ['Day 1', 'Day 2', 'Day 3', 'Day 4'], rows: [['Temp', '99.1', '99.4', '100.2', '101.8 °F'], ['HR', '88', '92', '102', '118'], ['BP', '132/78', '128/76', '118/70', '106/64'], ['RR', '18', '18', '20', '24'], ['SpO₂', '95% RA', '94% RA', '97% RA', '95% RA'], ['Abd pain', '4/10 incisional', '3/10 incisional', '4/10 abdominal', '7/10 diffuse'], ['Abdomen', 'soft, expected tenderness', 'mild tenderness', 'increasing distention', 'distended, diffusely tender'], ['Bowel sounds', 'hypoactive', 'hypoactive', 'present, decreased', 'hypoactive'], ['Urine output', '45 mL/hr', '42 mL/hr', '35 mL/hr', '25 mL/hr']] }
  },
  items: [
    { step: 'recognize', type: 'sata', unverified: true,
      prompt: 'It is post-op day 4. Which findings may indicate the patient is developing complications? Select all that apply.',
      options: [
        { t: 'Temperature 101.8 °F (38.8 °C)', ok: true, why: 'Climbing every day; now a true fever.' },
        { t: 'SpO₂ 95% on room air', ok: false, why: 'Stable across all four days.' },
        { t: 'Urine output 25 mL/hr', ok: true, why: 'Falling from 45 toward oliguria: perfusion is dropping.' },
        { t: 'Heart rate 118 beats/min', ok: true, why: 'Rising every day.' },
        { t: 'Surgical incision well approximated with no drainage', ok: false, why: 'Reassuring: the problem is inside, not the skin.' },
        { t: 'Blood pressure 106/64 mm Hg', ok: true, why: 'Normal as a single number, but trending down from 132/78. The trend is the cue.' },
        { t: 'Abdominal pain 7/10, diffuse', ok: true, why: 'Pain should be fading; it is spreading and worsening.' },
        { t: 'Bowel sounds hypoactive', ok: true, why: 'Went back to hypoactive after starting to return.' }
      ],
      rationale: 'Read the trend, not the day. Fever, heart rate, pain and distention are climbing; blood pressure and urine output are falling; the bowel went quiet again. Only the saturation and the incision are unchanged and reassuring.' },
    { step: 'analyze', type: 'sata', n: 2, unverified: true,
      chart: { labs: [['WBC', '18,600', '4,500–11,000'], ['Hemoglobin', '11.2', '12–16'], ['Platelets', '182,000', '150–450 k'], ['Creatinine', '1.7 (pre-op 0.9)', '0.6–1.3'], ['Lactate', '3.8', '0.5–2.2'], ['Glucose', '164', '70–110']] },
      prompt: 'Labs return; pre-op creatinine was 0.9. Which findings indicate the condition is progressing to systemic hypoperfusion? Select all that apply.',
      options: [
        { t: 'Creatinine increased from 0.9 to 1.7 mg/dL', ok: true, why: 'Kidneys are underperfused: organ dysfunction.' },
        { t: 'Lactate 3.8 mmol/L', ok: true, why: 'Tissues are starved of oxygen.' },
        { t: 'WBC 18,600/mm³', ok: false, why: 'Infection, but not proof of hypoperfusion.' },
        { t: 'Hemoglobin 11.2 g/dL', ok: false, why: 'Mild post-op anemia.' },
        { t: 'Glucose 164 mg/dL', ok: false, why: 'Stress response.' },
        { t: 'Platelets 182,000/mm³', ok: false, why: 'Normal.' }
      ],
      rationale: 'Separate "infection" cues (fever, WBC) from "perfusion failing" cues (rising creatinine, rising lactate). The second group is what turns sepsis into shock.' },
    { step: 'prioritize', type: 'single', unverified: true,
      chart: { diagnostics: ['CT abdomen: extraluminal air and fluid adjacent to the colonic anastomosis, consistent with an anastomotic leak.'], notes: [{ time: '+30 min', text: 'Restless, answers questions slowly. Urine output 10 mL in the past hour.' }], vitals: { cols: ['+30 min'], rows: [['Temp', '102.4 °F'], ['HR', '132'], ['RR', '28'], ['BP', '86/50'], ['SpO₂', '94% on 2 L']] } },
      prompt: 'The CT confirms an anastomotic leak. Thirty minutes later he is restless, BP 86/50, urine 10 mL in the past hour. Which hypothesis should the nurse prioritize?',
      options: [
        { t: 'Septic shock secondary to an anastomotic leak', ok: true, why: 'Infection source + hypotension + organ dysfunction.' },
        { t: 'Postoperative paralytic ileus', ok: false, why: 'Does not cause shock.' },
        { t: 'Acute kidney injury related to dehydration', ok: false, why: 'The kidney injury is a result, not the cause.' },
        { t: 'Acute postoperative pain', ok: false, why: 'Not the threat.' },
        { t: 'Pulmonary embolism', ok: false, why: 'No sudden dyspnea or pleuritic pain; the CT explains everything.' }
      ],
      rationale: 'Bowel contents leaking into the abdomen seed infection; the infection triggers vasodilation and organ failure. Name the worst reasonable explanation that fits all the cues.' },
    { step: 'generate', type: 'sata', n: 5, unverified: true,
      prompt: 'Which interventions should the nurse anticipate as priorities in the management of this patient? Select all that apply.',
      options: [
        { t: 'Administer broad-spectrum IV antibiotics promptly', ok: true, why: 'Within the hour.' },
        { t: 'Administer an isotonic crystalloid IV bolus', ok: true, why: 'Refill the dilated vessels.' },
        { t: 'Prepare the patient for urgent surgical intervention', ok: true, why: 'The leak must be repaired: source control.' },
        { t: 'Obtain blood cultures', ok: true, why: 'Identify the organism (before antibiotics if it does not delay them).' },
        { t: 'Administer antibiotics', ok: true, why: 'Same priority stated again in the packet.' },
        { t: 'Administer the scheduled oral antihypertensive medication', ok: false, why: 'BP is 86/50.' },
        { t: 'Encourage oral fluid intake', ok: false, why: 'NPO for emergency surgery; oral fluid cannot fix shock.' },
        { t: 'Begin enteral feeding to promote postoperative healing', ok: false, why: 'A leaking bowel is not fed.' }
      ],
      rationale: 'The sepsis bundle plus source control: cultures, antibiotics, fluids, and the operating room. Hold anything that lowers pressure or feeds a leaking bowel.' },
    { step: 'action', type: 'single', unverified: true,
      chart: { orders: ['Lactated Ringer\'s 2,000 mL IV bolus', 'Piperacillin/tazobactam IV', 'Blood cultures ×2', 'Acetaminophen 650 mg rectally for temperature greater than 101 °F', 'Norepinephrine infusion if hypotension persists following fluid resuscitation', 'Insert indwelling urinary catheter', 'Prepare the patient for emergency exploratory surgery'], vitals: { cols: ['Orders'], rows: [['HR', '136'], ['RR', '30'], ['BP', '82/46'], ['SpO₂', '95% on 2 L']] } },
      prompt: 'Two patent large-bore IVs are in place. HR 136, BP 82/46. Which action should the nurse take first?',
      options: [
        { t: 'Begin the prescribed IV crystalloid bolus', ok: true, why: 'Circulation: the pressure is critical now.' },
        { t: 'Administer the patient\'s first dose of IV antibiotic', ok: false, why: 'Right after fluids are running and cultures are drawn.' },
        { t: 'Administer acetaminophen', ok: false, why: 'Comfort, not survival.' },
        { t: 'Insert the urinary catheter', ok: false, why: 'Monitoring; after resuscitation starts.' },
        { t: 'Prepare the patient for transport to the operating room', ok: false, why: 'He must be resuscitated first.' }
      ],
      rationale: 'With a pressure of 82/46 the first action is volume. Antibiotics follow within the hour; the catheter measures the response; the OR fixes the source once he is stable enough to go.' },
    { step: 'evaluate', type: 'sata', n: 3, unverified: true,
      chart: { notes: [{ time: 'Post-op (repair)', text: 'Received IV fluids, broad-spectrum antibiotics and norepinephrine; emergency abdominal washout and repair of the leaking anastomosis.' }], vitals: { cols: ['After repair'], rows: [['HR', '98'], ['BP', '108/66'], ['MAP', '80'], ['Temp', '100.6 °F'], ['Lactate', '2.1'], ['Urine output', '38 mL/hr'], ['WBC', '17,900'], ['SpO₂', '96% on 2 L']] } },
      prompt: 'Several hours after surgery, which findings provide the strongest evidence that tissue perfusion has improved? Select all that apply.',
      options: [
        { t: 'Mean arterial pressure is 80 mm Hg', ok: true, why: 'Organs are perfused (goal ≥ 65).' },
        { t: 'Lactate decreased to 2.1 mmol/L', ok: true, why: 'Tissues are getting oxygen again.' },
        { t: 'Urine output is 38 mL/hr', ok: true, why: 'Kidneys are perfused.' },
        { t: 'Temperature decreased to 100.6 °F (38.1 °C)', ok: false, why: 'Infection response, not perfusion.' },
        { t: 'WBC remains 17,900/mm³', ok: false, why: 'Still fighting infection; not a perfusion marker.' },
        { t: 'SpO₂ is 96% on 2 L/min nasal cannula', ok: false, why: 'Oxygenation, not perfusion.' }
      ],
      rationale: 'Perfusion has its own scorecard: MAP, lactate, urine output. Fever and WBC track infection; SpO₂ tracks oxygenation. Match the evidence to the question.' }
  ]
});

window.CASES.filter(c => c.id.startsWith('w1-')).forEach(c => { c.source = c.source || 'NGN Case Studies Week 1'; });
