import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const fetchCategories    = () => API.get('/categories');
export const createCategory     = name => API.post('/categories', { name });

export const fetchSubcategories = catId =>
  API.get(`/categories/${catId}/subcategories`);
export const createSubcategory  = (catId, name) =>
  API.post(`/categories/${catId}/subcategories`, { name });
export const deleteSubcategory  = (catId, subId) =>
  API.delete(`/categories/${catId}/subcategories/${subId}`);
