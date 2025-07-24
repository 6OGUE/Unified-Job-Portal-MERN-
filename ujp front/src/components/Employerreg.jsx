import React, { useState } from "react";
import './component.css';

async function registerUser(formData) {
  const response = await fetch('http://localhost:5000/api/users/register', {
    method: 'POST',
    // Do NOT set Content-Type header for FormData; browser handles it automatically
    body: formData,
  });
  return response.json();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setCertificateFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (!certificateFile) {
      setMessage("Please upload a company certificate file.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", "employer");
    data.append("companyName", formData.companyName);
    data.append("location", formData.location);
    data.append("establishedDate", formData.establishedDate);
    data.append("companyCertificate", certificateFile);

    setLoading(true);
    try {
      const result = await registerUser(data);
      setMessage(result.message || "Registration failed");
    } catch (error) {
      setMessage("Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <h2 style={{
          marginBottom: '50px', marginLeft:'70px',
          fontFamily: 'monospace',
          fontSize: '30px'
        }}>Employer Registration</h2>

      <form onSubmit={handleSubmit} className="register-form" encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Contact Person Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
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
          minLength={6}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
        />
        <input
          type="date"
          name="establishedDate"
          value={formData.establishedDate}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        {/* Added visible label for file input */}
        <label
          htmlFor="companyCertificate"
          style={{
            fontWeight: '700',
            fontSize: '16px',
            marginTop: '15px',
            marginBottom: '6px',
            display: 'block',
            color: '#333',
            fontFamily: 'monospace',
          }}
        >
          Company Certificate
        </label>

        <input
          id="companyCertificate"
          type="file"
          name="companyCertificate"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            position: 'relative',marginTop:'12px',
            paddingRight: loading ? '30px' : undefined,
          }}
        >
          {loading ? (
            <>
              Registering
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: '8px',
                  width: '16px',
                  height: '16px',
                  border: '2px solid #fff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  verticalAlign: 'middle',
                }}
              />
              ...
            </>
          ) : (
            "Register"
          )}
        </button>
      </form>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}

      {/* Inline keyframes for spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
          
          body {
          margin: 0;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: #000000ff;
          color: #333;
          min-height: 130vh;
}
        `}
      </style>
    </div>
  );
}
