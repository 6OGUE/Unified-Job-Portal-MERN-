import React, { useState } from "react";
import './component.css';

async function registerUser(formData) {
  const response = await fetch('http://localhost:5000/api/users/register', {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

export default function JobSeekerReg() {
  const [formData, setFormData] = useState({
    name: "", dob: "", gender: "", about: "", email: "", password: ""
  });

  const [dobInputType, setDobInputType] = useState('text');
  const [cv, setCv] = useState(null);
  const [education, setEducation] = useState("");
  const [certificates, setCertificates] = useState([{ id: Date.now(), title: "", file: null }]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "education") {
      setEducation(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCvChange = (e) => {
    setCv(e.target.files[0]);
  };

  const handleCertificateTitleChange = (id, e) => {
    const newTitle = e.target.value;
    setCertificates(prev =>
      prev.map(cert => cert.id === id ? { ...cert, title: newTitle } : cert)
    );
  };

  const handleCertificateFileChange = (id, e) => {
    const file = e.target.files[0];
    setCertificates(prev =>
      prev.map(cert => cert.id === id ? { ...cert, file: file } : cert)
    );
  };

  const addCertificateField = () => {
    setCertificates(prev => [...prev, { id: Date.now(), title: "", file: null }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const data = new FormData();

    data.append("name", formData.name);
    data.append("dateOfBirth", formData.dob);
    data.append("gender", formData.gender);
    data.append("about", formData.about);
    data.append("education", education);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", "employee");

    if (cv) data.append("cv", cv);

    certificates.forEach((cert, index) => {
      if (cert.title && cert.file) {
        data.append(`certificates_title_${index}`, cert.title);
        data.append(`certificates_file_${index}`, cert.file);
      }
    });

    setLoading(true);
    try {
      const result = await registerUser(data);
      setMessage(result.message || "Registration submission failed");
    } catch (error) {
      setMessage("Error: " + error.message);
    }
    setLoading(false);
  };

  const sectionHeaderStyle = {
    fontWeight: 'bold', fontSize: '18px', marginTop: '30px',
    marginBottom: '20px', borderBottom: '1px solid #ccc',
    paddingBottom: '5px', color: '#333', fontFamily: 'monospace',
  };

  return (
    <div className="register-container">
      <h2 style={{ marginBottom: '40px', textAlign: 'center', fontFamily: 'monospace', fontSize: '30px' }}>
        Job Seeker Registration
      </h2>

      <form onSubmit={handleSubmit} className="register-form" encType="multipart/form-data">

        <h3 style={sectionHeaderStyle}>Account Credentials</h3>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <h3 style={sectionHeaderStyle}>Personal Information</h3>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type={dobInputType}
          name="dob"
          placeholder="Date of Birth"
          value={formData.dob}
          onChange={handleChange}
          onFocus={() => setDobInputType('date')}
          onBlur={() => { if (!formData.dob) setDobInputType('text'); }}
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            backgroundColor: '#f9f9f9',
            border: '1.5px solid #888',
            borderRadius: '6px',
            padding: '8px 40px 8px 12px',
            fontSize: '16px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: '#333',
            cursor: 'pointer',
            width: '100%',
            maxWidth: '300px',
            backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '16px 16px',
          }}
          onFocus={e => e.target.style.borderColor = '#005fcc'}
          onBlur={e => e.target.style.borderColor = '#888'}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <textarea
          name="about"
          placeholder="About Me (Brief Description)"
          value={formData.about}
          onChange={handleChange}
          rows="4"
          style={{ width: '100%', marginTop: '15px', padding: '10px', fontSize: '15px' }}
          required
        />

        <h3 style={sectionHeaderStyle}>Education</h3>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {["Matriculation", "Higher Secondary", "Graduation", "Postgraduation"].map((level) => (
            <label key={level}>
              <input
                type="radio"
                name="education"
                value={level}
                checked={education === level}
                onChange={handleChange}
                required
              /> {level}
            </label>
          ))}
        </div>

        <h3 style={sectionHeaderStyle}>CV Upload</h3>
        <input
          type="file"
          name="cv"
          accept=".pdf"
          onChange={handleCvChange}
          required
        />

        <h3 style={sectionHeaderStyle}>Certificates Upload</h3>
        {certificates.map((cert) => (
          <div key={cert.id} style={{ marginBottom: '15px', border: '1px dashed #ccc', padding: '10px', borderRadius: '4px' }}>
            <input
              type="text"
              placeholder="Certificate Title"
              value={cert.title}
              onChange={(e) => handleCertificateTitleChange(cert.id, e)}
              required
              style={{ width: '60%', marginRight: '10px', padding: '8px' }}
            />
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleCertificateFileChange(cert.id, e)}
              required
              style={{ width: '35%' }}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addCertificateField}
          style={{
            backgroundColor: '#e0e0e0',
            color: '#333',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          + Add Another Certificate
        </button>

        <button
          type="submit"
          disabled={loading}
          className="submit-button"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && (
        <p className="message" style={{
          color: message.startsWith("Error") ? 'red' : 'green',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          {message}
        </p>
      )}
    </div>
  );
}
