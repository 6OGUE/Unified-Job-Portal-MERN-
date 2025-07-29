import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // Log what's being sent
      console.log('Frontend: Sending login request with:', { email, password });

      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      // Log the full response received from the backend
      console.log('Frontend: Received response data:', data);

      if (!response.ok) {
        setMessage(data.message || 'Login failed');
        console.log('Frontend: Login failed according to response.ok:', data.message);
        return;
      }

      // Save token and update context with role
      localStorage.setItem('token', data.token);
      login(data.user.role);

      // Log the role extracted and compare it to expected values
      const userRole = data.user.role;
      console.log('Frontend: Role extracted for redirection logic:', userRole);

      // Redirect based on role
      if (userRole === 'employer') {
        console.log('Frontend: Role is employer, navigating to /employer-dashboard');
        navigate('/employer-dashboard');
      } else if (userRole === 'employee' || userRole === 'job seeker') {
        console.log('Frontend: Role is employee/job seeker, navigating to /employee-dashboard');
        navigate('/employee-dashboard');
      } else if (userRole === 'admin') {
        console.log('Frontend: Role is admin, navigating to /admin/dashboard');
        navigate('/admin/dashboard');
      } else {
        setMessage('Unknown user role: ' + userRole);
        console.log('Frontend: Unknown user role encountered:', userRole);
      }

    } catch (error) {
      setMessage('Error: ' + error.message);
      console.error('Frontend: Error during login fetch:', error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '210vh',
      backgroundColor: '#f0f4f8',
      fontFamily: 'Arial, sans-serif'
    }}>
      <form onSubmit={handleSubmit} style={{ width: '320px',position:'relative',marginBottom:'1000px' }}>
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
