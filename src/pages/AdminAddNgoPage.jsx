import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { createNgoAdmin } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function AdminAddNgoPage() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    if (auth?.role !== 'ADMIN') {
      navigate('/login?role=admin');
    }
  }, [auth]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    darpan_id: '',
    category: 'Food',
    location: '',
    founded_year: new Date().getFullYear(),
    logo_emoji: '❤️',
    description: '',
    website_url: '',
    youtube_url: '',
    instagram_url: '',
    donation_url: '',
    google_form_url: '',
    is_verified: true,
    trust_score: 92,
  });

  const [teamMembers, setTeamMembers] = useState([{ name: '', role: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const addMemberRow = () => {
    setTeamMembers([...teamMembers, { name: '', role: '' }]);
  };

  const removeMemberRow = (index) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, idx) => idx !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        ...formData,
        founded_year: Number(formData.founded_year),
        trust_score: Number(formData.trust_score),
        status: formData.is_verified ? 'ACTIVE' : 'PENDING',
        team_members: teamMembers.filter((m) => m.name.trim() !== ''),
      };

      await createNgoAdmin(payload, auth?.token);
      navigate('/admin');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to add NGO');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1, padding: '2rem 1.25rem' }}>
        <div className="form-card wide">
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem' }}>Add NGO Manually (Admin)</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Directly onboard a verified organisation into the BookMySeva directory.
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

          <form onSubmit={handleSubmit}>
            {/* Status & Verification Box */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, color: '#166534', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="is_verified"
                  checked={formData.is_verified}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px' }}
                />
                ☑ Mark as Verified (Status = 'ACTIVE' directly)
              </label>
              <div style={{ fontSize: '0.78rem', color: '#15803d', marginTop: '0.25rem' }}>
                Verified organisations immediately appear in the public feed and Top 100 directory.
              </div>
            </div>

            {/* Basic Information */}
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '0.5rem' }}>
              1. Basic Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>NGO Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Organisation Legal Name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Darpan ID *</label>
                <input
                  type="text"
                  name="darpan_id"
                  required
                  placeholder="e.g. MH/2018/0123456"
                  className="form-input"
                  value={formData.darpan_id}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Login Credentials */}
            <h3 style={{ fontSize: '1.15rem', margin: '1.5rem 0 1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '0.5rem' }}>
              2. NGO Login Credentials
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Login Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="ngo@example.org"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Initial Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Set account password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Profile */}
            <h3 style={{ fontSize: '1.15rem', margin: '1.5rem 0 1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '0.5rem' }}>
              3. Profile & Metrics
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
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
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Mumbai"
                  className="form-input"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Logo Emoji</label>
                <input
                  type="text"
                  maxLength={2}
                  name="logo_emoji"
                  className="form-input"
                  value={formData.logo_emoji}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Initial Trust Score (%)</label>
                <input
                  type="number"
                  name="trust_score"
                  min="50"
                  max="100"
                  className="form-input"
                  value={formData.trust_score}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                rows={3}
                className="form-textarea"
                placeholder="NGO statement of purpose and verified impact..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Links */}
            <h3 style={{ fontSize: '1.15rem', margin: '1.5rem 0 1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '0.5rem' }}>
              4. Action Links
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Direct Donation URL *</label>
                <input
                  type="url"
                  name="donation_url"
                  required
                  placeholder="https://organisation.org/donate"
                  className="form-input"
                  value={formData.donation_url}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Volunteer Form URL *</label>
                <input
                  type="url"
                  name="google_form_url"
                  required
                  placeholder="https://forms.google.com/..."
                  className="form-input"
                  value={formData.google_form_url}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Link to="/admin" className="btn-outline">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ padding: '0.75rem 2rem' }}
              >
                {isSubmitting ? 'Saving NGO...' : 'Save NGO'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
