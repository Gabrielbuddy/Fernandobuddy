// /api/webhook.js

export default function handler(req, res) {
  if (req.method === 'GET') {
    const VERIFY_TOKEN = 'fernandobot'; // O mesmo token que você colocou na Meta

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  } else {
    return res.sendStatus(405);
  }
}
