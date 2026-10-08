import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getCurrentAdmin,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.get("/me", protect, getCurrentAdmin);

export default router;