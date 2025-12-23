import React, { useEffect, useState } from 'react';
import { fetchSchedule } from '../api/api';

export default function Schedule(){
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      try{
        const data = await fetchSchedule();
        if(mounted) setSchedule(Array.isArray(data) ? data : []);
      }catch(err){
        console.error('Failed to load schedule', err);
        if(mounted) setSchedule([]);
      }finally{
        if(mounted) setLoading(false);
      }
    })();
    return ()=> mounted = false;
  },[]);

  return (
    <section className="page container">
      <div className="section section--subtle">
        <div className="section-header">
          <h2>Weekly Schedule</h2>
        </div>
        <div className="grid">
          {loading && <p className="muted">Loading schedule…</p>}
          {!loading && schedule.length===0 && <p className="muted">No schedule available.</p>}
          {!loading && schedule.map(s=> (
            <div className="card" key={s.day}>
              <h3>{s.day}</h3>
              <ul>
                {Array.isArray(s.items) && s.items.map(it=> <li key={`${s.day}-${it.time}`}>{it.time} — {it.name}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
