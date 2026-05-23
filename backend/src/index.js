import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import rute-rute yang udah lu bikin di folder routes
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import eventRoutes from "./routes/eventRoutes";
import pembicaraRoutes from "./routes/pembicaraRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Pasang jalur pintunya (Routing API)
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/speakers", pembicaraRoutes);

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server nyala aman di port ${PORT} 🚀`);
});