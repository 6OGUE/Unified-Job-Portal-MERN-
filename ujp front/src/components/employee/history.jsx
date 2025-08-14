import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ApplicationHistory = () => {
  const { token, role, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ content: '', type: '' }); // Updated to an object

  const statusPillStyle = (status) => ({
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: status === 'Accepted' ? '#10B981' : status === 'Rejected' ? '#EF4444' : '#6B7280',
    cursor: 'pointer',
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

  // New styles for the message box
  const messageBoxStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '1.5rem',
    maxWidth: '24rem',
    width: '100%',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#9ca3af',
  };

  const overlayStyle = {
position: 'fixed',
top: 0,
left: 0,
width: '100%',
height: '100%',
backgroundColor: 'rgba(0, 0, 0, 0.8)', // Current value
zIndex: 99,
};


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
    setMessage({ content: '', type: '' });
    if (!window.confirm(`⚠️You Wont Be Able to Track this application once you delete it. Are you sure?`)) {
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
      setMessage({ content: `Application for "${jobTitle}" at "${companyName}" deleted successfully!`, type: 'success' });
    } catch (err) {
      setError(err.message);
      setMessage({ content: `Failed to delete application: ${err.message}`, type: 'error' });
    }
  };

  const handleClickStatus = (status) => {
    let content;
    let type = 'info';

    switch (status) {
      case 'Accepted':
        content = 'Congrats! The application has been well considered by the employer. Check your email regularly for updates.';
        type = 'success';
        break;
      case 'Rejected':
        content = 'Sorry, the employer has decided not to move forward with your application this time.';
        type = 'error';
        break;
      case 'Pending':
      default:
        content = 'Employer has not yet decided whether to move forward with this application.';
        break;
    }
    setMessage({ content, type });
  };

  const handleCloseMessage = () => {
    setMessage({ content: '', type: '' });
    setError(null);
  };

  if (loading || loadingAuth) return <div style={loadingErrorStyle}>Loading application history...</div>;
  if (error) return (
    <>
      <div style={overlayStyle}></div>
      <div style={messageBoxStyle}>
        <button style={closeButtonStyle} onClick={handleCloseMessage}>&times;</button>
        <div style={{ ...loadingErrorStyle, ...errorTextStyle }}>Error: {error}</div>
      </div>
    </>
  );

  return (
  <div style={containerStyle}>
    <h2 style={headingStyle}>My Applications</h2>

    {applications.length === 0 ? (
      <div style={{ ...loadingErrorStyle, ...emptyStateStyle, textAlign: 'center' }}>
        <img 
          src="/empty.png" 
          alt="No applications" 
          style={{ width: '150px', marginBottom: '1rem', opacity: 0.7 }} 
        />
        <p>You have not applied for any jobs yet</p>
      </div>
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
                    <span
                      style={statusPillStyle(app.status)}
                      onClick={() => handleClickStatus(app.status)}
                    >
                      {app.status}
                    </span>
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

      {/* Conditional rendering for the message box */}
      {message.content && (
        <>
          <div style={overlayStyle} onClick={handleCloseMessage}></div>
          <div style={messageBoxStyle}>
            <button style={closeButtonStyle} onClick={handleCloseMessage}>&times;</button>
            <p style={{
              margin: '0',
              color: message.type === 'success' ? '#10b981' : message.type === 'error' ? '#dc2626' : '#6b7280',
            }}>
              {message.content}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicationHistory;