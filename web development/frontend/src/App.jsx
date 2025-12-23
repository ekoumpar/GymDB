import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

export default function App(){
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(()=>{
    const t = localStorage.getItem('gymdb_token');
    const u = localStorage.getItem('gymdb_user');
    if(t){
      setToken(t);
      setAuthToken(t);
    }
    if(u) setUser(JSON.parse(u));
  },[]);

  const handleLogin = ({ user: u, token: t })=>{
    setUser(u); setToken(t);
    localStorage.setItem('gymdb_token', t);
    localStorage.setItem('gymdb_user', JSON.stringify(u));
    setAuthToken(t);
  };

  const handleLogout = ()=>{
    setUser(null); setToken(null);
    localStorage.removeItem('gymdb_token');
    localStorage.removeItem('gymdb_user');
    setAuthToken(null);
  };

  return (
    <div className="app-root">
      <Navbar user={user} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classes" element={<Classes user={user} />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
          <Route path="/login" element={<Auth onLogin={handleLogin} />} />
          <Route path="/signup" element={<Auth onLogin={handleLogin} />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" replace />} />
        </Routes>
      </main>
      <footer className="footer">© GymDB — Built with ❤️</footer>
    </div>
  );
}
