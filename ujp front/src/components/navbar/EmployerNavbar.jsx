import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

const navLinkStyle = {
  textDecoration: 'none',
  margin: '0 10px',
  padding: '10px 25px',
  borderRadius: '50px',
  fontWeight: 'bold',
  transition: '0.3s',
  color: 'white',
};

function EmployerNavbar() {
  const { role, logout } = useContext(AuthContext);
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
        fontFamily: 'monospace',
      }}
    >
      <img src="/logo.png" height="80px" width="110px" alt="Logo" />
      <div>
        {role === 'employer' && (
          <>
            <Link to="/postjob" style={navLinkStyle}>POST JOB</Link>
            <Link to="/applications" style={navLinkStyle}>APPLICATIONS</Link>
          </>
        )}
        {role && (
          <button onClick={handleLogout} style={navLinkStyle}>LOG OUT</button>
        )}
      </div>
    </div>
  );
}

export default EmployerNavbar;
