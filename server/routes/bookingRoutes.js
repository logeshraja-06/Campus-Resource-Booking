import express from "express";

import {
  createBooking,
  getMyBookings,
  approveBooking,
  rejectBooking,
} from "../controllers/bookingController.js";


import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student
router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);

// Admin
router.put("/:id/approve", protect, adminOnly, approveBooking);
router.put("/:id/reject", protect, adminOnly, rejectBooking);

export default router;