// ============================================================
// EduConnect Kenya — Careers Page JavaScript
// ============================================================

// ── Tab Switching ──
function switchTab(btn, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const tabId = btn.dataset.tab;
  const tabButtons = container.querySelectorAll('.tab-btn');
  const tabContents = container.querySelectorAll('.tab-content');

  tabButtons.forEach(b => b.classList.remove('active'));
  tabContents.forEach(c => {
    c.classList.remove('active');
    c.style.display = 'none';
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
}

// ── Career Quiz ──
const careerQuestions = [
  {
    q: "Which of these activities sounds most exciting to you?",
    options: [
      { text: "Designing software, mobile apps, or websites", scores: { tech: 3, finance: 1 } },
      { text: "Explaining complex concepts to children or teaching others", scores: { education: 3 } },
      { text: "Growing crops, farming, or managing agricultural programs", scores: { agriculture: 3 } },
      { text: "Managing budgets, studying business charts, or marketing products", scores: { finance: 3 } }
    ]
  },
  {
    q: "Where would you prefer to spend most of your working day?",
    options: [
      { text: "In a modern, air-conditioned corporate or home office", scores: { tech: 2, finance: 2 } },
      { text: "In a lively classroom, laboratory, or training center", scores: { education: 3 } },
      { text: "Outdoors in nature, on a farm, or in a greenhouse", scores: { agriculture: 3 } },
      { text: "In a medical clinic, hospital ward, or community outreach site", scores: { medicine: 3 } }
    ]
  },
  {
    q: "Which subjects do/did you enjoy or excel at in school?",
    options: [
      { text: "Mathematics, Physics, or Computer Studies (ICT)", scores: { tech: 3, finance: 1 } },
      { text: "Biology, Chemistry, or Agriculture", scores: { agriculture: 2, medicine: 3 } },
      { text: "English, Kiswahili, or History & Government", scores: { education: 3 } },
      { text: "Business Studies, Geography, or Mathematics", scores: { finance: 3, agriculture: 1 } }
    ]
  },
  {
    q: "How do you prefer to solve problems?",
    options: [
      { text: "By writing code, building logic, or automating steps", scores: { tech: 3 } },
      { text: "By talking to people, coaching them, and finding consensus", scores: { education: 3, medicine: 1 } },
      { text: "By testing options hands-on with crops, soil, or tools", scores: { agriculture: 3 } },
      { text: "By preparing financial statements, tracking sales, and investing", scores: { finance: 3 } }
    ]
  },
  {
    q: "What is your main driving motivation for a future job?",
    options: [
      { text: "Solving complex technical problems and building new tech", scores: { tech: 3 } },
      { text: "Helping others learn and fostering personal growth", scores: { education: 3 } },
      { text: "Ensuring food security and working with natural systems", scores: { agriculture: 3 } },
      { text: "Starting a business, making sales, and wealth creation", scores: { finance: 3 } }
    ]
  },
  {
    q: "Which challenge in Kenya would you be most passionate about solving?",
    options: [
      { text: "Expanding access to high-speed internet and digital services", scores: { tech: 3 } },
      { text: "Enhancing literacy and teacher support in primary schools", scores: { education: 3 } },
      { text: "Adapting crops to thrive during dry spells and droughts", scores: { agriculture: 3 } },
      { text: "Providing quality medical care and therapy to rural communities", scores: { medicine: 3 } }
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

  const totalSteps = careerQuestions.length;
  const progressPercent = (currentQuizStep / totalSteps) * 100;
  if (progressFill) progressFill.style.width = `${progressPercent}%`;

  if (prevBtn) prevBtn.style.display = currentQuizStep === 0 ? 'none' : 'inline-flex';
  if (nextBtn) {
    nextBtn.textContent = currentQuizStep === totalSteps - 1 ? 'See Recommendations 🧭' : 'Next →';
  }

  const currentQ = careerQuestions[currentQuizStep];
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
    showToast("Please choose an option to continue.", "warning");
    return;
  }

  const totalSteps = careerQuestions.length;
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

const careerDetails = {
  tech: {
    title: "💻 Technology & Software Engineering",
    desc: "You enjoy logical analysis, problem-solving, and creating products. Kenya's tech industry (often called 'Silicon Savannah') is expanding rapidly, offering high-paying opportunities for developers, database specialists, and ICT teachers.",
    kcse: "Mean Grade of C+ or above, with good performance in Mathematics and Physics.",
    courses: "BSc in Computer Science, Business Information Technology (BBIT), or Diploma in Software Engineering / ICT (TVET colleges like KIST, Kabete National Polytechnic).",
    salary: "KSh 40,000 – KSh 120,000 (starting monthly salary)",
    demand: "Very High"
  },
  education: {
    title: "🧑‍🏫 Education & Corporate Training",
    desc: "You have a strong passion for helping others grow and sharing knowledge. With the rollout of the Competency-Based Curriculum (CBC) in Kenya, there is steady demand for creative teachers, learning developers, and early childhood educators.",
    kcse: "Mean Grade of C+ or above, with C+ in two teaching subjects.",
    courses: "Bachelor of Education (Arts/Science), Diploma in Primary Teacher Education (DPTE) at Teacher Training Colleges (TTCs), or Early Childhood Development Education (ECDE) courses.",
    salary: "KSh 25,000 – KSh 60,000 (starting monthly salary)",
    demand: "Steady / High"
  },
  agriculture: {
    title: "🌾 Agronomy & Agribusiness",
    desc: "You appreciate nature, food security, and hands-on systems. Agriculture is the backbone of Kenya's economy. Modern careers combine technology, business, and science to build sustainable farms, export logistics, and food production plants.",
    kcse: "Mean Grade of C or above, with good grades in Biology, Chemistry, or Agriculture.",
    courses: "BSc in Agronomy, Agribusiness Management, Agricultural Engineering, or Diploma/Certificates at animal and agricultural institutes (e.g., Bukura Agricultural College, AHITI).",
    salary: "KSh 30,000 – KSh 80,000 (starting monthly salary)",
    demand: "High"
  },
  finance: {
    title: "📈 Business, Finance & Digital Marketing",
    desc: "You are motivated by trade, budgets, financial planning, and communications. Kenya's strong financial hub in Nairobi supports growing numbers of startup businesses, digital marketing firms, and financial analysts.",
    kcse: "Mean Grade of C+ or above, with strong grades in Mathematics and English/Kiswahili.",
    courses: "Bachelor of Commerce (BCom), Business Administration, Financial Engineering, or professional courses like Certified Public Accountants (CPA) / Certified Financial Analyst (CFA).",
    salary: "KSh 35,000 – KSh 90,000 (starting monthly salary)",
    demand: "Moderate / High"
  },
  medicine: {
    title: "🏥 Healthcare & Clinical Sciences",
    desc: "You are driven to care for people, understand physiology, and treat ailments. Public health and clinical medicine are crucial career tracks in Kenya, providing vital services in hospitals and community clinics.",
    kcse: "Mean Grade of C+ or B- and above, with strong grades in Biology, Chemistry, Mathematics/Physics, and English/Kiswahili.",
    courses: "BSc in Nursing, Bachelor of Medicine and Bachelor of Surgery (MBChB), Clinical Medicine & Community Health, or Diplomas at KMTC (Kenya Medical Training College).",
    salary: "KSh 45,000 – KSh 100,000 (starting monthly salary)",
    demand: "Very High"
  }
};

function showQuizResults() {
  const quizContent = document.getElementById('quiz-content');
  const progressFill = document.getElementById('quiz-progress');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  if (!quizContent) return;
  if (progressFill) progressFill.style.width = '100%';
  if (prevBtn) prevBtn.style.display = 'none';

  if (nextBtn) {
    nextBtn.textContent = 'Retake Career Quiz 🔄';
    nextBtn.onclick = () => {
      nextBtn.onclick = quizNext;
      initQuiz();
    };
  }

  // Tally scores
  const scoreTotals = { tech: 0, education: 0, agriculture: 0, finance: 0, medicine: 0 };
  userQuizAnswers.forEach((answerIdx, questionIdx) => {
    const option = careerQuestions[questionIdx].options[answerIdx];
    if (option.scores) {
      for (const [field, points] of Object.entries(option.scores)) {
        scoreTotals[field] = (scoreTotals[field] || 0) + points;
      }
    }
  });

  // Find max score field
  let bestField = 'tech';
  let maxScore = -1;
  for (const [field, score] of Object.entries(scoreTotals)) {
    if (score > maxScore) {
      maxScore = score;
      bestField = field;
    }
  }

  const details = careerDetails[bestField];

  quizContent.innerHTML = `
    <div class="career-results-card">
      <span class="badge badge-green" style="margin-bottom:12px;">Recommended Match</span>
      <h3>${details.title}</h3>
      <p style="margin-bottom:24px; font-size:0.95rem;">${details.desc}</p>
      
      <div class="career-details-specs">
        <div class="spec-item">
          <strong>🎓 Academic Requirement</strong>
          <span>${details.kcse}</span>
        </div>
        <div class="spec-item">
          <strong>📚 Typical Pathways</strong>
          <span>${details.courses}</span>
        </div>
        <div class="spec-item">
          <strong>💰 Est. Salary (Monthly)</strong>
          <span>${details.salary}</span>
        </div>
        <div class="spec-item">
          <strong>📈 Job Demand</strong>
          <span>${details.demand}</span>
        </div>
      </div>

      <div class="results-actions" style="margin-top:32px; display:flex; gap:12px; justify-content:center;">
        <button class="btn btn-ghost btn-sm" onclick="switchTab(document.querySelector('[data-tab=explorer]'), 'careers-tabs')">🔍 Browse All Pathways</button>
        <button class="btn btn-primary btn-sm" onclick="switchTab(document.querySelector('[data-tab=mentorship]'), 'careers-tabs')">🤝 Connect with a Mentor</button>
      </div>
    </div>
  `;
}

// ── Pathway Explorer ──
const pathwaysList = [
  {
    title: "Software Engineer",
    icon: "💻",
    sector: "Technology",
    kcse: "C+ Average, C+ Math/Physics",
    tvet: "Kabete Poly, KIST (ICT Diploma)",
    uni: "JKUAT, Kenyatta Uni, Strathmore",
    demand: "Very High",
    salary: "KSh 50,000 – 150,000+"
  },
  {
    title: "Clinical Officer",
    icon: "🩺",
    sector: "Healthcare",
    kcse: "C+ Average, C+ Bio/Chem/Eng",
    tvet: "KMTC Colleges (Diploma in Clinical Medicine)",
    uni: "Mount Kenya Uni, Egerton University",
    demand: "High",
    salary: "KSh 40,000 – 90,000"
  },
  {
    title: "Agribusiness Manager",
    icon: "🌾",
    sector: "Agriculture",
    kcse: "C Average, Bio or Agric C",
    tvet: "Bukura Agricultural College",
    uni: "Egerton, Nairobi University",
    demand: "High",
    salary: "KSh 35,000 – 80,000"
  },
  {
    title: "Secondary School Teacher",
    icon: "👩‍🏫",
    sector: "Education",
    kcse: "C+ Mean, C+ in two subject areas",
    tvet: "Kagumo TTC, Kenya Technical Trainers TTC",
    uni: "Kenyatta Uni, Maseno Uni, Nairobi Uni",
    demand: "Steady",
    salary: "KSh 30,000 – 70,000"
  },
  {
    title: "Financial Accountant",
    icon: "📊",
    sector: "Finance / Business",
    kcse: "C+ Average, C Math",
    tvet: "KCA University, TVET institutions (CPA, ATD)",
    uni: "Masinde Muliro Uni, Maseno, KCA",
    demand: "Moderate",
    salary: "KSh 30,000 – 85,000"
  },
  {
    title: "Solar Installation Technician",
    icon: "☀️",
    sector: "Technology / Engineering",
    kcse: "C- Mean, D+ Math/Physics",
    tvet: "NITA, National Polytechnics (Grade Test / Diploma)",
    uni: "Technical University of Kenya (TUK)",
    demand: "Growing Rapidly",
    salary: "KSh 25,000 – 60,000"
  }
];

function populatePathwayExplorer() {
  const grid = document.getElementById('explorer-grid');
  if (!grid) return;

  let html = '';
  pathwaysList.forEach(path => {
    html += `
      <div class="explorer-card">
        <div class="explorer-card-header">
          <span class="explorer-icon">${path.icon}</span>
          <div>
            <h4>${path.title}</h4>
            <span class="badge badge-blue">${path.sector}</span>
          </div>
        </div>
        <div class="explorer-card-body">
          <div class="exp-spec"><strong>KCSE Min:</strong> <span>${path.kcse}</span></div>
          <div class="exp-spec"><strong>TVET Option:</strong> <span>${path.tvet}</span></div>
          <div class="exp-spec"><strong>Uni Route:</strong> <span>${path.uni}</span></div>
          <div class="exp-spec"><strong>Typical Salary:</strong> <span>${path.salary}</span></div>
          <div class="exp-spec"><strong>Market Demand:</strong> <span style="color:var(--primary-light); font-weight:700;">${path.demand}</span></div>
        </div>
      </div>
    `;
  });
  grid.innerHTML = html;
}

// ── CV Builder Logic ──
function updateCVPreview() {
  // Read inputs
  const name = document.getElementById('cv-name').value || "YOUR FULL NAME";
  const title = document.getElementById('cv-title').value || "Your Professional Title";
  const email = document.getElementById('cv-email').value || "email@domain.com";
  const phone = document.getElementById('cv-phone').value || "+254 700 000000";
  const location = document.getElementById('cv-location').value || "Nairobi, Kenya";
  const link = document.getElementById('cv-link').value || "linkedin.com/in/username";
  const summary = document.getElementById('cv-summary').value || "Provide a professional summary detailing your career goals, key expertise, and drive. Complete the form to update this content automatically.";
  
  const eduDegree = document.getElementById('cv-edu-degree').value || "Bachelor of Science in Computer Science";
  const eduSchool = document.getElementById('cv-edu-school').value || "Kenyatta University";
  const eduYear = document.getElementById('cv-edu-year').value || "2026";
  const eduGrade = document.getElementById('cv-edu-grade').value || "Second Class Upper Division";

  const expRole = document.getElementById('cv-exp-role').value || "ICT Intern";
  const expCompany = document.getElementById('cv-exp-company').value || "Safaricom PLC";
  const expDates = document.getElementById('cv-exp-dates').value || "Jan 2025 – Present";
  const expDesc = document.getElementById('cv-exp-desc').value || "Supported database configuration and resolved technical issues. Collaborated with a team of developers on local pilot tools.";
  
  const skillsStr = document.getElementById('cv-skills').value || "HTML/CSS, Teamwork, Critical Thinking, Project Management";

  // Bind to preview elements
  document.getElementById('prev-name').textContent = name.toUpperCase();
  document.getElementById('prev-title').textContent = title;
  document.getElementById('prev-email').textContent = email;
  document.getElementById('prev-phone').textContent = phone;
  document.getElementById('prev-location').textContent = location;
  document.getElementById('prev-link').textContent = link;
  document.getElementById('prev-summary').textContent = summary;
  
  document.getElementById('prev-edu-degree').textContent = eduDegree;
  document.getElementById('prev-edu-school').textContent = eduSchool;
  document.getElementById('prev-edu-year').textContent = eduYear;
  document.getElementById('prev-edu-grade').textContent = eduGrade;
  
  document.getElementById('prev-exp-role').textContent = expRole;
  document.getElementById('prev-exp-company').textContent = expCompany;
  document.getElementById('prev-exp-dates').textContent = expDates;
  document.getElementById('prev-exp-desc').textContent = expDesc;

  // Render skills tags
  const skillsContainer = document.getElementById('prev-skills');
  if (skillsContainer) {
    const list = skillsStr.split(',').map(s => s.trim()).filter(s => s !== '');
    skillsContainer.innerHTML = '';
    list.forEach(skill => {
      const tag = document.createElement('span');
      tag.className = 'cv-skill-tag';
      tag.textContent = skill;
      skillsContainer.appendChild(tag);
    });
  }
}

function printCV() {
  const name = document.getElementById('cv-name').value;
  if (!name) {
    showToast("Please enter your name in the CV form first.", "warning");
    return;
  }
  
  const printContents = document.getElementById('cv-sheet').innerHTML;
  const originalContents = document.body.innerHTML;

  // Create temporary printing window style
  document.body.innerHTML = `
    <div style="background:#fff; color:#000; padding:40px; font-family:sans-serif; width:100%; max-width:800px; margin:0 auto;">
      ${printContents}
    </div>
  `;
  window.print();
  
  // Restore original content
  document.body.innerHTML = originalContents;
  // Re-initialize scripts bindings since document.body was replaced
  window.location.reload();
}

// ── Internship Opportunities ──
const internshipsList = [
  {
    title: "Junior Web Developer Intern",
    company: "Safaricom PLC",
    location: "Nairobi (HQ)",
    sector: "tech",
    desc: "Join our Digital Channels team to build responsive dashboards. Suitable for ICT graduates.",
    allowance: "KSh 20,000 / month",
    duration: "6 Months"
  },
  {
    title: "Agronomy Field assistant",
    company: "KALRO",
    location: "Thika Station",
    sector: "agriculture",
    desc: "Assist researchers in taking crop health readings, managing soil tests, and preparing farmers' reports.",
    allowance: "KSh 18,000 / month",
    duration: "3 Months"
  },
  {
    title: "Junior Teacher Assistant (Sciences)",
    company: "Nova Pioneer",
    location: "Eldoret Campus",
    sector: "education",
    desc: "Work with lead instructors to organize laboratory materials and support high-school learner study groups.",
    allowance: "KSh 25,000 / month",
    duration: "1 Year"
  },
  {
    title: "Finance & Accounts Intern",
    company: "Equity Bank Kenya",
    location: "Mombasa Branch",
    sector: "finance",
    desc: "Gain accounting experience verifying local merchant payments and preparing reconciliation reports.",
    allowance: "KSh 22,000 / month",
    duration: "6 Months"
  },
  {
    title: "Bio-Informatics Research Assistant",
    company: "KEMRI",
    location: "Kilifi Lab",
    sector: "medicine",
    desc: "Support data logging for community clinical reports. Requires background in Biology or health informatics.",
    allowance: "KSh 28,000 / month",
    duration: "6 Months"
  },
  {
    title: "Software Engineering Intern",
    company: "Microsoft ADC",
    location: "Nairobi Office",
    sector: "tech",
    desc: "Collaborate on local Edge solutions. Heavy emphasis on data structures and algorithms.",
    allowance: "KSh 45,000 / month",
    duration: "3 Months"
  }
];

function populateInternships(filterSector = 'all') {
  const container = document.getElementById('opportunities-grid');
  if (!container) return;

  const filtered = filterSector === 'all' 
    ? internshipsList 
    : internshipsList.filter(item => item.sector === filterSector);

  let html = '';
  filtered.forEach(item => {
    const iconClass = item.sector === 'tech' ? 'badge-blue' :
                      item.sector === 'education' ? 'badge-green' :
                      item.sector === 'agriculture' ? 'badge-gold' : 'badge-red';
    
    html += `
      <div class="opportunity-card" data-sector="${item.sector}">
        <div class="opp-header">
          <div>
            <h4>${item.title}</h4>
            <span class="opp-company">${item.company}</span>
          </div>
          <span class="opp-badge badge ${iconClass}">${item.sector.toUpperCase()}</span>
        </div>
        <p class="opp-desc">${item.desc}</p>
        <div class="opp-details">
          <span>📍 ${item.location}</span>
          <span>📅 ${item.duration}</span>
          <span>💰 ${item.allowance}</span>
        </div>
        <button class="btn btn-ghost btn-sm" style="width:100%; margin-top:16px;" onclick="applyInternship('${item.title}', '${item.company}')">Quick Apply</button>
      </div>
    `;
  });
  
  if (filtered.length === 0) {
    html = `<p class="text-center" style="grid-column:span 3; padding:40px; color:var(--text-muted);">No current opportunities matching this filter.</p>`;
  }

  container.innerHTML = html;
}

function filterInternships(sector) {
  // Update button classes
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    if (btn.dataset.filter === sector) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  populateInternships(sector);
}

function applyInternship(title, company) {
  showToast(`Application draft for "${title} at ${company}" generated! Check your email.`, "success");
}

// ── Mentorship Form Request ──
function submitMentorshipRequest(event) {
  event.preventDefault();
  
  const name = document.getElementById('mentor-req-name').value;
  const roleSelect = document.getElementById('mentor-req-role');
  const fieldSelect = document.getElementById('mentor-req-field');
  
  const role = roleSelect.options[roleSelect.selectedIndex].text;
  const field = fieldSelect.options[fieldSelect.selectedIndex].text;

  const panel = document.querySelector('.mentorship-form-panel');
  if (!panel) return;

  showToast("Submitting request...", "info");

  setTimeout(() => {
    panel.innerHTML = `
      <div class="mentorship-success-card text-center" style="padding: 40px 20px;">
        <span style="font-size: 3rem; display:block; margin-bottom:16px;">✉️</span>
        <h4 style="margin-bottom:12px; color:var(--primary-light);">Request Submitted!</h4>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:20px; line-height:1.6;">
          Thank you, <strong>${name}</strong>. Your profile as a <strong>${role}</strong> has been logged. 
          We will search our database to match you with a mentor in <strong>${field}</strong> and reach out via email or phone within 48 hours.
        </p>
        <button class="btn btn-ghost btn-sm" onclick="location.reload()">Send Another Request</button>
      </div>
    `;
    showToast("Mentorship Request Submitted!", "success");
  }, 1000);
}

// ── Initialize Careers Hub ──
document.addEventListener('DOMContentLoaded', () => {
  initQuiz();
  populatePathwayExplorer();
  updateCVPreview();
  populateInternships();
});
