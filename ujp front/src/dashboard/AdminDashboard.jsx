import React from 'react';

const AdminDashboard = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
      textAlign: 'center'
    }}>
      <img 
        src="/adminicon.png" 
        alt="Admin Icon" 
        style={{ width: '100px', marginBottom: '20px' }}
      />
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin. You have full control here.</p>
    </div>
  );
};

export default AdminDashboard;
