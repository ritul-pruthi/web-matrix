import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { isConfigured } from './supabase-client';

import LandingPage from './pages/LandingPage';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './pages/ResetPassword';
import CyberCursor from './components/CyberCursor';

function ConfigurationError() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', color: 'white', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
      <div className="glass card--hover-glow" style={{ padding: '2.5rem', borderRadius: '1rem', textAlign: 'center', maxWidth: '500px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-secondary)', marginBottom: '1rem' }}>Configuration Error</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>The application is missing critical environment variables for Supabase.</p>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.5rem', textAlign: 'left', fontFamily: 'monospace', fontSize: '0.85rem', color: '#ffaaaa' }}>
          Please ensure <br/><br/>
          <strong>VITE_SUPABASE_URL</strong> <br/>
          <strong>VITE_SUPABASE_ANON_KEY</strong> <br/><br/>
          are properly defined in your project's root <code>.env</code> file.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  if (!isConfigured) {
    return <ConfigurationError />;
  }

  return (
    <AuthProvider>
      <CyberCursor />
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route 
          path="/login" 
          element={<Auth />} 
        />
        
        <Route 
          path="/auth" 
          element={<Auth />} 
        />
        
        <Route 
          path="/reset-password" 
          element={<ResetPassword />} 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requireAdmin={false}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute requireAdmin={false}>
              <Settings />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all route redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}
