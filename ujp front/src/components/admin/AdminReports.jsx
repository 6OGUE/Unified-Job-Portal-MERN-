import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [viewReportId, setViewReportId] = useState(null);
  const [modalData, setModalData] = useState(null); // { id, type }

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/admin/reports');
        const data = await res.json();
        setReports(data);
      } catch (err) {
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/reports/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r._id !== id));
        toast.success('Report deleted successfully!');
        if (viewReportId === id) setViewReportId(null);
      } else {
        toast.error('Failed to delete report.');
      }
    } catch (err) {
      toast.error('Error deleting report.');
    } finally {
      setDeletingId(null);
      setModalData(null);
    }
  };

  const handleViewReport = (id) => {
    setViewReportId(id);
  };

  const handleCloseModal = () => {
    setViewReportId(null);
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontFamily:'monospace' }}>Job Reports</h2>

      <div style={{
        overflowX: 'auto',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '15px', color: '#666' }}>Loading...</p>
        ) : reports.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '15px', color: '#666' }}>No reports found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#2b2b2bff', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Company Name</th>
                <th style={{ padding: '12px' }}>Job Title</th>
                <th style={{ padding: '12px' }}>Employee Name</th>
                <th style={{ padding: '12px' }}>Reported At</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report._id} style={{ borderBottom: '1px solid #ddd', transition: 'background 0.3s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f1f1'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px' }}>{report.companyName}</td>
                  <td style={{ padding: '12px' }}>{report.jobTitle}</td>
                  <td style={{ padding: '12px' }}>{report.employeeName}</td>
                  <td style={{ padding: '12px' }}>{new Date(report.createdAt).toLocaleString()}</td>
                  <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleViewReport(report._id)}
                      style={{
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '6px 16px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontFamily: 'inherit'
                      }}
                    >
                      View Report
                    </button>
                    <button
                      onClick={() => setModalData({ id: report._id, type: 'delete' })}
                      disabled={deletingId === report._id}
                      style={{
                        background: '#e11d48',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '6px 16px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontFamily: 'inherit',
                        opacity: deletingId === report._id ? 0.6 : 1
                      }}
                    >
                      {deletingId === report._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for viewing report description */}
      {viewReportId && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            padding: '2rem',
            maxWidth: '480px',
            width: '100%',
            position: 'relative'
          }}>
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.8rem',
                color: '#64748b',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.2rem', color: '#1e293b' }}>
              Report Description
            </h3>
            <div style={{
              fontSize: '1.05rem',
              color: '#334155',
              background: '#f1f5f9',
              borderRadius: '8px',
              padding: '1rem',
              minHeight: '80px',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              maxWidth: '100%',
              overflowWrap: 'break-word'
            }}>
              {reports.find(r => r._id === viewReportId)?.description}
            </div>
          </div>
        </div>
      )}

      {/* ✅ Delete Confirmation Modal */}
      {modalData && modalData.type === 'delete' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(75, 85, 99, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '0.5rem',
            padding: '2rem',
            width: '90%',
            maxWidth: '400px',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#000' }}>
              Confirm Deletion
            </h2>
            <p style={{ color: '#000', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this report?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={() => setModalData(null)}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#4f46e5',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(modalData.id)}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReports;
