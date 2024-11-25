const express = require('express');
const multer = require('multer');
const { Dropbox } = require('dropbox');
const fs = require('fs');
require('dotenv').config();
const fetch = require('isomorphic-fetch'); // Required for Dropbox SDK

const app = express();
const upload = multer({ dest: 'uploads/' });

// Initialize Dropbox client
const dropbox = new Dropbox({
    accessToken: process.env.DROPBOX_ACCESS_TOKEN,
    fetch: fetch,
});

// Middleware for parsing JSON requests
app.use(express.json());
app.use(express.static('public'));

// Handle photo upload
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        await dropbox.filesUpload({
            path: '/' + req.file.originalname,
            contents: fs.readFileSync(req.file.path),
        });

        // Delete the local file after uploading
        fs.unlinkSync(req.file.path);
        res.status(200).send('File uploaded successfully');
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).send('Error uploading file');
    }
});

// Handle photo deletion
app.post('/delete', async (req, res) => {
    const { filename } = req.body;

    try {
        await dropbox.filesDeleteV2({
            path: '/' + filename,
        });
        res.status(200).send('File deleted successfully');
    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(500).send('Error deleting file');
    }
});

// Fetch list of files from Dropbox
app.get('/files', async (req, res) => {
    try {
        const response = await dropbox.filesListFolder({ path: '' });
        const files = response.result.entries.map(entry => ({
            name: entry.name,
        }));
        res.status(200).json(files);
    } catch (err) {
        console.error('Error listing files:', err);
        res.status(500).send('Error listing files');
    }
});

// Handle file download
app.get('/download/:filename', async (req, res) => {
    const { filename } = req.params;

    try {
        const response = await dropbox.filesDownload({ path: '/' + filename });
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).send(response.result.fileBinary);
    } catch (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
