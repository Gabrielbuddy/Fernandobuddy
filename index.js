const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Sandra está online!");
});

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const phoneNumberId = changes.value.metadata.phone_number_id;
      const from = message.from;
      const name = message?.profile?.name || "amigo(a)";
      const token = process.env.WHATSAPP_TOKEN;

      await axios.post(
        `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: `Oi ${name}! Eu sou a Sandra, secretária virtual do José Gabriel. Em que posso te ajudar hoje?`
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Erro ao responder:", error.response?.data || error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
