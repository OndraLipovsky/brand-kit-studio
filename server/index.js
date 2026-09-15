import express from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeWebsite } from "./analyzer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.join(__dirname, "../client/dist");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Analyze website endpoint
app.post("/api/analyze", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    console.log(`[Analyzer] Starting analysis for: ${url}`);
    const result = await analyzeWebsite(url);
    console.log(`[Analyzer] Successfully analyzed: ${result.brandName} (${result.url})`);
    res.json(result);
  } catch (error) {
    console.error(`[Analyzer] Error analyzing ${url}:`, error.message);
    res.status(500).json({
      error: "Failed to analyze website",
      details: error.message,
      suggestion: "Please check if the URL is accessible and correct (e.g. stripe.com or https://example.com)."
    });
  }
});

// Image proxy endpoint to bypass CORS when exporting to PDF / drawing onto canvas
app.get("/api/proxy-image", async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).send("url query parameter is required");
  }

  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    const contentType = response.headers["content-type"] || "image/png";
    res.set("Content-Type", contentType);
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(Buffer.from(response.data));
  } catch (error) {
    res.status(502).send("Failed to proxy image: " + error.message);
  }
});

// Serve client static assets in production
app.use(express.static(clientDist));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) {
      next();
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Brand Kit Studio running on http://localhost:${PORT}`);
});