import React, { useEffect, useState } from 'react';
import { fetchCategories, createCategory } from '../api/categories';
import { useNavigate } from 'react-router-dom';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName]     = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await fetchCategories();
    setCategories(data);
  };

  const add = async () => {
    if (!newName.trim()) return;
    await createCategory(newName.trim());
    setNewName('');
    load();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Categories</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat._id} style={{ margin: '0.5rem 0' }}>
            <button onClick={() => navigate(`/categories/${cat._id}`)}>
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '1rem' }}>
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="New category"
          style={{ marginRight: '0.5rem' }}
        />
        <button onClick={add}>Add</button>
      </div>
    </div>
  );
}
