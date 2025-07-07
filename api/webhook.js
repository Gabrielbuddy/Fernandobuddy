export default async function handler(req, res) {
  const VERIFY_TOKEN = "123456";
  const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/enoxnm52swxmt2gc2232jf3hvg2f3dpf";

  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  if (req.method === 'POST') {
    try {
      await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      return res.status(200).json({ message: 'Forwarded to Make' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to forward to Make' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}