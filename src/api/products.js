// admin/src/api/products.js
import axios from 'axios';

const API = axios.create({ baseURL: 'https://e-backend-rf04.onrender.com/api' });

export const addProduct    = data => API.post('/products', data);
export const fetchProducts = ()   => API.get('/products');
