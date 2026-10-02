import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-logo" style={{ fontSize: '1.25rem' }}>
              <span>🎗️</span>
              <span>Book<span className="highlight">MySeva</span></span>
            </div>
            <p>
              BookMyShow for Verified NGOs. Discover authentic causes, inspect real impact, and take action in one click. Zero commission, true zero middleman.
            </p>
            <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="verified-badge" style={{ fontSize: '0.8rem', background: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-card)' }}>
                🏛️ NITI Aayog Darpan Verified
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--emerald-main)', background: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-card)' }}>
                💯 100% Direct Giving
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Live Seva Feed</Link></li>
              <li><Link to="/top-100">Top 100 NGOs</Link></li>
              <li><Link to="/register-ngo">Register an NGO</Link></li>
              <li><Link to="/login">NGO / Admin Portal</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>About Platform</h4>
            <ul>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); alert("BookMySeva bridges donors and volunteers with Darpan-verified NGOs with zero platform cut."); }}>How It Works</a></li>
              <li><a href="#darpan" onClick={(e) => { e.preventDefault(); alert("Every NGO on BookMySeva is verified with their official Government of India Darpan ID."); }}>Darpan Verification</a></li>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert("We never store user data or payment details. Donors donate directly on the NGO's payment gateway."); }}>Privacy Pledge</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); alert("Contact us: team@bookmyseva.app"); }}>Contact Team</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Our Pledge</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              "Every rupee and hour contributed must reach the ground without bureaucratic friction."
            </p>
            <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--saffron-main)', fontWeight: 600 }}>
              Built for India with ❤️
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} BookMySeva. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>Architected by Atharva</span>
            <span>·</span>
            <span>Built by Ketan & Anubhav</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
