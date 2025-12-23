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
            <div className="card" key={t.id}>
              <h3>{t.name}</h3>
              <p className="muted">{t.specialty}</p>
              <p>Experienced trainer focused on safe progress and measurable results.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
