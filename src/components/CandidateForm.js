import React, { useState } from 'react';
import axios from 'axios';
import './CandidateForm.css';

const API_URL = 'http://localhost:5001/api/candidates';

function CandidateForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    qualification: '',
    phone: '',
    experience: '',
    linkedinProfile: ''
  });
  const [cvFile, setCvFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size should not exceed 5MB');
        return;
      }
      setCvFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('qualification', formData.qualification);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('experience', formData.experience);
    formDataToSend.append('linkedinProfile', formData.linkedinProfile);
    if (cvFile) {
      formDataToSend.append('cv', cvFile);
    }

    try {
      await axios.post(API_URL, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Application submitted successfully!');
      setFormData({ fullName: '', email: '', qualification: '', phone: '', experience: '', linkedinProfile: '' });
      setCvFile(null);
      document.getElementById('cv-upload').value = '';
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <div className="form-icon">
          <svg width="70" height="70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="url(#gradient2)"/>
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea"/>
                <stop offset="100%" stopColor="#764ba2"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2>Apply for Interview</h2>
        <p className="form-subtitle">Join DAFINITIQ AI Team - Shape the Future of AI</p>
      </div>
      
      {message && (
        <div className={`message ${message.includes('Error') || message.includes('size') ? 'error' : 'success'}`}>
          <span className="message-icon">{message.includes('Error') || message.includes('size') ? '!' : '✓'}</span>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
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
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Qualification *</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="e.g., Bachelor's in Computer Science"
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
              placeholder="+92 (555) 000-0000"
            />
          </div>
        </div>

        <div className="form-group">
          <label>LinkedIn Profile</label>
          <input
            type="url"
            name="linkedinProfile"
            value={formData.linkedinProfile}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div className="form-group">
          <label>Experience</label>
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us about your relevant experience, skills, and achievements..."
          />
        </div>

        <div className="form-group">
          <label>Upload CV/Resume (PDF, DOC, DOCX - Max 5MB)</label>
          <div className="file-upload-wrapper">
            <input
              type="file"
              id="cv-upload"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="cv-upload" className="file-label">
              <svg className="file-icon" width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="#667eea"/>
              </svg>
              <span className="file-text">
                {cvFile ? cvFile.name : 'Choose file or drag here'}
              </span>
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span> Submitting...
            </>
          ) : (
            <>
              Submit Application
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default CandidateForm;
