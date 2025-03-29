const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors("*"));
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (error) {
    console.error("Error fetching response:", error.response?.data || error.message);
    res.status(500).json({ reply: "Sorry, I couldn't fetch a response." });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
