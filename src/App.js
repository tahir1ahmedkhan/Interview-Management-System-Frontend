import React, { useState } from 'react';
import CandidateForm from './components/CandidateForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import './App.css';

function App() {
  const [view, setView] = useState('user');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const handleAdminLogin = (admin) => {
    setIsAdminLoggedIn(true);
    setAdminData(admin);
    setView('admin');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminData(null);
    setView('user');
  };

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      setView('admin');
    } else {
      setView('login');
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="logo">DAFINITIQ AI</div>
          <div className="tagline">Interview Management System</div>
        </div>
        <div className="nav-buttons">
          <button onClick={() => setView('user')} className={view === 'user' ? 'active' : ''}>
            Apply Now
          </button>
          <button onClick={handleAdminClick} className={view === 'admin' || view === 'login' ? 'active' : ''}>
            {isAdminLoggedIn ? 'Dashboard' : 'Admin Login'}
          </button>
          {isAdminLoggedIn && (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          )}
        </div>
      </nav>
      
      <div className="container">
        {view === 'user' && <CandidateForm />}
        {view === 'login' && <AdminLogin onLogin={handleAdminLogin} />}
        {view === 'admin' && isAdminLoggedIn && <AdminDashboard adminData={adminData} />}
      </div>
    </div>
  );
}

export default App;
