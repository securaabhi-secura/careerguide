import { Router } from "express";
import { COLLEGES } from "../data/colleges.js";

const router = Router();

router.get("/", (req, res) => {
  const { category, q } = req.query;
  let results = COLLEGES;
  if (category && category !== "All") {
    results = results.filter((c) => c.category === category);
  }
  if (q) {
    const needle = String(q).toLowerCase();
    results = results.filter((c) => c.name.toLowerCase().includes(needle));
  }
  res.json({ colleges: results });
});

export default router;
