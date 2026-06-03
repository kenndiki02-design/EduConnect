// ============================================================
// EduConnect Kenya — Shared JavaScript Utilities
// ============================================================

// ── Navbar scroll effect ──────────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Mobile menu
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.querySelector('.mobile-menu-close');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
  }
  if (closeBtn && mobileMenu) {
    closeBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
  }
}

// ── Animate elements on scroll ────────────────────────────
function initScrollAnimations() {
  const els = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
}

// ── Counter animation ─────────────────────────────────────
function animateCounter(el, target, duration = 2000, suffix = '') {
  const start = performance.now();
  const startVal = 0;
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, 2000, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

// ── Tabs ──────────────────────────────────────────────────
function initTabs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const buttons = container.querySelectorAll('.tab-btn');
  const contents = container.querySelectorAll('.tab-content');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const targetContent = container.querySelector(`.tab-content[data-tab="${target}"]`);
      if (targetContent) targetContent.classList.add('active');
    });
  });
}

// ── Toast Notifications ───────────────────────────────────
function showToast(message, type = 'success', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '📢'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration + 300);
}

// ── Modal ─────────────────────────────────────────────────
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('open');
}
function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('open');
}

// ── Active Nav Link ───────────────────────────────────────
function setActiveNavLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ── Progress Bar Animation ────────────────────────────────
function animateProgressBars() {
  const bars = document.querySelectorAll('.progress-fill[data-width]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(bar => {
    bar.style.width = '0';
    observer.observe(bar);
  });
}

// ── Initialize all ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounters();
  setActiveNavLink();
  animateProgressBars();
  syncSessionNav();
});

async function syncSessionNav() {
  const uiLinks = Array.from(document.querySelectorAll('.nav-cta a, .mobile-menu-overlay a'));
  uiLinks.forEach(link => {
    if (link.getAttribute('href') === '#join') {
      link.href = 'login.html';
    }
  });

  try {
    const response = await fetch('/api/auth/status', { credentials: 'include' });
    const status = await response.json();
    const desktopLinks = document.querySelectorAll('.nav-cta a');
    const mobileLinks = document.querySelectorAll('.mobile-menu-overlay .btn');

    if (status.loggedIn) {
      desktopLinks.forEach((link, index) => {
        if (index === 0) {
          link.textContent = 'Dashboard';
          link.href = 'dashboard.html';
        } else {
          link.textContent = 'Sign Out';
          link.href = 'javascript:void(0)';
          link.onclick = async (event) => {
            event.preventDefault();
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
            window.location.href = 'login.html';
          };
        }
      });
      mobileLinks.forEach((link) => {
        if (link.classList.contains('btn-ghost')) {
          link.textContent = 'Dashboard';
          link.href = 'dashboard.html';
        }
        if (link.classList.contains('btn-primary')) {
          link.textContent = 'Sign Out';
          link.href = 'javascript:void(0)';
          link.onclick = async (event) => {
            event.preventDefault();
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
            window.location.href = 'login.html';
          };
        }
      });
    } else {
      desktopLinks.forEach((link, index) => {
        if (index === 0) {
          link.textContent = 'Sign In';
        } else {
          link.textContent = 'Join Free';
        }
        link.href = 'login.html';
        link.onclick = null;
      });
      mobileLinks.forEach((link) => {
        link.textContent = link.classList.contains('btn-primary') ? 'Join Free' : 'Sign In';
        link.href = 'login.html';
        link.onclick = null;
      });
    }
  } catch (err) {
    console.error('Unable to synchronize auth navigation', err);
  }
}
