import { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase-client';
import { config } from '../config';

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
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', service: '', message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error: submitError } = await supabase
      .from('inquiries')
      .insert([formData]);

    setLoading(false);

    if (submitError) {
      setError(submitError.message);
    } else {
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', company: '', service: '', message: '' });
    }
  };

  const inputStyle = {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease',
    width: '100%',
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

        {/* Right — Project form */}
        <div className="project-starter-box glass" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="starter-icon-wrapper" style={{ margin: '0 auto 1rem auto' }}>
            <MessageSquare className="starter-icon" />
          </div>
          <h3 className="starter-title" style={{ textAlign: 'center' }}>Start Your Project</h3>
          <p className="starter-desc" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Fill out our project form and we&#39;ll get back to you within 24 hours
          </p>

          {success && (
            <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-accent)', borderRadius: '0.5rem', color: 'var(--color-accent)', textAlign: 'center', marginBottom: '1.5rem' }}>
              Inquiry sent successfully! We will get back to you shortly.
            </div>
          )}

          {error && (
            <div style={{ padding: '1rem', color: 'var(--color-accent-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name *" required style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" required style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            </div>
            
            <select name="service" value={formData.service} onChange={handleChange} required style={{...inputStyle, appearance: 'none', backgroundColor: 'rgba(255,255,255,0.05)'}} onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}>
              <option value="" disabled style={{color: 'black'}}>Select Service *</option>
              <option value="Web Development" style={{color: 'black'}}>Web Development</option>
              <option value="Cybersecurity" style={{color: 'black'}}>Cybersecurity</option>
              <option value="Cloud Integration" style={{color: 'black'}}>Cloud Integration</option>
              <option value="Other" style={{color: 'black'}}>Other</option>
            </select>

            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Project Details *" required rows={4} style={{...inputStyle, resize: 'vertical'}} onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />

            <button
              type="submit"
              disabled={loading}
              className="btn btn-large btn-emerald"
              style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              <Send style={{ width: 18, height: 18, marginRight: 8 }} />
              {loading ? 'Sending...' : 'Submit Inquiry'}
            </button>
          </form>
          <p className="starter-footer" style={{ marginTop: '1.5rem' }}>No spam, just valuable insights about your project</p>
        </div>
      </div>
    </motion.section>
  );
}
