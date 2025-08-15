import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable Confirmation Modal
const ConfirmationModal = ({ isOpen, onConfirm, onCancel, itemName }) => {
  if (!isOpen) return null;
  
  return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(75, 85, 99, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', padding: '2rem', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#ef4444' }}>Confirm Deletion</h2>
              <p style={{ color: '#374151', marginBottom: '1.5rem' }}>
                  Are you sure you want to delete **{itemName}**? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button
                      onClick={onCancel}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '0.375rem', backgroundColor: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer' }}
                  >
                      Cancel
                  </button>
                  <button
                      onClick={onConfirm}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '0.375rem', backgroundColor: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}
                  >
                      Delete
                  </button>
              </div>
          </div>
      </div>
  );
};

const EmployerView = () => {
  const [employers, setEmployers] = useState([]);
  const [error, setError] = useState('');
  const [employerToDelete, setEmployerToDelete] = useState(null);

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
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    if (!employerToDelete) return;
    const id = employerToDelete._id;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/employers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete employer');

      setEmployers(prev => prev.filter(emp => emp._id !== id));
      toast.success(`${employerToDelete.name || employerToDelete.companyName} has been deleted successfully!`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEmployerToDelete(null);
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontFamily:'monospace' }}>Employers List</h2>

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
            {employers.length > 0 ? (
              employers.map(emp => (
                <tr key={emp._id} style={{ borderBottom: '1px solid #ddd', transition: 'background 0.3s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f1f1'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px' }}>{emp.name || emp.companyName}</td>
                  <td style={{ padding: '12px' }}>{emp.email}</td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <button
                      onClick={() => setEmployerToDelete(emp)}
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
                  No employers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        isOpen={!!employerToDelete}
        onConfirm={handleDelete}
        onCancel={() => setEmployerToDelete(null)}
        itemName={employerToDelete?.name || employerToDelete?.companyName}
      />
    </div>
  );
};

export default EmployerView;