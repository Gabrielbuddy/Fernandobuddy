// index.js
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const token = "EAAI6D0nD7KgBPD2JIcbvDDGjBQ2MzBoE4RjjSEli4lJxOjqt8ES7XjfkYJBYqAll9cyeUBcsq4og5DVhifv4CYYWnBgqUVWESGPDVTKgEd0F4IHMB9kJ5OR2UPaRfL7vsheEqakeXeGcSliTsnj1Fq52ZAssc25TyH9fpwtg4zOOmYOm6H5g1NudfVxT4EZBBEsBugkovhx2YwyGrwlfBZAOXFnGU2MSZCie9P3QZCiKcngZDZD"
const verify_token = "sandra_secreto";

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
