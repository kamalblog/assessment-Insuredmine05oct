import mongoose from "mongoose";

const lobSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  description: String
});

export default mongoose.model("LOB", lobSchema);