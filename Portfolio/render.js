/* ============================================
   render.js — DOM Rendering from data.js
   Builds dynamic sections from PORTFOLIO data.
   ============================================ */

/**
 * Render skill cards into #skills-grid
 */
function renderSkills() {
  const grid = document.getElementById('skills-grid');
  if (!grid || !PORTFOLIO.skills) return;

  grid.classList.add('reveal-stagger');

  const fragment = document.createDocumentFragment();

  PORTFOLIO.skills.forEach(skill => {
    const card = document.createElement('article');
    card.className = 'skill-card';
    card.setAttribute('aria-label', skill.name);

    card.innerHTML = `
      <div class="skill-card__icon" aria-hidden="true">${escapeHTML(skill.icon)}</div>
      <h3 class="skill-card__name">${escapeHTML(skill.name)}</h3>
      <p class="skill-card__desc">${escapeHTML(skill.desc)}</p>
      <div class="skill-card__bar-wrap" role="progressbar"
           aria-valuenow="${skill.level}"
           aria-valuemin="0"
           aria-valuemax="100"
           aria-label="${escapeHTML(skill.name)} proficiency ${skill.level}%">
        <div class="skill-card__bar" data-level="${skill.level}"></div>
      </div>
    `;

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

/**
 * Animate skill bars when they enter the viewport.
 * Called after Intersection Observer fires on .skills section.
 */
function animateSkillBars() {
  document.querySelectorAll('.skill-card__bar').forEach(bar => {
    const level = bar.getAttribute('data-level');
    bar.style.width = level + '%';
  });
}

/**
 * Render project cards into #projects-grid
 */
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid || !PORTFOLIO.projects) return;

  grid.classList.add('reveal-stagger');

  const fragment = document.createDocumentFragment();

  PORTFOLIO.projects.forEach(project => {
    const card = document.createElement('article');
    card.className = 'project-card reveal';

    card.innerHTML = `
      <div class="project-card__thumb ${escapeHTML(project.thumb)}">
        <span class="project-card__thumb-label" aria-hidden="true">${escapeHTML(project.number)}</span>
        <span class="project-card__tag">${escapeHTML(project.tag)}</span>
      </div>
      <div class="project-card__body">
        <h3 class="project-card__title">${escapeHTML(project.title)}</h3>
        <p class="project-card__desc">${escapeHTML(project.desc)}</p>
        <a class="project-card__link" href="${escapeHTML(project.url)}"
           ${project.url !== '#' ? 'target="_blank" rel="noopener"' : ''}>
          View Project →
        </a>
      </div>
    `;

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

/**
 * Render contact list items into #contact-list
 */
function renderContact() {
  const list = document.getElementById('contact-list');
  if (!list || !PORTFOLIO.contact) return;

  const fragment = document.createDocumentFragment();

  PORTFOLIO.contact.forEach(item => {
    const li = document.createElement('li');
    li.className = 'contact-item';

    const valueHTML = item.href
      ? `<a class="contact-item__value" href="${escapeHTML(item.href)}"
           ${item.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
           ${escapeHTML(item.value)}
         </a>`
      : `<span class="contact-item__value">${escapeHTML(item.value)}</span>`;

    li.innerHTML = `
      <div class="contact-item__dot" aria-hidden="true"></div>
      <div>
        <span class="contact-item__label">${escapeHTML(item.label)}:</span>
        ${valueHTML}
      </div>
    `;

    fragment.appendChild(li);
  });

  list.appendChild(fragment);
}

/**
 * Render footer social links into #footer-links (if element exists)
 */
function renderFooterLinks() {
  const nav = document.querySelector('.footer__links');
  if (!nav || !PORTFOLIO.social) return;

  nav.innerHTML = '';
  const fragment = document.createDocumentFragment();

  PORTFOLIO.social.forEach(link => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="${escapeHTML(link.href)}" target="_blank" rel="noopener">
        ${escapeHTML(link.label)}
      </a>
    `;
    fragment.appendChild(li);
  });

  nav.appendChild(fragment);
}

/**
 * Simple HTML escape to prevent XSS from data values
 */
function escapeHTML(str) {
  if (typeof str !== 'string') return String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
