# Portfolio — Alex Rivera

A clean, responsive personal portfolio website built with semantic HTML5, modular CSS, and vanilla JavaScript. No frameworks or build tools required — open `index.html` in any browser and it just works.

---

## Folder Structure

```
Portfolio/
├── index.html              ← Entry point
├── README.md               ← This file
│
├── css/
│   ├── reset.css           ← CSS reset & base normalization
│   ├── variables.css       ← Design tokens (colors, fonts, spacing)
│   ├── style.css           ← Main component styles
│   ├── animations.css      ← Keyframes & scroll-reveal utilities
│   └── responsive.css      ← Breakpoints & media queries
│
├── js/
│   ├── data.js             ← All portfolio content (edit this!)
│   ├── render.js           ← DOM rendering helpers
│   └── main.js             ← App init, nav, observers, form logic
│
└── assets/
    ├── images/
    │   └── profile.jpg     ← (Add your photo here)
    └── fonts/              ← (Optional: self-hosted fonts)
```

---

## Quick Start

1. **Open** `index.html` in your browser — no server needed.
2. **Edit your content** in `js/data.js` — name, bio, skills, projects, and contact info all live there.
3. **Add your photo** to `assets/images/profile.jpg` and update the `<img>` tag in `index.html` inside `.hero__avatar`.

---

## Customising Content

All portfolio content is centralised in `js/data.js`. You only need to edit that one file to update:

| Key | What it controls |
|-----|-----------------|
| `owner` | Your name, title, bio |
| `contact` | Email, LinkedIn, GitHub, location |
| `social` | Footer social links |
| `skills` | Skill cards with proficiency levels |
| `projects` | Project cards with title, description, URL |

---

## Customising Styles

Design tokens are in `css/variables.css`. Change the accent colour, fonts, or spacing scale there — changes cascade everywhere automatically.

```css
:root {
  --color-accent: #c8522a;  /* ← Change this to your brand colour */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;
}
```

---

## Connecting a Contact Form

The form currently simulates a send. To connect a real backend, replace `simulateSend()` in `js/main.js`:

**Formspree (easiest):**
```js
const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
if (!res.ok) throw new Error('Send failed');
```

**Netlify Forms:** Add `data-netlify="true"` to the `<form>` tag and remove the JS fetch — Netlify handles the rest.

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | ✓ Latest |
| Firefox | ✓ Latest |
| Safari  | ✓ 14+    |
| Edge    | ✓ Latest |

Uses: CSS Custom Properties, CSS Grid, Intersection Observer, `async/await`. All widely supported in modern browsers. Falls back gracefully in older environments.

---

## Accessibility

- Semantic HTML5 landmarks (`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`)
- ARIA labels on interactive elements
- `aria-live` region for form status messages
- `aria-current` on active nav links
- `prefers-reduced-motion` override in `animations.css`
- Keyboard navigable — `:focus-visible` styles in `reset.css`
- Progressbar roles on skill bars

---

## Deployment

Drop the entire `Portfolio/` folder onto any static host:

- **GitHub Pages** — push to a repo and enable Pages in settings
- **Netlify** — drag & drop the folder on netlify.com/drop
- **Vercel** — `vercel deploy` from the folder
- **Any web host** — upload via FTP

---

## License

Feel free to use this as a starting point for your own portfolio. Attribution appreciated but not required.
