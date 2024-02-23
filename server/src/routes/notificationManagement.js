import express from "express";
import validateJWT from "../middlewares/validateJWT";

import * as notificationManagementController from "../controllers/notificationManagement/notificationManagementController";

const router = express.Router();

// Middleware to validate JWT for protected routes
router.use(validateJWT);

// Route to get notifications for the authenticated user
router.get("/", notificationManagementController.getNotifications);

// Route to mark a notification as read
router.post(
  "/:notificationId/mark-as-read",
  notificationManagementController.markNotificationAsRead
);

// Route to delete a notification
router.delete(
  "/:notificationId",
  notificationManagementController.deleteNotification
);

export default router;
