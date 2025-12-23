import React, { useState } from 'react';
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
      if(!name||!password){ setError('All fields required'); return; }
      if(pErr) return;
      try{
        const data = await signup(name, password);
        onLogin(data);
        navigate('/profile');
      }catch(err){ setError('Signup failed'); }
    }else{
      if(!identifier||!password){ setError('Fill both fields'); return; }
      try{
        const data = await login(identifier, password);
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
            <label>Full name
              <input value={name} onChange={e=>setName(e.target.value)} />
            </label>
          </>
        ) : (
          <label style={{display:'block'}}>Full name
            <input type="text" value={identifier} onChange={e=>setIdentifier(e.target.value)} aria-label="Full name" />
          </label>
        )}

        <label>Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>

        {passError && <p className="muted">{passError}</p>}
        {error && <p className="muted">{error}</p>}

        <div style={{marginTop:12}}>
          <button className="btn primary" type="submit">{mode==='login'? 'Login' : 'Create account'}</button>
        </div>
      </form>
      </div>
    </section>
  );
}
