// index.js
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const token = "EAAI6D0nD7KgBPAOCMhWnwuBubcgdMX0xv04myfKhFgnZAusGRvyZCa3D2p643T4QgUadNVp9znfOjlRyEgI8X54gZB4oUPG4OCZCnerHherNaT7ubBKA6T2jkzhxJgnJZCzkN8bb7IX4osjdWj0zgNhkYrHugpGz6ywancsLwCjUjmjbZBAWlRZAlk2GWv0XU8W8r6DC5fYzSoocMJaSTk4edfTi5kSt1LnDarlcYzRkyqRXwZDZD";
const phone_number_id = "721478814382979";
const verify_token = "sandra_token_secreto";

// Validação do webhook da Meta
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === verify_token) {
    console.log("WEBHOOK VERIFICADO ✅");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recebendo mensagens
app.post("/webhook", (req, res) => {
  console.log("Mensagem recebida! 📩");
  console.log(JSON.stringify(req.body, null, 2));

  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const messages = value?.messages;

  if (messages && messages[0]) {
    const from = messages[0].from; // telefone do remetente

    const message = {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        body: "Oi! Eu sou a Sandra, secretária virtual do José Gabriel. 🌟\nSe quiser agendar uma sessão, acesse: https://www.doctoralia.com.br/z/RDZ5w8\n\nOu conheça mais sobre o trabalho dele no Instagram: @josegabrielbuddy."
      }
    };

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
    res.sendStatus(200); // Sem mensagens, mas responde para evitar erro na Meta
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
