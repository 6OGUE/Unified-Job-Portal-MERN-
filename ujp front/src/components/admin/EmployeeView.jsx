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

      setEmployees(prev => prev.filter(emp => emp._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontFamily:'monospace' }}>Job Seekers List</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={{
        overflowX: 'auto',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#2b2b2bff', color: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Name / Company</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map(emp => (
                <tr key={emp._id} style={{ borderBottom: '1px solid #ddd', transition: 'background 0.3s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f1f1'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px' }}>{emp.name}</td>
                  <td style={{ padding: '12px' }}>{emp.email}</td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 20px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.3s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '15px', color: '#666' }}>
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeView;
