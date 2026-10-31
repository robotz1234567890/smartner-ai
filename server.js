const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "Smartner AI" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: "Smartner AI is not configured yet. Add OPENAI_API_KEY in the server environment."
      });
    }

    const message = typeof req.body.message === "string" ? req.body.message.trim() : "";
    const history = Array.isArray(req.body.history) ? req.body.history : [];
    if (!message) {
      return res.status(400).json({ error: "Please enter a message." });
    }

    const safeHistory = history
      .filter((item) =>
        item &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string"
      )
      .slice(-12)
      .map((item) => ({ role: item.role, content: item.content.slice(0, 4000) }));

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: "You are Smartner AI, a helpful, clear, and friendly AI assistant.",
        input: [...safeHistory, { role: "user", content: message }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "The AI service returned an error."
      });
    }

    const answer = (data.output || [])
      .flatMap((item) => item.content || [])
      .filter((item) => item.type === "output_text")
      .map((item) => item.text)
      .join("\n")
      .trim();

    if (!answer) {
      return res.status(502).json({ error: "The AI returned an empty response. Please try again." });
    }

    res.json({ reply: answer });
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Smartner AI is running on port ${PORT}`);
});
