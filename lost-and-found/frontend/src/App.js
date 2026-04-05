import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Items from './pages/Items';
import ItemDetail from './pages/ItemDetail';
import Report from './pages/Report';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import ResetPassword from './pages/ResetPassword'; // ADDED

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#0f172a',
              fontSize: '14px',
              fontFamily: "'DM Sans', sans-serif",
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
          }}
        />
        <Routes>
          {/* Auth pages - no navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* ADDED */}

          {/* All other pages with navbar */}
          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/items" element={<Items />} />
                <Route path="/items/:id" element={<ItemDetail />} />
                <Route path="/report" element={
                  <ProtectedRoute><Report /></ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
                } />
              </Routes>
              <footer style={{ background: 'white', borderTop: '1px solid var(--border)', padding: '24px 0', marginTop: '48px' }}>
                <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                  🔍 Campus Lost & Found · Group 8 · Built with React &amp; Node.js
                </div>
              </footer>
            </>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
