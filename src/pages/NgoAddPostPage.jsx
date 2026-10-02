import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { createPost, getAllNgos } from '../api';
import { useAuth } from '../context/AuthContext';

export default function NgoAddPostPage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [ngoInfo, setNgoInfo] = useState(null);

  useEffect(() => {
    if (auth?.role !== 'NGO') {
      navigate('/login?role=ngo');
      return;
    }
    getAllNgos()
      .then((allNgos) => {
        const loggedEmail = auth?.user?.email?.toLowerCase();
        const found = allNgos.find(
          (n) =>
            String(n.id) === String(auth?.ngoId) ||
            n.email?.toLowerCase() === loggedEmail
        ) || allNgos[0];
        setNgoInfo(found);
      })
      .catch((err) => {
        console.error('Failed to load NGO info from backend:', err);
      });
  }, [auth]);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    raw_input: '',
    category: 'Food',
    impact_count: 150,
    funds_goal: 30000,
    funds_raised: 0,
    volunteers_needed: 10,
    event_date: new Date().toISOString().split('T')[0],
    status: 'UPCOMING',
    is_top_needed: false,
  });

  const [mediaUrls, setMediaUrls] = useState([
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80',
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMediaUrlChange = (index, value) => {
    const updated = [...mediaUrls];
    updated[index] = value;
    setMediaUrls(updated);
  };

  const addMediaUrlField = () => {
    if (mediaUrls.length < 5) {
      setMediaUrls([...mediaUrls, '']);
    }
  };

  const removeMediaUrlField = (index) => {
    if (mediaUrls.length > 1) {
      setMediaUrls(mediaUrls.filter((_, idx) => idx !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const validUrls = mediaUrls.filter((url) => url.trim().length > 0);

      const payload = {
        ngo_id: Number(ngoInfo?.id || auth?.ngoId || 1),
        title: formData.title,
        summary: formData.summary,
        raw_input: formData.raw_input,
        category: formData.category,
        impact_count: Number(formData.impact_count),
        funds_goal: Number(formData.funds_goal),
        funds_raised: Number(formData.funds_raised),
        volunteers_needed: Number(formData.volunteers_needed),
        is_top_needed: formData.is_top_needed ? true : false,
        status: formData.status,
        event_date: formData.event_date,
        media_urls: JSON.stringify(validUrls),
      };

      await createPost(payload);
      navigate('/ngo');
    } catch (err) {
      console.error('Failed to publish post to backend:', err);
      setErrorMessage(err.message || 'Failed to publish post');
      setIsSubmitting(false);
    }
  };

  const previewPost = {
    id: 9999,
    title: formData.title || 'Campaign Title Preview',
    summary: formData.summary || 'Summary preview will appear here in the live feed card...',
    category: formData.category,
    impact_count: formData.impact_count,
    funds_goal: formData.funds_goal,
    funds_raised: formData.funds_raised,
    volunteers_needed: formData.volunteers_needed,
    media_urls: mediaUrls.filter(Boolean),
    status: formData.status,
    event_date: formData.event_date,
    is_top_needed: formData.is_top_needed ? true : false,
    ngo: ngoInfo || {
      id: 1,
      name: 'Your Verified NGO',
      logoEmoji: '🏢',
      status: 'ACTIVE',
      donationUrl: 'https://example.org/donate',
      googleFormUrl: 'https://forms.google.com/volunteer',
    },
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1, padding: '2rem 1.25rem 3rem' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem' }}>Post New Activity</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Publish an activity update or call for seva directly under{' '}
              <strong>{ngoInfo?.name || 'Your NGO'}</strong> with live card simulation.
            </p>
          </div>
          <Link to="/ngo" className="btn-outline" style={{ fontSize: '0.85rem' }}>
            ← Return to Dashboard
          </Link>
        </div>

        {/* Mandatory Red Error Banner */}
        {errorMessage && (
          <div className="alert-box alert-red">
            <span>🚨 Connection failed: {errorMessage}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.75fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Form */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-card)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  background: 'var(--emerald-subtle)',
                  border: '1px solid var(--emerald-border)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.88rem',
                  color: 'var(--emerald-main)',
                  fontWeight: 600,
                }}
              >
                <span>✅</span>
                <span>
                  Publishing on behalf of: {ngoInfo?.logoEmoji || ngoInfo?.logo_emoji} {ngoInfo?.name} (Darpan: {ngoInfo?.darpanId || ngoInfo?.darpan_id})
                </span>
              </div>

              <div className="form-group">
                <label>Activity Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Free Ration Kit Distribution for 300 Families"
                  className="form-input"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Short Summary (Shown in Feed) *</label>
                <textarea
                  name="summary"
                  required
                  rows={2}
                  placeholder="Brief description of the drive, beneficiaries, and location..."
                  className="form-textarea"
                  value={formData.summary}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Field Notes / Volunteer Dispatch (Optional)</label>
                <textarea
                  name="raw_input"
                  rows={2}
                  placeholder="Quotes from ground workers or detailed impact testimony..."
                  className="form-textarea"
                  value={formData.raw_input}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Food">Food</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Environment">Environment</option>
                    <option value="Women">Women</option>
                    <option value="Animals">Animals</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Event Date</label>
                  <input
                    type="date"
                    name="event_date"
                    className="form-input"
                    value={formData.event_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>People Helped</label>
                  <input
                    type="number"
                    name="impact_count"
                    className="form-input"
                    value={formData.impact_count}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Funds Goal (₹)</label>
                  <input
                    type="number"
                    name="funds_goal"
                    className="form-input"
                    value={formData.funds_goal}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Funds Raised (₹)</label>
                  <input
                    type="number"
                    name="funds_raised"
                    className="form-input"
                    value={formData.funds_raised}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Volunteers</label>
                  <input
                    type="number"
                    name="volunteers_needed"
                    className="form-input"
                    value={formData.volunteers_needed}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Ground Photographs (3-5 URLs for slideshow)</label>
                {mediaUrls.map((url, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="url"
                      placeholder={`Photo URL #${idx + 1}`}
                      className="form-input"
                      value={url}
                      onChange={(e) => handleMediaUrlChange(idx, e.target.value)}
                    />
                    {mediaUrls.length > 1 && (
                      <button
                        type="button"
                        className="btn-danger-outline"
                        onClick={() => removeMediaUrlField(idx)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {mediaUrls.length < 5 && (
                  <button
                    type="button"
                    className="btn-outline"
                    style={{ fontSize: '0.8rem' }}
                    onClick={addMediaUrlField}
                  >
                    + Add Another Photo URL
                  </button>
                )}
              </div>

              <div style={{ margin: '1.25rem 0', background: 'var(--bg-main)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, color: '#b91c1c', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="is_top_needed"
                    checked={formData.is_top_needed}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  🔥 Mark as Most Needed (Urgent community appeal badge)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <Link to="/ngo" className="btn-outline">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ padding: '0.75rem 2rem' }}
                >
                  {isSubmitting ? 'Publishing to Backend...' : 'Publish Activity to Live Feed'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Live Simulation */}
          <div style={{ position: 'sticky', top: '5.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-light)' }}>
                Live Feed Preview Simulation
              </span>
              <span style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#047857', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                Real-Time
              </span>
            </div>
            <PostCard post={previewPost} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
