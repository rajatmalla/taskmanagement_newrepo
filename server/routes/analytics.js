import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import Task from "../models/Task.js";

const router = express.Router();

// Get task statistics
router.get("/task-stats", protect, admin, async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const inProgressTasks = await Task.countDocuments({ status: "in-progress" });
    const pendingTasks = await Task.countDocuments({ status: "pending" });

    const taskStats = {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      pending: pendingTasks,
    };

    res.json(taskStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user activity statistics
router.get("/user-activity", protect, admin, async (req, res) => {
  try {
    const userActivity = await Task.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          taskCount: { $sum: 1 },
          completedCount: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 1,
          name: "$userDetails.name",
          taskCount: 1,
          completedCount: 1,
          completionRate: {
            $multiply: [
              { $divide: ["$completedCount", "$taskCount"] },
              100,
            ],
          },
        },
      },
    ]);

    res.json(userActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 