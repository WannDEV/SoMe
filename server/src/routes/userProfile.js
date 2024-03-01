import express from "express";
import validateJWT from "../middlewares/validateJWT.js";

import * as userProfileController from "../controllers/userProfile/userProfileController.js";

const router = express.Router();

// Rute til at få profilinformation om bruger
router.get("/:userId", userProfileController.getUserProfile);

// Rute til at opdatere profilinformation for bruger
router.put("/:userId", validateJWT, userProfileController.updateUserProfile);

// Rute til at slette brugerprofil
router.delete("/:userId", validateJWT, userProfileController.deleteUserProfile);

export default router;
