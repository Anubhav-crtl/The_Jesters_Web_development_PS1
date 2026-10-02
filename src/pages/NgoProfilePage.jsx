import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import VerifiedBadge from '../components/VerifiedBadge';
import DonutChart from '../components/DonutChart';
import GaugeChart from '../components/GaugeChart';
import { getNgoById } from '../api/api';

export default function NgoProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNgo();
  }, [id]);

  const fetchNgo = async () => {
    setLoading(true);
    try {
      const data = await getNgoById(id);
      setNgo(data);
    } catch (err) {
      setError(err.message || 'NGO not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem' }}>🏢</div>
          <p>Loading NGO profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !ngo) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <h2>NGO Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
            We could not find the NGO profile you requested.
          </p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            ← Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const {
    name,
    description,
    logo_emoji,
    category,
    location,
    founded_year,
    darpan_id,
    trust_score,
    hero_image_url,
    website_url,
    youtube_url,
    instagram_url,
    team_members = [],
    funds_breakdown = {},
    posts = [],
    total_impact = 0,
    total_raised = 0,
    total_posts = 0,
    status,
  } = ngo;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1, padding: '1.5rem 1.25rem 3rem' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn-link"
            style={{ paddingLeft: 0, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ← Back
          </button>
        </div>

        {/* Hero Banner */}
        <div
          style={{
            width: '100%',
            height: '280px',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '-60px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <img
            src={hero_image_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80'}
            alt={`${name} cover`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%)',
            }}
          />
        </div>

        {/* Profile Header Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-card)',
            padding: '2rem',
            position: 'relative',
            zIndex: 10,
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              {/* NGO Identity */}
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-main)',
                  border: '2px solid var(--border-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3.2rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {logo_emoji || '🏢'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '2.1rem' }}>{name}</h1>
                  <VerifiedBadge status={status} />
                  <span style={{ fontSize: '0.78rem', background: 'var(--teal-80g-subtle)', color: 'var(--teal-80g)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700 }}>
                    80G TAX CERTIFIED
                  </span>
                  <span style={{ fontSize: '0.78rem', background: '#ecfdf5', color: '#047857', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700 }}>
                    12A COMPLIANT
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                  <span>📍 {location || 'India'}</span>
                  {founded_year && <span>· Est. {founded_year}</span>}
                  <span>·</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    🏛️ Darpan: <code>{darpan_id || 'Pending'}</code>
                  </span>
                </div>
              </div>
            </div>

            {/* Connect Links */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {website_url && (
                <a
                  href={website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ fontSize: '0.85rem' }}
                >
                  🌐 Website
                </a>
              )}
              {youtube_url && (
                <a
                  href={youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ fontSize: '0.85rem' }}
                >
                  📺 YouTube
                </a>
              )}
              {instagram_url && (
                <a
                  href={instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ fontSize: '0.85rem' }}
                >
                  📷 Instagram
                </a>
              )}
            </div>
          </div>

          {/* Tags row */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <span
              style={{
                background: 'var(--saffron-subtle)',
                color: 'var(--saffron-main)',
                border: '1px solid var(--saffron-border)',
                fontWeight: 600,
                fontSize: '0.82rem',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {category || 'Community Service'}
            </span>
            <span
              style={{
                background: 'var(--emerald-subtle)',
                color: 'var(--emerald-main)',
                border: '1px solid var(--emerald-border)',
                fontWeight: 600,
                fontSize: '0.82rem',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Government Darpan Verified
            </span>
            <span
              style={{
                background: 'var(--bg-main)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-card)',
                fontWeight: 500,
                fontSize: '0.82rem',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Zero Middleman Direct Allocation
            </span>
          </div>

          {/* Description */}
          <div style={{ marginTop: '1.25rem', color: 'var(--text-main)', fontSize: '1.02rem', lineHeight: 1.6 }}>
            <p>{description}</p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--emerald-main)', fontFamily: 'var(--font-heading)' }}>
              {Number(total_impact || 0).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>People Helped</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--saffron-main)', fontFamily: 'var(--font-heading)' }}>
              ₹{Number(total_raised || 0).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>Funds Raised</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              {total_posts}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>Verified Activities</div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>📊 Fund Utilization & Impact Distribution</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Audited breakdown of expenditure per rupee raised on BookMySeva.
            </p>
            <DonutChart data={funds_breakdown} />
          </div>

          <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', textAlign: 'center' }}>🛡️ Trust & Compliance Score</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
              Ranked on NITI Aayog filings & field records.
            </p>
            <GaugeChart score={trust_score || 90} />
          </div>
        </div>

        {/* Team Members */}
        {team_members && team_members.length > 0 && (
          <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>👥 Core Team Members</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {team_members.map((member, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem',
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      border: '1px solid var(--border-card)',
                    }}
                  >
                    👤
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{member.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{member.role || 'Member'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activities Grid */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>Recent Activities & Field Drives</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                All transparent verified public updates by {name}
              </p>
            </div>
          </div>

          {posts.length > 0 ? (
            <div className="feed-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-illustration">🎗️</div>
              <h3>No activities logged yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>This NGO has not published recent updates yet.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
