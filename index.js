import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Página inicial
app.get("/", (req, res) => {
  res.send("Oi! Eu sou a Sandra, secretária virtual do José Gabriel.");
});

// Webhook do Meta
app.post("/webhook", (req, res) => {
  console.log("Recebido:", req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
