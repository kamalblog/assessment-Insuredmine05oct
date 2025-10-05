
import mongoose from "mongoose";
const policySchema = new mongoose.Schema({
  username: { type: String, required: true },
  policyNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  startDate: { type: Date },
  endDate: { type: Date }
});

export default mongoose.model("Policy", policySchema);