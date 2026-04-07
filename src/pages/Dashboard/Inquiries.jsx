import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronDown } from 'lucide-react';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statuses = ['new', 'in-progress', 'completed', 'archived', 'not_started', 'in_development', 'in_production'];

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setInquiries(inquiries.map(inq => 
        inq.id === id ? { ...inq, status: newStatus } : inq
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return { bg: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' };
      case 'in-progress': return { bg: 'rgba(234, 179, 8, 0.1)', color: '#eab308' };
      case 'completed': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
      case 'archived': return { bg: 'rgba(156, 163, 175, 0.1)', color: '#9ca3af' };
      case 'not_started': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
      case 'in_development': return { bg: 'rgba(56, 187, 248, 0.1)', color: '#38bdf8' };
      case 'in_production': return { bg: 'rgba(52, 211, 153, 0.1)', color: '#34d399' };
      default: return { bg: 'rgba(255, 255, 255, 0.1)', color: '#9ca3af' };
    }
  };

  if (loading) return <div style={{ color: 'var(--color-text-muted)' }}>Loading inquiries...</div>;
  if (error) return <div style={{ color: '#ef4444' }}>Error: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', margin: 0 }}>Inquiries Management</h1>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Total: {inquiries.length}</div>
      </div>

      <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              <th style={{ padding: '1rem' }}>Client</th>
              <th style={{ padding: '1rem' }}>Contact</th>
              <th style={{ padding: '1rem' }}>Service</th>
              <th style={{ padding: '1rem', maxWidth: '300px' }}>Message</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No inquiries found.</td></tr>
            ) : inquiries.map((inq) => {
              const sColor = getStatusColor(inq.status);
              return (
                <tr key={inq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold', color: '#fff' }}>{inq.name}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    <div>{inq.email}</div>
                    <div style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{inq.phone || 'No phone'}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{inq.service}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', maxWidth: '250px' }}>
                    <div style={{ 
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-text-muted)'
                    }} title={inq.message}>
                      {inq.message || 'No message provided'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <select 
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        style={{
                          appearance: 'none',
                          backgroundColor: sColor.bg,
                          color: sColor.color,
                          border: `1px solid ${sColor.color}`,
                          padding: '0.25rem 2rem 0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          outline: 'none',
                          textTransform: 'uppercase'
                        }}
                      >
                        {statuses.map(s => (
                          <option key={s} value={s} style={{ backgroundColor: '#1e293b', color: '#fff' }}>
                            {s.replace('_', ' ').toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} color={sColor.color} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                    {new Date(inq.created_at).toLocaleDateString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
