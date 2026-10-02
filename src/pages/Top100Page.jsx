import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VerifiedBadge from '../components/VerifiedBadge';
import { getTop100 } from '../api/api';

export default function Top100Page() {
  const [rankedList, setRankedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTop100();
  }, []);

  const fetchTop100 = async () => {
    setLoading(true);
    try {
      const data = await getTop100();
      setRankedList(data);
    } catch (err) {
      console.error('Failed to load top 100', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1, padding: '2.5rem 1.25rem 4rem' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
            Top 100 NGOs by Impact
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto' }}>
            Ranked by trust score, funds raised, and verified ground activity.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎗️</div>
            <p>Compiling trust and impact rankings...</p>
          </div>
        ) : rankedList.length > 0 ? (
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-card)',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
              maxWidth: '900px',
              margin: '0 auto',
            }}
          >
            {rankedList.map((item, idx) => {
              const isTop3 = item.rank <= 3;
              const rankBadgeColor =
                item.rank === 1 ? '#F59E0B' : item.rank === 2 ? '#94A3B8' : item.rank === 3 ? '#B45309' : '#64748B';

              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.75rem',
                    borderBottom: idx === rankedList.length - 1 ? 'none' : '1px solid var(--border-card)',
                    background: isTop3 ? 'rgba(253, 243, 237, 0.35)' : '#ffffff',
                    transition: 'background 0.2s',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {/* Rank Number */}
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: isTop3 ? rankBadgeColor : 'var(--bg-main)',
                        color: isTop3 ? '#ffffff' : 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.05rem',
                        boxShadow: isTop3 ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                      }}
                    >
                      #{item.rank}
                    </div>

                    {/* Logo Emoji */}
                    <div
                      style={{
                        fontSize: '2rem',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#ffffff',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {item.logo_emoji || '🏢'}
                    </div>

                    {/* NGO Details */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                          <Link to={`/ngo/${item.id}`} style={{ color: 'inherit' }}>
                            {item.name}
                          </Link>
                        </h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                        <span>📍 {item.location || 'India'}</span>
                        <span>·</span>
                        <span style={{ fontWeight: 600 }}>{item.category || 'General'}</span>
                        <span>·</span>
                        <VerifiedBadge status={item.status} />
                        <span>·</span>
                        <span style={{ color: 'var(--emerald-main)', fontWeight: 700 }}>
                          Trust: {item.trust_score}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score & View Button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>
                        Score
                      </div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--saffron-main)', fontFamily: 'var(--font-heading)' }}>
                        {item.score}
                      </div>
                    </div>

                    <Link
                      to={`/ngo/${item.id}`}
                      className="btn-outline"
                      style={{ fontSize: '0.85rem', padding: '0.45rem 0.95rem' }}
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-illustration">🏆</div>
            <h3>No Ranked NGOs yet</h3>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
