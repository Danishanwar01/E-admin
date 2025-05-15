// admin/src/components/UsersPage.jsx
import React, { useEffect, useState } from 'react';
import AllData from './AllData';
import { fetchUsers } from '../api/users';

export default function UsersPage() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return (
    <AllData
      title="Users"
      data={users}
      columns={[
        { key: '_id',        header: 'ID' },
        { key: 'name',       header: 'Name' },
        { key: 'email',      header: 'Email' },
        { key: 'address',    header: 'Address' },
        { key: 'city',       header: 'City' },
        { key: 'country',    header: 'Country' },
        { key: 'postalCode', header: 'Postal Code' },
        { key: 'phone',      header: 'Phone' },
        {
          key: 'createdAt',
          header: 'Created At',
          render: u => new Date(u.createdAt).toLocaleString()
        },
        {
          key: 'updatedAt',
          header: 'Updated At',
          render: u => new Date(u.updatedAt).toLocaleString()
        }
      ]}
    />
  );
}
