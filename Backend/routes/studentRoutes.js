import express from "express";
import {
  createStudent,
  getStudents,
   uploadStudents,
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/", createStudent);
router.get("/:eventId", getStudents);
router.post("/upload", uploadStudents);

export default router;