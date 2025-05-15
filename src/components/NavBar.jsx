import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const { pathname } = useLocation();

  return (
    <nav style={{
      padding: '1rem',
      background: '#f4f4f4',
      borderBottom: '1px solid #ccc'
    }}>
      <Link to="/categories" style={{ marginRight: '1rem', fontWeight: pathname === '/categories' ? 'bold' : 'normal' }} > Categories </Link>

      <Link to="/add-product" style={{ padding: '0 1rem' }}> Add Product</Link>

      <Link to="/all-data" style={{ padding: '0 1rem' }}>All Products</Link>

      {pathname.startsWith('/categories/') && (<Link to="/categories" style={{ fontWeight: 'normal' }}> ← Back </Link>)}

      <Link to="/users" style={{ padding: '0 1rem' }}>Users</Link>

      <Link to="/carts" style={{ padding: '0 1rem' }}>Carts</Link>
      
      <Link to="/orders" style={{ padding: '0 1rem' }}>Orders</Link>
    </nav>
  );
}
