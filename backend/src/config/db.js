import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB failed:", err.message);

    // ❌ REMOVE THIS (important)
    // process.exit(1);

    // ✅ Instead allow server to run
  }
};

export default connectDB;