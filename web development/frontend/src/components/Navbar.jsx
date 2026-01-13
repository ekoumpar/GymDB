import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }){
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand" aria-label="GymDB home">
          <span className="brand-logo" aria-hidden>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
              <rect x="1" y="7" width="4" height="10" rx="1.5" fill="currentColor" />
              <rect x="19" y="7" width="4" height="10" rx="1.5" fill="currentColor" />
              <rect x="6" y="10" width="12" height="4" rx="1" fill="currentColor" />
            </svg>
          </span>
          <span className="brand-main">Gym</span><span className="brand-accent">DB</span>
        </Link>
        <button className="nav-toggle" onClick={()=>setOpen(!open)} aria-label="menu">☰</button>
        <nav className={`nav-links ${open? 'open':''}`}>
          <Link to="/classes" className={`nav-link ${!user ? 'disabled' : ''}`} title="Classes" onClick={(e) => !user && e.preventDefault()}>Classes</Link>

          <Link to="/membership" className={`nav-link ${!user ? 'disabled' : ''}`} title="Membership" onClick={(e) => !user && e.preventDefault()}>Membership</Link>

          <Link to="/trainers" className={`nav-link ${!user ? 'disabled' : ''}`} title="Trainers" onClick={(e) => !user && e.preventDefault()}>Trainers</Link>

          <Link to="/schedule" className={`nav-link ${!user ? 'disabled' : ''}`} title="Schedule" onClick={(e) => !user && e.preventDefault()}>Schedule</Link>

          <Link to="/contact" className="nav-link" title="Contact">Contact</Link>
          {user ? (
            <>
              <Link to="/profile" className="nav-link" title="Profile">Profile</Link>
              <button className="link-btn" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth" className="nav-link" title="Login or Sign up" aria-label="Login or Sign up">
                <span className="user-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
                    <circle cx="12" cy="8" r="3" fill="currentColor" />
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" />
                  </svg>
                </span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
