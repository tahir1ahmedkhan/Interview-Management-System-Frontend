import React, { useState } from 'react';
import CandidateForm from './components/CandidateForm';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [view, setView] = useState('user');

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Interview Management System</h1>
        <div className="nav-buttons">
          <button onClick={() => setView('user')} className={view === 'user' ? 'active' : ''}>
            Apply
          </button>
          <button onClick={() => setView('admin')} className={view === 'admin' ? 'active' : ''}>
            Admin Dashboard
          </button>
        </div>
      </nav>
      
      <div className="container">
        {view === 'user' ? <CandidateForm /> : <AdminDashboard />}
      </div>
    </div>
  );
}

export default App;
