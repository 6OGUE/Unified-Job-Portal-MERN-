import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(res.data);
            } catch (err) {
                setError('Failed to load profile data.');
                console.error('Error loading profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const styles = {
        container: {
            padding: '24px',
            maxWidth: '800px',
            margin: '40px auto',
            fontFamily: "'monospace', Tahoma, Geneva, Verdana, sans-serif",
            color: '#333',
            backgroundColor: '#fff', // Kept card background
            borderRadius: '8px',     // Kept card border radius
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)', // Kept card shadow
            minHeight: '1200px', // Increased height
        },
        header: { textAlign: 'center', marginBottom: '30px' },
        name: { fontSize: '28px', fontWeight: 'bold', margin: 0 },
        email: { fontSize: '16px', color: '#555', marginTop: '4px' },
        editButton: { display: 'inline-block', textDecoration: 'none', backgroundColor: '#4A90E2', color: '#fff', padding: '10px 20px', borderRadius: '6px', fontWeight: '600', transition: 'background-color 0.25s ease', marginTop: '20px' },
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

    if (loading) {
        return <div style={styles.container}>Loading profile...</div>;
    }

    if (error) {
        return <div style={{ ...styles.container, color: 'red' }}>{error}</div>;
    }

    if (!profile) {
        return <div style={styles.container}>No profile data found.</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.name}>{profile.name}</h1>
                <p style={styles.email}>{profile.email}</p>
                <Link to="/employee/profile/edit" style={styles.editButton}>
                    Edit Profile
                </Link>
            </div>

            {profile.about && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>About Me</h2>
                    <p style={styles.aboutText}>{profile.about}</p>
                </div>
            )}

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Personal Information</h2>
                <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Gender</span>
                        {profile.gender || 'Not specified'}
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Date of Birth</span>
                        {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not specified'}
                    </div>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Academic Details</h2>
                <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Highest Qualification</span>
                        {profile.education || 'Not specified'}
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>CV</span>
                        {profile.cvFilePath ? (
                            <a href={profile.cvFilePath} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>View CV</a>
                        ) : 'Not uploaded'}
                    </div>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Certificates</h2>
                {profile.certificates && profile.certificates.length > 0 ? (
                    <ul style={styles.certificateList}>
                        {profile.certificates.map(cert => (
                            <li key={cert._id} style={styles.certificateItem}>
                                <span style={styles.infoLabel}>{cert.title}</span>
                                <a href={cert.filePath} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>View Certificate</a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No certificates uploaded.</p>
                )}
            </div>
        </div>
    );
};

export default ViewProfile;