const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON and serve static frontend files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock Database (Temporary storage in memory)
let posts = [
    {
        id: 1,
        username: "coder_babe",
        content: "Just started building my first Express app! 🚀 #coding",
        likes: 5,
        comments: ["You got this!", "Looks clean!"]
    },
    {
        id: 2,
        username: "design_guru",
        content: "Pro-tip: Dark mode and clean typography make any app look 10x better. ✨",
        likes: 12,
        comments: ["Agreed!", "What font is this?"]
    }
];

// Route to serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API: Get all posts
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// API: Create a new post
app.post('/api/posts', (req, res) => {
    const { username, content } = req.body;
    if (!username || !content) return res.status(400).json({ error: "Missing fields" });

    const newPost = {
        id: posts.length + 1,
        username,
        content,
        likes: 0,
        comments: []
    };
    posts.unshift(newPost); // Add to the top of the feed
    res.status(201).json(newPost);
});

// API: Like a post
app.post('/api/posts/:id/like', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes += 1;
        res.json({ likes: post.likes });
    } else {
        res.status(404).json({ error: "Post not found" });
    }
});

// API: Comment on a post
app.post('/api/posts/:id/comment', (req, res) => {
    const postId = parseInt(req.params.id);
    const { comment } = req.body;
    const post = posts.find(p => p.id === postId);
    if (post && comment) {
        post.comments.push(comment);
        res.json({ comments: post.comments });
    } else {
        res.status(404).json({ error: "Post or comment invalid" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running smoothly at http://localhost:${PORT}`);
});