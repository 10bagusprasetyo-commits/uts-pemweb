import express from "express";
import { getAllEvents, createEvent, deleteEvent, updateEvent } from "../controllers/eventController";

const router = express.Router();

router.get("/", getAllEvents);
router.post("/", createEvent);
router.delete("/:id", deleteEvent);
router.put("/:id", updateEvent);

export default router;