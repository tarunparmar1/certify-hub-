import express from "express";
import { uploadTemplate } from "../controllers/templateController.js";

const router = express.Router();

router.post("/upload", uploadTemplate);

export default router;