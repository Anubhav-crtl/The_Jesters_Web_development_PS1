import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FeedPage from './pages/FeedPage';
import LoginPage from './pages/LoginPage';
import NgoRegisterPage from './pages/NgoRegisterPage';
import PostDetailPage from './pages/PostDetailPage';
import NgoProfilePage from './pages/NgoProfilePage';
import Top100Page from './pages/Top100Page';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminAddNgoPage from './pages/AdminAddNgoPage';
import AdminAddPostPage from './pages/AdminAddPostPage';
import NgoDashboardPage from './pages/NgoDashboardPage';
import NgoAddPostPage from './pages/NgoAddPostPage';

export default function App() {
  return (
    <Routes>
      {/* 1. Feed / Landing */}
      <Route path="/" element={<FeedPage />} />

      {/* 2. Login (NGO + Admin) */}
      <Route path="/login" element={<LoginPage />} />

      {/* 3. NGO Registration (Public) */}
      <Route path="/register-ngo" element={<NgoRegisterPage />} />

      {/* 4. Post Detail */}
      <Route path="/post/:id" element={<PostDetailPage />} />

      {/* 5. NGO Profile */}
      <Route path="/ngo/:id" element={<NgoProfilePage />} />

      {/* 6. Top 100 Ranked NGOs */}
      <Route path="/top-100" element={<Top100Page />} />

      {/* 7. Admin Dashboard */}
      <Route path="/admin" element={<AdminDashboardPage />} />

      {/* 8. Admin - Add NGO */}
      <Route path="/admin/add-ngo" element={<AdminAddNgoPage />} />

      {/* 9. Admin - Add Post */}
      <Route path="/admin/add-post" element={<AdminAddPostPage />} />

      {/* 10. NGO Dashboard */}
      <Route path="/ngo" element={<NgoDashboardPage />} />

      {/* 11. NGO - Add Post */}
      <Route path="/ngo/add-post" element={<NgoAddPostPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
