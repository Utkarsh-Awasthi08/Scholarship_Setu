import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import TrackPage from './pages/TrackPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import { AuthProvider, useAuth } from './auth/AuthContext';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex-1 grid place-items-center text-gray-600">Loading your account…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/scholarships" element={<ScholarshipsPage />} />
            <Route path="/track" element={<ProtectedRoute><TrackPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
