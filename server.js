import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/proxy", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl || !videoUrl.startsWith("http://")) {
    return res.status(400).send("Invalid URL");
  }

  try {
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) throw new Error("Failed to fetch video");

    res.set("Content-Type", videoResponse.headers.get("content-type") || "video/mp4");
    videoResponse.body.pipe(res);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Video proxy failed");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy Server is running on http://localhost:${PORT}`);
});
