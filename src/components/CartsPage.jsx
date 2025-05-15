import React, { useEffect, useState } from 'react';
import AllData from './AllData';
import { fetchCarts } from '../api/carts';

export default function CartsPage() {
  const [carts, setCarts] = useState(null);

  useEffect(() => {
    fetchCarts().then(setCarts);
  }, []);

  return (
    <AllData
      title="Carts"
      data={carts}
      columns={[
        {
          key: 'userId',
          header: 'User',
          render: c => `${c.userId.name} (${c.userId.email})`
        },
        {
          key: 'items',
          header: 'Contents',
          render: c => (
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {c.items.map((it, idx) => {
                const p = it.productId;
                const unit = p.discount
                  ? (p.price * (1 - p.discount / 100)).toFixed(2)
                  : p.price.toFixed(2);

                return (
                  <li key={idx} style={{ marginBottom: '0.75rem' }}>
                    {/* thumbnail */}
                    {p.images?.[0] && (
                      <img
                        src={`http://localhost:5000${p.images[0]}`}
                        alt={p.title}
                        style={{ width: 32, marginRight: 8, verticalAlign: 'middle' }}
                      />
                    )}

                    {/* title */}
                    <strong>{p.title}</strong>{' '}

                    {/* category / subcategory */}
                    <span style={{ fontSize: '0.85rem', color: '#555' }}>
                      ({p.category?.name || '—'} / {p.subcategory?.name || '—'})
                    </span>

                    {/* unit price & discount */}
                    <div style={{ fontSize: '0.9rem' }}>
                      Unit: ₹{unit}
                      {p.discount > 0 && (
                        <span style={{ color: '#c0392b', marginLeft: 6 }}>
                          ({p.discount}% off)
                        </span>
                      )}
                    </div>

                    {/* qty, size, color */}
                    <div style={{ fontSize: '0.9rem' }}>
                      Qty: {it.qty}
                      {it.size  && `, Size: ${it.size}`}
                      {it.color && `, Color: ${it.color}`}
                    </div>
                  </li>
                );
              })}
            </ul>
          )
        },
        {
          key: 'totalItems',
          header: 'Total Qty',
          render: c => c.items.reduce((sum, i) => sum + i.qty, 0)
        },
        {
          key: 'createdAt',
          header: 'Created',
          render: c => new Date(c.createdAt).toLocaleString()
        },
        {
          key: 'updatedAt',
          header: 'Updated',
          render: c => new Date(c.updatedAt).toLocaleString()
        }
      ]}
    />
  );
}
