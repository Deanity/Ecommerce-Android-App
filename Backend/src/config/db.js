import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("DEBUG MONGO_URI:", process.env.MONGO_URI); // <-- tambah ini

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected successfully!");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};
