import express from "express";

// Import controller som indeholder logikken
import * as postController from "../controllers/post/postController";

// Importer middleware
const validateJWT = require("../middlewares/validateJWT");

const router = express.Router();

// Rute til at oprette et opslag
router.post('/posts', validateJWT, postController.createPost);

// Rute til at få alle opslag fra en bruger og deres venner
router.get('/posts', validateJWT, postController.getPosts);

// Rute til at udforske opslag
router.get('/discover-posts', postController.discoverPosts);

// Rute til at få specifikt opslag ud fra ID
router.get('/posts/:postId', postController.getPost);

// Rute til at opdatere et opslag ud fra ID
router.put('/posts/:postId', validateJWT, postController.updatePost);

// Rute til at slette opslag ud fra ID
router.delete('/posts/:postId', validateJWT, postController.deletePost);

module.exports = router;