import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../api/categories';
import { fetchProducts, deleteProduct } from '../api/products'; // import deleteProduct

export default function AllProductData() {
  const [categories, setCategories]       = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts]           = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [selCat, setSelCat]               = useState('');
  const [selSub, setSelSub]               = useState('');
  const [loading, setLoading]             = useState(false);
  const navigate = useNavigate();

  // 1) Load initial data
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchCategories(),
      fetchProducts()
    ]).then(([catRes, prodRes]) => {
      setCategories(catRes.data);
      setProducts(prodRes.data);
      setFiltered(prodRes.data);
    }).finally(() => setLoading(false));
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

  // Handler for Delete
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      setLoading(true);
      await deleteProduct(productId);
      // Remove the deleted product from local state:
      setProducts(prev => prev.filter(p => p._id !== productId));
      setFiltered(prev => prev.filter(p => p._id !== productId));
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for Edit
  const handleEdit = (productId) => {
    // Navigate to your edit page (adjust the route as needed)
    navigate(`/admin/product/edit/${productId}`);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>All Products</h2>

      {loading && <p>Loading...</p>}

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
            <th style={th}>Actions</th>
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
                      src={`https://e-backend-rf04.onrender.com${img}`}
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
                <td style={td}>
                  <button
                    onClick={() => handleEdit(p._id)}
                    style={actionButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    style={{ ...actionButton, marginLeft: '0.5rem', background: '#e74c3c' }}
                  >
                    Delete
                  </button>
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
const th = {
  border: '1px solid #ddd',
  padding: '8px',
  background: '#f0f0f0',
  textAlign: 'left',
};

const td = {
  border: '1px solid #ddd',
  padding: '8px',
};

const actionButton = {
  padding: '4px 8px',
  border: 'none',
  borderRadius: '4px',
  background: '#3498db',
  color: 'white',
  cursor: 'pointer',
};
