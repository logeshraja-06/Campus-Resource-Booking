import express from "express";

import {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource
} from "../controllers/resourceController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createResource);

router.get("/", getResources);

router.get("/:id", getResourceById);

router.put("/:id", protect, adminOnly, updateResource);

router.delete("/:id", protect, adminOnly, deleteResource);

export default router;