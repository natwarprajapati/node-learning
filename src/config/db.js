import mongoose from "mongoose";
import dns from "dns";

// Force Node.js to use Google's DNS to bypass local ISP blocks for MongoDB SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("MONGO_URI is not defined in environment variables");
  }
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI,
      {},
    );
    console.log(
      `MongoDB connected! Host: ${connectionInstance.connection.host}`,
    );
    console.log(
      `MongoDB connection state: ${connectionInstance.connection.readyState}`,
    ); // 1 = connected
    return connectionInstance;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

export default connectDB;
