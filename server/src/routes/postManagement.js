import express from "express";

// Import controller som indeholder logikken
import * as postManagementController from "../controllers/postManagement/postManagementController.js";

// Importer middleware
import validateJWT from "../middlewares/validateJWT.js";

const router = express.Router();

// Middleware til at validere JWT
router.use(validateJWT);

// Rute til at oprette et opslag
router.post("/post", postManagementController.createPost);

// Rute til at få alle opslag fra en bruger og deres venner
router.get("/posts", postManagementController.getPosts);

// Rute til at udforske opslag
router.get("/discover-posts", postManagementController.discoverPosts);

// Rute til at få alle opslag fra en bestemt bruger
router.get("/posts/all/:username", postManagementController.getUserPosts);

// Rute til at få specifikt opslag ud fra ID
router.get("/posts/:postId", postManagementController.getPost);

// Rute til at opdatere et opslag ud fra ID
router.put("/posts/:postId", postManagementController.updatePost);

// Rute til at slette opslag ud fra ID
router.delete(
  "/posts/:postId",
  validateJWT,
  postManagementController.deletePost
);

export default router;
