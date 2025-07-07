export default async function handler(req, res) {
  if (req.method === 'POST') {
    const response = await fetch('https://hook.us2.make.com/SEU_ID_AQUI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (response.ok) {
      res.status(200).json({ message: 'Forwarded to Make' });
    } else {
      res.status(500).json({ error: 'Failed to send to Make' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
