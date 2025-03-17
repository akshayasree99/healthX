import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // User joins a specific room
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        io.to(roomId).emit("user-joined", { userId: socket.id });
    });

    // Handle offer event
    socket.on("offer", (data) => {
        console.log(`Offer received from ${socket.id} for room ${data.roomId}`);
        socket.to(data.roomId).emit("offer", data);
    });

    // Handle answer event
    socket.on("answer", (data) => {
        console.log(`Answer received from ${socket.id} for room ${data.roomId}`);
        socket.to(data.roomId).emit("answer", data);
    });

    // Handle ICE candidates
    socket.on("candidate", (data) => {
        console.log(`ICE candidate from ${socket.id} for room ${data.roomId}`);
        socket.to(data.roomId).emit("candidate", data);
    });

    // User disconnects
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
