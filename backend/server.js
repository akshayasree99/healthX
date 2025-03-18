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
