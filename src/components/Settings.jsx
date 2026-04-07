import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Camera, Save, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }

  /* Pre-fill from current profile */
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  /* ── Avatar Upload ── */
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;
    setUploading(true);
    setStatus(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to 'avatars' storage bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // 2. Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Update profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setStatus({ type: 'success', message: 'Profile picture updated!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setUploading(false);
    }
  };

  /* ── Save Profile (name only – avatar updated inline above) ── */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setStatus(null);

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);

    setStatus(error
      ? { type: 'error', message: error.message }
      : { type: 'success', message: 'Profile saved successfully.' }
    );
    setSaving(false);
  };

  /* ── Shared styles ── */
  // Styles moved to src/index.css

  return (
    <>
      {/* Background – identical to Dashboard */}
      <div className="mosaic-bg"></div>
      <div className="mesh-blob blob-1"></div>
      <div className="mesh-blob blob-2"></div>

      <div className="dashboard-container">

        {/* ── Header ── */}
        <header className="dashboard-header">
          <div>
            <h1 style={{
              fontFamily: '"Space Grotesk", "Outfit", sans-serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 300,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '0.4rem',
              letterSpacing: '-0.04em',
            }}>
              Settings
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: '"Space Grotesk", sans-serif', fontSize: '0.9rem' }}>
              Manage your profile and account.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="border-beam meta-text"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.8rem 1.25rem',
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.03)',
              color: 'white', cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              fontFamily: '"Space Grotesk", "Outfit", sans-serif',
            }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </header>

        {/* ── Bento Grid ── */}
        <form onSubmit={handleSave}>
          <div className="bento-grid">

            {/* ── Tile 1: Avatar ── */}
            <div className="bento-tile identity-card" style={{ alignItems: 'center', textAlign: 'center' }}>
              <h3 style={{ margin: 0, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.1rem', fontWeight: 400, color: 'white', display: 'flex', alignItems: 'center', gap: '0.6rem', alignSelf: 'flex-start' }}>
                <Camera size={18} style={{ color: 'var(--color-accent)' }} /> Profile Picture
              </h3>

              {/* Avatar circle */}
              <div style={{
                width: '110px', height: '110px', borderRadius: '20px',
                background: avatarUrl ? 'transparent' : 'var(--accent-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.8rem', fontWeight: 'bold', color: '#05080a',
                boxShadow: '0 8px 32px rgba(16,185,129,0.25)',
                overflow: 'hidden', flexShrink: 0,
              }}>
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (fullName ? fullName.substring(0, 2).toUpperCase() : 'U')
                }
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                  padding: '0.75rem 1.5rem', width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  color: uploading ? 'rgba(255,255,255,0.4)' : 'white',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  fontFamily: '"Space Grotesk", sans-serif', fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                }}
              >
                {uploading
                  ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Uploading…</>
                  : <><Camera size={16} /> Upload New Photo</>
                }
              </button>

              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', fontFamily: '"Space Grotesk", sans-serif', margin: 0 }}>
                Uploads to the <code style={{ color: 'rgba(255,255,255,0.4)' }}>avatars</code> bucket.
              </p>
            </div>

            {/* ── Tile 2: Identity ── */}
            <div className="bento-tile" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <h3 style={{ margin: 0, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.1rem', fontWeight: 400, color: 'white', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <User size={18} style={{ color: 'var(--color-accent)' }} /> Identity
              </h3>

              {/* Full Name */}
              <div>
                <label className="settings-label"><User size={12} /> Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="settings-input"
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="settings-label"><Mail size={12} /> Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="settings-input"
                  style={{ opacity: 0.45, cursor: 'not-allowed' }}
                />
                <p style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', fontFamily: '"Space Grotesk", sans-serif' }}>
                  Email is managed through authentication settings.
                </p>
              </div>
            </div>

            {/* ── Tile 3: Save ── */}
            <div className="bento-tile" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ margin: 0, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.1rem', fontWeight: 400, color: 'white', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Save size={18} style={{ color: 'var(--color-accent)' }} /> Save Changes
              </h3>

              {/* Status feedback */}
              {status && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.875rem 1rem', borderRadius: '10px',
                  backgroundColor: status.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${status.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  color: status.type === 'success' ? '#10b981' : '#ef4444',
                  fontFamily: '"Space Grotesk", sans-serif', fontSize: '0.875rem',
                }}>
                  {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {status.message}
                </div>
              )}

              <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: '"Space Grotesk", sans-serif', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                Clicking <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Save Profile</strong> will update your display name in the database. Profile picture changes are applied immediately on upload.
              </p>

              {/* Save button */}
              <button
                type="submit"
                disabled={saving}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem',
                  padding: '1rem 1.5rem', width: '100%',
                  background: saving ? 'rgba(255,255,255,0.05)' : 'var(--accent-gradient)',
                  border: 'none', borderRadius: '10px',
                  color: saving ? 'rgba(255,255,255,0.35)' : '#05080a',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontFamily: '"Space Grotesk", "Outfit", sans-serif',
                  fontSize: '1rem', fontWeight: 600,
                  transition: 'opacity 0.2s ease',
                  letterSpacing: '0.02em',
                }}
              >
                {saving ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={16} /> Save Profile</>}
              </button>

              {/* Back button */}
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem',
                  padding: '0.875rem 1.5rem', width: '100%',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontFamily: '"Space Grotesk", "Outfit", sans-serif',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease, border-color 0.2s ease',
                }}
              >
                <ArrowLeft size={15} /> Back to Dashboard
              </button>
            </div>

          </div>
        </form>
      </div>

      {/* Spin keyframe for loader */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
