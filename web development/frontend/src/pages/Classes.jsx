import React, { useState, useEffect } from 'react';
import { fetchClasses, bookClass } from '../api/api';

export default function Classes({ user }){
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      const data = await fetchClasses();
      if(mounted) { setClasses(data || []); setLoading(false); }
    })();
    return ()=>mounted=false;
  },[]);

  const handleBook = async (id)=>{
    if(!user){ alert('Please login to book classes'); return; }
    try{
      await bookClass(id);
      alert('Booked — check your profile');
    }catch(e){ alert('Booking failed'); }
  }

  if(loading) return <p>Loading classes…</p>;

  return (
    <section className="page container">
      <div className="section section--subtle">
        <div className="section-header">
          <h2>Available Classes</h2>
        </div>
        <div className="grid">
          {classes.length===0 && <p>No classes available.</p>}
          {classes.map(c=> (
            <article key={c.id} className="card">
              <h3>{c.name}</h3>
              <p className="muted">{c.trainer} — {c.time} • {c.duration} min</p>
              <div className="card-actions">
                <button className="btn" onClick={()=>handleBook(c.id)} disabled={!user}>Book</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
