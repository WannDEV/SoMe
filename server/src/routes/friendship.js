import express from "express";

// Import controller som indeholder logikken
import * as friendshipController from "../controllers/friendship/friendshipController.js";

// Importer middleware
import validateJWT from "../middlewares/validateJWT.js";

const router = express.Router();

// Middleware til at validere JWT
router.use(validateJWT);

// Rute til at sende venneanmodning
router.post("/friend-request", friendshipController.sendFriendRequest);

// Rute til at acceptere en venneanmodning
router.post("/friend-request/accept", friendshipController.acceptFriendRequest);

// Rute til at afvise en venneanmodning
router.delete(
  "/friend-request/reject",
  friendshipController.rejectFriendRequest
);

// Route to get friends for a user
router.get("/friends/", friendshipController.getFriends);

// Rute til at fjerne en ven
router.delete("/friends/:friendId", friendshipController.removeFriend);

export default router;
