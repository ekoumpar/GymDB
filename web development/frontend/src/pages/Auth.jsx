import React, { useState } from 'react';
import CustomSelect from '../components/CustomSelect';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../api/api';

function validatePassword(p){
  if(!p || p.length < 8) return 'Password must be at least 8 characters.';
  if(!/[0-9]/.test(p)) return 'Password must contain at least one digit.';
  if(!/[A-Z]/.test(p)) return 'Password should include an uppercase letter.';
  return null;
}

export default function Auth({ onLogin }){
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [sex, setSex] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState(null);
  const [passError, setPassError] = useState(null);
  const navigate = useNavigate();

  const switchTo = (m) => {
    setError(null); setPassError(null); setMode(m);
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setError(null);
    if(mode === 'signup'){
      const pErr = validatePassword(password);
      setPassError(pErr);
      if(!name || !password || !dateOfBirth || !phoneNumber){
        setError('All required fields must be completed');
        return;
      }
      if(pErr) return;
      try{
        const data = await signup(name, password, { dateOfBirth, sex, phoneNumber, height: parseFloat(height) || 0, weight: parseFloat(weight) || 0 });
        // Store user data in localStorage
        const userData = {
          name,
          dateOfBirth,
          sex,
          phoneNumber,
          height: parseFloat(height) || 0,
          weight: parseFloat(weight) || 0
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        onLogin(data);
        navigate('/profile');
      }catch(err){ setError('Signup failed: ' + (err.message || 'Unknown error')); }
    }else{
      if(!identifier||!password){ setError('Fill both fields'); return; }
      try{
        const data = await login(identifier, password);
        // Store full user data in localStorage
        localStorage.setItem('userData', JSON.stringify(data));
        onLogin(data);
        navigate('/profile');
      }catch(err){ setError('Login failed'); }
    }
  };

  return (
    <section className="page container">
      <div className="card auth-card">
      <div className="auth-switch">
        <button className={`tab ${mode==='login'? 'tab--active':''}`} onClick={()=>switchTo('login')} type="button">Login</button>
        <button className={`tab ${mode==='signup'? 'tab--active':''}`} onClick={()=>switchTo('signup')} type="button">Sign up</button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode==='signup' ? (
          <>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '20px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '1.1em' }}>Basic Information</h3>

              <label style={{ display: 'block', marginBottom: '15px' }}>
                <span style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Full Name *</span>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} required />
              </label>

              <label style={{ display: 'block', marginBottom: '15px' }}>
                <span style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Date of Birth *</span>
                <input type="text" value={dateOfBirth} onChange={e=>setDateOfBirth(e.target.value)} placeholder="DD/MM/YYYY" pattern="\d{2}/\d{2}/\d{4}" style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} required />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <label>
                  <span style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Sex *</span>
                  <div style={{ marginTop: 6 }}>
                    <CustomSelect
                      value={sex}
                      onChange={v=>setSex(v)}
                      options={[{value:'M',label:'Male'},{value:'F',label:'Female'},{value:'O',label:'Other'}]}
                      placeholder="Select"
                      ariaLabel="Sex"
                    />
                  </div>
                </label>

                <label>
                  <span style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Phone Number *</span>
                  <input type="tel" value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)} placeholder="+30 6XXXXXXXXX" style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} required />
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '1.1em' }}>Physical Information</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <label>
                  <span style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Height (cm)</span>
                  <input type="number" value={height} onChange={e=>setHeight(e.target.value)} placeholder="e.g. 180" min="0" style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} />
                </label>

                <label>
                  <span style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Weight (kg)</span>
                  <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="e.g. 75" min="0" style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} />
                </label>
              </div>
            </div>

            <label style={{ display: 'block' }}>
              <span style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Password *</span>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} required />
            </label>
          </>
        ) : (
          <label style={{display:'block', marginBottom: '15px'}}>
            <span style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Full Name</span>
            <input type="text" value={identifier} onChange={e=>setIdentifier(e.target.value)} aria-label="Full name" style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} />
          </label>
        )}

        {mode === 'login' && (
          <label style={{display:'block'}}>
            <span style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Password</span>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} />
          </label>
        )}

        {passError && <p className="muted" style={{ color: '#ff6b6b', marginTop: '10px' }}>⚠️ {passError}</p>}
        {error && <p className="muted" style={{ color: '#ff6b6b', marginTop: '10px' }}>⚠️ {error}</p>}

        <div style={{marginTop:'20px'}}>
          <button className="btn primary" type="submit" style={{ width: '100%', padding: '12px', fontSize: '1em' }}>{mode==='login'? 'Login' : 'Create account'}</button>
        </div>
      </form>
      </div>
    </section>
  );
}
