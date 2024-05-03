// Importerer Express-frameworket og validateJWT-middlewaren
import express from "express";
import validateJWT from "../middlewares/validateJWT.js";

// Importerer alle funktioner fra notificationManagementController.js
import * as notificationManagementController from "../controllers/notificationManagement/notificationManagementController.js";

// Opretter en ny router fra Express
const router = express.Router();

// Anvender validateJWT-middlewaren på alle ruter i denne router
router.use(validateJWT);

// Definerer en GET-rute til at hente alle notifikationer
router.get("/", notificationManagementController.getNotifications);

// Definerer en POST-rute til at markere en notifikation som læst
router.post(
  "/:notificationId/mark-as-read",
  notificationManagementController.markNotificationAsRead
);

// Definerer en DELETE-rute til at slette en notifikation
router.delete(
  "/:notificationId",
  notificationManagementController.deleteNotification
);

// Eksporterer routeren til brug i andre filer
export default router;
