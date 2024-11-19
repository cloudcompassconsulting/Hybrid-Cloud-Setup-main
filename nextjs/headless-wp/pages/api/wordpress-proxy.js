// pages/api/wordpress-proxy.js
import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 86400 }); // Cache for 24 hours

export default async function handler(req, res) {
  const { url, endpoint } = req.query;

  console.log(`Received request to proxy URL: ${url}, Endpoint: ${endpoint}`);

  if (!url && !endpoint) {
    console.error('URL or endpoint is required');
    return res.status(400).json({ error: 'URL or endpoint is required' });
  }

  const baseUrl = 'https://wordpress.local.example.com'; // Using the WordPress base URL directly
  let targetUrl;

  if (endpoint) {
    targetUrl = `${baseUrl}/wp-json/wp/v2/${endpoint}`;
  } else {
    targetUrl = decodeURIComponent(url);
  }

  //console.log(`Target URL: ${targetUrl}`);

  try {
    const method = req.method;
    const authHeader = 'Basic ' + Buffer.from(`${req.headers['x-username']}:${req.headers['x-password']}`).toString('base64');

    
    //console.log(`Request method: ${method}`);
    //console.log(`Request auth header: ${authHeader}`);
    //console.log(`Request body: ${JSON.stringify(req.body)}`);

    let response;

    switch (method) {
      case 'POST':
        response = await axios.post(targetUrl, req.body, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        });
        break;
      case 'GET':
        response = await axios.get(targetUrl, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        });
        break;
      case 'PUT':
        response = await axios.put(targetUrl, req.body, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        });
        break;
      case 'DELETE':
        response = await axios.delete(targetUrl, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        });
        break;
      default:
        return res.status(405).end('Method Not Allowed');
    }

    //console.log(`Response status: ${response.status}`);
    //console.log(`Response data: ${JSON.stringify(response.data)}`);

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Failed to fetch data from ${targetUrl}: ${error.message}`);
    if (error.response) {
      console.error('Error response data:', JSON.stringify(error.response.data));
      console.error('Error response status:', error.response.status);
    }
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
