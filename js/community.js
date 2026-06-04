// ============================================================
// EduConnect Kenya — Community Hub JavaScript
// ============================================================

// ── Forum State & Data ──
let forumPosts = [
  {
    title: "What are the cluster points for KUCCPS Computer Science placement?",
    category: "university",
    author: "Peter Kamau (Student)",
    body: "I want to apply for Computer Science in Kenyatta University or JKUAT. Does anyone know the average cluster points needed in KCSE and if they changed for this year's placement?",
    likes: 12,
    answersCount: 4,
    time: "2 hours ago"
  },
  {
    title: "Form 3 Chemistry Practical titration worksheets shared!",
    category: "exams",
    author: "Teacher Mercy (Educator)",
    body: "I've uploaded the volumetric analysis titration worksheets to the Resource Sharing board. It includes step-by-step instructions and mock analysis templates. Let me know if you find it helpful for your lab classes!",
    likes: 28,
    answersCount: 9,
    time: "1 day ago"
  },
  {
    title: "Webinar on Python Programming and AI Ethics this Saturday",
    category: "general",
    author: "David Mutua (Mentor)",
    body: "We will be hosting a coding bootcamp webinar. Recommended for high schoolers who want to build careers in ICT. Registration details are in the Events tab! Bring your laptops.",
    likes: 15,
    answersCount: 2,
    time: "3 hours ago"
  },
  {
    title: "How to balance teaching schedules and CBC report portfolios?",
    category: "teachers",
    author: "Headteacher Njuguna (Educator)",
    body: "Managing CBC portfolios is time consuming, especially with large classes. Any recommendations on digital templates or structures to optimize grading times and teacher collaboration?",
    likes: 19,
    answersCount: 6,
    time: "5 hours ago"
  }
];

let activeForumCategory = 'all';

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
    
    // Trigger scroll animations
    const scrollAnims = targetContent.querySelectorAll('.animate-on-scroll');
    scrollAnims.forEach(el => el.classList.add('visible'));
  }
}

// ── Populate Forum Feed ──
function populateForum() {
  const list = document.getElementById('forum-posts-list');
  if (!list) return;

  const searchQuery = document.getElementById('forum-search').value.toLowerCase();

  // Filter
  const filtered = forumPosts.filter(post => {
    const matchesCategory = activeForumCategory === 'all' || post.category === activeForumCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery) || post.body.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  let html = '';
  filtered.forEach((post, index) => {
    const originalIndex = forumPosts.indexOf(post);
    const catLabels = {
      university: 'University Entry',
      exams: 'Exams',
      teachers: 'Teachers',
      general: 'General'
    };
    
    html += `
      <div class="forum-post-card">
        <div class="post-header">
          <span class="post-badge">${catLabels[post.category] || 'General'}</span>
          <span class="post-time">${post.time}</span>
        </div>
        <h4>${post.title}</h4>
        <p class="post-body-text">${post.body}</p>
        <div class="post-footer">
          <span class="post-author">By ${post.author}</span>
          <div class="post-actions">
            <button class="post-action-btn like-btn" onclick="likePost(${originalIndex})">
               <span class="like-count">${post.likes}</span>
            </button>
            <button class="post-action-btn" onclick="showToast('Loading answers thread...','info')">
               ${post.answersCount} Answers
            </button>
          </div>
        </div>
      </div>
    `;
  });

  if (filtered.length === 0) {
    html = `<div style="text-align:center; padding:40px; color:var(--text-muted);">No discussions found matching this criteria. Be the first to ask!</div>`;
  }

  list.innerHTML = html;
}

function filterForum(category) {
  activeForumCategory = category;
  
  // Highlight buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    if (btn.dataset.cat === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  populateForum();
}

function searchForum() {
  populateForum();
}

function likePost(index) {
  forumPosts[index].likes++;
  populateForum();
  showToast("Post liked!", "success");
}

// New Post Actions
function openNewPostForm() {
  const formBox = document.getElementById('new-post-box');
  if (formBox) {
    formBox.style.display = 'block';
    formBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function closeNewPostForm() {
  const formBox = document.getElementById('new-post-box');
  if (formBox) formBox.style.display = 'none';
}

function submitNewPost(e) {
  e.preventDefault();
  
  const title = document.getElementById('post-title').value;
  const category = document.getElementById('post-category').value;
  const author = document.getElementById('post-author').value;
  const body = document.getElementById('post-body').value;

  const newPost = {
    title: title,
    category: category,
    author: `${author} (Community Member)`,
    body: body,
    likes: 0,
    answersCount: 0,
    time: "Just now"
  };

  forumPosts.unshift(newPost); // Add to top
  
  // Reset form and UI
  document.getElementById('new-post-form').reset();
  closeNewPostForm();
  populateForum();
  
  showToast("Your question has been posted!", "success");
}

// ── Events Section ──
const eventsList = [
  {
    title: "Kenyatta University Open Day & Course Fair",
    date: "June 10, 2026 at 10:00 AM",
    location: "Virtual (Google Meet)",
    organizer: "KU Admissions Office",
    desc: "Learn about curriculum options, diploma bridges, cluster cuts, and application guidelines for the upcoming September intake.",
    registered: false
  },
  {
    title: "CBC Teacher Lab: Volumetric Analysis Practical",
    date: "June 15, 2026 at 2:00 PM",
    location: "Ruiru High School (Physical & Hybrid)",
    organizer: "Ruiru Teachers Alliance",
    desc: "Hands-on guide for secondary science educators and student teachers to set up laboratories for student quantitative tests.",
    registered: false
  },
  {
    title: "AI & Innovation Bootcamp: Python Basics",
    date: "June 20, 2026 at 9:00 AM",
    location: "Virtual (EduConnect Platform)",
    organizer: "EduConnect ICT Mentors",
    desc: "A 3-hour introduction to HTML, CSS, and basic programming loops designed specifically for secondary school students.",
    registered: false
  },
  {
    title: "Community Well-being & Parent Circle",
    date: "June 25, 2026 at 4:00 PM",
    location: "Kiambu High School Community Hall",
    organizer: "Befrienders Kenya & Parent Assc.",
    desc: "Open dialogue on supporting student anxiety, KCSE prep pressure, and teacher burnout. Dedicated counselor attending.",
    registered: false
  }
];

function populateEvents() {
  const container = document.getElementById('events-grid');
  if (!container) return;

  let html = '';
  eventsList.forEach((ev, index) => {
    const btnText = ev.registered ? "Registered ✅" : "Register Free Seat";
    const btnClass = ev.registered ? "btn-ghost complete" : "btn-primary";
    
    html += `
      <div class="event-card">
        <div class="event-card-body">
          <div class="event-meta-top">
            <span class="event-date"> ${ev.date}</span>
          </div>
          <h4>${ev.title}</h4>
          <p class="event-desc">${ev.desc}</p>
          <div class="event-meta-bottom">
            <span>📍 <strong>Location:</strong> ${ev.location}</span>
            <span>🏫 <strong>Organizer:</strong> ${ev.organizer}</span>
          </div>
        </div>
        <div class="event-card-footer" style="padding: 16px 24px; border-top:1px solid var(--border);">
          <button class="btn ${btnClass} btn-sm" style="width:100%; justify-content:center;" onclick="registerEvent(${index})">
            ${btnText}
          </button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function registerEvent(index) {
  if (eventsList[index].registered) {
    showToast("You are already registered for this event.", "info");
    return;
  }
  eventsList[index].registered = true;
  populateEvents();
  showToast(`Registered successfully for "${eventsList[index].title}"! check your email.`, "success");
}

// ── Resource Sharing ──
let sharedResources = [
  {
    title: "KCSE Chemistry Titration Practical notes",
    subject: "Chemistry",
    author: "Teacher Mercy",
    desc: "A quick notes guide outlining lab safety, titration measurements, and standard quantitative report layouts.",
    downloads: 120,
    fileUrl: "https://educonnect.ke/files/kcse-chem-practical.pdf"
  },
  {
    title: "Primary School English Lesson Plan Template",
    subject: "English",
    author: "Mr. Charles",
    desc: "CBC-aligned editable word template for primary English units. Covers objective mappings and classroom games.",
    downloads: 85,
    fileUrl: "https://educonnect.ke/files/cbc-english-template.docx"
  },
  {
    title: "Introduction to Scratch Programming slide deck",
    subject: "Computer Studies",
    author: "David Mutua (Mentor)",
    desc: "Introductory presentation deck showcasing loop controls, coordinates, and animation scripting in Scratch.",
    downloads: 45,
    fileUrl: "https://educonnect.ke/files/intro-to-scratch.pdf"
  }
];

function populateResources() {
  const container = document.getElementById('shared-resources-list');
  if (!container) return;

  let html = '';
  sharedResources.forEach((res, index) => {
    html += `
      <div class="shared-resource-card">
        <div class="res-body">
          <div class="res-title-row">
            <h4>${res.title}</h4>
            <span class="res-sub-tag">${res.subject}</span>
          </div>
          <p class="res-desc">${res.desc}</p>
          <div class="res-meta">
            <span>By ${res.author}</span>
            <span> ${res.downloads} downloads</span>
          </div>
        </div>
        <div class="res-actions">
          <button class="btn btn-ghost btn-sm" onclick="downloadResource(${index})">Download PDF</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function downloadResource(index) {
  sharedResources[index].downloads++;
  populateResources();
  showToast(`Simulated download of "${sharedResources[index].title}" started!`, "success");
}

function submitUploadedResource(e) {
  e.preventDefault();
  
  const title = document.getElementById('res-title').value;
  const subject = document.getElementById('res-subject').value;
  const author = document.getElementById('res-author').value;
  const desc = document.getElementById('res-desc').value;
  const url = document.getElementById('res-url').value;

  const newRes = {
    title: title,
    subject: subject,
    author: `${author} (Educator)`,
    desc: desc,
    downloads: 0,
    fileUrl: url
  };

  sharedResources.unshift(newRes);
  document.getElementById('resource-upload-form').reset();
  
  populateResources();
  showToast("Resource shared successfully! Thank you for contributing.", "success");
}

// ── Partnerships Section ──
const partnershipsList = [
  {
    school: "Ruiru Secondary School",
    uni: "Kenyatta University",
    activity: "Maths/Science Mentorship Pilot",
    desc: "KU Science departments assign undergraduate student mentors who hold weekly academic study clinics for Ruiru Form 3 classes.",
    activeProjects: 2,
    mentorsCount: 12
  },
  {
    school: "Juja Secondary School",
    uni: "JKUAT",
    activity: "Smart Greenhouse Project",
    desc: "JKUAT Agribusiness departments help Juja club members configure a model smart drip-irrigation farm and log crop yields.",
    activeProjects: 3,
    mentorsCount: 8
  },
  {
    school: "Alliance High School",
    uni: "University of Nairobi",
    activity: "AI & Innovation Track",
    desc: "UoN Computer Science club provides guest lectures and runs an incubator project for high school programmers.",
    activeProjects: 1,
    mentorsCount: 5
  }
];

function populatePartnerships() {
  const container = document.getElementById('partnerships-grid');
  if (!container) return;

  let html = '';
  partnershipsList.forEach(part => {
    html += `
      <div class="partnership-card">
        <div class="part-header">
          <div>
            <h4>${part.school}</h4>
            <span class="part-partner">Partnered with <strong>${part.uni}</strong></span>
          </div>
        </div>
        <p class="part-desc">${part.desc}</p>
        <div class="part-specs">
          <div class="part-spec">
            <strong>Active Projects:</strong>
            <span>${part.activeProjects}</span>
          </div>
          <div class="part-spec">
            <strong>Mentors Assigned:</strong>
            <span>${part.mentorsCount} Mentors</span>
          </div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

// ── Initialize Community Hub ──
document.addEventListener('DOMContentLoaded', () => {
  populateForum();
  populateEvents();
  populateResources();
  populatePartnerships();
});
