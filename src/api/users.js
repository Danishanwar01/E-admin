// admin/src/api/users.js
export function fetchUsers() {
  return fetch('http://localhost:5000/api/admin/users').then(res => res.json());
}