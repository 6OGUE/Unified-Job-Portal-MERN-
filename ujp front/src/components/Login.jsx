import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '88vh',
      backgroundColor: '#f0f4f8', // default bg
      fontFamily: 'Arial, sans-serif'
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '320px'
      }}>
        <h2 style={{ marginBottom: '10px', color: '#333', textAlign: 'center' }}>Log-in</h2>

        {/* 👤 User Icon */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src="/icons/user.png"
            alt="User Icon"
            style={{ width: '80px', height: '80px' }}
          />
        </div>

        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}></label>
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

        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}></label>
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
          margin: '0 auto' // centers the button
        }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
