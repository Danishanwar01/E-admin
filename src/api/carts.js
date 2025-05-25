// admin/src/api/carts.js
export function fetchCarts() {
  return fetch('https://e-backend-rf04.onrender.com/api/admin/carts').then(r=>r.json());
}