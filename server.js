const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Store connected users and registered accounts
const users = new Map(); // Currently connected users
const registeredUsers = new Map(); // All registered user accounts (nickname -> user data)
const typingUsers = new Set();
const privateTyping = new Map(); // Track private message typing

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user login/registration
  socket.on('user-login', (nickname) => {
    // Check if nickname is already taken by an online user
    const isOnline = Array.from(users.values()).some(user => user.nickname.toLowerCase() === nickname.toLowerCase());
    
    if (isOnline) {
      socket.emit('login-error', 'This nickname is already online. Please choose another.');
      return;
    }

    // Register user if not exists, or log them in
    if (!registeredUsers.has(nickname.toLowerCase())) {
      registeredUsers.set(nickname.toLowerCase(), {
        nickname: nickname,
        registeredAt: new Date(),
        lastSeen: new Date()
      });
    } else {
      // Update last seen
      const userData = registeredUsers.get(nickname.toLowerCase());
      userData.lastSeen = new Date();
    }

    // Store connected user info
    users.set(socket.id, {
      id: socket.id,
      nickname: nickname,
      joinedAt: new Date()
    });

    console.log(`${nickname} logged in`);

    // Send successful login
    socket.emit('login-success', {
      nickname: nickname,
      totalUsers: registeredUsers.size
    });

    // Notify all users about the new user coming online
    socket.broadcast.emit('user-online', {
      nickname: nickname,
      message: `${nickname} is now online`,
      timestamp: new Date().toISOString(),
      type: 'system'
    });

    // Send current online user count to all clients
    io.emit('user-count', users.size);

    // Send list of online users to all clients
    const onlineUsers = Array.from(users.values()).map(user => user.nickname);
    io.emit('online-users', onlineUsers);
  });

  // Handle user search
  socket.on('search-users', (query) => {
    const searchResults = Array.from(registeredUsers.values())
      .filter(user => user.nickname.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10) // Limit to 10 results
      .map(user => ({
        nickname: user.nickname,
        isOnline: Array.from(users.values()).some(onlineUser => onlineUser.nickname === user.nickname),
        lastSeen: user.lastSeen
      }));

    socket.emit('search-results', searchResults);
  });

  // Handle private messages
  socket.on('private-message', (data) => {
    const sender = users.get(socket.id);
    if (!sender) return;

    // Find the recipient
    const recipient = Array.from(users.values()).find(user => 
      user.nickname.toLowerCase() === data.to.toLowerCase()
    );

    const messageData = {
      id: Date.now() + Math.random(),
      from: sender.nickname,
      to: data.to,
      message: data.message,
      timestamp: new Date().toISOString(),
      type: 'private'
    };

    console.log(`Private message from ${sender.nickname} to ${data.to}: ${data.message}`);

    // Send to sender (confirmation)
    socket.emit('private-message', messageData);

    // Send to recipient if online
    if (recipient) {
      io.to(recipient.id).emit('private-message', messageData);
    } else {
      // User is offline, send notification to sender
      socket.emit('message-delivery-status', {
        to: data.to,
        status: 'offline',
        message: `${data.to} is currently offline. They will receive your message when they come online.`
      });
    }
  });

  // Handle chat messages (public)
  socket.on('chat-message', (data) => {
    const user = users.get(socket.id);
    if (user) {
      const messageData = {
        id: Date.now() + Math.random(), // Simple message ID
        nickname: user.nickname,
        message: data.message,
        timestamp: new Date().toISOString(),
        type: 'public'
      };

      console.log(`Public message from ${user.nickname}: ${data.message}`);

      // Broadcast message to all connected clients
      io.emit('chat-message', messageData);
    }
  });

  // Handle typing indicators for public chat
  socket.on('typing-start', () => {
    const user = users.get(socket.id);
    if (user) {
      typingUsers.add(user.nickname);
      socket.broadcast.emit('user-typing', {
        nickname: user.nickname,
        isTyping: true,
        type: 'public'
      });
    }
  });

  socket.on('typing-stop', () => {
    const user = users.get(socket.id);
    if (user) {
      typingUsers.delete(user.nickname);
      socket.broadcast.emit('user-typing', {
        nickname: user.nickname,
        isTyping: false,
        type: 'public'
      });
    }
  });

  // Handle typing indicators for private messages
  socket.on('private-typing-start', (data) => {
    const user = users.get(socket.id);
    if (user) {
      const recipient = Array.from(users.values()).find(u => 
        u.nickname.toLowerCase() === data.to.toLowerCase()
      );
      
      if (recipient) {
        io.to(recipient.id).emit('private-typing', {
          from: user.nickname,
          isTyping: true
        });
      }
    }
  });

  socket.on('private-typing-stop', (data) => {
    const user = users.get(socket.id);
    if (user) {
      const recipient = Array.from(users.values()).find(u => 
        u.nickname.toLowerCase() === data.to.toLowerCase()
      );
      
      if (recipient) {
        io.to(recipient.id).emit('private-typing', {
          from: user.nickname,
          isTyping: false
        });
      }
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      console.log(`${user.nickname} went offline`);

      // Update last seen in registered users
      if (registeredUsers.has(user.nickname.toLowerCase())) {
        const userData = registeredUsers.get(user.nickname.toLowerCase());
        userData.lastSeen = new Date();
      }

      // Remove user from typing lists
      typingUsers.delete(user.nickname);

      // Notify other users
      socket.broadcast.emit('user-offline', {
        nickname: user.nickname,
        message: `${user.nickname} went offline`,
        timestamp: new Date().toISOString(),
        type: 'system'
      });

      // Remove user from users map
      users.delete(socket.id);

      // Update user count and list
      io.emit('user-count', users.size);
      const onlineUsers = Array.from(users.values()).map(user => user.nickname);
      io.emit('online-users', onlineUsers);
    }
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 Messenger Server is running!
📍 Local access: http://localhost:${PORT}
🌐 Network access: http://[YOUR_IP]:${PORT}
👥 Waiting for users to connect...
💬 Features: Public chat, Private messages, User search
  `);
  
  // Display network interfaces for easy sharing
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  
  console.log('\n📡 Share these URLs with your friends:');
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((interface) => {
      if (interface.family === 'IPv4' && !interface.internal) {
        console.log(`   http://${interface.address}:${PORT}`);
      }
    });
  });
  console.log('\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down messenger server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
