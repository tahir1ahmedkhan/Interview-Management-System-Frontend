import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import CandidateForm from './components/CandidateForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import './App.css';

// Admin Layout with Sidebar
function AdminLayout({ children, isAdminLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">DAFINITIQ AI</div>
          <div className="tagline">Admin Panel</div>
        </div>
        
        <nav className="sidebar-nav">
          {!isAdminLoggedIn ? (
            <button 
              onClick={() => navigate('/admin/login')} 
              className={`nav-item ${isActive('/admin/login') ? 'active' : ''}`}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
              </svg>
              Admin Login
            </button>
          ) : (
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
              </svg>
              Dashboard
            </button>
          )}
          
          <button 
            onClick={() => navigate('/')} 
            className="nav-item"
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
            </svg>
            Back to Home
          </button>
        </nav>
        
        {isAdminLoggedIn && (
          <div className="sidebar-footer">
            <button onClick={onLogout} className="logout-btn">
              <svg className="logout-icon" viewBox="0 0 24 24" fill="none">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
              </svg>
              Logout
            </button>
          </div>
        )}
      </aside>
      
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}

// User Layout with Sidebar
function UserLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className="user-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">DAFINITIQ AI</div>
          <div className="tagline">Interview Management System</div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            onClick={() => navigate('/')} 
            className={`nav-item ${isActive('/') ? 'active' : ''}`}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none">
              <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" fill="currentColor"/>
            </svg>
            Apply Now
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <div className="sidebar-info">
            <p>Need help?</p>
            <a href="mailto:support@dafinitiq.ai" className="support-link">Contact Support</a>
          </div>
        </div>
      </aside>
      
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}

function ProtectedRoute({ children, isAdminLoggedIn }) {
  return isAdminLoggedIn ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const handleAdminLogin = (admin) => {
    setIsAdminLoggedIn(true);
    setAdminData(admin);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminData(null);
  };

  return (
    <Router>
      <Routes>
        {/* User Routes - No Sidebar */}
        <Route 
          path="/" 
          element={
            <UserLayout>
              <CandidateForm />
            </UserLayout>
          } 
        />
        
        {/* Admin Routes - With Sidebar */}
        <Route 
          path="/admin/login" 
          element={
            isAdminLoggedIn ? 
              <Navigate to="/admin/dashboard" replace /> : 
              <AdminLayout isAdminLoggedIn={isAdminLoggedIn} onLogout={handleLogout}>
                <AdminLogin onLogin={handleAdminLogin} />
              </AdminLayout>
          } 
        />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute isAdminLoggedIn={isAdminLoggedIn}>
              <AdminLayout isAdminLoggedIn={isAdminLoggedIn} onLogout={handleLogout}>
                <AdminDashboard adminData={adminData} />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
