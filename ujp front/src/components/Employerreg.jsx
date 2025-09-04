import React, { useState } from "react";
import './component.css'; // Ensure your main CSS file is imported
import BufferingLoader from "./BufferingLoader";

async function registerUser(formData) {
  try {
    const response = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error during registerUser fetch:", error);
    throw error;
  }
}

export default function Employerreg() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    location: "",
    establishedDate: "",
  });
  const [certificateFile, setCertificateFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBuffering, setShowBuffering] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCertificateFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      setShowModal(true);
      setLoading(false);
      return;
    }

    if (!certificateFile) {
      setMessage("Please upload a company certificate file.");
      setShowModal(true);
      setLoading(false);
      return;
    }

    setShowBuffering(true);

    setTimeout(async () => {
      setShowBuffering(false);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", "employer");
      data.append("companyName", formData.companyName);
      data.append("location", formData.location);
      data.append("establishedDate", formData.establishedDate);
      data.append("companyCertificate", certificateFile);

      try {
        const result = await registerUser(data);
        setMessage(result.message || "Registration successful!");
        setShowModal(true);
      } catch (error) {
        console.error("Registration error:", error);
        setMessage("Error: " + (error.message || "An unexpected error occurred during registration."));
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  const sectionHeaderStyle = {
    fontWeight: 'bold', fontSize: '18px', marginTop: '20px',
    marginBottom: '10px', borderBottom: '1px solid #ccc',
    paddingBottom: '5px', color: '#333', fontFamily: 'monospace',
  };

  return (
    <div className="register-container">
      {showBuffering && <BufferingLoader onFinish={() => setShowBuffering(false)} />}
      <h2 style={{ marginBottom: '40px', textAlign: 'center', fontFamily: 'monospace', fontSize: '30px' }}>
        Employer Registration
      </h2>

      <form onSubmit={handleSubmit} className="register-form" encType="multipart/form-data">
        <h3 style={sectionHeaderStyle}>Account Credentials</h3>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required minLength={6} />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required minLength={6} />

        <h3 style={sectionHeaderStyle}>Company Information</h3>
        <input type="text" name="name" placeholder="Contact Person Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required />
        <input type="date" name="establishedDate" value={formData.establishedDate} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />

        <label htmlFor="companyCertificate" style={{ fontWeight: '700', fontSize: '16px', marginTop: '15px', marginBottom: '6px', display: 'block', color: '#333', fontFamily: 'monospace' }}>
          Company Certificate
        </label>
        <input id="companyCertificate" type="file" name="companyCertificate" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required />

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Validating..." : "Register"}
        </button>
      </form>

      {/* Modal for messages */}
      {showModal && (
        <div className={`modal-overlay ${showModal ? "show" : ""}`}>
          <div className="modal-box">
            <h3 style={{ color: message.startsWith("Error") ? "red" : "green", marginBottom: "15px" }}>
              {message.startsWith("Error") ? "Error" : "Success"}
            </h3>
            <p style={{ marginBottom: "20px", color: "#333" }}>{message}</p>
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#005fcc",
                color: "white",
                cursor: "pointer"
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
