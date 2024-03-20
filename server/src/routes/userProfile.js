import express from "express";
import validateJWT from "../middlewares/validateJWT.js";

import * as userProfileController from "../controllers/userProfile/userProfileController.js";

const router = express.Router();

// Middleware til at validere JWT
router.use(validateJWT);

// Rute til at få profilinformation om bruger
router.get("/:userId?", userProfileController.getUserProfile);

// Rute til at opdatere profilinformation for bruger
router.put("/", userProfileController.updateUserProfile);

// Rute til at slette brugerprofil
router.delete("/", userProfileController.deleteUserProfile);

export default router;
