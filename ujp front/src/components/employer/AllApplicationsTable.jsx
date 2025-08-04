import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Corrected import path

const AllApplicationsTable = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { token, role, loadingAuth } = useAuth();

    useEffect(() => {
        if (!loadingAuth) {
            if (!token || role !== 'employer') {
                navigate('/login');
                return;
            }

            const fetchApplications = async () => {
                try {
                    setLoading(true);
                    setError(null);

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

            fetchApplications();
        }
    }, [token, role, loadingAuth, navigate]);

    const handleViewProfile = (userId) => {
        navigate(`/user/${userId}`);
    };

    if (loading || loadingAuth) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '1rem' }}>
                <div style={{ textAlign: 'center', color: '#374151', fontSize: '1.125rem' }}>
                    Loading applications...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#fef2f2', padding: '1rem' }}>
                <div style={{ textAlign: 'center', color: '#b91c1c', backgroundColor: '#fee2e2', border: '1px solid #f87171', borderRadius: '0.5rem', padding: '1.5rem' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Error:</p>
                    <p>{error}</p>
                    <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#dc2626' }}>Please ensure you are logged in as an employer.</p>
                </div>
            </div>
        );
    }

    if (role !== 'employer') {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '1rem' }}>
                <div style={{ textAlign: 'center', color: '#b91c1c', backgroundColor: '#fee2e2', border: '1px solid #f87171', borderRadius: '0.5rem', padding: '1.5rem' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Authorization Error:</p>
                    <p>You are not authorized to view this page.</p>
                    <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#dc2626' }}>Please log in as an employer to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1f2937', marginBottom: '1.5rem', textAlign: 'center' }}>
                Job Applications
            </h1>

            {applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 0', color: '#4b5563', fontSize: '1.125rem' }}>
                    <p style={{ marginBottom: '1rem' }}>No applications found yet.</p>
                    <p>Applicants will appear here once they start applying for jobs.</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
                    <table style={{ minWidth: '100%', borderCollapse: 'collapse', backgroundColor: '#f9fafb' }}>
                        <thead style={{ backgroundColor: '#eef2ff' }}>
                            <tr>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em', borderTopLeftRadius: '0.5rem' }}>
                                    Applicant Name
                                </th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Job Title
                                </th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Company
                                </th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Application Date
                                </th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em', borderTopRightRadius: '0.5rem' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody style={{ backgroundColor: '#fff' }}>
                            {applications.map((app) => (
                                <tr key={app._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                                        {app.employeeId ? app.employeeId.name : app.employeeName}
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#374151' }}>
                                        {app.jobId ? app.jobId.title : app.jobTitle}
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#374151' }}>
                                        {app.jobId ? app.jobId.companyName : app.companyName}
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#374151' }}>
                                        {new Date(app.applicationDate).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                                        {app.employeeId && (
                                            <button
                                                onClick={() => handleViewProfile(app.employeeId._id)}
                                                style={{
                                                    padding: '0.5rem 0.75rem',
                                                    fontSize: '0.875rem',
                                                    borderRadius: '0.375rem',
                                                    backgroundColor: '#4f46e5', // Indigo-600 equivalent
                                                    color: '#fff',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s ease-in-out',
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'} // Darker indigo on hover
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                                            >
                                                View Profile
                                            </button>
                                        )}
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
