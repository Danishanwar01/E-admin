// admin/src/api/products.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const addProduct    = data => API.post('/products', data);
export const fetchProducts = ()   => API.get('/products');
