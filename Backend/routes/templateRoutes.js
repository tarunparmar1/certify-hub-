import express from "express";
import {
  uploadTemplate,
  getTemplate,
  updatePositions,
} from "../controllers/templateController.js";

const router = express.Router();

router.post("/upload", uploadTemplate);
router.get("/:eventId", getTemplate);
router.put("/positions", updatePositions);
export default router;