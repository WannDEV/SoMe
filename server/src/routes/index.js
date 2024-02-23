import express from "express";

// Importer alle ruter
import auth from "./auth";
import friendship from "./friendship";
import postManagement from "./postManagement";
import postInteraction from "./postInteraction";
import notificationManagement from "./notificationManagement";

const router = express.Router();

// Samler alle ruter inde under denne rute
router.use("/auth", auth);
router.use("/friendship", friendship);
router.use("/post-management", postManagement);
router.use("/post-interaction", postInteraction);
router.use("notification-management", notificationManagement);

export default router;
