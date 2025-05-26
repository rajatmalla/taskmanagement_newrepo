import express from "express";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewear.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    getTeamList,
    getNotificationsList,
    updateUserProfile,
    markNotificationRead,
    changeUserPassword,
    activateUserProfile,
    deleteUserProfile,
    updateUserByAdmin,
    getUserStatus,
    deleteNotification,
} from "../controllers/userController.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected routes
router.get("/get-team", protectRoute, getTeamList);
router.get("/notifications", protectRoute, getNotificationsList);
router.get("/get-status", protectRoute, getUserStatus);

router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);
router.put("/change-password", protectRoute, changeUserPassword);

// Get current user profile
router.get("/profile", protectRoute, async (req, res) => {
  try {
    const user = await (await import("../models/User.js")).default.findById(req.user.userID).select("-password");
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// Admin routes - must be after specific routes
router
  .route("/:id")
  .put(protectRoute, isAdminRoute, updateUserByAdmin)
  .delete(protectRoute, isAdminRoute, deleteUserProfile);

router.delete("/notifications/:id", protectRoute, deleteNotification);

export default router;