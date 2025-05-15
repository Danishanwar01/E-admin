// admin/src/api/orders.js
export function fetchOrders() {
  return fetch('http://localhost:5000/api/admin/orders').then(r=>r.json());
}