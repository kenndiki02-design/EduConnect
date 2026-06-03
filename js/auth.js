const API_BASE = '/api';

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const contentType = response.headers.get('Content-Type') || '';
  const body = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error((body && body.message) || `Request failed with status ${response.status}`);
  }

  return body;
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    showToast('Email and password are required.', 'error');
    return;
  }

  try {
    await fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    showToast('Welcome back! Redirecting to your dashboard…', 'success');
    window.location.href = 'dashboard.html';
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const form = event.target;
  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const role = form.role.value;
  const full_name = form.full_name.value.trim();

  if (!username || !email || !password || !role) {
    showToast('Please complete all required fields.', 'error');
    return;
  }

  try {
    await fetchJson('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role, full_name })
    });
    showToast('Account created successfully! Redirecting…', 'success');
    window.location.href = 'dashboard.html';
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function bindFormActions() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  const roleButtons = document.querySelectorAll('.role-select button[data-role]');
  const roleInput = document.getElementById('register-role');
  roleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      roleButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      if (roleInput) {
        roleInput.value = button.dataset.role;
      }
    });
  });
}

async function redirectAuthenticatedUsers() {
  try {
    const status = await fetchJson('/auth/status');
    if (status.loggedIn) {
      window.location.href = 'dashboard.html';
    }
  } catch (err) {
    // ignore; user is not authenticated
  }
}

async function requireAuthentication() {
  try {
    const status = await fetchJson('/auth/status');
    if (!status.loggedIn || !status.user) {
      window.location.href = 'login.html';
      return null;
    }
    return status.user;
  } catch (err) {
    window.location.href = 'login.html';
    return null;
  }
}

function renderList(items, emptyMessage) {
  if (!items || !items.length) {
    return `<p class="empty-state">${emptyMessage}</p>`;
  }
  return `<ul class="dashboard-list">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' });
}

function createStatCard(title, value, subtitle) {
  return `<div class="stat-card"><h3>${value}</h3><p>${title}</p><span>${subtitle || ''}</span></div>`;
}

async function initLoginPage() {
  bindFormActions();
  redirectAuthenticatedUsers();
  if (typeof initTabs === 'function') {
    initTabs('auth-tab-set');
  }
}

async function initDashboardPage() {
  const user = await requireAuthentication();
  if (!user) return;

  const pageTitle = document.getElementById('dashboard-user-name');
  const roleLabel = document.getElementById('dashboard-role');
  const welcome = document.getElementById('dashboard-welcome');
  const panels = document.querySelectorAll('.role-panel');
  const logoutButton = document.getElementById('logout-button');
  const adminLink = document.getElementById('admin-link');

  if (pageTitle) pageTitle.textContent = user.full_name || user.username;
  if (roleLabel) roleLabel.textContent = user.role.toUpperCase();
  if (welcome) welcome.textContent = `Welcome back, ${user.full_name || user.username}!`;

  panels.forEach((panel) => {
    panel.style.display = panel.dataset.role === user.role ? 'block' : 'none';
  });

  if (adminLink) {
    adminLink.style.display = user.role === 'admin' ? 'inline-flex' : 'none';
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      await fetchJson('/auth/logout', { method: 'POST' });
      window.location.href = 'login.html';
    });
  }

  const [lessonsResponse, eventsResponse, forumResponse, resourcesResponse] = await Promise.allSettled([
    fetchJson('/lessons'),
    fetchJson('/events/my-registrations'),
    fetchJson('/forum'),
    fetchJson('/resources')
  ]);

  const lessons = lessonsResponse.status === 'fulfilled' ? lessonsResponse.value.lessons : [];
  const registrations = eventsResponse.status === 'fulfilled' ? eventsResponse.value.registrations : [];
  const forumItems = forumResponse.status === 'fulfilled' ? forumResponse.value.posts : [];
  const resources = resourcesResponse.status === 'fulfilled' ? resourcesResponse.value.resources : [];

  const studentSection = document.getElementById('student-dashboard');
  const teacherSection = document.getElementById('teacher-dashboard');
  const schoolSection = document.getElementById('school-dashboard');
  const parentSection = document.getElementById('parent-dashboard');
  const communitySection = document.getElementById('community-dashboard');

  if (studentSection) {
    studentSection.innerHTML = `
      ${createStatCard('Saved Lesson Plans', lessons.length, 'Designed for your study rhythm')}
      ${createStatCard('Event Registrations', registrations.length, 'Scholarships, workshops & more')}
      <div class="content-block">
        <h4>Upcoming events</h4>
        ${renderList(registrations.map(item => `Event ID: ${item.event_id}`), 'No registered events yet.')}
      </div>
      <div class="content-block">
        <h4>Your lesson plans</h4>
        ${renderList(lessons.map(item => `${item.title} • ${item.subject || 'General'} (${formatDate(item.created_at)})`), 'No lesson plans saved yet.')}
      </div>
    `;
  }

  if (teacherSection) {
    teacherSection.innerHTML = `
      ${createStatCard('Lesson Plans Created', lessons.length, 'Curriculum-ready resources')}
      ${createStatCard('Community Resources', resources.length, 'Shared documents and guides')}
      <div class="content-block">
        <h4>Your lesson plans</h4>
        ${renderList(lessons.map(item => `${item.title} • Grade ${item.grade || 'N/A'} (${item.subject || 'General'})`), 'No lesson plans saved yet.')}
      </div>
    `;
  }

  if (schoolSection) {
    schoolSection.innerHTML = `
      ${createStatCard('Teacher Plans', lessons.length, 'Lesson planning from school staff')}
      ${createStatCard('Community Events', registrations.length, 'School programs and outreach')}
      <div class="content-block">
        <h4>Saved curriculum plans</h4>
        ${renderList(lessons.map(item => `${item.title} • ${item.subject || 'General'}`), 'No lessons yet.')}
      </div>
    `;
  }

  if (parentSection) {
    parentSection.innerHTML = `
      ${createStatCard('Student Plans', lessons.length, 'Student learning growth')}
      ${createStatCard('Family Events', registrations.length, 'Parent-child workshops')}
      <div class="content-block">
        <h4>Recent activity</h4>
        ${renderList(registrations.map(item => `Event: ${item.event_id}`), 'No family events registered yet.')}
      </div>
    `;
  }

  if (communitySection) {
    const myPosts = forumItems.filter(item => item.author_id === user.id);
    const myResources = resources.filter(item => item.author_id === user.id);
    communitySection.innerHTML = `
      ${createStatCard('Shared Posts', myPosts.length, 'Community discussions you started')}
      ${createStatCard('Shared Resources', myResources.length, 'Files and links you shared')}
      <div class="content-block">
        <h4>Your forum questions</h4>
        ${renderList(myPosts.map(item => item.title), 'No posts submitted yet.')}
      </div>
      <div class="content-block">
        <h4>Your shared resources</h4>
        ${renderList(myResources.map(item => item.title), 'No resources shared yet.')}
      </div>
    `;
  }
}

async function initAdminPage() {
  const user = await requireAuthentication();
  if (!user) return;
  if (user.role !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      await fetchJson('/auth/logout', { method: 'POST' });
      window.location.href = 'login.html';
    });
  }

  const stats = await fetchJson('/admin/stats');
  document.getElementById('stat-users').textContent = stats.totalUsers;
  document.getElementById('stat-posts').textContent = stats.totalPosts;
  document.getElementById('stat-resources').textContent = stats.totalResources;
  document.getElementById('stat-lessons').textContent = stats.totalLessons;

  const usersTable = document.getElementById('users-table-body');
  const forumTable = document.getElementById('forum-table-body');
  const resourcesTable = document.getElementById('resources-table-body');

  const users = await fetchJson('/admin/users');
  usersTable.innerHTML = users.users.map(userRow => `
    <tr>
      <td>${userRow.id}</td>
      <td>${userRow.username}</td>
      <td>${userRow.email}</td>
      <td>${userRow.role}</td>
      <td>${userRow.full_name || '—'}</td>
      <td>${formatDate(userRow.created_at)}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="deleteUser(${userRow.id})">Delete</button>
      </td>
    </tr>
  `).join('');

  const forumItems = await fetchJson('/forum');
  forumTable.innerHTML = forumItems.posts.map(post => `
    <tr>
      <td>${post.id}</td>
      <td>${post.title}</td>
      <td>${post.author_name || 'Unknown'}</td>
      <td>${post.category}</td>
      <td>${post.likes}</td>
      <td>${formatDate(post.created_at)}</td>
      <td><button class="btn btn-accent btn-sm" onclick="deleteForumPost(${post.id})">Delete</button></td>
    </tr>
  `).join('');

  const resources = await fetchJson('/resources');
  resourcesTable.innerHTML = resources.resources.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.title}</td>
      <td>${item.author_name || 'Unknown'}</td>
      <td>${item.subject || 'General'}</td>
      <td>${item.downloads}</td>
      <td>${formatDate(item.created_at)}</td>
      <td><button class="btn btn-accent btn-sm" onclick="deleteResource(${item.id})">Delete</button></td>
    </tr>
  `).join('');
}

window.deleteUser = async function(userId) {
  if (!confirm('Delete this user permanently?')) return;
  await fetchJson(`/admin/users/${userId}`, { method: 'DELETE' });
  window.location.reload();
};

window.deleteForumPost = async function(postId) {
  if (!confirm('Delete this forum post?')) return;
  await fetchJson(`/admin/forum/${postId}`, { method: 'DELETE' });
  window.location.reload();
};

window.deleteResource = async function(resourceId) {
  if (!confirm('Delete this shared resource?')) return;
  await fetchJson(`/admin/resources/${resourceId}`, { method: 'DELETE' });
  window.location.reload();
};

window.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page;
  bindFormActions();
  if (page === 'login') {
    await initLoginPage();
  }
  if (page === 'dashboard') {
    await initDashboardPage();
  }
  if (page === 'admin') {
    await initAdminPage();
  }
});
