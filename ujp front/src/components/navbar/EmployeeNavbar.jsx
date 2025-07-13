import React from 'react';
import { Link } from 'react-router-dom';

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
  return (
    <div
      style={{
        backgroundColor: '#333',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '60px',
        fontSize:'20px',
        fontFamily:'monospace'
      }}
    >
      <img src="/logo.png" height="80px" width="110px" alt="Logo" />
      <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}></div>
      <div>
        <Link to="/inbox" style={navLinkStyle}>INBOX</Link>
        <Link to="/edit" style={navLinkStyle}>EDIT</Link>
        <Link to="/history" style={navLinkStyle}>HISTORY</Link>
        <Link to="/logout" style={navLinkStyle}>LOG OUT</Link>

      </div>
    </div>
  );
}

export default Navbar;
