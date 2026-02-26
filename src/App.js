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
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">DAFINITIQ AI</div>
          <div className="tagline">Interview Management System</div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            onClick={() => setView('user')} 
            className={`nav-item ${view === 'user' ? 'active' : ''}`}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none">
              <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" fill="currentColor"/>
            </svg>
            Apply Now
          </button>
          
          <button 
            onClick={handleAdminClick} 
            className={`nav-item ${view === 'admin' || view === 'login' ? 'active' : ''}`}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
            </svg>
            {isAdminLoggedIn ? 'Dashboard' : 'Admin Login'}
          </button>
        </nav>
        
        {isAdminLoggedIn && (
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </aside>
      
      <main className="main-content">
        <div className="container">
          {view === 'user' && <CandidateForm />}
          {view === 'login' && <AdminLogin onLogin={handleAdminLogin} />}
          {view === 'admin' && isAdminLoggedIn && <AdminDashboard adminData={adminData} />}
        </div>
      </main>
    </div>
  );
}

export default App;
