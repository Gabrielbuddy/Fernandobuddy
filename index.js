const express = require('express');
const app = express();
app.use(express.json());

app.get('/webhook', (req, res) => {
  const verify_token = '123456';
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === verify_token) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', (req, res) => {
  console.log('Mensagem recebida:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

module.exports = app;
