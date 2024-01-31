// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Prompt the user for their name
    socket.emit('request_name');
  
    // Handle user name submission
    socket.on('submit_name', (userName) => {
      socket.userName = userName;
      io.emit('chat_message', { user: 'Server', message: `${userName} joined the chat` });
    });
  
    // Handle chat messages
    socket.on('chat_message', (message) => {
      io.emit('chat_message', { user: socket.userName, message });
    });
  
    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log('A user disconnected');
      if (socket.userName) {
        io.emit('chat_message', { user: 'Server', message: `${socket.userName} left the chat` });
      }
    });
  });
  
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Handle chat messages
//   socket.on('chat_message', (message) => {
//     // Broadcast the message to all connected clients
//     io.emit('chat_message', message);
//   });

//   // Handle user disconnect
//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
