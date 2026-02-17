import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { prisma } from "./prisma";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const port = parseInt(process.env.PORT || "4000", 10);

// --------------- Middleware ---------------

app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());

// CORS – accepts comma-separated origins from ENV
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

// --------------- Routes ---------------

app.get("/api/health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "ok" });
  } catch (err) {
    next(err);
  }
});

// --------------- Error handling ---------------

app.use(errorHandler);

// --------------- Start ---------------

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend listening on port ${port}`);
});
