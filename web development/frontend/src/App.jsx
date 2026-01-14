// App entry: sets auth token from storage, manages user/token state,
// and defines client-side routes for the SPA.
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Classes from './pages/Classes';
import Membership from './pages/Membership';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Trainers from './pages/Trainers';
import Schedule from './pages/Schedule';
import { setAuthToken } from './api/api';
import './styles/styles.css';

// Protect a route by checking `isAuthenticated`; redirects to login otherwise
const ProtectedRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default function App(){
  const navigate = useNavigate();
  // App-level auth state: `user` and `token` persisted in localStorage
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // On mount, restore auth state from localStorage and set API auth header
  useEffect(()=>{
    const t = localStorage.getItem('gymdb_token');
    const u = localStorage.getItem('gymdb_user');
    if(t){
      setToken(t);
      setAuthToken(t);
    }
    if(u) setUser(JSON.parse(u));
  },[]);

  // Persist login: update state, localStorage and API auth header
  const handleLogin = ({ user: u, token: t })=>{
    setUser(u); setToken(t);
    localStorage.setItem('gymdb_token', t);
    localStorage.setItem('gymdb_user', JSON.stringify(u));
    setAuthToken(t);
  };

  // Logout: clear auth state, storage and API header, then redirect
  const handleLogout = ()=>{
    setUser(null); setToken(null);
    localStorage.removeItem('gymdb_token');
    localStorage.removeItem('gymdb_user');
    setAuthToken(null);
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-root">
      <Navbar user={user} onLogout={handleLogout} />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home user={user} />} />
          <Route path="/classes" element={<Classes user={user} />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/contact" element={<Contact />} />
          {/* Auth routes reuse the Auth component */}
          <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
          <Route path="/login" element={<Auth onLogin={handleLogin} />} />
          <Route path="/signup" element={<Auth onLogin={handleLogin} />} />
          {/* Protected route: profile requires a logged-in user */}
          <Route path="/profile" element={<ProtectedRoute element={<Profile user={user} />} isAuthenticated={!!user} />} />
        </Routes>
      </main>
      <footer className="footer">© GymDB — Built with ❤️</footer>
    </div>
  );
}
