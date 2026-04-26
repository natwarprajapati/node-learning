import mongoose from "mongoose";
import dns from "dns";

// Force Node.js to use Google's DNS to bypass local ISP blocks for MongoDB SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `MongoDB connected! Host: ${connectionInstance.connection.host}`
    );
    console.log(`Database: ${connectionInstance.connection.name}\n`);
    return connectionInstance;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDB;
