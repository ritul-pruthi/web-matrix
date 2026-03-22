/* eslint-disable no-unused-vars */
import { LayoutGrid, Repeat, Terminal, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const STATS = [
  { number: '20+', label: 'Successful Projects' },
  { number: '15+', label: 'Happy Clients' },
  { number: '3+', label: 'Years Experience' },
  { number: '100%', label: 'Client Satisfaction' },
];

const CORE_VALUES = [
  {
    icon: LayoutGrid,
    title: 'Architecting Foundations',
    desc: "We don't just build websites; we architect digital ecosystems. Every project begins with a blueprint designed for infinite scalability and structural integrity.",
  },
  {
    icon: Repeat,
    title: 'Recursive Innovation',
    desc: 'Constant iteration is in our DNA. We leverage recursive logic to evolve your product, ensuring it stays ahead of market shifts rather than reacting to them.',
  },
  {
    icon: Terminal,
    title: 'Obsidian Logic',
    desc: 'Our engineering is deep, clean, and impenetrable. We prioritize performance-first logic and security-hardened code to protect your digital assets at every layer.',
  },
  {
    icon: Share2,
    title: 'Unified Matrix',
    desc: 'We act as a seamless extension of your ambition. By bridging the gap between raw ideas and technical reality, we create a unified path to digital success.',
  },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="about-grid">
        {/* Left column */}
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="about-title">
            Streamlining Processes with Tech-driven Innovation
          </h2>
          <p className="about-description">
            Founded with a vision to bridge the gap between complex business
            requirements and innovative technology solutions, WebMatrix has
            been at the forefront of custom software development.
            <br /><br />
            Our team combines deep technical expertise with a thorough
            understanding of business processes to deliver solutions that not
            only meet current needs but also scale with your future growth.
            <br /><br />
            From startups to enterprise clients, we've helped organizations
            across various industries transform their operations through
            intelligent automation, modern web applications, and cutting-edge
            mobile solutions.
          </p>

          <div className="stats-grid">
            {STATS.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div
          className="core-values-wrapper"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="core-values-heading">Our Technical Pillars</h3>
          <div className="core-values-stack">
            {CORE_VALUES.map(({ icon: Icon, title, desc }) => (
              <div className="core-value-card" key={title}>
                <div className="core-value-icon"><Icon /></div>
                <div>
                  <h4 className="core-value-title">{title}</h4>
                  <p className="core-value-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
