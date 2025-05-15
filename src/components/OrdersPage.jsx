// admin/src/components/OrdersPage.jsx
import React, { useEffect, useState } from 'react';
import AllData from './AllData';
import { fetchOrders } from '../api/orders';

export default function OrdersPage() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  return (
    <AllData
      title="Orders"
      data={orders}
      columns={[
        { key: '_id', header: 'Order ID' },
        { key: 'userId', header: 'User', render: o => o.userId.email },
        {
          key: 'createdAt',
          header: 'Date',
          render: o => new Date(o.createdAt).toLocaleString()
        },
        { key: 'totalAmount', header: 'Total (₹)' },

        // Items column: image, title, unit price, discount, qty, variants
        {
          key: 'items',
          header: 'Items',
          render: o => (
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {o.items.map((it, idx) => {
                const p = it.productId;
                // compute unit price after discount
                const unit = p.discount
                  ? (p.price * (1 - p.discount / 100)).toFixed(2)
                  : p.price.toFixed(2);

                return (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>
                    {/* thumbnail */}
                    {p.images?.[0] && (
                      <img
                        src={`http://localhost:5000${p.images[0]}`}
                        alt={p.title}
                        style={{ width: 40, marginRight: 8, verticalAlign: 'middle' }}
                      />
                    )}

                    {/* title */}
                    <strong>{p.title}</strong>

                    {/* category/subcat */}
                    <span style={{ fontSize: '0.85rem', color: '#555', marginLeft: 8 }}>
                      ({p.category?.name} / {p.subcategory?.name})
                    </span>

                    {/* price & discount */}
                    <div style={{ fontSize: '0.9rem', marginTop: 2 }}>
                      Unit: ₹{unit}
                      {p.discount > 0 && (
                        <span style={{ marginLeft: 8, color: '#c0392b' }}>
                          ({p.discount}% off)
                        </span>
                      )}
                    </div>

                    {/* quantity, size & color */}
                    <div style={{ fontSize: '0.9rem', marginTop: 2 }}>
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

        // Shipping info column
        {
          key: 'shipping',
          header: 'Shipping Info',
          render: o => (
            <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
              <div>
                <strong>{o.shipping.name}</strong> (<em>{o.shipping.email}</em>)
              </div>
              <div>
                {o.shipping.address}, {o.shipping.city}, {o.shipping.country} –{' '}
                {o.shipping.postalCode}
              </div>
              <div>Contact: {o.shipping.contact}</div>
            </div>
          )
        }
      ]}
    />
  );
}
