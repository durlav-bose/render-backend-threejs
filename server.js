const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from src/image-distortion/public
app.use(express.static(path.join(__dirname, 'src/image-distortion/public')));

app.get('/generate', async (req, res) => {
    const zPosition = req.query.zPosition || 5; // Default zPosition if not provided

    const browser = await puppeteer.launch({ headless: true }); // Run in non-headless mode for debugging
    const page = await browser.newPage();

    const filePath = `file://${path.join(__dirname, 'src/image-distortion/public/index.html')}`;
    const url = `${filePath}?zPosition=${zPosition}`;
    console.log('url :>> ', url);

    const response = await page.goto(url, { waitUntil: 'networkidle2' });
    console.log('Response status:', response.status());

    // Ensure the page is fully loaded and the canvas element is present
    await page.waitForSelector('canvas', { timeout: 60000 });

    // Execute the image capture logic in the page context
    const dataURL = await page.evaluate(() => {
        const button = document.getElementById('capture');
        button.click();
        return document.querySelector('canvas').toDataURL('image/png', 1.0);
    });

    const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');
    console.log('base64Data :>> ', base64Data);
    const buffer = Buffer.from(base64Data, 'base64');

    console.log('buffer :>> ', buffer);
    await browser.close();
    res.set('Content-Type', 'image/png');
    res.send(buffer);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
