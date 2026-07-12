import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/resources",resourceRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend Working Successfully"
  });
});

export default app;