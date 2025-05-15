// admin/src/components/AllData.jsx
import React from 'react';

export default function AllData({ data, columns, title }) {
  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{title}</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row,i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col.key}>
                  {typeof col.render === 'function'
                    ? col.render(row)
                    : row[col.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
