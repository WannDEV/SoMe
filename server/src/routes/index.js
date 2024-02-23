import express from "express";

// Importer alle ruter
import user from "./user";
import friendship from "./friendship";
import post from "./post";

const router = express.Router();

// Samler alle ruter inde under denne rute
router.use("/user", user);
router.use("/friendship", friendship);
router.use("/post", post);



export default router;