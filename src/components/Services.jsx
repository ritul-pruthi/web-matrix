/* eslint-disable no-unused-vars */
import { Palette, Code, Monitor, PenTool, Bot, Video, FileUser, Megaphone, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const SERVICES_DATA = [
  {
    icon: Palette,
    title: 'Brand & UX Design',
    body: 'Craft interfaces that feel effortless — balancing aesthetics, accessibility, and conversion.',
  },
  {
    icon: Code,
    title: 'Full-Stack Development',
    body: 'Robust, scalable web platforms built with modern tooling, clean architecture, and performance-first thinking.',
  },
  {
    icon: Monitor,
    title: 'Web Applications',
    body: 'Data-rich dashboards and internal tools that give your team superpowers instead of friction.',
  },
  {
    icon: PenTool,
    title: 'Content Writing',
    body: 'Engaging, SEO-optimized content that tells your brand story and drives conversions.',
  },
  {
    icon: Bot,
    title: 'AI and Automation Services',
    body: 'Streamline operations and elevate user experiences with intelligent tools and automated workflows.',
  },
  {
    icon: Video,
    title: 'Video & Reel Editing',
    body: 'High-quality video content and engaging reels to capture your audience across social media.',
  },
  {
    icon: FileUser,
    title: 'Resume & Profile Optimizations',
    body: 'Professional resume building and LinkedIn profile enhancements to stand out to recruiters.',
  },
  {
    icon: Palette,
    title: 'Logo & Brand Design',
    body: 'Distinctive visual identities, logos, and style guidelines that set you apart from competitors.',
  },
  {
    icon: Megaphone,
    title: 'Posters & Social Media Creatives',
    body: 'Eye-catching graphics and creatives scaled perfectly for every social platform and campaign.',
  },
  {
    icon: Globe,
    title: 'Ecommerce Websites and Landing Pages',
    body: 'Sales-focused web destinations and intuitive storefronts designed to maximize conversions.',
  },
];

function ServiceCard({ icon: Icon, title, body, index }) {
  return (
    <motion.article
      className="card card--hover-glow"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="service-icon">
        <Icon />
      </div>
      <h3 className="service-title">{title}</h3>
      <p className="service-body">{body}</p>
    </motion.article>
  );
}

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="section-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="section-kicker">Services</div>
          <h2 className="section-title">What we build together</h2>
        </div>
      </div>

      <div className="services-grid">
        {SERVICES_DATA.map((service, i) => (
          <ServiceCard key={service.title} {...service} index={i} />
        ))}
      </div>

      <div className="services-cta">
        <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem' }}>
          A connected stack of services that move you from raw idea to
          launched product — and beyond.
        </p>
        <a href="#contact" className="btn btn-glow">Discuss Your Project</a>
      </div>
    </section>
  );
}
