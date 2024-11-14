// pages/api/log.js

export default function handler(req, res) {
    if (req.method === 'POST') {
      const { message } = req.body;
      console.log(`Client-side log: ${message}`);
      res.status(200).json({ status: 'success' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }
  