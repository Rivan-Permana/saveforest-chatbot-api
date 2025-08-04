import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // serve frontend from root

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/ask", async (req, res) => {
  const question = req.body.question;
  const systemPrompt = `
    Kamu adalah chatbot edukatif yang menjelaskan tentang isu deforestasi secara ramah, ilmiah, dan jelas.
    Jawabanmu harus membahas topik deforestasi, dampaknya, penyebab, atau solusi.
  `;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt + "\n\n" + question }],
        },
      ],
    });

    const response = await result.response.text();
    res.json({ reply: response });
  } catch (error) {
    console.error("❌ Gemini Error:", error.message);
    res.status(500).json({ error: "Gagal mendapatkan balasan dari Gemini." });
  }
});

// ✅ Gunakan port dari Cloud Run
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Chatbot Deforestasi aktif di port ${PORT}`);
});
