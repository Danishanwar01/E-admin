// admin/src/api/users.js
export function fetchUsers() {
  return fetch('https://e-backend-rf04.onrender.com/api/admin/users').then(res => res.json());
}