/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { config } from '../config';

export default function Location() {
  return (
    <motion.section
      id="location"
      className="section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="section-header" style={{ alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div className="section-kicker">Headquarters</div>
          <h2 className="section-title">Visit Our Studio</h2>
        </div>
      </div>

      <a
        href={config.map.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="location-wrapper"
      >
        <div className="card card--hover-glow location-card">
          <iframe
            src={config.map.embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="WebMatrix Solution — Noida, Delhi NCR"
          />
        </div>
      </a>
    </motion.section>
  );
}
