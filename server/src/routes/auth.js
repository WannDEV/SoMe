import express from "express";

// Import controller som indeholder logikken
import * as authController from "../controllers/auth/authController.js";

const router = express.Router();

// Rute til at registere en bruger
router.post("/register", authController.register);

// Rute til at logge bruger ind
router.post("/login", authController.login);

// Rute til at logge bruger ud
router.post("/logout", authController.logout);

export default router;
