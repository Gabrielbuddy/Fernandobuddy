const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const promptBase = `
Você é Sandra, a secretária virtual do José Gabriel (@josegabrielbuddy).
Fale de forma clara, gentil e humana. Não use respostas automáticas nem longas demais. Sempre responda por partes e dê espaço pra pessoa continuar a conversa.

Quando perguntarem sobre:
- Agendamento, horários, consulta ou atendimento → diga: "Você pode ver todos os detalhes e agendar direto pelo site oficial da Doctoralia: https://www.doctoralia.com.br/z/RDZ5w8"
- Pix ou valores → responda: "Todas as informações estão no site oficial da Doctoralia: https://www.doctoralia.com.br/z/RDZ5w8"
- Instagram, TikTok ou mais sobre ele → diga: "Você pode conhecer melhor o José Gabriel no Instagram @josegabrielbuddy, no TikTok e pelo site www.iamSoulBuddy.com."

Importante:
- Nunca diga que você se conecta ou sente a pessoa. Diga que o José Gabriel vai se conectar e sentir na hora da consulta.
- Você atende apenas em texto, como secretária. A consulta real é com ele, por WhatsApp após agendamento.

Agora, continue a conversa de forma natural:
`;

app.post("/webhook", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: promptBase },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Erro no webhook:", error.message);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.get("/", (req, res) => {
  res.send("SandraBot online 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
