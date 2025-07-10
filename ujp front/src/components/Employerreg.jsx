import React, { useState } from "react";
import './component.css';

// Example registerUser API function with FormData support for file upload
async function registerUser(formData) {
  const response = await fetch('http://localhost:5000/api/users/register?role=employer', {
    method: 'POST',
    // 'Content-Type' not set because we're sending FormData (browser sets it automatically)
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
    companyCertificate: null,
    location: "",
    establishedDate: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    // Prepare FormData to send file and other fields
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", "employer"); // role still sent in form data if needed by backend
    data.append("companyName", formData.companyName);
    data.append("location", formData.location);
    data.append("establishedDate", formData.establishedDate);
    if (formData.companyCertificate) {
      data.append("companyCertificate", formData.companyCertificate);
    }

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
          marginBottom: '50px',
          fontFamily: 'monospace',
          fontSize: '30px'
        }}>Employer Registration</h2>
        
      <form onSubmit={handleSubmit} className="register-form">
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
        <label className="file-label">
          Upload Company Certificate (PDF)
          <input
            type="file"
            name="companyCertificate"
            accept=".pdf"
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
}
