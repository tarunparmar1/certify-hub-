import express from "express";

import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Event
router.post("/", protect,createEvent);

// Get All Events
router.get("/", protect,getEvents);

// Get Single Event
router.get("/:id",protect, getEvent);

// Update Event
router.put("/:id",protect, updateEvent);

// Delete Event
router.delete("/:id",protect, deleteEvent);

export default router;