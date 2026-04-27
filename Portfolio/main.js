/* ============================================
   main.js — App Initialization & Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Render dynamic content ── */
  renderSkills();
  renderProjects();
  renderContact();
  renderFooterLinks();

  /* ── 2. Footer year ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── 3. Mobile navigation toggle ── */
  initNav();

  /* ── 4. Scroll-based reveals (Intersection Observer) ── */
  initScrollReveal();

  /* ── 5. Skill bar animations ── */
  initSkillBars();

  /* ── 6. Contact form ── */
  initContactForm();

  /* ── 7. Active nav link on scroll ── */
  initActiveNav();

});

/* ============================================
   Navigation
   ============================================ */
function initNav() {
  const toggle   = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggle || !navLinks) return;

  /* Toggle open/close */
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    navLinks.classList.toggle('is-open', !isOpen);
  });

  /* Close on link click (mobile) */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
    });
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
    }
  });
}

/* ============================================
   Scroll Reveal — Intersection Observer
   ============================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal--left, .reveal-stagger');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); /* fire once */
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => observer.observe(el));
}

/* ============================================
   Skill Bars — animate width on scroll
   ============================================ */
function initSkillBars() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateSkillBars(); /* from render.js */
          observer.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(skillsSection);
}

/* ============================================
   Active Nav Link on Scroll
   ============================================ */
function initActiveNav() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.setAttribute('aria-current', 'true');
            }
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(sec => observer.observe(sec));
}

/* ============================================
   Contact Form — Validation & Submission
   ============================================ */
function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* Clear previous state */
    clearErrors(form);
    setStatus('', '');

    const data = {
      name:    form.name.value.trim(),
      email:   form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    };

    /* Client-side validation */
    const errors = validate(data);
    if (errors.length) {
      errors.forEach(({ field, msg }) => showFieldError(form, field, msg));
      setStatus('Please fix the errors above.', 'error-msg');
      return;
    }

    /* Simulate submission (replace with real API call) */
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    try {
      await simulateSend(data);
      setStatus('Message sent! I\'ll be in touch soon.', 'success');
      form.reset();
    } catch (err) {
      setStatus('Something went wrong. Please try again.', 'error-msg');
    } finally {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
  });

  /* Live error clearing */
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });
}

/* ── Validation helpers ── */
function validate(data) {
  const errors = [];
  if (!data.name)                      errors.push({ field: 'name',    msg: 'Name is required.' });
  if (!data.email)                     errors.push({ field: 'email',   msg: 'Email is required.' });
  else if (!isValidEmail(data.email))  errors.push({ field: 'email',   msg: 'Please enter a valid email.' });
  if (!data.message)                   errors.push({ field: 'message', msg: 'Message is required.' });
  return errors;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(form, field, msg) {
  const input = form[field];
  if (input) input.classList.add('error');

  /* Optionally surface message in an aria-live region */
  console.warn(`Form error [${field}]: ${msg}`);
}

function clearErrors(form) {
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function setStatus(msg, type) {
  const status = document.getElementById('form-status');
  if (!status) return;
  status.textContent = msg;
  status.className = 'form-status ' + (type || '');
}

/**
 * Simulated async send — replace with fetch() to your backend or a service
 * like Formspree, EmailJS, or Netlify Forms.
 *
 * @example
 * // Formspree example:
 * const res = await fetch('https://formspree.io/f/YOUR_ID', {
 *   method: 'POST',
 *   headers: { 'Accept': 'application/json' },
 *   body: JSON.stringify(data),
 * });
 * if (!res.ok) throw new Error('Send failed');
 */
function simulateSend(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Form data (simulated send):', data);
      resolve();
    }, 1200);
  });
}
