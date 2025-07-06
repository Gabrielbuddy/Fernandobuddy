const express = require('express');
const app = express();
app.use(express.json());

// Rota de verificação (GET) do webhook
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = "123456"; // esse precisa ser igual ao token da Meta
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook verificado com sucesso!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Rota para receber mensagens (POST)
app.post('/webhook', (req, res) => {
  console.log("Mensagem recebida:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
