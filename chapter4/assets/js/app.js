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

function nextSlide() { current === slides.length - 1 ? goTo(0) : goTo(current + 1); }
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

// Slide 5: content inventory action
const inventoryItems = [
  {
    title: 'Old homepage welcome paragraph',
    details: 'Long, generic, and not connected to the current project goals.',
    answer: 'Edit',
    feedback: 'Edit: the content might still be useful, but it needs clearer purpose, stronger scanning, and current language.'
  },
  {
    title: 'Expired event announcement from last year',
    details: 'It is still live and appears in search results.',
    answer: 'Delete / archive',
    feedback: 'Delete or archive: outdated content can mislead users and weaken trust.'
  },
  {
    title: 'FAQ answers about parking and arrival time',
    details: 'Visitors ask these questions often, but the answers are buried in a PDF.',
    answer: 'Move',
    feedback: 'Move: high-value task content should be easier to find, scan, and link to.'
  },
  {
    title: 'New page explaining accessibility accommodations',
    details: 'The content does not exist yet, but the audience needs it before visiting.',
    answer: 'Create',
    feedback: 'Create: missing content should be planned, assigned, written, and tested before launch.'
  },
  {
    title: 'Three different pages with almost the same application instructions',
    details: 'They use different wording and dates.',
    answer: 'Merge',
    feedback: 'Merge: duplicate content creates maintenance problems and user confusion.'
  }
];
const inventoryChoices = ['Create', 'Edit', 'Move', 'Merge', 'Delete / archive'];
let inventoryIndex = 0;
const inventoryTitle = document.querySelector('#inventoryTitle');
const inventoryDetails = document.querySelector('#inventoryDetails');
const inventoryChoiceGrid = document.querySelector('#inventoryChoiceGrid');
const inventoryResult = document.querySelector('#inventoryResult');
function renderInventory() {
  const item = inventoryItems[inventoryIndex];
  inventoryTitle.textContent = item.title;
  inventoryDetails.textContent = item.details;
  inventoryResult.textContent = 'Choose an inventory action.';
  inventoryChoiceGrid.innerHTML = '';
  inventoryChoices.forEach(choice => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'type-card';
    button.textContent = choice;
    button.addEventListener('click', () => {
      Array.from(inventoryChoiceGrid.children).forEach(btn => {
        btn.disabled = true;
        btn.classList.toggle('correct-choice', btn.textContent === item.answer);
        btn.classList.toggle('incorrect-choice', btn.textContent === choice && choice !== item.answer);
      });
      inventoryResult.textContent = item.feedback;
    });
    inventoryChoiceGrid.appendChild(button);
  });
}
document.querySelector('#newInventoryBtn')?.addEventListener('click', () => {
  inventoryIndex = (inventoryIndex + 1) % inventoryItems.length;
  renderInventory();
});
renderInventory();

// Slide 7: label choices
const labelScenarios = [
  {
    scenario: 'A free event needs visitors to save a spot before attending.',
    choices: ['Buy Now', 'RSVP', 'Learn More', 'Apply'],
    answer: 'RSVP',
    feedback: 'RSVP fits a free event where the user is confirming attendance.'
  },
  {
    scenario: 'A paid workshop has limited seats and online payment.',
    choices: ['Get Tickets', 'Read Story', 'Request Info', 'Browse'],
    answer: 'Get Tickets',
    feedback: 'Get Tickets sets the expectation that the next step is a purchase or reservation.'
  },
  {
    scenario: 'A vendor wants to be considered for an event lineup.',
    choices: ['Apply as Vendor', 'Donate', 'Join List', 'Shop'],
    answer: 'Apply as Vendor',
    feedback: 'Apply as Vendor is specific and separates vendors from general visitors.'
  },
  {
    scenario: 'A visitor wants basic details before deciding.',
    choices: ['View Details', 'Submit', 'Sign In', 'Pay Deposit'],
    answer: 'View Details',
    feedback: 'View Details fits the early decision stage without making the user feel committed.'
  }
];
let labelIndex = 0;
const labelScenario = document.querySelector('#labelScenario');
const labelChoiceGrid = document.querySelector('#labelChoiceGrid');
const labelResult = document.querySelector('#labelResult');
function renderLabel() {
  const item = labelScenarios[labelIndex];
  labelScenario.textContent = item.scenario;
  labelResult.textContent = 'Choose a label.';
  labelChoiceGrid.innerHTML = '';
  item.choices.forEach(choice => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'type-card';
    button.textContent = choice;
    button.addEventListener('click', () => {
      Array.from(labelChoiceGrid.children).forEach(btn => {
        btn.disabled = true;
        btn.classList.toggle('correct-choice', btn.textContent === item.answer);
        btn.classList.toggle('incorrect-choice', btn.textContent === choice && choice !== item.answer);
      });
      labelResult.textContent = item.feedback;
    });
    labelChoiceGrid.appendChild(button);
  });
}
document.querySelector('#newLabelBtn')?.addEventListener('click', () => {
  labelIndex = (labelIndex + 1) % labelScenarios.length;
  renderLabel();
});
renderLabel();

// Slide 9: organization theme
const themeTasks = [
  { task: 'Find the cheapest ticket option.', hint: 'The user is comparing values.', answer: 'Continuum', feedback: 'Continuum works because the options can be ranked by price.' },
  { task: 'Find what happens at 8:00 PM.', hint: 'The user is following a schedule.', answer: 'Time', feedback: 'Time works because the information is organized by when things happen.' },
  { task: 'Find food vendors near the main entrance.', hint: 'The user is thinking spatially.', answer: 'Location', feedback: 'Location works because the user is navigating by place.' },
  { task: 'Find a performer by name.', hint: 'The user already knows the exact name.', answer: 'Alphabetic', feedback: 'Alphabetic works when users know the name they are looking for.' },
  { task: 'Browse all activities for families.', hint: 'The user is looking by type of content.', answer: 'Category', feedback: 'Category works because the user is browsing by shared characteristics.' }
];
const themeChoices = ['Category', 'Time', 'Location', 'Alphabetic', 'Continuum'];
let themeIndex = 0;
const themeTask = document.querySelector('#themeTask');
const themeHint = document.querySelector('#themeHint');
const themeChoiceGrid = document.querySelector('#themeChoiceGrid');
const themeResult = document.querySelector('#themeResult');
function renderTheme() {
  const item = themeTasks[themeIndex];
  themeTask.textContent = item.task;
  themeHint.textContent = item.hint;
  themeResult.textContent = 'Choose the best organizing theme.';
  themeChoiceGrid.innerHTML = '';
  themeChoices.forEach(choice => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'type-card';
    button.textContent = choice;
    button.addEventListener('click', () => {
      Array.from(themeChoiceGrid.children).forEach(btn => {
        btn.disabled = true;
        btn.classList.toggle('correct-choice', btn.textContent === item.answer);
        btn.classList.toggle('incorrect-choice', btn.textContent === choice && choice !== item.answer);
      });
      themeResult.textContent = item.feedback;
    });
    themeChoiceGrid.appendChild(button);
  });
}
document.querySelector('#newThemeBtn')?.addEventListener('click', () => {
  themeIndex = (themeIndex + 1) % themeTasks.length;
  renderTheme();
});
renderTheme();

// Slide 10: card sort
const sortCards = ['Food trucks', 'Parking', 'Volunteer form', 'Main stage', 'FAQ', 'Sponsor logos', 'Restrooms', 'Vendor rules', 'Accessibility', 'Schedule'];
const sortBucketsData = ['Visit Info', 'Event Lineup', 'Participate'];
const sortCardsEl = document.querySelector('#sortCards');
const sortBucketsEl = document.querySelector('#sortBuckets');
const sortResult = document.querySelector('#sortResult');
const sortCount = document.querySelector('#sortCount');
let selectedCard = null;
const placedCards = new Map();
function renderSort() {
  sortCardsEl.innerHTML = '';
  sortCards.forEach(card => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sort-card';
    button.textContent = card;
    button.disabled = placedCards.has(card);
    button.classList.toggle('placed', placedCards.has(card));
    button.classList.toggle('active', selectedCard === card);
    button.addEventListener('click', () => {
      selectedCard = selectedCard === card ? null : card;
      sortResult.textContent = selectedCard ? `Selected: ${selectedCard}. Choose a category.` : 'Select a card, then place it in a category.';
      renderSort();
    });
    sortCardsEl.appendChild(button);
  });

  sortBucketsEl.innerHTML = '';
  sortBucketsData.forEach(bucket => {
    const wrap = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'sort-bucket-title';
    title.innerHTML = `<strong>${bucket}</strong>`;
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'bucket-btn';
    addButton.textContent = 'Place here';
    addButton.addEventListener('click', () => {
      if (!selectedCard) {
        sortResult.textContent = 'Select a card first.';
        return;
      }
      placedCards.set(selectedCard, bucket);
      sortResult.textContent = `${selectedCard} placed under ${bucket}.`;
      selectedCard = null;
      renderSort();
    });
    title.appendChild(addButton);
    const list = document.createElement('div');
    list.className = 'bucket-list';
    Array.from(placedCards.entries()).filter(([, value]) => value === bucket).forEach(([card]) => {
      const span = document.createElement('span');
      span.textContent = card;
      list.appendChild(span);
    });
    wrap.appendChild(title);
    wrap.appendChild(list);
    sortBucketsEl.appendChild(wrap);
  });
  sortCount.textContent = `${placedCards.size} cards placed`;
}
document.querySelector('#resetSortBtn')?.addEventListener('click', () => {
  selectedCard = null;
  placedCards.clear();
  sortResult.textContent = 'Select a card, then place it in a category.';
  renderSort();
});
renderSort();

// Slide 12: structure selector
const structureScenarios = [
  { scenario: 'A training module should be completed from lesson 1 to lesson 6.', answer: 'Sequence', feedback: 'Sequence fits because the user should move through a fixed order.' },
  { scenario: 'A college website has many sections, offices, programs, and service pages.', answer: 'Hierarchy', feedback: 'Hierarchy fits because the user needs broad categories that lead to more specific pages.' },
  { scenario: 'A wiki-style knowledge base has many related pages that cross-link heavily.', answer: 'Web', feedback: 'Web fits because users may move through many connected topics in flexible paths.' },
  { scenario: 'A checkout flow must move from cart to shipping to payment to confirmation.', answer: 'Sequence', feedback: 'Sequence fits because the steps need a clear order and closure.' }
];
const structures = [
  { name: 'Sequence', description: 'Best for ordered steps, lessons, stories, onboarding, or checkout flows.' },
  { name: 'Hierarchy', description: 'Best for most content-rich sites with clear categories and subcategories.' },
  { name: 'Web', description: 'Best for highly connected topics where users explore through many links.' }
];
let structureIndex = 0;
const structureScenario = document.querySelector('#structureScenario');
const structureChoiceGrid = document.querySelector('#structureChoiceGrid');
const structureResult = document.querySelector('#structureResult');
function renderStructure() {
  const item = structureScenarios[structureIndex];
  structureScenario.textContent = item.scenario;
  structureResult.textContent = 'Choose a structure.';
  structureChoiceGrid.innerHTML = '';
  structures.forEach(structure => {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = `<span class="step-number">${structure.name[0]}</span><h3>${structure.name}</h3><p>${structure.description}</p>`;
    button.addEventListener('click', () => {
      Array.from(structureChoiceGrid.children).forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      structureResult.textContent = structure.name === item.answer ? item.feedback : `${structure.name} could work in some cases, but this task is better supported by ${item.answer}.`;
    });
    structureChoiceGrid.appendChild(button);
  });
}
document.querySelector('#newStructureBtn')?.addEventListener('click', () => {
  structureIndex = (structureIndex + 1) % structureScenarios.length;
  renderStructure();
});
renderStructure();

// Slide 13: site diagram builder
const siteNameInput = document.querySelector('#siteNameInput');
const categoriesInput = document.querySelector('#categoriesInput');
const subpagesInput = document.querySelector('#subpagesInput');
const diagramTitle = document.querySelector('#diagramTitle');
const diagramOutput = document.querySelector('#diagramOutput');
function renderDiagram() {
  const siteName = siteNameInput.value.trim() || 'Project Site';
  const categories = categoriesInput.value.split('\n').map(item => item.trim()).filter(Boolean).slice(0, 8);
  const subpageRows = subpagesInput.value.split('\n').map(row => row.split(',').map(item => item.trim()).filter(Boolean));
  diagramTitle.textContent = siteName;
  diagramOutput.innerHTML = '';
  const home = document.createElement('div');
  home.className = 'diagram-home';
  home.textContent = 'Home';
  const cats = document.createElement('div');
  cats.className = 'diagram-categories';
  categories.forEach((cat, index) => {
    const block = document.createElement('div');
    block.className = 'diagram-category';
    const subitems = subpageRows[index] || [];
    block.innerHTML = `<strong>${cat}</strong><ul>${subitems.map(item => `<li>${item}</li>`).join('')}</ul>`;
    cats.appendChild(block);
  });
  diagramOutput.appendChild(home);
  diagramOutput.appendChild(cats);
}
[siteNameInput, categoriesInput, subpagesInput].forEach(el => el?.addEventListener('input', renderDiagram));
renderDiagram();

// Slide 14: wireframe areas
const wireInfo = {
  identity: ['Logo / identity', 'Confirms whose site this is and helps the visitor stay oriented.'],
  global: ['Global navigation', 'Shows the main site categories that should remain consistent across pages.'],
  title: ['Page title', 'Names the current page clearly so the user knows where they are.'],
  local: ['Local navigation', 'Shows related pages within the current section or category.'],
  content: ['Primary content', 'Contains the main information or task the page exists to support.'],
  action: ['Main action', 'Highlights the next useful step, such as RSVP, book, apply, contact, or download.'],
  footer: ['Footer / contact', 'Provides supporting navigation, contact details, policies, and ownership information.']
};
const wireOutput = document.querySelector('#wireOutput');
document.querySelectorAll('[data-wire]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-wire]').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const [title, text] = wireInfo[button.dataset.wire];
    wireOutput.innerHTML = `<h3>${title}</h3><p>${text}</p>`;
  });
});

// Slide 15: path test
const pathTasks = [
  {
    task: 'Find out whether the event allows outside food.',
    choices: ['Home → FAQ → Food & policies', 'Home → Sponsors → Logos', 'Home → Vendors → Apply', 'Home → Gallery → Photos'],
    answer: 'Home → FAQ → Food & policies',
    feedback: 'FAQ is the strongest path because the question is a policy/detail users expect to verify quickly.'
  },
  {
    task: 'Find the form to become a vendor.',
    choices: ['Home → Visit → Parking', 'Home → Participate → Vendor application', 'Home → Schedule → 8 PM', 'Home → About → Story'],
    answer: 'Home → Participate → Vendor application',
    feedback: 'Participate works because the user wants to take part in the event, not just attend it.'
  },
  {
    task: 'Find wheelchair-accessible arrival information.',
    choices: ['Home → Visit → Accessibility', 'Home → Merch → Store', 'Home → Lineup → Artists', 'Home → Blog → Updates'],
    answer: 'Home → Visit → Accessibility',
    feedback: 'Visit info is the right section because accessibility affects planning the trip.'
  },
  {
    task: 'Find who performs first.',
    choices: ['Home → Schedule → Timeline', 'Home → About → Mission', 'Home → FAQ → Rules', 'Home → Contact → Email'],
    answer: 'Home → Schedule → Timeline',
    feedback: 'Schedule matches the user’s time-based task.'
  }
];
let pathIndex = 0;
const pathTask = document.querySelector('#pathTask');
const pathChoiceGrid = document.querySelector('#pathChoiceGrid');
const pathResult = document.querySelector('#pathResult');
function renderPath() {
  const item = pathTasks[pathIndex];
  pathTask.textContent = item.task;
  pathResult.textContent = 'Choose a path.';
  pathChoiceGrid.innerHTML = '';
  item.choices.forEach(choice => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'type-card';
    button.textContent = choice;
    button.addEventListener('click', () => {
      Array.from(pathChoiceGrid.children).forEach(btn => {
        btn.disabled = true;
        btn.classList.toggle('correct-choice', btn.textContent === item.answer);
        btn.classList.toggle('incorrect-choice', btn.textContent === choice && choice !== item.answer);
      });
      pathResult.textContent = choice === item.answer ? item.feedback : `This path might confuse users. ${item.feedback}`;
    });
    pathChoiceGrid.appendChild(button);
  });
}
document.querySelector('#newPathBtn')?.addEventListener('click', () => {
  pathIndex = (pathIndex + 1) % pathTasks.length;
  renderPath();
});
renderPath();

// Slide 16: quiz
const quiz = [
  {
    question: 'What is the main purpose of a content inventory?',
    options: ['To list and evaluate content before organizing the site', 'To choose final colors', 'To replace usability testing', 'To write all CSS classes'],
    answer: 0,
    feedback: 'A content inventory helps the team see what exists, what is missing, and what action each item needs.'
  },
  {
    question: 'What is a controlled vocabulary?',
    options: ['A consistent set of labels and terms', 'A password-protected glossary', 'A design color palette', 'A random list of keywords'],
    answer: 0,
    feedback: 'Controlled vocabulary keeps names and labels consistent across navigation, content, metadata, and interfaces.'
  },
  {
    question: 'Which structure is usually strongest for complex sites with categories and subcategories?',
    options: ['Hierarchy', 'A single long page with no sections', 'Random links only', 'A PDF download'],
    answer: 0,
    feedback: 'Hierarchy is the common structure for moving from broad categories to specific pages.'
  },
  {
    question: 'Why use wireframes before visual design?',
    options: ['To focus on structure, content, and navigation before decoration', 'To avoid planning navigation', 'To pick stock photos first', 'To make final art immediately'],
    answer: 0,
    feedback: 'Wireframes keep the conversation focused on what belongs where and why.'
  }
];
let quizIndex = 0;
const quizQuestion = document.querySelector('#quizQuestion');
const quizOptions = document.querySelector('#quizOptions');
const quizFeedback = document.querySelector('#quizFeedback');
function renderQuiz() {
  const item = quiz[quizIndex];
  quizQuestion.textContent = item.question;
  quizFeedback.textContent = '';
  quizOptions.innerHTML = '';
  item.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => {
      Array.from(quizOptions.children).forEach((btn, idx) => {
        btn.disabled = true;
        btn.classList.toggle('correct', idx === item.answer);
        btn.classList.toggle('incorrect', idx === index && index !== item.answer);
      });
      quizFeedback.textContent = item.feedback;
    });
    quizOptions.appendChild(button);
  });
}
document.querySelector('#nextQuizBtn')?.addEventListener('click', () => {
  quizIndex = (quizIndex + 1) % quiz.length;
  renderQuiz();
});
renderQuiz();

updateState();
