/* eslint-disable no-unused-vars */
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleInquiryClick = () => {
    if (!user) {
      navigate('/auth');
    } else {
      window.location.href = 'https://portal.web-matrix-solution.com';
    }
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
        <div className="project-starter-box glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
          <h3 className="starter-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>Start Your Project</h3>
          <p className="starter-desc" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            Ready to build the future? Connect with us through our secure portal to submit your requirements safely.
          </p>
          
          <button
            onClick={handleInquiryClick}
            className="btn btn-large btn-glow"
            style={{ width: '100%', justifyContent: 'center', backgroundColor: 'rgba(6, 182, 212, 0.1)', border: '1px solid #06b6d4', color: '#06b6d4', boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}
          >
            <Send style={{ width: 18, height: 18, marginRight: 8 }} />
            Fill Your Ink / Send Enquiry
          </button>
        </div>
      </div>
    </motion.section>
  );
}
