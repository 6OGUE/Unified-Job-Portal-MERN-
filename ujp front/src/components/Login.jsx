import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Login failed');
        return;
      }

      // Save token and role to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);

      // Redirect based on role
      if (data.user.role === 'employer') {
        navigate('/employer-dashboard');
      } else if (data.user.role === 'employee') {
        navigate('/employee-dashboard');
      } else {
        setMessage('Unknown user role');
      }

    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '88vh',
      backgroundColor: '#f0f4f8',
      fontFamily: 'Arial, sans-serif'
    }}>
      <form onSubmit={handleSubmit} style={{ width: '320px' }}>
        <h2 style={{ marginBottom: '10px', color: '#333', textAlign: 'center' }}>Log-in</h2>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src="/icons/user.png" alt="User Icon" style={{ width: '80px', height: '80px' }} />
        </div>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '30px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />
        <button type="submit" style={{
          width: '70%',
          padding: '12px',
          backgroundColor: '#007bff',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          display: 'block',
          margin: '0 auto'
        }}>
          Login
        </button>
        {message && <p style={{ marginTop: '10px', color: 'red', textAlign: 'center' }}>{message}</p>}
      </form>
    </div>
  );
}

export default Login;
