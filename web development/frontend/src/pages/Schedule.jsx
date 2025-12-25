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
          {!loading && schedule.map((s, idx)=> (
            <div className="card" key={idx}>
              <h3>{s.time} - {s.name}</h3>
              <p><strong>Trainer:</strong> {s.trainer}</p>
              <p><strong>Day:</strong> {s.day}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
