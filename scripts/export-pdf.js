/**
 * PDF Export Script for Joe Sturdy CV
 * 
 * This script uses Puppeteer (headless Chrome) to generate a high-quality A4 PDF
 * from the HTML/CSS CV. It handles asset loading, print media emulation, and
 * PDF generation with accessibility features enabled.
 * 
 * Dependencies:
 * - puppeteer: Headless browser automation
 * - fs: File system operations
 * - path: Path manipulation utilities
 * 
 * Usage: node scripts/export-pdf.js
 * Or via npm: npm run export:pdf
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

/**
 * Generates an A4 PDF version of the CV using Puppeteer.
 * 
 * Process:
 * 1. Launches headless Chrome browser
 * 2. Sets viewport to exact A4 dimensions
 * 3. Emulates print media to trigger print CSS
 * 4. Loads HTML file and waits for all assets (fonts, images, backgrounds)
 * 5. Normalizes links for PDF compatibility
 * 6. Generates tagged PDF with accessibility features
 * 7. Saves to dist/Joe-Sturdy-CV.pdf
 * 
 * @returns {Promise<void>}
 * @throws {Error} If HTML file not found or PDF generation fails
 */
async function exportPdf() {
  // Path Resolution: Determine file paths relative to project root
  // __dirname is the scripts/ directory, so we go up one level to project root
  const projectRoot = path.resolve(__dirname, '..');
  const htmlPath = path.join(projectRoot, 'index.html');
  const outputPath = path.join(projectRoot, 'dist', 'Joe-Sturdy-CV.pdf');

  // Validation: Ensure HTML file exists before attempting PDF generation
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`index.html not found at ${htmlPath}`);
  }

  // Browser Launch: Start headless Chrome instance
  // Headless mode runs without GUI, perfect for automation
  // Browser arguments enable local file access and disable security restrictions
  // needed for loading local assets (images, CSS) via file:// protocol
  const browser = await puppeteer.launch({
    headless: 'new',                       // Use new headless mode (Chrome 109+)
    args: [
      '--allow-file-access-from-files',   // Allows loading local files via file://
      '--disable-web-security',           // Disables CORS for local file access
      '--disable-features=IsolateOrigins,site-per-process', // Simplifies local file handling
    ],
  });

  try {
    // New Page: Create a new browser tab/page for loading the CV
    const page = await browser.newPage();

    // Viewport Configuration: Set viewport to exact A4 dimensions
    // This ensures the layout matches the final PDF exactly
    // Conversion: 1mm = 3.779527559 pixels at 96 DPI (standard screen resolution)
    const a4Width = 210 * 3.779527559;    // A4 width: 210mm
    const a4Height = 297 * 3.779527559;   // A4 height: 297mm
    await page.setViewport({
      width: Math.round(a4Width),          // ~794 pixels
      height: Math.round(a4Height),        // ~1123 pixels
      deviceScaleFactor: 2,                // 2x DPI for sharper text and images in PDF
    });

    // Media Emulation: Trigger print media queries
    // This activates all @media print CSS rules, which optimize styling for PDF
    // Without this, screen styles would be used instead of print-optimized styles
    await page.emulateMediaType('print');

    // File URL: Convert local file path to file:// URL for browser loading
    // Puppeteer needs a URL (not a file path) to load the HTML
    const fileUrl = new URL(`file://${htmlPath}`);

    // Page Navigation: Load the HTML file and wait for all network activity to complete
    // networkidle0 means wait until there are 0 network connections for 500ms
    // This ensures all assets (CSS, fonts, images) have finished loading
    await page.goto(fileUrl.href, { 
      waitUntil: 'networkidle0',           // Wait for network to be idle
      timeout: 30000,                      // 30 second timeout (prevents hanging)
    });

    // Font Loading: Wait for all web fonts to be fully loaded
    // document.fonts.ready is a Promise that resolves when all fonts are loaded
    // This is critical because PDFs need fonts to be ready before rendering
    // Without this, fonts might not render correctly in the PDF
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    // Image Loading: Wait for all <img> elements to load completely
    // This ensures the avatar and any other images render correctly in the PDF
    // We check each image and wait for it to load, with a timeout to prevent hanging
    await page.evaluate(async () => {
      const images = Array.from(document.images); // Get all <img> elements
      await Promise.all(
        images.map((img) => {
          // If image is already loaded, resolve immediately
          if (img.complete) return Promise.resolve();
          // Otherwise, wait for load event (or error, or timeout)
          return new Promise((resolve) => {
            img.addEventListener('load', resolve);    // Resolve on successful load
            img.addEventListener('error', resolve);  // Resolve on error (don't block PDF generation)
            // Timeout: Resolve after 5 seconds even if image hasn't loaded
            // Prevents script from hanging indefinitely on broken images
            setTimeout(resolve, 5000);
          });
        })
      );
    });

    // Background Image Loading: Wait for CSS background images to load
    // The glassmorphism backdrop (Futuristic-Gold-and-Black.jpg) is set via CSS background-image
    // We need to explicitly load these images to ensure they render in the PDF
    await page.evaluate(async () => {
      const bgImages = [];
      // Find all elements with background images
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el) => {
        // Get computed background-image style
        const bgImage = window.getComputedStyle(el).backgroundImage;
        // Extract URL from CSS background-image property (e.g., "url('image.jpg')")
        if (bgImage && bgImage !== 'none' && bgImage.includes('url')) {
          const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
          if (urlMatch && urlMatch[1]) {
            bgImages.push(urlMatch[1]);
          }
        }
      });
      
      // Wait for all background images to load
      // Create Image objects and wait for their load events
      await Promise.all(
        bgImages.map((url) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;          // Resolve when image loads
            img.onerror = resolve;         // Resolve on error (don't block)
            img.src = url;                 // Trigger image load
            // Timeout: Resolve after 5 seconds to prevent hanging
            setTimeout(resolve, 5000);
          });
        })
      );
    });

    // Animation Wait: Brief pause to allow any CSS transitions/animations to complete
    // This ensures hover states and transitions have finished before PDF capture
    // 1500ms is sufficient for most CSS transitions
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Link Normalization: Prepare tel: and mailto: links for PDF compatibility
    // PDF viewers need properly formatted links to make them clickable
    // This ensures phone numbers and emails are clickable in the generated PDF
    await page.evaluate(() => {
      // Tel Links: Normalize phone number links
      // Find all links with tel: protocol
      const telLinks = document.querySelectorAll('a[href^="tel:"]');
      telLinks.forEach((link) => {
        const telNumber = link.getAttribute('href');
        if (telNumber && telNumber.startsWith('tel:')) {
          // Extract phone number and normalize format
          const phoneNumber = telNumber.replace('tel:', '').trim();
          // Ensure international format (starts with +)
          const normalizedTel = phoneNumber.startsWith('+') 
            ? `tel:${phoneNumber}` 
            : `tel:+${phoneNumber}`;
          link.setAttribute('href', normalizedTel);
          
          // Add data attribute for PDF compatibility
          link.setAttribute('data-phone', phoneNumber);
          // Add title attribute for accessibility (if not already present)
          if (!link.getAttribute('title')) {
            link.setAttribute('title', `Call ${phoneNumber}`);
          }
          
          // Ensure link remains clickable (override any CSS that might disable it)
          link.style.pointerEvents = 'auto';
          link.style.cursor = 'pointer';
        }
      });
      
      // Mailto Links: Normalize email links
      // Ensure mailto: links are properly formatted and have titles
      const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
      mailtoLinks.forEach((link) => {
        // Add title attribute for accessibility
        if (!link.getAttribute('title')) {
          const email = link.getAttribute('href').replace('mailto:', '');
          link.setAttribute('title', `Email ${email}`);
        }
        // Ensure link remains clickable
        link.style.pointerEvents = 'auto';
        link.style.cursor = 'pointer';
      });
    });

    // Document Title: Set PDF metadata title
    // This title appears in PDF viewer tabs and document properties
    // Also helps with ATS systems that read PDF metadata
    await page.evaluate(() => {
      document.title = 'Joe Sturdy - AI Solutions Architect CV';
    });

    // PDF Generation: Generate the final PDF file
    // This is the core operation that creates the PDF from the rendered page
    await page.pdf({
      path: outputPath,                    // Output file path
      width: '210mm',                      // A4 width (matches viewport)
      height: '297mm',                     // A4 height (matches viewport)
      printBackground: true,               // CRITICAL: Preserves background images and colors
      preferCSSPageSize: true,             // Use CSS @page size (A4) instead of width/height
      margin: { top: 0, bottom: 0, left: 0, right: 0 }, // No margins (handled by CSS padding)
      scale: 1,                            // 100% scale (no zoom)
      displayHeaderFooter: false,          // No header/footer (clean CV layout)
      // Accessibility Features: Enable PDF tagging and structure
      tag: true,                           // Enable PDF tagging (accessibility structure)
      outline: true,                       // Generate document outline/bookmarks for navigation
    });
    // Note: Puppeteer automatically includes HTML meta tags in PDF metadata
    // No additional metadata configuration needed here

    // Success Message: Confirm PDF generation completed
    console.log(`PDF exported successfully to ${outputPath}`);
  } catch (error) {
    // Error Handling: Log error and re-throw for caller to handle
    // This ensures errors are visible and script exits with error code
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    // Browser Cleanup: Always close browser, even if errors occur
    // Prevents zombie Chrome processes from consuming system resources
    // This cleanup runs regardless of success or failure
    await browser.close();
  }
}

// Script Execution: Run the PDF export function
// If export fails, exit with error code 1 (indicates failure to calling process)
exportPdf().catch((err) => {
  console.error(err);
  process.exitCode = 1;                    // Set exit code for npm scripts/CI
});
