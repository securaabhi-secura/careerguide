import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { query } from "../db/index.js";

const router = Router();
router.use(requireAuth);

const updateSchema = z.object({
  fullName: z.string().trim().min(2).max(80).optional(),
  classLevel: z.string().trim().max(40).optional(),
});

router.patch("/", validate(updateSchema), async (req, res, next) => {
  try {
    const { fullName, classLevel } = req.body;
    if (fullName !== undefined) {
      await query("UPDATE users SET full_name = $1 WHERE id = $2", [fullName, req.user.id]);
    }
    if (classLevel !== undefined) {
      await query("UPDATE users SET class_level = $1 WHERE id = $2", [classLevel, req.user.id]);
    }
    const result = await query(
      "SELECT id, full_name, email, class_level FROM users WHERE id = $1",
      [req.user.id]
    );
    const user = result.rows[0];
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

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Za-z]/, "Password must include a letter")
    .regex(/[0-9]/, "Password must include a number"),
});

router.post("/change-password", validate(passwordSchema), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    const row = result.rows[0];
    if (!bcrypt.compareSync(currentPassword, row.password_hash)) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    const newHash = bcrypt.hashSync(newPassword, 12);
    await query("UPDATE users SET password_hash = $1 WHERE id = $2", [newHash, req.user.id]);
    // Invalidate all existing sessions for this user on password change.
    await query("DELETE FROM refresh_tokens WHERE user_id = $1", [req.user.id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
