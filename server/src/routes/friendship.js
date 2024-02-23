import express from "express";

// Import controller som indeholder logikken
import * as friendshipController from "../controllers/friendship/friendshipController";

// Importer middleware
import validateJWT from "../middlewares/validateJWT";

const router = express.Router();

// Rute til at sende venneanmodning
router.post('/friend-request', validateJWT, friendshipController.sendFriendRequest);

// Rute til at acceptere en venneanmodning
router.post('/friend-request/accept', validateJWT, friendshipController.acceptFriendRequest);

// Rute til at afvise en venneanmodning
router.delete('/friend-request/reject', validateJWT, friendshipController.rejectFriendRequest);

// Route to get friends for a user
router.get('/friends/:userId', friendshipController.getFriends);

// Rute til at fjerne en ven
router.delete('/friends/:userId/:friendId', validateJWT, friendshipController.removeFriend);

module.exports = router;
