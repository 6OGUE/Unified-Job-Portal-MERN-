import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinkStyle = {
  textDecoration: 'none',
  margin: '0 10px',
  padding: '10px 25px',
  borderRadius: '50px',
  fontWeight: 'bold',
  transition: '0.3s',
  color: 'white',
};

const logoutButtonStyle = {
  ...navLinkStyle,
};

function EmployeeNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      style={{
        backgroundColor: '#333',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '60px',
        fontSize: '20px',
        fontFamily: 'monospace'
      }}
    >
      
        <img src="/logo.png" height="80px" width="110px" alt="Logo" />
      
      <div>
        <Link to="/home" style={navLinkStyle}>HOME</Link>
        <Link to="/employee/profile" style={navLinkStyle}>PROFILE</Link>
        <Link to="/employee/viewjobs" style={navLinkStyle}>JOBS</Link>
        <Link to="/employee/applications" style={navLinkStyle}>MY APPLICATIONS</Link>

        <button onClick={handleLogout} style={logoutButtonStyle}>
          LOGOUT
        </button>
      </div>
    </div>
  );
}

export default EmployeeNavbar;