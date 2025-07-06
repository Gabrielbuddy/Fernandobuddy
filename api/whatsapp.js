export default function handler(req, res) {
  if (req.method === 'GET') {
    const VERIFY_TOKEN = 'fernandobot';

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send('Forbidden');
    }
  } else {
    return res.status(405).send('Method Not Allowed');
  }
}
