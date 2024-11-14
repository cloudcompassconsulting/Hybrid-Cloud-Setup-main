// pages/api/proxy.js
import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 86400 }); // Cache for 24 hours

const woocommerce = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_WOOCOMMERCE_SITE_URL}/wp-json/wc/v3`,
  auth: {
    username: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY,
    password: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET,
  },
});

export default async function handler(req, res) {
  const { url, endpoint } = req.query;

  console.log(`Received request to proxy URL: ${url}, Endpoint: ${endpoint}`);

  if (!url && !endpoint) {
    console.error('URL or endpoint is required');
    return res.status(400).json({ error: 'URL or endpoint is required' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_SITE_URL;
  let targetUrl;

  if (endpoint) {
    targetUrl = `${baseUrl}/wp-json/wc/v3/${endpoint.replace(/^\/+/, '')}`;
  } else {
    targetUrl = decodeURIComponent(url);
  }

  console.log(`Target URL: ${targetUrl}`);

  try {
    if (endpoint) {
      const method = req.method;
      let response;

      if (method === 'POST') {
        response = await woocommerce.post(endpoint.replace(/^\/+/, ''), req.body);
      } else if (method === 'GET') {
        response = await woocommerce.get(endpoint.replace(/^\/+/, ''));
      } else if (method === 'PUT') {
        response = await woocommerce.put(endpoint.replace(/^\/+/, ''), req.body);
      } else if (method === 'DELETE') {
        response = await woocommerce.delete(endpoint.replace(/^\/+/, ''));
      } else {
        return res.status(405).end('Method Not Allowed');
      }

      res.status(response.status).json(response.data);
    } else {
      const cachedImage = cache.get(targetUrl);
      if (cachedImage) {
        console.log('Serving image from cache');
        res.setHeader('Content-Type', cachedImage.contentType);
        return res.send(cachedImage.data);
      }

      console.log(`Fetching image from remote server: ${targetUrl}`);
      const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
      const contentType = response.headers['content-type'];

      console.log('Caching the fetched image');
      cache.set(targetUrl, { data: response.data, contentType });

      res.setHeader('Content-Type', contentType);
      res.send(response.data);
    }
  } catch (error) {
    console.error(`Failed to fetch data from ${targetUrl}: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
