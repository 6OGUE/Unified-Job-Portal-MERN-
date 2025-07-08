import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
  const [selectedRole, setSelectedRole] = useState('');

  const handleSelect = (role) => {
    setSelectedRole(role);
    alert(`You selected: ${role}`);
  };

  const circleStyle = (role) => ({
    height: '260px',
    width: '250px',
    borderRadius: '50%',
    backgroundColor: selectedRole === role ? '#007bff' : '#e0e0e0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: selectedRole === role ? '0 8px 24px rgba(0, 123, 255, 0.5)' : '0 4px 12px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    transition: '0.3s',
    border: selectedRole === role ? '3px solid #0056b3' : '3px solid transparent'
  });

  const textStyle = {
    marginTop: '12px',
    fontWeight: '600',
    fontSize: '28px',
    color: '#333',
    textAlign: 'center'
  };

  return (
    <div
      style={{
        minHeight: '88vh',
        margin: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#f7f9fb',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* Title */}
      <h1
        style={{
          marginBottom: '50px',
          fontFamily: 'monospace',
          fontSize: '30px'
        }}
      >
        Select Type
      </h1>

      {/* Role Options */}
      <div style={{ display: 'flex', gap: '100px' }}>
        {/* Employer Option */}
        <Link to="/Employerreg" style={{ textAlign: 'center', textDecoration: 'none' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={circleStyle('Employer')}>
            <img src="/icons/employer.png" alt="Employer" style={{ width: '120px', height: '120px' }} />
          </div>
          <div style={textStyle}>Employer</div>
        </div>
        </Link>

        {/* Employee Option */}
        <Link to="/Employeereg" style={{ textAlign: 'center', textDecoration: 'none' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={circleStyle('Employee')}>
              <img src="/icons/employee.png" alt="Employee" style={{ width: '120px', height: '120px' }} />
            </div>
            <div style={textStyle}>Employee</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Register;
