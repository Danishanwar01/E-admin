// admin/src/api/carts.js
export function fetchCarts() {
  return fetch('http://localhost:5000/api/admin/carts').then(r=>r.json());
}