import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve directory for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined. Check your .env file.");
    process.exit(1);
}

const connectDB = async () => {
    try {
        console.log("📡 Connecting to MongoDB...");
        console.log("🔗 Connection String:", MONGODB_URI); // Debugging output

        const connectionInstance = await mongoose.connect(MONGODB_URI);
        console.log(`✅ MONGODB CONNECTED: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("❌ MONGODB CONNECTION FAILED:", error);
        process.exit(1);
    }
};

export default connectDB;
