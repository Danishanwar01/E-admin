// admin/src/components/AddProduct.jsx
import React, { useState, useEffect } from 'react';
import { fetchCategories, fetchSubcategories } from '../api/categories';
import { addProduct } from '../api/products';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const [cats, setCats] = useState([]);
  const [subs, setSubs] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', price: '', discount: '',
    colors: '', sizes: '', category: '', subcategory: '', images: []
  });
  const navigate = useNavigate();

  // Load categories on mount
  useEffect(() => {
    fetchCategories().then(res => setCats(res.data));
  }, []);

  // When category changes, load its subcategories
  useEffect(() => {
    if (form.category) {
      fetchSubcategories(form.category).then(res => setSubs(res.data));
    }
  }, [form.category]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFiles = e => {
    setForm({ ...form, images: Array.from(e.target.files) });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    // Append simple fields
    ['title','description','price','discount','category','subcategory']
      .forEach(key => data.append(key, form[key]));
    // Append arrays
    form.colors.split(',').map(s => s.trim()).forEach(c => data.append('colors', c));
    form.sizes.split(',').map(s => s.trim()).forEach(s => data.append('sizes', s));
    // Append files
    form.images.forEach(file => data.append('images', file));

    await addProduct(data);
    alert('Product added successfully!');
    navigate('/add-product');
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
      <h2>Add Product</h2>

      <label>Category:</label>
      <select name="category" value={form.category} onChange={handleChange} required>
        <option value="">--Select--</option>
        {cats.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <label>Subcategory:</label>
      <select name="subcategory" value={form.subcategory} onChange={handleChange} required>
        <option value="">--Select--</option>
        {subs.map(s => (
          <option key={s._id} value={s._id}>{s.name}</option>
        ))}
      </select>

      <label>Title:</label>
      <input name="title" value={form.title} onChange={handleChange} required />

      <label>Description:</label>
      <textarea name="description" value={form.description} onChange={handleChange} />

      <label>Price:</label>
      <input type="number" name="price" value={form.price} onChange={handleChange} required />

      <label>Discount:</label>
      <input type="number" name="discount" value={form.discount} onChange={handleChange} />

      <label>Colors (comma separated):</label>
      <input name="colors" value={form.colors} onChange={handleChange} />

      <label>Sizes (comma separated):</label>
      <input name="sizes" value={form.sizes} onChange={handleChange} />

      <label>Images:</label>
      <input type="file" multiple accept="image/*" onChange={handleFiles} />

      <button type="submit" style={{ marginTop: '1rem' }}>Add Product</button>
    </form>
  );
}
