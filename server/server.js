const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Require routes
const userRoutes = require('./routes/userRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const chatRoutes = require('./routes/chatRoutes');


// Create express app
const app = express();
// Middleware
app.use(express.json()); // Parse JSON request bodies
// Connect to MongoDB
app.use(cors({
    origin: 'http://localhost:3000',
  }));
mongoose.connect('mongodb://127.0.0.1:27017/api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB', error);
    });

// Routes
app.use('/api/Users', userRoutes);
app.use('/api/Tokens', tokenRoutes);
app.use('/api/Chats', chatRoutes);


app.use(express.static(path.join(__dirname, 'public')));

// Route handler for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(5001, () => {
    console.log('Server is running on port 5001');
});

