import express from "express";
import { postJob } from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js"; // correct middleware import

const router = express.Router();

// Use 'protect' middleware (not verifyToken, since it's named protect)
router.post("/post", protect, postJob);

export default router;
