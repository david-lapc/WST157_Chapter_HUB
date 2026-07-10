const slides = Array.from(document.querySelectorAll('.slide'));
let current = 0;
const slideList = document.querySelector('#slideList');
const overviewGrid = document.querySelector('#overviewGrid');
const status = document.querySelector('#slideStatus');
const nextBtn = document.querySelector('#nextBtn');
const prevBtn = document.querySelector('#prevBtn');
const nextTopBtn = document.querySelector('#nextTopBtn');
const presentBtn = document.querySelector('#presentBtn');
const overviewBtn = document.querySelector('#overviewBtn');
const overviewModal = document.querySelector('#overviewModal');
const closeOverviewBtn = document.querySelector('#closeOverviewBtn');

function makeSlideButton(slide, index, compact = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.index = index;
  button.innerHTML = compact
    ? `<strong>${String(index + 1).padStart(2, '0')}. ${slide.dataset.title}</strong><span>${slide.dataset.section}</span>`
    : `<span class="num">${index + 1}</span><span><span class="name">${slide.dataset.title}</span><span class="section">${slide.dataset.section}</span></span>`;
  button.addEventListener('click', () => goTo(index));
  return button;
}

slides.forEach((slide, index) => {
  const li = document.createElement('li');
  li.appendChild(makeSlideButton(slide, index));
  slideList.appendChild(li);
  overviewGrid.appendChild(makeSlideButton(slide, index, true));
});
const navButtons = Array.from(slideList.querySelectorAll('button'));

function goTo(index) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides[current].scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateState();
  closeOverview();
}

function updateState() {
  status.textContent = `${current + 1} / ${slides.length}`;
  navButtons.forEach((btn, index) => btn.classList.toggle('active', index === current));
  prevBtn.disabled = current === 0;
  nextBtn.textContent = current === slides.length - 1 ? 'Start over' : 'Next';
  nextTopBtn.textContent = current === slides.length - 1 ? 'Start over' : 'Next';
}

function nextSlide() {
  if (current === slides.length - 1) goTo(0);
  else goTo(current + 1);
}
function prevSlide() { goTo(current - 1); }

nextBtn.addEventListener('click', nextSlide);
nextTopBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

document.addEventListener('keydown', (event) => {
  const activeTag = document.activeElement?.tagName?.toLowerCase();
  const isTyping = activeTag === 'input' || activeTag === 'textarea';
  if (isTyping) return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
    event.preventDefault();
    nextSlide();
  }
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
    event.preventDefault();
    prevSlide();
  }
  if (event.key.toLowerCase() === 'f') togglePresent();
  if (event.key === 'Escape') closeOverview();
});

function togglePresent() {
  const active = document.body.classList.toggle('presenting');
  presentBtn.setAttribute('aria-pressed', String(active));
  presentBtn.textContent = active ? 'Exit Present' : 'Present';
}
presentBtn.addEventListener('click', togglePresent);

function openOverview() { overviewModal.setAttribute('aria-hidden', 'false'); }
function closeOverview() { overviewModal.setAttribute('aria-hidden', 'true'); }
overviewBtn.addEventListener('click', openOverview);
closeOverviewBtn.addEventListener('click', closeOverview);
overviewModal.addEventListener('click', (event) => { if (event.target === overviewModal) closeOverview(); });

// Slide 4: role matching
const roleSituations = [
  {
    title: 'The client wants to add a members-only portal two weeks before launch.',
    details: 'The feature was not in the original charter or timeline.',
    answer: 'Project lead',
    feedback: 'The project lead should guide the scope decision and connect it back to goals, budget, and timeline.'
  },
  {
    title: 'The site needs a consistent voice for all service descriptions.',
    details: 'The pages are accurate, but each one sounds like a different person wrote it.',
    answer: 'Production / editor',
    feedback: 'The editor or production lead protects tone, consistency, proofreading, and content quality.'
  },
  {
    title: 'A form will collect personal information from visitors.',
    details: 'The team needs to decide how the data is stored and protected.',
    answer: 'Technology lead',
    feedback: 'The technology lead should evaluate data handling, security, hosting, and technical risk.'
  },
  {
    title: 'Test users cannot find the main appointment path.',
    details: 'The design looks nice, but the task is failing.',
    answer: 'UX lead',
    feedback: 'The UX lead should investigate user behavior and improve the experience with the team.'
  },
  {
    title: 'The homepage design feels inconsistent with the brand.',
    details: 'The layout works, but the visual direction does not feel right.',
    answer: 'Design lead',
    feedback: 'The design lead owns visual direction, layout systems, typography, and overall look and feel.'
  },
  {
    title: 'The final version needs approval before launch.',
    details: 'The team needs a clear yes/no decision from the person funding the project.',
    answer: 'Project sponsor',
    feedback: 'The sponsor has authority to approve the final outcome and provide resources.'
  }
];
const roleChoices = ['Project sponsor', 'Project lead', 'UX lead', 'Design lead', 'Technology lead', 'Production / editor'];
let roleIndex = 0;
const roleSituation = document.querySelector('#roleSituation');
const roleDetails = document.querySelector('#roleDetails');
const roleChoiceGrid = document.querySelector('#roleChoiceGrid');
const roleResult = document.querySelector('#roleResult');
function renderRoleSituation() {
  const item = roleSituations[roleIndex];
  roleSituation.textContent = item.title;
  roleDetails.textContent = item.details;
  roleResult.textContent = 'Choose the role that should lead the decision.';
  roleChoiceGrid.innerHTML = '';
  roleChoices.forEach(choice => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'type-card';
    button.textContent = choice;
    button.addEventListener('click', () => {
      Array.from(roleChoiceGrid.children).forEach(btn => {
        btn.disabled = true;
        btn.classList.toggle('correct-choice', btn.textContent === item.answer);
        btn.classList.toggle('incorrect-choice', btn.textContent === choice && choice !== item.answer);
      });
      roleResult.textContent = item.feedback;
    });
    roleChoiceGrid.appendChild(button);
  });
}
document.querySelector('#newRoleBtn')?.addEventListener('click', () => {
  roleIndex = (roleIndex + 1) % roleSituations.length;
  renderRoleSituation();
});
renderRoleSituation();

// Slide 6: project plan checklist
const planItems = [
  ['Project overview', true, 'The elevator-pitch version of what the site will provide and why it matters.'],
  ['Success metrics', true, 'What will be measured before and after launch.'],
  ['Project scope', true, 'What is included, what is not included, and what counts as launch-ready.'],
  ['Roles and responsibilities', true, 'Who owns decisions, work, approvals, and maintenance.'],
  ['Budget and timeline', true, 'People, tools, hosting, content, QA, contingency, and schedule.'],
  ['Accessibility plan', true, 'Accessibility should be included throughout the process, not patched on at the end.'],
  ['Security / support plan', true, 'Interactive sites and data need technical care after launch.'],
  ['Maintenance plan', true, 'Sites age immediately; content and links need ownership.'],
  ['Final color palette only', false, 'Useful later, but not enough to define an implementation plan.'],
  ['Favorite websites list only', false, 'References can help, but the plan needs decisions and responsibilities.'],
  ['A folder of stock photos', false, 'Assets matter, but they are not the process plan.']
];
const planGrid = document.querySelector('#planGrid');
const planCount = document.querySelector('#planCount');
const planResult = document.querySelector('#planResult');
let selectedPlan = new Set();
planItems.forEach(([name, correct, note]) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'feature-card';
  button.dataset.correct = correct;
  button.innerHTML = `<strong>${name}</strong><span>${note}</span>`;
  button.addEventListener('click', () => {
    if (selectedPlan.has(name)) selectedPlan.delete(name);
    else selectedPlan.add(name);
    updatePlan();
  });
  planGrid.appendChild(button);
});
function updatePlan() {
  const buttons = Array.from(planGrid.querySelectorAll('button'));
  buttons.forEach(btn => btn.classList.toggle('selected', selectedPlan.has(btn.querySelector('strong').textContent)));
  const correctSelected = planItems.filter(([name, correct]) => correct && selectedPlan.has(name)).length;
  const wrongSelected = planItems.filter(([name, correct]) => !correct && selectedPlan.has(name)).length;
  planCount.textContent = `${correctSelected} / 8 selected`;
  if (correctSelected === 8 && wrongSelected === 0) {
    planResult.textContent = 'Strong plan: it covers purpose, measurements, scope, roles, resources, accessibility, support, and maintenance.';
  } else if (wrongSelected > 0) {
    planResult.textContent = 'Some selected items may be useful references, but they do not replace core project planning decisions.';
  } else {
    planResult.textContent = 'Keep going. A useful implementation plan makes hidden responsibilities visible.';
  }
}
document.querySelector('#resetPlanBtn')?.addEventListener('click', () => { selectedPlan.clear(); updatePlan(); });
updatePlan();

// Slide 7: scope builder
const scopeForm = document.querySelector('#scopeForm');
const scopePreview = document.querySelector('#scopePreview');
const fillScopeExampleBtn = document.querySelector('#fillScopeExampleBtn');
const scopeExampleLabel = document.querySelector('#scopeExampleLabel');
const scopeExamples = [
  {
    project: 'Campus Night Market',
    is: 'A promotional website for a campus night market with event overview, vendor highlights, schedule, RSVP, FAQ, and location details.',
    isnot: 'A vendor payment platform, inventory tracker, mobile app, or live operations dashboard during the event.',
    must: 'Clear event date and time, location map, vendor lineup, schedule, RSVP form, and mobile-friendly navigation.',
    future: 'Interactive venue map, SMS reminders, digital ticketing, and a vendor portal for updating booth details.'
  },
  {
    project: 'Unused Digital Subscription Recovery Service',
    is: 'A website that helps users discover and manage unused digital subscriptions and credits, such as stock media plans, AI tool credits, and SaaS subscriptions.',
    isnot: 'A direct billing processor, bank account replacement, password manager, or full personal finance application.',
    must: 'Service overview, supported subscription categories, secure account connection explanation, plan comparison, signup flow, and privacy policy.',
    future: 'Automated renewal alerts, cancellation assistant, savings dashboard, provider API integrations, and team account management.'
  },
  {
    project: 'Neighborhood Health Clinic Website',
    is: 'An informational website for a local health clinic with services, doctor profiles, location details, office hours, and appointment requests.',
    isnot: 'A telemedicine platform, insurance-claim processor, emergency hotline replacement, or patient medical records system.',
    must: 'Services page, provider bios, contact details, new-patient instructions, appointment request form, and accessibility-first page structure.',
    future: 'Secure patient portal login, appointment reminders, multilingual content, online payments, and health resource library updates.'
  }
];
let scopeExampleIndex = -1;

function scopeVal(name) {
  const value = scopeForm?.elements[name]?.value.trim();
  return value || '—';
}
function applyScopeExample(index) {
  if (!scopeForm) return;
  const example = scopeExamples[index];
  if (!example) return;
  Object.entries(example).forEach(([key, value]) => {
    if (scopeForm.elements[key]) scopeForm.elements[key].value = value;
  });
  updateScopePreview();
  if (scopeExampleLabel) {
    scopeExampleLabel.textContent = `Loaded example ${index + 1} of ${scopeExamples.length}: ${example.project}`;
  }
}
function updateScopePreview() {
  if (!scopeForm || !scopePreview) return;
  const output = `SCOPE STATEMENT\n\nProject\n${scopeVal('project')}\n\nThe site is...\n${scopeVal('is')}\n\nThe site is not...\n${scopeVal('isnot')}\n\nLaunch must-haves\n${scopeVal('must')}\n\nFuture ideas\n${scopeVal('future')}`;
  scopePreview.textContent = output;
  localStorage.setItem('wst157-ch3-scope-draft', JSON.stringify(Object.fromEntries(new FormData(scopeForm).entries())));
}
if (scopeForm) {
  const saved = localStorage.getItem('wst157-ch3-scope-draft');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      Object.keys(data).forEach(key => { if (scopeForm.elements[key]) scopeForm.elements[key].value = data[key]; });
    } catch { }
  }
  scopeForm.addEventListener('input', updateScopePreview);
  updateScopePreview();
}
fillScopeExampleBtn?.addEventListener('click', () => {
  scopeExampleIndex = (scopeExampleIndex + 1) % scopeExamples.length;
  applyScopeExample(scopeExampleIndex);
});
document.querySelector('#copyScopeBtn')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(scopePreview.textContent);
    document.querySelector('#copyScopeBtn').textContent = 'Copied';
    setTimeout(() => document.querySelector('#copyScopeBtn').textContent = 'Copy', 1200);
  } catch {
    alert('Copy failed. Select the preview text and copy manually.');
  }
});
document.querySelector('#downloadScopeBtn')?.addEventListener('click', () => {
  const blob = new Blob([scopePreview.textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const project = scopeVal('project').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'project-scope';
  a.href = url;
  a.download = `${project}-scope-statement.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// Slide 8: process model selector
const modelData = {
  waterfall: {
    title: 'Waterfall',
    description: 'A more linear process: define requirements, design, build, test, launch. It can help with tracking and approvals, but late changes are costly.',
    questions: ['Are requirements stable?', 'Are approvals formal?', 'Will late changes be expensive?']
  },
  agile: {
    title: 'Agile',
    description: 'An iterative process: build in smaller chunks, review often, and adapt. It works best when collaboration and feedback are frequent.',
    questions: ['Can the work be split into useful pieces?', 'Can feedback happen often?', 'Can priorities change responsibly?']
  },
  hybrid: {
    title: 'Hybrid',
    description: 'A practical mix: define enough direction early, then build and improve in iterations. Many web projects use some version of this.',
    questions: ['What must be planned before build?', 'What can be tested and refined?', 'Where does flexibility help?']
  },
  lean: {
    title: 'Lean UX',
    description: 'A lightweight, learning-focused process: validate ideas early, prototype quickly, solve user problems, and measure real outcomes.',
    questions: ['What assumption should be tested first?', 'What is the smallest useful prototype?', 'What evidence shows value?']
  }
};
const modelCards = Array.from(document.querySelectorAll('.process-model-grid .type-card'));
const modelOutput = document.querySelector('#modelOutput');
function renderModel(model) {
  const data = modelData[model];
  modelOutput.innerHTML = `<h3>${data.title}</h3><p>${data.description}</p><ul>${data.questions.map(q => `<li>${q}</li>`).join('')}</ul>`;
  modelCards.forEach(card => card.classList.toggle('active', card.dataset.model === model));
}
modelCards.forEach(card => card.addEventListener('click', () => renderModel(card.dataset.model)));
renderModel('waterfall');

// Slide 9: development life cycle builder
const cycleStages = [
  ['Site definition and planning', 'Goals, scope, technology needs, resources, and approval path.'],
  ['Content inventory', 'Existing and needed content becomes visible.'],
  ['Information architecture', 'Content gets organized into pages, labels, and navigation.'],
  ['Site design', 'Templates, grids, visual direction, interactions, and prototypes.'],
  ['Site construction', 'Pages, code, CMS templates, navigation, and media are assembled.'],
  ['Site marketing', 'Launch communication and audience awareness.'],
  ['Tracking, evaluation, and maintenance', 'Analytics, fixes, updates, and long-term care.']
];
const cycleGrid = document.querySelector('#cycleGrid');
const cycleCount = document.querySelector('#cycleCount');
const cycleOutput = document.querySelector('#cycleOutput');
let selectedCycle = [];
cycleStages.forEach(([name, note]) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'feature-card';
  button.innerHTML = `<strong>${name}</strong><span>${note}</span>`;
  button.addEventListener('click', () => {
    if (!selectedCycle.includes(name)) selectedCycle.push(name);
    updateCycle();
  });
  cycleGrid.appendChild(button);
});
function updateCycle() {
  Array.from(cycleGrid.querySelectorAll('button')).forEach(btn => btn.classList.toggle('selected', selectedCycle.includes(btn.querySelector('strong').textContent)));
  cycleCount.textContent = `${selectedCycle.length} / 7 stages`;
  if (selectedCycle.length === 0) {
    cycleOutput.textContent = 'Choose the first stage.';
    return;
  }
  cycleOutput.innerHTML = selectedCycle.map((name, index) => `<span class="timeline-chip"><span>${index + 1}</span>${name}</span>`).join('');
  const expected = cycleStages.map(([name]) => name);
  if (selectedCycle.length === expected.length) {
    const isCorrect = selectedCycle.every((name, index) => name === expected[index]);
    const message = document.createElement('p');
    message.className = 'takeaway';
    message.textContent = isCorrect
      ? 'Strong sequence: building comes after planning, content, architecture, and design decisions mature.'
      : 'This order creates a useful debate. Which stages would suffer if page construction happened too early?';
    cycleOutput.appendChild(message);
  }
}
document.querySelector('#resetCycleBtn')?.addEventListener('click', () => { selectedCycle = []; updateCycle(); });
updateCycle();

// Slide 11 risk meter
const riskText = [
  ['Critical risk', 'The project is missing basic planning for access, safety, support, and long-term care.'],
  ['High risk', 'The project may look cheaper than it really is because important work is missing from the plan.'],
  ['Moderate risk', 'Some essentials are accounted for, but gaps could still appear late.'],
  ['Managed risk', 'The project has time and responsibility assigned for important hidden work.'],
  ['Strong planning', 'Accessibility, security, support, content, and maintenance are treated as part of the project from the start.']
];
const riskSlider = document.querySelector('#riskSlider');
const riskOutput = document.querySelector('#riskOutput');
riskSlider?.addEventListener('input', () => {
  const [title, detail] = riskText[Number(riskSlider.value) - 1];
  riskOutput.innerHTML = `<strong>${title}</strong><span>${detail}</span>`;
});

// Slide 13 mishap fixer
const mishaps = [
  {
    text: 'The team builds ten pages before anyone has approved the navigation.',
    hint: 'The problem is not effort. The problem is the order of work.',
    answer: 'Approve architecture first',
    feedback: 'A site diagram or navigation plan should be tested and approved before page construction expands.'
  },
  {
    text: 'The homepage is polished, but the client has not provided final service descriptions.',
    hint: 'The design is ahead of the content reality.',
    answer: 'Start content production early',
    feedback: 'Real content should appear in prototypes and page layouts as early as possible.'
  },
  {
    text: 'The site launches, then nobody knows who updates hours, photos, or outdated links.',
    hint: 'The project treated launch as the end.',
    answer: 'Assign maintenance ownership',
    feedback: 'Maintenance is part of the original plan, not a problem discovered after launch.'
  },
  {
    text: 'A new feature keeps getting bigger every week and the deadline stays the same.',
    hint: 'A flexible idea has become an unmanaged commitment.',
    answer: 'Use scope control',
    feedback: 'Use is/is not scope statements, priorities, and approval rules to protect the project.'
  },
  {
    text: 'Usability testing happens only after all pages are final.',
    hint: 'Feedback arrives too late to be useful.',
    answer: 'Test earlier with prototypes',
    feedback: 'Testing should happen while changes are still affordable.'
  }
];
const mishapChoices = ['Approve architecture first', 'Start content production early', 'Assign maintenance ownership', 'Use scope control', 'Test earlier with prototypes'];
let mishapIndex = 0;
const mishapText = document.querySelector('#mishapText');
const mishapHint = document.querySelector('#mishapHint');
const mishapChoiceGrid = document.querySelector('#mishapChoiceGrid');
const mishapResult = document.querySelector('#mishapResult');
function renderMishap() {
  const item = mishaps[mishapIndex];
  mishapText.textContent = item.text;
  mishapHint.textContent = item.hint;
  mishapResult.textContent = 'Choose the best fix.';
  mishapChoiceGrid.innerHTML = '';
  mishapChoices.forEach(choice => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'type-card';
    button.textContent = choice;
    button.addEventListener('click', () => {
      Array.from(mishapChoiceGrid.children).forEach(btn => {
        btn.disabled = true;
        btn.classList.toggle('correct-choice', btn.textContent === item.answer);
        btn.classList.toggle('incorrect-choice', btn.textContent === choice && choice !== item.answer);
      });
      mishapResult.textContent = item.feedback;
    });
    mishapChoiceGrid.appendChild(button);
  });
}
document.querySelector('#newMishapBtn')?.addEventListener('click', () => {
  mishapIndex = (mishapIndex + 1) % mishaps.length;
  renderMishap();
});
renderMishap();

// Slide 14 quiz
const quiz = [
  {
    question: 'What does the project implementation plan add to the charter?',
    options: ['Only colors and fonts', 'People, content, technology, scope, schedule, budget, testing, and maintenance', 'A list of favorite websites', 'A finished homepage'],
    answer: 1,
    feedback: 'The implementation plan translates the charter into practical decisions and responsibilities.'
  },
  {
    question: 'Why is real content important early in the process?',
    options: ['It makes every page longer', 'It replaces user research', 'It exposes real structure, writing, media, and maintenance needs', 'It removes the need for design'],
    answer: 2,
    feedback: 'Real content reveals what the site actually needs and prevents fake layouts from hiding problems.'
  },
  {
    question: 'Which stage should not be treated as the beginning of a well-planned project?',
    options: ['Site definition and planning', 'Content inventory', 'Site construction', 'Information architecture'],
    answer: 2,
    feedback: 'Construction should happen after major planning, content, architecture, and design decisions are mature enough.'
  },
  {
    question: 'What is one purpose of a maintenance plan?',
    options: ['To make launch unnecessary', 'To keep content, links, standards, and functionality healthy after launch', 'To avoid assigning responsibilities', 'To remove accessibility concerns'],
    answer: 1,
    feedback: 'A website keeps changing after launch, so maintenance needs ownership and time.'
  }
];
let quizIndex = 0;
const quizQuestion = document.querySelector('#quizQuestion');
const quizOptions = document.querySelector('#quizOptions');
const quizFeedback = document.querySelector('#quizFeedback');
function renderQuiz() {
  const q = quiz[quizIndex];
  quizQuestion.textContent = q.question;
  quizFeedback.textContent = '';
  quizOptions.innerHTML = '';
  q.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => {
      Array.from(quizOptions.children).forEach((btn, btnIndex) => {
        btn.disabled = true;
        btn.classList.toggle('correct', btnIndex === q.answer);
        btn.classList.toggle('incorrect', btnIndex === index && index !== q.answer);
      });
      quizFeedback.textContent = q.feedback;
    });
    quizOptions.appendChild(button);
  });
}
document.querySelector('#nextQuizBtn')?.addEventListener('click', () => {
  quizIndex = (quizIndex + 1) % quiz.length;
  renderQuiz();
});
renderQuiz();

// Track slide position when scrolling manually on mobile
const observer = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const index = slides.indexOf(visible.target);
  if (index !== -1 && index !== current) {
    current = index;
    updateState();
  }
}, { threshold: [0.55] });
slides.forEach(slide => observer.observe(slide));

updateState();
