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
        await axios.post(`/api/admin/temporary-list/reject/${id}`);
        setEmployers(prev =>
            prev.map(emp =>
            emp._id === id ? { ...emp, status: 'rejected' } : emp
            )
        );
        } catch (err) {
        console.error('Error rejecting employer:', err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
        <h2>Pending Employer Approvals</h2>
        {employers.length === 0 ? (
            <p>No pending employers.</p>
        ) : (
            <ul>
            {employers.map(emp => (
                <li key={emp._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <p><strong>Name:</strong> {emp.name}</p>
                <p><strong>Email:</strong> {emp.email}</p>
                <p><strong>Company:</strong> {emp.companyName}</p>
                <p><strong>Location:</strong> {emp.location}</p>
                <p><strong>Status:</strong> {emp.status}</p>
                <button onClick={() => handleApprove(emp._id)} style={{ marginRight: '10px' }}>
                    Approve
                </button>
                <button onClick={() => handleReject(emp._id)} style={{ backgroundColor: 'red', color: 'white' }}>
                    Reject
                </button>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
    };

    export default AdminEmployerReview;
