const express = require('express');
// Create express app
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const http = require('http');
// Create HTTP server using the Express app
const server = http.createServer(app);
const { Server } = require('socket.io')
const io = new Server(server)

// Middleware
app.use(express.json()); // Parse JSON request bodies
// Connect to MongoDB
app.use(cors());
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

// Require routes
const userRoutes = require('./routes/userRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const chatRoutes = require('./routes/chatRoutes');
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
server.listen(5001, () => {
    console.log('Server is running on port 5001');
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Handle incoming chat messages
        socket.on('chat message', (message) => {
            console.log('Message received:', message);
            // Broadcast the message to all connected clients
            io.emit('chat message', message);
        });

        // Handle disconnections
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
});
