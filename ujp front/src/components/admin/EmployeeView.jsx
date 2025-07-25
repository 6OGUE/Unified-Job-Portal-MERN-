import React, { useEffect, useState } from 'react';

const EmployeeView = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/employees/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete employee');

      // Remove from state
      setEmployees(prev => prev.filter(emp => emp._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', height: '1500px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Employees List</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1" cellPadding="10">
        <thead>
          <tr style={{ textAlign: 'center' }}>
            <th>Name / Company</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      padding: '8px 50px',
                      cursor: 'pointer',
                      borderRadius: '100px',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeView;