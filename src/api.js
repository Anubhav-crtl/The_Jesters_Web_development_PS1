export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Helper
async function apiCall(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      if (errJson && (errJson.error || errJson.message)) {
        errorDetail = ` - ${errJson.error || errJson.message}`;
      }
    } catch (_) {}
    throw new Error(`API Error ${response.status}: ${response.statusText}${errorDetail}`);
  }
  return response.json();
}

// Helper to safely parse JSON strings from backend (media_urls, team_members, funds_breakdown)
export function parseJsonSafe(val, fallback = []) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    console.warn('JSON parse warning:', e);
    return fallback;
  }
}

// Public endpoints
export const getHealth = () => apiCall('/api/health');
export const getAllNgos = () => apiCall('/api/ngos');
export const getNgoById = async (id) => {
  const res = await apiCall(`/api/ngos/${id}`);
  return res?.ngo || res;
};
export const getAllPosts = () => apiCall('/api/posts');
export const getPostById = async (id) => {
  const res = await apiCall(`/api/posts/${id}`);
  if (res?.post) {
    return { ...res.post, ngo: res.ngo || res.post.ngo };
  }
  return res;
};
export const getTop100 = () => apiCall('/api/top-100');

// Auth
export const login = (email, password) => apiCall('/api/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});

// NGO registration
export const registerNgo = (data) => apiCall('/api/ngos/register', {
  method: 'POST',
  body: JSON.stringify(data)
});

// Admin actions
export const getPendingNgos = () => apiCall('/api/ngos/pending');
export const approveNgo = (id) => apiCall(`/api/ngos/${id}/approve`, { method: 'POST' });
export const rejectNgo = (id, reason = '') => apiCall(`/api/ngos/${id}/reject`, {
  method: 'POST',
  body: JSON.stringify({ reason })
});

// Create post
export const createPost = (data) => apiCall('/api/posts', {
  method: 'POST',
  body: JSON.stringify(data)
});

// Admin adds NGO
export const createNgo = (data) => apiCall('/api/ngos', {
  method: 'POST',
  body: JSON.stringify(data)
});
