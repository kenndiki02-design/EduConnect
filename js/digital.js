// ============================================================
// EduConnect Kenya — Digital Literacy JavaScript
// ============================================================

// ── Modules Data ──
const modulesData = {
  1: {
    id: 1,
    title: "Internet Safety",
    desc: "Protect your identity, recognize local online scams, and build cyber resilience.",
    studyPoints: [
      "Create strong passwords by combining letters (uppercase & lowercase), numbers, and special symbols (e.g. <code>K4lro_Res3arch_2026!</code>). Avoid names or birthdays.",
      "Never share password details, bank PINs, or One-Time Passwords (OTP) via SMS or phone calls.",
      "Spot phishing scams by checking sender addresses and URL domains carefully. A real service will use <code>safaricom.com</code>, whereas a scammer might register <code>safaric0m-bonus.ml</code>.",
      "Look for the secure lock symbol and the <code>https://</code> protocol prefix in the address bar before logging in."
    ],
    questions: [
      {
        q: "Which of the following represents the strongest and most secure password?",
        options: ["Admin123", "P@ssw0rd99!", "K4lro_Res3arch_2026!", "12345678"],
        answer: 2 // Index of correct option
      },
      {
        q: "You receive an SMS claiming you won a cash prize from EduConnect and asking you to click a link. What is the safest action?",
        options: [
          "Click the link immediately to see if it is real.",
          "Ignore it and check official EduConnect channels for updates.",
          "Reply to the SMS with your national ID card number.",
          "Forward the message to all your contacts."
        ],
        answer: 1
      },
      {
        q: "What does the 's' in 'https://' signify on a website's web address?",
        options: [
          "The website is hosted on a supercomputer.",
          "The website is localized to Kenya.",
          "The connection is encrypted and secure.",
          "The site is free to browse without data charges."
        ],
        answer: 2
      }
    ]
  },
  2: {
    id: 2,
    title: "Online Communication",
    desc: "Learn to communicate professionally, manage netiquette, and protect your digital footprint.",
    studyPoints: [
      "Write concise, descriptive subject lines for formal emails (e.g., <code>Application for Internship — Computer Science</code>).",
      "Open messages with respectful salutations like <code>Dear Dr. Omondi</code> or <code>Dear Sir/Madam</code> rather than informal slang.",
      "Proofread content carefully before sending to maintain professional grammar and spelling.",
      "Understand that your 'digital footprint' is permanent. Future employers, university recruiters, and school boards routinely review social profiles."
    ],
    questions: [
      {
        q: "What is the most appropriate greeting to use in an email to a university lecturer?",
        options: ["Yo Omondi,", "Dear Dr. Omondi,", "Hey Lecturer,", "Hello Admin,"],
        answer: 1
      },
      {
        q: "What constitutes your 'digital footprint'?",
        options: [
          "The distance you walk with your phone in a day.",
          "The temporary cookies saved by your browser.",
          "The permanent, searchable history of your online activities and posts.",
          "The unique serial number of your primary device."
        ],
        answer: 2
      },
      {
        q: "In email and message netiquette, writing sentences in ALL CAPS translates to:",
        options: [
          "Representing high priority urgency.",
          "Expressing shouting, anger, or poor etiquette.",
          "Standard formatting for official business.",
          "A stylish way to attract younger audiences."
        ],
        answer: 1
      }
    ]
  },
  3: {
    id: 3,
    title: "Digital Content",
    desc: "Search, organize, cite, and format digital content efficiently for academics and work.",
    studyPoints: [
      "Use quotation marks on Google search to lock in exact phrases (e.g. <code>\"Competency Based Curriculum Kenya\"</code>).",
      "Evaluate sources critically. Check multiple established databases, news agencies, and research libraries (like KEMRI or KALRO) to check facts.",
      "Respect authors by utilizing citations (APA, MLA, Harvard) to credit referenced works and avoid plagiarism.",
      "Structure long academic assignments logically using Word headings (H1, H2) to help outline documents and aid screen readers."
    ],
    questions: [
      {
        q: "How do you search for an exact phrase match on Google?",
        options: [
          "Type the phrase in ALL CAPITALS.",
          "Put the search phrase inside quotation marks.",
          "Place a hashtag (#) immediately before the phrase.",
          "Prepend the term with 'EXACT MATCH:'."
        ],
        answer: 1
      },
      {
        q: "Which option defines plagiarism?",
        options: [
          "Backing up university lecture documents to Google Drive.",
          "Sharing an article link on social media with credits.",
          "Using someone else's writing or idea without proper citation and credit.",
          "Translating curriculum content from English to Kiswahili."
        ],
        answer: 2
      },
      {
        q: "Why should you use structural headings (H1, H2, H3) in digital documents?",
        options: [
          "They compress the document's file size.",
          "They structure the document and improve formatting/readability.",
          "They prevent documents from being printed without authorization.",
          "They increase internet connection speed when uploading."
        ],
        answer: 1
      }
    ]
  },
  4: {
    id: 4,
    title: "Responsible Tech",
    desc: "Maintain digital well-being, combat cyberbullying, and understand artificial intelligence ethics.",
    studyPoints: [
      "Protect your vision using the 20-20-20 rule: Every 20 minutes, gaze at an object 20 feet away for at least 20 seconds.",
      "Combat cyberbullying. Save screenshots of harassment and report behavior to guidance teachers, parents, or online moderators.",
      "Treat AI answers as helpful guides, not absolute truths. Always double-check facts, as AI models can hallucinate incorrect information.",
      "Observe copyright parameters. Pay attention to license terms (e.g. Creative Commons) before publishing images, scripts, or assets."
    ],
    questions: [
      {
        q: "What does the 20-20-20 rule for eye strain stand for?",
        options: [
          "Read 20 pages from 20 inches away for 20 days.",
          "Every 20 minutes, look 20 feet away for 20 seconds.",
          "Spend 20 minutes on phones, 20 on TV, and 20 sleeping.",
          "Adjust display brightness to 20% for 20 hours a week."
        ],
        answer: 1
      },
      {
        q: "If you see a classmate being harassed in a class WhatsApp group, what is the best approach?",
        options: [
          "Join the group discussion and add a joke to fit in.",
          "Ignore the messages to avoid taking sides.",
          "Save screenshot evidence and report to a teacher or trusted parent.",
          "Forward the conversation to other student groups."
        ],
        answer: 2
      },
      {
        q: "How should you evaluate answers generated by generative AI tools?",
        options: [
          "Accept them as absolute facts since AI is smarter than humans.",
          "Discard them immediately as false and useless.",
          "Use them as a drafting guide, but fact-check any critical assertions.",
          "Assume they are copyrighted and cannot be used legally."
        ],
        answer: 2
      }
    ]
  }
};

// ── State Variables ──
let masteredModules = [];
let activeModId = null;
let quizAnswers = []; // Stores user answers for current quiz [Q0_ans, Q1_ans, Q2_ans]

// ── Open Module Lesson ──
function openModule(id) {
  activeModId = id;
  const moduleData = modulesData[id];
  if (!moduleData) return;

  // Toggle visible panels
  const emptyPanel = document.getElementById('lesson-empty');
  const contentBox = document.getElementById('lesson-content-box');
  const certPanel = document.getElementById('cert-panel');

  if (emptyPanel) emptyPanel.style.display = 'none';
  if (contentBox) contentBox.style.display = 'block';
  if (certPanel) certPanel.style.display = 'block';

  // Bind values
  document.getElementById('active-mod-tag').textContent = `Module ${id}`;
  document.getElementById('active-mod-title').textContent = moduleData.title;
  document.getElementById('active-mod-desc').textContent = moduleData.desc;

  // Populate study list
  const studyList = document.getElementById('active-mod-study-list');
  studyList.innerHTML = '';
  moduleData.studyPoints.forEach(pt => {
    const li = document.createElement('li');
    li.innerHTML = pt;
    studyList.appendChild(li);
  });

  // Reset quiz answers state
  quizAnswers = [null, null, null];
  
  // Highlight active module card
  document.querySelectorAll('.module-card').forEach(card => card.classList.remove('active'));
  const activeCard = document.getElementById(`mod-${id}`);
  if (activeCard) activeCard.classList.add('active');

  // Load Quiz Start view
  loadQuizStart();
  
  // Smooth scroll to panel on mobile
  if (window.innerWidth < 1024) {
    document.getElementById('lesson-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ── Load Quiz Start View ──
function loadQuizStart() {
  const quizContainer = document.getElementById('module-quiz-container');
  if (!quizContainer) return;

  const isCompleted = masteredModules.includes(activeModId);
  const btnText = isCompleted ? "Retake Checkpoint Quiz 🔄" : "Start Checkpoint Quiz ⚡";
  const completedBadge = isCompleted 
    ? `<div style="margin-bottom:16px; color:#00D68F; font-weight:700;">✅ You have already mastered this module!</div>` 
    : '';

  quizContainer.innerHTML = `
    <div class="text-center" style="padding: 20px 0;">
      ${completedBadge}
      <button class="btn btn-primary" onclick="startQuiz()">${btnText}</button>
    </div>
  `;
}

// ── Start Module Quiz ──
function startQuiz() {
  quizAnswers = [null, null, null];
  renderQuizQuestion(0);
}

// ── Render Quiz Question ──
function renderQuizQuestion(qIdx) {
  const quizContainer = document.getElementById('module-quiz-container');
  if (!quizContainer) return;

  const moduleData = modulesData[activeModId];
  const question = moduleData.questions[qIdx];
  const totalQs = moduleData.questions.length;

  let optionsHTML = '';
  question.options.forEach((opt, oIdx) => {
    const isSelected = quizAnswers[qIdx] === oIdx ? 'selected' : '';
    optionsHTML += `
      <div class="quiz-option ${isSelected}" onclick="selectAnswer(${qIdx}, ${oIdx})">
        <div class="quiz-option-radio"></div>
        <div class="quiz-option-text">${opt}</div>
      </div>
    `;
  });

  const isLast = qIdx === totalQs - 1;
  const nextBtnText = isLast ? "Submit Quiz ✉️" : "Next Question →";
  
  quizContainer.innerHTML = `
    <div class="quiz-progress-mini" style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-bottom:12px; font-weight:700;">
      <span>QUESTION ${qIdx + 1} OF ${totalQs}</span>
      <span>${Math.round(((qIdx) / totalQs) * 100)}%</span>
    </div>
    <h5 class="quiz-question-text" style="font-size:0.95rem; margin-bottom:16px; font-family:var(--font-display); line-height:1.4;">${question.q}</h5>
    <div class="quiz-options-list" style="margin-bottom:20px;">
      ${optionsHTML}
    </div>
    <div style="display:flex; justify-content:space-between; gap:12px;">
      <button class="btn btn-ghost btn-sm" onclick="${qIdx === 0 ? 'loadQuizStart()' : `renderQuizQuestion(${qIdx - 1})`}">Back</button>
      <button class="btn btn-primary btn-sm" onclick="nextQuestion(${qIdx}, ${isLast})">${nextBtnText}</button>
    </div>
  `;
}

// ── Select Answer ──
function selectAnswer(qIdx, oIdx) {
  quizAnswers[qIdx] = oIdx;
  const options = document.querySelectorAll('#module-quiz-container .quiz-option');
  options.forEach(opt => opt.classList.remove('selected'));
  
  const selectedOpt = options[oIdx];
  if (selectedOpt) selectedOpt.classList.add('selected');
}

// ── Next Question / Submit ──
function nextQuestion(qIdx, isLast) {
  if (quizAnswers[qIdx] === null) {
    showToast("Please choose an answer to proceed.", "warning");
    return;
  }

  if (isLast) {
    gradeQuiz();
  } else {
    renderQuizQuestion(qIdx + 1);
  }
}

// ── Grade Module Quiz ──
function gradeQuiz() {
  const quizContainer = document.getElementById('module-quiz-container');
  if (!quizContainer) return;

  const moduleData = modulesData[activeModId];
  let score = 0;

  quizAnswers.forEach((ans, idx) => {
    if (ans === moduleData.questions[idx].answer) {
      score++;
    }
  });

  const passed = score === 3; // Require 100% to pass
  if (passed) {
    // Add to mastered list if not already there
    if (!masteredModules.includes(activeModId)) {
      masteredModules.push(activeModId);
    }
    updateOverallProgress();
    showToast(`Mastered Module ${activeModId}!`, "success");
  } else {
    showToast("Score: " + score + "/3. Review material and try again.", "error");
  }

  const resultTitle = passed ? "🎉 Perfect Score! Module Mastered" : "❌ Not Quite There Yet";
  const resultMessage = passed 
    ? "Fantastic job! You've got a solid grasp of these digital safety concepts. Proceed to the other modules to unlock your certificate."
    : `You scored ${score} out of 3 questions correctly. We require 100% correctness to master modules. Read our study guide on the left and try again!`;

  const actionButtons = passed 
    ? `<button class="btn btn-ghost btn-sm" onclick="loadQuizStart()">Okay</button>`
    : `<button class="btn btn-primary btn-sm" onclick="startQuiz()">Try Again 🔄</button>`;

  quizContainer.innerHTML = `
    <div class="text-center" style="padding: 10px 0;">
      <h4 style="color:${passed ? 'var(--primary-light)' : 'var(--accent-light)'}; margin-bottom:12px;">${resultTitle}</h4>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:20px; line-height:1.5;">${resultMessage}</p>
      ${actionButtons}
    </div>
  `;
  
  // Refresh card status
  updateCardsStatus();
}

// ── Update Card Status UIs ──
function updateCardsStatus() {
  for (let i = 1; i <= 4; i++) {
    const statusDiv = document.getElementById(`mod-status-${i}`);
    if (statusDiv) {
      if (masteredModules.includes(i)) {
        statusDiv.textContent = "✅ Mastered";
        statusDiv.className = "module-card-status complete";
      } else {
        statusDiv.textContent = "⏳ Not Started";
        statusDiv.className = "module-card-status";
      }
    }
  }
}

// ── Update Overall Progress ──
function updateOverallProgress() {
  const percentageSpan = document.getElementById('overall-percentage');
  const fill = document.getElementById('academy-progress-fill');
  
  const masteredCount = masteredModules.length;
  const pct = Math.round((masteredCount / 4) * 100);

  if (percentageSpan) percentageSpan.textContent = `${pct}% Complete`;
  if (fill) fill.style.width = `${pct}%`;

  // Toggle certificate panel unlock UI
  const certLocked = document.getElementById('cert-locked');
  const certUnlocked = document.getElementById('cert-unlocked');

  if (masteredCount === 4) {
    if (certLocked) certLocked.style.display = 'none';
    if (certUnlocked) certUnlocked.style.display = 'block';
    showToast("🎉 You've unlocked your Academy Certificate!", "success", 5000);
  } else {
    if (certLocked) certLocked.style.display = 'block';
    if (certUnlocked) certUnlocked.style.display = 'none';
  }
}

// ── Live Certificate Name Sync ──
function updateCertName() {
  const val = document.getElementById('cert-recipient-name').value;
  const displayName = document.getElementById('cert-display-name');
  if (displayName) {
    displayName.textContent = val.trim() !== '' ? val.toUpperCase() : "STUDENT NAME";
  }
}

// ── Certificate Modals ──
function openCertModal() {
  const recipient = document.getElementById('cert-recipient-name').value;
  if (recipient.trim() === '') {
    showToast("Please enter your name in the input box.", "warning");
    return;
  }

  // Update current date
  const dateObj = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const formattedDate = `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
  const dateDisplay = document.getElementById('cert-display-date');
  if (dateDisplay) dateDisplay.textContent = formattedDate;

  openModal('cert-modal');
}

function printCertificate() {
  const printContents = document.getElementById('certificate-print-area').innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = `
    <div style="background:#fff; color:#000; padding:20px; min-height:100vh; display:flex; align-items:center; justify-content:center; font-family:sans-serif;">
      ${printContents}
    </div>
  `;
  window.print();
  
  document.body.innerHTML = originalContents;
  window.location.reload();
}
