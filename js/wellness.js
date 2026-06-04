// ============================================================
// EduConnect Kenya — Wellness Hub JavaScript
// ============================================================

// ── Daily Affirmations ──
const affirmations = [
  "You are capable of amazing things. Every step forward, no matter how small, is progress.",
  "Your mental health is just as important as your grades or productivity. Take care of yourself first.",
  "You do not have to carry the weight of the world alone. It is okay to ask for help.",
  "Deep breaths. You have survived difficult days before, and you can handle what lies ahead.",
  "To the teachers: Your dedication changes lives. Remember to pour back into your own cup.",
  "To the students: Your worth is not defined by a single exam score or academic setback.",
  "To the parents: Your love and support make a difference. Be gentle with yourself on this journey.",
  "You are growing, learning, and becoming stronger every single day. Trust your process.",
  "Rest is not earned; it is a necessity. Give yourself permission to pause today.",
  "You are surrounded by a community that cares about your success and your wellbeing."
];

function newAffirmation() {
  const display = document.getElementById('affirmation-text');
  if (!display) return;
  
  // Fade out
  display.style.opacity = 0;
  display.style.transform = 'translateY(10px)';
  
  setTimeout(() => {
    let currentText = display.textContent;
    let nextText = currentText;
    
    // Ensure we don't repeat the same one immediately
    while (nextText === currentText) {
      const idx = Math.floor(Math.random() * affirmations.length);
      nextText = `"${affirmations[idx]}"`;
    }
    
    display.textContent = nextText;
    // Fade in
    display.style.opacity = 1;
    display.style.transform = 'translateY(0)';
  }, 300);
}

// ── Mood Check-In ──
const moodResponses = {
  5: {
    emoji: "😄",
    bg: "rgba(0, 168, 107, 0.1)",
    border: "rgba(0, 168, 107, 0.3)",
    color: "#00D68F",
    text: "<strong>Amazing!</strong> We love to hear that! Keep spreading that positive energy. Share your joy with a friend or colleague today."
  },
  4: {
    emoji: "😊",
    bg: "rgba(0, 119, 182, 0.1)",
    border: "rgba(0, 119, 182, 0.3)",
    color: "#60AFFF",
    text: "<strong>Good!</strong> A steady, positive state is wonderful. Keep doing what you're doing. Have a lovely, productive day!"
  },
  3: {
    emoji: "😐",
    bg: "rgba(245, 166, 35, 0.1)",
    border: "rgba(245, 166, 35, 0.3)",
    color: "#FFD166",
    text: "<strong>Okay.</strong> A neutral day is perfectly fine. Remember to take short breaks, drink some water, and check in with yourself later."
  },
  2: {
    emoji: "😔",
    bg: "rgba(200, 16, 46, 0.1)",
    border: "rgba(200, 16, 46, 0.3)",
    color: "#FF3855",
    text: "<strong>Feeling Low?</strong> That is completely okay. Be extra gentle with yourself. Maybe try a short <strong>Breathing Exercise</strong> in the next tab to help center your thoughts."
  },
  1: {
    emoji: "😢",
    bg: "rgba(200, 16, 46, 0.15)",
    border: "rgba(200, 16, 46, 0.5)",
    color: "#FF3855",
    text: "<strong>Struggling?</strong> We are so sorry to hear that, but remember you are not alone. Please consider speaking with a trusted friend, a teacher/parent, or check our <strong>Counseling directory</strong> for 24/7 support lines."
  }
};

function selectMood(btn) {
  const container = document.getElementById('mood-tracker');
  if (!container) return;

  // Highlight selected button
  const buttons = container.querySelectorAll('.mood-btn');
  buttons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const moodVal = parseInt(btn.dataset.mood);
  const responseData = moodResponses[moodVal];
  
  const responseDiv = document.getElementById('mood-response');
  if (responseDiv && responseData) {
    responseDiv.style.display = 'block';
    responseDiv.style.opacity = 0;
    responseDiv.style.transform = 'translateY(10px)';
    
    // Apply dynamic styles based on mood
    responseDiv.style.background = responseData.bg;
    responseDiv.style.border = `1px solid ${responseData.border}`;
    responseDiv.style.color = 'var(--text-primary)';
    
    responseDiv.innerHTML = `
      <div style="display:flex; align-items:center; gap:16px;">
        <span style="font-size: 2rem;">${responseData.emoji}</span>
        <div>${responseData.text}</div>
      </div>
    `;

    // Smooth entry
    setTimeout(() => {
      responseDiv.style.transition = 'all 0.4s ease';
      responseDiv.style.opacity = 1;
      responseDiv.style.transform = 'translateY(0)';
    }, 50);

    showToast(`Mood logged: ${btn.dataset.label}`, 'info');
  }
}

// ── Tab Navigation (Wellness Specific) ──
function switchTab(btn, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const tabId = btn.dataset.tab;
  const tabButtons = container.querySelectorAll('.tab-btn');
  const tabContents = container.querySelectorAll('.tab-content');

  tabButtons.forEach(b => b.classList.remove('active'));
  tabContents.forEach(c => {
    c.classList.remove('active');
    c.style.display = 'none'; // Ensure fully hidden
  });

  btn.classList.add('active');
  const targetContent = container.querySelector(`.tab-content[data-tab="${tabId}"]`);
  if (targetContent) {
    targetContent.classList.add('active');
    targetContent.style.display = 'block';
    
    // Trigger scroll animations in tab if any
    const scrollAnims = targetContent.querySelectorAll('.animate-on-scroll');
    scrollAnims.forEach(el => el.classList.add('visible'));
  }

  // If leaving breathing tab, make sure exercises are stopped
  if (tabId !== 'breathing') {
    stopBreathing();
  }
}

// ── Wellness Self-Assessment Quiz ──
const quizQuestions = [
  {
    q: "How often have you felt overwhelmed by your studies, work, or daily tasks in the past week?",
    options: [
      { text: "Never or rarely", score: 0 },
      { text: "Sometimes", score: 1 },
      { text: "Often", score: 2 },
      { text: "Almost always", score: 3 }
    ]
  },
  {
    q: "How would you rate your sleep quality over the last few days?",
    options: [
      { text: "Excellent and restful", score: 0 },
      { text: "Good, but could be better", score: 1 },
      { text: "Interrupted/Hard to sleep", score: 2 },
      { text: "Severe insomnia or constant fatigue", score: 3 }
    ]
  },
  {
    q: "Do you find it difficult to relax, quiet your mind, or enjoy hobbies lately?",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Occasionally", score: 1 },
      { text: "Frequently", score: 2 },
      { text: "Almost constantly", score: 3 }
    ]
  },
  {
    q: "How connected do you feel to friends, family, or colleagues for emotional support?",
    options: [
      { text: "Very connected and supported", score: 0 },
      { text: "Somewhat connected", score: 1 },
      { text: "A little isolated", score: 2 },
      { text: "Extremely lonely/Disconnected", score: 3 }
    ]
  },
  {
    q: "Have you felt low in motivation, unusually irritable, or persistently sad?",
    options: [
      { text: "Hardly ever", score: 0 },
      { text: "Some days", score: 1 },
      { text: "Most days", score: 2 },
      { text: "Every single day", score: 3 }
    ]
  }
];

let currentQuizStep = 0;
let userQuizAnswers = [];

function initQuiz() {
  currentQuizStep = 0;
  userQuizAnswers = [];
  renderQuizStep();
}

function renderQuizStep() {
  const quizContent = document.getElementById('quiz-content');
  const progressFill = document.getElementById('quiz-progress');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  if (!quizContent) return;

  const totalSteps = quizQuestions.length;
  const progressPercent = (currentQuizStep / totalSteps) * 100;
  if (progressFill) progressFill.style.width = `${progressPercent}%`;

  // Update nav buttons
  if (prevBtn) prevBtn.style.display = currentQuizStep === 0 ? 'none' : 'inline-flex';
  if (nextBtn) {
    nextBtn.textContent = currentQuizStep === totalSteps - 1 ? 'Show Results 🎉' : 'Next →';
  }

  const currentQ = quizQuestions[currentQuizStep];
  const savedAnswer = userQuizAnswers[currentQuizStep] !== undefined ? userQuizAnswers[currentQuizStep] : null;

  let optionsHTML = '';
  currentQ.options.forEach((opt, idx) => {
    const isSelected = savedAnswer === idx ? 'selected' : '';
    optionsHTML += `
      <div class="quiz-option ${isSelected}" data-idx="${idx}" onclick="selectQuizOption(this, ${idx})">
        <div class="quiz-option-radio"></div>
        <div class="quiz-option-text">${opt.text}</div>
      </div>
    `;
  });

  quizContent.innerHTML = `
    <span class="quiz-counter">Question ${currentQuizStep + 1} of ${totalSteps}</span>
    <h4 class="quiz-question">${currentQ.q}</h4>
    <div class="quiz-options-list">
      ${optionsHTML}
    </div>
  `;
}

function selectQuizOption(element, idx) {
  const options = document.querySelectorAll('.quiz-option');
  options.forEach(opt => opt.classList.remove('selected'));
  element.classList.add('selected');
  
  userQuizAnswers[currentQuizStep] = idx;
}

function quizNext() {
  if (userQuizAnswers[currentQuizStep] === undefined) {
    showToast("Please select an answer to continue.", "warning");
    return;
  }

  const totalSteps = quizQuestions.length;
  if (currentQuizStep < totalSteps - 1) {
    currentQuizStep++;
    renderQuizStep();
  } else {
    showQuizResults();
  }
}

function quizPrev() {
  if (currentQuizStep > 0) {
    currentQuizStep--;
    renderQuizStep();
  }
}

function showQuizResults() {
  const quizContent = document.getElementById('quiz-content');
  const progressFill = document.getElementById('quiz-progress');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  if (!quizContent) return;

  if (progressFill) progressFill.style.width = '100%';
  if (prevBtn) prevBtn.style.display = 'none';
  if (nextBtn) {
    nextBtn.textContent = 'Retake Assessment 🔄';
    nextBtn.onclick = () => {
      // Restore default next behavior
      nextBtn.onclick = quizNext;
      initQuiz();
    };
  }

  // Calculate score
  let score = 0;
  userQuizAnswers.forEach((answerIdx, questionIdx) => {
    score += quizQuestions[questionIdx].options[answerIdx].score;
  });

  const maxScore = quizQuestions.length * 3;
  let title = '';
  let feedback = '';
  let colorClass = '';

  if (score <= 4) {
    title = "Mild Stress / Thriving";
    feedback = "Your score suggests you are managing stress levels exceptionally well. Continue maintaining your boundary settings, physical movement, and wellness routines. Share your tips with peers!";
    colorClass = "success";
  } else if (score <= 9) {
    title = "Moderate Stress";
    feedback = "You are experiencing a moderate level of stress, which is very common in demanding academic or teaching schedules. Try to incorporate small breaks into your day, practice breathing exercises (in the next tab), and ensure you are getting adequate sleep.";
    colorClass = "warning";
  } else {
    title = "High Stress / Alert";
    feedback = "Your responses indicate high stress or low wellbeing. You have been carrying a heavy load, and it is crucial to address it. Your mental health matters. We strongly recommend speaking with a counselor, contacting our listed free helplines, or talking to a trusted family member or mentor.";
    colorClass = "danger";
  }

  quizContent.innerHTML = `
    <div class="quiz-results-card ${colorClass}">
      <h3>Assessment Results</h3>
      <div class="quiz-score-circle">
        <span class="score-val">${score}</span>
        <span class="score-max">/ ${maxScore}</span>
      </div>
      <h4>${title}</h4>
      <p>${feedback}</p>
      <div class="quiz-results-actions" style="margin-top:24px; display:flex; gap:12px; justify-content:center;">
        <button class="btn btn-ghost btn-sm" onclick="switchTab(document.querySelector('[data-tab=breathing]'), 'wellness-tabs')">🌬️ Try Breathing Exercise</button>
        <button class="btn btn-primary btn-sm" onclick="switchTab(document.querySelector('[data-tab=counseling]'), 'wellness-tabs')">📞 View Helplines</button>
      </div>
    </div>
  `;
}

// ── Breathing Exercises ──
let breathingInterval = null;
let breathingTimeout = null;
let breathingActive = false;

const breathingPatterns = {
  '478': {
    name: "4-7-8 Relaxing Breath",
    cycle: [
      { phase: "Inhale", duration: 4, action: "inhale" },
      { phase: "Hold", duration: 7, action: "hold" },
      { phase: "Exhale", duration: 8, action: "exhale" }
    ]
  },
  'box': {
    name: "Box Breathing",
    cycle: [
      { phase: "Inhale", duration: 4, action: "inhale" },
      { phase: "Hold", duration: 4, action: "hold" },
      { phase: "Exhale", duration: 4, action: "exhale" },
      { phase: "Hold", duration: 4, action: "hold" }
    ]
  },
  'deep': {
    name: "Deep Belly Breath",
    cycle: [
      { phase: "Inhale", duration: 5, action: "inhale" },
      { phase: "Exhale", duration: 5, action: "exhale" }
    ]
  }
};

function startBreathing(type) {
  stopBreathing(); // Clear existing loops

  const pattern = breathingPatterns[type];
  if (!pattern) return;

  breathingActive = true;
  
  const animator = document.getElementById('breathing-animator');
  const circle = document.getElementById('breath-circle');
  const txt = document.getElementById('breath-text');
  const count = document.getElementById('breath-count');
  const instruction = document.getElementById('breath-instruction');
  const roundsDisplay = document.getElementById('breath-rounds');

  if (!animator || !circle || !txt || !count || !instruction || !roundsDisplay) return;

  animator.style.display = 'flex';
  animator.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Hide grid selection or fade it
  document.querySelectorAll('.breathing-card').forEach(c => c.style.opacity = '0.5');
  const activeCard = document.getElementById(`breathing-${type}`);
  if (activeCard) activeCard.style.opacity = '1';

  let round = 1;
  let phaseIndex = 0;
  let counter = 0;

  roundsDisplay.textContent = `Round ${round}/3`;

  function runPhase() {
    if (!breathingActive) return;

    // If we've completed a full cycle
    if (phaseIndex >= pattern.cycle.length) {
      phaseIndex = 0;
      round++;
      if (round > 3) {
        // Complete exercise
        txt.textContent = "Done ✨";
        count.textContent = "";
        instruction.textContent = "Great job! Take a moment to notice how you feel.";
        circle.style.transform = 'scale(1)';
        circle.className = 'breath-circle';
        roundsDisplay.textContent = "Completed 3 Rounds";
        breathingActive = false;
        
        setTimeout(() => {
          stopBreathing();
        }, 5000);
        return;
      }
      roundsDisplay.textContent = `Round ${round}/3`;
    }

    const currentPhase = pattern.cycle[phaseIndex];
    txt.textContent = currentPhase.phase;
    counter = currentPhase.duration;
    count.textContent = counter;

    // Update Circle Animation State by CSS Classes
    circle.className = 'breath-circle'; // Reset
    circle.classList.add(currentPhase.action);
    
    // Custom inline transitions for precise duration
    circle.style.transition = `transform ${currentPhase.duration}s linear, box-shadow ${currentPhase.duration}s linear`;

    if (currentPhase.action === 'inhale') {
      circle.style.transform = 'scale(1.5)';
      circle.style.boxShadow = '0 0 40px rgba(0, 168, 107, 0.6)';
      instruction.textContent = "Breathe in through your nose...";
    } else if (currentPhase.action === 'hold') {
      // Maintain previous scale (which should be 1.5)
      circle.style.transform = 'scale(1.5)';
      circle.style.boxShadow = '0 0 40px rgba(245, 166, 35, 0.4)';
      instruction.textContent = "Hold your breath...";
    } else if (currentPhase.action === 'exhale') {
      circle.style.transform = 'scale(1)';
      circle.style.boxShadow = '0 0 20px rgba(0, 119, 182, 0.2)';
      instruction.textContent = "Exhale slowly through your mouth...";
    }

    // Tick counter every second
    if (breathingInterval) clearInterval(breathingInterval);
    
    breathingInterval = setInterval(() => {
      counter--;
      if (counter > 0) {
        count.textContent = counter;
      } else {
        clearInterval(breathingInterval);
        phaseIndex++;
        runPhase();
      }
    }, 1000);
  }

  runPhase();
}

function stopBreathing() {
  breathingActive = false;
  if (breathingInterval) clearInterval(breathingInterval);
  if (breathingTimeout) clearTimeout(breathingTimeout);

  const animator = document.getElementById('breathing-animator');
  const circle = document.getElementById('breath-circle');
  
  if (animator) animator.style.display = 'none';
  if (circle) {
    circle.style.transform = 'scale(1)';
    circle.style.transition = 'var(--transition)';
    circle.className = 'breath-circle';
    circle.style.boxShadow = '';
  }

  document.querySelectorAll('.breathing-card').forEach(c => c.style.opacity = '1');
}

// ── Initialize Wellness Hub ──
document.addEventListener('DOMContentLoaded', () => {
  // Init quiz
  initQuiz();
  
  // Set up initial affirmation
  newAffirmation();
});
