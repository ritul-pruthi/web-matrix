/* eslint-disable no-unused-vars */
import { Mail, Phone, MapPin, MessageSquare, Check, Send } from 'lucide-react';
import { motion } from 'framer-motion';

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

const STARTER_LIST = [
  'Free consultation',
  'Detailed project proposal',
  'Timeline & cost estimate',
  'Technology recommendations',
];

export default function Contact() {
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

        {/* Right — Project starter */}
        <div className="project-starter-box glass">
          <div className="starter-icon-wrapper">
            <MessageSquare className="starter-icon" />
          </div>
          <h3 className="starter-title">Start Your Project</h3>
          <p className="starter-desc">
            Fill out our project form and we&#39;ll get back to you within 24 hours
          </p>

          <ul className="starter-list">
            {STARTER_LIST.map((item) => (
              <li key={item}>
                <Check className="check-icon" />
                {item}
              </li>
            ))}
          </ul>

          <a
            href="https://forms.gle/gFJ3QHZofKotwBnQ8"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-large btn-emerald"
          >
            <Send style={{ width: 18, height: 18, marginRight: 8 }} />
            Fill Project Form
          </a>
          <p className="starter-footer">No spam, just valuable insights about your project</p>
        </div>
      </div>
    </motion.section>
  );
}
