import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

function CountUp({ target, duration, suffix = '' }: { target: number; duration: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return (
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
      {val.toLocaleString()}{suffix}
    </span>
  );
}

interface StatItem {
  num: number;
  suffix: string;
  label: string;
  color: string;
}

const STATS: StatItem[] = [
  { num: 2400, suffix: '+', label: 'Active Editors', color: '#f5c060' },
  { num: 12000, suffix: '+', label: 'Projects Delivered', color: '#00e5dc' },
  { num: 98, suffix: '%', label: 'Client Satisfaction', color: '#00e57a' },
  { num: 60, suffix: '/min', label: 'Avg Earnings (Rs)', color: '#e040a0' },
];

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 0),
      setTimeout(() => setPhase(2), 300),
      setTimeout(() => setPhase(3), 700),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: '#05050d' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.25 }}
    >
      {/* Cyan bottom orb */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '50vw', height: '50vw',
          background: 'radial-gradient(circle, rgba(0,229,220,0.09) 0%, transparent 70%)',
          bottom: '-10vw', right: '-5vw',
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Section label */}
      <motion.p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 'clamp(0.55rem, 1vw, 0.75rem)',
          letterSpacing: '5px',
          textTransform: 'uppercase',
          color: '#e8a020',
          fontWeight: 700,
          marginBottom: '2vh',
        }}
        initial={{ opacity: 0, y: -15 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
        transition={{ duration: 0.5, ease: 'circOut' }}
      >
        Platform Overview
      </motion.p>

      {/* Headline */}
      <motion.div
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          letterSpacing: '3px',
          color: '#fff',
          textAlign: 'center',
          marginBottom: '5vh',
        }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Trusted by India's <span style={{ background: 'linear-gradient(135deg,#e8a020,#f5c060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Best Editors</span>
      </motion.div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'clamp(1rem, 2.5vw, 2rem)',
        maxWidth: '72vw',
        width: '100%',
      }}>
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: 'clamp(1.2rem, 2.5vw, 2rem) clamp(1.2rem, 2.5vw, 2rem)',
              position: 'relative',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: phase >= 2 ? i * 0.1 : 0 }}
          >
            {/* Top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
            }} />

            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
              fontWeight: 700,
              color: stat.color,
              lineHeight: 1,
              marginBottom: '0.4rem',
            }}>
              {phase >= 3 ? <CountUp target={stat.num} duration={2} suffix={stat.suffix} /> : `0${stat.suffix}`}
            </div>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(0.6rem, 1.2vw, 0.85rem)',
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: 600,
            }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
