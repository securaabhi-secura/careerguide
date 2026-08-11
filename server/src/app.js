import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import { ensureSchema } from "./db/index.js";

import authRoutes from "./routes/auth.js";
import careersRoutes from "./routes/careers.js";
import quizRoutes from "./routes/quiz.js";
import savedRoutes from "./routes/saved.js";
import chatRoutes from "./routes/chat.js";
import collegesRoutes from "./routes/colleges.js";
import profileRoutes from "./routes/profile.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

// Make sure Postgres tables exist before handling any /api request.
// ensureSchema() memoizes its promise, so this is a no-op after the first
// request on a given warm instance (cheap on both a long-running server and
// a Vercel serverless function).
app.use("/api", async (req, res, next) => {
  try {
    await ensureSchema();
    next();
  } catch (err) {
    next(err);
  }
});

// Basic CSRF mitigation for cookie-auth: state-changing requests must carry
// this custom header, which only same-origin JS (not a cross-site form) can set.
app.use((req, res, next) => {
  const mutating = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
  const isAuthBootstrap = req.path === "/api/auth/login" || req.path === "/api/auth/register";
  if (mutating && !isAuthBootstrap && req.headers["x-requested-with"] !== "careerguide") {
    return res.status(403).json({ error: "Invalid request" });
  }
  next();
});

// NOTE on Vercel: this in-memory limiter is per warm serverless instance, not
// global — it's still a useful speed bump against casual abuse, but for a
// hard guarantee under real traffic pair it with Vercel Firewall rate limiting
// or an external store (e.g. Upstash Redis) in production.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/careers", careersRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/saved-careers", savedRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/colleges", collegesRoutes);
app.use("/api/profile", profileRoutes);

// Single-service deploy option for non-Vercel hosts: if the client has been
// built into ../client/dist, serve it and fall back to index.html for
// client-side routes. On Vercel, the static build is served by Vercel itself,
// so this block simply won't find the folder and is skipped.
const clientDist = path.join(__dirname, "..", "..", "client", "dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use((req, res) => res.status(404).json({ error: "Not found" }));

// Centralized error handler — never leak stack traces to clients.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

export default app;
