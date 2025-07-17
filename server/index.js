
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');


// Import routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');

dotEnv.config();

const app = express();
const server = http.createServer(app);

//Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Route setup
app.get('/', (req, res) => {
    res.send('API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);


// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

mongoose.connect(MONGO_URI)
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);  // kill server if DB fails
});

// Socket.io connection
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // for development purposes, adjust as needed
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

io.on('connection', (socket) => {
    console.log(`New client connnected`, socket.id);

    // Handle joining a chat
    socket.on('joinChat', ({ chatId, user }) => {
        try {
            if (!chatId || !user || !user.username) {
                console.warn("Inavalid Joinchat payload", { chatId, user});
                return;
            }

            console.log(`User joined chat: ${chatId}`, user);
            socket.join(chatId);

            // Broadcast to room
            io.to(chatId).emit('message', {
                text: `${user.username || 'someone'} has joined the chat`,
                type: 'system',
            });

        } catch (error) {
            console.error('Error in joinChat', err.message);
        }
    });

    // Handle sending a message
    socket.on('sendMessage', (message) => {
        console.log(`Message sent: ${message}`);

        try {
            const chatId = message.chat?._id || message.chatId;

            if (!chatId || !message.text || !message.sender) {
                console.warn('Missing message.chatId, sender, or text');
                return;
            }

            const msgData = {
                text: message.text,
                sender: message.sender,
                chat: { _id: chatId },
                type: 'chat',
            }

            io.to(chatId).emit('message', msgData);

        } catch (err) {
            console.error('Error in sendMessage', err.message);
        }
    });

    //Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});


//Global error handling middleware
app.use((req,res) => {
    res.status(404).json({message: "Route not found"});
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!'})
});


// Start server
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});