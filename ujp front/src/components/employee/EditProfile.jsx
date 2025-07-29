import React, { useEffect, useState } from 'react';
import axios from 'axios';

const qualifications = ['Matriculation', 'Higher Secondary', 'Graduation', 'Postgraduation'];

const EditProfile = () => {
    const [currentQualification, setCurrentQualification] = useState('');
    const [selectedQualification, setSelectedQualification] = useState('');
    const [aboutText, setAboutText] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const [cvName, setCvName] = useState('');
    const [certificates, setCertificates] = useState([]);
    const [newCertificates, setNewCertificates] = useState([{ title: '', file: null }]);
    const [message, setMessage] = useState({ text: '', isError: false });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const res = await axios.get('/api/users/profile', { headers });
            const data = res.data;
            setCurrentQualification(data.education || '');
            setAboutText(data.about || '');
            setCvName(data.cvFilePath ? data.cvFilePath.split('/').pop() : '');
            setCertificates(data.certificates || []);
        } catch (err) {
            console.error('Error loading profile', err);
            setMessage({ text: 'Failed to load profile data.', isError: true });
        }
    };

    const handleQualificationSubmit = async () => {
        setMessage({ text: '', isError: false });
        try {
            await axios.put('/api/users/profile/qualification', { education: selectedQualification }, { headers });
            setCurrentQualification(selectedQualification);
            setSelectedQualification('');
            setMessage({ text: 'Qualification updated successfully!', isError: false });
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to update qualification.';
            setMessage({ text: errorMsg, isError: true });
        }
    };

    const handleAboutSubmit = async () => {
        setMessage({ text: '', isError: false });
        try {
            await axios.put('/api/users/profile/about', { about: aboutText }, { headers });
            setMessage({ text: 'About section updated successfully!', isError: false });
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to update about section.';
            setMessage({ text: errorMsg, isError: true });
        }
    };
    
    const handleCvDelete = async () => {
        setMessage({ text: '', isError: false });
        try {
            await axios.delete('/api/users/profile/cv', { headers });
            setCvName('');
            setCvFile(null);
            setMessage({ text: 'CV deleted successfully.', isError: false });
        } catch (err) {
            setMessage({ text: 'Failed to delete CV.', isError: true });
        }
    };

    const handleCertificateDelete = async (certId) => {
        setMessage({ text: '', isError: false });
        try {
            await axios.delete(`/api/users/profile/certificates/${certId}`, { headers });
            setCertificates((prev) => prev.filter((cert) => cert._id !== certId));
            setMessage({ text: 'Certificate deleted successfully.', isError: false });
        } catch (err) {
            setMessage({ text: 'Failed to delete certificate.', isError: true });
        }
    };

    const handleCertificateChange = (idx, field, value) => {
        const updated = [...newCertificates];
        updated[idx][field] = value;
        setNewCertificates(updated);
    };

    const addCertificateField = () => {
        setNewCertificates([...newCertificates, { title: '', file: null }]);
    };
    
    const handleFileUploadSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', isError: false });
        
        const hasNewCert = newCertificates.some(cert => cert.file && cert.title);
        const hasNewCv = !!cvFile;

        if (!hasNewCert && !hasNewCv) {
            setMessage({ text: "No new files to upload.", isError: false });
            return;
        }

        try {
            if (hasNewCv) {
                const cvFormData = new FormData();
                cvFormData.append('cv', cvFile);
                await axios.post('/api/users/profile/cv', cvFormData, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } });
            }
            if (hasNewCert) {
                const certFormData = new FormData();
                newCertificates.forEach((cert, index) => {
                    if (cert.title && cert.file) {
                        certFormData.append(`certificates[${index}][title]`, cert.title);
                        certFormData.append(`certificates[${index}][file]`, cert.file);
                    }
                });
                await axios.post('/api/users/profile/certificates', certFormData, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } });
            }
            
            setMessage({ text: 'Files uploaded successfully!', isError: false });
            fetchProfileData();
            setCvFile(null);
            setNewCertificates([{ title: '', file: null }]);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'An error occurred during file upload.';
            setMessage({ text: errorMsg, isError: true });
        }
    };

    const styles = {
        container: { padding: 24, maxWidth: 720, margin: '40px auto', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#333', lineHeight: 1.5,minHeight:'1200px' },
        sectionTitle: { fontSize: 22, fontWeight: '600', marginBottom: 12, borderBottom: '2px solid #4A90E2', paddingBottom: 4, fontFamily: "monospace", },
        textArea: { width: '100%', minHeight: '120px', padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1.8px solid #d1d9e6', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' },
        label: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 16, marginRight: 16, userSelect: 'none', },
        radioInput: { width: 18, height: 18, cursor: 'pointer', },
        buttonPrimary: { backgroundColor: '#4A90E2', color: '#fff', padding: '10px 24px', borderRadius: 6, border: 'none', fontWeight: '600', fontSize: 16, cursor: 'pointer', transition: 'background-color 0.25s ease', marginTop: 16, },
        buttonPrimaryDisabled: { backgroundColor: '#a0c4f3', cursor: 'not-allowed', },
        buttonDanger: { backgroundColor: 'transparent', border: 'none', color: '#E94E4E', cursor: 'pointer', fontWeight: '600', fontSize: 14, padding: '4px 8px', transition: 'color 0.2s ease', },
        fileBox: { backgroundColor: '#F7F9FC', padding: 12, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, fontSize: 15, boxShadow: 'inset 0 0 4px #d1d9e6', },
        certificateContainer: { marginBottom: 20, },
        inputText: { padding: 10, fontSize: 16, borderRadius: 6, border: '1.8px solid #d1d9e6', width: '100%', boxSizing: 'border-box', marginBottom: 8, transition: 'border-color 0.2s ease', },
        inputFile: { marginTop: 4, fontSize: 15, cursor: 'pointer', },
        addMoreBtn: { backgroundColor: '#eee', border: '1.5px solid #ccc', padding: '8px 14px', borderRadius: 6, cursor: 'pointer', fontWeight: '600', fontSize: 14, alignSelf: 'flex-start', marginTop: 6, },
        messageBox: { textAlign: 'center', marginTop: '20px', fontSize: '16px', fontWeight: 'bold', },
    };

    return (
        <div style={styles.container}>
            <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px', fontSize: '32px', fontFamily:'monospace' }}>Edit Profile</h1>
            
            <h2 style={styles.sectionTitle}>About Me</h2>
            <textarea
                style={styles.textArea}
                placeholder="Write a short summary about yourself..."
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
            />
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <button onClick={handleAboutSubmit} style={{ ...styles.buttonPrimary, display: 'inline-block' }}>Save About Me</button>
            </div>
            
            <h2 style={{...styles.sectionTitle, marginTop: '36px'}}>Qualification</h2>
            <p>Current: <strong>{currentQualification || 'Not set'}</strong></p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 12 }}>
                {qualifications.map((q) => (
                    <label key={q} style={styles.label}>
                        <input type="radio" name="qualification" value={q} checked={selectedQualification === q} onChange={() => setSelectedQualification(q)} style={styles.radioInput} /> {q}
                    </label>
                ))}
            </div>
            <div style={{ textAlign: 'center' }}>
                <button onClick={handleQualificationSubmit} disabled={!selectedQualification} style={{ ...styles.buttonPrimary, ...(!selectedQualification ? styles.buttonPrimaryDisabled : {}) }} > Update Qualification </button>
            </div>

            <h2 style={{ ...styles.sectionTitle, marginTop: '36px' }}>Edit Uploads</h2>
            <div style={styles.certificateContainer}>
                <h3 style={{ fontWeight: 600, marginBottom: 8 }}>CV</h3>
                {cvName ? (
                    <div style={styles.fileBox}><span>{cvName}</span> <button style={styles.buttonDanger} onClick={handleCvDelete}> Delete </button></div>
                ) : ( <input type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files[0])} style={styles.inputFile} required /> )}
            </div>

            <div style={styles.certificateContainer}>
                <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Certificates</h3>
                {certificates.map((cert) => (
                    <div key={cert._id} style={styles.fileBox}>
                        <span>{cert.title} ({cert.filePath.split('/').pop()})</span>
                        <button style={styles.buttonDanger} onClick={() => handleCertificateDelete(cert._id)}> Delete </button>
                    </div>
                ))}
            </div>

            <form onSubmit={handleFileUploadSubmit} style={{ marginTop: 20 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Add New Certificates</h3>
                {newCertificates.map((cert, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12, ...(window.innerWidth > 768 ? { flexDirection: 'row', alignItems: 'center' } : {}), }}>
                        <input type="text" placeholder="Certificate Title" value={cert.title} onChange={(e) => handleCertificateChange(index, 'title', e.target.value)} style={{ ...styles.inputText, flex: 1, marginRight: 12 }} required />
                        <input type="file" accept=".pdf" onChange={(e) => handleCertificateChange(index, 'file', e.target.files[0])} style={{ flex: 1, cursor: 'pointer' }} required />
                    </div>
                ))}
                <button type="button" onClick={addCertificateField} style={styles.addMoreBtn}> + Add More </button>
                <div style={{ textAlign: 'center' }}>
                    <button type="submit" style={{ ...styles.buttonPrimary, marginTop: 24, width: '100%', fontSize: 18, padding: '12px 0', }}>Upload New Files</button>
                </div>
            </form>
            
            {message.text && (
                <p style={{ ...styles.messageBox, color: message.isError ? 'red' : 'green' }}>
                    {message.text}
                </p>
            )}
        </div>
    );
};

export default EditProfile;