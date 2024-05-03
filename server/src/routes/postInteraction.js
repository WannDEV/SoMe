import express from "express";
import validateJWT from "../middlewares/validateJWT.js";

import * as postInteractionController from "../controllers/postInteraction/postInteractionController.js";

const router = express.Router();

// Middleware til at validere JWT-token
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

// Rute til at dele et opslag
router.post("/:postId/share", postInteractionController.sharePost);

// Rute til at hente kommentarer til et opslag
router.get("/:postId/comments", postInteractionController.getComments);

export default router;
