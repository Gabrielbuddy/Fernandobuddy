const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const saudacaoInicial = `
Oi! Eu sou a Sandra, a secretária virtual do José Gabriel.

Se quiser saber mais sobre ele ou agendar um atendimento, posso te ajudar com isso 💬✨

🔗 Instagram: https://www.instagram.com/josegabrielbuddy  
🎵 TikTok: https://www.tiktok.com/@iamsoulbuddy  
👨‍⚕️ Doctoralia: https://www.doctoralia.com.br/jose-gabriel  
📅 Agendamentos: https://www.iamsoulbuddy.com/sessaodobuddy
`;

app.post("/webhook", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Mensagem vazia." });
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
Você é a Sandra, secretária digital do José Gabriel.
Fale de forma acolhedora e humana, sempre oferecendo ajuda.
Nunca invente informações. Se a pessoa pedir para falar com ele, diga que o atendimento só acontece após o agendamento com pagamento via Pix.
Se te perguntarem quem é o José Gabriel, diga que ele é especialista em escuta, estratégia e desbloqueio emocional.
Sempre que possível, envie os links úteis no final.

Você não precisa perguntar o nome da pessoa, apenas converse naturalmente.
          `.trim(),
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply = response.data.choices[0].message.content;

    res.json({
      reply: saudacaoInicial + "\n\n" + reply,
    });
  } catch (error) {
    console.error("Erro na Sandra:", error);
    res.status(500).json({ error: "Erro interno da Sandra." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sandra ativa na porta ${port}`);
});
