import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchClasses } from '../api/api';

export default function Classes(){
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      try{
        const data = await fetchClasses();
        if(mounted) { setClasses(data); setLoading(false); }
      }catch(e){ if(mounted){ setClasses([]); setLoading(false); } }
    })();
    return ()=>mounted=false;
  },[]);

  if(loading) return <p>Loading classes…</p>;

  const handleCardActivate = (e, workoutName) => {
    // ignore clicks on internal links/buttons
    if(e && e.target && e.target.closest && e.target.closest('a,button')) return;
    if(!workoutName) return;
    navigate(`/schedule?workout=${encodeURIComponent(workoutName)}`);
  }

  return (
    <section className="page container">
      <div className="section section--subtle">
        <div className="section-header">
          <h2>Available Classes</h2>
        </div>
        <div className="grid">
          {classes.length===0 && <p>No classes available.</p>}
          {classes.map((c, idx)=> {
            const intensity = c.intensity == null ? null : Number(c.intensity);
            const pct = intensity ? Math.max(0, Math.min(100, Math.round((intensity / 10) * 100))) : 0;
            const level = intensity == null ? 'none' : intensity <= 4 ? 'low' : intensity <= 7 ? 'mid' : 'high';
            return (
              <article
                key={c.name || idx}
                className="card clickable"
                role="button"
                tabIndex={0}
                onClick={(e) => handleCardActivate(e, c.name)}
                onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardActivate(e, c.name); } }}
              >
                  <div className="card-header">
                    <h3>{c.name || 'Class'}</h3>
                    <div className="duration-badge">{c.duration ? `${c.duration} min` : 'TBA'}</div>
                  </div>
                <div className="intensity">
                  <div className="intensity-row">
                    <div className="intensity-label muted">Intensity</div>
                    <div className="intensity-value">{intensity != null ? intensity : 'TBA'}</div>
                  </div>
                  <div className="intensity-bar" role="progressbar" aria-valuemin={0} aria-valuemax={10} aria-valuenow={intensity != null ? intensity : 0} aria-label={`Intensity ${intensity != null ? intensity : 'unknown'}`}>
                    <div className={`intensity-fill ${level}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>

              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
