import React, { useEffect, useState } from 'react';
import { fetchUserBookings, cancelBooking } from '../api/api';
import { formatDate } from '../utils/format';

export default function Profile({ user }){
  const [bookings, setBookings] = useState([]);

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      const data = await fetchUserBookings();
      if(mounted) setBookings(data || []);
    })();
    return ()=> mounted = false;
  },[]);

  const handleCancel = async (id)=>{
    if(!confirm('Cancel booking?')) return;
    await cancelBooking(id);
    setBookings(b => b.filter(x => x.id !== id));
  };

  return (
    <section className="page container">
      <div className="section section--strong">
        <div className="section-header"><h2>Profile</h2></div>
        <div className="card">
          <p><strong>Name:</strong> {user?.name}</p>
          {/* Email removed from user accounts */}
        </div>
      </div>

      <div className="section section--subtle">
        <div className="section-header"><h2>Your Bookings</h2></div>
        <div className="grid">
          {bookings.length===0 && <p className="muted">No bookings yet.</p>}
          {bookings.map(b=> (
            <div key={b.id} className="card">
              <p><strong>{b.className || b.name}</strong></p>
              <p className="muted">{b.date ? formatDate(b.date) : (b.time || 'TBD')} — {b.trainer || 'TBA'}</p>
              {b.location && <p className="muted">Location: {b.location}</p>}
              <div className="card-actions">
                <button className="btn" onClick={()=>handleCancel(b.id)}>Cancel</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
