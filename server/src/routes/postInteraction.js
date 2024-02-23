import express from "express";
import validateJWT from "../middlewares/validateJWT";

import * as postInteractionController from "../controllers/postInteraction/postInteractionController";

const router = express.Router();

// Middleware to validate JWT for protected routes
router.use(validateJWT);

// Rute til at like et opslag
router.post("/:postId/like", postInteractionController.addLike);

// Rute til at fjerne like fra et opslag
router.delete("/:postId/like", postInteractionController.removeLike);

// Rute til at tilføje en kommentar til et opslag
router.post("/:postId/comment", postInteractionController.addComment);

// Rute til at slette en kommentar fra et opslag
router.delete(
  "/:postId/comment/:commentId",
  postInteractionController.deleteComment
);

export default router;