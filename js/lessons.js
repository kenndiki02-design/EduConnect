// ============================================================
// EduConnect Kenya — Lesson Plan Generator Logic
// ============================================================

// ── Lesson Plan Templates ─────────────────────────────────
const lessonTemplates = {
  maths: {
    subject:'Mathematics', grade:'Grade 9', topic:'Quadratic Equations',
    subtopic:'Solving by Factorisation', duration:'40', learners:'35',
    approach:'inquiry', materials:'textbooks, graph paper, calculators',
    objectives:'',considerations:'',
    assessment:true, homework:true, values:true, differentiation:false,
  },
  science: {
    subject:'Science & Technology', grade:'Grade 7', topic:'Photosynthesis',
    subtopic:'The Process and Importance of Photosynthesis', duration:'40', learners:'32',
    approach:'collaborative', materials:'charts, leaf specimens, textbooks',
    objectives:'',considerations:'',
    assessment:true, homework:true, values:true, differentiation:false,
  },
  english: {
    subject:'English', grade:'Form 2', topic:'Essay Writing',
    subtopic:'Argumentative Essay Structure', duration:'60', learners:'38',
    approach:'direct', materials:'textbooks, writing exercise books, sample essays',
    objectives:'',considerations:'',
    assessment:true, homework:true, values:true, differentiation:false,
  },
};

// ── CBC Learning Activities by Approach ──────────────────
const approachActivities = {
  inquiry:        ['Question-and-answer session', 'Guided discovery activity', 'Learner investigation', 'Group discussion and findings sharing'],
  collaborative:  ['Pair work exercise', 'Small group discussion', 'Peer teaching', 'Group presentation'],
  direct:         ['Teacher demonstration', 'Whole-class explanation', 'Worked examples', 'Class practice'],
  project:        ['Project planning', 'Research activity', 'Product creation', 'Project presentation'],
  differentiated: ['Tiered tasks (basic/standard/extension)', 'Flexible grouping activity', 'Choice board activity', 'Scaffolded support task'],
};

const cbcValues = [
  'Love','Social Justice','Respect','Excellence','Responsibility',
  'Integrity','Patriotism','Unity',
];

// ── Load Sample Plan ─────────────────────────────────────
function loadSample(key) {
  const t = lessonTemplates[key];
  document.getElementById('lp-subject').value = t.subject;
  document.getElementById('lp-grade').value   = t.grade;
  document.getElementById('lp-topic').value   = t.topic;
  document.getElementById('lp-subtopic').value= t.subtopic;
  document.getElementById('lp-duration').value= t.duration;
  document.getElementById('lp-learners').value= t.learners;
  document.getElementById('lp-approach').value= t.approach;
  document.getElementById('lp-materials').value=t.materials;
  document.getElementById('opt-assessment').checked   = t.assessment;
  document.getElementById('opt-homework').checked     = t.homework;
  document.getElementById('opt-values').checked       = t.values;
  document.getElementById('opt-differentiation').checked = t.differentiation;
  generateLesson();
}

// ── Generate Lesson Plan ─────────────────────────────────
function generateLesson() {
  const subject  = document.getElementById('lp-subject').value;
  const grade    = document.getElementById('lp-grade').value;
  const topic    = document.getElementById('lp-topic').value.trim();
  const subtopic = document.getElementById('lp-subtopic').value.trim();
  const duration = parseInt(document.getElementById('lp-duration').value) || 40;
  const learners = document.getElementById('lp-learners').value || '35';
  const approach = document.getElementById('lp-approach').value;
  const materials= document.getElementById('lp-materials').value.trim() || 'textbooks, exercise books, chalk/markers';
  const considerations = document.getElementById('lp-considerations').value.trim();
  const customObjectives = document.getElementById('lp-objectives').value.trim();

  const inclAssessment    = document.getElementById('opt-assessment').checked;
  const inclHomework      = document.getElementById('opt-homework').checked;
  const inclValues        = document.getElementById('opt-values').checked;
  const inclDifferent     = document.getElementById('opt-differentiation').checked;

  if (!subject) { showToast('Please select a subject', 'error'); return; }
  if (!grade)   { showToast('Please select a grade/form', 'error'); return; }
  if (!topic)   { showToast('Please enter a topic', 'error'); return; }

  // Show loading state
  const btn = document.getElementById('generate-btn');
  btn.classList.add('loading');
  btn.textContent = 'Generating...';

  setTimeout(() => {
    btn.classList.remove('loading');
    btn.textContent = '✨ Generate Lesson Plan';

    // Generate the plan HTML
    const planHTML = buildLessonPlan({
      subject, grade, topic, subtopic, duration, learners,
      approach, materials, considerations, customObjectives,
      inclAssessment, inclHomework, inclValues, inclDifferent,
    });

    document.getElementById('output-empty').style.display   = 'none';
    document.getElementById('output-content').style.display = 'block';

    // Meta info
    document.getElementById('output-meta').innerHTML = `
      <span>${subject}</span>
      <span> ${grade}</span>
      <span> ${duration} min</span>
      <span> ${learners} learners</span>
    `;

    document.getElementById('lesson-output').innerHTML = planHTML;
    animateProgressBars();
    showToast('Lesson plan generated successfully!', 'success');
  }, 1800);
}

function regenerateLesson() { generateLesson(); }

// ── Build Lesson Plan HTML ────────────────────────────────
function buildLessonPlan({ subject, grade, topic, subtopic, duration, learners,
                           approach, materials, considerations, customObjectives,
                           inclAssessment, inclHomework, inclValues, inclDifferent }) {

  const today = new Date().toLocaleDateString('en-KE', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const approachLabel = {
    inquiry:'Inquiry-Based Learning', collaborative:'Collaborative Learning',
    direct:'Direct Instruction', project:'Project-Based Learning', differentiated:'Differentiated Instruction',
  }[approach] || 'Inquiry-Based Learning';

  // Generate objectives
  const objectives = customObjectives
    ? customObjectives.split('\n').filter(Boolean)
    : generateObjectives(subject, topic, approach);

  // Generate timeline
  const timeline = generateTimeline(duration, approach, topic);

  // Generate materials list
  const materialList = materials.split(',').map(m => m.trim()).filter(Boolean);

  // Generate assessment
  const assessmentItems = generateAssessment(subject, topic, approach);

  // Generate CBC values
  const selectedValues = inclValues
    ? cbcValues.sort(() => Math.random() - 0.5).slice(0, 3)
    : [];

  // Generate activities
  const activities = (approachActivities[approach] || approachActivities.inquiry);

  let html = `
    <h2>${subject}: ${topic}</h2>
    <div class="lesson-subtitle">
      ${subtopic ? `<strong>${subtopic}</strong> · ` : ''}
      ${grade} · ${duration} Minutes · ${today}
    </div>

    <div class="lesson-meta-grid">
      <div class="meta-item"><span class="meta-key">Approach</span><span class="meta-val">${approachLabel}</span></div>
      <div class="meta-item"><span class="meta-key">Learners</span><span class="meta-val">${learners}</span></div>
      <div class="meta-item"><span class="meta-key">Date</span><span class="meta-val">${today}</span></div>
      ${considerations ? `<div class="meta-item"><span class="meta-key">Notes</span><span class="meta-val">${considerations}</span></div>` : ''}
    </div>

    <!-- OBJECTIVES -->
    <div class="lesson-section">
      <div class="lesson-section-title">Learning Objectives</div>
      <p style="margin-bottom:14px; font-size:0.875rem;">By the end of this lesson, learners should be able to:</p>
      <div class="lesson-objectives">
        ${objectives.map((obj, i) => `
          <div class="lesson-objective">
            <div class="obj-num">${i+1}</div>
            <div>${obj}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- MATERIALS -->
    <div class="lesson-section">
      <div class="lesson-section-title">Teaching & Learning Materials</div>
      <div class="materials-list">
        ${materialList.map(m => `<span class="material-tag">📌 ${m}</span>`).join('')}
        <span class="material-tag">📌 Whiteboard / Chalkboard</span>
        <span class="material-tag">📌 Lesson plan (this document)</span>
      </div>
    </div>

    <!-- LESSON PROCEDURE -->
    <div class="lesson-section">
      <div class="lesson-section-title">Lesson Procedure</div>
      <div class="lesson-timeline">
        ${timeline.map(t => `
          <div class="timeline-item">
            <div class="timeline-time">${t.time}</div>
            <div class="timeline-content">
              <div class="timeline-phase">${t.phase}</div>
              <div class="timeline-detail">${t.detail}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- KEY ACTIVITIES -->
    <div class="lesson-section">
      <div class="lesson-section-title">Key Learning Activities</div>
      <ul style="padding-left:20px; display:flex; flex-direction:column; gap:10px;">
        ${activities.map(a => `<li><strong>${a}</strong> — tailored to the ${topic} topic</li>`).join('')}
      </ul>
    </div>
  `;

  // Assessment
  if (inclAssessment) {
    html += `
    <div class="lesson-section">
      <div class="lesson-section-title">Assessment Strategies</div>
      <div class="assessment-grid">
        ${assessmentItems.map(a => `
          <div class="assessment-item">
            <div class="assessment-type">${a.type}</div>
            <div class="assessment-desc">${a.desc}</div>
          </div>`).join('')}
      </div>
    </div>`;
  }

  // Homework
  if (inclHomework) {
    html += `
    <div class="lesson-section">
      <div class="lesson-section-title">Homework / Extended Learning</div>
      <p>${generateHomework(subject, topic)}</p>
    </div>`;
  }

  // Differentiation
  if (inclDifferent) {
    html += `
    <div class="lesson-section">
      <div class="lesson-section-title">Differentiation Strategies</div>
      <div class="assessment-grid">
        <div class="assessment-item">
          <div class="assessment-type">Support (below level)</div>
          <div class="assessment-desc">Provide simplified worked examples, vocabulary guides, and one-to-one support during practice tasks.</div>
        </div>
        <div class="assessment-item">
          <div class="assessment-type">Extension (above level)</div>
          <div class="assessment-desc">Challenge learners with real-world application problems and cross-subject connections to deepen understanding.</div>
        </div>
      </div>
    </div>`;
  }

  // CBC Values
  if (inclValues && selectedValues.length) {
    html += `
    <div class="lesson-section">
      <div class="lesson-section-title">CBC Core Values Integration</div>
      <div class="cbc-values">
        ${selectedValues.map(v => `<span class="cbc-value">${v}</span>`).join('')}
      </div>
      <p style="margin-top:14px; font-size:0.875rem;">These values are integrated through collaborative activities, respectful discussion, and responsible use of learning resources.</p>
    </div>`;
  }

  // Teacher reflection
  html += `
    <div class="lesson-section">
      <div class="lesson-section-title">Teacher Reflection</div>
      <div class="reflection-grid">
        <div class="reflection-item">
          <label class="form-label">What went well?</label>
          <div class="reflection-box" contenteditable="true" data-placeholder="Write your reflection after the lesson..."></div>
        </div>
        <div class="reflection-item">
          <label class="form-label">What needs improvement?</label>
          <div class="reflection-box" contenteditable="true" data-placeholder="Write your reflection after the lesson..."></div>
        </div>
      </div>
    </div>`;

  return html;
}

// ── Helper: Generate Objectives ──────────────────────────
function generateObjectives(subject, topic, approach) {
  const topicLower = topic.toLowerCase();
  if (topicLower.includes('equation') || topicLower.includes('algebra')) {
    return [
      `Solve ${topic} accurately using at least two different methods`,
      `Identify real-world applications of ${topic} in everyday life`,
      `Demonstrate understanding by explaining steps to peers`,
      `Apply learned skills to solve exam-style practice questions`,
    ];
  }
  if (topicLower.includes('photosynthesis') || topicLower.includes('plant')) {
    return [
      `Define photosynthesis and state the conditions required for it`,
      `Write and explain the word equation for photosynthesis`,
      `Identify the role of chlorophyll in the process`,
      `Describe the importance of photosynthesis to living organisms`,
    ];
  }
  if (topicLower.includes('essay') || topicLower.includes('writing')) {
    return [
      `Identify and apply the structural components of a well-written essay`,
      `Construct a clear, arguable thesis statement for a given prompt`,
      `Use cohesive devices and transitional phrases to improve flow`,
      `Peer-review and provide constructive feedback on classmates' writing`,
    ];
  }
  return [
    `Define and explain the key concepts related to ${topic}`,
    `Apply knowledge of ${topic} to solve relevant problems or tasks`,
    `Analyse real-life examples and connections to ${topic}`,
    `Demonstrate learning through a short assessment activity`,
  ];
}

// ── Helper: Generate Timeline ─────────────────────────────
function generateTimeline(duration, approach, topic) {
  const intro = Math.round(duration * 0.15);
  const main  = Math.round(duration * 0.55);
  const pract = Math.round(duration * 0.20);
  const close = duration - intro - main - pract;

  return [
    {
      time: `0–${intro} min`,
      phase: 'Introduction / Warm-Up',
      detail: `Greet learners and take register. Review previous lesson concepts. Introduce today's topic: <strong>${topic}</strong>. Use a thought-provoking question or real-world scenario to engage learners and activate prior knowledge.`,
    },
    {
      time: `${intro}–${intro+main} min`,
      phase: 'Lesson Development',
      detail: `Present the main content of the lesson using the ${approach === 'direct' ? 'direct instruction' : approach === 'collaborative' ? 'collaborative group activity' : 'guided inquiry'} approach. Introduce concepts step-by-step with examples. Learners engage actively through ${approachActivities[approach]?.[0] || 'guided tasks'}.`,
    },
    {
      time: `${intro+main}–${intro+main+pract} min`,
      phase: 'Guided & Independent Practice',
      detail: `Learners practise with structured tasks. Teacher circulates the room to monitor understanding, identify misconceptions, and provide support. Learners may work individually or in pairs depending on the activity.`,
    },
    {
      time: `${intro+main+pract}–${duration} min`,
      phase: 'Lesson Closure & Summary',
      detail: `Review key learning points with the class. Use exit-ticket or Q&A to check understanding. Preview the next lesson topic. Issue homework or extended learning activity.`,
    },
  ];
}

// ── Helper: Generate Assessment ──────────────────────────
function generateAssessment(subject, topic, approach) {
  return [
    { type: 'Formative — Observation', desc: `Teacher observes learner participation and engagement during the ${topic} activity. Uses checklist for targeted learners.` },
    { type: 'Formative — Q&A', desc: `Targeted questioning during lesson development to gauge understanding. Bloom\'s taxonomy levels: recall → application → analysis.` },
    { type: 'Summative — Exit Ticket', desc: `3 short questions on ${topic} to be completed individually in the last 5 minutes. Collected and reviewed before next lesson.` },
    { type: 'Peer Assessment', desc: `Learners review each other\'s work using a provided marking guide. Promotes metacognition and collaborative skills.` },
  ];
}

// ── Helper: Generate Homework ────────────────────────────
function generateHomework(subject, topic) {
  return `Learners are assigned the following extended activity: <strong>Complete 5 practice questions</strong> on ${topic} from the textbook (page references as applicable). Additionally, learners should <strong>research one real-world application</strong> of ${topic} and write a short paragraph (3–5 sentences) explaining the connection. This is to be submitted at the beginning of the next lesson.`;
}

// ── Print & Download ──────────────────────────────────────
function printLesson() {
  window.print();
}

function downloadLesson() {
  const content = document.getElementById('lesson-output').innerText;
  const blob = new Blob([content], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'EduConnect_Lesson_Plan.txt';
  a.click();
  showToast('Lesson plan downloaded! ', 'success');
}

// Add reflection box placeholder styling via JS
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('reflection-box')) {
      e.target.dataset.empty = e.target.innerText.trim() === '' ? 'true' : 'false';
    }
  });
});
