import React, { useState } from 'react';
import axios from 'axios';
import './CandidateForm.css';

const API_URL = 'http://localhost:5000/api/candidates';

function CandidateForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    qualification: '',
    phone: '',
    experience: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      setMessage('Application submitted successfully!');
      setFormData({ fullName: '', email: '', qualification: '', phone: '', experience: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error submitting application. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Apply for Interview</h2>
      {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Qualification *</label>
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Experience</label>
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <button type="submit" className="submit-btn">Submit Application</button>
      </form>
    </div>
  );
}

export default CandidateForm;
