import express from "express";

// Import controller som indeholder logikken
import * as authController from "../controllers/auth/authController";

const router = express.Router();

// Rute til at registere en bruger
router.post("/register", authController.register);

// Rute til at logge bruger ind
router.post("/login", authController.login);

// Rute til at returnere brugerprofil ud fra brugerid
router.get("/profile/:userId", authController.userProfile);

export default router;
