import React from 'react';
import { Link } from 'react-router-dom';

const heroImage = '/assets/images/gym-motivation.jpg';
// Use user-provided photos from assets
const img1 = '/assets/images/group-class.jpg';
const img2 = '/assets/images/personal-training.jpg';
const img3 = '/assets/images/facilities.jpg';

export default function Home(){
  return (
    <>
      <section className="hero hero-strong" style={{backgroundImage:`linear-gradient(rgba(5,5,8,0.6), rgba(5,5,8,0.25)), url(${heroImage})`}}>
        <div className="hero-inner">
          <h1 className="hero-title">Train Smarter. Live Stronger.</h1>
          <p className="hero-sub">Memberships, class bookings, and progress tracking — all in one place.</p>
          <div className="cta">
            <Link className="btn primary large" to="/auth">Get Started</Link>
          </div>
        </div>
      </section>

      <section className="section--cards">
        <div className="container">
          <h2>What we offer</h2>
          <div className="grid feature-grid">
            <article className="card feature">
              <img src={img1} alt="Group class" className="card-image" />
              <div className="card-body">
                <h3>Dynamic Classes</h3>
                <p className="muted">From Yoga Flow to HIIT — book the classes you love.</p>
              </div>
            </article>

            <article className="card feature">
              <img src={img2} alt="Personal trainer" className="card-image" />
              <div className="card-body">
                <h3>Expert Trainers</h3>
                <p className="muted">Certified coaches who help you meet goals safely.</p>
              </div>
            </article>

            <article className="card feature">
              <img src={img3} alt="Gym equipment" className="card-image" />
              <div className="card-body">
                <h3>Modern Facilities</h3>
                <p className="muted">Top equipment, clean space, and flexible schedules.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section--cta">
        <div className="container cta-box">
          <div>
            <h3>Ready to start?</h3>
            <p className="muted">Create an account and book your first class in minutes.</p>
          </div>
          <Link className="btn primary" to="/auth">Create account</Link>
        </div>
      </section>
    </>
  );
}
