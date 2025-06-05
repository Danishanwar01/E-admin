// admin/src/api/products.js
import axios from 'axios';

const API = axios.create({ baseURL: 'https://e-backend-rf04.onrender.com/api/products' });

export const addProduct    = data => API.post('/products', data);
export const fetchProducts = ()   => API.get('/products');

// Delete a product by ID
export const deleteProduct = productId => 
  API.delete(`/products/${productId}`);

// Update a product by ID (send updated fields in `data`)
export const updateProduct = (productId, data) => 
  API.put(`/products/${productId}`, data);
