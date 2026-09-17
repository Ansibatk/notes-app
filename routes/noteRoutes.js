import express from "express";

import {
  createNote,
  getNotes,
  deleteNote
} from "../controllers/noteController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createNote);
router.get("/", getNotes);
router.delete("/:id", deleteNote);

export default router;