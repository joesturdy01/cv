# Joe Sturdy CV

Single-page CV with glassmorphism design theme. Open `index.html` in any modern browser to preview.

## Quick Start

```bash
npm install        # first time only
npm run export:pdf # generates Joe-Sturdy-CV.pdf
```

## What's in each file

- `index.html` – The only HTML page. It holds the CV content plus lightweight comments that explain each section like a storyboard.
- `styles/main.css` – All styling rules grouped by topic (theme, layout, cards, skills, print, ATS helpers). Treat it as the wardrobe that dresses the HTML skeleton.
- `scripts/export-pdf.js` – Node/Puppeteer script that spins up a headless Chrome tab, waits for every asset to load, and prints a razor-sharp A4 PDF.
- `avatar.jpeg` – Profile photo displayed inside the circular avatar.
- `Futuristic-Gold-and-Black.jpg` – Background image that gives the glassmorphism effect.
- `package.json` / `package-lock.json` – Node manifest and lockfile so everyone installs the exact same Puppeteer version.
- `Joe-Sturdy-CV.pdf` – Latest generated PDF output. Recreate it anytime with `npm run export:pdf`.

## Architecture at a glance

1. **Static content (`index.html`)** structures the CV inside a two-column grid. Inline comments explain what each block does so quick edits feel safe.
2. **Presentation (`styles/main.css`)** defines theme variables once, then reuses them for cards, grids, and print overrides. Sections are labeled in plain English.
3. **Automation (`scripts/export-pdf.js`)** loads the page in Puppeteer, ensures fonts/images/backdrops are ready, and exports a tagged PDF so ATS scanners stay happy.

## Design Specifications

When modifying the CV, maintain these specifications to ensure consistent appearance and proper PDF export:

### Dimensions
- **Page size**: A4 (210mm × 297mm) - critical for PDF export
- **Viewport**: Fixed to A4 dimensions in both web and print media

### Color Palette
Defined in CSS variables (`:root`):
- `--bg-dark`: `#020204` (background)
- `--gold`: `#f4c96b` (primary accent)
- `--gold-soft`: `#f0d89a` (secondary accent)
- `--text-main`: `#ffffff` (primary text)
- `--text-muted`: `#d0d3dc` (secondary text)

### Styling Approach
- **Glassmorphism**: Uses `backdrop-filter: blur(24px)` and semi-transparent backgrounds (`rgba(8, 8, 16, 0.25)`)
- **Border radius**: `25px` for cards, `999px` for pills/badges
- **Typography**: Tomorrow font family (Google Fonts)

### Key CSS Classes
- `.glass-card` - Main card container with glassmorphism effect
- `.card-grid` - 2-column grid layout for CV sections
- `.info-bubble` - Contact information pills
- `.bullet-list` - Bulleted lists for experience/projects
- `.skills-layout` - Skills section layout
- `.card-span-2` - Full-width cards spanning both columns

### PDF Export Considerations
- Background images must be loaded (handled automatically by export script)
- Print media queries in `@media print` ensure A4 layout
- `printBackground: true` in Puppeteer config preserves backgrounds
- All fonts and images are preloaded before PDF generation

## File Structure

```
├── index.html                    # CV content + semantic layout
├── styles/
│   └── main.css                  # Themed styling + print rules
├── scripts/
│   └── export-pdf.js             # Puppeteer PDF export helper
├── avatar.jpeg                   # Profile image
├── Futuristic-Gold-and-Black.jpg # Background image
├── Joe-Sturdy-CV.pdf             # Generated PDF output
├── package.json                  # Node metadata and scripts
└── package-lock.json             # Locked dependency tree
```

