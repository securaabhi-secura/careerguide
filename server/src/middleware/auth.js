import { verifyAccessToken } from "../utils/tokens.js";
import { query } from "../db/index.js";

export async function requireAuth(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const payload = verifyAccessToken(token);
    const result = await query(
      "SELECT id, full_name, email, class_level, created_at FROM users WHERE id = $1",
      [payload.sub]
    );
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    req.user = user;
    next();
  } catch (err) {
    if (err?.name === "JsonWebTokenError" || err?.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired, please log in again" });
    }
    next(err);
  }
}
