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
overviewModal.addEventListener('click', (event) => {
  if (event.target === overviewModal) closeOverview();
});

// Slide 4 context generator
const contexts = [
  {
    title: 'A first-time visitor is using a phone in a parking lot.',
    detail: 'They need the address, hours, and whether walk-ins are accepted.'
  },
  {
    title: 'A returning customer has low vision and uses browser zoom.',
    detail: 'They need to compare service packages without losing track of prices and details.'
  },
  {
    title: 'A parent is checking a school site while cooking dinner.',
    detail: 'They need a deadline, a contact number, and a form link before they forget.'
  },
  {
    title: 'A student is using a slow connection on an older phone.',
    detail: 'They need the page to load quickly and show the most important information first.'
  },
  {
    title: 'A screen reader user is trying to complete a contact form.',
    detail: 'They need clear labels, helpful errors, and a predictable form order.'
  }
];
let contextIndex = 0;
const contextTitle = document.querySelector('#contextTitle');
const contextDetail = document.querySelector('#contextDetail');
document.querySelector('#newContextBtn')?.addEventListener('click', () => {
  contextIndex = (contextIndex + 1) % contexts.length;
  contextTitle.textContent = contexts[contextIndex].title;
  contextDetail.textContent = contexts[contextIndex].detail;
});

// Slide 6 brainstorming selector
const brainstormIdeas = [
  ['Parent quiz', 'A short guided quiz that suggests tutoring options.'],
  ['Subject pages', 'Dedicated pages for math, English, test prep, and college prep.'],
  ['Tutor bios', 'Profiles that show experience, subjects, and teaching style.'],
  ['Instant consultation form', 'A short form with grade, subject, and preferred time.'],
  ['Success stories', 'Short case studies with before/after student outcomes.'],
  ['Full learning app', 'A complex student dashboard and lesson tracking system.'],
  ['FAQ page', 'Answers common parent questions before they call.'],
  ['Pricing comparison', 'A simple table that explains packages clearly.'],
  ['Animated homepage intro', 'A polished visual feature that may not solve the main parent task.']
];
const strongPrototypeIdeas = new Set(['Parent quiz', 'Subject pages', 'Instant consultation form', 'Pricing comparison']);
const brainstormGrid = document.querySelector('#brainstormGrid');
const brainstormCount = document.querySelector('#brainstormCount');
const brainstormResult = document.querySelector('#brainstormResult');
let selectedIdeas = new Set();

brainstormIdeas.forEach(([name, note]) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'feature-card brainstorm-card';
  button.innerHTML = `<strong>${name}</strong><span>${note}</span>`;
  button.addEventListener('click', () => {
    if (selectedIdeas.has(name)) selectedIdeas.delete(name);
    else selectedIdeas.add(name);
    updateBrainstorm();
  });
  brainstormGrid.appendChild(button);
});

function updateBrainstorm() {
  const buttons = Array.from(brainstormGrid.querySelectorAll('button'));
  buttons.forEach(btn => {
    const name = btn.querySelector('strong').textContent;
    btn.classList.toggle('selected', selectedIdeas.has(name));
  });
  brainstormCount.textContent = `${selectedIdeas.size} idea${selectedIdeas.size === 1 ? '' : 's'} selected`;
  if (selectedIdeas.size === 0) {
    brainstormResult.textContent = 'Select ideas that could be explored as prototypes.';
    return;
  }
  const strongCount = Array.from(selectedIdeas).filter(item => strongPrototypeIdeas.has(item)).length;
  if (strongCount >= 3) {
    brainstormResult.textContent = 'This set has strong prototype potential: it connects to parent goals and can be tested early.';
  } else if (strongCount >= 1) {
    brainstormResult.textContent = 'Some ideas are useful, but ask: which ones solve the parent’s most important decision?';
  } else {
    brainstormResult.textContent = 'These may be nice additions, but the first prototype should focus on the core user goal.';
  }
}
document.querySelector('#resetBrainstormBtn')?.addEventListener('click', () => {
  selectedIdeas.clear();
  updateBrainstorm();
});
updateBrainstorm();

// Slide 8 research methods selector
const methodData = {
  survey: {
    title: 'Survey',
    description: 'Useful for broad patterns, demographics, preferences, and common questions from many people.',
    questions: ['What do many users report?', 'Which features are most requested?', 'What themes repeat across responses?']
  },
  interview: {
    title: 'Interview',
    description: 'Useful for detailed stories, motivations, goals, frustrations, and task walkthroughs.',
    questions: ['Why does this matter to the user?', 'What is their current process?', 'Where do they hesitate or struggle?']
  },
  focus: {
    title: 'Focus Group',
    description: 'Useful for hearing multiple perspectives at once and watching people respond to each other’s ideas.',
    questions: ['What concerns do people share?', 'Which topics create agreement or disagreement?', 'What language do users use?']
  },
  field: {
    title: 'Field Study',
    description: 'Useful for observing real behavior in the user’s normal setting instead of relying only on what people say.',
    questions: ['What do users actually do?', 'What context affects the task?', 'What workarounds or obstacles appear?']
  },
  analytics: {
    title: 'Analytics',
    description: 'Useful for seeing traffic patterns, popular pages, exits, search terms, and repeated behavior at scale.',
    questions: ['Where do users enter?', 'Where do they leave?', 'Which paths or pages matter most?']
  },
  test: {
    title: 'Usability Test',
    description: 'Useful for watching representative users attempt specific tasks with a design, wireframe, or prototype.',
    questions: ['Can users complete the task?', 'Where do they get confused?', 'What should be revised next?']
  }
};
const methodCards = Array.from(document.querySelectorAll('[data-method]'));
const methodOutput = document.querySelector('#methodOutput');
function renderMethod(method) {
  const data = methodData[method];
  methodOutput.innerHTML = `<h3>${data.title}</h3><p>${data.description}</p><ul>${data.questions.map(q => `<li>${q}</li>`).join('')}</ul>`;
  methodCards.forEach(card => card.classList.toggle('active', card.dataset.method === method));
}
methodCards.forEach(card => card.addEventListener('click', () => renderMethod(card.dataset.method)));
renderMethod('survey');

// Slide 11 persona builder
const personaForm = document.querySelector('#personaForm');
const personaPreview = document.querySelector('#personaPreview');
const personaStorageKey = 'wst157-ch2-persona-draft';
const personaExample = {
  name: 'Maria Chen',
  role: 'Parent comparing tutoring programs',
  ageRange: 'Adult (25-44)',
  expertise: 'Intermediate',
  device: 'Phone',
  accessNeeds: ['Low bandwidth', 'Zoom or larger text'],
  context: 'Usually checks sites on a phone after work while commuting or waiting to pick up her child.',
  goal: 'Find the right algebra tutoring option and request a consultation quickly.',
  secondaryTask: 'Compare schedule options and pricing before submitting the form.',
  barriers: 'Long pages, unclear labels, and forms that ask for too much information up front.',
  successSignal: 'Can request a consultation in under 2 minutes and sees a clear confirmation.',
  implications: 'Put services, pricing range, and request actions near the top with clear labels and short forms.',
  quote: 'I need to compare options fast and know I picked the right one.'
};

function personaVal(name) {
  const value = personaForm?.elements[name]?.value.trim();
  return value || '—';
}

function personaList(name) {
  if (!personaForm) return '—';
  const values = Array.from(personaForm.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value);
  return values.length ? values.join(', ') : '—';
}

function getPersonaFormData() {
  if (!personaForm) return {};
  return {
    name: personaForm.elements.name?.value || '',
    role: personaForm.elements.role?.value || '',
    ageRange: personaForm.elements.ageRange?.value || '',
    expertise: personaForm.elements.expertise?.value || '',
    device: personaForm.elements.device?.value || '',
    accessNeeds: Array.from(personaForm.querySelectorAll('input[name="accessNeeds"]:checked')).map(input => input.value),
    context: personaForm.elements.context?.value || '',
    goal: personaForm.elements.goal?.value || '',
    secondaryTask: personaForm.elements.secondaryTask?.value || '',
    barriers: personaForm.elements.barriers?.value || '',
    successSignal: personaForm.elements.successSignal?.value || '',
    implications: personaForm.elements.implications?.value || '',
    quote: personaForm.elements.quote?.value || ''
  };
}

function applyPersonaFormData(data = {}) {
  if (!personaForm) return;

  ['name', 'role', 'ageRange', 'expertise', 'device', 'context', 'goal', 'secondaryTask', 'barriers', 'successSignal', 'implications', 'quote'].forEach(field => {
    if (personaForm.elements[field]) {
      personaForm.elements[field].value = data[field] || '';
    }
  });

  const selectedNeeds = Array.isArray(data.accessNeeds) ? data.accessNeeds : [];
  personaForm.querySelectorAll('input[name="accessNeeds"]').forEach(input => {
    input.checked = selectedNeeds.includes(input.value);
  });
}

function updatePersonaPreview() {
  if (!personaForm || !personaPreview) return;
  const output = `QUICK PERSONA\n\nName\n${personaVal('name')}\n\nRole / Audience\n${personaVal('role')}\n\nAge Range\n${personaVal('ageRange')}\n\nWeb Confidence\n${personaVal('expertise')}\n\nPrimary Device\n${personaVal('device')}\n\nAccess Needs / Constraints\n${personaList('accessNeeds')}\n\nContext\n${personaVal('context')}\n\nPrimary Goal\n${personaVal('goal')}\n\nSecondary Task\n${personaVal('secondaryTask')}\n\nFrustrations or Barriers\n${personaVal('barriers')}\n\nSuccess Looks Like\n${personaVal('successSignal')}\n\nDesign Implications\n${personaVal('implications')}\n\nQuote\n${personaVal('quote')}`;
  personaPreview.textContent = output;
  localStorage.setItem(personaStorageKey, JSON.stringify(getPersonaFormData()));
}

if (personaForm) {
  const saved = localStorage.getItem(personaStorageKey);
  if (saved) {
    try {
      applyPersonaFormData(JSON.parse(saved));
    } catch { }
  }

  personaForm.addEventListener('input', updatePersonaPreview);
  personaForm.addEventListener('change', updatePersonaPreview);
  updatePersonaPreview();
}

document.querySelector('#loadPersonaExampleBtn')?.addEventListener('click', () => {
  applyPersonaFormData(personaExample);
  updatePersonaPreview();
});

document.querySelector('#clearPersonaBtn')?.addEventListener('click', () => {
  if (!personaForm) return;
  personaForm.reset();
  localStorage.removeItem(personaStorageKey);
  updatePersonaPreview();
});

document.querySelector('#copyPersonaBtn')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(personaPreview.textContent);
    document.querySelector('#copyPersonaBtn').textContent = 'Copied';
    setTimeout(() => document.querySelector('#copyPersonaBtn').textContent = 'Copy', 1200);
  } catch {
    alert('Copy failed. Select the preview text and copy manually.');
  }
});
document.querySelector('#downloadPersonaBtn')?.addEventListener('click', () => {
  const blob = new Blob([personaPreview.textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const name = personaVal('name').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'persona';
  a.href = url;
  a.download = `${name}-persona.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// Slide 12 scenario generator
const scenarios = [
  {
    title: 'A parent visits a tutoring center website after work.',
    task: 'They need to know if help is available for 9th grade algebra and how to request a consultation.'
  },
  {
    title: 'A car owner visits a mobile detailing website during lunch.',
    task: 'They need to compare packages and find out if their neighborhood is in the service area.'
  },
  {
    title: 'A prospective student visits a design program page on a phone.',
    task: 'They need to understand program length, software used, and how to ask an admissions question.'
  },
  {
    title: 'A donor visits a nonprofit website after seeing a social post.',
    task: 'They need to understand the mission, see proof of impact, and choose a donation amount.'
  },
  {
    title: 'A hiring manager opens a portfolio site between meetings.',
    task: 'They need to see the strongest work quickly and find contact information without hunting.'
  }
];
let scenarioIndex = 0;
const scenarioStarter = document.querySelector('#scenarioStarter');
const scenarioTask = document.querySelector('#scenarioTask');
document.querySelector('#newScenarioBtn')?.addEventListener('click', () => {
  scenarioIndex = (scenarioIndex + 1) % scenarios.length;
  scenarioStarter.textContent = scenarios[scenarioIndex].title;
  scenarioTask.textContent = scenarios[scenarioIndex].task;
});

// Slide 15 quiz
const quiz = [
  {
    question: 'Which method is best for seeing what users actually do?',
    options: ['Field study', 'Color palette review', 'Logo brainstorm', 'Font pairing'],
    answer: 0,
    feedback: 'A field study observes users in context, which can reveal behavior that surveys may miss.'
  },
  {
    question: 'What is the main purpose of a persona?',
    options: ['To invent a random character', 'To represent user goals and contexts during design decisions', 'To replace testing', 'To choose brand colors'],
    answer: 1,
    feedback: 'Personas keep user goals, motivations, limits, and contexts visible while design decisions are made.'
  },
  {
    question: 'Why test a wireframe before coding?',
    options: ['Because sketches are harder to change than websites', 'Because visual design should never matter', 'Because early changes are cheaper and confusion can be found sooner', 'Because users only care about wireframes'],
    answer: 2,
    feedback: 'Wireframes and prototypes make it easier to find problems before the project becomes expensive to change.'
  },
  {
    question: 'Which one is a goal rather than a task?',
    options: ['Click the submit button', 'Open the menu', 'Compare plans and choose the right service', 'Type a phone number'],
    answer: 2,
    feedback: 'A goal describes what the user is trying to accomplish. Tasks are the steps used to get there.'
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
