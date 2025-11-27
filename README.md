# Joe Sturdy CV

Single-page CV with glassmorphism design theme. Open `index.html` in any modern browser to preview.

## Quick Start

```bash
npm install        # first time only
npm run export:pdf # generates Joe-Sturdy-CV.pdf
```

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
├── index.html              # Main CV file
├── scripts/
│   └── export-pdf.js      # Puppeteer PDF export script
├── avatar.jpeg             # Profile image
├── Futuristic-Gold-and-Black.jpg  # Background image
└── package.json            # Dependencies (Puppeteer)
```

