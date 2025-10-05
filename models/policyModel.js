import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
  policyNumber: { type: String, required: true },
  startDate: Date,
  endDate: Date,
  premiumAmount: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  lobId: { type: mongoose.Schema.Types.ObjectId, ref: "LOB" },
  carrierId: { type: mongoose.Schema.Types.ObjectId, ref: "Carrier" }
});

export default mongoose.model("Policy", policySchema);