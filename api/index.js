// Vercel routes every /api/* request here (see vercel.json rewrite).
// Express apps are callable as (req, res), so exporting it directly works
// as a Vercel Node.js serverless function.
import app from "../server/src/app.js";

export default app;
