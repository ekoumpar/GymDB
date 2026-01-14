// Membership page: loads membership plans via API and displays plan cards.
import React, { useEffect, useState } from 'react';
import { fetchMemberships } from '../api/api';

export default function Membership(){
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      try{
        const data = await fetchMemberships();
        if(mounted) setPlans(Array.isArray(data) ? data : []);
      }catch(err){
        console.error('Failed to load memberships', err);
        if(mounted) setPlans([]);
      }finally{ if(mounted) setLoading(false); }
    })();
    return ()=> mounted = false;
  },[]);

  // Render membership plan cards once loaded

  return (
    <section className="page container">
      <div className="section section--strong section--accent">
        <div className="section-header">
          <h2>Membership Plans</h2>
        </div>
        <div className="grid">
          {loading && <p className="muted">Loading plans…</p>}
          {!loading && plans.length===0 && <p className="muted">No membership plans available.</p>}
          {!loading && plans.map(p=> (
            <div key={p.id || p.name} className="card">
              <div className="card-header">
                <h3>{p.name}</h3>
                <div className="duration-badge">{p.duration ? `${p.duration} mo` : 'TBA'}</div>
              </div>
              <p className="price">{p.price}</p>
              {p.category && <div className="category-badge">{p.category}</div>}
              <ul>
                {Array.isArray(p.perks) && p.perks.map(perk=> <li key={perk}>{perk}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
