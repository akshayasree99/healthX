import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",  // ⚠️ Consider changing to your frontend URL in production
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors());



// ✅ **Fixed Chatbot API Request**
app.post("/chatbot", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`
,
            {
                contents: [{ role: "user", parts: [{ text: userMessage }] }]
            }
        );

        console.log("🔹 API Response:", response.data);

        const botReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";
        res.json({ reply: botReply });

    } catch (error) {
        console.error("❌ Chatbot API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to connect to the chatbot API." });
    }
});


const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

/* ========================== ✅ SOCKET.IO (Video Call) ========================== */
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        io.to(roomId).emit("user-joined", { userId: socket.id });
    });

    socket.on("offer", (data) => {
        socket.to(data.roomId).emit("offer", data);
    });
    
    socket.on("answer", (data) => {
        socket.to(data.roomId).emit("answer", data);
    });
    
    socket.on("candidate", (data) => {
        socket.to(data.roomId).emit("candidate", data);
    });
    

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
    socket.on("leave-room", (data) => {
        console.log(`User ${socket.id} left room ${data.roomId}`);
        socket.leave(data.roomId);
        socket.to(data.roomId).emit("user-left", { userId: socket.id });
    });
    socket.on("user-left", ({ userId }) => {
        console.log(`User ${userId} left the call`);
    });
    
    
});
