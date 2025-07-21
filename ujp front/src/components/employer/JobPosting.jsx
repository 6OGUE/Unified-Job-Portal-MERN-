import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const educationOptions = [
  'Matriculation',
  'Higher Secondary',
  'Graduation',
  'Post Graduation',
  'PhD'
];

const JobPosting = () => {
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    requirement: [],
    extraCertifications: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      let updated = [...prev[field]];
      if (checked) updated.push(value);
      else updated = updated.filter(item => item !== value);
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      await axios.post(
        'http://localhost:5000/api/jobs/post',
        formData,
        config
      );
      alert('Job posted successfully!');
      setFormData({
        title: '',
        description: '',
        location: '',
        salary: '',
        requirement: [],
        extraCertifications: ''
      });
    } catch (error) {
      alert('Error posting job: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={formContainer}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
        <input
          type="text"
          name="extraCertifications"
          placeholder="Extra Certifications (comma-separated)"
          value={formData.extraCertifications}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <fieldset style={fieldsetStyle}>
  <legend style={legendStyle}>Requirements (Education):</legend>
  {educationOptions.map((edu) => (
    <label key={edu} style={checkboxLabel}>
      <input
        type="radio"
        name="requirement"        // same name groups radios
        value={edu}
        checked={formData.requirement === edu} // single value, not array
        onChange={(e) => setFormData(prev => ({ ...prev, requirement: e.target.value }))}
        style={{ marginRight: '6px' }}
      />
      {edu}
    </label>
  ))}
</fieldset>


        <button type="submit" style={submitStyle}>Post Job</button>
      </form>
    </div>
  );
};

// Remove the card container styling
const formContainer = {
  maxWidth: '700px',
  margin: '10px auto', // moved slightly up
  fontFamily: 'Segoe UI, sans-serif'
};


const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  marginBottom: '20px',
  fontSize: '16px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  outline: 'none',
  boxSizing: 'border-box'
};

const fieldsetStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '15px',
  marginTop: '20px',
  backgroundColor: '#fff'
};

const legendStyle = {
  fontWeight: 'bold',
  fontSize: '16px',
  marginBottom: '10px'
};

const checkboxLabel = {
  display: 'inline-block',
  marginRight: '15px',
  marginBottom: '10px'
};

const submitStyle = {
  marginTop: '30px',
  width: '100%',
  padding: '14px',
  fontSize: '17px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: '0.3s'
};

export default JobPosting;
  