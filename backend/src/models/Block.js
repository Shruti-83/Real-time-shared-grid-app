import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    index: { type: Number, required: true, unique: true },
    row:   { type: Number, required: true },
    col:   { type: Number, required: true },
    ownerId:    { type: String, default: null },
    ownerName:  { type: String, default: null },
    ownerColor: { type: String, default: null },
    capturedAt: { type: Date,   default: null },
  },
  { timestamps: true }
);

blockSchema.index({ ownerId: 1 });

export default mongoose.model("Block", blockSchema);