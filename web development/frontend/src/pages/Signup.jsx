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
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [sex, setSex] = useState('M');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [passError, setPassError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setError(null);
    const pErr = validatePassword(password);
    setPassError(pErr);
    if(!name || !password || !dateOfBirth || !phoneNumber){ 
      setError('All required fields must be completed'); 
      return; 
    }
    if(pErr) return;
    try{
      const data = await signup(name, password, { dateOfBirth, sex, phoneNumber, height: parseFloat(height) || 0, weight: parseFloat(weight) || 0 });
      onLogin(data);
      navigate('/profile');
    }catch(err){
      setError('Signup failed: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <section className="page container">
      <div className="card auth-card">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit}>
        <label>Full Name *
          <input type="text" value={name} onChange={e=>setName(e.target.value)} required />
        </label>
        
        <label>Date of Birth *
          <input type="date" value={dateOfBirth} onChange={e=>setDateOfBirth(e.target.value)} required />
        </label>
        
        <label>Sex *
          <select value={sex} onChange={e=>setSex(e.target.value)} required>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </label>
        
        <label>Phone Number *
          <input type="tel" value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)} placeholder="+30 6XXXXXXXXX" required />
        </label>
        
        <label>Height (cm)
          <input type="number" value={height} onChange={e=>setHeight(e.target.value)} placeholder="e.g. 180" />
        </label>
        
        <label>Weight (kg)
          <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="e.g. 75" />
        </label>
        
        <label>Password *
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        {passError && <p className="muted">{passError}</p>}
        
        <button className="btn primary" type="submit">Sign up</button>
        {error && <p className="muted">{error}</p>}
      </form>
      </div>
    </section>
  );
}
