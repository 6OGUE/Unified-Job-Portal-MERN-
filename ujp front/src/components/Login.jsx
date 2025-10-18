import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth(); // ✅ correct usage

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

      // ✅ single clean login call
      login(data.token, data.user);

      // ✅ navigate based on role
      const userRole = data.user.role;
      if (userRole === 'employer') {
        navigate('/employer-dashboard');
      } else if (userRole === 'employee' || userRole === 'job seeker') {
        navigate('/employee-dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setMessage('Unknown user role: ' + userRole);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        backgroundColor: '#000000ff',
        fontFamily: 'Arial, sans-serif',
        color:"white",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ width: '320px', position: 'relative' }}
      >
        <h2 style={{ marginBottom: '10px', color: '#ffffffff', textAlign: 'center' }}>
          Log-in
        </h2>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src="/icons/user.png"
            alt="User Icon"
            style={{ width: '80px', height: '80px' }}
          />
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
            fontSize: '16px',
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
            fontSize: '16px',
          }}
        />

        <button
          type="submit"
          style={{
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
            margin: '0 auto',
          }}
        >
          Login
        </button>

        {message && (
          <p
            style={{
              marginTop: '10px',
              color: 'red',
              textAlign: 'center',
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;
