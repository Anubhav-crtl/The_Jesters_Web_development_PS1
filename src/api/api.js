import { initialNgos, initialPosts } from './mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const STORAGE_PREFIX = 'bms_';

// Persistent Local Store initialization
function getStored(key, fallback) {
  try {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage failed', e);
  }
}

let ngosState = getStored('ngos', initialNgos);
let postsState = getStored('posts', initialPosts);

function saveState() {
  setStored('ngos', ngosState);
  setStored('posts', postsState);
}

// Helper to embed NGO into post
function attachNgoToPost(post) {
  const ngo = ngosState.find((n) => n.id === post.ngo_id) || {
    id: post.ngo_id || 0,
    name: "Independent Cause",
    logo_emoji: "🎗️",
    status: "ACTIVE",
    donation_url: "https://bookmyseva.app/donate",
    google_form_url: "https://bookmyseva.app/volunteer",
    location: "India",
    trust_score: 85
  };
  return {
    ...post,
    ngo: {
      id: ngo.id,
      name: ngo.name,
      logo_emoji: ngo.logo_emoji,
      status: ngo.status,
      description: ngo.description,
      donation_url: ngo.donation_url,
      google_form_url: ngo.google_form_url,
      location: ngo.location,
      category: ngo.category,
      darpan_id: ngo.darpan_id,
      trust_score: ngo.trust_score
    }
  };
}

// 1. GET /api/posts
export async function getPosts(filters = {}) {
  try {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${BASE_URL}/posts${query ? '?' + query : ''}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback to local store
  }

  let results = postsState.map(attachNgoToPost);

  if (filters.category && filters.category !== 'All') {
    results = results.filter(
      (p) => p.category?.toLowerCase() === filters.category.toLowerCase()
    );
  }
  if (filters.city) {
    results = results.filter(
      (p) => p.ngo?.location?.toLowerCase() === filters.city.toLowerCase()
    );
  }
  if (filters.is_top_needed !== undefined && filters.is_top_needed !== null && filters.is_top_needed !== '') {
    results = results.filter((p) => Number(p.is_top_needed) === 1);
  }
  if (filters.verified_only) {
    results = results.filter((p) => p.ngo?.status === 'ACTIVE');
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        p.ngo?.name?.toLowerCase().includes(q)
    );
  }

  // Backend sorting rule: is_top_needed DESC, event_date ASC
  results.sort((a, b) => {
    if ((b.is_top_needed || 0) !== (a.is_top_needed || 0)) {
      return (b.is_top_needed || 0) - (a.is_top_needed || 0);
    }
    return new Date(a.event_date || 0) - new Date(b.event_date || 0);
  });

  return results;
}

// 2. GET /api/posts/:id
export async function getPostById(id) {
  try {
    const res = await fetch(`${BASE_URL}/posts/${id}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  const post = postsState.find((p) => String(p.id) === String(id));
  if (!post) throw new Error('Post not found');
  return attachNgoToPost(post);
}

// 3. POST /api/posts
export async function createPost(postData, token = '') {
  try {
    const res = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(postData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  const newPost = {
    ...postData,
    id: postsState.length ? Math.max(...postsState.map((p) => p.id)) + 1 : 1,
    impact_count: Number(postData.impact_count || 0),
    funds_goal: Number(postData.funds_goal || 0),
    funds_raised: Number(postData.funds_raised || 0),
    volunteers_needed: Number(postData.volunteers_needed || 0),
    is_top_needed: postData.is_top_needed ? 1 : 0,
    media_urls: Array.isArray(postData.media_urls)
      ? postData.media_urls.filter(Boolean)
      : [],
    status: postData.status || 'UPCOMING',
    event_date: postData.event_date || new Date().toISOString().split('T')[0]
  };

  postsState = [newPost, ...postsState];
  saveState();
  return attachNgoToPost(newPost);
}

// 4. GET /api/ngos (Active)
export async function getNgos() {
  try {
    const res = await fetch(`${BASE_URL}/ngos`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  return ngosState.filter((n) => n.status === 'ACTIVE');
}

// 5. GET /api/ngos/:id
export async function getNgoById(id) {
  try {
    const res = await fetch(`${BASE_URL}/ngos/${id}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  const ngo = ngosState.find((n) => String(n.id) === String(id));
  if (!ngo) throw new Error('NGO not found');

  const ngoPosts = postsState
    .filter((p) => String(p.ngo_id) === String(id))
    .map(attachNgoToPost);

  return {
    ...ngo,
    posts: ngoPosts,
    total_impact: ngoPosts.reduce((acc, p) => acc + (p.impact_count || 0), 0),
    total_raised: ngoPosts.reduce((acc, p) => acc + (p.funds_raised || 0), 0),
    total_posts: ngoPosts.length,
  };
}

// 6. POST /api/ngos/register (Public NGO)
export async function registerNgo(formData) {
  try {
    const res = await fetch(`${BASE_URL}/ngos/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  const newNgo = {
    ...formData,
    id: ngosState.length ? Math.max(...ngosState.map((n) => n.id)) + 1 : 1,
    status: 'PENDING',
    trust_score: 80,
    score: 80.0,
    hero_image_url:
      formData.hero_image_url ||
      'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&auto=format&fit=crop&q=80',
    funds_breakdown: formData.funds_breakdown || {
      programs: 60,
      field_work: 25,
      ops: 15,
    },
    created_at: new Date().toISOString(),
  };

  ngosState = [...ngosState, newNgo];
  saveState();
  return { success: true, ngo: newNgo };
}

// 7. GET /api/ngos/pending (Admin)
export async function getPendingNgos(token = '') {
  try {
    const res = await fetch(`${BASE_URL}/ngos/pending`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  return ngosState.filter((n) => n.status === 'PENDING');
}

// 8. POST /api/ngos/:id/approve
export async function approveNgo(id, token = '') {
  try {
    const res = await fetch(`${BASE_URL}/ngos/${id}/approve`, {
      method: 'POST',
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  ngosState = ngosState.map((n) =>
    String(n.id) === String(id) ? { ...n, status: 'ACTIVE', trust_score: Math.max(n.trust_score || 85, 90) } : n
  );
  saveState();
  return { success: true, message: 'NGO approved' };
}

// 9. POST /api/ngos/:id/reject
export async function rejectNgo(id, token = '') {
  try {
    const res = await fetch(`${BASE_URL}/ngos/${id}/reject`, {
      method: 'POST',
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  ngosState = ngosState.map((n) =>
    String(n.id) === String(id) ? { ...n, status: 'REJECTED' } : n
  );
  saveState();
  return { success: true, message: 'NGO rejected' };
}

// 10. POST /api/ngos (Admin Add NGO)
export async function createNgoAdmin(formData, token = '') {
  try {
    const res = await fetch(`${BASE_URL}/ngos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  const newNgo = {
    ...formData,
    id: ngosState.length ? Math.max(...ngosState.map((n) => n.id)) + 1 : 1,
    status: formData.is_verified !== false ? 'ACTIVE' : 'PENDING',
    trust_score: Number(formData.trust_score || 90),
    score: Number(formData.score || 90.0),
    hero_image_url:
      formData.hero_image_url ||
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop&q=80',
    funds_breakdown: formData.funds_breakdown || {
      programs: 50,
      field_work: 35,
      ops: 15,
    },
    created_at: new Date().toISOString(),
  };

  ngosState = [...ngosState, newNgo];
  saveState();
  return newNgo;
}

// 11. POST /api/login
export async function login({ email, password }) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => ({}));
    if (errData.message) throw new Error(errData.message);
  } catch (err) {
    if (err.message && (err.message.includes('under review') || err.message.includes('not approved'))) {
      throw err;
    }
  }

  // Admin login check
  if (
    email?.trim().toLowerCase() === 'admin@bookmyseva.app' &&
    password === 'admin123'
  ) {
    return {
      success: true,
      role: 'ADMIN',
      token: 'jwt-admin-token-' + Date.now(),
      user: { email, name: 'Platform Admin' },
    };
  }

  // NGO login check
  const ngo = ngosState.find(
    (n) => n.email?.trim().toLowerCase() === email?.trim().toLowerCase()
  );

  if (ngo) {
    // Demo password or user password
    if (password === 'ngo123' || password === ngo.password) {
      if (ngo.status === 'PENDING') {
        throw new Error('Your application is under review.');
      }
      if (ngo.status === 'REJECTED') {
        throw new Error('Your application was not approved.');
      }
      return {
        success: true,
        role: 'NGO',
        token: 'jwt-ngo-token-' + ngo.id + '-' + Date.now(),
        ngoId: ngo.id,
        user: ngo,
      };
    }
  }

  throw new Error('Invalid email or password');
}

// 12. GET /api/top-100
export async function getTop100() {
  try {
    const res = await fetch(`${BASE_URL}/top-100`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  const active = ngosState.filter((n) => n.status === 'ACTIVE');
  const sorted = [...active].sort((a, b) => (b.score || 0) - (a.score || 0));

  return sorted.map((ngo, idx) => ({
    rank: idx + 1,
    id: ngo.id,
    name: ngo.name,
    logo_emoji: ngo.logo_emoji,
    category: ngo.category,
    location: ngo.location,
    trust_score: ngo.trust_score,
    score: ngo.score || (ngo.trust_score * 0.9 + 5).toFixed(1),
    status: ngo.status,
  }));
}

// 13. GET /api/health
export async function checkHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    if (res.ok) return await res.json();
  } catch (err) {}
  return { status: 'UP', message: 'BookMySeva Mock/Dev Server Active' };
}

// GET /api/ngos/me (NGO Dashboard)
export async function getNgoMe(token = '', ngoId = null) {
  try {
    const res = await fetch(`${BASE_URL}/ngos/me`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  const id = ngoId || 1; // Default to first NGO for demo if needed
  return getNgoById(id);
}

// Delete post helper (admin & NGO dashboard)
export async function deletePost(id, token = '') {
  try {
    await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
  } catch (e) {}
  postsState = postsState.filter((p) => String(p.id) !== String(id));
  saveState();
  return { success: true };
}

// Delete NGO helper (admin)
export async function deleteNgo(id, token = '') {
  try {
    await fetch(`${BASE_URL}/ngos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
  } catch (e) {}
  ngosState = ngosState.filter((n) => String(n.id) !== String(id));
  postsState = postsState.filter((p) => String(p.ngo_id) !== String(id));
  saveState();
  return { success: true };
}
