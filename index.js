const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

const token = "EAAI6D0nD7KgBPAOCMhWnwuBubcgdMX0xv04myfKhFgnZAusGRvyZCa3D2p643T4QgUadNVp9znfOjlRyEgI8X54gZB4oUPG4OCZCnerHherNaT7ubBKA6T2jkzhxJgnJZCzkN8bb7IX4osjdWj0zgNhkYrHugpGz6ywancsLwCjUjmjbZBAWlRZAlk2GWv0XU8W8r6DC5fYzSoocMJaSTk4edfTi5kSt1LnDarlcYzRkyqRXwZDZD";
const phone_number_id = "721478814382979";

app.get("/webhook", (req, res) => {
  const verify_token = "sandra123"; // esse é o token que você vai cadastrar no painel da Meta

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === verify_token) {
    console.log("WEBHOOK VERIFICADO COM SUCESSO!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});


app.post("/webhook", (req, res) => {
  console.log("Webhook recebido!");
  console.log(JSON.stringify(req.body, null, 2));

  const message = {
    messaging_product: "whatsapp",
    to: "5535999561225",
    type: "text",
    text: {
      body: "Oi! Eu sou a Sandra, secretária virtual do José Gabriel. 🌟"
    }
  };

  axios.post(`https://graph.facebook.com/v17.0/${phone_number_id}/messages`, message, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    console.log("Mensagem enviada com sucesso:", response.data);
    res.sendStatus(200);
  })
  .catch(error => {
    console.error("Erro ao responder:", error.response ? error.response.data : error.message);
    res.sendStatus(500);
  });
});

app.get("/", (req, res) => {
  res.send("Sandra está online! 🌐");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
