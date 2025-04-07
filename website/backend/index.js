require('dotenv').config();
const cors = require("cors");
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { auth } = require('./middleware/auth');
const Article = require('./models/Article');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.raw({ type: 'audio/wav', limit: '100mb' }));

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/receiveAudio', (req, res) => {
    const audioData = req.body;
    if (!audioData) {
        return res.status(400).send('audioData not provided');
    }
    let base64Data;
    if (Buffer.isBuffer(audioData)) {
        base64Data = audioData.toString('base64');
    } else if (typeof audioData === 'string') {
        base64Data = audioData.replace(/^data:audio\/wav;base64,/, '');
    } else {
        return res.status(400).send('Invalid audio data');
    }
    fs.writeFile('received_audio.wav', base64Data, 'base64', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving file');
        }
        res.send('Audio file received and saved successfully');
    });
});

// Auth routes
app.post('/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Protected route example
app.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update user disabilities
app.post('/user/disabilities', auth, async (req, res) => {
    try {
        const { disabilities, otherDisability } = req.body;
        
        // Validate disabilities array
        if (!Array.isArray(disabilities) || disabilities.length === 0) {
            return res.status(400).json({ error: 'At least one disability must be selected' });
        }

        // Validate otherDisability if 'other' is selected
        if (disabilities.includes('other') && !otherDisability) {
            return res.status(400).json({ error: 'Please specify the other disability' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { 
                disabilities,
                otherDisability: disabilities.includes('other') ? otherDisability : ''
            },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/article/getArticles', auth, async (req, res) => {
    try {
        const articles = await Article.find()
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

app.get('/article/:id', auth, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch article' });
    }
});

app.post('/article/createArticle', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Raw text content is required' });
        }

        const flaskResponse = await fetch('http://localhost:5000/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!flaskResponse.ok) {
            throw new Error('Failed to process text');
        }

        const processedData = await flaskResponse.json();
        const article = new Article(processedData);
        await article.save();
        
        res.status(201).json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});