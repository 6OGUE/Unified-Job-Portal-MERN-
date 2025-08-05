import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';// Adjust the path as needed
import { useNavigate } from 'react-router-dom';

const ApplicationHistory = () => {
  const { token, role, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); // State for success/error messages

  // Inline styles (consider moving to a CSS module or Tailwind for larger apps)
  const containerStyle = {
    padding: '1.5rem',
    maxWidth: '60rem', // Reduced width
    margin: 'auto', // Centering the content
    // Removed backgroundColor, borderRadius, and boxShadow
    // to make it appear on a default background without a card.
  };

  const headingStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontFamily: 'monospace', // Added monospace font family
  };

  const tableWrapperStyle = {
    overflowX: 'auto',
  };

  const tableStyle = {
    minWidth: '100%',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
  };

  const tableHeaderStyle = {
    backgroundColor: '#f3f4f6',
  };

  const thStyle = {
    padding: '0.75rem 1.5rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const tdStyle = {
    padding: '1rem 1.5rem',
    whiteSpace: 'nowrap',
    fontSize: '0.875rem',
    color: '#1f2937',
    borderBottom: '1px solid #e5e7eb',
  };

  const statusStyle = {
    padding: '0.125rem 0.5rem',
    display: 'inline-flex',
    fontSize: '0.75rem',
    lineHeight: '1.25rem',
    fontWeight: '600',
    borderRadius: '9999px',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
  };

  const loadingErrorStyle = {
    padding: '1rem',
    textAlign: 'center',
  };

  const errorTextStyle = {
    color: '#dc2626',
  };

  const successTextStyle = {
    color: '#10b981', // Green color for success
  };

  const emptyStateStyle = {
    color: '#6b7280',
  };

  const deleteButtonStyle = {
    backgroundColor: '#ef4444', // Red color
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease-in-out',
  };

  const deleteButtonHoverStyle = {
    backgroundColor: '#dc2626', // Darker red on hover
  };

  // Function to fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      // CORRECTED ENDPOINT: Changed from '/api/applications/my-applications2' to '/api/applications/my-applications'
      const response = await fetch('/api/applications/my-applications', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications from Application2 table');
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redirect if not authenticated or not an employee
    if (!loadingAuth && (!token || role !== 'employee')) {
      navigate('/login'); // Adjust login path if different
      return;
    }

    // Fetch applications only if token is available
    if (token) {
      fetchApplications();
    }
  }, [token, role, loadingAuth, navigate]); // Dependencies for useEffect

  // Function to handle application deletion
  const handleDeleteApplication = async (appId, jobTitle, companyName) => {
    setMessage(''); // Clear previous messages
    const confirmDelete = window.confirm(
      `Are you sure you want to delete your application for "${jobTitle}" at "${companyName}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      // Send DELETE request to your backend
      // This will hit the DELETE /api/applications/:id route, which is role-based
      const response = await fetch(`/api/applications/${appId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete application.');
      }

      // If deletion is successful, update the state to remove the application from the UI
      setApplications(prevApps => prevApps.filter(app => app._id !== appId));
      setMessage(`Application for "${jobTitle}" at "${companyName}" deleted successfully!`);
    } catch (err) {
      setError(err.message);
      setMessage(`Failed to delete application: ${err.message}`);
    }
  };

  // Render loading state
  if (loading || loadingAuth) {
    return <div style={loadingErrorStyle}>Loading application history...</div>;
  }

  // Render error state
  if (error) {
    return <div style={{ ...loadingErrorStyle, ...errorTextStyle }}>Error: {error}</div>;
  }

  // Render empty state if no applications
  if (applications.length === 0) {
    return <div style={{ ...loadingErrorStyle, ...emptyStateStyle }}>You have not applied for any jobs yet</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Application History</h2> {/* Removed "(from Application2)" */}
      {message && (
        <div style={{ ...loadingErrorStyle, ...(error ? errorTextStyle : successTextStyle) }}>
          {message}
        </div>
      )}
      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead style={tableHeaderStyle}>
            <tr>
              <th style={thStyle}>Job Title</th>
              <th style={thStyle}>Company</th>
              <th style={thStyle}>Applied On</th>
              <th style={thStyle}>Actions</th> {/* New column for delete button */}
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app._id} style={{ borderBottom: index === applications.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                <td style={tdStyle}>{app.jobTitle}</td>
                <td style={tdStyle}>{app.companyName}</td>
                <td style={tdStyle}>{new Date(app.applicationDate).toLocaleDateString()}</td>
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
    </div>
  );
};

export default ApplicationHistory;
