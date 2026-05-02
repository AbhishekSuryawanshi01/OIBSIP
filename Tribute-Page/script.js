/* ============================================================
   TRIBUTE PAGE — Dr. APJ Abdul Kalam
   script.js — Scroll Animations & Interactivity
   ============================================================ */

"use strict";

/* ── Scroll Reveal ── */
const revealElements = document.querySelectorAll(
  ".timeline__item, .quote-card, .portrait-section__text, .portrait-section__image-wrap, .legacy-section__text, .legacy-section__image-wrap, .section-title, .stat"
);

revealElements.forEach((el) => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((el) => revealObserver.observe(el));

/* ── Hero Parallax ── */
const hero = document.getElementById("hero");
const heroGlow = document.querySelector(".hero__glow");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  if (hero && scrollY < window.innerHeight) {
    const heroContent = hero.querySelector(".hero__content");
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
      heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.75);
    }
    if (heroGlow) {
      heroGlow.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.1}px))`;
    }
  }
});

/* ── Timeline Dot Highlight on Scroll ── */
const timelineItems = document.querySelectorAll(".timeline__item");

const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty("--dot-glow", "1");
        entry.target.querySelector(".timeline__year").style.color =
          "var(--color-gold-light)";
      } else {
        entry.target.querySelector(".timeline__year").style.color =
          "var(--color-gold)";
      }
    });
  },
  { threshold: 0.5 }
);

timelineItems.forEach((item) => timelineObserver.observe(item));

/* ── Quote Cards Tilt Effect ── */
const quoteCards = document.querySelectorAll(".quote-card");

quoteCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(600px) rotateX(0) rotateY(0) translateY(0)";
    card.style.transition = "transform 0.5s ease";
  });

  card.addEventListener("mouseenter", () => {
    card.style.transition = "transform 0.1s ease";
  });
});

/* ── Smooth Scroll for any anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ── Stats Counter Animation ── */
const statNumbers = document.querySelectorAll(".stat__number");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.trim();
        const numMatch = raw.match(/(\d+)/);

        if (numMatch) {
          const target = parseInt(numMatch[1], 10);
          const prefix = raw.slice(0, numMatch.index);
          const suffix = raw.slice(numMatch.index + numMatch[0].length);
          let current = 0;
          const duration = 1200;
          const step = target / (duration / 16);

          const tick = () => {
            current = Math.min(current + step, target);
            el.textContent = prefix + Math.floor(current) + suffix;
            if (current < target) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        }
      }
    });
  },
  { threshold: 0.8 }
);

statNumbers.forEach((el) => counterObserver.observe(el));

/* ── Page Load Entrance ── */
window.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "0";
  requestAnimationFrame(() => {
    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = "1";
  });
});
