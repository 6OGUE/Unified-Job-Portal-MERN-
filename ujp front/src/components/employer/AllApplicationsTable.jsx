import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Corrected import path

const AllApplicationsTable = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(''); // State for success/error messages
    const navigate = useNavigate();
    const { token, role, loadingAuth } = useAuth();

    // Inline styles (consider moving to a CSS module or Tailwind for larger apps)
    const commonPadding = '1.5rem';
    const commonMargin = 'auto';
    const commonBgColor = 'white';
    const commonBorderRadius = '0.5rem';
    const commonBoxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

    const containerStyle = {
        padding: commonPadding,
        maxWidth: '72rem', // Increased max-width for better table display
        margin: commonMargin,
        backgroundColor: commonBgColor,
        borderRadius: commonBorderRadius,
        boxShadow: commonBoxShadow,
    };

    const headingStyle = {
        fontSize: '2rem', // Larger heading
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        textAlign: 'center',
        color: '#1f2937',
    };

    const tableWrapperStyle = {
        overflowX: 'auto',
        borderRadius: commonBorderRadius,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    };

    const tableStyle = {
        minWidth: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#f9fafb',
    };

    const tableHeaderStyle = {
        backgroundColor: '#eef2ff', // Light indigo background for header
    };

    const thStyle = {
        padding: '0.75rem 1rem',
        textAlign: 'left',
        fontSize: '0.75rem',
        fontWeight: '500',
        color: '#4b5563',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    };

    const tdStyle = {
        padding: '0.75rem 1rem',
        fontSize: '0.875rem',
        color: '#374151',
        borderBottom: '1px solid #e5e7eb',
    };

    const viewProfileButtonStyle = {
        padding: '0.5rem 0.75rem',
        fontSize: '0.875rem',
        borderRadius: '0.375rem',
        backgroundColor: '#4f46e5', // Indigo-600 equivalent
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out',
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
        marginLeft: '0.5rem', // Space from view profile button
    };

    const loadingErrorContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '1rem',
    };

    const loadingErrorContentStyle = {
        textAlign: 'center',
        color: '#374151',
        fontSize: '1.125rem',
    };

    const errorBoxStyle = {
        textAlign: 'center',
        color: '#b91c1c',
        backgroundColor: '#fee2e2',
        border: '1px solid #f87171',
        borderRadius: '0.5rem',
        padding: '1.5rem',
    };

    const messageStyle = {
        textAlign: 'center',
        padding: '1rem',
        borderRadius: '0.375rem',
        marginBottom: '1rem',
        fontWeight: '500',
    };

    const successMessageStyle = {
        backgroundColor: '#d1fae5', // Light green
        color: '#065f46', // Dark green
    };

    const errorMessageStyle = {
        backgroundColor: '#fee2e2', // Light red
        color: '#991b1b', // Dark red
    };


    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        setMessage(''); // Clear messages on new fetch
        try {
            const response = await fetch('/api/applications/all', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch applications');
            }

            const data = await response.json();
            setApplications(data);
        } catch (err) {
            console.error('Error fetching all applications:', err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loadingAuth) {
            if (!token || role !== 'employer') {
                navigate('/login');
                return;
            }
            fetchApplications();
        }
    }, [token, role, loadingAuth, navigate]);

    const handleViewProfile = (userId) => {
        navigate(`/user/${userId}`);
    };

    const handleDeleteApplication = async (appId, employeeName, jobTitle) => {
        setMessage(''); // Clear previous messages
        const confirmDelete = window.confirm(
            `Are you sure you want to delete the application by ${employeeName} for "${jobTitle}"?`
        );

        if (!confirmDelete) {
            return;
        }

        try {
            // Send DELETE request to your backend
            // This route should delete from Application2 table
            const response = await fetch(`/api/applications/${appId}`, { // Assuming a generic delete route
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
            setMessage(`Application by ${employeeName} for "${jobTitle}" deleted successfully!`);
        } catch (err) {
            console.error('Error deleting application:', err);
            setMessage(`Failed to delete application: ${err.message}`);
            setError(err.message); // Also set error state for consistent display
        }
    };

    if (loading || loadingAuth) {
        return (
            <div style={loadingErrorContainerStyle}>
                <div style={loadingErrorContentStyle}>
                    Loading applications...
                </div>
            </div>
        );
    }

    if (error && !message) { // Display error if no specific message is set by delete
        return (
            <div style={{ ...loadingErrorContainerStyle, backgroundColor: '#fef2f2' }}>
                <div style={errorBoxStyle}>
                    <p style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Error:</p>
                    <p>{error}</p>
                    <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#dc2626' }}>Please ensure you are logged in as an employer.</p>
                </div>
            </div>
        );
    }

    if (role !== 'employer') {
        return (
            <div style={loadingErrorContainerStyle}>
                <div style={errorBoxStyle}>
                    <p style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Authorization Error:</p>
                    <p>You are not authorized to view this page.</p>
                    <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#dc2626' }}>Please log in as an employer to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
            <h1 style={headingStyle}>
                Job Applications
            </h1>

            {message && (
                <div style={{ ...messageStyle, ...(error ? errorMessageStyle : successMessageStyle) }}>
                    {message}
                </div>
            )}

            {applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 0', color: '#4b5563', fontSize: '1.125rem' }}>
                    <p style={{ marginBottom: '1rem' }}>No applications found yet.</p>
                    <p>Applicants will appear here once they start applying for jobs.</p>
                </div>
            ) : (
                <div style={tableWrapperStyle}>
                    <table style={tableStyle}>
                        <thead style={tableHeaderStyle}>
                            <tr>
                                <th style={{ ...thStyle, borderTopLeftRadius: '0.5rem' }}>
                                    Applicant Name
                                </th>
                                <th style={thStyle}>
                                    Job Title
                                </th>
                                <th style={thStyle}>
                                    Company
                                </th>
                                <th style={thStyle}>
                                    Application Date
                                </th>
                                <th style={{ ...thStyle, textAlign: 'center', borderTopRightRadius: '0.5rem' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody style={{ backgroundColor: '#fff' }}>
                            {applications.map((app) => (
                                <tr key={app._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={tdStyle}>
                                        {app.employeeId ? app.employeeId.name : app.employeeName}
                                    </td>
                                    <td style={tdStyle}>
                                        {app.jobId ? app.jobId.title : app.jobTitle}
                                    </td>
                                    <td style={tdStyle}>
                                        {app.jobId ? app.jobId.companyName : app.companyName}
                                    </td>
                                    <td style={tdStyle}>
                                        {new Date(app.applicationDate).toLocaleDateString()}
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        {app.employeeId && (
                                            <button
                                                onClick={() => handleViewProfile(app.employeeId._id)}
                                                style={viewProfileButtonStyle}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'} // Darker indigo on hover
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                                            >
                                                View Profile
                                            </button>
                                        )}
                                        <button
                                            style={deleteButtonStyle}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'} // Darker red on hover
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                                            onClick={() => handleDeleteApplication(
                                                app._id,
                                                app.employeeId ? app.employeeId.name : app.employeeName,
                                                app.jobId ? app.jobId.title : app.jobTitle
                                            )}
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

export default AllApplicationsTable;
