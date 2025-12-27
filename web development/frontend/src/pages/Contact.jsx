import React from 'react';

export default function Contact(){
  return (
    <section className="page container">
      <div className="section section--subtle">
        <div className="section-header"><h2>Contact Us</h2></div>
        <div className="card">
          <h3>Contact</h3>
          <p className="muted">Phone: <a href="tel:+302310567890">+30 2310567890</a><br/>
          Email: <a href="mailto:info@gymdb.example">info@gymdb.example</a></p>

          <h3>Opening Hours</h3>
          <p className="muted">Mon–Fri: 06:00 — 22:00<br/>Sat: 08:00 — 18:00<br/>Sun: Closed</p>

          <div className="section-divider" />

          <h3>Gym Location</h3>
          <p className="muted">Kamara (Arch of Galerius)<br/>Thessaloniki, Greece</p>

          <div className="map-embed map-embed--small" aria-hidden="false">
            <iframe
              title="Kamara Thessaloniki map"
              src="https://www.google.com/maps?q=Kamara%2C%20Thessaloniki%2C%20Greece&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>


        </div>
      </div>
    </section>
  );
}
