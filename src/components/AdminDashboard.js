import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = 'http://localhost:5001/api/candidates';

function AdminDashboard({ adminData }) {
  const [candidates, setCandidates] = useState([]);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ pending: 0, taken: 0, rejected: 0 });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(API_URL);
      setCandidates(response.data);
      calculateStats(response.data);
    } catch (err) {
      console.error('Error fetching candidates:', err);
    }
  };

  const calculateStats = (data) => {
    const stats = {
      pending: data.filter(c => c.status === 'pending').length,
      taken: data.filter(c => c.status === 'taken').length,
      rejected: data.filter(c => c.status === 'rejected').length
    };
    setStats(stats);
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/${id}/status`, { status });
      fetchCandidates();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteCandidate = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchCandidates();
      } catch (err) {
        console.error('Error deleting candidate:', err);
      }
    }
  };

  const filteredCandidates = filter === 'all' 
    ? candidates 
    : candidates.filter(c => c.status === filter);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        {adminData && <p className="welcome-text">Welcome, {adminData.username}!</p>}
      </div>
      
      <div className="stats-container">
        <div className="stat-card pending">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card taken">
          <h3>{stats.taken}</h3>
          <p>Taken</p>
        </div>
        <div className="stat-card rejected">
          <h3>{stats.rejected}</h3>
          <p>Rejected</p>
        </div>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
          All
        </button>
        <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'active' : ''}>
          Pending
        </button>
        <button onClick={() => setFilter('taken')} className={filter === 'taken' ? 'active' : ''}>
          Taken
        </button>
        <button onClick={() => setFilter('rejected')} className={filter === 'rejected' ? 'active' : ''}>
          Rejected
        </button>
      </div>

      <div className="candidates-grid">
        {filteredCandidates.map(candidate => (
          <div key={candidate._id} className="candidate-card">
            <div className="card-header">
              <div className="candidate-avatar">
                {candidate.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="candidate-info">
                <h3>{candidate.fullName}</h3>
                <p className="candidate-email">{candidate.email}</p>
              </div>
              <span className={`status-badge ${candidate.status}`}>
                {candidate.status}
              </span>
            </div>

            <div className="card-body">
              <div className="info-item">
                <span className="info-label">Qualification:</span>
                <span className="info-value">{candidate.qualification}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{candidate.phone || 'N/A'}</span>
              </div>

              {candidate.linkedinProfile && (
                <div className="info-item">
                  <span className="info-label">LinkedIn:</span>
                  <a href={candidate.linkedinProfile} target="_blank" rel="noopener noreferrer" className="linkedin-link">
                    View Profile →
                  </a>
                </div>
              )}

              {candidate.experience && (
                <div className="info-item">
                  <span className="info-label">Experience:</span>
                  <span className="info-value experience-text">{candidate.experience}</span>
                </div>
              )}

              {candidate.cvFileName && (
                <div className="info-item">
                  <span className="info-label">CV/Resume:</span>
                  <a 
                    href={`http://localhost:5001/${candidate.cvFilePath}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="cv-link"
                  >
                    Download {candidate.cvFileName} →
                  </a>
                </div>
              )}

              <div className="info-item">
                <span className="info-label">Applied Date:</span>
                <span className="info-value">{new Date(candidate.appliedDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="card-footer">
              <select 
                value={candidate.status} 
                onChange={(e) => updateStatus(candidate._id, e.target.value)}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="taken">Taken</option>
                <option value="rejected">Rejected</option>
              </select>
              <button onClick={() => deleteCandidate(candidate._id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {filteredCandidates.length === 0 && (
          <div className="no-data">
            <svg className="no-data-icon" width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" fill="#adb5bd"/>
            </svg>
            <p>No candidates found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
