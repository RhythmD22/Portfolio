# Portfolio

> Personal portfolio — design and front-end projects by Rhythm Desai.

[![PWA Ready](https://img.shields.io/badge/PWA-ready-brightgreen)](#progressive-web-app-pwa-support)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue)](https://rhythmd22.github.io/Portfolio/)

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Install](#install)
- [Architecture](#architecture)
- [Design System](#design-system)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [PWA Support](#progressive-web-app-pwa-support)

---

## Features

| Feature | Description |
|---------|------------|
| Project Showcase | Case-study pages for UI/UX and development projects with videos, images, and write-ups |
| App Directory | Interactive Pokemon-style card grid with live demos of 6 web apps and Twine games |
| Twine Games | Two interactive fiction games built in Twine with custom-programmed minigames |
| Dark Mode | Auto-detects system preference with persistent toggle across all pages |
| Responsive Design | Mobile-optimized layout with swipe-friendly navigation and hamburger menu |
| Pull-to-Refresh | Native-feel pull-down gesture on mobile to reload the page at the top |
| PWA Installable | Add to home screen for a native app experience with offline support |
| Resume | Embedded Google Doc viewer with PDF download link |

---

## Demo

Live GitHub Pages deployment:  
[https://rhythmd22.github.io/Portfolio/](https://rhythmd22.github.io/Portfolio/)

---

## Install

```bash
git clone https://github.com/rhythmd22/Portfolio.git
cd Portfolio
```

Then serve the directory with any static web server:

```bash
python3 -m http.server
```

Open `http://localhost:8000` in your browser. You can also open `index.html` directly.

---

## Architecture

```
Portfolio/
├── .gitignore                     # Git ignore rules
├── index.html                     # Home page (bio, projects, apps, about, resume)
├── Financier.html                 # Financier project case study
├── SmartShuttle.html              # SmartShuttle project case study
├── Clash Royale Redesign.html     # Clash Royale project case study
├── header.html                    # Shared header snippet (injected via JS)
├── footer.html                    # Shared footer snippet (injected via JS)
├── css/
│   ├── styles.css                 # Shared reset, variables, layout
│   ├── index.css                  # Home page styles
│   ├── work.css                   # Project cards and thumbnail styles
│   ├── apps.css                   # App directory card styles
│   ├── resume.css                 # Resume embed styles
│   ├── about.css                  # About section styles
│   ├── project.css                # Shared project page styles
│   ├── financier.css              # Financier project styles
│   ├── smartshuttle.css           # SmartShuttle project styles
│   └── clashroyale.css            # Clash Royale project styles
├── js/
│   ├── templates.js               # Injects shared header/footer into pages
│   ├── navigation.js              # SPA-style page navigation
│   ├── nav-bubble.js              # Navigation pill hover effect
│   ├── dark-mode.js               # System-aware dark mode with toggle
│   ├── scroll.js                  # Scroll animations and effects
│   ├── pull-to-refresh.js         # Mobile pull-down reload gesture
│   ├── clock.js                   # Real-time footer clock
│   ├── index.js                   # Home page interactivity
│   ├── apps.js                    # App card expand/collapse logic
│   ├── financier.js               # Financier page interactivity
│   ├── smartshuttle.js            # SmartShuttle page interactivity
│   ├── clashroyale.js             # Clash Royale page interactivity
│   └── chart-utils.js             # Chart.js helpers — options, create, theme observer
├── images/                        # Global icons, profile images, and project assets
├── Twine/                         # Published Twine HTML stories
├── manifest-dark.json             # PWA manifest (dark mode icons)
├── manifest-light.json            # PWA manifest (light mode icons)
└── service-worker.js              # Offline caching and PWA support
```

The site is a multi-page HTML application. The header and footer are injected via `templates.js` for consistency across pages. Navigation is handled client-side by `navigation.js`, which shows/hides page sections using `display` toggles. Dark mode is managed by `dark-mode.js` with `localStorage` persistence. Project pages load their own dedicated CSS and JS files.

---

## Design System

The CSS is built on a token-based design system defined in `css/styles.css`. All spacing, typography, border-radius, and shadow values reference these tokens rather than raw values.

### Type Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--text-xs` | `0.75rem` | Captions, meta labels |
| `--text-sm` | `0.875rem` | Navigation, secondary text, meta |
| `--text-base` | `1rem` | Body text, footer links |
| `--text-lg` | `1.15rem` | Large body, project overviews |
| `--text-xl` | `1.5rem` | Section titles, card headings |
| `--text-2xl` | `2rem` | Page titles, hero headings |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | `0.25rem` | Micro gaps (heading-to-description) |
| `--space-2` | `0.5rem` | Tight gaps, icon spacing |
| `--space-3` | `0.75rem` | Footer nav gaps |
| `--space-4` | `1rem` | Standard element spacing |
| `--space-6` | `1.5rem` | Medium section gaps |
| `--space-8` | `2rem` | Card padding, standard section spacing |
| `--space-12` | `3rem` | Large section margins |
| `--space-16` | `4rem` | Major section separation |
| `--space-32` | `8rem` | Extra-large separation |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `4px` | Subtle corners (info-meta, icons) |
| `--radius-md` | `8px` | Standard cards |
| `--radius-lg` | `12px` | Project thumbnails |
| `--card-radius` | `var(--radius-md)` | All content cards (outcomes, reflection, problem statements) |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.06)` | Subtle card elevation |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.08)` | Elevated cards (content, problem statements) |
| `--shadow-lg` | `0 8px 30px rgba(0,0,0,0.12)` | Heavy elevation |
| `--card-shadow` | `var(--shadow-sm)` | Default card shadow |
| `--card-shadow-heavy` | `var(--shadow-md)` | Prominent card shadow |

### Card Pattern

All content cards share a consistent recipe:

```css
.card {
  background: var(--card-bg);
  color: var(--card-text);
  padding: var(--space-8);
  box-shadow: var(--card-shadow);
  border-radius: var(--card-radius);
}
```

Project accent cards add `border: 4px solid <project-color>` for visual identity:
- Financier: `#4f84ef` (blue)
- SmartShuttle: `#6a63f6` (purple)
- Clash Royale: `#dc3e3d` (red)

### Theme Variables

Dark mode is controlled via `[data-theme="dark"]` on `<html>`, swapping CSS custom properties. Tokens like `--text-*`, `--space-*`, `--radius-*`, and `--shadow-*` are theme-agnostic. Theme-sensitive values (`--background-color`, `--text-color`, `--card-bg`, `--card-shadow`, etc.) have light and dark variants.

### Glassmorphism

Pill buttons (navigation, dark mode toggle, contact, download) use a shared glass effect kept separate from the shadow tokens:

```css
background: rgba(250, 239, 216, 0.7);
backdrop-filter: blur(12px);
border: 1px solid var(--border-color);
box-shadow:
  0 4px 16px rgba(0, 0, 0, 0.08),
  inset 0 1px 0 rgba(255, 255, 255, 0.5);
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Core | HTML5, CSS3, JavaScript (ES6+) |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter), [VT323](https://fonts.google.com/specimen/VT323) |
| Icons | [Font Awesome 7](https://fontawesome.com) (CDN) |
| Charts | [Chart.js 4](https://www.chartjs.org) (CDN) |
| Lightbox | [Fancybox UI 6](https://fancyapps.com) (CDN) |
| Animation | [dotLottie Web Component](https://github.com/LottieFiles/dotlottie-web) |
| Analytics | Google Analytics (gtag) |
| Hosting | GitHub Pages |
| PWA | Service Worker API, Web App Manifest |

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (optional, for running a local server)

### Local Setup

1. Clone the repository
2. Start a local server from the project directory:
   ```bash
   python3 -m http.server
   ```
3. Open `http://localhost:8000` in your browser

No dependencies to install, no build steps required.

---

## Progressive Web App (PWA) Support

The portfolio can be installed on mobile devices:

1. On iOS, open [https://rhythmd22.github.io/Portfolio/](https://rhythmd22.github.io/Portfolio/) in Safari
2. Tap **Share** → **Add to Home Screen**
3. The app launches in standalone full-screen mode with offline support

The PWA includes a custom pull-to-refresh gesture — pull down from the top on mobile to reload the page. Manifests include both light and dark mode variants. The service worker caches static assets for offline access.

---

## License

MIT © [Rhythm Desai](LICENSE)