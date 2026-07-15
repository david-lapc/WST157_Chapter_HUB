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
updateState();

// Slide 5: semantic tag choice
const tagPrompts = [
  {
    prompt: 'The most important page title.',
    choices: ['<div>', '<h1>', '<span>', '<br>'],
    answer: '<h1>',
    feedback: '<h1> marks the main heading and gives the page a clear outline.'
  },
  {
    prompt: 'A group of related schedule items.',
    choices: ['<ul>', '<b>', '<img>', '<script>'],
    answer: '<ul>',
    feedback: '<ul> communicates that the items belong together as a list.'
  },
  {
    prompt: 'A clickable action that submits or triggers something.',
    choices: ['<button>', '<strong>', '<section>', '<em>'],
    answer: '<button>',
    feedback: '<button> gives the control the correct meaning and keyboard behavior.'
  },
  {
    prompt: 'The main unique content area of the page.',
    choices: ['<main>', '<font>', '<center>', '<small>'],
    answer: '<main>',
    feedback: '<main> identifies the central content area of the document.'
  },
  {
    prompt: 'A photo that communicates meaningful content.',
    choices: ['<img alt="...">', '<div>', '<hr>', '<style>'],
    answer: '<img alt="...">',
    feedback: '<img> with useful alt text helps the image be understood when it cannot be seen.'
  }
];
let tagIndex = 0;
const tagPrompt = document.querySelector('#tagPrompt');
const tagChoiceGrid = document.querySelector('#tagChoiceGrid');
const tagResult = document.querySelector('#tagResult');
function renderTagPrompt() {
  const item = tagPrompts[tagIndex];
  tagPrompt.textContent = item.prompt;
  tagChoiceGrid.innerHTML = '';
  tagResult.textContent = 'Choose a tag.';
  item.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'type-card';
    button.textContent = choice;
    button.addEventListener('click', () => {
      Array.from(tagChoiceGrid.children).forEach((btn) => {
        btn.disabled = true;
        btn.classList.toggle('correct-choice', btn.textContent === item.answer);
        btn.classList.toggle('incorrect-choice', btn.textContent === choice && choice !== item.answer);
      });
      tagResult.textContent = item.feedback;
    });
    tagChoiceGrid.appendChild(button);
  });
}
document.querySelector('#newTagBtn')?.addEventListener('click', () => {
  tagIndex = (tagIndex + 1) % tagPrompts.length;
  renderTagPrompt();
});
renderTagPrompt();

// Slide 7: responsive viewport demo
document.querySelectorAll('.viewport-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const frame = document.querySelector('#viewportFrame');
    frame.classList.remove('mobile', 'tablet', 'desktop');
    frame.classList.add(button.dataset.size);
  });
});

// Slide 9: URL check
const urlPrompts = [
  {
    prompt: 'A page showing the food vendor lineup.',
    choices: ['/vendors/food', '/page?id=8821&type=a', '/new-stuff', '/click-here'],
    answer: '/vendors/food',
    feedback: 'This path is readable and describes where the page lives in the site.'
  },
  {
    prompt: 'A page explaining parking and transit options.',
    choices: ['/visit/parking-transit', '/info-final-v3', '/assets/parking', '/p?t=55'],
    answer: '/visit/parking-transit',
    feedback: 'This path uses clear words that match the user task.'
  },
  {
    prompt: 'A profile page for a vendor called Moonlight Tacos.',
    choices: ['/vendors/moonlight-tacos', '/vendors/1', '/moonlight tacos!!!', '/profile_old'],
    answer: '/vendors/moonlight-tacos',
    feedback: 'This path is stable, readable, and connected to the vendor section.'
  },
  {
    prompt: 'A page with event frequently asked questions.',
    choices: ['/faq', '/help/faq', '/stuff-you-need', '/x/y/z/999'],
    answer: '/help/faq',
    feedback: 'This path is clear and groups support content under help.'
  }
];
let urlIndex = 0;
const urlPrompt = document.querySelector('#urlPrompt');
const urlChoiceGrid = document.querySelector('#urlChoiceGrid');
const urlResult = document.querySelector('#urlResult');
function renderUrlPrompt() {
  const item = urlPrompts[urlIndex];
  urlPrompt.textContent = item.prompt;
  urlChoiceGrid.innerHTML = '';
  urlResult.textContent = 'Choose a URL.';
  item.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'type-card';
    button.textContent = choice;
    button.addEventListener('click', () => {
      Array.from(urlChoiceGrid.children).forEach((btn) => {
        btn.disabled = true;
        btn.classList.toggle('correct-choice', btn.textContent === item.answer);
        btn.classList.toggle('incorrect-choice', btn.textContent === choice && choice !== item.answer);
      });
      urlResult.textContent = item.feedback;
    });
    urlChoiceGrid.appendChild(button);
  });
}
document.querySelector('#newUrlBtn')?.addEventListener('click', () => {
  urlIndex = (urlIndex + 1) % urlPrompts.length;
  renderUrlPrompt();
});
renderUrlPrompt();

// Slide 11: workflow order
const workflowSteps = [
  { label: 'Draft', note: 'Content is written or updated.' },
  { label: 'Review', note: 'Facts, details, and user needs are checked.' },
  { label: 'Edit', note: 'Language, structure, and consistency are improved.' },
  { label: 'Approve', note: 'The right person confirms it is ready.' },
  { label: 'Publish', note: 'The page goes live and is monitored.' }
];
let workflowSelected = [];
const workflowGrid = document.querySelector('#workflowGrid');
const workflowResult = document.querySelector('#workflowResult');
function renderWorkflow() {
  workflowGrid.innerHTML = '';
  workflowSelected = [];
  workflowResult.textContent = 'Build the workflow order.';
  workflowSteps.forEach((step, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'type-card';
    button.innerHTML = `<strong>${step.label}</strong><span>${step.note}</span>`;
    button.addEventListener('click', () => {
      if (workflowSelected.includes(index)) return;
      workflowSelected.push(index);
      button.disabled = true;
      button.classList.add('selected-choice');
      button.insertAdjacentHTML('afterbegin', `<span class="choice-num">${workflowSelected.length}</span>`);
      const correctSoFar = workflowSelected.every((value, position) => value === position);
      if (workflowSelected.length === workflowSteps.length) {
        workflowResult.textContent = correctSoFar
          ? 'Strong workflow: draft → review → edit → approve → publish.'
          : 'This order can be improved. A safer workflow usually moves from draft to review, edit, approval, then publishing.';
      } else {
        workflowResult.textContent = `${workflowSelected.length} step${workflowSelected.length === 1 ? '' : 's'} selected.`;
      }
    });
    workflowGrid.appendChild(button);
  });
}
document.querySelector('#resetWorkflowBtn')?.addEventListener('click', renderWorkflow);
renderWorkflow();

// Slide 13: SEO structure choices
const seoPrompts = [
  {
    prompt: 'The page title says “Home” but the page is about the vendor lineup.',
    choices: ['Write a descriptive page title', 'Make the logo bigger', 'Add more animation', 'Use more colors'],
    answer: 'Write a descriptive page title',
    feedback: 'A useful title helps users, browser tabs, bookmarks, and search results.'
  },
  {
    prompt: 'Important event details are only shown inside a poster image.',
    choices: ['Add the details as real text on the page', 'Add a darker background', 'Make the poster wider', 'Use a different filter'],
    answer: 'Add the details as real text on the page',
    feedback: 'Real text is searchable, accessible, responsive, and easier to update.'
  },
  {
    prompt: 'Several links point to pages that no longer exist.',
    choices: ['Fix or redirect the broken links', 'Hide the footer', 'Change the font', 'Add a new hero image'],
    answer: 'Fix or redirect the broken links',
    feedback: 'Broken links damage navigation, trust, and search crawling.'
  },
  {
    prompt: 'An image of a vendor booth has no alt text.',
    choices: ['Add useful alt text', 'Crop the image tighter', 'Put it lower on the page', 'Make it grayscale'],
    answer: 'Add useful alt text',
    feedback: 'Alt text supports accessibility and helps communicate image meaning.'
  }
];
let seoIndex = 0;
const seoPrompt = document.querySelector('#seoPrompt');
const seoChoiceGrid = document.querySelector('#seoChoiceGrid');
const seoResult = document.querySelector('#seoResult');
function renderSeoPrompt() {
  const item = seoPrompts[seoIndex];
  seoPrompt.textContent = item.prompt;
  seoChoiceGrid.innerHTML = '';
  seoResult.textContent = 'Choose a fix.';
  item.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'type-card';
    button.textContent = choice;
    button.addEventListener('click', () => {
      Array.from(seoChoiceGrid.children).forEach((btn) => {
        btn.disabled = true;
        btn.classList.toggle('correct-choice', btn.textContent === item.answer);
        btn.classList.toggle('incorrect-choice', btn.textContent === choice && choice !== item.answer);
      });
      seoResult.textContent = item.feedback;
    });
    seoChoiceGrid.appendChild(button);
  });
}
document.querySelector('#newSeoBtn')?.addEventListener('click', () => {
  seoIndex = (seoIndex + 1) % seoPrompts.length;
  renderSeoPrompt();
});
renderSeoPrompt();

// Slide 15: quiz
const quizQuestions = [
  {
    question: 'What does semantic HTML communicate?',
    options: ['The meaning and structure of content', 'Only the color of text', 'The price of hosting', 'The screen size of the visitor'],
    answer: 'The meaning and structure of content',
    feedback: 'Semantic HTML uses elements according to meaning, such as headings, lists, buttons, and main content.'
  },
  {
    question: 'Why use a shared CSS file?',
    options: ['To make one style change affect many pages', 'To remove all images', 'To hide the HTML', 'To stop pages from linking'],
    answer: 'To make one style change affect many pages',
    feedback: 'Shared CSS improves consistency and makes site-wide style updates easier.'
  },
  {
    question: 'Which URL is the most readable?',
    options: ['/vendors/food-trucks', '/page?id=842&v=3', '/newstuff999', '/final-final-page'],
    answer: '/vendors/food-trucks',
    feedback: 'Readable URLs help users and systems understand what the page is about.'
  },
  {
    question: 'Which item belongs in the page head?',
    options: ['The page title and meta description', 'The main article body', 'The footer navigation text', 'The visible event schedule'],
    answer: 'The page title and meta description',
    feedback: 'The head contains metadata, linked styles/scripts, and page setup information.'
  },
  {
    question: 'What is a CMS workflow useful for?',
    options: ['Managing drafts, review, approval, and publishing', 'Making every page the same color', 'Deleting all metadata', 'Replacing all planning'],
    answer: 'Managing drafts, review, approval, and publishing',
    feedback: 'A CMS can help control roles, review, scheduling, and content updates.'
  }
];
let quizIndex = 0;
const quizQuestion = document.querySelector('#quizQuestion');
const quizOptions = document.querySelector('#quizOptions');
const quizResult = document.querySelector('#quizResult');
function renderQuiz() {
  const item = quizQuestions[quizIndex];
  quizQuestion.textContent = item.question;
  quizOptions.innerHTML = '';
  quizResult.textContent = 'Choose an answer.';
  item.options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'type-card';
    button.textContent = option;
    button.addEventListener('click', () => {
      Array.from(quizOptions.children).forEach((btn) => {
        btn.disabled = true;
        btn.classList.toggle('correct-choice', btn.textContent === item.answer);
        btn.classList.toggle('incorrect-choice', btn.textContent === option && option !== item.answer);
      });
      quizResult.textContent = item.feedback;
    });
    quizOptions.appendChild(button);
  });
}
document.querySelector('#nextQuizBtn')?.addEventListener('click', () => {
  quizIndex = (quizIndex + 1) % quizQuestions.length;
  renderQuiz();
});
renderQuiz();

// Slide 16: exit ticket
const exitText = document.querySelector('#exitText');
const copyNote = document.querySelector('#copyNote');
document.querySelector('#copyExitBtn')?.addEventListener('click', async () => {
  const text = exitText.value.trim();
  if (!text) {
    copyNote.textContent = 'Write a response first.';
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    copyNote.textContent = 'Copied.';
  } catch (error) {
    exitText.select();
    document.execCommand('copy');
    copyNote.textContent = 'Copied.';
  }
});
document.querySelector('#clearExitBtn')?.addEventListener('click', () => {
  exitText.value = '';
  copyNote.textContent = '';
});
