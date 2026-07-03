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

function openOverview() {
  overviewModal.setAttribute('aria-hidden', 'false');
}
function closeOverview() {
  overviewModal.setAttribute('aria-hidden', 'true');
}
overviewBtn.addEventListener('click', openOverview);
closeOverviewBtn.addEventListener('click', closeOverview);
overviewModal.addEventListener('click', (event) => {
  if (event.target === overviewModal) closeOverview();
});

// Slide 4 client generator
const scenarios = [
  {
    title: 'A neighborhood bakery wants a new website.',
    details: 'They sell walk-in pastries, custom cakes, and holiday boxes.'
  },
  {
    title: 'A mobile car wash wants to get more bookings.',
    details: 'Customers need pricing, trust signals, service area details, and a fast way to request an appointment.'
  },
  {
    title: 'A tutoring center wants to attract new families.',
    details: 'Parents need subjects offered, grade levels, results, pricing clues, and contact options.'
  },
  {
    title: 'A student designer needs a portfolio site.',
    details: 'Visitors need to understand the designer’s style, skills, strongest work, and contact path.'
  },
  {
    title: 'A local nonprofit wants volunteers and donations.',
    details: 'Visitors need to trust the mission, see impact, choose a way to help, and act quickly.'
  }
];
let scenarioIndex = 0;
const scenarioTitle = document.querySelector('#clientScenario');
const scenarioDetails = document.querySelector('#clientDetails');
document.querySelector('#newClientBtn')?.addEventListener('click', () => {
  scenarioIndex = (scenarioIndex + 1) % scenarios.length;
  scenarioTitle.textContent = scenarios[scenarioIndex].title;
  scenarioDetails.textContent = scenarios[scenarioIndex].details;
});

// Slide 6 priority picker
const priorityScenarios = [
  {
    chip: 'Fitness studio',
    prompt: 'Scenario: A small fitness studio wants a new site. Choose the three features that matter most for launch.',
    features: [
      ['Instructor bios', 'Builds trust, but may be secondary'],
      ['Class schedule', 'Core path to joining a class'],
      ['Merch store', 'Useful later, heavy for launch'],
      ['Nutrition blog', 'Good content idea, not launch-critical'],
      ['Book a trial class', 'Strong conversion action'],
      ['Instagram feed', 'Nice support content, not a strategy by itself'],
      ['Testimonials', 'Trust signal for new visitors'],
      ['Membership pricing', 'Supports decision-making'],
      ['Members-only portal', 'Potentially complex first-version feature']
    ],
    recommended: ['Class schedule', 'Membership pricing', 'Book a trial class'],
    successText: 'Strong first version: visitors can understand the offer, compare cost, and take action.'
  },
  {
    chip: 'Food truck',
    prompt: 'Scenario: A local food truck wants a launch site. Pick the three priorities that help people decide quickly.',
    features: [
      ['Founder story', 'Useful background, usually not first-click info'],
      ['Today\'s location + hours', 'Essential if the truck moves often'],
      ['Photo gallery', 'Can support trust and appetite appeal'],
      ['Newsletter signup', 'Valuable later, not always launch-critical'],
      ['Order or pre-order link', 'High-value action for busy customers'],
      ['Merch shop', 'Extra complexity with lower launch impact'],
      ['Catering inquiry form', 'Useful if catering is a key revenue path'],
      ['Menu + prices', 'People check options and budget first'],
      ['TikTok feed embed', 'Can distract from core decision flow']
    ],
    recommended: ['Menu + prices', 'Today\'s location + hours', 'Order or pre-order link'],
    successText: 'Strong first version: customers can see what you sell, where to find you, and how to order fast.'
  },
  {
    chip: 'Tutoring center',
    prompt: 'Scenario: A tutoring center wants a new site. Choose the three launch priorities that help families trust and contact.',
    features: [
      ['Student blog', 'Good for ongoing content, not launch-essential'],
      ['Subjects + grade levels', 'Core service clarity for families'],
      ['Parent testimonials', 'Strong trust signal for new visitors'],
      ['Learning resources library', 'Useful but can grow after launch'],
      ['Request consultation form', 'Direct conversion path'],
      ['Online payment portal', 'Can be phase-two if intake is manual'],
      ['Campus photo tour', 'Helpful context, usually secondary'],
      ['Tutor qualifications', 'Builds confidence in quality'],
      ['Weekly newsletter archive', 'Low impact on first contact decision']
    ],
    recommended: ['Subjects + grade levels', 'Tutor qualifications', 'Request consultation form'],
    successText: 'Strong first version: families can quickly see fit, trust expertise, and take the next step.'
  }
];
const featureGrid = document.querySelector('#featureGrid');
const choiceCount = document.querySelector('#choiceCount');
const priorityResult = document.querySelector('#priorityResult');
const priorityScenarioText = document.querySelector('#priorityScenario');
const priorityScenarioSwitcher = document.querySelector('#priorityScenarioSwitcher');
let selectedFeatures = new Set();
let priorityScenarioIndex = 0;

function shuffleFeatures(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function renderPriorityFeatures() {
  const scenario = priorityScenarios[priorityScenarioIndex];
  const randomizedFeatures = shuffleFeatures(scenario.features);
  if (priorityScenarioText) priorityScenarioText.textContent = scenario.prompt;
  featureGrid.innerHTML = '';
  randomizedFeatures.forEach(([name, note]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'feature-card';
    button.innerHTML = `<strong>${name}</strong><span>${note}</span>`;
    button.addEventListener('click', () => {
      if (selectedFeatures.has(name)) selectedFeatures.delete(name);
      else if (selectedFeatures.size < 3) selectedFeatures.add(name);
      updateFeatures();
    });
    featureGrid.appendChild(button);
  });
}

function renderPriorityScenarios() {
  if (!priorityScenarioSwitcher) return;
  priorityScenarioSwitcher.innerHTML = '';
  priorityScenarios.forEach((scenario, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'scenario-chip';
    button.textContent = scenario.chip;
    button.classList.toggle('active', index === priorityScenarioIndex);
    button.addEventListener('click', () => {
      priorityScenarioIndex = index;
      selectedFeatures.clear();
      renderPriorityScenarios();
      renderPriorityFeatures();
      updateFeatures();
    });
    priorityScenarioSwitcher.appendChild(button);
  });
}

function updateFeatures() {
  const scenario = priorityScenarios[priorityScenarioIndex];
  const recommended = new Set(scenario.recommended);
  const buttons = Array.from(featureGrid.querySelectorAll('button'));
  buttons.forEach(btn => {
    const name = btn.querySelector('strong').textContent;
    btn.classList.toggle('selected', selectedFeatures.has(name));
  });
  choiceCount.textContent = `${selectedFeatures.size} / 3 selected`;
  if (selectedFeatures.size < 3) {
    priorityResult.textContent = 'Choose three launch priorities.';
    return;
  }
  const selected = Array.from(selectedFeatures);
  const recommendedCount = selected.filter(item => recommended.has(item)).length;
  if (recommendedCount === 3) {
    priorityResult.textContent = scenario.successText;
  } else if (recommendedCount === 2) {
    priorityResult.textContent = 'Mostly focused: two core needs are covered. The third choice may need a strategy reason.';
  } else {
    priorityResult.textContent = 'This could become unfocused. What user problem does each selected feature solve?';
  }
}
document.querySelector('#resetChoicesBtn')?.addEventListener('click', () => {
  selectedFeatures.clear();
  updateFeatures();
});
renderPriorityScenarios();
renderPriorityFeatures();
updateFeatures();

// Slide 7 scope slider
const scopeText = [
  [
    'Too narrow',
    'Fast to build, but core visitor questions may stay unanswered.',
    'Example: homepage + short about section + single contact email link only.'
  ],
  [
    'Lean launch',
    'A focused starter version with one clear user path.',
    'Example: services summary, basic pricing, contact form, and hours/location.'
  ],
  [
    'Balanced first version',
    'Enough features to be useful, not so many that the project loses focus.',
    'Example: class schedule, membership pricing, trial booking, testimonials, contact form.'
  ],
  [
    'Ambitious',
    'Valuable extras are included, but content and QA effort rise quickly.',
    'Example: balanced set plus blog, instructor profiles, events calendar, and FAQ library.'
  ],
  [
    'Scope creep risk',
    'Too many parallel priorities can delay launch and reduce quality.',
    'Example: ambitious set plus member portal, merch store, mobile app, and advanced integrations.'
  ]
];
const scopeSlider = document.querySelector('#scopeSlider');
const scopeOutput = document.querySelector('#scopeOutput');
scopeSlider?.addEventListener('input', () => {
  const [title, detail, examples] = scopeText[Number(scopeSlider.value) - 1];
  scopeOutput.innerHTML = `<strong>${title}</strong><span>${detail}</span><span class="scope-examples">${examples}</span>`;
});

// Slide 8 site type selector
const typeData = {
  business: {
    title: 'Business / Service site',
    description: 'The site usually needs to explain the offer, build trust, and create a clear contact or booking path.',
    questions: ['What service is offered?', 'What makes the business trustworthy?', 'What action should visitors take?']
  },
  portfolio: {
    title: 'Portfolio site',
    description: 'The site needs to show strong work quickly and make the creator easy to understand and contact.',
    questions: ['What work should be featured first?', 'What skills should be obvious?', 'Who is the ideal viewer?']
  },
  store: {
    title: 'Online store',
    description: 'The site needs to support browsing, product comparison, trust, checkout, and post-purchase confidence.',
    questions: ['What makes products easy to compare?', 'What builds purchase confidence?', 'What could block checkout?']
  },
  education: {
    title: 'Education site',
    description: 'The site needs to organize information clearly for students, families, staff, or learners.',
    questions: ['Who is looking for information?', 'What deadlines or requirements matter?', 'What needs to be easy to find?']
  },
  news: {
    title: 'News / Media site',
    description: 'The site needs strong hierarchy, freshness, navigation, and readable content patterns.',
    questions: ['What is the top story?', 'How are topics organized?', 'How does the site support continued reading?']
  },
  nonprofit: {
    title: 'Nonprofit site',
    description: 'The site needs to explain the mission, show impact, and guide people toward support or participation.',
    questions: ['What problem does the organization address?', 'How is impact proven?', 'How can people help?']
  }
};
const typeCards = Array.from(document.querySelectorAll('.type-card'));
const typeOutput = document.querySelector('#typeOutput');
function renderType(type) {
  const data = typeData[type];
  typeOutput.innerHTML = `<h3>${data.title}</h3><p>${data.description}</p><ul>${data.questions.map(q => `<li>${q}</li>`).join('')}</ul>`;
  typeCards.forEach(card => card.classList.toggle('active', card.dataset.type === type));
}
typeCards.forEach(card => card.addEventListener('click', () => renderType(card.dataset.type)));
renderType('business');

// Slide 13 charter builder
const form = document.querySelector('#charterForm');
const preview = document.querySelector('#charterPreview');
function val(name) {
  const value = form?.elements[name]?.value.trim();
  return value || '—';
}
function updateCharterPreview() {
  if (!form || !preview) return;
  const output = `PROJECT CHARTER\n\nProject / Client\n${val('project')}\n\nPurpose\n${val('purpose')}\n\nGoals\n${val('goals')}\n\nTarget Audience\n${val('audience')}\n\nSuccess Indicators\n${val('success')}\n\nStrategies\n${val('strategies')}\n\nTactics\n${val('tactics')}`;
  preview.textContent = output;
  localStorage.setItem('wst157-charter-draft', JSON.stringify(Object.fromEntries(new FormData(form).entries())));
}
if (form) {
  const saved = localStorage.getItem('wst157-charter-draft');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      Object.keys(data).forEach(key => {
        if (form.elements[key]) form.elements[key].value = data[key];
      });
    } catch { }
  }
  form.addEventListener('input', updateCharterPreview);
  updateCharterPreview();
}
document.querySelector('#copyCharterBtn')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(preview.textContent);
    document.querySelector('#copyCharterBtn').textContent = 'Copied';
    setTimeout(() => document.querySelector('#copyCharterBtn').textContent = 'Copy', 1200);
  } catch {
    alert('Copy failed. Select the preview text and copy manually.');
  }
});
document.querySelector('#downloadCharterBtn')?.addEventListener('click', () => {
  const blob = new Blob([preview.textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const project = val('project').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'project-charter';
  a.href = url;
  a.download = `${project}-charter.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// Slide 14 quiz
const quiz = [
  {
    question: 'Which one is a tactic?',
    options: ['Make booking feel simple', 'Add a booking button', 'Increase appointment requests', 'Busy local car owners'],
    answer: 1,
    feedback: 'A tactic is a specific feature or action. “Add a booking button” is tangible.'
  },
  {
    question: 'Which one best describes purpose?',
    options: ['The reason the site should exist', 'The color palette', 'A single page layout', 'A list of file names'],
    answer: 0,
    feedback: 'Purpose explains why the site exists before the team decides how it looks.'
  },
  {
    question: 'Why prioritize features?',
    options: ['To make the website less useful', 'To avoid making design decisions', 'To focus resources on the most important user and business needs', 'To skip research'],
    answer: 2,
    feedback: 'Prioritizing helps the team focus limited time and energy on what matters most.'
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
