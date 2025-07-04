const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "sandra_secret";

// Verificação do webhook (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("WEBHOOK VERIFICADO ✅");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recebimento de mensagens (POST)
app.post("/webhook", (req, res) => {
  console.log("📥 Mensagem recebida:");
  console.dir(req.body, { depth: null });

  if (
    req.body.object === "whatsapp_business_account" &&
    req.body.entry?.[0]?.changes?.[0]?.value?.messages
  ) {
    const messages = req.body.entry[0].changes[0].value.messages;
    const from = messages[0].from;
    const text = messages[0].text?.body;

    console.log(`📨 De: ${from}`);
    console.log(`💬 Mensagem: ${text}`);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
