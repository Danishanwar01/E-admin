// admin/src/api/orders.js

// (1) Fetch all orders for the admin:
export function fetchOrders() {
  return fetch('http://localhost:5000/api/orders/admin/all')
    .then(res => res.json());
}

// (2) Push a new tracking event for a given order:
export function addTrackingEvent(orderId, { status, message, courierPartner, trackingNumber }) {
  return fetch(`http://localhost:5000/api/orders/${orderId}/tracking`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, message, courierPartner, trackingNumber })
  }).then(res => {
    if (!res.ok) throw new Error('Failed to add tracking event');
    return res.json();
  });
}
