import React, { useState } from "react";
import './component.css'; // Ensure your main CSS file is imported

async function registerUser(formData) {
  try {
    const response = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      body: formData,
    });

    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      const errorData = await response.json(); // Attempt to read error message from backend
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json(); // Parse JSON on success
  } catch (error) {
    console.error("Error during registerUser fetch:", error);
    throw error; // Re-throw the error to be caught by the handleSubmit's try-catch
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
    setMessage(""); // Clear previous messages
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setMessage("Error: Passwords do not match!");
      setLoading(false);
      return;
    }

    if (!certificateFile) {
      setMessage("Error: Please upload a company certificate file.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", "employer"); // This is crucial for distinguishing roles on the backend
    data.append("companyName", formData.companyName);
    data.append("location", formData.location);
    data.append("establishedDate", formData.establishedDate);
    data.append("companyCertificate", certificateFile);

    try {
      const result = await registerUser(data);
      setMessage(result.message || "Registration successful!"); // Positive message on success
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Error: " + (error.message || "An unexpected error occurred during registration."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 style={{
        marginBottom: '50px',
        marginLeft: '70px',
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
            position: 'relative', marginTop: '12px',
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
      {message && (
        <p className="message" style={{
          color: message.startsWith("Error") ? 'red' : 'green',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          {message}
        </p>
      )}

      {/* Inline keyframes for spinner animation. Global styles like body should be in component.css. */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}