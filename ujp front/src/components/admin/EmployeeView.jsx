import React, { useEffect, useState } from 'react';

const EmployeeView = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/employees')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch employees');
        }
        return res.json();
      })
      .then(data => setEmployees(data))
      .catch(err => {
        console.error('Error fetching employees:', err);
        setError('Failed to load employees.');
      });
  }, []);

  return (
    <div>
      <h2>Employees List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {employees.length ? (
          employees.map(emp => (
            <li key={emp._id}>
              {emp.name} - {emp.email}
            </li>
          ))
        ) : (
          !error && <p>No employees found</p>
        )}
      </ul>
    </div>
  );
};

export default EmployeeView;
