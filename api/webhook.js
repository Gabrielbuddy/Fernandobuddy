export default async function handler(req, res) {
  if (req.method === 'POST') {
    res.status(200).json({ message: 'Webhook recebido com sucesso!' });
  } else {
    res.status(200).json({ message: 'Método não permitido' });
  }
}
