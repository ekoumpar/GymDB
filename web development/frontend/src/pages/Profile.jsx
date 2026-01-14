// Profile page: shows user details and their bookings; supports booking
// cancellation and uses `fetchUserBookings`/`cancelBooking` APIs.
import React, { useEffect, useState } from 'react';
import { fetchUserBookings } from '../api/api';

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

  // Get user data from localStorage (use app's canonical `gymdb_user` key)
  const userData = user || JSON.parse(localStorage.getItem('gymdb_user') || '{}');

  return (
    <section className="page container">
      {/* Welcome Section */}
      <div className="section section--strong" style={{ background: 'linear-gradient(135deg, #9d4edd 0%, #5a189a 100%)', padding: '40px 30px', borderRadius: '12px', marginBottom: '30px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5em', color: '#fff' }}>Welcome back! 💪</h1>
          <p style={{ margin: '0', fontSize: '1.2em', color: 'rgba(255,255,255,0.9)' }}>{userData?.name || 'Member'}</p>
        </div>
      </div>

      <div className="section section--strong">
        <div className="section-header"><h2>Your Profile</h2></div>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Basic Information */}
            <div>
              <h3 style={{ marginTop: 0, color: '#9d4edd' }}>Basic Information</h3>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '5px 0', color: '#999', fontSize: '12px', textTransform: 'uppercase' }}>Name</p>
                <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: '500' }}>{userData?.name || 'Not provided'}</p>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '5px 0', color: '#999', fontSize: '12px', textTransform: 'uppercase' }}>Date of Birth</p>
                <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: '500' }}>{userData?.dateOfBirth || 'Not provided'}</p>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '5px 0', color: '#999', fontSize: '12px', textTransform: 'uppercase' }}>Sex</p>
                <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: '500' }}>{userData?.sex === 'F' ? 'Female' : userData?.sex === 'M' ? 'Male' : 'Not provided'}</p>
              </div>
            </div>

            {/* Physical Information */}
            <div>
              <h3 style={{ marginTop: 0, color: '#9d4edd' }}>Physical Information</h3>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '5px 0', color: '#999', fontSize: '12px', textTransform: 'uppercase' }}>Phone Number</p>
                <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: '500' }}>{userData?.phoneNumber || 'Not provided'}</p>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '5px 0', color: '#999', fontSize: '12px', textTransform: 'uppercase' }}>Height (cm)</p>
                <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: '500' }}>{userData?.height || 'Not provided'}</p>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '5px 0', color: '#999', fontSize: '12px', textTransform: 'uppercase' }}>Weight (kg)</p>
                <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: '500' }}>{userData?.weight || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section section--subtle">
        <div className="section-header"><h2>Your Bookings</h2></div>
        <div className="grid schedule-grid">
          {bookings.length===0 && (
            <div style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center' }}>
              <p className="muted" style={{ fontSize: '16px' }}>No bookings yet.</p>
              <p className="muted" style={{ fontSize: '13px' }}>Book a class from the Classes page to get started!</p>
            </div>
          )}
          {bookings.map(b=> (
            <div key={b.id} className="card schedule-card">
              <div className="card-header">
                <h3 className="schedule-title">{b.className || b.name}</h3>
                <div className="time-badge">{b.time || 'TBD'}</div>
              </div>
              <div className="schedule-meta">
                <span className="trainer-chip">{b.trainer || b.trainer_name || 'TBA'}</span>
                <span className="day-chip">{b.day || ''}</span>
              </div>
              <div style={{ marginTop: 8 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
