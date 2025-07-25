import React, { useEffect, useState } from 'react';

const EmployerView = () => {
  const [employers, setEmployers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/employers');
      if (!response.ok) throw new Error('Failed to fetch employers');
      const data = await response.json();
      setEmployers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this employer?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/employers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete employer');

      // Remove from state
      setEmployers(prev => prev.filter(emp => emp._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', height: '1500px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Employers List</h2>

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
          {employers.length > 0 ? (
            employers.map(emp => (
              <tr key={emp._id}>
                <td>{emp.name || emp.companyName}</td>
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
                No employers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployerView;
