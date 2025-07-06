export default function handler(req, res) {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === '123456') {
      console.log('Webhook verificado com sucesso!');
      res.status(200).send(challenge);
    } else {
      res.status(403).send('Erro de verificação');
    }
  }

  if (req.method === 'POST') {
    console.log('Mensagem recebida:', JSON.stringify(req.body, null, 2));
    res.status(200).send('Recebido');
  }
}
