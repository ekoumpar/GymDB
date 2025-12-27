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

  // normalize schedule into flat entries: { day: 'Monday', time: '08:00', name, trainer }
  function normalize(data){
    const shortToFull = {Monday:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday'};
    const out = [];
    if(!Array.isArray(data)) return out;
    data.forEach(item => {
      // mock format: { day: 'Mon', items: [{time:'08:00', name:'Yoga'}] }
      if(item && item.day && Array.isArray(item.items)){
        const dayFull = shortToFull[item.day] || (item.day.length>3 ? item.day : item.day);
        item.items.forEach(it => { out.push({ day: dayFull, time: it.time, name: it.name || it.workout_type || it.workoutType, trainer: it.trainer }); });
      } else if(item && item.day && item.time && item.name){
        // already flat
        const dayFull = shortToFull[item.day] || item.day;
        out.push({ day: dayFull, time: item.time, name: item.name, trainer: item.trainer });
      } else if(item && item.day && item.time && item.workout_type){
        const dayFull = shortToFull[item.day] || item.day;
        out.push({ day: dayFull, time: item.time, name: item.workout_type, trainer: item.trainer_name || item.trainer });
      }
    });
    return out;
  }

  const entries = normalize(schedule);
  const daysOrder = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  // Always show all seven weekdays in the timetable
  const days = daysOrder;
  // collect unique times sorted
  const times = Array.from(new Set(entries.map(e => e.time).filter(Boolean))).sort();
  // build lookup map day->time->entry
  const grid = {};
  entries.forEach(e => { grid[e.day] = grid[e.day] || {}; grid[e.day][e.time] = e; });

  return (
    <section className="page container">
      <div className="section section--subtle">
        <div className="section-header">
          <h2>Weekly Schedule</h2>
        </div>
        {loading && <p className="muted">Loading schedule…</p>}
        {!loading && times.length===0 && <p className="muted">No schedule available.</p>}

        {!loading && times.length>0 && (
          <div className="timetable">
            {/* header row */}
            <div className="cell header time-col">Time</div>
            {days.map(d=> <div key={d} className="cell header">{d}</div>)}

            {/* rows */}
            {times.map(t => (
              <React.Fragment key={t}>
                <div className="cell time-col muted">{t}</div>
                {days.map(d=> {
                  const e = (grid[d] && grid[d][t]) || null;
                  return (
                    <div key={`${d}-${t}`} className="cell">
                      {e ? (
                        <div className="class-cell">
                          <div className="class-name">{e.name}</div>
                          <div className="class-meta">
                            <span className="trainer-chip">{e.trainer || 'TBA'}</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
