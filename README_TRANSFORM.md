# Static Website Transformation (GitHub Pages Compatible)

This repo now includes a modular, static-friendly structure under `/css`, `/js`, and `/assets` that matches the guide you shared. It coexists with the current site (`styles.css`, `main.js`) so we can migrate gradually without breaking pages.

## New Structure
- css/
  - main.css: Tokens, fonts, base, command palette modal styles
  - animations.css: Terminal headers, AOS, matrix, magnetic buttons
  - islamic-patterns.css: Islamic star overlay + mashrabiya image effect
  - glassmorphism.css: Bento grid + glass morph styles
- js/
  - particles.js: DNA-like particles canvas (no deps)
  - animations.js: Typing headers, matrix rain, AOS, counters, magnetic buttons
  - command-palette.js: Standalone command palette module
  - easter-eggs.js: Konami code + console messages
- assets/
  - patterns/islamic-star.svg: subtle Islamic geometric pattern

## How to Enable (non-breaking, page by page)
1) In `<head>` of the page you want to enhance:

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Noto+Kufi+Arabic:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="css/animations.css">
<link rel="stylesheet" href="css/glassmorphism.css">
<link rel="stylesheet" href="css/islamic-patterns.css">

2) Before `</body>` add optional containers:

<canvas id="particles-canvas"></canvas>
<div id="matrix-rain"></div>

3) Include the JS modules after your existing scripts (or replace them stepwise):

<script src="js/particles.js" defer></script>
<script src="js/animations.js" defer></script>
<script src="js/command-palette.js" defer></script>
<script src="js/easter-eggs.js" defer></script>

4) Use components in markup:
- Terminal header: 
  <h2 class="terminal-header" data-text="RESEARCH_PROJECTS"><span class="prefix">&gt;_</span><span class="typing-text"></span><span class="cursor">|</span></h2>
- Bento grid container: 
  <div class="bento-grid" id="projects-grid"><div class="bento-item bento-large"><div class="islamic-overlay"></div>...</div></div>
- Magnetic button: 
  <button class="magnetic-button" data-magnetic><span class="button-text">View Research</span><div class="button-bg"></div></button>
- Command palette shell near end of body (optional):
  <div id="command-palette" class="command-palette" style="display:none;"><div class="command-overlay"></div><div class="command-modal"><input type="text" class="command-input" placeholder="Type a command or search..."><div class="command-results"><div class="command-section"><div class="command-item" data-action="projects"><span class="command-icon">📊</span><span class="command-text">View Projects</span><span class="command-shortcut">⌘P</span></div></div></div></div></div>

## Notes
- This is additive. Nothing is removed. When ready, we can retire `main.js` matrix rain and migrate to `js/animations.js`/`js/particles.js` to avoid duplication.
- All assets are lightweight and GitHub Pages friendly.
- You can continue using the `hassanalabs-theme/` pack alongside this; or we can merge tokens for a single-theme approach.

## Next Steps (recommend)
- Pick one particle path (existing helix vs new particles canvas) and disable the other.
- Add an actual project bento section to `index.html` using the new grid.
- Drop one real workshop photo and a Hassana portrait for the `.image-container` effect.
- Provide a 1200x630 OG image to replace `favicon.svg` in meta.
