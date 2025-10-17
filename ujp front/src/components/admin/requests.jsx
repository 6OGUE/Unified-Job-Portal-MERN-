import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminEmployerReview = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending temporary employers
  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const res = await axios.get('/api/admin/temporary-list');
        setEmployers(res.data);
      } catch (err) {
        console.error('Error fetching temporary employers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployers();
  }, []);

  // Approve handler
  const handleApprove = async (id) => {
    try {
      await axios.post(`/api/admin/temporary-list/approve/${id}`);
      setEmployers(prev => prev.filter(emp => emp._id !== id));
    } catch (err) {
      console.error('Error approving employer:', err);
    }
  };

  // Reject handler
  const handleReject = async (id) => {
  try {
    // This call deletes the employer from the database
    await axios.post(`/api/admin/temporary-list/reject/${id}`);

    // This now correctly removes the employer from the UI list
    setEmployers(prev => prev.filter(emp => emp._id !== id));

  } catch (err) {
    console.error('Error rejecting employer:', err);
  }
};

  // ✅ Open certificate in a new browser tab
  const handleViewCertificate = (filePath) => {
    if (!filePath) return alert("No certificate uploaded.");

    // Prepend backend URL if relative path
    const certificateUrl = filePath.startsWith('http')
      ? filePath
      : `http://localhost:5000${filePath}`;

    window.open(certificateUrl, '_blank');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Pending Employer Approvals</h2>
      {employers.length === 0 ? (
        <p>No pending employers.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {employers.map(emp => (
            <li
              key={emp._id}
              style={{
                border: '1px solid #ccc',
                margin: '10px 0',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <p><strong>Name:</strong> {emp.name}</p>
              <p><strong>Email:</strong> {emp.email}</p>
              <p><strong>Company:</strong> {emp.companyName}</p>
              <p><strong>Location:</strong> {emp.location}</p>
              <p><strong>Status:</strong> {emp.status}</p>

              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => handleViewCertificate(emp.certificateFilePath)}
                  style={{
                    marginRight: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '6px 10px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  View Certificate
                </button>

                <button
                  onClick={() => handleApprove(emp._id)}
                  style={{
                    marginRight: '10px',
                    backgroundColor: 'green',
                    color: 'white',
                    padding: '6px 10px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(emp._id)}
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '6px 10px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminEmployerReview;
