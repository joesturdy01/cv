const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

/**
 * Generates an A4 PDF version of the CV using Puppeteer.
 * Think of it like asking a robot browser to print the page for us.
 * @returns {Promise<void>}
 */
async function exportPdf() {
  const projectRoot = path.resolve(__dirname, '..');
  const htmlPath = path.join(projectRoot, 'index.html');
  const outputPath = path.join(projectRoot, 'dist', 'Joe-Sturdy-CV.pdf');

  if (!fs.existsSync(htmlPath)) {
    throw new Error(`index.html not found at ${htmlPath}`);
  }

  // Launch a headless (invisible) browser that can render the CV.
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--allow-file-access-from-files',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });

  try {
    const page = await browser.newPage();

    // Force the viewport to match an A4 sheet so layout never shifts.
    // 1mm = 3.779527559 pixels at 96 DPI.
    const a4Width = 210 * 3.779527559;
    const a4Height = 297 * 3.779527559;
    await page.setViewport({
      width: Math.round(a4Width),
      height: Math.round(a4Height),
      deviceScaleFactor: 2, // Higher DPI for better quality
    });

    // Pretend we are printing so the @media print CSS kicks in.
    await page.emulateMediaType('print');

    const fileUrl = new URL(`file://${htmlPath}`);

    // Open the local HTML file and wait until nothing else is loading.
    await page.goto(fileUrl.href, { 
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Make sure custom fonts are ready before capturing the PDF.
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    // Wait for normal <img> tags so nothing looks broken.
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve); // Resolve even on error to not block
            // Timeout after 5 seconds
            setTimeout(resolve, 5000);
          });
        })
      );
    });

    // Also wait for CSS background images (like the gold/black texture).
    await page.evaluate(async () => {
      const bgImages = [];
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el) => {
        const bgImage = window.getComputedStyle(el).backgroundImage;
        if (bgImage && bgImage !== 'none' && bgImage.includes('url')) {
          const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
          if (urlMatch && urlMatch[1]) {
            bgImages.push(urlMatch[1]);
          }
        }
      });
      
      // Wait for background images to load
      await Promise.all(
        bgImages.map((url) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve; // Resolve even on error
            img.src = url;
            // Timeout after 5 seconds
            setTimeout(resolve, 5000);
          });
        })
      );
    });

    // Small pause so any remaining animations/transitions finish up.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Clean up tel: and mailto: links so PDFs keep them clickable.
    await page.evaluate(() => {
      // Find all tel: links and ensure they're properly formatted
      const telLinks = document.querySelectorAll('a[href^="tel:"]');
      telLinks.forEach((link) => {
        // Ensure the href is properly formatted with international format
        const telNumber = link.getAttribute('href');
        if (telNumber && telNumber.startsWith('tel:')) {
          // Normalize the tel: URI format
          const phoneNumber = telNumber.replace('tel:', '').trim();
          // Ensure it starts with + for international format
          const normalizedTel = phoneNumber.startsWith('+') 
            ? `tel:${phoneNumber}` 
            : `tel:+${phoneNumber}`;
          link.setAttribute('href', normalizedTel);
          
          // Add additional attributes for better PDF compatibility
          link.setAttribute('data-phone', phoneNumber);
          if (!link.getAttribute('title')) {
            link.setAttribute('title', `Call ${phoneNumber}`);
          }
          
          // Ensure link is not prevented from being clickable
          link.style.pointerEvents = 'auto';
          link.style.cursor = 'pointer';
        }
      });
      
      // Also ensure mailto: links are properly formatted
      const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
      mailtoLinks.forEach((link) => {
        if (!link.getAttribute('title')) {
          const email = link.getAttribute('href').replace('mailto:', '');
          link.setAttribute('title', `Email ${email}`);
        }
        link.style.pointerEvents = 'auto';
        link.style.cursor = 'pointer';
      });
    });

    // Set document title so the PDF carries meaningful metadata.
    await page.evaluate(() => {
      // This metadata will be embedded in the PDF
      document.title = 'Joe Sturdy - AI Solutions Architect CV';
    });

    // Finally, print the page to PDF with background colors included.
    await page.pdf({
      path: outputPath,
      width: '210mm',
      height: '297mm',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      scale: 1,
      displayHeaderFooter: false,
      // PDF metadata for ATS systems
      tag: true, // Enable PDF tagging for accessibility
      outline: true, // Generate document outline/bookmarks
    });

    // Puppeteer keeps the meta tags we set in HTML, so no extra work needed here.

    console.log(`PDF exported successfully to ${outputPath}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    // Always close the browser so no background processes linger.
    await browser.close();
  }
}

exportPdf().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

