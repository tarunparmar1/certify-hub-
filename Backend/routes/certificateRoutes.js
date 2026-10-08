import express from "express";

import {
  generateCertificate,
  verifyCertificate,
} from "../controllers/certificateController.js";

const router = express.Router();

// Generate certificate dynamically
router.post("/generate", generateCertificate);

// Verify certificate
router.get("/verify", verifyCertificate);

export default router;