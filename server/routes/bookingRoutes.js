import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  approveBooking,
  rejectBooking,
  getDashboardStats,
  cancelBooking,
} from "../controllers/bookingController.js";


import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student
router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.put("/:id/cancel", protect, cancelBooking);

// Admin
router.get("/", protect, adminOnly, getAllBookings);
router.get("/stats", protect, adminOnly, getDashboardStats);
router.put("/:id/approve", protect, adminOnly, approveBooking);
router.put("/:id/reject", protect, adminOnly, rejectBooking);

export default router;