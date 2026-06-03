// ============================================================
// EduConnect Kenya — AI Tutor Logic
// ============================================================

let questionCount = 0;
let topicsSet = new Set();
let currentSubject = 'mathematics';
let currentGrade = 'Grade 9';
let isTyping = false;

// ── Subject Quick Questions ─────────────────────────────────
const quickQuestions = {
  mathematics: [
    'Explain Pythagoras theorem with an example',
    'How do I solve quadratic equations?',
    'What are surds and how do I simplify them?',
    'Explain simultaneous equations',
    'How do I find the area of a circle?',
  ],
  science: [
    'What is photosynthesis?',
    'Explain the water cycle',
    'What are the states of matter?',
    'How does electricity work?',
    'What is Newton\'s First Law?',
  ],
  english: [
    'How do I write a good essay introduction?',
    'Explain the difference between simile and metaphor',
    'What are the types of sentences?',
    'How do I improve my comprehension skills?',
    'What is the passive voice?',
  ],
  kiswahili: [
    'Nini maana ya kitenzi kikuu?',
    'Eleza matumizi ya ngeli za Kiswahili',
    'Jinsi ya kuandika insha nzuri',
    'Tofauti kati ya nomino na kivumishi',
    'Mashairi na umbo lake',
  ],
  history: [
    'What caused the Scramble for Africa?',
    'Explain Kenya\'s independence movement',
    'Who was Dedan Kimathi?',
    'What is the significance of the Lancaster House Conference?',
    'Explain the structure of Kenya\'s government',
  ],
  geography: [
    'Explain the formation of rift valleys',
    'What are the main climate zones of Kenya?',
    'How is soil formed?',
    'What causes ocean currents?',
    'Describe Kenya\'s major drainage systems',
  ],
  chemistry: [
    'What is the periodic table?',
    'Explain chemical bonding',
    'What are acids and bases?',
    'How do I balance chemical equations?',
    'What is oxidation and reduction?',
  ],
  biology: [
    'Explain cell division (mitosis)',
    'What is DNA and how does it work?',
    'Describe the digestive system',
    'What is natural selection?',
    'How do vaccines work?',
  ],
  physics: [
    'Explain the laws of motion',
    'What is Ohm\'s Law?',
    'How does a transformer work?',
    'Explain waves and their properties',
    'What is the difference between mass and weight?',
  ],
  ict: [
    'What is a computer network?',
    'Explain how the internet works',
    'What is a database?',
    'Explain input and output devices',
    'What is cybersecurity?',
  ],
};

// ── AI Response Engine ──────────────────────────────────────
const aiResponses = {
  mathematics: {
    'pythagoras': `Great question! 📐 **Pythagoras' Theorem** states that in a right-angled triangle:

**a² + b² = c²**

Where:
- **a** and **b** are the shorter sides (legs)
- **c** is the longest side (hypotenuse — opposite the right angle)

**Example:** A triangle has legs of 3 cm and 4 cm. Find the hypotenuse.

Step 1: Write the formula → c² = a² + b²
Step 2: Substitute → c² = 3² + 4² = 9 + 16 = 25
Step 3: Square root → c = √25 = **5 cm**

This is called a **3-4-5 Pythagorean triple** — very common in KCSE! 🎯

Other common triples to memorize: 5-12-13, 8-15-17`,

    'quadratic': `Quadratic equations have the form **ax² + bx + c = 0**. There are 3 methods to solve them:

**Method 1: Factorisation** (easiest when it works)
Example: x² + 5x + 6 = 0
Find two numbers that multiply to 6 and add to 5 → (3 and 2)
(x + 3)(x + 2) = 0
∴ x = -3 or x = -2 ✓

**Method 2: Quadratic Formula** (always works!)
x = (-b ± √(b² - 4ac)) / 2a

**Method 3: Completing the Square**
Used when factorisation doesn't work easily.

💡 **KCSE Tip:** Always check your answers by substituting back into the original equation!`,

    'default': `That's a great mathematics question! Let me break this down step by step.

Mathematics is built on understanding **concepts** before memorising formulas. In Kenya's CBC curriculum, we focus on:

1. **Understanding** the underlying concept
2. **Applying** it to real-world problems  
3. **Solving** practice questions from past papers

Could you give me more detail about what specifically you'd like help with? For example:
- A specific topic (e.g., "logarithms", "matrices", "probability")
- A question from your textbook or past paper
- A concept you find confusing

I'm here to help! 😊`,
  },

  science: {
    'photosynthesis': `**Photosynthesis** is the process by which green plants make their own food using sunlight. 🌱☀️

**The Equation:**
6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂
(Carbon dioxide + Water + Light → Glucose + Oxygen)

**Where does it happen?** In the **chloroplasts** — specifically in the green pigment called **chlorophyll**.

**Two Stages:**
1. **Light Stage** (Light-dependent reactions) — occurs in the thylakoid membranes
   - Light splits water molecules (photolysis)
   - ATP and NADPH are produced

2. **Dark Stage** (Calvin Cycle) — occurs in the stroma
   - CO₂ is fixed into glucose
   - Uses the ATP and NADPH from Stage 1

**Factors affecting photosynthesis:**
- Light intensity 💡
- Carbon dioxide concentration 🌬️
- Temperature 🌡️
- Water availability 💧

This is a very common KCSE topic — make sure you can draw and label the chloroplast! 🔬`,

    'default': `Excellent science question! Science is all about observation, evidence, and explanation.

For your question, let me think through this systematically:

🔬 **Scientific Approach:**
1. Start with what we know (prior knowledge)
2. Identify the key concepts
3. Apply the relevant principles
4. Draw a conclusion

Could you tell me more specifically what aspect you need help with? I can:
- Explain any biology, chemistry, or physics concept
- Help you with KCSE past paper questions
- Provide diagrams and explanations
- Help you understand experiments

What would you like to focus on? 🌟`,
  },

  english: {
    'essay': `Writing a great essay introduction is a crucial skill! Here's a proven structure: ✍️

**The 3-Part Introduction Formula:**

**1. Hook (1-2 sentences)**
Start with something interesting:
- A compelling statistic: "Over 60% of Kenyan students struggle with..."
- A thought-provoking question: "What if education could transform a community?"
- A powerful quote: "Education is the most powerful weapon..." - Nelson Mandela
- A vivid description

**2. Background/Context (2-3 sentences)**
Provide relevant context that leads your reader into the topic.

**3. Thesis Statement (1-2 sentences)**
Clearly state your main argument or purpose. This is the most important part!

**Example Introduction:**
*"Education is the cornerstone of national development. In Kenya, access to quality education has transformed millions of lives, yet significant challenges remain. This essay argues that digital learning platforms can bridge educational gaps and improve outcomes for all learners across the country."*

💡 **Common Mistakes to Avoid:**
- Don't start with "In this essay I will..."
- Don't make your hook too dramatic or unrelated
- Make sure your thesis is specific and arguable`,

    'default': `Great English question! English skills are essential for academic success and beyond.

Let me help you with that. In the CBC curriculum, English covers:

📚 **Key Areas:**
- **Language** — Grammar, vocabulary, punctuation
- **Literature** — Prose, poetry, drama, oral literature  
- **Composition** — Essays, letters, reports, creative writing
- **Reading Comprehension** — Extracting meaning from texts

To give you the most helpful answer, could you:
1. Share the specific topic or question?
2. Tell me which area of English you need help with?
3. Share any text or question from your book?

I'm ready to help you master English! 📖`,
  },

  default: `That's an interesting question! Let me help you with that.

I can provide comprehensive support across all CBC curriculum subjects. For the best help:

🎯 **To get a targeted answer:**
1. Make sure you've selected the right subject in the sidebar
2. Be as specific as possible about what you need
3. Feel free to paste the exact question from your textbook

📚 **I can help with:**
- Concept explanations with examples
- Step-by-step problem solving  
- Past paper question practice
- Study tips and strategies
- Exam preparation guidance

Ask me anything and I'll do my best to explain it clearly! What's on your mind? 😊`,
};

// ── Get AI Response ─────────────────────────────────────────
function getAIResponse(message) {
  const lower = message.toLowerCase();
  const subjectResponses = aiResponses[currentSubject] || aiResponses.default;

  // Match keywords
  for (const [keyword, response] of Object.entries(subjectResponses)) {
    if (keyword !== 'default' && lower.includes(keyword)) {
      return response;
    }
  }

  // Check cross-subject keywords
  for (const [subj, responses] of Object.entries(aiResponses)) {
    for (const [keyword, response] of Object.entries(responses)) {
      if (keyword !== 'default' && lower.includes(keyword)) {
        return response;
      }
    }
  }

  return subjectResponses.default || aiResponses.default;
}

// ── Render Markdown-like formatting ────────────────────────
function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
}

// ── Send Message ────────────────────────────────────────────
function sendMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  if (!message || isTyping) return;

  input.value = '';
  questionCount++;
  document.getElementById('question-count').textContent = questionCount;

  // Detect topic
  const words = message.toLowerCase().split(' ');
  words.forEach(w => { if (w.length > 4) topicsSet.add(w); });
  document.getElementById('topic-count').textContent = Math.min(topicsSet.size, questionCount);

  appendMessage(message, 'user');
  showTypingIndicator();
  isTyping = true;

  const delay = 1200 + Math.random() * 1000;
  setTimeout(() => {
    removeTypingIndicator();
    const response = getAIResponse(message);
    appendMessage(formatResponse(response), 'ai');
    isTyping = false;
    updateResources();
  }, delay);
}

// ── Append Message ──────────────────────────────────────────
function appendMessage(content, sender) {
  const messages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `chat-message ${sender === 'user' ? 'user' : ''}`;

  const avatar = `<div class="chat-avatar ${sender === 'ai' ? 'ai-avatar' : 'user-avatar'}">${sender === 'ai' ? '🤖' : '🧑'}</div>`;
  const bubble = `<div class="chat-bubble ${sender === 'ai' ? 'ai-bubble' : 'user-bubble'}">${content}</div>`;

  div.innerHTML = sender === 'user' ? bubble + avatar : avatar + bubble;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// ── Typing Indicator ────────────────────────────────────────
function showTypingIndicator() {
  const messages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-message';
  div.id = 'typing-indicator';
  div.innerHTML = `
    <div class="chat-avatar ai-avatar">🤖</div>
    <div class="chat-bubble ai-bubble">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

// ── Subject Selection ───────────────────────────────────────
function selectSubject(btn) {
  document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentSubject = btn.dataset.subject;
  const name = btn.querySelector('span:last-child').textContent;
  document.getElementById('subject-badge').textContent = name;
  document.getElementById('active-subject-stat').textContent = name;
  updateQuickQuestions();
  updateResources();
  showToast(`Switched to ${name} 📚`, 'info', 2000);
}

function updateGrade(select) {
  const text = select.options[select.selectedIndex].text;
  currentGrade = text;
  document.getElementById('grade-badge').textContent = text;
}

// ── Quick Questions ─────────────────────────────────────────
function updateQuickQuestions() {
  const container = document.getElementById('quick-questions');
  const questions = quickQuestions[currentSubject] || [];
  container.innerHTML = questions.map(q =>
    `<button class="quick-q-btn" onclick="askQuickQuestion('${q.replace(/'/g, "\\'")}')">${q}</button>`
  ).join('');
}

function askQuickQuestion(question) {
  document.getElementById('chat-input').value = question;
  sendMessage();
}

// ── Update Resources ────────────────────────────────────────
const subjectResources = {
  mathematics: [
    { icon: '📹', title: 'KCSE Mathematics Past Papers', type: 'PDF · Practice', url: '#' },
    { icon: '🧮', title: 'Interactive Algebra Tools', type: 'Tool · Interactive', url: '#' },
    { icon: '📄', title: 'CBC Mathematics Syllabus', type: 'Document · Reference', url: '#' },
  ],
  science: [
    { icon: '🔬', title: 'Science Experiments Guide', type: 'PDF · Lab Work', url: '#' },
    { icon: '📹', title: 'Biology Video Lessons', type: 'Video · 25 min', url: '#' },
    { icon: '📄', title: 'KCSE Science Past Papers', type: 'PDF · Practice', url: '#' },
  ],
  english: [
    { icon: '📖', title: 'KCSE Set Books Study Guide', type: 'PDF · Literature', url: '#' },
    { icon: '✍️', title: 'Essay Writing Templates', type: 'Template · Writing', url: '#' },
    { icon: '📹', title: 'Grammar Video Series', type: 'Video · 15 min', url: '#' },
  ],
};

function updateResources() {
  const container = document.getElementById('resource-cards');
  const resources = subjectResources[currentSubject] || subjectResources.mathematics;
  container.innerHTML = resources.map(r => `
    <div class="resource-card">
      <div class="resource-icon">${r.icon}</div>
      <div class="resource-info">
        <div class="resource-title">${r.title}</div>
        <div class="resource-type">${r.type}</div>
      </div>
      <a href="${r.url}" class="btn btn-ghost btn-sm">View →</a>
    </div>
  `).join('');
}

// ── Clear Chat ──────────────────────────────────────────────
function clearChat() {
  document.getElementById('chat-messages').innerHTML = `
    <div class="chat-message">
      <div class="chat-avatar ai-avatar">🤖</div>
      <div class="chat-bubble ai-bubble">
        Chat cleared! I'm ready for your next question. What would you like to learn? 😊
      </div>
    </div>`;
  questionCount = 0;
  topicsSet.clear();
  document.getElementById('question-count').textContent = '0';
  document.getElementById('topic-count').textContent = '0';
  showToast('Chat cleared successfully', 'info', 2000);
}

// ── Voice Input (Demo) ──────────────────────────────────────
function toggleVoice() {
  showToast('Voice input coming soon! Type your question for now. 🎤', 'info', 3000);
}

// ── Initialize ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateQuickQuestions();
  updateResources();

  // Allow pressing Enter
  document.getElementById('chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});
