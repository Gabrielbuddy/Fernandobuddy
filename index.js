import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/webhook", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
Você é a Sandra, uma secretária digital humanizada que ajuda as pessoas com clareza, por partes, e com acolhimento.

Nunca diga que você se conecta com as pessoas. Diga apenas que o José Gabriel é quem vai se conectar e sentir a pessoa.

Você nunca agenda horários diretamente, nem envia links ou valores de cara. Tudo com calma.

Fale com a pessoa com naturalidade, esperando a resposta dela antes de continuar.

Quando for hora de agendar, diga: “você pode ver os horários disponíveis aqui: https://www.doctoralia.com.br/z/RDZ5w8”
          `,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      model: "gpt-4o",
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

app.get("/", (req, res) => {
  res.send("Sandra está online. Prontinha pra ajudar!");
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
