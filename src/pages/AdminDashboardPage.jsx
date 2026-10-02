import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getNgos,
  getPendingNgos,
  getPosts,
  approveNgo,
  rejectNgo,
  deletePost,
  deleteNgo,
} from '../api/api';

export default function AdminDashboardPage() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [activeNgos, setActiveNgos] = useState([]);
  const [pendingNgos, setPendingNgos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  // Check auth
  useEffect(() => {
    if (auth?.role !== 'ADMIN') {
      navigate('/login?role=admin');
    } else {
      loadData();
    }
  }, [auth]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [actNgos, pendNgos, allPosts] = await Promise.all([
        getNgos(),
        getPendingNgos(auth?.token),
        getPosts(),
      ]);
      setActiveNgos(actNgos);
      setPendingNgos(pendNgos);
      setPosts(allPosts);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, name) => {
    try {
      await approveNgo(id, auth?.token);
      setNotification(`Approved ${name} successfully! NGO is now Active.`);
      setTimeout(() => setNotification(''), 4000);
      loadData();
    } catch (err) {
      alert(err.message || 'Error approving NGO');
    }
  };

  const handleReject = async (id, name) => {
    if (window.confirm(`Are you sure you want to reject ${name}?`)) {
      try {
        await rejectNgo(id, auth?.token);
        setNotification(`Application for ${name} rejected.`);
        setTimeout(() => setNotification(''), 4000);
        loadData();
      } catch (err) {
        alert(err.message || 'Error rejecting NGO');
      }
    }
  };

  const handleDeletePost = async (id, title) => {
    if (window.confirm(`Delete post "${title}"?`)) {
      await deletePost(id, auth?.token);
      loadData();
    }
  };

  const handleDeleteNgo = async (id, name) => {
    if (window.confirm(`Delete NGO "${name}" and all its posts?`)) {
      await deleteNgo(id, auth?.token);
      loadData();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Admin Header */}
      <header className="site-header" style={{ background: '#ffffff', borderBottom: '1px solid var(--border-card)' }}>
        <div className="container header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" className="brand-logo">
              <span>🎗️</span>
              <span>Book<span className="highlight">MySeva</span></span>
            </Link>
            <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
              ADMIN CONSOLE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" className="btn-link" target="_blank">
              View Public Site ↗
            </Link>
            <button onClick={handleLogout} className="btn-outline" style={{ fontSize: '0.85rem' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ flex: 1, padding: '2rem 1.25rem' }}>
        {notification && (
          <div className="alert-box alert-green" style={{ marginBottom: '1.5rem' }}>
            <span>✅</span>
            <span>{notification}</span>
          </div>
        )}

        {/* 2. Stats Row (3 Cards) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>Active NGOs</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              {activeNgos.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--emerald-main)', fontWeight: 600 }}>Darpan Verified</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>Total Activities / Posts</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              {posts.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--saffron-main)', fontWeight: 600 }}>Live on Feed</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>Pending Applications</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: pendingNgos.length > 0 ? 'var(--amber-main)' : 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              {pendingNgos.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--amber-main)', fontWeight: 600 }}>Awaiting Verification</div>
          </div>
        </div>

        {/* 3. Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <Link to="/admin/add-ngo" className="btn-primary" style={{ padding: '0.75rem 1.4rem' }}>
            <span>+</span>
            <span>Add NGO Manually</span>
          </Link>
          <Link to="/admin/add-post" className="btn-secondary" style={{ padding: '0.75rem 1.4rem' }}>
            <span>+</span>
            <span>Add Post</span>
          </Link>
        </div>

        {/* 4. Pending Applications Section */}
        <section style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-card)', padding: '1.75rem', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🔔</span> Pending Applications ({pendingNgos.length})
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
              Compare Darpan ID against NITI Aayog before approving
            </span>
          </div>

          {pendingNgos.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {pendingNgos.map((ngo) => (
                <div
                  key={ngo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.15rem',
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-card)',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>{ngo.logo_emoji || '🏢'}</span>
                      <strong style={{ fontSize: '1.05rem' }}>{ngo.name}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                        Applied recently
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      Darpan: <code>{ngo.darpan_id}</code> · Location: {ngo.location} · Category: {ngo.category}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <button
                      onClick={() => alert(`NGO Details:\nName: ${ngo.name}\nEmail: ${ngo.email}\nDescription: ${ngo.description}\nWebsite: ${ngo.website_url || 'N/A'}`)}
                      className="btn-outline"
                      style={{ fontSize: '0.85rem' }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleApprove(ngo.id, ngo.name)}
                      className="btn-secondary"
                      style={{ fontSize: '0.85rem', padding: '0.45rem 0.95rem' }}
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleReject(ngo.id, ngo.name)}
                      className="btn-danger-outline"
                      style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No pending applications. All registered organisations are reviewed.
            </div>
          )}
        </section>

        {/* 5. Active NGOs List */}
        <section style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-card)', padding: '1.75rem', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Active Verified NGOs</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {activeNgos.map((ngo) => (
              <div
                key={ngo.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span>{ngo.logo_emoji || '🏢'}</span>
                  <Link to={`/ngo/${ngo.id}`} style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                    {ngo.name}
                  </Link>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    · {ngo.category} · Trust {ngo.trust_score}%
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link
                    to={`/ngo/${ngo.id}`}
                    className="btn-outline"
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDeleteNgo(ngo.id, ngo.name)}
                    className="btn-danger-outline"
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Recent Posts List */}
        <section style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-card)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>All Activities & Posts</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span>🍛</span>
                  <Link to={`/post/${post.id}`} style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                    {post.title}
                  </Link>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    · by {post.ngo?.name || 'NGO'} · {post.event_date}
                  </span>
                  {Number(post.is_top_needed) === 1 && (
                    <span style={{ fontSize: '0.75rem', background: '#fee2e2', color: '#b91c1c', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                      🔥 Top Needed
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link
                    to={`/post/${post.id}`}
                    className="btn-outline"
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDeletePost(post.id, post.title)}
                    className="btn-danger-outline"
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
