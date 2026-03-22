/* eslint-disable no-unused-vars */
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';
import heroAnimation from '../assets/hero-animation.lottie';

export default function Hero() {
  return (
    <motion.section
      id="top"
      className="hero"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <div className="hero-eyebrow">
          <span className="text-accent">WebMatrix Solution</span>
          <span>&bull;</span>
          <span>Digital-first studio</span>
        </div>

        <h1 className="hero-title">
          Transforming Ideas into Digital Success
        </h1>

        <p className="hero-subtitle">
          We architect modern web experiences that turn ambitious ideas into
          scalable, measurable outcomes — from concept and design to
          high-performance engineering.
        </p>

        <div className="hero-actions">
          <a href="#services" className="btn btn-glow">
            Start Your Journey
          </a>
          <a href="#about" className="hero-secondary-link">
            See how we think <span>&rarr;</span>
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <DotLottieReact
          src={heroAnimation}
          loop
          autoplay
          style={{ width: '100%', maxWidth: 360 }}
        />
      </div>
    </motion.section>
  );
}
