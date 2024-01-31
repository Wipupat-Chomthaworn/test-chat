// server.js
const { randomFill } = require("crypto");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

const chatHistory = [];
function getRandomUpperCase() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }
  
  function generateRandomString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += getRandomUpperCase();
    }
    return result;
  }
io.on("connection", (socket) => {
  console.log("A user connected");

  // Prompt the user for their name
  socket.emit("request_name");

  // Handle user name submission
  socket.on("submit_name", (userName) => {
    if (userName == null) {
        const randomUppercaseString = generateRandomString(3);
    }
    socket.userName = userName;
    console.log('userName', userName)

    // Send chat history to the new user
    socket.emit("chat_history", chatHistory);

    // Broadcast to other users that a new user joined
    io.emit("chat_message", {
      user: "Server",
      message: `${userName} joined the chat`,
    });
  });

  // Handle chat messages
  socket.on("chat_message", (message) => {
    const chatMessage = { user: socket.userName, message };
    chatHistory.push(chatMessage);
    io.emit("chat_message", chatMessage);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    if (socket.userName) {
      io.emit("chat_message", {
        user: "Server",
        message: `${socket.userName} left the chat`,
      });
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
