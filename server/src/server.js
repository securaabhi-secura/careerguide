// Local/non-Vercel dev entry point: starts a normal long-running Node server.
// On Vercel, api/index.js imports app.js directly instead of this file.
import app from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`CareerGuide API running on http://localhost:${PORT}`);
});
