import express from "express";

// Importer alle ruter
import auth from "./auth.js";
import friendship from "./friendship.js";
import postManagement from "./postManagement.js";
import postInteraction from "./postInteraction.js";
import notificationManagement from "./notificationManagement.js";

const router = express.Router();

// Samler alle ruter inde under denne rute
router.use("/auth", auth);
router.use("/friendship", friendship);
router.use("/post-management", postManagement);
router.use("/post-interaction", postInteraction);
router.use("notification-management", notificationManagement);

export default router;
