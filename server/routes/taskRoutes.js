import express from "express";
import {
    createTask,
    createSubTask,
    dashboardStatistics,
    deleteRestoreTask,
    duplicateTask,
    getTask,
    getTasks,
    postTaskActivity,
    trashTask,
    updateTask,
    // getDashboardData,
    // updateSubTaskStage,
    // updateTaskStage,
    updateTaskTeam,
  } from "../controllers/taskController.js";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewear.js";
const router = express.Router();

router.post("/create", protectRoute, isAdminRoute, createTask);
router.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateTask);
router.post("/activity/:id", protectRoute, postTaskActivity);

router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", protectRoute, getTasks);
router.get("/:id", protectRoute, getTask);

router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);
router.put("/update/:id", protectRoute, isAdminRoute, updateTask);
router.put("/:id", protectRoute, isAdminRoute, updateTask);
router.put("/:id/team", protectRoute, updateTaskTeam);

router.delete("/delete-restore/:id", protectRoute, isAdminRoute, deleteRestoreTask);
router.delete("/delete-restore", protectRoute, isAdminRoute, deleteRestoreTask);
// router.get("/dashboard", protectRoute, getDashboardData);


// router.put("/change-stage/:id", protectRoute, updateTaskStage);
// router.put(
//   "/change-status/:taskId/:subTaskId",
//   protectRoute,
//   updateSubTaskStage
// );







export default router;