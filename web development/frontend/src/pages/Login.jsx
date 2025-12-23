import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';

export default function Login({ onLogin }){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!username || !password){ setError('Fill both fields'); return; }
    try{
      const data = await login(username, password);
      // data: { token, user }
      onLogin(data);
      navigate('/profile');
    }catch(err){
      setError('Login failed');
    }
  }

  return (
    <section className="page container">
      <div className="card auth-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Username
          <input type="text" value={username} onChange={e=>setUsername(e.target.value)} />
        </label>
        <label>Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        <button className="btn primary" type="submit">Login</button>
        {error && <p className="muted">{error}</p>}
      </form>
      <p className="muted">Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    </section>
  );
}
