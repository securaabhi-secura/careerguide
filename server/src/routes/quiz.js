import { Router } from "express";
import { z } from "zod";
import { QUIZ_QUESTIONS, TRAITS, scoreCareers } from "../data/careers.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { query } from "../db/index.js";

const router = Router();

router.get("/questions", (req, res) => {
  res.json({ questions: QUIZ_QUESTIONS });
});

const submitSchema = z.object({
  answers: z.record(z.string(), z.array(z.string())),
});

router.post("/submit", requireAuth, validate(submitSchema), async (req, res, next) => {
  try {
    const { answers } = req.body;

    const selectedTraits = [];
    for (const question of QUIZ_QUESTIONS) {
      const picked = answers[question.id] || [];
      for (const trait of picked) {
        if (TRAITS.includes(trait)) selectedTraits.push(trait);
      }
    }

    if (selectedTraits.length === 0) {
      return res.status(400).json({ error: "Please answer at least one question" });
    }

    const results = scoreCareers(selectedTraits).slice(0, 6).map(({ traits, ...c }) => c);

    await query(
      "INSERT INTO quiz_results (user_id, answers_json, results_json) VALUES ($1, $2, $3)",
      [req.user.id, JSON.stringify(answers), JSON.stringify(results)]
    );

    res.json({ results });
  } catch (err) {
    next(err);
  }
});

router.get("/latest", requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      "SELECT results_json, created_at FROM quiz_results WHERE user_id = $1 ORDER BY id DESC LIMIT 1",
      [req.user.id]
    );
    const row = result.rows[0];
    if (!row) return res.json({ results: null });
    res.json({ results: row.results_json, createdAt: row.created_at });
  } catch (err) {
    next(err);
  }
});

export default router;
