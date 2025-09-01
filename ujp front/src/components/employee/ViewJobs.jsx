import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styles object for the new sidebar and its components
const styles = {
  filterButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '1.5rem',
  },
  openFilterButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#f0f9ff',
    color: '#0c4a6e',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease-in-out',
  },
  filterSidebar: {
    height: '100%',
    width: '350px',
    position: 'fixed',
    top: 0,
    right: 0,
    backgroundColor: '#ffffff',
    boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease-in-out',
  },
  sidebarOpen: {
    transform: 'translateX(0)',
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '10px',
  },
  sidebarTitle: {
    margin: 0,
    fontSize: '1.25rem',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    cursor: 'pointer',
    color: '#9ca3af',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  filterLabel: {
    fontWeight: 600,
    fontSize: '0.9em',
    color: '#4b5563',
  },
  filterSelect: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
  },
  applyFiltersBtn: {
    padding: '12px 15px',
    marginTop: '20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#2563eb',
    color: 'white',
    fontWeight: 700,
    fontSize: '1rem',
    transition: 'background-color 0.2s',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
  },
  overlayVisible: {
    opacity: 1,
    visibility: 'visible',
  },
};

// The new FilterComponent, now styled as a sidebar using the styles object
const FilterComponent = ({ isOpen, onClose, onFilterChange }) => {
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');

  const handleApplyFilters = () => {
    onFilterChange({ location, role, salary });
    onClose();
  };

  return (
    <>
      <div 
        style={{ ...styles.overlay, ...(isOpen ? styles.overlayVisible : {}) }} 
        onClick={onClose}
      ></div>
      <div style={{ ...styles.filterSidebar, ...(isOpen ? styles.sidebarOpen : {}) }}>
        <div style={styles.sidebarHeader}>
          <h3 style={styles.sidebarTitle}>Filters</h3>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>
        <div style={styles.filterGroup}>
          <label htmlFor="locationFilter" style={styles.filterLabel}>Location:</label>
          <select id="locationFilter" value={location} onChange={(e) => setLocation(e.target.value)} style={styles.filterSelect}>
            <option value="">All Cities</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="Chennai">Chennai</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Gurgaon">Gurgaon</option>
            <option value="Kochi">Kochi</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label htmlFor="roleFilter" style={styles.filterLabel}>Job Role:</label>
          <select id="roleFilter" value={role} onChange={(e) => setRole(e.target.value)} style={styles.filterSelect}>
            <option value="">All Roles</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Product Manager">Product Manager</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="QA Engineer">QA Engineer</option>
            <option value="Business Analyst">Business Analyst</option>
            <option value="Cloud Architect">Cloud Architect</option>
            <option value="Machine Learning Engineer">Machine Learning Engineer</option>
            <option value="Project Manager">Project Manager</option>
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label htmlFor="salaryFilter" style={styles.filterLabel}>Salary (LPA):</label>
          <select id="salaryFilter" value={salary} onChange={(e) => setSalary(e.target.value)} style={styles.filterSelect}>
            <option value="">All Salaries</option>
            <option value="lt7">Less than 7 LPA</option>
            <option value="7-15">7 LPA to 15 LPA</option>
            <option value="gt15">15 LPA+</option>
          </select>
        </div>
        <button onClick={handleApplyFilters} style={styles.applyFiltersBtn}>Apply Filters</button>
      </div>
    </>
  );
};


// Your original ConfirmationModal component
const ConfirmationModal = ({ isOpen, onConfirm, onCancel, job }) => {
  if (!isOpen) return null;
  const hasAdditionalQualifications =
    Array.isArray(job.additionalQualification) && job.additionalQualification.length > 0;
  return (
    <div style={{ position: 'fixed', inset: '0', backgroundColor: 'rgba(26, 32, 44, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: '100' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxWidth: '28rem', width: '100%', padding: '2rem', position: 'relative' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a202c', marginBottom: '1rem' }}>
          Confirm Application
        </h2>
        {hasAdditionalQualifications && (
          <div style={{ backgroundColor: '#fffbea', color: '#b7791f', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1rem', fontWeight: '600', fontSize: '1rem', border: '1px solid #f6e05e' }}>
            <h3 style={{ fontFamily: 'monospace' }}>NOTE:</h3>
            <span style={{ fontFamily: 'monospace' }}>This job requires certain additional qualifications to be considered. Make sure you have those and have uploaded them in your profile before you continue.</span>
          </div>
        )}
        <p style={{ fontSize: '1rem', color: '#4a5568', marginBottom: '1.5rem' }}>
          Are you sure you want to apply for "<strong>{job.title}</strong>" at "<strong>{job.companyName}</strong>"?
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onCancel} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f7fafc', cursor: 'pointer', fontWeight: '600', color: '#4a5568', transition: 'all 200ms ease-in-out' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#edf2f7'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#059669', color: '#ffffff', cursor: 'pointer', fontWeight: '700', transition: 'all 200ms ease-in-out' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#047857'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#059669'}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};


function ViewJobs() {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [jobToApply, setJobToApply] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [jobToReport, setJobToReport] = useState(null);
  const [reportDescription, setReportDescription] = useState('');
  

  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchEmployeeDataAndJobs = async () => {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }
      try {
        const userResponse = await fetch('/api/users/profile', { headers: { 'Authorization': `Bearer ${token}` } });
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.message || `Failed to fetch user profile: ${userResponse.status}`);
        }
        const userData = await userResponse.json();
        if (userData.role !== 'employee') {
          setError('Access denied. This page is for employees only.');
          setLoading(false);
          return;
        }
        if (!userData.education) {
          setError('Please update your education level in your profile to view relevant jobs.');
          setLoading(false);
          return;
        }
        setEmployeeData(userData);
        const jobsResponse = await fetch('/api/jobs', { headers: { 'Authorization': `Bearer ${token}` } });
        if (!jobsResponse.ok) {
          const errorData = await jobsResponse.json();
          throw new Error(errorData.message || `Failed to fetch jobs: ${jobsResponse.status}`);
        }
        const jobsData = await jobsResponse.json();
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (err) {
        setError(`Error: ${err.message}`);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeDataAndJobs();
  }, []);

  const handleFilterChange = (filters) => {
    let tempJobs = [...jobs];
    if (filters.location) {
      tempJobs = tempJobs.filter(job => 
        job.location && job.location.toLowerCase() === filters.location.toLowerCase()
      );
    }
    if (filters.role) {
      tempJobs = tempJobs.filter(job => job.title === filters.role);
    }
    if (filters.salary) {
      tempJobs = tempJobs.filter(job => {
        const salaryValue = parseFloat(job.salary);
        if (isNaN(salaryValue)) return false;
        switch (filters.salary) {
          case 'lt7':
            return salaryValue < 700000;
          case '7-15':
            return salaryValue >= 700000 && salaryValue <= 1500000;
          case 'gt15':
            return salaryValue > 1500000;
          default:
            return true;
        }
      });
    }
    setFilteredJobs(tempJobs);
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowPreview(true);
  };

  const handleApplyJobClick = (job) => {
    setJobToApply(job);
    setShowConfirmModal(true);
  };

  const handleConfirmApply = async () => {
    setShowConfirmModal(false);
    if (!jobToApply) return;
    const job = jobToApply;
    const token = getToken();
    if (!token) {
      toast.error('You must be logged in to apply for jobs.');
      return;
    }
    if (!employeeData || !employeeData._id || !employeeData.name) {
      toast.error('Employee data not available. Cannot apply.');
      return;
    }
    try {
      const applicationData = { jobId: job._id, jobTitle: job.title, companyName: job.companyName };
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(applicationData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      toast.success(`Successfully applied for "${job.title}" at "${job.companyName}"!`, { position: "top-center" });
      console.log('Application successful:', result);
    } catch (err) {
      toast.error(`Failed to apply for job: ${err.message}`);
      console.error('Error applying for job:', err);
    }
  };

  const handleReportJobClick = (job) => {
    setJobToReport(job);
    setReportDescription('');
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    if (!reportDescription.trim()) {
      toast.error('Please enter a description for your report.');
      return;
    }
    const token = getToken();
    if (!token) {
      toast.error('You must be logged in to report a job.');
      return;
    }
    try {
      const reportData = {
        jobId: jobToReport._id,
        jobTitle: jobToReport.title,
        companyName: jobToReport.companyName,
        description: reportDescription,
      };
      const response = await fetch('/api/jobs/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(reportData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      toast.success('Report submitted successfully!', { position: "top-center" });
      setShowReportModal(false);
    } catch (err) {
      toast.error(`Failed to submit report: ${err.message}`);
    }
  };

  if (loading) {
    return ( <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f7fafc' }}> <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4a5568' }}>Loading jobs and employee data...</div> </div> );
  }

  if (error) {
    return ( <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#fff5f5', color: '#c53030', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(197, 67, 67, 0.3)' }}> <div style={{ fontSize: '1.25rem', fontWeight: '600', textAlign: 'center', maxWidth: '500px' }}>{error}</div> </div> );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc', padding: '1rem 2rem', fontFamily: 'Inter, sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <div style={styles.filterButtonContainer}>
        <button style={styles.openFilterButton} onClick={() => setFilterOpen(true)}>
          Filter ☰
        </button>
      </div>

      <FilterComponent 
        isOpen={isFilterOpen}
        onClose={() => setFilterOpen(false)}
        onFilterChange={handleFilterChange}
      />

      <h1 style={{ fontSize: '1.5rem', fontWeight: '200', color: '#1a202c', marginBottom: '2rem', textAlign: 'center', fontFamily: 'monospace' }}>
        Jobs For You
      </h1>

      {filteredJobs.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#718096', fontSize: '1.125rem', marginTop: '3rem' }}>
          <img src="/empty.png" alt="No jobs" style={{ width: '150px', marginBottom: '1rem', opacity: 0.7 }} />
          <p>No jobs found matching your criteria.</p>
          {employeeData && employeeData.education && (
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#4a5568' }}>
              Your current education level: <strong>{employeeData.education}</strong>
            </p>
          )}
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#4a5568' }}>
            Jobs are filtered to show positions that match your education level or require lower qualifications.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem', marginTop: '1.5rem', justifyItems: 'center' }}>
          {filteredJobs.map(job => (
            <div key={job._id} style={{ backgroundColor: '#ffffff', borderRadius: '1rem', boxShadow: '0 6px 15px rgba(0, 0, 0, 0.07)', transition: 'box-shadow 250ms ease, transform 250ms ease', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '18rem', maxWidth: '720px', width: '100%', cursor: 'default' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ padding: '1.5rem 2rem', flexGrow: 1 }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2d3748', marginBottom: '0.5rem', textAlign: 'left' }}>{job.title}</h2>
                <h3 style={{ fontSize: '1.125rem', color: '#718096', marginBottom: '1rem', fontWeight: '500', textAlign: 'left' }}>{job.companyName}</h3>
                <div style={{ marginBottom: '0.85rem', textAlign: 'left' }}> <span style={{ fontWeight: '600', color: '#4b5568' }}>Education Required: </span> <span style={{ color: '#718096', fontSize: '0.9rem' }}>{Array.isArray(job.education) ? job.education.join(', ') : (job.education || 'Not specified')}</span> </div>
                <div style={{ marginBottom: '0.85rem', textAlign: 'left' }}> <span style={{ fontWeight: '600', color: '#4b5568' }}>Location: </span> <span style={{ color: '#718096', fontSize: '0.9rem' }}>{job.location || 'Not specified'}</span> </div>
                <div style={{ marginBottom: '0.85rem', textAlign: 'left' }}> <span style={{ fontWeight: '600', color: '#4b5568' }}>Salary: </span> <span style={{ color: '#718096', fontSize: '0.9rem' }}>{job.salary || 'Not specified'}</span> </div>
                {job.additionalQualification && job.additionalQualification.length > 0 && ( <div style={{ marginBottom: '0.85rem', textAlign: 'left' }}> <span style={{ fontWeight: '600', color: '#4b5568' }}>Additional Skills: </span> <span style={{ color: '#718096', fontSize: '0.9rem' }}>{job.additionalQualification.join(', ')}</span> </div> )}
              </div>
              <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', gap: '1rem', backgroundColor: '#f9fafb' }}>
                <button onClick={() => handleViewJob(job)} style={{ backgroundColor: '#2563eb', color: '#fff', fontWeight: '700', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', boxShadow: '0 3px 6px rgba(37, 99, 235, 0.4)', transition: 'background-color 250ms ease, box-shadow 250ms ease', userSelect: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1d4ed8'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(29, 78, 216, 0.6)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; e.currentTarget.style.boxShadow = '0 3px 6px rgba(37, 99, 235, 0.4)'; }}>
                  View Details
                </button>
                <button onClick={() => handleApplyJobClick(job)} style={{ backgroundColor: '#059669', color: '#fff', fontWeight: '700', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', boxShadow: '0 3px 6px rgba(5, 150, 105, 0.4)', transition: 'background-color 250ms ease, box-shadow 250ms ease', userSelect: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#047857'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(4, 120, 87, 0.6)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#059669'; e.currentTarget.style.boxShadow = '0 3px 6px rgba(5, 150, 105, 0.4)'; }}>
                  Apply Now
                </button>
                <button onClick={() => handleReportJobClick(job)} style={{ backgroundColor: '#f59e42', color: '#fff', fontWeight: '700', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', boxShadow: '0 3px 6px rgba(245, 158, 66, 0.4)', transition: 'background-color 250ms ease, box-shadow 250ms ease', userSelect: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d97706'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(217, 119, 6, 0.6)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f59e42'; e.currentTarget.style.boxShadow = '0 3px 6px rgba(245, 158, 66, 0.4)'; }}>
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPreview && selectedJob && (
        <div style={{ position: 'fixed', inset: '0', backgroundColor: 'rgba(26, 32, 44, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: '50' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxWidth: '32rem', width: '100%', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowPreview(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#a0aec0', fontSize: '1.875rem', fontWeight: '700', border: 'none', background: 'none', cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#2d3748')} onMouseLeave={(e) => (e.currentTarget.style.color = '#a0aec0')} aria-label="Close">
              &times;
            </button>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1a202c', marginBottom: '0.75rem' }}>
              {selectedJob.title}
            </h2>
            <h3 style={{ fontSize: '1.25rem', color: '#4a5568', marginBottom: '1.5rem' }}>{selectedJob.companyName}</h3>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: '600', color: '#2d3748' }}>Location:</p>
              <p style={{ color: '#718096' }}>{selectedJob.location || 'Not specified'}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: '600', color: '#2d3748' }}>Salary Range:</p>
              <p style={{ color: '#718096' }}>{selectedJob.salary || 'Not specified'}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: '600', color: '#2d3748' }}>Education Requirements:</p>
              <ul style={{ listStyleType: 'disc', listStylePosition: 'inside', color: '#718096' }}>
                {Array.isArray(selectedJob.education) && selectedJob.education.length > 0 ? (
                  selectedJob.education.map((edu, index) => <li key={index}>{edu}</li>)
                ) : (
                  <li>Not specified</li>
                )}
              </ul>
            </div>
            {Array.isArray(selectedJob.additionalQualification) && selectedJob.additionalQualification.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', color: '#2d3748' }}>Additional Qualifications:</p>
                <ul style={{ listStyleType: 'disc', listStylePosition: 'inside', color: '#718096' }}>
                  {selectedJob.additionalQualification.map((qual, index) => (
                    <li key={index}>{qual}</li>
                  ))}
                </ul>
              </div>
            )}
            <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
              <button onClick={() => handleApplyJobClick(selectedJob)} style={{ backgroundColor: '#059669', color: '#ffffff', fontWeight: '700', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', transition: 'background-color 200ms ease-in-out, box-shadow 200ms ease-in-out', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', border: 'none', cursor: 'pointer', userSelect: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#047857'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#059669'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'; }}>
                Apply for this Job
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirmModal && jobToApply && (
        <ConfirmationModal isOpen={showConfirmModal} onConfirm={handleConfirmApply} onCancel={() => setShowConfirmModal(false)} job={jobToApply} />
      )}
      {showReportModal && jobToReport && (
        <div style={{ position: 'fixed', inset: '0', backgroundColor: 'rgba(26, 32, 44, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: '100' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxWidth: '28rem', width: '100%', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowReportModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#a0aec0', fontSize: '1.875rem', fontWeight: '700', border: 'none', background: 'none', cursor: 'pointer' }} aria-label="Close">&times;</button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a202c', marginBottom: '1rem' }}>
              Report Job: {jobToReport.title}
            </h2>
            <textarea
              value={reportDescription}
              onChange={e => setReportDescription(e.target.value)}
              placeholder="Describe the issue with this job posting..."
              style={{ width: '100%', minHeight: '100px', borderRadius: '0.5rem', border: '1px solid #e2e8f0', padding: '0.75rem', fontSize: '1rem', marginBottom: '1.5rem', resize: 'vertical' }}
            />
            <div style={{ textAlign: 'right' }}>
              <button onClick={handleReportSubmit} style={{ backgroundColor: '#f59e42', color: '#fff', fontWeight: '700', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background-color 200ms ease-in-out' }}>
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewJobs;