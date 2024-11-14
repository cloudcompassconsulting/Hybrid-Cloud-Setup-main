// pages/api/images.js
import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 86400 }); // Cache for 24 hours

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const decodedUrl = decodeURIComponent(url);

  try {
    // Check if the image is already cached
    const cachedImage = cache.get(decodedUrl);
    if (cachedImage) {
      res.setHeader('Content-Type', cachedImage.contentType);
      return res.send(cachedImage.data);
    }

    // Fetch the image from the remote server
    const response = await axios.get(decodedUrl, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'];

    // Cache the image
    cache.set(decodedUrl, { data: response.data, contentType });

    // Return the image
    res.setHeader('Content-Type', contentType);
    res.send(response.data);
  } catch (error) {
    console.error(`Failed to fetch image from ${url}: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}
