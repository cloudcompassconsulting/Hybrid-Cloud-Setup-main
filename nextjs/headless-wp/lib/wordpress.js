// lib/wordpress.js
import axios from 'axios';

const wordpress = axios.create({
  baseURL: 'https://wordpress.local.probarra.xyz/wp-json/wp/v2/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default wordpress;

