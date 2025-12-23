import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/api';

function validatePassword(p){
  if(!p || p.length < 8) return 'Password must be at least 8 characters.';
  if(!/[0-9]/.test(p)) return 'Password must contain at least one digit.';
  if(!/[A-Z]/.test(p)) return 'Password should include an uppercase letter.';
  return null;
}

export default function Signup({ onLogin }){
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [passError, setPassError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setError(null);
    const pErr = validatePassword(password);
    setPassError(pErr);
    if(!name||!password){ setError('All fields required'); return; }
    if(pErr) return;
    try{
      const data = await signup(name, password);
      onLogin(data);
      navigate('/profile');
    }catch(err){
      setError('Signup failed');
    }
  };

  return (
    <section className="page container">
      <div className="card auth-card">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit}>
        <label>Name
          <input value={name} onChange={e=>setName(e.target.value)} />
        </label>
        {/* Email removed from signup — accounts use username only */}
        <label>Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        {passError && <p className="muted">{passError}</p>}
        <button className="btn primary" type="submit">Sign up</button>
        {error && <p className="muted">{error}</p>}
      </form>
      </div>
    </section>
  );
}
