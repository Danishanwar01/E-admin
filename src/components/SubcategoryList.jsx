import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchSubcategories,
  createSubcategory,
  deleteSubcategory
} from '../api/categories';

export default function SubcategoryList() {
  const { catId } = useParams();
  const [subs,   setSubs]   = useState([]);
  const [newSub, setNewSub] = useState('');

  useEffect(() => {
    if (catId) load();
  }, [catId]);

  const load = async () => {
    const { data } = await fetchSubcategories(catId);
    setSubs(data);
  };

  const add = async () => {
    if (!newSub.trim()) return;
    await createSubcategory(catId, newSub.trim());
    setNewSub('');
    load();
  };

  const remove = async id => {
    await deleteSubcategory(catId, id);
    load();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Brands / Subcategories</h2>
      <ul>
        {subs.map(s => (
          <li key={s._id} style={{ margin: '0.5rem 0' }}>
            {s.name}
            <button
              onClick={() => remove(s._id)}
              style={{ marginLeft: '1rem' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '1rem' }}>
        <input
          value={newSub}
          onChange={e => setNewSub(e.target.value)}
          placeholder="New brand"
          style={{ marginRight: '0.5rem' }}
        />
        <button onClick={add}>Add</button>
      </div>
    </div>
  );
}
