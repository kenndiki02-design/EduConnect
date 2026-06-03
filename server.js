const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcryptjs');
let Database;
let sqliteAvailable = true;

try {
  Database = require('better-sqlite3');
} catch (err) {
  sqliteAvailable = false;
  console.warn('better-sqlite3 is unavailable or failed to load. Falling back to JSON store.');
}

const databaseFile = path.join(__dirname, 'educonnect.db');
const jsonStoreFile = path.join(__dirname, 'educonnect-store.json');
let db;
let jsonStore;

function loadJsonStore() {
  if (fs.existsSync(jsonStoreFile)) {
    try {
      return JSON.parse(fs.readFileSync(jsonStoreFile, 'utf-8'));
    } catch (err) {
      console.error('Failed to read JSON data store:', err.message);
    }
  }
  return {
    users: [],
    forum_posts: [],
    shared_resources: [],
    lesson_plans: [],
    event_registrations: [],
    mentorship_requests: []
  };
}

function saveJsonStore() {
  try {
    fs.writeFileSync(jsonStoreFile, JSON.stringify(jsonStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save JSON data store:', err.message);
  }
}

function nextIdFor(collection) {
  return collection.reduce((max, item) => Math.max(max, item.id || 0), 0) + 1;
}

function normalizeQuery(sql) {
  return sql.trim().replace(/\s+/g, ' ').toUpperCase();
}

function matchesLike(value, pattern) {
  if (!pattern) return true;
  const search = pattern.replace(/%/g, '').toLowerCase();
  return value && value.toLowerCase().includes(search);
}

function createJsonStatement(sql) {
  const normalized = normalizeQuery(sql);

  function execute(params = []) {
    const [a, b, c, d, e, f] = params;

    if (normalized.startsWith('SELECT ID FROM USERS WHERE EMAIL = ?')) {
      const user = jsonStore.users.find((item) => item.email === a);
      return user ? { id: user.id } : undefined;
    }

    if (normalized.startsWith('SELECT * FROM USERS WHERE EMAIL = ?')) {
      return jsonStore.users.find((item) => item.email === a);
    }

    if (normalized.startsWith('SELECT * FROM USERS WHERE ID = ?')) {
      return jsonStore.users.find((item) => item.id === Number(a));
    }

    if (normalized.startsWith('SELECT ID, USERNAME, EMAIL, ROLE, FULL_NAME, CREATED_AT FROM USERS WHERE ID = ?')) {
      return jsonStore.users.find((item) => item.id === Number(a));
    }

    if (normalized.startsWith('INSERT INTO USERS')) {
      const id = nextIdFor(jsonStore.users);
      const user = {
        id,
        username: a,
        email: b,
        password_hash: c,
        role: d,
        full_name: e || '',
        created_at: new Date().toISOString()
      };
      jsonStore.users.push(user);
      saveJsonStore();
      return { lastInsertRowid: id };
    }

    if (normalized.startsWith('SELECT ID, USERNAME, EMAIL, ROLE, FULL_NAME, CREATED_AT FROM USERS ORDER BY CREATED_AT DESC LIMIT 5')) {
      return jsonStore.users
        .slice()
        .sort((left, right) => new Date(right.created_at) - new Date(left.created_at))
        .slice(0, 5)
        .map(({ id, username, email, role, full_name, created_at }) => ({ id, username, email, role, full_name, created_at }));
    }

    if (normalized.startsWith('SELECT ID, USERNAME, EMAIL, ROLE, FULL_NAME, CREATED_AT FROM USERS ORDER BY CREATED_AT DESC')) {
      return jsonStore.users
        .slice()
        .sort((left, right) => new Date(right.created_at) - new Date(left.created_at))
        .map(({ id, username, email, role, full_name, created_at }) => ({ id, username, email, role, full_name, created_at }));
    }

    if (normalized.startsWith('SELECT COUNT(*) AS COUNT FROM USERS')) {
      return { count: jsonStore.users.length };
    }

    if (normalized.startsWith('SELECT ROLE, COUNT(*) AS COUNT FROM USERS GROUP BY ROLE')) {
      const counts = {};
      for (const user of jsonStore.users) {
        counts[user.role] = (counts[user.role] || 0) + 1;
      }
      return Object.entries(counts).map(([role, count]) => ({ role, count }));
    }

    if (normalized.startsWith('UPDATE USERS SET ROLE = ? WHERE ID = ?')) {
      const user = jsonStore.users.find((item) => item.id === Number(b));
      if (!user) return { changes: 0 };
      user.role = a;
      saveJsonStore();
      return { changes: 1 };
    }

    if (normalized.startsWith('DELETE FROM USERS WHERE ID = ?')) {
      const index = jsonStore.users.findIndex((item) => item.id === Number(a));
      if (index === -1) return { changes: 0 };
      jsonStore.users.splice(index, 1);
      saveJsonStore();
      return { changes: 1 };
    }

    if (normalized.startsWith('SELECT * FROM FORUM_POSTS WHERE TITLE LIKE ? ORDER BY CREATED_AT DESC')) {
      return jsonStore.forum_posts
        .filter((item) => matchesLike(item.title, a))
        .slice()
        .sort((left, right) => new Date(right.created_at) - new Date(left.created_at));
    }

    if (normalized.startsWith('SELECT * FROM FORUM_POSTS ORDER BY CREATED_AT DESC')) {
      return jsonStore.forum_posts
        .slice()
        .sort((left, right) => new Date(right.created_at) - new Date(left.created_at));
    }

    if (normalized.startsWith('INSERT INTO FORUM_POSTS')) {
      const id = nextIdFor(jsonStore.forum_posts);
      const post = {
        id,
        title: a,
        category: b || 'General',
        author_id: c,
        author_name: d,
        body: e || '',
        likes: 0,
        created_at: new Date().toISOString()
      };
      jsonStore.forum_posts.push(post);
      saveJsonStore();
      return { lastInsertRowid: id };
    }

    if (normalized.startsWith('SELECT * FROM FORUM_POSTS WHERE ID = ?')) {
      return jsonStore.forum_posts.find((item) => item.id === Number(a));
    }

    if (normalized.startsWith('UPDATE FORUM_POSTS SET LIKES = LIKES + 1 WHERE ID = ?')) {
      const post = jsonStore.forum_posts.find((item) => item.id === Number(a));
      if (!post) return { changes: 0 };
      post.likes = (post.likes || 0) + 1;
      saveJsonStore();
      return { changes: 1 };
    }

    if (normalized.startsWith('DELETE FROM FORUM_POSTS WHERE ID = ?')) {
      const index = jsonStore.forum_posts.findIndex((item) => item.id === Number(a));
      if (index === -1) return { changes: 0 };
      jsonStore.forum_posts.splice(index, 1);
      saveJsonStore();
      return { changes: 1 };
    }

    if (normalized.startsWith('SELECT * FROM SHARED_RESOURCES WHERE TITLE LIKE ? ORDER BY CREATED_AT DESC')) {
      return jsonStore.shared_resources
        .filter((item) => matchesLike(item.title, a))
        .slice()
        .sort((left, right) => new Date(right.created_at) - new Date(left.created_at));
    }

    if (normalized.startsWith('SELECT * FROM SHARED_RESOURCES ORDER BY CREATED_AT DESC')) {
      return jsonStore.shared_resources
        .slice()
        .sort((left, right) => new Date(right.created_at) - new Date(left.created_at));
    }

    if (normalized.startsWith('INSERT INTO SHARED_RESOURCES')) {
      const id = nextIdFor(jsonStore.shared_resources);
      const resource = {
        id,
        title: a,
        subject: b || '',
        author_id: c,
        author_name: d,
        description: e || '',
        downloads: 0,
        file_url: f || '',
        created_at: new Date().toISOString()
      };
      jsonStore.shared_resources.push(resource);
      saveJsonStore();
      return { lastInsertRowid: id };
    }

    if (normalized.startsWith('SELECT * FROM SHARED_RESOURCES WHERE ID = ?')) {
      return jsonStore.shared_resources.find((item) => item.id === Number(a));
    }

    if (normalized.startsWith('UPDATE SHARED_RESOURCES SET DOWNLOADS = DOWNLOADS + 1 WHERE ID = ?')) {
      const resource = jsonStore.shared_resources.find((item) => item.id === Number(a));
      if (!resource) return { changes: 0 };
      resource.downloads = (resource.downloads || 0) + 1;
      saveJsonStore();
      return { changes: 1 };
    }

    if (normalized.startsWith('DELETE FROM SHARED_RESOURCES WHERE ID = ?')) {
      const index = jsonStore.shared_resources.findIndex((item) => item.id === Number(a));
      if (index === -1) return { changes: 0 };
      jsonStore.shared_resources.splice(index, 1);
      saveJsonStore();
      return { changes: 1 };
    }

    if (normalized.startsWith('SELECT * FROM LESSON_PLANS WHERE USER_ID = ? ORDER BY CREATED_AT DESC')) {
      return jsonStore.lesson_plans
        .filter((item) => item.user_id === Number(a))
        .slice()
        .sort((left, right) => new Date(right.created_at) - new Date(left.created_at));
    }

    if (normalized.startsWith('INSERT INTO LESSON_PLANS')) {
      const id = nextIdFor(jsonStore.lesson_plans);
      const lesson = {
        id,
        user_id: a,
        title: b,
        subject: c || '',
        grade: d || '',
        content: e || '',
        created_at: new Date().toISOString()
      };
      jsonStore.lesson_plans.push(lesson);
      saveJsonStore();
      return { lastInsertRowid: id };
    }

    if (normalized.startsWith('SELECT * FROM LESSON_PLANS WHERE ID = ?')) {
      return jsonStore.lesson_plans.find((item) => item.id === Number(a));
    }

    if (normalized.startsWith('SELECT COUNT(*) AS COUNT FROM FORUM_POSTS')) {
      return { count: jsonStore.forum_posts.length };
    }

    if (normalized.startsWith('SELECT COUNT(*) AS COUNT FROM SHARED_RESOURCES')) {
      return { count: jsonStore.shared_resources.length };
    }

    if (normalized.startsWith('SELECT COUNT(*) AS COUNT FROM LESSON_PLANS')) {
      return { count: jsonStore.lesson_plans.length };
    }

    if (normalized.startsWith('INSERT INTO EVENT_REGISTRATIONS')) {
      const exists = jsonStore.event_registrations.some((item) => item.user_id === a && item.event_id === b);
      if (!exists) {
        jsonStore.event_registrations.push({ user_id: a, event_id: b });
        saveJsonStore();
        return { changes: 1 };
      }
      return { changes: 0 };
    }

    if (normalized.startsWith('SELECT * FROM EVENT_REGISTRATIONS WHERE USER_ID = ?')) {
      return jsonStore.event_registrations.filter((item) => item.user_id === a);
    }

    if (normalized.startsWith('INSERT INTO MENTORSHIP_REQUESTS')) {
      const id = nextIdFor(jsonStore.mentorship_requests);
      jsonStore.mentorship_requests.push({ id, user_id: a, topic: b, message: c || '', created_at: new Date().toISOString() });
      saveJsonStore();
      return { lastInsertRowid: id };
    }

    console.warn('Unrecognized JSON store query:', sql);
    return undefined;
  }

  return {
    run: (...params) => execute(params),
    get: (...params) => execute(params),
    all: (...params) => {
      const result = execute(params);
      return Array.isArray(result) ? result : result ? [result] : [];
    }
  };
}

function createJsonDb() {
  jsonStore = loadJsonStore();
  return {
    exec: () => {},
    prepare: createJsonStatement
  };
}

function createSqliteDb() {
  const sqliteDb = new Database(databaseFile);
  sqliteDb.pragma('journal_mode = WAL');
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student','teacher','school','parent','community','admin')),
      full_name TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS forum_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      author_id INTEGER,
      author_name TEXT,
      body TEXT,
      likes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS shared_resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subject TEXT,
      author_id INTEGER,
      author_name TEXT,
      description TEXT,
      downloads INTEGER DEFAULT 0,
      file_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lesson_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT,
      subject TEXT,
      grade TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS event_registrations (
      user_id INTEGER,
      event_id TEXT,
      PRIMARY KEY (user_id, event_id)
    );

    CREATE TABLE IF NOT EXISTS mentorship_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      topic TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return sqliteDb;
}

function initializeDatabase() {
  if (sqliteAvailable) {
    try {
      return createSqliteDb();
    } catch (err) {
      console.warn('SQLite initialization failed, falling back to JSON store:', err.message);
    }
  }
  return createJsonDb();
}

function seedAdmin() {
  try {
    const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@educonnect.or.ke');
    if (!existingAdmin) {
      const hashedPassword = bcrypt.hashSync('Admin@123', 10);
      db.prepare('INSERT INTO users (username, email, password_hash, role, full_name) VALUES (?, ?, ?, ?, ?)')
        .run('admin', 'admin@educonnect.or.ke', hashedPassword, 'admin', 'System Administrator');
      console.log('Default admin user seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding admin user:', err.message);
  }
}

db = initializeDatabase();
seedAdmin();

// ─── Express App ─────────────────────────────────────────────────────────────────
const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(session({
  secret: 'educonnect-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Serve static files from current directory
app.use(express.static('.'));

// ─── Auth Middleware ─────────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }
  if (req.session.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  next();
}

// ═════════════════════════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ═════════════════════════════════════════════════════════════════════════════════

// Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, password, role, full_name } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields (username, email, password, role) are required.' });
    }

    const validRoles = ['student', 'teacher', 'school', 'parent', 'community', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'A user with this email already exists.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      'INSERT INTO users (username, email, password_hash, role, full_name) VALUES (?, ?, ?, ?, ?)'
    ).run(username, email, hashedPassword, role, full_name || '');

    req.session.userId = result.lastInsertRowid;
    req.session.username = username;
    req.session.email = email;
    req.session.role = role;
    req.session.fullName = full_name || '';

    res.status(201).json({
      success: true,
      user: {
        id: result.lastInsertRowid,
        username,
        email,
        role,
        full_name: full_name || ''
      }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.email = user.email;
    req.session.role = user.role;
    req.session.fullName = user.full_name;

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        full_name: user.full_name
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error logging out.' });
      }
      res.json({ success: true, message: 'Logged out successfully.' });
    });
  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during logout.' });
  }
});

// Auth Status
app.get('/api/auth/status', (req, res) => {
  try {
    if (req.session.userId) {
      res.json({
        loggedIn: true,
        user: {
          id: req.session.userId,
          username: req.session.username,
          email: req.session.email,
          role: req.session.role,
          fullName: req.session.fullName
        }
      });
    } else {
      res.json({ loggedIn: false });
    }
  } catch (err) {
    console.error('Auth status error:', err.message);
    res.status(500).json({ loggedIn: false, message: 'Server error checking auth status.' });
  }
});

// ═════════════════════════════════════════════════════════════════════════════════
//  FORUM ROUTES
// ═════════════════════════════════════════════════════════════════════════════════

// Get all forum posts (with optional search)
app.get('/api/forum', (req, res) => {
  try {
    const { search } = req.query;
    let posts;

    if (search) {
      posts = db.prepare(
        'SELECT * FROM forum_posts WHERE title LIKE ? ORDER BY created_at DESC'
      ).all(`%${search}%`);
    } else {
      posts = db.prepare('SELECT * FROM forum_posts ORDER BY created_at DESC').all();
    }

    res.json({ posts });
  } catch (err) {
    console.error('Get forum posts error:', err.message);
    res.status(500).json({ success: false, message: 'Error fetching forum posts.' });
  }
});

// Create forum post
app.post('/api/forum', requireAuth, (req, res) => {
  try {
    const { title, category, body } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Post title is required.' });
    }

    const result = db.prepare(
      'INSERT INTO forum_posts (title, category, author_id, author_name, body) VALUES (?, ?, ?, ?, ?)'
    ).run(title, category || 'General', req.session.userId, req.session.username, body || '');

    const newPost = db.prepare('SELECT * FROM forum_posts WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    console.error('Create forum post error:', err.message);
    res.status(500).json({ success: false, message: 'Error creating forum post.' });
  }
});

// Like a forum post
app.post('/api/forum/:id/like', (req, res) => {
  try {
    const { id } = req.params;

    const post = db.prepare('SELECT * FROM forum_posts WHERE id = ?').get(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    db.prepare('UPDATE forum_posts SET likes = likes + 1 WHERE id = ?').run(id);
    const updatedPost = db.prepare('SELECT * FROM forum_posts WHERE id = ?').get(id);

    res.json({ success: true, post: updatedPost });
  } catch (err) {
    console.error('Like post error:', err.message);
    res.status(500).json({ success: false, message: 'Error liking post.' });
  }
});

// Delete forum post
app.delete('/api/forum/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;

    const post = db.prepare('SELECT * FROM forum_posts WHERE id = ?').get(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    if (post.author_id !== req.session.userId && req.session.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only delete your own posts.' });
    }

    db.prepare('DELETE FROM forum_posts WHERE id = ?').run(id);
    res.json({ success: true, message: 'Post deleted successfully.' });
  } catch (err) {
    console.error('Delete forum post error:', err.message);
    res.status(500).json({ success: false, message: 'Error deleting forum post.' });
  }
});

// ═════════════════════════════════════════════════════════════════════════════════
//  RESOURCES ROUTES
// ═════════════════════════════════════════════════════════════════════════════════

// Get all resources (with optional search)
app.get('/api/resources', (req, res) => {
  try {
    const { search } = req.query;
    let resources;

    if (search) {
      resources = db.prepare(
        'SELECT * FROM shared_resources WHERE title LIKE ? ORDER BY created_at DESC'
      ).all(`%${search}%`);
    } else {
      resources = db.prepare('SELECT * FROM shared_resources ORDER BY created_at DESC').all();
    }

    res.json({ resources });
  } catch (err) {
    console.error('Get resources error:', err.message);
    res.status(500).json({ success: false, message: 'Error fetching resources.' });
  }
});

// Create resource
app.post('/api/resources', requireAuth, (req, res) => {
  try {
    const { title, subject, description, file_url } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Resource title is required.' });
    }

    const result = db.prepare(
      'INSERT INTO shared_resources (title, subject, author_id, author_name, description, file_url) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(title, subject || '', req.session.userId, req.session.username, description || '', file_url || '');

    const newResource = db.prepare('SELECT * FROM shared_resources WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, resource: newResource });
  } catch (err) {
    console.error('Create resource error:', err.message);
    res.status(500).json({ success: false, message: 'Error creating resource.' });
  }
});

// Increment download count
app.post('/api/resources/:id/download', (req, res) => {
  try {
    const { id } = req.params;

    const resource = db.prepare('SELECT * FROM shared_resources WHERE id = ?').get(id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }

    db.prepare('UPDATE shared_resources SET downloads = downloads + 1 WHERE id = ?').run(id);
    const updatedResource = db.prepare('SELECT * FROM shared_resources WHERE id = ?').get(id);

    res.json({ success: true, resource: updatedResource });
  } catch (err) {
    console.error('Download resource error:', err.message);
    res.status(500).json({ success: false, message: 'Error tracking download.' });
  }
});

// Delete resource (admin only)
app.delete('/api/resources/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;

    if (req.session.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required to delete resources.' });
    }

    const resource = db.prepare('SELECT * FROM shared_resources WHERE id = ?').get(id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }

    db.prepare('DELETE FROM shared_resources WHERE id = ?').run(id);
    res.json({ success: true, message: 'Resource deleted successfully.' });
  } catch (err) {
    console.error('Delete resource error:', err.message);
    res.status(500).json({ success: false, message: 'Error deleting resource.' });
  }
});

// ═════════════════════════════════════════════════════════════════════════════════
//  LESSON PLANS ROUTES
// ═════════════════════════════════════════════════════════════════════════════════

// Get lessons for current user
app.get('/api/lessons', requireAuth, (req, res) => {
  try {
    const lessons = db.prepare(
      'SELECT * FROM lesson_plans WHERE user_id = ? ORDER BY created_at DESC'
    ).all(req.session.userId);

    res.json({ lessons });
  } catch (err) {
    console.error('Get lessons error:', err.message);
    res.status(500).json({ success: false, message: 'Error fetching lessons.' });
  }
});

// Create lesson plan
app.post('/api/lessons', requireAuth, (req, res) => {
  try {
    const { title, subject, grade, content } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Lesson title is required.' });
    }

    const result = db.prepare(
      'INSERT INTO lesson_plans (user_id, title, subject, grade, content) VALUES (?, ?, ?, ?, ?)'
    ).run(req.session.userId, title, subject || '', grade || '', content || '');

    const newLesson = db.prepare('SELECT * FROM lesson_plans WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, lesson: newLesson });
  } catch (err) {
    console.error('Create lesson error:', err.message);
    res.status(500).json({ success: false, message: 'Error creating lesson plan.' });
  }
});

// ═════════════════════════════════════════════════════════════════════════════════
//  EVENTS & MENTORSHIP ROUTES
// ═════════════════════════════════════════════════════════════════════════════════

// Register user for an event
app.post('/api/events/register', requireAuth, (req, res) => {
  try {
    const { event_id } = req.body;
    if (!event_id) {
      return res.status(400).json({ success: false, message: 'Event ID is required.' });
    }

    db.prepare('INSERT INTO event_registrations (user_id, event_id) VALUES (?, ?)').run(req.session.userId, event_id);
    res.status(201).json({ success: true, message: 'Registered for event successfully.' });
  } catch (err) {
    console.error('Event registration error:', err.message);
    res.status(500).json({ success: false, message: 'Error registering for event.' });
  }
});

// Retrieve current user's event registrations
app.get('/api/events/my-registrations', requireAuth, (req, res) => {
  try {
    const registrations = db.prepare('SELECT * FROM event_registrations WHERE user_id = ?').all(req.session.userId);
    res.json({ registrations });
  } catch (err) {
    console.error('Get event registrations error:', err.message);
    res.status(500).json({ success: false, message: 'Error fetching event registrations.' });
  }
});

// Submit mentorship request
app.post('/api/mentorship/request', requireAuth, (req, res) => {
  try {
    const { topic, message } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, message: 'Mentorship topic is required.' });
    }

    db.prepare('INSERT INTO mentorship_requests (user_id, topic, message) VALUES (?, ?, ?)')
      .run(req.session.userId, topic, message || '');

    res.status(201).json({ success: true, message: 'Mentorship request submitted successfully.' });
  } catch (err) {
    console.error('Mentorship request error:', err.message);
    res.status(500).json({ success: false, message: 'Error submitting mentorship request.' });
  }
});

// ═════════════════════════════════════════════════════════════════════════════════
//  ADMIN ROUTES
// ═════════════════════════════════════════════════════════════════════════════════

// Get all users
app.get('/api/admin/users', requireAdmin, (req, res) => {
  try {
    const users = db.prepare(
      'SELECT id, username, email, role, full_name, created_at FROM users ORDER BY created_at DESC'
    ).all();

    res.json({ users });
  } catch (err) {
    console.error('Admin get users error:', err.message);
    res.status(500).json({ success: false, message: 'Error fetching users.' });
  }
});

// Update user role
app.put('/api/admin/users/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['student', 'teacher', 'school', 'parent', 'community', 'admin'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Valid role is required.' });
    }

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
    const updatedUser = db.prepare(
      'SELECT id, username, email, role, full_name, created_at FROM users WHERE id = ?'
    ).get(id);

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Admin update user error:', err.message);
    res.status(500).json({ success: false, message: 'Error updating user.' });
  }
});

// Delete user
app.delete('/api/admin/users/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) === req.session.userId) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Admin delete user error:', err.message);
    res.status(500).json({ success: false, message: 'Error deleting user.' });
  }
});

// Admin stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
    const totalPosts = db.prepare('SELECT COUNT(*) AS count FROM forum_posts').get().count;
    const totalResources = db.prepare('SELECT COUNT(*) AS count FROM shared_resources').get().count;
    const totalLessons = db.prepare('SELECT COUNT(*) AS count FROM lesson_plans').get().count;

    const recentUsers = db.prepare(
      'SELECT id, username, email, role, full_name, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    ).all();

    const roleRows = db.prepare('SELECT role, COUNT(*) AS count FROM users GROUP BY role').all();
    const roleCounts = {};
    for (const row of roleRows) {
      roleCounts[row.role] = row.count;
    }

    res.json({
      totalUsers,
      totalPosts,
      totalResources,
      totalLessons,
      recentUsers,
      roleCounts
    });
  } catch (err) {
    console.error('Admin stats error:', err.message);
    res.status(500).json({ success: false, message: 'Error fetching stats.' });
  }
});

// Admin delete forum post
app.delete('/api/admin/forum/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;

    const post = db.prepare('SELECT id FROM forum_posts WHERE id = ?').get(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    db.prepare('DELETE FROM forum_posts WHERE id = ?').run(id);
    res.json({ success: true, message: 'Forum post deleted successfully.' });
  } catch (err) {
    console.error('Admin delete forum post error:', err.message);
    res.status(500).json({ success: false, message: 'Error deleting forum post.' });
  }
});

// Admin delete resource
app.delete('/api/admin/resources/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;

    const resource = db.prepare('SELECT id FROM shared_resources WHERE id = ?').get(id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }

    db.prepare('DELETE FROM shared_resources WHERE id = ?').run(id);
    res.json({ success: true, message: 'Resource deleted successfully.' });
  } catch (err) {
    console.error('Admin delete resource error:', err.message);
    res.status(500).json({ success: false, message: 'Error deleting resource.' });
  }
});

// ─── Server Start ────────────────────────────────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`EduConnect Kenya server running at http://localhost:${PORT}`);
});
