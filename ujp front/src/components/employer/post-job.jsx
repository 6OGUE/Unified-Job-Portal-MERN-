import React, { useState } from 'react';

const PostJob = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    title: '',
    description: '',
    salary: '',
    location: '',
    education: '', // Changed from 'qualification' to 'education'
    additionalQualification: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      // Prepare the data to match the expected format
      const jobData = {
        ...formData,
        education: [formData.education], // Convert to array as expected by the backend
        additionalQualification: formData.additionalQualification 
          ? formData.additionalQualification.split(',').map(qual => qual.trim()) 
          : []
      };

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      const text = await res.text();
      let data = null;
      if (text) {
        data = JSON.parse(text);
      }

      if (res.ok) {
        alert('Job posted successfully!');
        setFormData({
          companyName: '',
          title: '',
          description: '',
          salary: '',
          location: '',
          education: '',
          additionalQualification: ''
        });
      } else {
        alert(data?.message || 'Failed to post job');
      }
    } catch (err) {
      console.error(err);
      alert('Server error while posting job');
    }
  };

  const formStyle = {
    maxWidth: '700px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1.5px solid #ccc',
    fontSize: '17px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    fontSize: '18px',
    color: '#333',
  };

  const radioLabelStyle = {
    display: 'inline-block',
    marginRight: '25px',
    fontSize: '16px',
    color: '#444',
    cursor: 'pointer',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '15px 30px',
    fontSize: '18px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 3px 8px rgba(0, 123, 255, 0.4)',
    transition: 'background-color 0.3s',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  const [hover, setHover] = React.useState(false);

  // Education levels matching the user schema
  const educationLevels = [
    { value: 'Matriculation', label: 'Matriculation' },
    { value: 'Higher Secondary', label: 'Higher Secondary' },
    { value: 'Graduation', label: 'Graduation' },
    { value: 'Postgraduation', label: 'Postgraduation' }
  ];

  return (
    <div style={{ minHeight: '160vh', backgroundColor: '#fff', paddingTop: '40px', paddingBottom: '40px' }}>
      <form
        onSubmit={handleSubmit}
        style={formStyle}
        autoComplete="off"
      >
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '30px',
          color: '#333',
          textAlign: 'center',
          fontFamily: 'monospace',
        }}>
          Post Job
        </h1>

        <input
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#007bff'}
          onBlur={e => e.target.style.borderColor = '#ccc'}
        />
        
        <input
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#007bff'}
          onBlur={e => e.target.style.borderColor = '#ccc'}
        />
        
        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={textareaStyle}
          onFocus={e => e.target.style.borderColor = '#007bff'}
          onBlur={e => e.target.style.borderColor = '#ccc'}
        />
        
        <input
          name="salary"
          placeholder="Salary Range (e.g., $50,000 - $70,000)"
          value={formData.salary}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#007bff'}
          onBlur={e => e.target.style.borderColor = '#ccc'}
        />
        
        <input
          name="location"
          placeholder="Job Location"
          value={formData.location}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#007bff'}
          onBlur={e => e.target.style.borderColor = '#ccc'}
        />

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Minimum Education Required:</label>
          <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px', fontSize: '14px', color: '#666' }}>
            <strong>Note:</strong> Candidates with this education level or higher will be able to see and apply for this job.
          </div>
          {educationLevels.map((level) => (
            <label key={level.value} style={radioLabelStyle}>
              <input
                type="radio"
                name="education"
                value={level.value}
                checked={formData.education === level.value}
                onChange={handleChange}
                required
                style={{ marginRight: '8px', cursor: 'pointer' }}
              />
              {level.label}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Additional Skills/Qualifications:</label>
          <input
            name="additionalQualification"
            placeholder="e.g., JavaScript, React, Node.js (separate with commas)"
            value={formData.additionalQualification}
            onChange={handleChange}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#007bff'}
            onBlur={e => e.target.style.borderColor = '#ccc'}
          />
          <div style={{ fontSize: '14px', color: '#666', marginTop: '-15px', marginBottom: '20px' }}>
            Optional: List specific skills or additional qualifications (separated by commas)
          </div>
        </div>

        <div style={{ marginLeft: '0px' }}>
          <button
            type="submit"
            style={
              hover
                ? { width: '700px', ...buttonStyle, ...buttonHoverStyle }
                : { width: '700px', ...buttonStyle }
            }
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;