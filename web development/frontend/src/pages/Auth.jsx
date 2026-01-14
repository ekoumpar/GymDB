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
    setError(null); setPassError(null);
    // clear form fields when switching modes to avoid stale values (e.g. weight appearing as name)
    setIdentifier(''); setPassword(''); setName(''); setDateOfBirth(''); setSex(''); setPhoneNumber(''); setHeight(''); setWeight('');
    setMode(m);
  };

  React.useEffect(()=>{
    // ensure identifier is empty on mount to avoid stale autofill values
    setIdentifier('');
    // Some browsers apply autofill after initial render; clear again shortly after
    const t = setTimeout(()=>{ setIdentifier(''); setPassword(''); }, 500);
    return ()=>clearTimeout(t);
  }, []);

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
        const user = data && data.user ? data.user : { username: name };
        // Merge server user object with additional details for the client
        const clientUser = {
          id: user.id,
          // store the full name as `username` for client consistency
          username: name + '',
          name,
          dateOfBirth,
          sex: sex || 'M',
          phoneNumber,
          height: parseFloat(height) || 0,
          weight: parseFloat(weight) || 0
        };
        localStorage.setItem('gymdb_user', JSON.stringify(clientUser));
        if(data && data.token) localStorage.setItem('gymdb_token', data.token);
        onLogin({ user: clientUser, token: data && data.token });
        navigate('/profile');
      }catch(err){ setError('Signup failed: ' + (err.message || 'Unknown error')); }
    }else{
      if(!identifier||!password){ setError('Fill both fields'); return; }
      try{
        const data = await login(identifier, password);
        const user = data && data.user ? data.user : {};
        const token = data && data.token ? data.token : null;
        // Map server user to a sanitized client user to avoid incorrect field mapping
        // Defensive mapping: avoid numeric values (e.g. weight) being used as the display name
        const rawName = user.name || user.username || '';
        const nameIsNumeric = typeof rawName === 'number' || (/^\d+(?:\.\d+)?$/.test(String(rawName).trim()));
        const safeName = nameIsNumeric ? (user.username || '') : rawName;

        const clientUser = {
          id: user.id || user.userId || user.member_id || null,
          // prefer the full (safe) name as the username value
          username: safeName + '',
          name: safeName + '',
          dateOfBirth: user.dateOfBirth || user.date_of_birth || '',
          sex: user.sex || '',
          phoneNumber: user.phoneNumber || user.phone_number || '',
          height: user.height || 0,
          weight: user.weight || 0
        };
        localStorage.setItem('gymdb_user', JSON.stringify(clientUser));
        if(token) localStorage.setItem('gymdb_token', token);
        onLogin({ user: clientUser, token });
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

      <form onSubmit={handleSubmit} autoComplete="off">
        {/* Hidden fields to capture browser autofill and prevent it from filling visible inputs */}
        <input type="text" name="__username_hint" autoComplete="username" style={{ display: 'none' }} aria-hidden="true" />
        <input type="password" name="__password_hint" autoComplete="current-password" style={{ display: 'none' }} aria-hidden="true" />
        {mode==='signup' ? (
          <>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '20px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '1.1em' }}>Basic Information</h3>

              <label style={{ display: 'block', marginBottom: '15px' }}>
                <span style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Full Name *</span>
                  <input name="fullname" autoComplete="name" type="text" value={name} onChange={e=>setName(e.target.value)} style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} required />
                  {/* Provide a hidden username field with autocomplete=username so password managers use the full name */}
                  <input type="text" name="username" autoComplete="username" value={name} readOnly style={{ display: 'none' }} aria-hidden="true" />
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
              <input name="new-password" autoComplete="new-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} required />
            </label>
          </>
        ) : (
            <label style={{display:'block', marginBottom: '15px'}}>
            <span style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Full Name</span>
            <input
              name="login_identifier"
              autoComplete="off"
              type="text"
              value={identifier}
              onChange={e=>setIdentifier(e.target.value)}
              aria-label="Full name"
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            />
          </label>
        )}

        {mode === 'login' && (
          <label style={{display:'block'}}>
            <span style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Password</span>
            <input name="password" autoComplete="current-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} />
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
