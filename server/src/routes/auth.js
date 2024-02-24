import express from "express";

// Import controller som indeholder logikken
import * as authController from "../controllers/auth/authController";

const router = express.Router();

// Rute til at registere en bruger
router.post("/register", authController.register);

// Rute til at logge bruger ind
router.post("/login", authController.login);

export default router;
