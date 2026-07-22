
const slides = [...document.querySelectorAll('.slide')];
const slideList = document.querySelector('#slideList');
const overviewGrid = document.querySelector('#overviewGrid');
const slideStatus = document.querySelector('#slideStatus');
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
  button.addEventListener('click', () => showSlide(index));
  return button;
}

slides.forEach((slide, index) => {
  if (!slide.id) slide.id = `slide-${index + 1}`;
  const item = document.createElement('li');
  item.appendChild(makeButton(slide, index));
  slideList.appendChild(item);
  overviewGrid.appendChild(makeButton(slide, index, true));
});

const navButtons = Array.from(slideList.querySelectorAll('button'));

function showSlide(index) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === current));
  slideStatus.textContent = `${current + 1} / ${slides.length}`;
  navButtons.forEach((button, buttonIndex) => button.classList.toggle('active', buttonIndex === current));
  prevBtn.disabled = current === 0;
  const nextLabel = current === slides.length - 1 ? 'Start over' : 'Next';
  nextBtn.textContent = nextLabel;
  nextTopBtn.textContent = nextLabel;
  localStorage.setItem(document.body.dataset.deck || 'deck', current);
}

function nextSlide() {
  if (current === slides.length - 1) showSlide(0);
  else showSlide(current + 1);
}

function prevSlide() {
  showSlide(current - 1);
}

function togglePresent() {
  const active = document.body.classList.toggle('present');
  presentBtn.setAttribute('aria-pressed', String(active));
  presentBtn.textContent = active ? 'Exit Present' : 'Present';
}

function openOverview() {
  overviewModal.setAttribute('aria-hidden', 'false');
}

function closeOverview() {
  overviewModal.setAttribute('aria-hidden', 'true');
}

nextBtn.addEventListener('click', nextSlide);
nextTopBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);
presentBtn.addEventListener('click', togglePresent);
overviewBtn.addEventListener('click', openOverview);
closeOverviewBtn.addEventListener('click', closeOverview);
overviewModal.addEventListener('click', (event) => {
  if (event.target === overviewModal) closeOverview();
});

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
    if (overviewModal.getAttribute('aria-hidden') === 'true') openOverview();
    else closeOverview();
  }
  if (event.key === 'Escape') closeOverview();
});

const saved = parseInt(localStorage.getItem(document.body.dataset.deck || 'deck'), 10);
showSlide(Number.isFinite(saved) ? saved : 0);

// Generic toggles
for (const btn of document.querySelectorAll('[data-reveal]')) {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.dataset.reveal);
    if (target) target.classList.toggle('show');
  });
}
for (const group of document.querySelectorAll('[data-choice-group]')) {
  const activateChoice = (btn) => {
    group.querySelectorAll('button,.chip-choice,.priority-card,.audit-card').forEach(x => x.classList.remove('active', 'selected'));
    btn.classList.add(btn.classList.contains('priority-card') ? 'selected' : 'active');
    const target = group.dataset.target && document.querySelector(group.dataset.target);
    if (target && btn.dataset.text) target.textContent = btn.dataset.text;
    if (target && btn.dataset.html) target.innerHTML = btn.dataset.html;
  };
  group.addEventListener('click', e => {
    const btn = e.target.closest('button,.chip-choice,.priority-card,.audit-card');
    if (!btn) return;
    activateChoice(btn);
  });
  group.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const btn = e.target.closest('.priority-card,.audit-card');
    if (!btn) return;
    e.preventDefault();
    activateChoice(btn);
  });
}
for (const q of document.querySelectorAll('[data-quiz]')) {
  q.addEventListener('click', e => {
    const btn = e.target.closest('button'); if (!btn) return;
    q.querySelectorAll('button').forEach(b => { b.classList.remove('correct', 'wrong'); b.disabled = true; });
    const feedback = q.querySelector('.feedback');
    if (btn.dataset.correct) { btn.classList.add('correct'); feedback.textContent = 'Correct — that answer supports the chapter idea.'; }
    else { btn.classList.add('wrong'); feedback.textContent = 'Not quite — look for the answer that connects design decisions to meaning and usability.'; }
  });
}

// Ch8 specifics
const balance = document.querySelector('#balanceRange');
if (balance) {
  const visual = document.querySelector('#balanceVisual');
  const info = document.querySelector('#balanceInfo');
  const output = document.querySelector('#balanceOutput');
  balance.addEventListener('input', () => {
    const v = +balance.value;
    visual.style.flex = v;
    info.style.flex = 100 - v;
    output.textContent = v < 35 ? 'Too much information: accurate, but tiring.' : v > 70 ? 'Too much visual sensation: exciting, but unclear.' : 'Balanced: visual interest supports useful information.';
  });
}
const hierarchyItems = document.querySelectorAll('[data-priority-demo] .priority-card');
if (hierarchyItems.length) {
  hierarchyItems.forEach(card => card.addEventListener('click', () => {
    hierarchyItems.forEach(c => { c.style.transform = ''; c.style.fontSize = ''; c.style.background = ''; c.style.color = ''; });
    card.style.transform = 'scale(1.08)'; card.style.fontSize = '1.18rem'; card.style.background = '#161a36'; card.style.color = '#fff';
  }));
}
const gridButtons = document.querySelectorAll('[data-grid-mode]');
const gridDemo = document.querySelector('#gridDemo');
if (gridButtons.length && gridDemo) {
  gridButtons.forEach(btn => btn.addEventListener('click', () => {
    gridButtons.forEach(b => b.classList.remove('active')); btn.classList.add('active');
    gridDemo.style.gridTemplateColumns = btn.dataset.gridMode;
  }));
}

// Ch9 specifics
const typeStage = document.querySelector('#typeStage');
if (typeStage) {
  const typeButtons = document.querySelectorAll('[data-type-action]');
  typeButtons.forEach(btn => btn.addEventListener('click', () => {
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const a = btn.dataset.typeAction;
    if (a === 'small') typeStage.style.fontSize = '12px';
    if (a === 'comfortable') typeStage.style.fontSize = '18px';
    if (a === 'wide') typeStage.style.maxWidth = '100%';
    if (a === 'narrow') typeStage.style.maxWidth = '650px';
    if (a === 'tight') typeStage.style.setProperty('--customLine', '1.05');
    if (a === 'open') typeStage.style.setProperty('--customLine', '1.65');
    typeStage.querySelectorAll('p').forEach(p => { p.style.lineHeight = getComputedStyle(typeStage).getPropertyValue('--customLine') || '1.55' });
  }));
}
const scale = document.querySelector('#scaleRange');
if (scale) {
  const output = document.querySelector('#scaleOutput');
  scale.addEventListener('input', () => {
    const v = Number(scale.value);
    output.querySelector('[data-h1]').style.fontSize = `${38 + v * 4}px`;
    output.querySelector('[data-h2]').style.fontSize = `${24 + v * 2}px`;
    output.querySelector('[data-p]').style.fontSize = `${16 + v}px`;
  });
}
