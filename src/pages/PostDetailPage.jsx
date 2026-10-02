import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Slideshow from '../components/Slideshow';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import VerifiedBadge from '../components/VerifiedBadge';
import { getPostById, parseJsonSafe } from '../api';
import { useAuth } from '../context/AuthContext';

const MOCK_DONORS = [
  { name: 'Rahul Sharma', amount: 500, time: '2 min ago' },
  { name: 'Priya Narayanan', amount: 1000, time: '15 min ago' },
  { name: 'Asha Deshmukh', amount: 250, time: '45 min ago' },
  { name: 'Vikram Joshi', amount: 2500, time: '2 hrs ago' },
  { name: 'Sneha Patel', amount: 100, time: '4 hrs ago' },
];

export default function PostDetailPage() {
  const { id } = useParams();
  const { toggleSavePost, isPostSaved } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await getPostById(id);
      setPost(data);
    } catch (err) {
      console.error('Failed to fetch post detail from backend:', err);
      setErrorMessage(err.message || 'Post fetch failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem' }}>🎗️</div>
          <p>Loading activity details from backend...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (errorMessage || !post) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div className="container" style={{ padding: '3rem 1.25rem', textAlign: 'center' }}>
          <div className="alert-box alert-red" style={{ maxWidth: '600px', margin: '0 auto 2rem', textAlign: 'left' }}>
            <span>🚨 Connection failed: {errorMessage || 'Post not found'}</span>
          </div>
          <h2>Activity Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
            Could not retrieve post #{id} from the backend database.
          </p>
          <Link to="/" className="btn-primary">
            ← Back to Feed
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const {
    title,
    summary,
    raw_input,
    impact_count,
    funds_goal,
    funds_raised,
    volunteers_needed,
    media_urls,
    status,
    event_date,
    is_top_needed,
    ngo = {},
  } = post;

  const parsedMediaUrls = parseJsonSafe(media_urls, []);
  const donationUrl = ngo?.donationUrl || ngo?.donation_url;
  const volunteerUrl = ngo?.googleFormUrl || ngo?.google_form_url;
  const logoEmoji = ngo?.logoEmoji || ngo?.logo_emoji || '❤️';

  const isSaved = isPostSaved(post.id);

  const formattedDate = event_date
    ? new Date(event_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Oct 1, 2026';

  const handleBookMySeva = () => {
    if (donationUrl) {
      window.open(donationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRegisterSeva = () => {
    if (volunteerUrl) {
      window.open(volunteerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1, padding: '2rem 1.25rem' }}>
        {/* Back navigation & bookmark */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" className="btn-link" style={{ paddingLeft: 0 }}>
            ← Back to Feed
          </Link>

          <button
            onClick={() => toggleSavePost(post.id)}
            className="btn-outline"
            style={{ fontSize: '0.85rem' }}
          >
            <span>{isSaved ? '❤️ Saved in My Seva' : '🤍 Save for Seva'}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Column */}
          <div>
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-card)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: '2rem' }}>
              {/* Slideshow */}
              <div style={{ position: 'relative', width: '100%', height: '420px', background: '#000' }}>
                <Slideshow
                  media_urls={parsedMediaUrls}
                  title={title}
                  placeholderEmoji={logoEmoji}
                />
                
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
                  {Boolean(is_top_needed) && (
                    <div className="badge-top-needed" style={{ position: 'static' }}>
                      <span>🔥</span>
                      <span>MOST NEEDED</span>
                    </div>
                  )}
                  <div className="badge-80g" style={{ position: 'static' }}>
                    <span>🏛️</span>
                    <span>80G TAX BENEFIT</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: '2.25rem' }}>
                {/* NGO Row */}
                <Link
                  to={`/ngo/${ngo.id || 1}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    marginBottom: '1rem',
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{logoEmoji}</span>
                  <span>{ngo.name}</span>
                  <VerifiedBadge status={ngo.status} />
                </Link>

                {/* Title */}
                <h1 style={{ fontSize: '2.1rem', lineHeight: 1.3, marginBottom: '0.85rem' }}>
                  {title}
                </h1>

                {/* Meta Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>📅</span> {formattedDate}
                  </span>
                  <span>·</span>
                  <StatusBadge status={status} />
                  <span>·</span>
                  <span style={{ fontSize: '0.82rem', background: 'var(--teal-80g-subtle)', color: 'var(--teal-80g)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700 }}>
                    100% Direct Disbursement
                  </span>
                </div>

                {/* Impact Stat */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'var(--emerald-subtle)',
                      color: 'var(--emerald-main)',
                      padding: '0.55rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                    }}
                  >
                    <span>📊</span>
                    <span>{Number(impact_count || 0).toLocaleString('en-IN')} people helped so far</span>
                  </div>
                </div>

                {/* Summary */}
                <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {summary}
                </p>

                {/* Source Quote / Dispatch */}
                {raw_input && (
                  <div
                    style={{
                      background: 'var(--bg-card-subtle)',
                      borderLeft: '4px solid var(--saffron-main)',
                      padding: '1.25rem',
                      borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                      marginBottom: '2rem',
                      fontStyle: 'italic',
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                    }}
                  >
                    <div style={{ fontWeight: 700, fontStyle: 'normal', fontSize: '0.85rem', color: 'var(--saffron-main)', marginBottom: '0.4rem' }}>
                      🔗 Authentic Field Dispatch & Ground Log:
                    </div>
                    "{raw_input}"
                  </div>
                )}

                {/* Progress Bar */}
                {funds_goal > 0 && (
                  <div style={{ marginBottom: '2rem', padding: '1.25rem', background: '#faf8f5', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>Funds Requirement & Real-Time Progress</h4>
                    <ProgressBar funds_raised={funds_raised} funds_goal={funds_goal} />
                  </div>
                )}

                {/* Big Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: donationUrl && volunteerUrl ? '1fr 1fr' : '1fr', gap: '1rem', marginTop: '1.5rem' }}>
                  {donationUrl && (
                    <button
                      type="button"
                      onClick={handleBookMySeva}
                      className="btn-primary"
                      style={{ padding: '1rem', fontSize: '1.05rem', justifyContent: 'center' }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>💰</span>
                      <span>Book My Seva</span>
                    </button>
                  )}

                  {volunteerUrl && (
                    <button
                      type="button"
                      onClick={handleRegisterSeva}
                      className="btn-secondary"
                      style={{ padding: '1rem', fontSize: '1.05rem', justifyContent: 'center' }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>📝</span>
                      <span>Register for Seva</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div>
            {/* NGO Preview Card */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-light)', marginBottom: '1rem' }}>
                Organised By
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>{logoEmoji}</span>
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>{ngo.name}</h3>
                  <VerifiedBadge status={ngo.status} />
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                🏛️ Darpan: <code>{ngo.darpanId || ngo.darpan_id || 'Verified'}</code>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {ngo.description || 'Verified non-profit organisation committed to direct transparent public service.'}
              </p>

              <Link
                to={`/ngo/${ngo.id || 1}`}
                className="btn-outline"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}
              >
                View Full NGO Profile →
              </Link>
            </div>

            {/* Recent Donors Section */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem' }}>Recent Seva Contributors</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--emerald-main)', fontWeight: 700 }}>Live Feed</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {MOCK_DONORS.map((donor, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: '0.65rem',
                      borderBottom: idx === MOCK_DONORS.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                      fontSize: '0.88rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>👤</span>
                      <span style={{ fontWeight: 600 }}>{donor.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, color: 'var(--saffron-main)' }}>
                        ₹{donor.amount.toLocaleString('en-IN')}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                        {donor.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
