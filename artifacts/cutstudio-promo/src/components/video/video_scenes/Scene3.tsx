import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Feature {
  icon: string;
  title: string;
  desc: string;
  tag: string;
  color: string;
}

const FEATURES: Feature[] = [
  { icon: '⚡', title: 'Smart AI Cuts', desc: 'Auto-detect beats, cuts, and highlights', tag: 'AI Powered', color: '#f5c060' },
  { icon: '🎬', title: '4K Export', desc: 'Cinema-grade 4K output with HDR support', tag: 'Pro Quality', color: '#00e5dc' },
  { icon: '🔗', title: 'Client Portal', desc: 'Seamless feedback & approval workflows', tag: 'Built-in', color: '#e040a0' },
  { icon: '☁️', title: 'Cloud Storage', desc: 'Unlimited secure cloud project storage', tag: 'Unlimited', color: '#00e57a' },
  { icon: '🔄', title: 'Version Control', desc: 'Full history with instant rollback', tag: 'Non-linear', color: '#e8a020' },
  { icon: '👁️', title: 'Live Preview', desc: 'Real-time client preview with timestamps', tag: 'Live', color: '#ffd980' },
];

export function Scene3() {
  const [phase, setPhase] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 0),
      setTimeout(() => setPhase(2), 400),
      setTimeout(() => setPhase(3), 900),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  useEffect(() => {
    if (phase < 3) return;
    const id = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % FEATURES.length);
    }, 1100);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: '#05050d' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.25 }}
    >
      {/* Magenta orb */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '45vw', height: '45vw',
          background: 'radial-gradient(circle, rgba(224,64,160,0.07) 0%, transparent 70%)',
          top: '-8vw', left: '-5vw',
        }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 'clamp(0.55rem, 1vw, 0.75rem)',
          letterSpacing: '5px',
          textTransform: 'uppercase',
          color: '#e8a020',
          fontWeight: 700,
          marginBottom: '1.5vh',
        }}
        initial={{ opacity: 0, y: -12 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
        transition={{ duration: 0.5, ease: 'circOut' }}
      >
        What You Get
      </motion.p>

      <motion.div
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
          letterSpacing: '3px',
          color: '#fff',
          textAlign: 'center',
          marginBottom: '4vh',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        Studio-Grade <span style={{ background: 'linear-gradient(135deg,#00e5dc,#e040a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Features</span>
      </motion.div>

      {/* Features grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'clamp(0.6rem, 1.5vw, 1.2rem)',
        maxWidth: '76vw',
        width: '100%',
      }}>
        {FEATURES.map((feat, i) => {
          const isActive = activeFeature === i && phase >= 3;
          return (
            <motion.div
              key={feat.title}
              style={{
                background: isActive ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isActive ? feat.color + '55' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '16px',
                padding: 'clamp(0.9rem, 1.8vw, 1.5rem)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'background 0.3s, border-color 0.3s',
              }}
              initial={{ opacity: 0, y: 25 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: phase >= 2 ? i * 0.06 : 0 }}
            >
              {/* Top accent */}
              {isActive && (
                <motion.div
                  layoutId="feature-accent"
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: `linear-gradient(90deg, transparent, ${feat.color}, transparent)`,
                  }}
                />
              )}

              <div style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', marginBottom: '0.5rem' }}>{feat.icon}</div>
              <div style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)',
                letterSpacing: '1.5px',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                marginBottom: '0.25rem',
              }}>
                {feat.title}
              </div>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 'clamp(0.58rem, 1vw, 0.78rem)',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.5,
              }}>
                {feat.desc}
              </div>
              <div style={{
                marginTop: '0.6rem',
                display: 'inline-block',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 'clamp(0.5rem, 0.85vw, 0.65rem)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                padding: '0.2rem 0.6rem',
                borderRadius: '20px',
                fontWeight: 700,
                background: `${feat.color}18`,
                color: feat.color,
                border: `1px solid ${feat.color}33`,
              }}>
                {feat.tag}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
