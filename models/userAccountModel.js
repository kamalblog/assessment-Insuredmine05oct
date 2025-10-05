import mongoose from "mongoose";

const userAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  accountNumber: String,
  accountType: String,
  balance: Number
});

export default mongoose.model("UserAccount", userAccountSchema);