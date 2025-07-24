import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
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

function Navbar() {
  const { role, logout } = useContext(AuthContext);

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
        {!role && (
          <>
            <Link to="/" style={navLinkStyle}>HOME</Link>
            <Link to="/register" style={navLinkStyle}>REGISTER</Link>
            <Link to="/login" style={navLinkStyle}>LOGIN</Link>
          </>
        )}

        {role === 'job seeker' && (
          <>
            <Link to="/jobs" style={navLinkStyle}>FIND JOBS</Link>
            <Link to="/profile" style={navLinkStyle}>PROFILE</Link>
            <Link to="/login" onClick={logout} style={navLinkStyle}>LOGOUT</Link>
          </>
        )}

        {role === 'employer' && (
          <>
            <Link to="/employer/dashboard" style={navLinkStyle}>DASHBOARD</Link>
            <Link to="/employer/post-job" style={navLinkStyle}>POST JOB</Link>
            <Link to="/login" onClick={logout} style={navLinkStyle}>LOGOUT</Link>
          </>
        )}
        
        {role === 'admin' && (
          <>
            <Link to="/admin/dashboard" style={navLinkStyle}>ADMIN PANEL</Link>
            <Link to="/login" onClick={logout} style={navLinkStyle}>LOGOUT</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;