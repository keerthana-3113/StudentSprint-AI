const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("."));

const GROQ_API_KEY = "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"; // paste groq key here

app.post("/generate", async (req, res) => {
    try {
        console.log("Request received:", req.body.messages[0].content.slice(0, 50));

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${"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"}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                max_tokens: 1024,
                messages: req.body.messages
            })
        });

        const data = await response.json();
        console.log("Groq response status:", response.status);
        console.log("Groq error detail:", JSON.stringify(data));
        res.json(data);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});