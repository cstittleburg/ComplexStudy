/* Frameworks registry.
   A framework is any structured way of thinking the course teaches. Cases tag each item with a
   framework step (`step: 'recognize'`), the engine draws the step ribbon from this file, and mastery
   is tracked per framework step. To add a framework, add an entry here and tag items with its step ids. */
window.FRAMEWORKS = {
  cjmm: {
    id: 'cjmm',
    name: 'Clinical Judgment Measurement Model',
    short: 'CJMM',
    mnemonic: 'Really Anxious Patients Get Treated Early',
    steps: [
      { id: 'recognize', label: 'Recognize cues', question: 'What changed from baseline?', rhyme: 'What\'s new, what\'s changed, what\'s worse than before? That\'s the cue you can\'t ignore.' },
      { id: 'analyze', label: 'Analyze cues', question: 'Which cues belong together?', rhyme: 'Cues that cluster tell a story. Group them up before you worry.' },
      { id: 'prioritize', label: 'Prioritize hypotheses', question: 'What is the worst reasonable explanation?', rhyme: 'Not the most likely, the most deadly first. Ask: which one gets me the worst?' },
      { id: 'generate', label: 'Generate solutions', question: 'What can happen now, and in parallel?', rhyme: 'List every fix that fits the threat, then cross out what makes things worse yet.' },
      { id: 'action', label: 'Take action', question: 'What does the nurse do first?', rhyme: 'Do what dies first if delayed: airway, breathing, then the aid.' },
      { id: 'evaluate', label: 'Evaluate outcomes', question: 'What proves improvement, or decline?', rhyme: 'An action\'s not done till you look again: better, worse, or same, and then?' }
    ]
  },
  lens: {
    id: 'lens',
    name: 'The Priority Lens',
    short: 'Priority Lens',
    mnemonic: 'Priority is what becomes unsafe when delayed.',
    steps: [
      { id: 'wait', label: 'Who could deteriorate if I wait?', question: 'Risk of delay.' },
      { id: 'new', label: 'What is new, unexpected, or worsening?', question: 'Change from baseline.' },
      { id: 'stable', label: 'Stable or unstable?', question: 'Trajectory.' },
      { id: 'threat', label: 'Immediate physiologic or safety threat?', question: 'ABCs and safety.' },
      { id: 'now', label: 'What must happen now?', question: 'The first safe action.' }
    ]
  },
  sbar: {
    id: 'sbar',
    name: 'SBAR handoff',
    short: 'SBAR',
    mnemonic: 'Report the trend, not just the number.',
    steps: [
      { id: 's', label: 'Situation', question: 'Acute change, and why now.' },
      { id: 'b', label: 'Background', question: 'Diagnosis, treatment, time, meds.' },
      { id: 'a', label: 'Assessment', question: 'The trend: LOC, pupils, vitals, airway.' },
      { id: 'r', label: 'Recommendation', question: 'Immediate response needed.' }
    ]
  }
};
