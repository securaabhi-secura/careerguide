import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { query } from "../db/index.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  COOKIE_OPTS,
} from "../utils/tokens.js";

const router = Router();

// Strict limiter on auth endpoints to slow down brute-force / credential stuffing.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again later." },
});

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(120),
  phone: z.string().trim().max(20).optional().default(""),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[A-Za-z]/, "Password must include a letter")
    .regex(/[0-9]/, "Password must include a number"),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

async function issueSession(res, user) {
  const accessToken = signAccessToken(user);
  const { token: refreshToken } = signRefreshToken(user);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await query(
    "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
    [user.id, hashToken(refreshToken), expiresAt]
  );

  res.cookie("access_token", accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
  res.cookie("refresh_token", refreshToken, {
    ...COOKIE_OPTS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

router.post("/register", authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = bcrypt.hashSync(password, 12);
    const inserted = await query(
      "INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [fullName, email, passwordHash]
    );

    const user = { id: inserted.rows[0].id, email };
    await issueSession(res, user);

    res.status(201).json({
      user: { id: user.id, fullName, email, classLevel: "" },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    const row = result.rows[0];

    // Generic error message on purpose — don't reveal whether the email exists.
    if (!row || !bcrypt.compareSync(password, row.password_hash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    await issueSession(res, row);
    res.json({
      user: {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        classLevel: row.class_level,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      res.clearCookie("access_token", COOKIE_OPTS);
      res.clearCookie("refresh_token", COOKIE_OPTS);
      return res.status(401).json({ error: "Session expired, please log in again" });
    }

    const tokenHash = hashToken(token);
    const stored = await query(
      "SELECT * FROM refresh_tokens WHERE user_id = $1 AND token_hash = $2",
      [payload.sub, tokenHash]
    );
    const storedRow = stored.rows[0];

    if (!storedRow || new Date(storedRow.expires_at) < new Date()) {
      return res.status(401).json({ error: "Session expired, please log in again" });
    }

    const userResult = await query("SELECT * FROM users WHERE id = $1", [payload.sub]);
    const user = userResult.rows[0];
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    // Rotate: delete old refresh token, issue a new pair.
    await query("DELETE FROM refresh_tokens WHERE id = $1", [storedRow.id]);
    await issueSession(res, user);

    res.json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        classLevel: user.class_level,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const token = req.cookies?.refresh_token;
    if (token) {
      await query("DELETE FROM refresh_tokens WHERE token_hash = $1", [hashToken(token)]);
    }
    res.clearCookie("access_token", COOKIE_OPTS);
    res.clearCookie("refresh_token", COOKIE_OPTS);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      fullName: req.user.full_name,
      email: req.user.email,
      classLevel: req.user.class_level,
    },
  });
});

export default router;
