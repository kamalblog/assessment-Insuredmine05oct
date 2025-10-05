import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: String,
  phone: String,
  address: String
});

export default mongoose.model("User", userSchema);