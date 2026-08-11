import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { query } from "../db/index.js";
import { counselorReply } from "../data/colleges.js";

const router = Router();
router.use(requireAuth);

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/", async (req, res, next) => {
  try {
    const result = await query(
      "SELECT role, content, created_at FROM chat_messages WHERE user_id = $1 ORDER BY id ASC",
      [req.user.id]
    );
    res.json({ messages: result.rows });
  } catch (err) {
    next(err);
  }
});

const sendSchema = z.object({ message: z.string().trim().min(1).max(500) });

router.post("/", chatLimiter, validate(sendSchema), async (req, res, next) => {
  try {
    const { message } = req.body;

    await query(
      "INSERT INTO chat_messages (user_id, role, content) VALUES ($1, 'user', $2)",
      [req.user.id, message]
    );

    const { reply, suggestQuiz } = counselorReply(message);

    await query(
      "INSERT INTO chat_messages (user_id, role, content) VALUES ($1, 'assistant', $2)",
      [req.user.id, reply]
    );

    res.json({ reply, suggestQuiz });
  } catch (err) {
    next(err);
  }
});

export default router;
