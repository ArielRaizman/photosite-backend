const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;

// Configuration for external images path - CHANGE THIS TO YOUR EXTERNAL DIRECTORY PATH
const EXTERNAL_IMAGES_PATH = 'C:/path/to/your/external/images';

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve files from the external images directory
app.use('/external-images', express.static(EXTERNAL_IMAGES_PATH));

// GET endpoint to fetch image data
app.get('/api/image-data', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'image-data.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading image data:', error);
        res.status(500).json({ error: 'Failed to read image data' });
    }
});

// PUT endpoint to update image data
app.put('/api/image-data', async (req, res) => {
    try {
        await fs.writeFile(
            path.join(__dirname, 'image-data.json'),
            JSON.stringify(req.body, null, 2),
            'utf8'
        );
        res.json({ message: 'Changes saved successfully' });
    } catch (error) {
        console.error('Error saving image data:', error);
        res.status(500).json({ error: 'Failed to save changes' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 