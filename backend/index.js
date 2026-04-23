import express from 'express'
import 'dotenv/config'
import connectDB from './config/db.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import forgotRoute from './routes/forgotPasswordRoute.js';
import adminRoute from './routes/adminRoutes.js';
import courseRoute from './routes/courseRoute.js';
import seedSuperadmin from './utils/seedSuperadmin.js';
import contentRoute from './routes/courseContentRoutes.js';
import attendenceRoute from './routes/attendenceRoute.js';
import libraryRoute from './routes/libraryRoute.js';
import fineRoute from './routes/fineRoute.js';
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

const app = express()
const PORT = process.env.PORT || 4000;

connectDB()

// ── Body Parsing (single, with a sane limit) ────────────────────────────────
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet());
app.use(compression());

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      return callback(
        new Error('The CORS policy for this site does not allow access from the specified Origin.'),
        false
      );
    }
    return callback(null, true);
  },
  credentials: true,
}));

// ── Rate Limiters ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Strict limit on login/register attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many authentication attempts, please try again later." },
});

const attendanceLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Attendance request limit reached, slow down." },
});

app.use(globalLimiter);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduManage Pro API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/forgot-password', authLimiter, forgotRoute);
app.use('/api/admin', adminRoute);
app.use('/api/course', courseRoute);
app.use('/api/content', contentRoute);
app.use('/api/attendance', attendanceLimiter, attendenceRoute);
app.use('/api/library', libraryRoute);
app.use('/api/fine', fineRoute);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);

  // Handle CORS errors
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({ success: false, message: err.message });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({ success: false, message: `Duplicate value for ${field}` });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ── Start Server ──────────────────────────────────────────────────────────────
const server = app.listen(PORT, async () => {
  console.log(`🚀 EduManage Pro API running on port ${PORT}`);
  await seedSuperadmin();
});

server.setTimeout(15 * 60 * 1000);
