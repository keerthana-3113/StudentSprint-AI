const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // serves your index.html and style.css

const CLAUDE_API_KEY = "sk-ant-YOUR_KEY_HERE"; // paste your key here

app.post("/generate", async (req, res) => {
    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "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",
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 1024,
                messages: req.body.messages
            })
        });

        const data = await response.json();
        res.json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});