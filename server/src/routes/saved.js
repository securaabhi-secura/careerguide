import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { query } from "../db/index.js";
import { CAREERS } from "../data/careers.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const result = await query(
      "SELECT career_id FROM saved_careers WHERE user_id = $1 ORDER BY id DESC",
      [req.user.id]
    );
    const ids = new Set(result.rows.map((r) => r.career_id));
    const careers = CAREERS.filter((c) => ids.has(c.id)).map(({ traits, ...c }) => c);
    res.json({ careers });
  } catch (err) {
    next(err);
  }
});

const bodySchema = z.object({ careerId: z.string().min(1) });

router.post("/", validate(bodySchema), async (req, res, next) => {
  try {
    const { careerId } = req.body;
    if (!CAREERS.some((c) => c.id === careerId)) {
      return res.status(404).json({ error: "Career not found" });
    }
    await query(
      "INSERT INTO saved_careers (user_id, career_id) VALUES ($1, $2) ON CONFLICT (user_id, career_id) DO NOTHING",
      [req.user.id, careerId]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete("/:careerId", async (req, res, next) => {
  try {
    await query("DELETE FROM saved_careers WHERE user_id = $1 AND career_id = $2", [
      req.user.id,
      req.params.careerId,
    ]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
