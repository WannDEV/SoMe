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
router.put("/friend-request/accept", friendshipController.acceptFriendRequest);

// Rute til at afvise en venneanmodning
router.delete(
  "/friend-request/reject/:friendId",
  friendshipController.rejectFriendRequest
);

// Rute til at hente venner
router.get("/friends/:friendStatus", friendshipController.getFriends);

// Rute til at fjerne en ven
router.delete("/friends/:friendId", friendshipController.removeFriend);

// Rute til at søge efter venner
router.get("/friends/search/:searchQuery", friendshipController.searchFriends);

// Rute til at hente vennestatus
router.get(
  "/friends/all/statuses",
  friendshipController.getAllFriendshipStatuses
);

export default router;
