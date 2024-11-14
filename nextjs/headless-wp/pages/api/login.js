// pages/api/login.js
import wordpress from '../../lib/wordpress';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    console.log(`Login attempt for username: ${username}`);

    try {
      const response = await wordpress.get('users/me', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        },
      });

      //console.log(`WordPress response status: ${response.status}`);
      //console.log(`WordPress response data: ${JSON.stringify(response.data)}`);

      const user = response.data;
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error during login:', error.message);
      if (error.response) {
        console.error('Error response data:', JSON.stringify(error.response.data));
        console.error('Error response status:', error.response.status);
      }
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    console.log('Method not allowed');
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
