const express = require("express");
const path = require("path");
const app = express();

// Public folder (all files — HTML, CSS, JS, images, audio)
app.use(express.static(path.join(__dirname, "public")));

// Force browser to refresh & not use old cached CSS/JS
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Default route → open website
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Server running
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Kolkata Chronicle running at http://localhost:${PORT}`);
});
