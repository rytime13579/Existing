import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "../lib/env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true //allows for cookies
    },

});


// apply authentication middleware for all socket connections

io.use(socketAuthMiddleware);


const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
    console.log("A User connected", socket.user.fullName);

    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    // io.emit() used to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    
    // socket.on listens for events, then logic inside callback function

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.user.fullName);
        delete userSocketMap[userId];

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })

});

export {io, app, server};

