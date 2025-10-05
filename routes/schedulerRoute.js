import express from "express";
import schedule from "node-schedule";
import ScheduledMessage from "../models/scheduledMessage.js";

const router = express.Router();

router.post("/schedule", async (req, res) => {
  try {
    const { message, day, time } = req.body;

    if (!message || !day || !time) {
      return res.status(400).json({ success: false, message: "message, day, and time are required" });
    }

    // Convert day + time to Date
    const scheduledAt = new Date(`${day}T${time}:00`);

    if (isNaN(scheduledAt.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date/time format" });
    }

    // Save to DB
    const newMsg = await ScheduledMessage.create({ message, scheduledAt });

    // Schedule the job
    schedule.scheduleJob(scheduledAt, async () => {
      console.log("⏰ Inserting message at scheduled time:", message);

      await ScheduledMessage.findByIdAndUpdate(newMsg._id, {
        status: "inserted"
      });

      
    });

    res.status(200).json({
      success: true,
      message: "Message scheduled successfully",
      data: newMsg
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
