const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());

let messages = []; // Store messages in memory

io.on("connection", (socket) => {
    console.log("User connected");

    // Send existing messages when a user joins
    socket.emit("chatHistory", messages);

    socket.on("chatMessage", (data) => {
        const timestamp = Date.now();
        messages.push({ ...data, timestamp });

        // Keep only the last 100 messages
        if (messages.length > 100) {
            messages.shift();
        }

        // Broadcast message to all users
        io.emit("chatMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
