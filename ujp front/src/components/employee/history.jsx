import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ApplicationHistory = () => {
  const { token, role, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const statusPillStyle = (status) => ({
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: status === 'Accepted' ? '#10B981' : status === 'Rejected' ? '#EF4444' : '#6B7280',
  });

  const containerStyle = { padding: '1.5rem', maxWidth: '60rem', margin: 'auto' };
  const headingStyle = { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'monospace' };
  const tableWrapperStyle = { overflowX: 'auto' };
  const tableStyle = { minWidth: '100%', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem' };
  const tableHeaderStyle = { backgroundColor: '#f3f4f6' };
  const thStyle = { padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' };
  const tdStyle = { padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#1f2937', borderBottom: '1px solid #e5e7eb' };
  const loadingErrorStyle = { padding: '1rem', textAlign: 'center' };
  const errorTextStyle = { color: '#dc2626' };
  const successTextStyle = { color: '#10b981' };
  const emptyStateStyle = { color: '#6b7280' };
  const deleteButtonStyle = { backgroundColor: '#ef4444', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'background-color 0.2s ease-in-out' };
  const deleteButtonHoverStyle = { backgroundColor: '#dc2626' };

  useEffect(() => {
    if (!loadingAuth) {
      if (!token || role !== 'employee') {
        navigate('/login');
        return;
      }
      if (token) {
        const fetchApplications = async () => {
          setLoading(true);
          setError(null);
          try {
            const response = await fetch('/api/applications/my-applications', {
              headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) { throw new Error('Failed to fetch applications'); }
            const data = await response.json();
            setApplications(data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
        fetchApplications();
      }
    }
  }, [token, role, loadingAuth, navigate]);

  const handleDeleteApplication = async (appId, jobTitle, companyName) => {
    setMessage('');
    if (!window.confirm(`Are you sure you want to delete your application for "${jobTitle}" at "${companyName}"?`)) {
      return;
    }
    try {
      const response = await fetch(`/api/applications/${appId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete application.');
      }
      setApplications(prevApps => prevApps.filter(app => app._id !== appId));
      setMessage(`Application for "${jobTitle}" at "${companyName}" deleted successfully!`);
    } catch (err) {
      setError(err.message);
      setMessage(`Failed to delete application: ${err.message}`);
    }
  };

  if (loading || loadingAuth) return <div style={loadingErrorStyle}>Loading application history...</div>;
  if (error) return <div style={{ ...loadingErrorStyle, ...errorTextStyle }}>Error: {error}</div>;

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>My Applications</h2>
      {message && (
        <div style={{ ...loadingErrorStyle, ...(error ? errorTextStyle : successTextStyle) }}>
          {message}
        </div>
      )}
      {applications.length === 0 ? (
        <div style={{ ...loadingErrorStyle, ...emptyStateStyle }}>You have not applied for any jobs yet</div>
      ) : (
        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead style={tableHeaderStyle}>
              <tr>
                <th style={thStyle}>Job Title</th>
                <th style={thStyle}>Company</th>
                <th style={thStyle}>Applied On</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={app._id} style={{ borderBottom: index === applications.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                  <td style={tdStyle}>{app.jobTitle}</td>
                  <td style={tdStyle}>{app.companyName}</td>
                  <td style={tdStyle}>{new Date(app.applicationDate).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    <span style={statusPillStyle(app.status)}>{app.status}</span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      style={deleteButtonStyle}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = deleteButtonHoverStyle.backgroundColor}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = deleteButtonStyle.backgroundColor}
                      onClick={() => handleDeleteApplication(app._id, app.jobTitle, app.companyName)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationHistory;