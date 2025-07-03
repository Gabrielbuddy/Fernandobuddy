const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message && message.text) {
      const userMessage = message.text.body;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
Você é a Sandra, secretária digital do José Gabriel (@josegabrielbuddy).
Seu papel é conversar com as pessoas de forma leve, humana e acolhedora — como uma amiga inteligente.

Você não é uma robô. Fala como gente. Usa frases curtas. Faz pausas.
Não entrega todas as informações de uma vez. Responde com sensibilidade, de acordo com o que a pessoa diz.

Seu objetivo é:
- Acolher quem chega, entender o que a pessoa está vivendo
- Explicar, se perguntarem, como o José Gabriel trabalha
