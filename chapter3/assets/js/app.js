const slides = Array.from(document.querySelectorAll('.slide'));
const slideList = document.getElementById('slideList');
const overviewGrid = document.getElementById('overviewGrid');
const slideStatus = document.getElementById('slideStatus');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const nextTopBtn = document.getElementById('nextTopBtn');
const overviewBtn = document.getElementById('overviewBtn');
const closeOverviewBtn = document.getElementById('closeOverviewBtn');
const overviewModal = document.getElementById('overviewModal');
const presentBtn = document.getElementById('presentBtn');
let current = 0;

function goToSlide(index) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides[current].scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateUI();
}

function updateUI() {
  slideStatus.textContent = `${current + 1} / ${slides.length}`;
  document.querySelectorAll('.slide-list button').forEach((btn, i) => btn.classList.toggle('active', i === current));
  document.querySelectorAll('.overview-grid button').forEach((btn, i) => btn.classList.toggle('active', i === current));
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === slides.length - 1;
}

function buildNavigation() {
  slides.forEach((slide, index) => {
    const title = slide.dataset.title || `Slide ${index + 1}`;
    const section = slide.dataset.section || '';

    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = `<span class="num">${index + 1}</span><span><span class="name">${title}</span><span class="section">${section}</span></span>`;
    btn.addEventListener('click', () => goToSlide(index));
    li.appendChild(btn);
    slideList.appendChild(li);

    const overview = document.createElement('button');
    overview.type = 'button';
    overview.innerHTML = `<strong>${index + 1}. ${title}</strong><span>${section}</span>`;
    overview.addEventListener('click', () => {
      overviewModal.setAttribute('aria-hidden', 'true');
      goToSlide(index);
    });
    overviewGrid.appendChild(overview);
  });
}

nextBtn.addEventListener('click', () => goToSlide(current + 1));
prevBtn.addEventListener('click', () => goToSlide(current - 1));
nextTopBtn.addEventListener('click', () => goToSlide(current + 1));
overviewBtn.addEventListener('click', () => overviewModal.setAttribute('aria-hidden', 'false'));
closeOverviewBtn.addEventListener('click', () => overviewModal.setAttribute('aria-hidden', 'true'));
overviewModal.addEventListener('click', (event) => {
  if (event.target === overviewModal) overviewModal.setAttribute('aria-hidden', 'true');
});
presentBtn.addEventListener('click', () => {
  document.body.classList.toggle('presenting');
  const isPresenting = document.body.classList.contains('presenting');
  presentBtn.setAttribute('aria-pressed', String(isPresenting));
  presentBtn.textContent = isPresenting ? 'Exit Present' : 'Present';
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'PageDown') goToSlide(current + 1);
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') goToSlide(current - 1);
  if (event.key.toLowerCase() === 'f') presentBtn.click();
  if (event.key === 'Escape') overviewModal.setAttribute('aria-hidden', 'true');
});

function initInventory() {
  const grid = document.getElementById('inventoryGrid');
  if (!grid) return;
  const result = document.getElementById('inventoryResult');
  const status = document.getElementById('inventoryStatus');
  const reset = document.getElementById('resetInventoryBtn');
  const items = [
    ['Date + time', 'Must answer the first visitor question.'],
    ['Location + entrance', 'Reduces hesitation and confusion.'],
    ['Vendor lineup', 'Builds interest and helps people plan.'],
    ['Performers schedule', 'Time-sensitive content users may check repeatedly.'],
    ['Parking / transit', 'Important mobile task before arrival.'],
    ['Sponsor history', 'Useful, but probably not top priority.'],
    ['Full event photo archive', 'Could be added after the event.'],
    ['Vendor application', 'Important for a different audience.'],
    ['Long welcome letter', 'May not support user tasks.'],
    ['FAQ', 'Answers objections and prevents repeated questions.'],
    ['Emergency procedures', 'Important, but needs careful placement and wording.'],
    ['Social feed embed', 'Nice, but may slow the page or distract.']
  ];
  const statuses = ['now', 'later', 'cut'];
  const labels = { now: 'Version 1', later: 'Later', cut: 'Cut / rethink' };
  grid.innerHTML = '';
  items.forEach(([title, note], index) => {
    const button = document.createElement('button');
    button.className = 'sort-card';
    button.type = 'button';
    button.dataset.status = index < 5 ? 'now' : (index < 9 ? 'later' : 'cut');
    button.innerHTML = `<strong>${title}</strong><small>${note}</small><div class="status-row"><span class="status-pill active">${labels[button.dataset.status]}</span></div>`;
    button.addEventListener('click', () => {
      const currentIndex = statuses.indexOf(button.dataset.status);
      button.dataset.status = statuses[(currentIndex + 1) % statuses.length];
      button.querySelector('.status-pill').textContent = labels[button.dataset.status];
      summarize();
    });
    grid.appendChild(button);
  });
  function summarize() {
    const cards = Array.from(grid.querySelectorAll('.sort-card'));
    const counts = statuses.reduce((acc, s) => ({ ...acc, [s]: cards.filter(card => card.dataset.status === s).length }), {});
    status.textContent = `${counts.now} in version 1 · ${counts.later} later · ${counts.cut} cut/rethink`;
    result.textContent = `A stronger inventory does not keep everything. It exposes priorities: what users need first, what supports goals, and what creates unnecessary scope.`;
  }
  reset.addEventListener('click', initInventory);
  summarize();
}

function initLabelLab() {
  const lab = document.getElementById('labelLab');
  if (!lab) return;
  const feedback = document.getElementById('labelFeedback');
  const groups = [
    {
      title: 'A visitor wants basic event facts.',
      options: ['Things to Know', 'Info Zone', 'Plan Your Visit', 'Helpful Details'],
      correct: 2,
      feedback: '“Plan Your Visit” is task-oriented and specific. It suggests date, location, parking, cost, and arrival details.'
    },
    {
      title: 'A visitor wants to see who will be there.',
      options: ['Participants', 'People Stuff', 'Lineup', 'Event Things'],
      correct: 2,
      feedback: '“Lineup” is short, familiar, and broad enough for vendors, performers, and featured creators.'
    },
    {
      title: 'A vendor wants to apply for a booth.',
      options: ['Join as a Vendor', 'Vendorization', 'Business Portal', 'Extra Forms'],
      correct: 0,
      feedback: '“Join as a Vendor” uses plain language and makes the action clear.'
    },
    {
      title: 'A visitor wants answers to repeated questions.',
      options: ['Knowledge Base', 'FAQ', 'Support Matrix', 'Info Dump'],
      correct: 1,
      feedback: '“FAQ” is conventional, recognizable, and easy to scan in navigation.'
    }
  ];
  lab.innerHTML = '';
  groups.forEach((group, groupIndex) => {
    const wrapper = document.createElement('article');
    wrapper.className = 'wireframe-panel';
    wrapper.innerHTML = `<h3>${group.title}</h3>`;
    group.options.forEach((option, optionIndex) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'label-option';
      btn.textContent = option;
      btn.addEventListener('click', () => {
        wrapper.querySelectorAll('button').forEach(b => b.classList.remove('correct', 'incorrect'));
        btn.classList.add(optionIndex === group.correct ? 'correct' : 'incorrect');
        feedback.textContent = optionIndex === group.correct ? group.feedback : `This might be understood by some users, but it is less clear or less consistent than “${group.options[group.correct]}.”`;
      });
      wrapper.appendChild(btn);
    });
    lab.appendChild(wrapper);
  });
}

function initStructures() {
  const output = document.getElementById('structureOutput');
  if (!output) return;
  const buttons = document.querySelectorAll('[data-structure]');
  const templates = {
    sequence: {
      title: 'Sequence',
      text: 'A sequence guides users through one main path. Read it as: begin, complete each step, then finish.',
      bullets: [
        'Best for tutorials, onboarding, forms, and checkout.',
        'The risk: users feel stuck if they cannot skip or go back.',
        'Typical path: Start -> Step 1 -> Step 2 -> Finish.'
      ],
      html: `<div class="sequence-chart"><span class="diagram-node">Start</span><span class="arrow">→</span><span class="diagram-node">Step 1</span><span class="arrow">→</span><span class="diagram-node">Step 2</span><span class="arrow">→</span><span class="diagram-node">Finish</span></div>`,
      legend: ''
    },
    hierarchy: {
      title: 'Hierarchy',
      text: 'A hierarchy moves from broad categories to specific pages. Read it top-down: Home, section, then detail page.',
      bullets: [
        'Best for school sites, company sites, and stores with categories.',
        'The benefit: users can predict where information belongs.',
        'Typical path: Home -> category -> specific detail page.'
      ],
      html: `<div class="hierarchy-chart"><span class="diagram-node">Home</span><span class="diagram-line"></span><div class="hierarchy-row"><span class="diagram-node">Visit</span><span class="diagram-node">Lineup</span><span class="diagram-node">Vendors</span><span class="diagram-node">FAQ</span></div><span class="diagram-line"></span><div class="hierarchy-row"><span class="diagram-node">Parking</span><span class="diagram-node">Schedule</span><span class="diagram-node">Food</span><span class="diagram-node">Policies</span></div></div>`,
      legend: ''
    },
    web: {
      title: 'Web',
      text: 'A web structure supports exploration by association. Read it as: start anywhere, follow related links, discover more.',
      bullets: [
        'Best for related content, recommendations, tags, and portfolios.',
        'The risk: users may lose orientation without clear labels and a home path.',
        'Typical path: one item -> related item -> another related item.'
      ],
      html: `<div class="web-chart"><span class="diagram-node web-hub">Featured artist</span><span class="diagram-node">Related vendor</span><span class="diagram-node">Similar category</span><span class="diagram-node">Instagram</span><span class="diagram-node">Map area</span><span class="diagram-node">Past event</span></div>`,
      legend: '<div class="diagram-legend"><span>Orange = current focus page</span><span>Green = related links around it</span></div>'
    }
  };
  function render(key) {
    const template = templates[key];
    output.innerHTML = `<h3>${template.title}</h3><p class="lede small">${template.text}</p><ul class="structure-explain">${template.bullets.map(item => `<li>${item}</li>`).join('')}</ul>${template.legend}${template.html}`;
  }
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.structure);
    });
  });
  render('sequence');
}

function initCardSort() {
  const bank = document.getElementById('cardBank');
  const board = document.getElementById('sortBoard');
  const status = document.getElementById('sortStatus');
  const reset = document.getElementById('resetSortBtn');
  if (!bank || !board) return;
  const cards = [
    ['Ticket price', 'Visit'], ['Parking lot map', 'Visit'], ['Food vendor list', 'Lineup'], ['DJ set times', 'Lineup'], ['Vendor booth rules', 'Vendors'], ['Application deadline', 'Vendors'], ['Can pets attend?', 'FAQ'], ['Refund policy', 'FAQ'], ['Volunteer sign-up', 'Get Involved']
  ];
  const cats = ['Visit', 'Lineup', 'Vendors', 'FAQ', 'Get Involved'];
  let selected = null;
  let placements = {};
  function render() {
    bank.innerHTML = '';
    cards.forEach(([title, answer], index) => {
      if (placements[index]) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sort-card';
      btn.innerHTML = `<strong>${title}</strong><small>Click, then choose a category.</small>`;
      btn.addEventListener('click', () => {
        selected = index;
        bank.querySelectorAll('.sort-card').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
      bank.appendChild(btn);
    });
    board.innerHTML = '';
    cats.forEach(cat => {
      const bucket = document.createElement('div');
      bucket.className = 'bucket';
      bucket.innerHTML = `<h3>${cat}</h3><p>Drop content that fits this user question.</p><div class="sort-cards"></div>`;
      bucket.addEventListener('click', () => {
        if (selected === null) return;
        placements[selected] = cat;
        selected = null;
        render();
      });
      const list = bucket.querySelector('.sort-cards');
      Object.entries(placements).forEach(([idx, placedCat]) => {
        if (placedCat !== cat) return;
        const [title, answer] = cards[idx];
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'mini-card';
        const correct = placedCat === answer;
        item.innerHTML = `<strong>${title}</strong><small>${correct ? 'Strong fit' : `Could confuse users; expected ${answer}.`}</small>`;
        item.style.borderLeft = correct ? '8px solid var(--accent-3)' : '8px solid var(--accent-2)';
        item.addEventListener('click', (event) => {
          event.stopPropagation();
          delete placements[idx];
          render();
        });
        list.appendChild(item);
      });
      board.appendChild(bucket);
    });
    const placed = Object.keys(placements).length;
    const correct = Object.entries(placements).filter(([idx, cat]) => cat === cards[idx][1]).length;
    status.textContent = `${placed} cards placed · ${correct} strong fits`;
  }
  reset.addEventListener('click', () => { placements = {}; selected = null; render(); });
  render();
}

function initSitemapBuilder() {
  const choices = document.getElementById('navChoices');
  const map = document.getElementById('generatedMap');
  const reset = document.getElementById('resetMapBtn');
  const status = document.getElementById('mapStatus');
  if (!choices || !map || !status) return;
  const sections = [
    {
      key: 'visit',
      label: 'Plan Your Visit',
      role: 'core',
      why: 'Most visitors need time, location, and arrival info quickly.',
      children: ['Date + time', 'Location', 'Parking / transit', 'Accessibility']
    },
    {
      key: 'lineup',
      label: 'Lineup',
      role: 'core',
      why: 'People decide whether to attend based on who and what is featured.',
      children: ['Food vendors', 'Artists', 'Music schedule', 'Featured creators']
    },
    {
      key: 'tickets',
      label: 'Tickets / RSVP',
      role: 'core',
      why: 'Visitors need a clear action path for entry and confirmation.',
      children: ['Ticket options', 'Group info', 'Confirmation details']
    },
    {
      key: 'faq',
      label: 'FAQ',
      role: 'core',
      why: 'A fast answer path lowers friction and repeated support questions.',
      children: ['Payment', 'Weather', 'Pets', 'Refunds']
    },
    {
      key: 'vendors',
      label: 'Join as a Vendor',
      role: 'support',
      why: 'Important for a smaller audience than general visitors.',
      children: ['Who can apply', 'Booth rules', 'Application form']
    },
    {
      key: 'about',
      label: 'About',
      role: 'support',
      why: 'Useful context, but usually not the first task path.',
      children: ['Event purpose', 'Partners', 'Contact']
    }
  ];
  const layoutCycle = ['primary', 'secondary', 'none'];
  let placement = {
    visit: 'primary',
    lineup: 'primary',
    tickets: 'primary',
    faq: 'primary',
    vendors: 'secondary',
    about: 'secondary'
  };

  function getStateLabel(state) {
    if (state === 'primary') return 'Primary nav';
    if (state === 'secondary') return 'Secondary / utility';
    return 'Not included';
  }

  function nextState(currentState) {
    return layoutCycle[(layoutCycle.indexOf(currentState) + 1) % layoutCycle.length];
  }

  function render() {
    choices.innerHTML = '';
    sections.forEach(section => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const sectionState = placement[section.key];
      btn.className = `nav-choice is-${sectionState}`;
      btn.innerHTML = `<strong>${section.label}</strong><small>${section.why}</small><span class="choice-pill">${getStateLabel(sectionState)}</span>`;
      btn.addEventListener('click', () => {
        placement[section.key] = nextState(sectionState);
        render();
      });
      choices.appendChild(btn);
    });

    const primarySections = sections.filter(s => placement[s.key] === 'primary');
    const secondarySections = sections.filter(s => placement[s.key] === 'secondary');
    const coreSectionsInPrimary = primarySections.filter(s => s.role === 'core').length;

    let feedback = '';
    if (primarySections.length < 4) {
      feedback = 'Primary navigation is too sparse. Add at least one more top-level item so key tasks are visible.';
    } else if (primarySections.length > 6) {
      feedback = 'Primary navigation is crowded. Move lower-priority items to secondary utility to reduce scanning effort.';
    } else if (coreSectionsInPrimary < 3) {
      feedback = 'Core visitor tasks are underrepresented in primary navigation. Promote more high-frequency tasks.';
    } else {
      feedback = 'This is a strong working structure: focused primary navigation with supporting items placed in secondary utility.';
    }

    status.textContent = `${primarySections.length} primary · ${secondarySections.length} secondary · ${sections.length - primarySections.length - secondarySections.length} not included`;

    map.innerHTML = `<div class="hierarchy-chart"><span class="diagram-node">Home</span><span class="diagram-line"></span><div class="hierarchy-row">${primarySections.map(s => `<span class="diagram-node">${s.label}</span>`).join('')}</div></div><p class="map-feedback">${feedback}</p>${secondarySections.length ? `<div class="utility-strip"><h3>Secondary / utility navigation</h3><div class="utility-tags">${secondarySections.map(s => `<span>${s.label}</span>`).join('')}</div></div>` : ''}`;

    primarySections.forEach(section => {
      const group = document.createElement('div');
      group.innerHTML = `<h3>${section.label}</h3><ul>${section.children.map(child => `<li>${child}</li>`).join('')}</ul>`;
      map.appendChild(group);
    });
  }

  reset.addEventListener('click', () => {
    placement = {
      visit: 'primary',
      lineup: 'primary',
      tickets: 'primary',
      faq: 'primary',
      vendors: 'secondary',
      about: 'secondary'
    };
    render();
  });

  render();
}

function initWireframes() {
  const box = document.getElementById('wireframeBox');
  if (!box) return;
  const title = document.getElementById('wireTitle');
  const text = document.getElementById('wireText');
  const notes = {
    identity: ['Site identity', 'Helps users confirm where they are and what site they are using.'],
    utility: ['Search / utility links', 'Supports quick access to repeated tasks such as search, contact, or language options.'],
    global: ['Global navigation', 'Shows the main categories and keeps the site structure visible across pages.'],
    primary: ['Primary message + action', 'Makes the page purpose clear and points users toward the most important next step.'],
    section1: ['Section card', 'Chunks related content so users can scan options instead of reading everything.'],
    section2: ['Section card', 'Repeated structures make content easier to compare and maintain.'],
    section3: ['Section card', 'Cards can represent categories, tasks, people, products, or featured content.'],
    footer: ['Footer / contact / policies', 'Provides stable backup navigation, contact information, and required site details.']
  };
  box.querySelectorAll('.wire-el').forEach(el => {
    el.addEventListener('click', () => {
      box.querySelectorAll('.wire-el').forEach(item => item.classList.remove('active'));
      el.classList.add('active');
      const [h, p] = notes[el.dataset.wf];
      title.textContent = h;
      text.textContent = p;
    });
  });
}

function initPathTest() {
  const prompt = document.getElementById('pathPrompt');
  const options = document.getElementById('pathOptions');
  const feedback = document.getElementById('pathFeedback');
  const next = document.getElementById('newPathBtn');
  if (!prompt || !options) return;
  const tasks = [
    {
      q: 'A visitor wants to know whether cash is needed for food vendors. Where should that information be easiest to find?',
      opts: ['About the event', 'FAQ or Plan Your Visit', 'Sponsor page', 'Photo gallery'],
      a: 1,
      f: 'Payment expectations are a practical visitor question, so FAQ or Plan Your Visit fits the task.'
    },
    {
      q: 'A vendor wants to know the booth application deadline. Where should that information be easiest to find?',
      opts: ['Join as a Vendor', 'Lineup', 'Contact', 'Homepage hero only'],
      a: 0,
      f: 'The label should match the vendor’s role and action: joining or applying.'
    },
    {
      q: 'A first-time visitor wants to decide if the event is worth attending. What section should be easy to browse?',
      opts: ['Lineup / Featured vendors', 'Privacy policy', 'Internal planning notes', '404 page'],
      a: 0,
      f: 'The lineup provides concrete reasons to attend: food, artists, music, and activities.'
    },
    {
      q: 'A visitor is already nearby and needs parking instructions quickly. Where should the path begin?',
      opts: ['Plan Your Visit', 'About the founder', 'Past events archive', 'Newsletter signup'],
      a: 0,
      f: 'Parking is a visit-planning task, especially on mobile and close to arrival time.'
    }
  ];
  let i = 0;
  function render() {
    const task = tasks[i % tasks.length];
    prompt.textContent = task.q;
    feedback.textContent = '';
    options.innerHTML = '';
    task.opts.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        options.querySelectorAll('button').forEach(b => b.classList.remove('correct', 'incorrect'));
        btn.classList.add(idx === task.a ? 'correct' : 'incorrect');
        feedback.textContent = idx === task.a ? task.f : `This path could make sense to the team, but users may not predict it. Stronger answer: ${task.opts[task.a]}.`;
      });
      options.appendChild(btn);
    });
  }
  next.addEventListener('click', () => { i++; render(); });
  render();
}

function initQuiz() {
  const question = document.getElementById('quizQuestion');
  const options = document.getElementById('quizOptions');
  const feedback = document.getElementById('quizFeedback');
  const next = document.getElementById('nextQuizBtn');
  if (!question || !options) return;
  const questions = [
    {
      q: 'What is the main purpose of information architecture?',
      opts: ['Choose colors and fonts', 'Organize content and paths so users can find information', 'Write final code', 'Add animation to pages'],
      a: 1,
      f: 'IA focuses on content organization, labels, structure, navigation concepts, and user paths.'
    },
    {
      q: 'What does a content inventory help reveal?',
      opts: ['Only the homepage design', 'Content gaps, duplicates, ownership, and scope', 'The final color palette', 'Which font to use'],
      a: 1,
      f: 'An inventory makes the content situation visible before design and production.'
    },
    {
      q: 'Which structure is usually best for complex sites with categories and subcategories?',
      opts: ['Hierarchy', 'Random web', 'One very long page', 'Hidden menu only'],
      a: 0,
      f: 'Hierarchies work well for many complex websites because users understand broad-to-specific organization.'
    },
    {
      q: 'What is a wireframe best used for at this stage?',
      opts: ['Final artwork', 'Testing content priority and page structure', 'Replacing all user research', 'Writing legal copy'],
      a: 1,
      f: 'Wireframes keep attention on structure, priority, and pathways before final visual design.'
    },
    {
      q: 'Why test labels and categories with users?',
      opts: ['To see if users predict where information belongs', 'To make the site slower', 'To avoid making a sitemap', 'To skip content planning'],
      a: 0,
      f: 'If users cannot predict labels or categories, the architecture needs revision.'
    }
  ];
  let index = 0;
  function render() {
    const item = questions[index % questions.length];
    question.textContent = item.q;
    feedback.textContent = '';
    options.innerHTML = '';
    item.opts.forEach((opt, optIndex) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        options.querySelectorAll('button').forEach(b => b.classList.remove('correct', 'incorrect'));
        btn.classList.add(optIndex === item.a ? 'correct' : 'incorrect');
        feedback.textContent = optIndex === item.a ? item.f : `Not quite. Better answer: ${item.opts[item.a]}.`;
      });
      options.appendChild(btn);
    });
  }
  next.addEventListener('click', () => { index++; render(); });
  render();
}

buildNavigation();
updateUI();
initInventory();
initLabelLab();
initStructures();
initCardSort();
initSitemapBuilder();
initWireframes();
initPathTest();
initQuiz();
