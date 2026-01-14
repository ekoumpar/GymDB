import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Navbar: responsive site navigation. Shows auth links when `user` is present
// and a menu toggle for small screens.
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
          <Link to="/classes" className="nav-link" title="Classes">Classes</Link>

          <Link to="/membership" className="nav-link" title="Membership">Membership</Link>

          <Link to="/trainers" className="nav-link" title="Trainers">Trainers</Link>

          <Link to="/schedule" className="nav-link" title="Schedule">Schedule</Link>

          <Link to="/contact" className="nav-link" title="Contact">Contact</Link>
          {user ? (
            <>
              <Link to="/profile" className="nav-link" title="Profile">Profile</Link>
              <button className="link-btn" onClick={onLogout} aria-label="Logout" title="Logout">
                <span className="logout-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img">
                    <path d="M16 13v-2H7V8l-5 4 5 4v-3z" fill="currentColor" />
                    <path d="M20 3H10a2 2 0 00-2 2v2h2V5h10v14H10v-2H8v2a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z" fill="currentColor" />
                  </svg>
                </span>
              </button>
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
