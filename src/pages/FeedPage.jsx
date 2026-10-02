import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { getAllPosts } from '../api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Food', 'Education', 'Health', 'Environment', 'Women', 'Animals'];
const CITIES = ['All Cities', 'Mumbai', 'Hyderabad', 'Pune', 'Nagpur', 'Bengaluru', 'Ahmedabad', 'Delhi'];

export default function FeedPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { savedPostIds } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('');
  const [mostNeededOnly, setMostNeededOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCityModal, setShowCityModal] = useState(false);

  const showSavedOnly = searchParams.get('saved') === 'true';

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts from backend:', err);
      setErrorMessage(err.message || 'Unknown network error');
    } finally {
      setLoading(false);
    }
  };

  const handleTileClick = (type) => {
    if (type === 'top-100') {
      navigate('/top-100');
    } else if (type === 'category') {
      const el = document.getElementById('category-tabs-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'city') {
      setShowCityModal(true);
    } else if (type === 'most-needed') {
      setMostNeededOnly((prev) => !prev);
    } else if (type === 'verified') {
      setVerifiedOnly((prev) => !prev);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedCity('');
    setMostNeededOnly(false);
    setVerifiedOnly(false);
    setSearchQuery('');
    setSearchParams({});
  };

  // Filter posts on client if user applies category / city / most needed
  let filteredPosts = Array.isArray(posts) ? [...posts] : [];

  if (showSavedOnly) {
    filteredPosts = filteredPosts.filter((p) => savedPostIds.includes(p.id));
  }
  if (selectedCategory !== 'All') {
    filteredPosts = filteredPosts.filter(
      (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }
  if (selectedCity && selectedCity !== 'All Cities') {
    filteredPosts = filteredPosts.filter(
      (p) => p.ngo?.location?.toLowerCase() === selectedCity.toLowerCase()
    );
  }
  if (mostNeededOnly) {
    filteredPosts = filteredPosts.filter((p) => Boolean(p.is_top_needed));
  }
  if (verifiedOnly) {
    filteredPosts = filteredPosts.filter((p) => p.ngo?.status === 'ACTIVE');
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        p.ngo?.name?.toLowerCase().includes(q)
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        searchVal={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="container" style={{ flex: 1 }}>
        {/* Mandatory Red Error Banner if backend fails */}
        {errorMessage && (
          <div
            className="alert-box alert-red"
            style={{
              margin: '1.5rem 0',
              padding: '1rem 1.25rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>🚨 Connection failed: Backend not reachable. Error: {errorMessage}</span>
            <button
              onClick={fetchPosts}
              className="btn-danger-outline"
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Hero Section */}
        <section style={{ padding: '2.5rem 0 1.25rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.4rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Discover NGOs doing real work.
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto', fontWeight: 500 }}>
            Track every rupee. Fund what matters. Direct giving with zero middleman and government Darpan compliance.
          </p>
        </section>

        {/* Discovery Grid */}
        <section className="discovery-section">
          <div className="discovery-grid">
            {/* Tile 1: Top 100 */}
            <div
              className="discovery-tile"
              onClick={() => handleTileClick('top-100')}
              title="View Top 100 Ranked NGOs"
            >
              <div className="discovery-tile-icon">🏆</div>
              <div>
                <div className="discovery-tile-label">Top 100 NGOs</div>
                <div className="discovery-tile-sub">Verified rankings</div>
              </div>
            </div>

            {/* Tile 2: Category */}
            <div
              className="discovery-tile"
              onClick={() => handleTileClick('category')}
              title="Explore by Cause Category"
            >
              <div className="discovery-tile-icon">🍛</div>
              <div>
                <div className="discovery-tile-label">By Category</div>
                <div className="discovery-tile-sub">Food · Health · Edu</div>
              </div>
            </div>

            {/* Tile 3: City */}
            <div
              className={`discovery-tile ${selectedCity && selectedCity !== 'All Cities' ? 'active' : ''}`}
              onClick={() => handleTileClick('city')}
              title="Filter by City"
            >
              <div className="discovery-tile-icon">📍</div>
              <div>
                <div className="discovery-tile-label">
                  {selectedCity && selectedCity !== 'All Cities' ? selectedCity : 'By City'}
                </div>
                <div className="discovery-tile-sub">Delhi · Mumbai · BLR</div>
              </div>
            </div>

            {/* Tile 4: Most Needed */}
            <div
              className={`discovery-tile ${mostNeededOnly ? 'active' : ''}`}
              onClick={() => handleTileClick('most-needed')}
              title="Filter Urgent Causes"
            >
              <div className="discovery-tile-icon">🔥</div>
              <div>
                <div className="discovery-tile-label">Most Needed Now</div>
                <div className="discovery-tile-sub">Urgent relief causes</div>
              </div>
            </div>

            {/* Tile 5: Verified */}
            <div
              className={`discovery-tile ${verifiedOnly ? 'active' : ''}`}
              onClick={() => handleTileClick('verified')}
              title="Show Only Active Verified NGOs"
            >
              <div className="discovery-tile-icon">✅</div>
              <div>
                <div className="discovery-tile-label">Verified Only</div>
                <div className="discovery-tile-sub">100% Darpan & 80G</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Indicators */}
        {(selectedCategory !== 'All' || selectedCity || mostNeededOnly || verifiedOnly || searchQuery || showSavedOnly) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>Active Filters:</span>
              {showSavedOnly && <span className="verified-badge" style={{ background: '#fef2f2', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>❤️ Saved Seva</span>}
              {selectedCategory !== 'All' && <span className="verified-badge" style={{ background: '#fff7ed', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Category: {selectedCategory}</span>}
              {selectedCity && selectedCity !== 'All Cities' && <span className="verified-badge" style={{ background: '#f0fdf4', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>City: {selectedCity}</span>}
              {mostNeededOnly && <span className="verified-badge" style={{ background: '#fef2f2', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>🔥 Urgent</span>}
              {verifiedOnly && <span className="verified-badge" style={{ background: '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>✅ Verified Only</span>}
              {searchQuery && <span className="verified-badge" style={{ background: '#f5f3ff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Search: "{searchQuery}"</span>}
            </div>
            <button
              onClick={clearAllFilters}
              className="btn-outline"
              style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Category Tabs */}
        <div id="category-tabs-section" className="category-tabs-container">
          <div className="category-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'Food' && '🍛'}
                {cat === 'Education' && '📚'}
                {cat === 'Health' && '🩺'}
                {cat === 'Environment' && '🌱'}
                {cat === 'Women' && '🛡️'}
                {cat === 'Animals' && '🐾'}
                {cat === 'All' && '🌟'}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feed Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎗️</div>
            <p>Fetching verified ground activities from backend...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <section className="feed-grid">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        ) : (
          <div className="empty-state">
            <div className="empty-state-illustration">❤️</div>
            <h3 className="empty-state-title">No activities found.</h3>
            <p className="empty-state-sub">
              {errorMessage
                ? `Connection to backend failed: ${errorMessage}`
                : "No activities currently matching your filters."}
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={fetchPosts}
            >
              Refresh Feed
            </button>
          </div>
        )}
      </main>

      {/* City Filter Modal */}
      {showCityModal && (
        <div className="modal-overlay" onClick={() => setShowCityModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span>📍</span> Select City
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', margin: '1.5rem 0' }}>
              {CITIES.map((city) => (
                <button
                  key={city}
                  type="button"
                  className={`btn-outline ${selectedCity === city || (city === 'All Cities' && !selectedCity) ? 'active' : ''}`}
                  style={{
                    borderColor: (selectedCity === city || (city === 'All Cities' && !selectedCity)) ? 'var(--saffron-main)' : undefined,
                    background: (selectedCity === city || (city === 'All Cities' && !selectedCity)) ? 'var(--saffron-subtle)' : undefined,
                    color: (selectedCity === city || (city === 'All Cities' && !selectedCity)) ? 'var(--saffron-main)' : undefined,
                  }}
                  onClick={() => {
                    setSelectedCity(city === 'All Cities' ? '' : city);
                    setShowCityModal(false);
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn-outline"
              style={{ width: '100%' }}
              onClick={() => setShowCityModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
