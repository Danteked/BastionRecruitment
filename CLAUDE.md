# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Server

Serve the site locally with:
```
python3 -m http.server 8788
```
Then open `http://localhost:8788/` in a browser.

**Important:** The Claude Code preview tool serves from a scratchpad copy, not the live files. After every file edit, copy changed files to the scratchpad path shown in the session so the preview reflects changes. Hard refresh in browser with Cmd+Shift+R to bust CSS/JS cache.

## Architecture

This is a static HTML/CSS/JS recruitment website with no build step, bundler, or framework — just files served directly.

### File structure
- `index.html` — Homepage (hero, marquee, image accordion, stats, services preview, quote)
- `about.html` — About page (story, philosophy cards, team/bio section, industries)
- `services.html` — Services page (employer + jobseeker sections, process steps, industry cards)
- `jobs.html` — Job listings with filter pills
- `contact.html` — Contact page with two forms (employer vacancy, candidate CV)
- `assets/css/style.css` — Single stylesheet for the entire site
- `assets/js/main.js` — Single JS file for the entire site
- `assets/img/` — All images including logo variants and accordion panel images

### CSS architecture
All styles are in `style.css` using CSS custom properties defined on `:root`:
- Colours: `--teal`, `--teal-light`, `--teal-dim`, `--bg`, `--bg-card`, `--bg-alt`, `--line`, `--text-dim`
- Spacing scale: `--space-1` through `--space-8` (no `--space-9`)
- Fonts: `--font-body` (Inter), `--font-display` (Sora), `--font-mono` (JetBrains Mono)

### JS architecture
`main.js` initialises all behaviour from a single `DOMContentLoaded` listener:
- `initHeaderScroll` — adds `.scrolled` class to header on scroll
- `initMobileNav` — hamburger menu toggle
- `initScrollReveal` — IntersectionObserver adds `.is-visible` to `.reveal` elements
- `initImageAccordion` — mouseenter/focus expands `.img-accordion-item` with `.is-active`
- `initJobFilters` — filter pills show/hide `[data-job-category]` cards
- `initFormValidation` — validates `form[data-validate]` on submit
- `initYear` — sets `#year` text to current year

### Key patterns
- **Scroll reveal:** Add class `reveal` to any element; JS adds `is-visible` when it enters viewport. Use CSS variable `--i` (integer) on the element for staggered delay.
- **Image accordion:** Three `.img-accordion-item` divs inside `.img-accordion`. Active item gets `flex: 6` and Ken Burns animation. Background images set via inline `style` attribute.
- **Hero lava lamp:** Five animated radial gradient blobs (`.hero::before`, `.hero::after`, `.hero-glow-3/4/5`) using `drift-a` through `drift-e` keyframes. Vertical translation in keyframes is intentionally kept under 6% to prevent the dark background showing at the top edge.
- **Marquee:** Duplicate the item list twice inside `.marquee` for seamless infinite scroll. Animation runs at `55s` and must use `!important` on `animation-play-state: running` to prevent hover-pause.

### Brand
- Primary colour: teal `#19a0a6`
- Business: Bastion Recruitment, boutique Melbourne recruitment consultancy
- Industries: Defence, Manufacturing, Power
- Contact: stephen@bastiongrp.com.au · +61 432 010 679 · Suite 814, 1 Queens Road, Melbourne 3004
