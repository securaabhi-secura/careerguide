import { Router } from "express";
import { CAREERS } from "../data/careers.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ careers: CAREERS.map(({ traits, ...c }) => c) });
});

router.get("/:id", (req, res) => {
  const career = CAREERS.find((c) => c.id === req.params.id);
  if (!career) return res.status(404).json({ error: "Career not found" });
  const { traits, ...safe } = career;
  res.json({ career: safe });
});

export default router;
