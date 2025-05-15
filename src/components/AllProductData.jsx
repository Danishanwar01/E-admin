
import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../api/categories';
import { fetchProducts }   from '../api/products';

export default function AllProductData() {
  const [categories, setCategories]       = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts]           = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [selCat, setSelCat]               = useState('');
  const [selSub, setSelSub]               = useState('');

  // 1) Load initial data
  useEffect(() => {
    fetchCategories().then(res => setCategories(res.data));
    fetchProducts().then(res => {
      setProducts(res.data);
      setFiltered(res.data);
    });
  }, []);

  // 2) When category changes, pick subcats from the loaded categories
  useEffect(() => {
    const cat = categories.find(c => c._id === selCat);
    if (cat) {
      setSubcategories(cat.subcategories);
    } else {
      setSubcategories([]);
      setSelSub('');
    }
  }, [selCat, categories]);

  // 3) Filter products by selected cat/sub
  useEffect(() => {
    const tmp = products.filter(p => {
      const pc = typeof p.category === 'string'
        ? p.category
        : (p.category._id ?? p.category).toString();
      const ps = typeof p.subcategory === 'string'
        ? p.subcategory
        : (p.subcategory.id ?? p.subcategory._id ?? p.subcategory).toString();

      const byCat = selCat ? pc === selCat : true;
      const bySub = selSub ? ps === selSub : true;
      return byCat && bySub;
    });
    setFiltered(tmp);
  }, [selCat, selSub, products]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>All Products</h2>

       {/* Filters  */}
      <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem' }}>
        <select value={selCat} onChange={e => setSelCat(e.target.value)}>
          <option value="">-- All Categories --</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select
          value={selSub}
          onChange={e => setSelSub(e.target.value)}
          disabled={!selCat}
        >
          <option value="">-- All Subcategories --</option>
          {subcategories.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Data Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>Image</th>
            <th style={th}>Title</th>
            <th style={th}>Description</th>
            <th style={th}>Price</th>
            <th style={th}>Discount (%)</th>
            <th style={th}>Colors</th>
            <th style={th}>Sizes</th>
            <th style={th}>Category</th>
            <th style={th}>Subcategory</th>
            <th style={th}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => {
            // find the category object
            const catId = typeof p.category === 'string'
              ? p.category
              : (p.category._id ?? p.category);
            const catObj = categories.find(c => c._id === catId);

            // find the subcategory name inside it
            const subId = typeof p.subcategory === 'string'
              ? p.subcategory
              : (p.subcategory.id ?? p.subcategory._id ?? p.subcategory);
            const subObj = catObj?.subcategories.find(s => s._id === subId);

            // fallback if you ever switch to a populated API
            const catName = catObj?.name ?? p.category.name ?? '';
            const subName = subObj?.name ?? p.subcategory.name ?? '';

            const img = p.images?.[0];

            return (
              <tr key={p._id}>
                <td style={td}>
                  {img && (
                    <img
                      src={`http://localhost:5000${img}`}
                      alt={p.title}
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  )}
                </td>
                <td style={td}>{p.title}</td>
                <td style={td}>{p.description}</td>
                <td style={td}>₹{p.price}</td>
                <td style={td}>{p.discount}</td>
                <td style={td}>{p.colors?.join(', ')}</td>
                <td style={td}>{p.sizes?.join(', ')}</td>
                <td style={td}>{catName}</td>
                <td style={td}>{subName}</td>
                <td style={td}>
                  {new Date(p.createdAt).toLocaleDateString()}{' '}
                  {new Date(p.createdAt).toLocaleTimeString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Inline table styles
const th = { border: '1px solid #ddd', padding: '8px', background: '#f0f0f0' };
const td = { border: '1px solid #ddd', padding: '8px' };
