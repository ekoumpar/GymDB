import React, { useEffect, useState } from 'react';
import { fetchTrainers } from '../api/api';

export default function Trainers(){
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      try{
        const data = await fetchTrainers();
        if(mounted) setTrainers(data || []);
      }catch(err){
        console.error('Failed to load trainers', err);
        if(mounted) setTrainers([]);
      }finally{ if(mounted) setLoading(false); }
    })();
    return ()=> mounted = false;
  },[]);

  return (
    <section className="page container">
      <div className="section section--subtle">
        <div className="section-header">
          <h2>Our Trainers</h2>
        </div>
        <div className="grid">
          {loading && <p className="muted">Loading trainers…</p>}
          {!loading && trainers.length===0 && <p className="muted">No trainers available.</p>}
          {!loading && trainers.map(t=> (
            <div className="card trainer-card" key={t.id}>
              <div className="trainer-top">
                <div className="trainer-avatar">{(t.name || '').split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}</div>
                <div className="trainer-header">
                  <h3>{t.name}</h3>
                  <div className="specialty-badge">{t.specialty}</div>
                </div>
              </div>
              <div className="trainer-actions">
                <div className="social-icons">
                  <a href="#" aria-label={`Twitter for ${t.name}`} title="Twitter" className="social-link">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M22 5.92c-.63.28-1.3.47-2 .56.72-.43 1.27-1.12 1.53-1.94-.67.4-1.42.7-2.22.86A3.49 3.49 0 0016.57 4c-1.93 0-3.5 1.66-3.14 3.64-2.9-.15-5.47-1.55-7.19-3.69A3.56 3.56 0 003.6 7.7c0 1.26.63 2.38 1.6 3.04-.59-.02-1.17-.18-1.66-.46v.05c0 1.72 1.2 3.16 2.79 3.48-.5.14-1.02.16-1.56.06.44 1.4 1.71 2.43 3.22 2.46A7.01 7.01 0 012 19.54 9.9 9.9 0 008.29 21c5.23 0 8.09-4.7 8.09-8.78v-.4c.56-.4 1.03-.9 1.41-1.47-.5.22-1.05.37-1.61.44.58-.37 1.03-.96 1.25-1.66z" fill="currentColor"/>
                    </svg>
                  </a>
                  <a href="#" aria-label={`Instagram for ${t.name}`} title="Instagram" className="social-link">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.3a4.7 4.7 0 100 9.4 4.7 4.7 0 000-9.4zm6-2.1a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" fill="currentColor"/>
                    </svg>
                  </a>
                  <a href="#" aria-label={`LinkedIn for ${t.name}`} title="LinkedIn" className="social-link">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M4.98 3.5a2.5 2.5 0 11.02 5 2.5 2.5 0 01-.02-5zM3 9h4v12H3zM9 9h4v1.7c.6-1.1 1.9-2.2 4.1-2.2 4.4 0 5.2 2.9 5.2 6.7V21h-4v-6.1c0-1.5-.03-3.5-2.2-3.5-2.2 0-2.5 1.7-2.5 3.4V21H9z" fill="currentColor"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
