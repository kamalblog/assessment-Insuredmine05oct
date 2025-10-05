import mongoose from "mongoose";

const scheduledMessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  status: { type: String, enum: ["pending", "inserted"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ScheduledMessage", scheduledMessageSchema);
