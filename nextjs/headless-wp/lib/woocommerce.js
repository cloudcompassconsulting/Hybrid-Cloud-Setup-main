// lib/woocommerce.js
import axios from 'axios';

const woocommerce = axios.create({
  baseURL: '/api/proxy?endpoint=',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default woocommerce;
