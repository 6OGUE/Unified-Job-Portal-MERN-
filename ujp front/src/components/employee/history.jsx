import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';// Adjust the path as needed
import { useNavigate } from 'react-router-dom';

const ApplicationHistory = () => {
  const { token, role, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerStyle = {
    padding: '1.5rem',
    maxWidth: '56rem',
    margin: 'auto',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
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

  const emptyStateStyle = {
    color: '#6b7280',
  };

  useEffect(() => {
    if (!loadingAuth && (!token || role !== 'employee')) {
      navigate('/login'); // Adjust login path if different
      return;
    }

    if (token) {
      const fetchApplications = async () => {
        try {
          const response = await fetch('/api/applications/my-applications', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch applications');
          }

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
  }, [token, role, loadingAuth, navigate]);

  if (loading || loadingAuth) {
    return <div style={loadingErrorStyle}>Loading application history...</div>;
  }

  if (error) {
    return <div style={{ ...loadingErrorStyle, ...errorTextStyle }}>Error: {error}</div>;
  }

  if (applications.length === 0) {
    return <div style={{ ...loadingErrorStyle, ...emptyStateStyle }}>You have not applied for any jobs yet.</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}> Application History</h2>
      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead style={tableHeaderStyle}>
            <tr>
              <th style={thStyle}>Job Title</th>
              <th style={thStyle}>Company</th>
              <th style={thStyle}>Applied On</th>
              {/* <th style={thStyle}>Status</th> */}
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app._id} style={{ borderBottom: index === applications.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                <td style={tdStyle}>{app.jobTitle}</td>
                <td style={tdStyle}>{app.companyName}</td>
                <td style={tdStyle}>{new Date(app.applicationDate).toLocaleDateString()}</td>
                {/* <td style={tdStyle}>
                  <span style={statusStyle}>Pending</span>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationHistory;