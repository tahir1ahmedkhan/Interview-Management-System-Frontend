import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = 'http://localhost:5000/api/candidates';

function AdminDashboard() {
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
      <h2>Admin Dashboard</h2>
      
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

      <div className="candidates-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Qualification</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map(candidate => (
              <tr key={candidate._id}>
                <td>{candidate.fullName}</td>
                <td>{candidate.email}</td>
                <td>{candidate.qualification}</td>
                <td>{candidate.phone || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${candidate.status}`}>
                    {candidate.status}
                  </span>
                </td>
                <td>{new Date(candidate.appliedDate).toLocaleDateString()}</td>
                <td className="actions">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCandidates.length === 0 && (
          <p className="no-data">No candidates found</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
