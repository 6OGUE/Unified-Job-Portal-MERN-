import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const userImg = "http://localhost:5173/icons/user.png"; // Local user image

const UserProfile = () => {
    const { id: userId, applicationId } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [applicationStatus, setApplicationStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applicationToUpdate, setApplicationToUpdate] = useState(null);
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

    const confirmUpdateStatus = async () => {
        if (!applicationToUpdate) return;
        
        const { id, status } = applicationToUpdate;

        try {
            await axios.put(`/api/applications/status`, { applicationId: id, status: status }, { headers });
            setApplicationStatus(status);
            toast.success(`Application successfully ${status.toLowerCase()}.`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to update status. Please try again.');
        } finally {
            setApplicationToUpdate(null);
        }
    };

    const styles = {
        container: { padding: '24px', maxWidth: '1080px', margin: '40px auto', fontFamily: "'monospace', Tahoma, Geneva, Verdana, sans-serif", color: '#333', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', minHeight: '1200px' },
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
        acceptButton: { backgroundColor: '#10b981', color: 'white' },
        rejectButton: { backgroundColor: '#dc2626', color: 'white' },
        statusDisplay: { fontSize: '18px', fontWeight: 'bold', padding: '12px 24px', borderRadius: '6px' },
        accepted: { color: '#065f46', backgroundColor: '#d1fae5' },
        rejected: { color: '#991b1b', backgroundColor: '#fee2e2' },
        message: { textAlign: 'center', fontWeight: 'bold', marginBottom: '1rem' },
        modalContainer: { position: 'fixed', inset: 0, backgroundColor: 'rgba(75, 85, 99, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
        modalContent: { backgroundColor: '#fff', borderRadius: '0.5rem', padding: '2rem', width: '90%', maxWidth: '400px', textAlign: 'center' },
    };

    if (loading || loadingAuth) return <div style={styles.container}>Loading user profile...</div>;
    if (error) return <div style={{ ...styles.container, color: 'red' }}>Error: {error}</div>;
    if (!userProfile) return <div style={styles.container}>User profile not found.</div>;

    return (     
  <div style={styles.container}>
    <div style={styles.header}>
      <h1 style={styles.name}>{userProfile.name}</h1>

      {/* User Icon Image just below name */}
      <div style={{ marginTop: "0.25rem" }}>
        <img 
          src="http://localhost:5173/icons/user.png" 
          alt="User Icon" 
          style={{ width: "60px", height: "60px" }} 
        />
      </div>

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

    {userProfile.role === "employee" && (
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
                <span style={styles.infoLabel}>Resume</span>
                <a
                  href={userProfile.cvFilePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.fileLink}
                >
                  View Resume
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

    {applicationId && (
      <div style={{ ...styles.section, ...styles.actionContainer }}>
        <h2 style={styles.sectionTitle}>Application Action</h2>

        {applicationStatus === "Pending" && (
          <div>
            <button
              onClick={() =>
                setApplicationToUpdate({ id: applicationId, status: "Accepted" })
              }
              style={{ ...styles.actionButton, ...styles.acceptButton }}
            >
              Accept Application
            </button>
            <button
              onClick={() =>
                setApplicationToUpdate({ id: applicationId, status: "Rejected" })
              }
              style={{ ...styles.actionButton, ...styles.rejectButton }}
            >
              Reject Application
            </button>
          </div>
        )}

        {applicationStatus === "Accepted" && (
          <div style={{ ...styles.statusDisplay, ...styles.accepted }}>
            Application Accepted
          </div>
        )}
        {applicationStatus === "Rejected" && (
          <div style={{ ...styles.statusDisplay, ...styles.rejected }}>
            Application Rejected
          </div>
        )}
      </div>
    )}

    {applicationToUpdate && (
      <div style={styles.modalContainer}>
        <div style={styles.modalContent}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              marginBottom: "1rem",
            }}
          >
            Confirm Action
          </h2>
          <p style={{ color: "#374151", marginBottom: "1.5rem" }}>
            Do you really want to{" "}
            {applicationToUpdate.status === "Accepted" ? "accept" : "reject"} this
            application?
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button
              onClick={() => setApplicationToUpdate(null)}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                borderRadius: "0.375rem",
                backgroundColor: "#4f46e5",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={confirmUpdateStatus}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                borderRadius: "0.375rem",
                backgroundColor: "#dc2626",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              {applicationToUpdate.status === "Accepted" ? "Accept" : "Reject"}
            </button>
          </div>
        </div>
      </div>
    )}

    <ToastContainer position="top-center" autoClose={3000} />
  </div>
);

};

export default UserProfile;