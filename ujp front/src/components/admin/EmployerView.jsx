import React, { useEffect, useState } from 'react';

const EmployerView = () => {
  const [employers, setEmployers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/employers')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch employers');
        }
        return res.json();
      })
      .then(data => setEmployers(data))
      .catch(err => {
        console.error('Error fetching employers:', err);
        setError('Failed to load employers.');
      });
  }, []);

  return (
    <div>
      <h2>Employers List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {employers.length ? (
          employers.map(emp => (
            <li key={emp._id}>
              {emp.name || emp.companyName} - {emp.email}
            </li>
          ))
        ) : (
          !error && <p>No employers found</p>
        )}
      </ul>
    </div>
  );
};

export default EmployerView;
