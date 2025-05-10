const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const socketio = require('socket.io');
const http = require('http');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const groups = require('./routes/groups');
const resources = require('./routes/resources');

const app = express();

// Create HTTP server for Socket.io
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Body parser
app.use(express.json());

// File uploading
app.use(fileUpload());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/groups', groups);
app.use('/api/v1/resources', resources);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join a room (study group)
  socket.on('joinGroup', (groupId) => {
    socket.join(groupId);
    console.log(`User joined group ${groupId}`);
  });
  
  // Leave a room (study group)
  socket.on('leaveGroup', (groupId) => {
    socket.leave(groupId);
    console.log(`User left group ${groupId}`);
  });
  
  // Chat message
  socket.on('sendMessage', ({ groupId, message, user }) => {
    io.to(groupId).emit('message', { user, message });
  });
  
  // Video call signaling
  socket.on('callUser', (data) => {
    io.to(data.userToCall).emit('callUser', { 
      signal: data.signalData, 
      from: data.from, 
      name: data.name 
    });
  });
  
  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});