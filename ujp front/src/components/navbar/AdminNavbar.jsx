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

function Navbar() {
  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
  logout();       // <-- use logout from AuthContext here
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
      <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}></div>
      <div>
        {role === 'admin' && (
          <>
            <Link to="/admin/employers" style={navLinkStyle}>EMPLOYERS</Link>
            <Link to="/admin/employees" style={navLinkStyle}>SEEKERS</Link>
            <Link to="/admin/requests" style={navLinkStyle}>REQUESTS</Link>
            <Link to="/admin/reports" style={navLinkStyle}>REPORTS</Link> {/* Added Reports tab */}
          </>
        )}
        {role && (
          <button onClick={handleLogout} style={navLinkStyle}>LOG OUT</button>
        )}
      </div>
    </div>
  );
}

export default Navbar;