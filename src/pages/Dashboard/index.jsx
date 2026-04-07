import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MessageSquare, Clock, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardOverview() {
  const [stats, setStats] = useState({ totalInquiries: 0, newInquiries: 0, totalReviews: 0, avgRating: 0 });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        // Parallel queries for speed
        const [
          { count: totalInquiries },
          { count: newInquiries },
          { count: totalReviews },
          { data: reviews },
          { data: recent }
        ] = await Promise.all([
          supabase.from('inquiries').select('*', { count: 'exact', head: true }),
          supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('reviews').select('*', { count: 'exact', head: true }),
          supabase.from('reviews').select('rating'),
          supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        const avgRating = reviews?.length 
          ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
          : 0;

        setStats({
          totalInquiries: totalInquiries || 0,
          newInquiries: newInquiries || 0,
          totalReviews: totalReviews || 0,
          avgRating
        });
        setRecentInquiries(recent || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) return <div style={{ color: 'var(--color-text-muted)' }}>Loading dashboard...</div>;
  if (error) return <div style={{ color: '#ef4444' }}>Error: {error}</div>;

  const statCards = [
    { title: 'Total Inquiries', value: stats.totalInquiries, icon: MessageSquare, color: 'var(--color-accent-secondary)' },
    { title: 'New Inquiries', value: stats.newInquiries, icon: Clock, color: 'var(--color-accent)' },
    { title: 'Total Reviews', value: stats.totalReviews, icon: Star, color: '#f59e0b' },
    { title: 'Avg. Rating', value: `${stats.avgRating} / 5.0`, icon: TrendingUp, color: '#10b981' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return { bg: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', label: 'NEW' };
      case 'in-progress': return { bg: 'rgba(234, 179, 8, 0.1)', color: '#eab308', label: 'IN PROGRESS' };
      case 'completed': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'COMPLETED' };
      default: return { bg: 'rgba(255, 255, 255, 0.1)', color: '#9ca3af', label: status?.toUpperCase() || 'UNKNOWN' };
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '12px', color: stat.color }}>
                <Icon size={24} />
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{stat.title}</div>
                <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Inquiries */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#fff', fontSize: '1.25rem', margin: 0 }}>Recent Inquiries</h2>
          <Link to="/dashboard/inquiries" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontSize: '0.875rem' }}>View All →</Link>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem 0' }}>Client</th>
                <th style={{ padding: '1rem 0' }}>Service</th>
                <th style={{ padding: '1rem 0' }}>Status</th>
                <th style={{ padding: '1rem 0' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentInquiries.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '1rem 0', color: 'var(--color-text-muted)', textAlign: 'center' }}>No inquiries found.</td></tr>
              ) : recentInquiries.map((inq) => {
                const s = getStatusColor(inq.status);
                return (
                  <tr key={inq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0' }}>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ fontWeight: 'bold' }}>{inq.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{inq.email}</div>
                    </td>
                    <td style={{ padding: '1rem 0' }}>{inq.service}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold',
                        backgroundColor: s.bg, color: s.color, whiteSpace: 'nowrap'
                      }}>
                        {s.label}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                      {new Date(inq.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
