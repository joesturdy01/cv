const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function exportPdf() {
  const projectRoot = path.resolve(__dirname, '..');
  const htmlPath = path.join(projectRoot, 'index.html');
  const outputPath = path.join(projectRoot, 'Joe-Sturdy-CV.pdf');

  if (!fs.existsSync(htmlPath)) {
    throw new Error(`index.html not found at ${htmlPath}`);
  }

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
    
    // Set viewport to exact A4 dimensions (210mm × 297mm)
    // 1mm = 3.779527559 pixels at 96 DPI
    const a4Width = 210 * 3.779527559;
    const a4Height = 297 * 3.779527559;
    await page.setViewport({
      width: Math.round(a4Width),
      height: Math.round(a4Height),
      deviceScaleFactor: 2, // Higher DPI for better quality
    });
    
    // Enable print media emulation
    await page.emulateMediaType('print');

    const fileUrl = new URL(`file://${htmlPath}`);
    
    // Navigate and wait for all resources to load
    await page.goto(fileUrl.href, { 
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait for fonts to load
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    
    // Wait for all images to load
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

    // Wait for background images to load
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

    // Additional wait to ensure all rendering, layout, and CSS transitions are complete
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate PDF with exact A4 dimensions
    await page.pdf({
      path: outputPath,
      width: '210mm',
      height: '297mm',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      scale: 1,
    });

    console.log(`PDF exported successfully to ${outputPath}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

exportPdf().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

