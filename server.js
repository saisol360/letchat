const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let messages = []; // Temporary in-memory storage

io.on("connection", (socket) => {
    console.log("User connected");

    // Send existing messages when a user joins
    socket.emit("chatHistory", messages);

    socket.on("chatMessage", (data) => {
        const timestamp = Date.now();
        messages.push({ ...data, timestamp });

        // Broadcast the message to all users
        io.emit("chatMessage", data);

        // Remove messages older than 1 hour
        messages = messages.filter(msg => Date.now() - msg.timestamp < 3600000);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
