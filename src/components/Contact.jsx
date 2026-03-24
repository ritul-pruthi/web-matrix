/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { config } from '../config';
import { supabase } from '../supabase-client';

const CONTACT_INFO = [
  {
    icon: Mail,
    title: 'Email Us',
    desc: config.contact.email,
    sub: 'Send us an email anytime',
  },
  {
    icon: Phone,
    title: 'Call Us',
    desc: (
      <>
        {config.contact.phones[0]} <br /> {config.contact.phones[1]}
      </>
    ),
    sub: config.contact.hours,
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    desc: config.contact.address,
    sub: 'Schedule an in-person meeting',
  },
];

export default function Contact() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '', status: '' });
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: profile?.full_name || user.user_metadata?.full_name || '',
        email: user.email || ''
      }));
    }
  }, [user, profile]);

  useEffect(() => {
    const pending = localStorage.getItem('pendingInquiry');
    if (pending) {
      try {
        const data = JSON.parse(pending);
        setFormData(prev => ({ ...prev, ...data }));
        localStorage.removeItem('pendingInquiry');
        
        const autoSubmit = localStorage.getItem('autoSubmitInquiry');
        if (autoSubmit && user) {
          localStorage.removeItem('autoSubmitInquiry');
          submitInquiry(data);
        }
      } catch (err) {
        console.error("Error parsing pending inquiry:", err);
      }
    }
  }, [user]);

  const submitInquiry = async (data) => {
    setIsSubmitting(true);
    setStatusMsg({ type: '', text: '' });

    const { error } = await supabase
      .from('inquiries')
      .insert([{
        user_id: user ? user.id : null,
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
        status: data.status
      }]);

    setIsSubmitting(false);

    if (error) {
      console.error('Supabase Inquiries Insert Error:', error);
      setStatusMsg({ type: 'error', text: 'Failed to submit inquiry: ' + error.message });
    } else {
      setStatusMsg({ type: 'success', text: 'Your inquiry has been submitted successfully!' });
      setFormData({ 
        name: user ? (profile?.full_name || '') : '', 
        email: user ? (user.email || '') : '', 
        phone: '', 
        service: '', 
        message: '',
        status: ''
      });
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message || !formData.status) {
      setStatusMsg({ type: 'error', text: 'Please fill out all required fields.' });
      return;
    }

    if (!user) {
      localStorage.setItem('pendingInquiry', JSON.stringify(formData));
      localStorage.setItem('autoSubmitInquiry', 'true');
      navigate('/login', { state: { message: 'Please log in to submit your inquiry. Your details have been saved.' } });
      return;
    }

    await submitInquiry(formData);
  };

  const inputStyle = {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    marginBottom: '1rem'
  };

  return (
    <motion.section
      id="contact"
      className="section contact-section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="contact-grid">
        {/* Left — Contact info */}
        <div className="contact-info-stack">
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            Let&#39;s Start a Conversation
          </h2>
          <p style={{ marginBottom: '2rem' }}>
            Whether you have a specific project in mind or just want to explore
            possibilities, we&#39;re here to help.
          </p>

          {CONTACT_INFO.map(({ icon: Icon, title, desc, sub }) => (
            <div className="contact-info-card card card--hover-glow" key={title}>
              <div className="contact-icon"><Icon /></div>
              <div>
                <h4 className="contact-info-title">{title}</h4>
                <p className="contact-info-desc text-accent">{desc}</p>
                <span className="contact-info-sub">{sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right — Project CTA */}
        <motion.div 
          className="project-starter-box glass" 
          style={{ padding: '2rem' }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
        >
          <h3 className="starter-title" style={{ marginBottom: '1.5rem' }}>Start Your Project</h3>
          
          <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <input type="text" placeholder="Your Name *" value={formData.name} onChange={e => setFormData(f => ({...f, name: e.target.value}))} required style={inputStyle} />
            <input type="email" placeholder="Your Email *" value={formData.email} onChange={e => setFormData(f => ({...f, email: e.target.value}))} required style={inputStyle} />
            <input type="tel" placeholder="Your Phone" value={formData.phone} onChange={e => setFormData(f => ({...f, phone: e.target.value}))} style={inputStyle} />
            <select value={formData.service} onChange={e => setFormData(f => ({...f, service: e.target.value}))} style={{...inputStyle, appearance: 'none'}}>
              <option value="" disabled style={{color: 'black'}}>Select a Service</option>
              <option value="Web Development" style={{color: 'black'}}>Web Development</option>
              <option value="UI/UX Design" style={{color: 'black'}}>UI/UX Design</option>
              <option value="SEO Optimization" style={{color: 'black'}}>SEO Optimization</option>
              <option value="Other" style={{color: 'black'}}>Other</option>
            </select>
            <label htmlFor="status" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Project Status</label>
            <select id="status" required value={formData.status} onChange={e => setFormData(f => ({...f, status: e.target.value}))} style={{...inputStyle, appearance: 'none'}}>
              <option value="" disabled style={{color: 'black'}}>Select a status...</option>
              <option value="not_started" style={{color: 'black'}}>Not Started</option>
              <option value="in_development" style={{color: 'black'}}>In Development</option>
              <option value="in_production" style={{color: 'black'}}>In Production</option>
              <option value="completed" style={{color: 'black'}}>Completed</option>
            </select>
            <textarea placeholder="Tell us about your project *" value={formData.message} onChange={e => setFormData(f => ({...f, message: e.target.value}))} required rows={4} style={{...inputStyle, resize: 'vertical'}} />
            
            {statusMsg.text && (
              <div style={{ color: statusMsg.type === 'error' ? '#ef4444' : '#10b981', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {statusMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-glow"
              style={{ width: '100%', justifyContent: 'center', backgroundColor: 'rgba(6, 182, 212, 0.1)', border: '1px solid #06b6d4', color: '#ffffff', boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              <Send style={{ width: 18, height: 18, marginRight: 8, color: '#ffffff' }} />
              <span style={{ color: '#ffffff' }}>{isSubmitting ? 'Sending...' : 'Send Enquiry'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
}
