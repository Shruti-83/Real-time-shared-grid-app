import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId:     { type: String, required: true, unique: true },
    name:       { type: String, required: true },
    color:      { type: String, required: true },
    isOnline:   { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);