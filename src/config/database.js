import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce_db";

    await mongoose.connect(mongoUri);

    console.log("MongoDB Connected Successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
