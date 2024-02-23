import express from "express";

// Import controller som indeholder logikken
import * as userController from "../controllers/user/userController";

const router = express.Router();

// Rute til at registere en bruger
router.post('/register', userController.register);

// Rute til at logge bruger ind
router.post('/login', userController.login);

// Rute til at returnere brugerprofil ud fra brugerid
router.get('/profile/:userId', userController.userProfile);

module.exports = router;