import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Make sure this path is correct

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
      <Link to="/">
        <img src="/logo.png" height="80px" width="110px" alt="Logo" />
      </Link>

      <div>
        <Link to="/employee/profile" style={navLinkStyle}>PROFILE</Link>
        {/* This is the link to the ViewJobs component */}
        <Link to="/employee/viewjobs" style={navLinkStyle}>JOBS</Link>
        <Link to="/employee/appliedjobs" style={navLinkStyle}>HISTORY</Link>

        <button onClick={handleLogout} style={logoutButtonStyle}>
          LOGOUT
        </button>
      </div>
    </div>
  );
}

export default EmployeeNavbar;
