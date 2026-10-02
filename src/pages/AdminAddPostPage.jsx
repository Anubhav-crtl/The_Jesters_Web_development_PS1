import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { getNgos, createPost } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function AdminAddPostPage() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    if (auth?.role !== 'ADMIN') {
      navigate('/login?role=admin');
    }
  }, [auth]);

  const [ngos, setNgos] = useState([]);
  const [formData, setFormData] = useState({
    ngo_id: '',
    title: '',
    summary: '',
    raw_input: '',
    category: 'Food',
    impact_count: 500,
    funds_goal: 50000,
    funds_raised: 12500,
    volunteers_needed: 15,
    event_date: new Date().toISOString().split('T')[0],
    status: 'COMPLETED',
    is_top_needed: false,
  });

  const [mediaUrls, setMediaUrls] = useState([
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80',
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadActiveNgos() {
      const data = await getNgos();
      setNgos(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, ngo_id: data[0].id }));
      }
    }
    loadActiveNgos();
  }, []);

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
    if (!formData.ngo_id) {
      setErrorMessage('Please select an NGO');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        ...formData,
        ngo_id: Number(formData.ngo_id),
        impact_count: Number(formData.impact_count),
        funds_goal: Number(formData.funds_goal),
        funds_raised: Number(formData.funds_raised),
        volunteers_needed: Number(formData.volunteers_needed),
        is_top_needed: formData.is_top_needed ? 1 : 0,
        media_urls: mediaUrls.filter((url) => url.trim().length > 0),
      };

      await createPost(payload, auth?.token);
      navigate('/admin');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to publish post');
      setIsSubmitting(false);
    }
  };

  // Construct preview post
  const selectedNgo = ngos.find((n) => String(n.id) === String(formData.ngo_id)) || {
    id: 1,
    name: 'Selected Verified NGO',
    logo_emoji: '❤️',
    status: 'ACTIVE',
    donation_url: 'https://example.org/donate',
    google_form_url: 'https://forms.google.com/volunteer',
  };

  const previewPost = {
    id: 9999,
    title: formData.title || 'Campaign Title Preview',
    summary: formData.summary || 'Summary preview will appear here in the live card...',
    category: formData.category,
    impact_count: formData.impact_count,
    funds_goal: formData.funds_goal,
    funds_raised: formData.funds_raised,
    volunteers_needed: formData.volunteers_needed,
    media_urls: mediaUrls.filter(Boolean),
    status: formData.status,
    event_date: formData.event_date,
    is_top_needed: formData.is_top_needed ? 1 : 0,
    ngo: selectedNgo,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1, padding: '2rem 1.25rem 3rem' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem' }}>Publish New Activity (Admin Console)</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              65/35 Publishing Engine with real-time card simulation preview.
            </p>
          </div>
          <Link to="/admin" className="btn-outline" style={{ fontSize: '0.85rem' }}>
            ← Return to Dashboard
          </Link>
        </div>

        {errorMessage && (
          <div className="alert-box alert-red">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 65/35 Two-Column Architecture */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.75fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Left: Form Engine */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-card)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Verified NGO *</label>
                <select
                  name="ngo_id"
                  required
                  className="form-select"
                  value={formData.ngo_id}
                  onChange={handleChange}
                >
                  {ngos.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.logo_emoji || '🏢'} {n.name} ({n.location} - Darpan: {n.darpan_id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Activity Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Free Ration Kit Distribution in Tribal Belt"
                  className="form-input"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Summary (Brief for Feed Card) *</label>
                <textarea
                  name="summary"
                  required
                  rows={2}
                  placeholder="e.g. 500 dry ration packages distributed to daily-wage earners..."
                  className="form-textarea"
                  value={formData.summary}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Field Dispatch / Ground Log</label>
                <textarea
                  name="raw_input"
                  rows={2}
                  placeholder="Ground testimony or direct quotes from field workers..."
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
                <label>Media URLs (3-5 URLs for slideshow)</label>
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
                    + Add Another Image URL
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
                  🔥 Mark as Most Needed (High priority urgent appeal badge)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <Link to="/admin" className="btn-outline">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ padding: '0.75rem 2rem' }}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Activity to Live Feed'}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Sticky Real-Time Feed Card Simulation */}
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
