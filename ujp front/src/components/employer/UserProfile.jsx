import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Corrected import path

const UserProfile = () => {
    const { id } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { token, loadingAuth } = useAuth();

    useEffect(() => {
        if (!loadingAuth) {
            if (!token) {
                navigate('/login');
                return;
            }

            const fetchUserProfile = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const response = await fetch(`/api/users/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Failed to fetch user profile');
                    }

                    const data = await response.json();
                    setUserProfile(data);
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                    setError(err.message || 'An unexpected error occurred.');
                } finally {
                    setLoading(false);
                }
            };

            fetchUserProfile();
        }
    }, [id, token, loadingAuth, navigate]);

    const styles = {
        container: {
            padding: '24px',
            maxWidth: '800px',
            margin: '40px auto',
            fontFamily: "'monospace', Tahoma, Geneva, Verdana, sans-serif",
            color: '#333',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            minHeight: '1200px',
        },
        header: { textAlign: 'center', marginBottom: '30px' },
        name: { fontSize: '28px', fontWeight: 'bold', margin: 0 },
        email: { fontSize: '16px', color: '#555', marginTop: '4px' },
        section: { marginBottom: '25px', textAlign: 'center' },
        sectionTitle: { fontSize: '20px', fontWeight: '600', borderBottom: '2px solid #eee', paddingBottom: '8px', marginBottom: '15px' },
        infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
        infoItem: { backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '6px' },
        infoLabel: { fontWeight: 'bold', display: 'block', marginBottom: '4px' },
        aboutText: { lineHeight: 1.6, color: '#444', whiteSpace: 'pre-wrap' },
        fileLink: { color: '#4A90E2', textDecoration: 'none', fontWeight: '500' },
        certificateList: { listStyle: 'none', padding: 0 },
        certificateItem: { backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '6px', marginBottom: '10px' }
    };

    if (loading || loadingAuth) {
        return <div style={styles.container}>Loading user profile...</div>;
    }

    if (error) {
        return <div style={{ ...styles.container, color: 'red' }}>Error: {error}</div>;
    }

    if (!userProfile) {
        return <div style={styles.container}>User profile not found.</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.name}>{userProfile.name}</h1>
                <p style={styles.email}>{userProfile.email}</p>
            </div>

            {userProfile.about && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>About Me</h2>
                    <p style={styles.aboutText}>{userProfile.about}</p>
                </div>
            )}

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Personal Information</h2>
                <div style={styles.infoGrid}>
                    
                    {userProfile.gender && (
                        <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>Gender</span>
                            {userProfile.gender}
                        </div>
                    )}
                    {userProfile.dateOfBirth && (
                        <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>Date of Birth</span>
                            {new Date(userProfile.dateOfBirth).toLocaleDateString()}
                        </div>
                    )}
                </div>
            </div>

            {userProfile.role === 'employee' && (
                <>
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Academic Details</h2>
                        <div style={styles.infoGrid}>
                            {userProfile.education && (
                                <div style={styles.infoItem}>
                                    <span style={styles.infoLabel}>Highest Qualification</span>
                                    {userProfile.education}
                                </div>
                            )}
                            {userProfile.cvFilePath && (
                                <div style={styles.infoItem}>
                                    <span style={styles.infoLabel}>CV</span>
                                    <a
                                        href={userProfile.cvFilePath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={styles.fileLink}
                                    >
                                        View CV
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {userProfile.certificates && userProfile.certificates.length > 0 && (
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Certificates</h2>
                            <ul style={styles.certificateList}>
                                {userProfile.certificates.map((cert) => (
                                    <li key={cert._id} style={styles.certificateItem}>
                                        <span style={styles.infoLabel}>{cert.title}</span>
                                        {cert.filePath && (
                                            <a
                                                href={cert.filePath}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={styles.fileLink}
                                            >
                                                View Certificate
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}

            {userProfile.role === 'employer' && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Employer Details</h2>
                    <div style={styles.infoGrid}>
                        {userProfile.companyName && (
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Company Name</span>
                                {userProfile.companyName}
                            </div>
                        )}
                        {userProfile.location && (
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Location</span>
                                {userProfile.location}
                            </div>
                        )}
                        {userProfile.establishedDate && (
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Established Date</span>
                                {new Date(userProfile.establishedDate).toLocaleDateString()}
                            </div>
                        )}
                        {userProfile.certificateFilePath && (
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Company Certificate</span>
                                <a
                                    href={userProfile.certificateFilePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.fileLink}
                                >
                                    View Certificate
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;