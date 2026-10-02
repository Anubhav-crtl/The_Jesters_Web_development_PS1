import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const roleParam = searchParams.get('role');
  const [activeTab, setActiveTab] = useState(roleParam === 'admin' ? 'admin' : 'ngo');

  const [email, setEmail] = useState(
    roleParam === 'admin' ? 'admin@bookmyseva.app' : 'ngo@feedinghands.org'
  );
  const [password, setPassword] = useState(
    roleParam === 'admin' ? 'admin123' : 'ngo123'
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    if (tab === 'admin') {
      setEmail('admin@bookmyseva.app');
      setPassword('admin123');
    } else {
      setEmail('ngo@feedinghands.org');
      setPassword('ngo123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.role === 'ADMIN') {
        navigate('/admin');
      } else if (res.role === 'NGO') {
        navigate('/ngo');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.25rem' }}>
        {/* Split-View Composition (Synthesizing Stitch + Functional UI) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            maxWidth: '1050px',
            width: '100%',
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-card)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}
        >
          {/* Left Pane: Trust & Vision Showcase */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
              color: '#ffffff',
              padding: '3rem 2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 600, color: '#f59e0b', marginBottom: '1.5rem' }}>
                <span>🏛️</span> NITI Aayog Darpan Compliant
              </div>

              <h2 style={{ fontSize: '2.1rem', color: '#ffffff', lineHeight: 1.25, marginBottom: '1rem' }}>
                Real People.<br />Real Ground Impact.
              </h2>
              <p style={{ color: '#a8a29e', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                BookMySeva unites authentic grassroots organisations with transparent supporters. We operate on true zero-middleman architecture.
              </p>

              {/* Pillars list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ color: '#10b981', fontSize: '1.2rem', lineHeight: 1 }}>✓</span>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#fafaf9' }}>100% Direct Giving</strong>
                    <div style={{ fontSize: '0.8rem', color: '#78716c' }}>Donations flow directly into the NGO's verified payment gateway.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ color: '#10b981', fontSize: '1.2rem', lineHeight: 1 }}>✓</span>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#fafaf9' }}>Section 80G Tax Compliance</strong>
                    <div style={{ fontSize: '0.8rem', color: '#78716c' }}>All partner entities are audited against tax exemption criteria.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ color: '#10b981', fontSize: '1.2rem', lineHeight: 1 }}>✓</span>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#fafaf9' }}>Dual Volunteer & Donor Hub</strong>
                    <div style={{ fontSize: '0.8rem', color: '#78716c' }}>Fund urgent drives or register for ground volunteering in one click.</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '1.25rem', marginTop: '2.5rem', fontSize: '0.8rem', color: '#78716c' }}>
              BookMySeva Partner & Governance Gateway
            </div>
          </div>

          {/* Right Pane: Login Form Card */}
          <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.35rem' }}>Welcome Back</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Sign in to manage verified drives and dispatch reports
              </p>
            </div>

            {/* Two Tabs */}
            <div className="tabs-nav">
              <button
                type="button"
                className={activeTab === 'ngo' ? 'active' : ''}
                onClick={() => handleTabChange('ngo')}
              >
                🏢 Login as NGO
              </button>
              <button
                type="button"
                className={activeTab === 'admin' ? 'active' : ''}
                onClick={() => handleTabChange('admin')}
              >
                🛡️ Login as Admin
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="alert-box alert-red">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder={activeTab === 'admin' ? 'admin@bookmyseva.app' : 'ngo@organisation.org'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.95rem' }}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            {/* Notes & Hints */}
            <div style={{ marginTop: '1.5rem', fontSize: '0.88rem' }}>
              {activeTab === 'ngo' && (
                <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', textAlign: 'center' }}>
                  Don't have an NGO account?{' '}
                  <Link to="/register-ngo" style={{ color: 'var(--saffron-main)', fontWeight: 700 }}>
                    Register as NGO
                  </Link>
                </p>
              )}

              <div
                style={{
                  background: 'var(--bg-card-subtle)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-card)',
                }}
              >
                <strong>💡 Quick Demo Access:</strong>
                {activeTab === 'admin' ? (
                  <div>Admin: <code>admin@bookmyseva.app</code> / <code>admin123</code></div>
                ) : (
                  <div>NGO: <code>ngo@feedinghands.org</code> / <code>ngo123</code></div>
                )}
              </div>

              <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                <Link to="/" style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
