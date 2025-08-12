import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const UserProfile = () => {
    const { id: userId, applicationId } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [applicationStatus, setApplicationStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { token, loadingAuth } = useAuth();
    const headers = { 'Authorization': `Bearer ${token}` };

    useEffect(() => {
        if (!loadingAuth) {
            if (!token) {
                navigate('/login');
                return;
            }
            const fetchUserProfile = async () => {
                try {
                    const response = await fetch(`/api/users/${userId}`, { headers });
                    if (!response.ok) throw new Error('Failed to fetch user profile');
                    const data = await response.json();
                    setUserProfile(data);

                    if (applicationId) {
                        const appResponse = await fetch(`/api/applications/${applicationId}`, { headers });
                        if (!appResponse.ok) throw new Error('Failed to fetch application details');
                        const appData = await appResponse.json();
                        setApplicationStatus(appData.status);
                    }
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchUserProfile();
        }
    }, [userId, applicationId, token, loadingAuth, navigate]);

    const handleUpdateStatus = async (newStatus) => {
        if (!window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this application?`)) return;
        setMessage('');
        try {
            await axios.put(`/api/applications/status`, { applicationId, status: newStatus }, { headers });
            setApplicationStatus(newStatus);
            setMessage(`Application successfully ${newStatus.toLowerCase()}.`);
        } catch (err) {
            setMessage(err.response?.data?.message || `Failed to update status.`);
        }
    };

    const styles = {
        container: { padding: '24px', maxWidth: '800px', margin: '40px auto', fontFamily: "'monospace', Tahoma, Geneva, Verdana, sans-serif", color: '#333', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', minHeight: '1200px' },
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
        certificateItem: { backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '6px', marginBottom: '10px' },
        actionContainer: { borderTop: '2px solid #eee', marginTop: '30px', paddingTop: '20px' },
        actionButton: { padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', margin: '0 10px' },
        acceptButton: { backgroundColor: '#10B981', color: 'white' },
        rejectButton: { backgroundColor: '#EF4444', color: 'white' },
        statusDisplay: { fontSize: '18px', fontWeight: 'bold', padding: '12px 24px', borderRadius: '6px' },
        accepted: { color: '#065f46', backgroundColor: '#d1fae5' },
        rejected: { color: '#991b1b', backgroundColor: '#fee2e2' },
        message: { textAlign: 'center', fontWeight: 'bold', marginBottom: '1rem' }
    };

    if (loading || loadingAuth) return <div style={styles.container}>Loading user profile...</div>;
    if (error) return <div style={{ ...styles.container, color: 'red' }}>Error: {error}</div>;
    if (!userProfile) return <div style={styles.container}>User profile not found.</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}><h1 style={styles.name}>{userProfile.name}</h1><p style={styles.email}>{userProfile.email}</p></div>
            {userProfile.about && (<div style={styles.section}><h2 style={styles.sectionTitle}>About Me</h2><p style={styles.aboutText}>{userProfile.about}</p></div>)}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Personal Information</h2>
                <div style={styles.infoGrid}>
                    {userProfile.gender && (<div style={styles.infoItem}><span style={styles.infoLabel}>Gender</span>{userProfile.gender}</div>)}
                    {userProfile.dateOfBirth && (<div style={styles.infoItem}><span style={styles.infoLabel}>Date of Birth</span>{new Date(userProfile.dateOfBirth).toLocaleDateString()}</div>)}
                </div>
            </div>
            {userProfile.role === 'employee' && (
                <>
                    <div style={styles.section}><h2 style={styles.sectionTitle}>Academic Details</h2><div style={styles.infoGrid}>
                        {userProfile.education && (<div style={styles.infoItem}><span style={styles.infoLabel}>Highest Qualification</span>{userProfile.education}</div>)}
                        {userProfile.cvFilePath && (<div style={styles.infoItem}><span style={styles.infoLabel}>CV</span><a href={userProfile.cvFilePath} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>View CV</a></div>)}
                    </div></div>
                    {userProfile.certificates && userProfile.certificates.length > 0 && (<div style={styles.section}><h2 style={styles.sectionTitle}>Certificates</h2><ul style={styles.certificateList}>
                        {userProfile.certificates.map((cert) => (<li key={cert._id} style={styles.certificateItem}><span style={styles.infoLabel}>{cert.title}</span>{cert.filePath && (<a href={cert.filePath} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>View Certificate</a>)}</li>))}
                    </ul></div>)}
                </>
            )}
            
            {applicationId && (
                <div style={{...styles.section, ...styles.actionContainer}}>
                    <h2 style={styles.sectionTitle}>Application Action</h2>
                    {message && <p style={{...styles.message, color: message.includes('Failed') ? 'red' : 'green'}}>{message}</p>}
                    
                    {applicationStatus === 'Pending' && (
                        <div>
                            <button onClick={() => handleUpdateStatus('Accepted')} style={{...styles.actionButton, ...styles.acceptButton}}>Accept Application</button>
                            <button onClick={() => handleUpdateStatus('Rejected')} style={{...styles.actionButton, ...styles.rejectButton}}>Reject Application</button>
                        </div>
                    )}
                    {applicationStatus === 'Accepted' && <div style={{...styles.statusDisplay, ...styles.accepted}}>Application Accepted</div>}
                    {applicationStatus === 'Rejected' && <div style={{...styles.statusDisplay, ...styles.rejected}}>Application Rejected</div>}
                </div>
            )}
        </div>
    );
};

export default UserProfile;