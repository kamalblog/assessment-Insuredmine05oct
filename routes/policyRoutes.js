import express from "express";
import Policy from "../models/policyModel.js";

const router = express.Router();



router.get("/aggregate", async (req, res) => {
  try {
    const result = await Policy.aggregate([
      {
        $group: {
          _id: "$username",             
          totalPolicies: { $sum: 1 },    
          totalAmount: { $sum: "$amount" } 
        }
      },
      {
        $project: {
          _id: 0,
          username: "$_id",
          totalPolicies: 1,
          totalAmount: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get("/full-info", async (req, res) => {
  try {
    const policies = await Policy.find()
      .populate("userId", "username email phone")   
      .populate("agentId", "name code")             
      .populate("lobId", "name description")        
      .populate("carrierId", "name contactEmail");  

    res.status(200).json({
      success: true,
      count: policies.length,
      data: policies
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
