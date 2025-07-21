import React, { useState } from "react";
import './component.css';

async function registerUser(data) {
  const response = await fetch('http://localhost:5000/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),  // Send JSON, not FormData
  });
  return response.json();
}

export default function Employeereg() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    const data = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "employee",
    };

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
        marginBottom: '50px',marginLeft:'70px',
        fontFamily: 'monospace',
        fontSize: '30px'
      }}>Employee Registration</h2>

      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
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
        /><br></br>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
}
