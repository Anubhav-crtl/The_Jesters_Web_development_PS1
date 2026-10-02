import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VerifiedBadge from '../components/VerifiedBadge';
import { getAllPosts, getAllNgos } from '../api';
import { useAuth } from '../context/AuthContext';

export default function NgoDashboardPage() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [ngo, setNgo] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (auth?.role !== 'NGO') {
      navigate('/login?role=ngo');
      return;
    }
    loadNgoDashboard();
  }, [auth]);

  const loadNgoDashboard = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const [allPosts, allNgos] = await Promise.all([
        getAllPosts(),
        getAllNgos(),
      ]);

      const loggedEmail = auth?.user?.email?.toLowerCase();
      const currentNgo = allNgos.find(
        (n) =>
          String(n.id) === String(auth?.ngoId) ||
          n.email?.toLowerCase() === loggedEmail
      ) || allNgos[0] || {
        id: auth?.ngoId || 1,
        name: auth?.name || 'NGO Partner',
        logoEmoji: '🏢',
        status: 'ACTIVE',
        location: 'India',
        darpanId: 'Verified',
      };

      setNgo(currentNgo);

      // Filter own posts by logged-in ngo_id
      const filtered = Array.isArray(allPosts)
        ? allPosts.filter(
            (p) =>
              String(p.ngo_id) === String(currentNgo.id) ||
              String(p.ngo?.id) === String(currentNgo.id)
          )
        : [];

      setMyPosts(filtered);
    } catch (err) {
      console.error('Failed to load NGO dashboard from backend:', err);
      setErrorMessage(err.message || 'Failed to fetch NGO data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login?role=ngo');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading NGO portal from backend...</p>
      </div>
    );
  }

  const logo = ngo?.logoEmoji || ngo?.logo_emoji || '🏢';
  const darpan = ngo?.darpanId || ngo?.darpan_id || 'Pending';

  const totalRaised = myPosts.reduce((sum, p) => sum + Number(p.funds_raised || 0), 0);
  const totalVolunteers = myPosts.reduce((sum, p) => sum + Number(p.volunteers_needed || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header */}
      <header className="site-header" style={{ background: '#ffffff', borderBottom: '1px solid var(--border-card)' }}>
        <div className="container header-inner">
          <Link to="/" className="brand-logo">
            <span>🎗️</span>
            <span>Book<span className="highlight">MySeva</span></span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
              <span>Welcome,</span>
              <span>{logo}</span>
              <span>{ngo?.name}</span>
              <VerifiedBadge status={ngo?.status} showText={false} />
            </div>

            {ngo?.id && (
              <Link to={`/ngo/${ngo.id}`} className="btn-link" target="_blank" style={{ fontSize: '0.85rem' }}>
                View Public Page ↗
              </Link>
            )}

            <button onClick={handleLogout} className="btn-outline" style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ flex: 1, padding: '2rem 1.25rem 3.5rem' }}>
        {/* Mandatory Red Error Banner */}
        {errorMessage && (
          <div className="alert-box alert-red" style={{ marginBottom: '1.5rem' }}>
            <span>🚨 Connection failed: Backend not reachable. Error: {errorMessage}</span>
          </div>
        )}

        {/* 2. NGO Info Banner */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-card)',
            padding: '1.75rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.75rem' }}>{logo}</span>
              <h1 style={{ fontSize: '1.6rem' }}>{ngo?.name}</h1>
              <VerifiedBadge status={ngo?.status} />
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
              📍 {ngo?.location || 'India'} · 🏛️ Darpan: <code>{darpan}</code> · Category: {ngo?.category}
            </div>
          </div>

          <Link to="/ngo/add-post" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
            <span>+</span>
            <span>Post New Activity</span>
          </Link>
        </div>

        {/* 3. Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>My Posts Count</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              {myPosts.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--emerald-main)', fontWeight: 600 }}>Published on Feed</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>Funds Raised</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--saffron-main)', fontFamily: 'var(--font-heading)' }}>
              ₹{totalRaised.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--saffron-main)', fontWeight: 600 }}>Direct to Account</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>Volunteers Enrolled</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--emerald-main)', fontFamily: 'var(--font-heading)' }}>
              {totalVolunteers}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Via Google Form Signups</div>
          </div>
        </div>

        {/* 4. My Posts List */}
        <section style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-card)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem' }}>My Activities & Impact Drives ({myPosts.length})</h2>
            <Link to="/ngo/add-post" className="btn-outline" style={{ fontSize: '0.82rem' }}>
              + Add Another Drive
            </Link>
          </div>

          {myPosts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {myPosts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-card)',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.25rem' }}>🍛</span>
                      <strong style={{ fontSize: '1.1rem' }}>{post.title}</strong>
                      {Boolean(post.is_top_needed) && (
                        <span style={{ fontSize: '0.75rem', background: '#fee2e2', color: '#b91c1c', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 800 }}>
                          🔥 Top Needed
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span>{post.event_date}</span>
                      <span>·</span>
                      <span style={{ color: 'var(--emerald-main)', fontWeight: 600 }}>🟢 {post.status}</span>
                      <span>·</span>
                      <span>📊 {post.impact_count} people helped</span>
                      {post.funds_goal > 0 && (
                        <>
                          <span>·</span>
                          <span style={{ fontWeight: 600 }}>
                            ₹{Number(post.funds_raised || 0).toLocaleString('en-IN')} / ₹{Number(post.funds_goal || 0).toLocaleString('en-IN')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Link
                      to={`/post/${post.id}`}
                      className="btn-outline"
                      style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}
                    >
                      View Live
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌱</div>
              <p>You haven't posted any activities yet in the database.</p>
              <Link to="/ngo/add-post" className="btn-primary" style={{ marginTop: '1rem' }}>
                Create Your First Activity Post
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
