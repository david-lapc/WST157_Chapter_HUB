const slides = [...document.querySelectorAll('.slide')];
const slideList = document.querySelector('#slideList');
const overviewGrid = document.querySelector('#overviewGrid');
const slideStatus = document.querySelector('#slideStatus');
const progressBar = document.querySelector('#progressBar');
const nextBtn = document.querySelector('#nextBtn');
const prevBtn = document.querySelector('#prevBtn');
const nextTopBtn = document.querySelector('#nextTopBtn');
const presentBtn = document.querySelector('#presentBtn');
const overviewBtn = document.querySelector('#overviewBtn');
const overviewModal = document.querySelector('#overviewModal');
const closeOverviewBtn = document.querySelector('#closeOverviewBtn');
let current = 0;

function getMeta(slide, index) {
  const section = slide.querySelector('.kicker')?.textContent?.trim() || `Slide ${index + 1}`;
  const title = slide.querySelector('h1,h2')?.textContent?.trim() || section;
  return { section, title };
}

function makeButton(slide, index, compact = false) {
  const meta = getMeta(slide, index);
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.index = String(index);
  button.innerHTML = compact
    ? `<strong>${String(index + 1).padStart(2, '0')}. ${meta.title}</strong><span>${meta.section}</span>`
    : `<span class="num">${index + 1}</span><span><span class="name">${meta.title}</span><span class="section">${meta.section}</span></span>`;
  button.addEventListener('click', () => {
    showSlide(index);
    closeOverview();
  });
  return button;
}

slides.forEach((slide, index) => {
  if (!slide.id) slide.id = `slide-${index + 1}`;
  const item = document.createElement('li');
  item.appendChild(makeButton(slide, index));
  slideList?.appendChild(item);
  overviewGrid?.appendChild(makeButton(slide, index, true));
});

const navButtons = Array.from(slideList?.querySelectorAll('button') || []);

function showSlide(index) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === current));
  if (slideStatus) slideStatus.textContent = `${current + 1} / ${slides.length}`;
  if (progressBar) progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
  navButtons.forEach((button, buttonIndex) => button.classList.toggle('active', buttonIndex === current));
  if (prevBtn) prevBtn.disabled = current === 0;
  const nextLabel = current === slides.length - 1 ? 'Start over' : 'Next';
  if (nextBtn) nextBtn.textContent = nextLabel;
  if (nextTopBtn) nextTopBtn.textContent = nextLabel;
  localStorage.setItem(document.body.dataset.deck || 'deck', current);
}

function nextSlide() { current === slides.length - 1 ? showSlide(0) : showSlide(current + 1); }
function prevSlide() { showSlide(current - 1); }
function togglePresent() {
  const active = document.body.classList.toggle('present');
  presentBtn?.setAttribute('aria-pressed', String(active));
  if (presentBtn) presentBtn.textContent = active ? 'Exit Present' : 'Present';
}
function openOverview() { overviewModal?.setAttribute('aria-hidden', 'false'); }
function closeOverview() { overviewModal?.setAttribute('aria-hidden', 'true'); }

nextBtn?.addEventListener('click', nextSlide);
nextTopBtn?.addEventListener('click', nextSlide);
prevBtn?.addEventListener('click', prevSlide);
presentBtn?.addEventListener('click', togglePresent);
overviewBtn?.addEventListener('click', openOverview);
closeOverviewBtn?.addEventListener('click', closeOverview);
overviewModal?.addEventListener('click', (event) => { if (event.target === overviewModal) closeOverview(); });

document.addEventListener('keydown', (event) => {
  const activeTag = document.activeElement?.tagName?.toLowerCase();
  if (activeTag === 'input' || activeTag === 'textarea') return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
    event.preventDefault();
    nextSlide();
  }
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
    event.preventDefault();
    prevSlide();
  }
  if (event.key.toLowerCase() === 'f') togglePresent();
  if (event.key.toLowerCase() === 'o') {
    overviewModal?.getAttribute('aria-hidden') === 'true' ? openOverview() : closeOverview();
  }
  if (event.key === 'Escape') closeOverview();
});

const saved = parseInt(localStorage.getItem(document.body.dataset.deck || 'deck'), 10);
showSlide(Number.isFinite(saved) ? saved : 0);

// Generic choice groups
for (const group of document.querySelectorAll('[data-choice-group]')) {
  const activateChoice = (btn) => {
    group.querySelectorAll('button,.choice-card,.chunk-card,.chip-choice').forEach(x => x.classList.remove('active', 'selected'));
    btn.classList.add('active');
    const target = group.dataset.target && document.querySelector(group.dataset.target);
    if (target && btn.dataset.text) target.textContent = btn.dataset.text;
    if (target && btn.dataset.html) target.innerHTML = btn.dataset.html;
  };
  group.addEventListener('click', e => {
    const btn = e.target.closest('button,.choice-card,.chunk-card,.chip-choice');
    if (!btn) return;
    activateChoice(btn);
  });
}

// Quiz
for (const q of document.querySelectorAll('[data-quiz]')) {
  q.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    q.querySelectorAll('button').forEach(b => { b.classList.remove('correct', 'wrong'); b.disabled = true; });
    const feedback = q.querySelector('.feedback');
    if (btn.dataset.correct) {
      btn.classList.add('correct');
      if (feedback) feedback.textContent = 'Correct — the link text names the destination and works better when scanned out of context.';
    } else {
      btn.classList.add('wrong');
      if (feedback) feedback.textContent = 'Not quite — look for the wording that is specific, useful, and action-oriented.';
    }
  });
}

// Rewrite examples
const rewrites = [
  'Night Market is Friday from 6–10 PM. Entry is free. Food vendors, student creators, and live music will be in the courtyard.',
  'Arrive before 7 PM for the shortest food lines. Free parking opens in Lot B at 5 PM.',
  'Vendor applications close March 14. Apply with your booth name, product type, and contact information.'
];
let rewriteIndex = 0;
for (const btn of document.querySelectorAll('[data-rewrite]')) {
  btn.addEventListener('click', () => {
    rewriteIndex = (rewriteIndex + 1) % rewrites.length;
    const output = document.querySelector('#rewriteOutput p');
    if (output) output.textContent = rewrites[rewriteIndex];
  });
}

// Plain language swap
const plain = {
  commence: ['commence', 'start'],
  utilize: ['utilize', 'use'],
  'in the event of': ['in the event of', 'if'],
  'prior to': ['prior to', 'before'],
  approximately: ['approximately', 'about'],
  assist: ['assist', 'help']
};
for (const btn of document.querySelectorAll('[data-plain]')) {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-plain]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const pair = plain[btn.dataset.plain];
    const result = document.querySelector('#plainResult');
    if (result && pair) result.innerHTML = `<span>${pair[0]}</span><strong>${pair[1]}</strong>`;
  });
}

// Mini style guide output
const guideInputs = ['voiceInput', 'dateInput', 'buttonInput', 'avoidInput'].map(id => document.querySelector(`#${id}`));
const guideOutput = document.querySelector('#styleGuideOutput');
function updateGuide() {
  if (!guideOutput) return;
  const [voice, date, button, avoid] = guideInputs.map(input => input?.value?.trim() || '—');
  guideOutput.textContent = `Voice: ${voice} · Date format: ${date} · Button text: ${button} · Avoid: ${avoid}`;
}
guideInputs.forEach(input => input?.addEventListener('input', updateGuide));

// Workshop rewrite moves
const workshopText = {
  lead: 'Night Market is Friday from 6–10 PM in the courtyard. Entry is free, and the event includes food vendors, live music, and student creator booths.',
  heading: 'Heading: What to Expect at Night Market',
  list: 'Event highlights: Free entry · Food vendors · Student creator booths · Live music · Parking in Lot B after 5 PM'
};
for (const btn of document.querySelectorAll('[data-workshop]')) {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-workshop]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const result = document.querySelector('#workshopResult');
    if (result) result.textContent = workshopText[btn.dataset.workshop] || 'Choose a rewrite move.';
  });
}
