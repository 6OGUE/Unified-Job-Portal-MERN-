import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEye } from "react-icons/fa";

const userImg = "http://localhost:5173/icons/user.png"; // Local user image

const ViewProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [atsLoading, setAtsLoading] = useState(false);
    const [atsResult, setAtsResult] = useState(null);

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

    // ✅ ATS Check Function
    const checkATS = async () => {
        if (!profile.cvFilePath) {
            setAtsResult({ error: "No resume uploaded." });
            return;
        }

        setAtsLoading(true);
        setAtsResult(null);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "/api/ats-check",
                { cvUrl: profile.cvFilePath },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAtsResult({
                atsScore: res.data.atsScore,
                totalKeywords: res.data.totalKeywords,
                remark: res.data.remark,
            });
        } catch (err) {
            console.error("Error checking ATS:", err);
            setAtsResult({ error: "Failed to analyze resume." });
        } finally {
            setAtsLoading(false);
        }
    };

    // ✅ Inline styles
    const styles = {
        container: {
            padding: '24px',
            maxWidth: '1080px',
            margin: '36px auto',
            fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
            color: '#22223b',
            backgroundColor: '#f9fafb',
            borderRadius: '18px',
            boxShadow: '0 6px 24px rgba(30,144,255,0.10)',
        },
        header: {
            textAlign: 'center',
            marginBottom: '18px',
            paddingBottom: '8px',
        },
        avatar: {
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
            marginBottom: '12px',
            border: '4px solid #fff',
        },
        name: { fontSize: '28px', fontWeight: 'bold', margin: 0 },
        email: { fontSize: '16px', color: '#555', marginTop: '4px' },
        editButton: { display: 'inline-block', textDecoration: 'none', backgroundColor: '#4A90E2', color: '#fff', padding: '10px 20px', borderRadius: '6px', fontWeight: '600', transition: 'background-color 0.25s ease', marginTop: '20px' },
        section: { marginBottom: '25px', textAlign: 'center' },
        sectionTitle: { fontSize: '20px', fontWeight: '600', borderBottom: '2px solid #eee', paddingBottom: '8px', marginBottom: '15px' },
        infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
        infoItem: { backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '6px' },
        infoLabel: { fontWeight: 'bold', display: 'block', marginBottom: '4px' },
        aboutText: { lineHeight: 1.6, color: '#444', whiteSpace: 'pre-wrap' },
        fileLink: { color: '#4A90E2', textDecoration: 'none', fontWeight: '500', marginRight: "10px" },
        certificateList: { listStyle: 'none', padding: 0 },
        certificateItem: { backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '6px', marginBottom: '10px' },
        atsButton: { backgroundColor: "#28a745", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px" },

        // Modal styles
        modalOverlay: {
            position: "fixed",
            top: 0, left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
        },
        modalBox: {
            background: "#fff",
            padding: "32px",
            borderRadius: "12px",
            width: "420px",
            maxWidth: "90%",
            textAlign: "center",
            boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
            animation: "fadeIn 0.3s ease-in-out",
        },
        modalTitle: { fontSize: "22px", fontWeight: "700", marginBottom: "16px" },
        modalText: { fontSize: "18px", marginBottom: "20px", color: "#333" },
        modalButton: { backgroundColor: "#007BFF", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "16px" },

        // Loader animation
        loader: {
            border: "6px solid #f3f3f3",
            borderTop: "6px solid #007BFF",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
            margin: "0 auto",
        },
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
                <img src={userImg} alt="User" style={styles.avatar} />
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
                        <span style={styles.infoLabel}>Resume</span>
                        {profile.cvFilePath ? (
                            <>
                                <a
                                    href={profile.cvFilePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.fileLink}
                                    title="View Resume"
                                >
                                    <FaEye style={{ fontSize: "1.6rem" }} /><br />
                                </a>
                                <button style={styles.atsButton} onClick={checkATS}>
                                    Check ATS
                                </button>
                            </>
                        ) : (
                            'Not uploaded'
                        )}
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
                                <a
                                    href={cert.filePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.fileLink}
                                >
                                    <FaEye style={{ fontSize: "1.6rem" }} />
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No certificates uploaded.</p>
                )}
            </div>

            {/* ✅ ATS Loading Modal */}
            {atsLoading && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalBox}>
                        <div style={styles.loader}></div>
                        <p style={{ marginTop: "20px", fontSize: "18px" }}>Analyzing your resume...</p>
                    </div>
                </div>
            )}

            {/* ✅ ATS Result Modal */}
            {atsResult && (
    <div style={styles.modalOverlay}>
        <div style={styles.modalBox}>
            <h2 style={styles.modalTitle}>ATS Result</h2>
            {atsResult.error ? (
                <p style={styles.modalText}>{atsResult.error}</p>
            ) : (
                <p style={styles.modalText}>
                    Your ATS Score: <b>{atsResult.atsScore}</b> / {atsResult.totalKeywords}
                    <br />
                    Remarks: <b>{atsResult.remark}</b>
                </p>
            )}
            <button
                style={styles.modalButton}
                onClick={() => setAtsResult(null)}
            >
                OK
            </button>
        </div>
    </div>
)}


            {/* ✅ Loader CSS animation */}
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                `}
            </style>
        </div>
    );
};

export default ViewProfile;
