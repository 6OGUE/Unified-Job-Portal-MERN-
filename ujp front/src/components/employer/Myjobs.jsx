import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // ✅ Toastify
import 'react-toastify/dist/ReactToastify.css';

const EmployerJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null); // ✅ NEW: store job id to delete

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('http://localhost:5000/api/jobs/my-jobs', config);
        setJobs(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  const handleViewDetails = (job) => setSelectedJob(job);
  const closeModal = () => setSelectedJob(null);

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing.');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/jobs/${jobToDelete}`, config);

      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobToDelete));
      toast.success('Job removed successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete the job. Please try again.');
    } finally {
      setJobToDelete(null); // Close confirmation modal
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '1rem' }}>
        <div style={{ textAlign: 'center', color: '#374151', fontSize: '1.125rem' }}>
          Loading your posted jobs...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#fef2f2', padding: '1rem' }}>
        <div style={{ textAlign: 'center', color: '#b91c1c', backgroundColor: '#fee2e2', border: '1px solid #f87171', borderRadius: '0.5rem', padding: '1.5rem' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Error:</p>
          <p>{error}</p>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#dc2626' }}>Please ensure you are logged in as an employer.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1f2937', marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'monospace' }}>
        My Jobs
      </h1>

      {jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 0', color: '#4b5563', fontSize: '1.125rem' }}>
          <img src="/empty.png" alt="No jobs" style={{ width: '150px', marginBottom: '1rem', opacity: 0.7 }} />
          <p style={{ marginBottom: '1rem' }}>You haven't posted any jobs yet.</p>
          <p>Start by creating a new job listing!</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: '100%', borderCollapse: 'collapse', backgroundColor: '#f9fafb' }}>
            <thead style={{ backgroundColor: '#eef2ff' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Job Title</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Salary</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#fff' }}>
              {jobs.map((job) => (
                <tr key={job._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>{job.title}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#374151' }}>{job.companyName}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#374151' }}>{job.location}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>{job.salary}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleViewDetails(job)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.875rem',
                          borderRadius: '0.375rem',
                          backgroundColor: '#4f46e5',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => setJobToDelete(job._id)} // ✅ Open modal
                        style={{
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.875rem',
                          borderRadius: '0.375rem',
                          backgroundColor: '#dc2626',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Custom Delete Confirmation Modal */}
      {jobToDelete && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(75, 85, 99, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', padding: '2rem', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Are you sure?</h2>
            <p style={{ color: '#374151', marginBottom: '1.5rem' }}>Do you really want to delete this job? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={() => setJobToDelete(null)}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#4f46e5', // Blue button
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#dc2626', // Red button
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(75, 85, 99, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '28rem', margin: 'auto', padding: '2rem', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#6b7280', cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.5rem' }} aria-label="Close">×</button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>{selectedJob.title}</h2>
            <div style={{ color: '#374151' }}>
              <p><strong>Company:</strong> {selectedJob.companyName}</p>
              <p><strong>Location:</strong> {selectedJob.location}</p>
              <p><strong>Salary:</strong> {selectedJob.salary}</p>
              <p><strong>Qualification:</strong> {selectedJob.education}</p>
              <p><strong>Additional Qualification:</strong> {selectedJob.additionalQualification?.join(', ') || 'None'}</p>
              <p><strong>Description:</strong> {selectedJob.description}</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Posted on: {new Date(selectedJob.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default EmployerJobsPage;
