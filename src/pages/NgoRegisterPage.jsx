import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { registerNgo } from '../api';

export default function NgoRegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    darpanId: '',
    category: 'Food',
    location: '',
    foundedYear: '',
    logoEmoji: '❤️',
    description: '',
    websiteUrl: '',
    youtubeUrl: '',
    instagramUrl: '',
    donationUrl: '',
    googleFormUrl: '',
  });

  const [teamMembers, setTeamMembers] = useState([
    { name: '', role: '' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const filteredMembers = teamMembers.filter((m) => m.name.trim() !== '');

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        darpanId: formData.darpanId,
        darpan_id: formData.darpanId,
        category: formData.category,
        location: formData.location,
        foundedYear: Number(formData.foundedYear || new Date().getFullYear()),
        logoEmoji: formData.logoEmoji,
        description: formData.description,
        websiteUrl: formData.websiteUrl,
        youtubeUrl: formData.youtubeUrl,
        instagramUrl: formData.instagramUrl,
        donationUrl: formData.donationUrl,
        googleFormUrl: formData.googleFormUrl,
        // Backend stores JSON strings
        teamMembers: JSON.stringify(filteredMembers),
        team_members: JSON.stringify(filteredMembers),
        fundsBreakdown: JSON.stringify({ programs: 60, operations: 25, admin: 15 }),
      };

      await registerNgo(payload);
      setShowSuccessModal(true);

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMessage(err.message || 'Registration failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1, padding: '2rem 1.25rem' }}>
        <div className="form-card wide">
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem' }}>🎗️</span>
            <h1 style={{ fontSize: '2.1rem', marginTop: '0.4rem', color: 'var(--text-main)' }}>
              Register Your NGO
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
              Join BookMySeva and reach thousands of supporters.
            </p>
          </div>

          {/* Mandatory Red Error Banner */}
          {errorMessage && (
            <div className="alert-box alert-red">
              <span>🚨 Connection failed: {errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 1. Basic Information */}
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '0.5rem' }}>
              1. Basic Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>NGO Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Feeding Hands Foundation"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Darpan ID *</label>
                <input
                  type="text"
                  name="darpanId"
                  required
                  placeholder="MH/2018/0123456"
                  className="form-input"
                  value={formData.darpanId}
                  onChange={handleChange}
                />
                <div className="form-hint">Format: MH/2018/0123456 (NITI Aayog registration)</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Official Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="contact@organisation.org"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Account Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Choose a strong password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 2. Profile */}
            <h3 style={{ fontSize: '1.2rem', margin: '2rem 0 1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '0.5rem' }}>
              2. Organisation Profile
            </h3>

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
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location (City / State) *</label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="form-input"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="form-group">
                  <label>Founded Year</label>
                  <input
                    type="number"
                    name="foundedYear"
                    placeholder="2018"
                    className="form-input"
                    value={formData.foundedYear}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Logo Emoji</label>
                  <input
                    type="text"
                    maxLength={2}
                    name="logoEmoji"
                    placeholder="❤️"
                    className="form-input"
                    value={formData.logoEmoji}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Description (4 lines max)</label>
              <textarea
                name="description"
                rows={4}
                className="form-textarea"
                placeholder="Share your NGO mission, key beneficiaries, and track record..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* 3. Links */}
            <h3 style={{ fontSize: '1.2rem', margin: '2rem 0 1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '0.5rem' }}>
              3. Action & Public Links
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Donation URL *</label>
                <input
                  type="url"
                  name="donationUrl"
                  required
                  placeholder="https://your-ngo.org/donate"
                  className="form-input"
                  value={formData.donationUrl}
                  onChange={handleChange}
                />
                <div className="form-hint">Where users will donate directly without middleman</div>
              </div>

              <div className="form-group">
                <label>Volunteer Google Form URL *</label>
                <input
                  type="url"
                  name="googleFormUrl"
                  required
                  placeholder="https://forms.gle/..."
                  className="form-input"
                  value={formData.googleFormUrl}
                  onChange={handleChange}
                />
                <div className="form-hint">Where volunteers will sign up directly</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Website URL</label>
                <input
                  type="url"
                  name="websiteUrl"
                  placeholder="https://organisation.org"
                  className="form-input"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>YouTube Channel</label>
                <input
                  type="url"
                  name="youtubeUrl"
                  placeholder="https://youtube.com/@ngo"
                  className="form-input"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Instagram Handle / URL</label>
                <input
                  type="text"
                  name="instagramUrl"
                  placeholder="https://instagram.com/ngo"
                  className="form-input"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 4. Team Members */}
            <h3 style={{ fontSize: '1.2rem', margin: '2rem 0 1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '0.5rem' }}>
              4. Key Team Members
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '0.6rem' }}
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="form-input"
                    value={member.name}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Founder, Trustee, Field Lead)"
                    className="form-input"
                    value={member.role}
                    onChange={(e) => handleMemberChange(idx, 'role', e.target.value)}
                  />
                  {teamMembers.length > 1 && (
                    <button
                      type="button"
                      className="btn-danger-outline"
                      onClick={() => removeMemberRow(idx)}
                      title="Remove Member"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="btn-outline"
                style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}
                onClick={addMemberRow}
              >
                + Add Member
              </button>
            </div>

            {/* Amber Info Box */}
            <div className="alert-box alert-amber" style={{ margin: '2rem 0' }}>
              <span style={{ fontSize: '1.2rem' }}>🏛️</span>
              <div>
                <strong>Darpan Verification Protocol:</strong> Your Darpan ID will be verified by our admin team against the official NITI Aayog portal. Approval takes 24 hours.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <Link to="/" style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                ← Cancel and Return
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
              >
                {isSubmitting ? 'Submitting to Backend...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.6rem', color: 'var(--emerald-main)' }}>
              Application received!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              We'll verify your Darpan ID with NITI Aayog within 24 hours. Redirecting to home feed...
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
