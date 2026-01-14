import React, { useEffect, useState } from 'react';
import { fetchSchedule, bookClass } from '../api/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';
import ConfirmModal from '../components/ConfirmModal';

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
    const shortToFull = {mon:'Monday',tue:'Tuesday',wed:'Wednesday',thu:'Thursday',fri:'Friday',sat:'Saturday',sun:'Sunday'};
    const out = [];
    if(!Array.isArray(data)) return out;
    data.forEach(item => {
      // mock format: { day: 'Mon', items: [{time:'08:00', name:'Yoga'}] }
      if(item && item.day && Array.isArray(item.items)){
        const key = String(item.day || '').toLowerCase().slice(0,3);
        const dayFull = shortToFull[key] || (item.day.length>3 ? item.day : item.day);
        item.items.forEach(it => { out.push({ day: dayFull, time: it.time, name: it.name || it.workout_type || it.workoutType, trainer: it.trainer || it.trainer_name }); });
      } else if(item && item.day && item.time && item.name){
        // already flat
        const key = String(item.day || '').toLowerCase().slice(0,3);
        const dayFull = shortToFull[key] || item.day;
        out.push({ day: dayFull, time: item.time, name: item.name, trainer: item.trainer || item.trainer_name });
      } else if(item && item.day && item.time && item.workout_type){
        const key = String(item.day || '').toLowerCase().slice(0,3);
        const dayFull = shortToFull[key] || item.day;
        out.push({ day: dayFull, time: item.time, name: item.workout_type, trainer: item.trainer_name || item.trainer });
      }
    });
    return out;
  }

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const highlight = params.get('workout') || '';
  const entries = normalize(schedule);
  const daysOrder = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  // Always show all seven weekdays in the timetable
  const days = daysOrder;
  // collect unique times sorted
  const times = Array.from(new Set(entries.map(e => e.time).filter(Boolean))).sort();
  // build lookup map day->time->entry
  const grid = {};
  entries.forEach(e => { grid[e.day] = grid[e.day] || {}; grid[e.day][e.time] = e; });

  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmWorkout, setConfirmWorkout] = React.useState('');
  const [confirmDay, setConfirmDay] = React.useState('');
  const [confirmTime, setConfirmTime] = React.useState('');

  function openConfirm(workoutName, day, time){
    const token = localStorage.getItem('gymdb_token');
    if(!token){ navigate('/auth'); return; }
    setConfirmWorkout(workoutName || '');
    setConfirmDay(day || '');
    setConfirmTime(time || '');
    setConfirmOpen(true);
  }

  async function handleConfirm(){
    setConfirmOpen(false);
    if(!confirmWorkout) return;
    try{
      await bookClass({ workout: confirmWorkout, day: confirmDay, time: confirmTime });
      showToast(`Booked — ${confirmWorkout} (${confirmDay} ${confirmTime})`, { type: 'success' });
    }catch(err){
      let msg = 'Booking failed';
      try{
        if(err && err.response && err.response.data){
          const data = err.response.data;
          if(data.error) msg = data.error;
          else if(data.message) msg = data.message;
          else if(data.errors && Array.isArray(data.errors)){
            msg = data.errors.map(e => e.msg || e.param || JSON.stringify(e)).join('; ');
          } else if(data.ok === false && data.errors) {
            msg = Array.isArray(data.errors) ? data.errors.map(e=>e.msg||JSON.stringify(e)).join('; ') : String(data.errors);
          } else {
            msg = JSON.stringify(data);
          }
        } else if(err && err.message) msg = err.message;
      }catch(e){ msg = 'Booking failed'; }
      showToast(msg, { type: 'error' });
      console.error('bookClass error', err);
    }
  }

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
                                    <div
                                      className={`class-cell ${highlight && e.name && e.name.toLowerCase() === highlight.toLowerCase() ? 'highlight' : ''} clickable-cell`}
                                      role="button"
                                      tabIndex={0}
                                      onClick={() => openConfirm(e.name, d, t)}
                                      onKeyDown={(ev)=>{ if(ev.key==='Enter' || ev.key===' '){ ev.preventDefault(); openConfirm(e.name, d, t); } }}
                                    >
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
                <ConfirmModal
                  open={confirmOpen}
                  title={`Book ${confirmWorkout} — ${confirmDay} ${confirmTime}`}
                  message={`Do you want to book ${confirmWorkout} on ${confirmDay} at ${confirmTime}?`}
                  onConfirm={handleConfirm}
                  onCancel={()=>setConfirmOpen(false)}
                />
          </div>
        )}
      </div>
    </section>
  );
}
