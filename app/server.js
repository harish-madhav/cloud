require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const path = require('path');
const { auth } = require('express-openid-connect');
const multer = require('multer'); // For handling file uploads
const { Dropbox } = require('dropbox'); // Import Dropbox SDK

const mongoose = require('mongoose'); // Import Mongoose
const BlogPost = require('./models/BlogPost'); // Import the BlogPost model

const app = express();
const port = 3000;

// Authentication configuration
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER
};

// Check if required environment variables are set
if (!process.env.SECRET || !process.env.BASEURL || !process.env.CLIENTID || !process.env.ISSUER || !process.env.DROPBOX_ACCESS_TOKEN || !process.env.MONGODB_URI) {
    console.error('Error: Environment variables are not properly set.');
    process.exit(1); // Exit the application with an error code
}

// MongoDB Atlas connection using Mongoose
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB Atlas');
})
.catch(err => {
    console.error('Failed to connect to MongoDB Atlas', err);
    process.exit(1); // Exit the application if connection fails
});

// Setup authentication middleware
app.use(auth(config));

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Setup multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Get all blog posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await BlogPost.find();
        res.json(posts);
    } catch (err) {
        res.status(500).send('Error fetching blog posts');
    }
});

// Get a single blog post by ID
app.get('/api/posts/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) return res.status(404).send('Post not found');
        res.json(post);
    } catch (err) {
        res.status(500).send('Error fetching blog post');
    }
});

// Add a new blog post
app.post('/api/posts', async (req, res) => {
    const newPost = new BlogPost({
        title: req.body.title,
        date: req.body.date,
        author: req.body.author,
        content: req.body.content
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(500).send('Error adding blog post');
    }
});

// Update a blog post
app.put('/api/posts/:id', async (req, res) => {
    try {
        const updatedPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                date: req.body.date,
                author: req.body.author,
                content: req.body.content
            },
            { new: true }
        );

        if (!updatedPost) return res.status(404).send('Post not found');
        res.json(updatedPost);
    } catch (err) {
        res.status(500).send('Error updating blog post');
    }
});

// Delete a blog post
app.delete('/api/posts/:id', async (req, res) => {
    try {
        const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).send('Post not found');
        res.json(deletedPost);
    } catch (err) {
        res.status(500).send('Error deleting blog post');
    }
});

// Handle photo upload
app.post('/upload', upload.single('file'), async (req, res) => {
    const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

    try {
        await dbx.filesUpload({
            path: '/' + req.file.originalname,
            contents: req.file.buffer
        });
        res.status(200).send('File uploaded successfully');
    } catch (err) {
        res.status(500).send('Error uploading file');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    res.oidc.logout();
});

// Route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
