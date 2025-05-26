import express from "express";
import taskRoutes from "./taskRoutes.js";
import analyticsRoutes from "./analytics.js";

const router = express.Router();

router.use("/task", taskRoutes);
router.use("/analytics", analyticsRoutes);

export default router;