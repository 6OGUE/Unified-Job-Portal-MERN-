import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AllApplicationsTable = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { token, role, loadingAuth } = useAuth();

    const commonPadding = '1.5rem';
    const commonMargin = 'auto';
    const commonBgColor = 'white';
    const commonBorderRadius = '0.5rem';
    const commonBoxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    const containerStyle = { padding: commonPadding, maxWidth: '80rem', margin: commonMargin, backgroundColor: commonBgColor, borderRadius: commonBorderRadius, boxShadow: commonBoxShadow };
    const headingStyle = { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', color: '#1f2937',fontFamily:'monospace' };
    const tableWrapperStyle = { overflowX: 'auto', borderRadius: commonBorderRadius, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' };
    const tableStyle = { minWidth: '100%', borderCollapse: 'collapse', backgroundColor: '#f9fafb' };
    const tableHeaderStyle = { backgroundColor: '#eef2ff' };
    const thStyle = { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' };
    const tdStyle = { padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#374151', borderBottom: '1px solid #e5e7eb' };
    const viewProfileButtonStyle = { padding: '0.5rem 0.75rem', fontSize: '0.875rem', borderRadius: '0.375rem', backgroundColor: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s ease-in-out' };
    const deleteButtonStyle = { backgroundColor: '#ef4444', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'background-color 0.2s ease-in-out', marginLeft: '0.5rem' };
    const loadingErrorContainerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '1rem' };
    const loadingErrorContentStyle = { textAlign: 'center', color: '#374151', fontSize: '1.125rem' };
    const errorBoxStyle = { textAlign: 'center', color: '#b91c1c', backgroundColor: '#fee2e2', border: '1px solid #f87171', borderRadius: '0.5rem', padding: '1.5rem' };
    const messageStyle = { textAlign: 'center', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem', fontWeight: '500' };
    const successMessageStyle = { backgroundColor: '#d1fae5', color: '#065f46' };
    const errorMessageStyle = { backgroundColor: '#fee2e2', color: '#991b1b' };
    const statusPillStyle = (status) => ({
        display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '9999px',
        fontSize: '0.75rem', fontWeight: '500', color: '#fff',
        backgroundColor: status === 'Accepted' ? '#10B981' : status === 'Rejected' ? '#EF4444' : '#6B7280',
    });

    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        setMessage('');
        try {
            const response = await fetch('/api/applications/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch applications');
            }
            const data = await response.json();
            setApplications(data);
        } catch (err) {
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

    const handleViewProfile = (userId, applicationId) => {
        navigate(`/user/${userId}/${applicationId}`);
    };

    const handleDeleteApplication = async (appId, employeeName, jobTitle) => {
    setMessage('');
    if (!window.confirm(`Are you sure you want to delete the application by ${employeeName} for "${jobTitle}"?`)) {
        return;
    }
    try {
        const response = await fetch(`/api/applications/${appId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete application.');
        }
        setApplications(prevApps => prevApps.filter(app => app._id !== appId));
        setMessage(`Application by ${employeeName} for "${jobTitle}" deleted successfully!`);
    } catch (err) {
        setMessage(`Failed to delete application: ${err.message}`);
        setError(err.message);
    }
};

    if (loading || loadingAuth) return <div style={loadingErrorContainerStyle}><div style={loadingErrorContentStyle}>Loading applications...</div></div>;
    if (error && !message) return <div style={{ ...loadingErrorContainerStyle, backgroundColor: '#fef2f2' }}><div style={errorBoxStyle}><p style={{ fontSize: '1.25rem', fontWeight: '600' }}>Error:</p><p>{error}</p></div></div>;
    if (role !== 'employer') return <div style={loadingErrorContainerStyle}><div style={errorBoxStyle}><p style={{ fontSize: '1.25rem', fontWeight: '600' }}>Authorization Error:</p><p>You are not authorized to view this page.</p></div></div>;

    return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={headingStyle}>Job Applications</h1>

        {message && (
            <div style={{ ...messageStyle, ...(error ? errorMessageStyle : successMessageStyle) }}>
                {message}
            </div>
        )}

        {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 0', color: '#4b5563', fontSize: '1.125rem' }}>
                <img 
                    src="/empty.png" 
                    alt="No applications" 
                    style={{ width: '150px', marginBottom: '1rem', opacity: 0.7 }} 
                />
                <p>No applications found yet.</p>
            </div>
        ) : (
            <div style={containerStyle}>
                <div style={tableWrapperStyle}>
                    <table style={tableStyle}>
                        <thead style={tableHeaderStyle}>
                            <tr>
                                <th style={thStyle}>Applicant Name</th>
                                <th style={thStyle}>Job Title</th>
                                <th style={thStyle}>Company</th>
                                <th style={thStyle}>Application Date</th>
                                <th style={thStyle}>Status</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody style={{ backgroundColor: '#fff' }}>
                            {applications.map((app) => (
                                <tr key={app._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={tdStyle}>{app.employeeId ? app.employeeId.name : app.employeeName}</td>
                                    <td style={tdStyle}>{app.jobId ? app.jobId.title : app.jobTitle}</td>
                                    <td style={tdStyle}>{app.jobId ? app.jobId.companyName : app.companyName}</td>
                                    <td style={tdStyle}>{new Date(app.applicationDate).toLocaleDateString()}</td>
                                    <td style={tdStyle}>
                                        <span style={statusPillStyle(app.status)}>{app.status}</span>
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        {app.employeeId && (
                                            <button 
                                                onClick={() => handleViewProfile(app.employeeId._id, app._id)} 
                                                style={viewProfileButtonStyle}
                                            >
                                                View Profile
                                            </button>
                                        )}
                                        <button 
                                            style={deleteButtonStyle} 
                                            onClick={() => handleDeleteApplication(app._id, app.employeeId?.name, app.jobId?.title)}
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
        )}
    </div>
);

};

export default AllApplicationsTable;