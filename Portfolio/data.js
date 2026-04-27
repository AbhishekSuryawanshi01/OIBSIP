/* ============================================
   data.js — Portfolio Content & Configuration
   Edit this file to update your portfolio content.
   ============================================ */

const PORTFOLIO = {

  /* ── Owner Info ── */
  owner: {
    name:     'Alex Rivera',
    title:    'Frontend Developer & UI Designer',
    bio:      'Frontend developer & UI designer crafting thoughtful digital experiences. I blend clean code with intentional design to build things that feel as good as they look.',
    location: 'San Francisco, CA (Remote-friendly)',
    available: true,
  },

  /* ── Contact Info ── */
  contact: [
    { label: 'Email',    value: 'alex@example.com',              href: 'mailto:alex@example.com' },
    { label: 'LinkedIn', value: 'linkedin.com/in/alexrivera',    href: 'https://linkedin.com/in/alexrivera' },
    { label: 'GitHub',   value: 'github.com/alexrivera',         href: 'https://github.com/alexrivera' },
    { label: 'Location', value: 'San Francisco, CA (Remote-friendly)', href: null },
  ],

  /* ── Social Links (Footer) ── */
  social: [
    { label: 'Twitter',  href: 'https://twitter.com' },
    { label: 'GitHub',   href: 'https://github.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Dribbble', href: 'https://dribbble.com' },
  ],

  /* ── Skills ── */
  skills: [
    {
      icon:  'H',
      name:  'HTML & CSS',
      desc:  'Semantic markup, responsive layouts, animations, and pixel-perfect styling.',
      level: 95,   /* percentage 0–100 */
    },
    {
      icon:  'JS',
      name:  'JavaScript',
      desc:  'ES6+, DOM manipulation, async patterns, and modern framework fluency.',
      level: 88,
    },
    {
      icon:  'R',
      name:  'React',
      desc:  'Component-driven UIs, hooks, state management, and performance optimization.',
      level: 82,
    },
    {
      icon:  'UI',
      name:  'UI Design',
      desc:  'Figma prototyping, design systems, typography, and visual hierarchy.',
      level: 78,
    },
    {
      icon:  'G',
      name:  'Git & GitHub',
      desc:  'Version control, collaboration workflows, branching, and code review.',
      level: 85,
    },
    {
      icon:  'A',
      name:  'Accessibility',
      desc:  'WCAG compliance, ARIA roles, keyboard navigation, and inclusive design.',
      level: 75,
    },
  ],

  /* ── Projects ── */
  projects: [
    {
      number:  '01',
      tag:     'Web App',
      thumb:   'thumb--1',
      title:   'Budget Tracker Dashboard',
      desc:    'A responsive personal finance app with data visualization, category filters, and monthly trend analysis built with vanilla JS and CSS Grid.',
      url:     '#',
    },
    {
      number:  '02',
      tag:     'E-Commerce',
      thumb:   'thumb--2',
      title:   'Artisan Shop UI',
      desc:    'A full product listing and cart experience for a handmade goods store. Focused on accessibility and mobile-first design patterns.',
      url:     '#',
    },
    {
      number:  '03',
      tag:     'Landing Page',
      thumb:   'thumb--3',
      title:   'SaaS Product Launch',
      desc:    'A high-conversion landing page with animated sections, testimonials, and a newsletter signup — built in React with scroll-triggered animations.',
      url:     '#',
    },
    {
      number:  '04',
      tag:     'Portfolio',
      thumb:   'thumb--4',
      title:   'Photography Portfolio',
      desc:    'A gallery-first portfolio for a freelance photographer featuring a masonry grid layout, lightbox viewer, and lazy-loaded images.',
      url:     '#',
    },
  ],

};
