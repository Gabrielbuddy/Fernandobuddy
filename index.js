// index.js
require("dotenv").config();
const express = require("express")("dotenv").config();
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

require("dotenv").config(); // carrega as variáveis do .env

const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);


app.use(bodyParser.json());

// Agora usando variáveis de ambiente
const token = process.env.TOKEN;
const phone_number_id = process.env.PHONE_NUMBER_ID;
const verify_token = process.env.VERIFY_TOKEN;

// Validação do webhook da Meta
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const tokenReceived = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && tokenReceived === verify_token) {
    console.log("WEBHOOK VERIFICADO ✅");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recebendo mensagens
app.post("/webhook", async (req, res) => {
  console.log("Mensagem recebida! 📩");
  console.log(JSON.stringify(req.body, null, 2));

  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const messages = value?.messages;

  if (messages && messages[0]) {
    const from = messages[0].from;
    const textoRecebido = messages[0].text?.body;

    if (!textoRecebido) {
      console.log("❌ Mensagem não é de texto.");
      return res.sendStatus(200);
    }

    try {
      const prompt = `Você é Sandra, secretária do José Gabriel. A pessoa escreveu: "${textoRecebido}".
Responda de forma simpática, clara e objetiva. Sempre ofereça o link para agendar: https://www.doctoralia.com.br/z/RDZ5w8`;

      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é uma secretária digital chamada Sandra, do José Gabriel. Sempre responde com empatia e clareza." },
          { role: "user", content: prompt }
        ]
      });

      const resposta = completion.data.choices[0].message.content;

      const message = {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: resposta }
      };

      await axios.post(`https://graph.facebook.com/v17.0/${phone_number_id}/messages`, message, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("✅ Mensagem enviada com sucesso");
      res.sendStatus(200);
    } catch (error) {
      console.error("❌ Erro ao responder:", error.response?.data || error.message);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(200);
  }
});

    axios.post(`https://graph.facebook.com/v17.0/${phone_number_id}/messages`, message, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      console.log("Mensagem enviada com sucesso ✅", response.data);
      res.sendStatus(200);
    })
    .catch(error => {
      console.error("Erro ao responder ❌", error.response?.data || error.message);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(200);
  }
});

// Raiz
app.get("/", (req, res) => {
  res.send("Sandra está online! 🌐");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
