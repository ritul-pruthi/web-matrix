import { motion } from 'framer-motion';

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
        href="https://www.google.com/maps/place/Noida,+Uttar+Pradesh/@28.5844211,77.3898491,13.1z"
        target="_blank"
        rel="noopener noreferrer"
        className="location-wrapper"
      >
        <div className="card card--hover-glow location-card">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.511728229471!2d77.3898490757343!3d28.584421075691456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef13e5555555%3A0x5555555555555555!2sNoida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1710000000000"
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
