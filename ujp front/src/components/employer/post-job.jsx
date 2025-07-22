import React, { useState } from 'react';

const PostJob = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    title: '',
    description: '',
    salary: '',
    location: '',
    qualification: '',
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
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
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
          qualification: '',
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

  return (
    <div style={{ minHeight: '110vh', backgroundColor: '#fff', paddingTop: '40px', paddingBottom: '40px' }}>
      <form
        onSubmit={handleSubmit}
        style={formStyle}
        autoComplete="off"
      >
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '30px',
          color: '#f8f8f8ff',
          textAlign: 'center',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#007bff'}
          onBlur={e => e.target.style.borderColor = '#ccc'}
        />
        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#007bff'}
          onBlur={e => e.target.style.borderColor = '#ccc'}
        />

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Minimum Qualification:</label>
          {['matriculation', 'higher secondary', 'graduation', 'post graduation'].map((q) => (
            <label key={q} style={radioLabelStyle}>
              <input
                type="radio"
                name="qualification"
                value={q}
                checked={formData.qualification === q}
                onChange={handleChange}
                required
                style={{ marginRight: '8px', cursor: 'pointer' }}
              />
              {q.charAt(0).toUpperCase() + q.slice(1)}
            </label>
          ))}
        </div>

        <input
          name="additionalQualification"
          placeholder="Additional Qualification (optional)"
          value={formData.additionalQualification}
          onChange={handleChange}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#007bff'}
          onBlur={e => e.target.style.borderColor = '#ccc'}
        />

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
