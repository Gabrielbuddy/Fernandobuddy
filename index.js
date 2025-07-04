
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const token = "EAAI6D0nD7KgBPAOCMhWnwuBubcgdMX0xv04myfKhFgnZAusGRvyZCa3D2p643T4QgUadNVp9znfOjlRyEgI8X54gZB4oUPG4OCZCnerHherNaT7ubBKA6T2jkzhxJgnJZCzkN8bb7IX4osjdWj0zgNhkYrHugpGz6ywancsLwCjUjmjbZBAWlRZAlk2GWv0XU8W8r6DC5fYzSoocMJaSTk4edfTi5kSt1LnDarlcYzRkyqRXwZDZD";
const phone_number_id = "721478814382979";

app.get("/", (req, res) => {
  res.send("Sandra está viva 🫶🏻");
});

app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const message = changes?.value?.messages?.[0];

  if (message) {
    const from = message.from;
    const text = message.text?.body;

    await axios.post(
      `https://graph.facebook.com/v18.0/${phone_number_id}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: "Oi! Eu sou a Sandra, secretária do José Gabriel. Como posso te ajudar?" },
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
