import React, { useState } from "react";
import './component.css';


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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle form submission logic here
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
