import React from 'react';
import { FaXTwitter } from "react-icons/fa6";

const socialLinkStyle = {
  margin: '5px',
  display: 'inline-block',
};

const iconStyle = {
  width: '32px',
  height: '32px',
};

function Footer() {
  return (
    <div style={{ backgroundColor: '#222', color: '#ccc', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        
        <div style={{ flex: '1 1 300px', marginBottom: '20px' }}>
          <h3 style={{ color: 'white' }}>Contact Us</h3>
          <p>Email: ujuproject@gmail.com</p>
          <p>Phone: +91 9876543210</p>
          <p>Address: 123, ABC Street, India</p>
        </div>

        <div style={{ flex: '1 1 200px', marginBottom: '20px', marginLeft: '400px' }}>
          <h3 style={{ color: 'white' }}>Follow Us</h3>
          <div style={{ marginTop: '10px' }}>
            <a href="#" style={socialLinkStyle}><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style={iconStyle} /></a>
            <a href="https://x.com" style={socialLinkStyle}><FaXTwitter style={{ ...iconStyle, fontSize: '28px', color: 'white' }} /></a>
            <a href="#" style={socialLinkStyle}><img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" style={iconStyle} /></a>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '30px', color: '#888' }}>
        &copy; 2025 UJP. All rights reserved.
      </div>
    </div>
  );
}

export default Footer;
