import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:5173", "https://personal-coaching-backend.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));


connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});