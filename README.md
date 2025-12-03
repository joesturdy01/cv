# Joe Sturdy CV

🌐 **[View Online Version](https://joesturdy01.github.io/cv/)**

Single-page CV with glassmorphism design theme. Open `index.html` in any modern browser to preview.

## Overview

This repository contains a modern, single-page CV built with HTML and CSS that can be viewed in a browser or exported to a professional PDF. The CV is optimized for both human readers and Applicant Tracking Systems (ATS), featuring:

- **Web Preview**: Beautiful glassmorphism design with interactive hover effects
- **PDF Export**: Automated A4 PDF generation using Puppeteer with full background preservation
- **ATS Optimization**: Hidden keyword section and structured data for maximum compatibility with recruitment systems
- **SEO & Metadata**: Comprehensive meta tags, Open Graph, Twitter cards, and Schema.org structured data
- **Accessibility**: Screen reader friendly with semantic HTML and proper ARIA considerations

## Quick Start

```bash
npm install        # first time only
npm run export:pdf # generates Joe-Sturdy-CV.pdf
npm run dev        # start live-server for local development
```

## Full Functionality

### Web Preview
The CV is designed to be viewed directly in a modern browser. The glassmorphism design creates a modern, professional appearance with:
- Semi-transparent cards with backdrop blur effects
- Interactive hover states that lift cards slightly
- Fixed background image that creates depth
- Responsive two-column grid layout optimized for A4 proportions

### PDF Export Process
The PDF export script (`scripts/export-pdf.js`) uses Puppeteer to:
1. Launch a headless Chrome browser instance
2. Set viewport to exact A4 dimensions (210mm × 297mm)
3. Emulate print media to trigger print-specific CSS
4. Load the HTML file and wait for all assets:
   - Custom fonts (Tomorrow from Google Fonts)
   - Regular images (avatar)
   - CSS background images (glassmorphism backdrop)
5. Normalize tel: and mailto: links for PDF compatibility
6. Generate a tagged PDF with accessibility features enabled
7. Save to `dist/Joe-Sturdy-CV.pdf`

The PDF maintains the exact visual appearance of the web version, including backgrounds, colors, and layout.

### ATS Optimization
Applicant Tracking Systems scan CVs for keywords and structured data. This CV includes:

- **Hidden Keywords Section**: An invisible (but machine-readable) section containing relevant job titles, skills, industries, and certifications in various formats
- **Structured Data**: Schema.org JSON-LD markup that search engines and ATS systems can parse
- **Semantic HTML**: Proper use of semantic elements (`<header>`, `<section>`, `<article>`, `<time>`, `<address>`) that ATS systems understand
- **Data Attributes**: HTML5 data attributes on experience entries for programmatic parsing

The `.ats-only` class uses CSS to hide content visually while keeping it accessible to screen readers and ATS scanners.

### SEO and Metadata Features
The CV includes comprehensive metadata for discoverability:

- **Basic Meta Tags**: Description, keywords, author, robots directives
- **Open Graph Tags**: For rich previews when shared on Facebook/LinkedIn
- **Twitter Cards**: Optimized preview for Twitter sharing
- **Schema.org Structured Data**: Machine-readable JSON-LD containing:
  - Personal information (name, contact details)
  - Professional role and organization
  - Education history
  - Skills and expertise
  - Awards and certifications
  - Work experience (via data attributes)

This metadata helps search engines understand the CV content and can improve visibility in search results.

### Development Workflow
- **`npm run dev`**: Starts a live-server on port 3000 that automatically reloads when files change. Opens the CV in your default browser for real-time preview during development.
- **`npm run export:pdf`**: Generates a fresh PDF from the current HTML/CSS state. Use this after making any content or styling changes.

## What's in each file

- `index.html` – The only HTML page. Contains semantic CV content, metadata, Schema.org structured data, and hidden ATS keywords. Structured with a two-column grid layout using semantic HTML5 elements.
- `styles/main.css` – Complete styling system organized by topic:
  - Theme variables (colors, spacing, typography)
  - Base resets and typography defaults
  - Layout system (CV shell, grid, cards)
  - Glassmorphism component styles
  - Skills section layout
  - Print media queries for PDF export
  - Accessibility helpers (ATS-only visibility)
- `scripts/export-pdf.js` – Node.js/Puppeteer automation script that:
  - Launches headless Chrome
  - Configures A4 viewport and print emulation
  - Waits for all assets (fonts, images, backgrounds) to load
  - Normalizes links for PDF compatibility
  - Generates tagged, accessible PDF with metadata
- `assets/avatar.jpeg` – Profile photo displayed in a circular avatar in the Personal Info section
- `assets/Futuristic-Gold-and-Black.jpg` – Background image that creates the glassmorphism backdrop effect
- `package.json` / `package-lock.json` – Node.js project manifest and dependency lockfile ensuring consistent Puppeteer and live-server versions across environments
- `dist/Joe-Sturdy-CV.pdf` – Generated PDF output. Recreate it anytime with `npm run export:pdf`

## Architecture at a glance

The CV follows a clean separation of concerns:

1. **Content Layer (`index.html`)**:
   - Semantic HTML5 structure with proper document outline
   - Two-column CSS Grid layout for organized content presentation
   - Comprehensive metadata in `<head>` for SEO and social sharing
   - Schema.org JSON-LD structured data for machine readability
   - Hidden ATS keywords section for applicant tracking system compatibility
   - Data attributes on experience entries for programmatic parsing

2. **Presentation Layer (`styles/main.css`)**:
   - CSS custom properties (variables) for theme consistency
   - Modular styling organized by functional area
   - Glassmorphism effects using backdrop-filter and transparency
   - Responsive grid system optimized for A4 proportions
   - Print media queries that override screen styles for PDF export
   - Accessibility helpers for screen readers and ATS systems

3. **Automation Layer (`scripts/export-pdf.js`)**:
   - Puppeteer-based headless browser automation
   - Asset preloading (fonts, images, backgrounds) before PDF generation
   - A4 viewport configuration matching print dimensions
   - Print media emulation to trigger print-specific CSS
   - Link normalization for PDF compatibility
   - Tagged PDF generation with accessibility features enabled

## Design Specifications

When modifying the CV, maintain these specifications to ensure consistent appearance and proper PDF export:

### Dimensions
- **Page size**: A4 (210mm × 297mm) - critical for PDF export
- **Viewport**: Fixed to A4 dimensions in both web and print media
- **Grid**: Two-column layout with 20px gaps between cards
- **Padding**: 20px outer padding on the card grid container

### Color Palette
Defined in CSS variables (`:root`) for easy theme customization:
- `--bg-dark`: `#020204` (main background color)
- `--bg-dark-alt`: `#050608` (alternative dark background)
- `--bg-card`: `rgba(8, 8, 10, 0.85)` (card background opacity)
- `--glass-highlight`: `rgba(255, 255, 255, 0.16)` (glass effect highlight)
- `--gold`: `#f4c96b` (primary accent - section headings)
- `--gold-soft`: `#f0d89a` (secondary accent - subheadings)
- `--gold-deep`: `#b38130` (deep gold for emphasis)
- `--text-main`: `#ffffff` (primary text color)
- `--text-muted`: `#d0d3dc` (secondary/muted text)
- `--border-subtle`: `rgba(255, 255, 255, 0.22)` (subtle borders)

### Glassmorphism Design System
The glassmorphism effect is achieved through:
- **Backdrop Filter**: `blur(24px) saturate(150%)` creates the frosted glass appearance
- **Semi-transparent Backgrounds**: `rgba(8, 8, 16, 0.25)` allows the background image to show through
- **Layered Shadows**: Multiple box-shadows create depth and separation
- **Subtle Borders**: `rgba(255, 255, 255, 0.04)` inset borders add definition
- **Hover Effects**: Cards lift slightly (`translateY(-6px)`) with enhanced shadows on hover

### Typography
- **Font Family**: Tomorrow (Google Fonts) with system font fallbacks
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Heading Hierarchy**:
  - `h1`: 25px (ATS-only, not visually displayed)
  - `h2`: 20px, uppercase, gold color (section headings)
  - `h3`: 15px, gold-soft color (subheadings)
- **Body Text**: 13px with 1.5 line-height for readability
- **Font Smoothing**: Antialiased rendering for crisp text on all displays

### Border Radius System
- `--radius-lg`: 28px (large elements)
- `--radius-md`: 25px (cards, default)
- `--radius-card`: 25px (card containers)
- `--radius-pill`: 999px (info bubbles, badges)

### Key CSS Classes
- `.glass-card` - Main card container with glassmorphism effect, hover animations, and consistent padding
- `.card-grid` - Two-column CSS Grid layout for CV sections with glassmorphism backdrop
- `.card-span-2` - Utility class to span full width across both columns
- `.equal-height-card` - Ensures cards in the same row have matching heights
- `.info-bubble` - Contact information pills with glassmorphism styling
- `.bullet-list` - Styled bulleted lists for experience/projects with consistent spacing
- `.skills-layout` - Flexbox layout for skills section with responsive column behavior
- `.ats-only` - Accessibility class that hides content visually but keeps it accessible to screen readers and ATS

### PDF Export Considerations
The PDF export process handles several critical requirements:
- **Background Preservation**: `printBackground: true` in Puppeteer ensures glassmorphism and background images render
- **Asset Loading**: Script waits for fonts, images, and CSS background images before generating PDF
- **Print Media Queries**: `@media print` rules override screen styles for optimal PDF layout
- **A4 Dimensions**: Viewport and page size locked to 210mm × 297mm
- **Link Normalization**: tel: and mailto: links are processed for PDF compatibility
- **PDF Tagging**: Tagged PDF structure enables accessibility and ATS parsing
- **Color Accuracy**: `print-color-adjust: exact` ensures colors match screen exactly

### Accessibility Features
- **Semantic HTML**: Proper use of `<header>`, `<section>`, `<article>`, `<address>`, `<time>` elements
- **Screen Reader Support**: `.ats-only` class uses CSS clipping to hide content visually while remaining accessible
- **ARIA Considerations**: Hidden content is properly structured for assistive technologies
- **Link Accessibility**: All links have descriptive titles and proper href attributes
- **Color Contrast**: Gold and white text on dark backgrounds meet WCAG contrast requirements
- **PDF Accessibility**: Tagged PDF structure with document outline for screen readers

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

