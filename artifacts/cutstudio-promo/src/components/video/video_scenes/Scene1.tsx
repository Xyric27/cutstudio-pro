import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 0),
      setTimeout(() => setPhase(2), 400),
      setTimeout(() => setPhase(3), 900),
      setTimeout(() => setPhase(4), 1800),
      setTimeout(() => setPhase(5), 3200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const chars1 = 'CUT'.split('');
  const chars2 = 'STUDIO'.split('');

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: '#05050d' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.3 }}
    >
      {/* Radial glow center */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(232,160,32,0.18) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Horizontal scan line */}
      <motion.div
        className="absolute left-0 right-0"
        style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.6), transparent)', top: '50%' }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={phase >= 1 ? { scaleX: 1, opacity: [0, 1, 0.4] } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* CUT */}
      <div
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(6rem, 18vw, 14rem)',
          letterSpacing: '0.06em',
          lineHeight: 0.9,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {chars1.map((char, i) => (
          <motion.span
            key={i}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.75) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ opacity: 0, y: 60, rotateX: -50 }}
            animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 60, rotateX: -50 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22, delay: phase >= 2 ? i * 0.07 : 0 }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* STUDIO */}
      <div
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(6rem, 18vw, 14rem)',
          letterSpacing: '0.06em',
          lineHeight: 0.9,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {chars2.map((char, i) => (
          <motion.span
            key={i}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #e8a020, #f5c060, #e040a0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ opacity: 0, y: 60, rotateX: -50 }}
            animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 60, rotateX: -50 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22, delay: phase >= 2 ? 0.21 + i * 0.07 : 0 }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* PRO badge */}
      <motion.div
        style={{
          marginTop: '1.5vh',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 1.5rem',
          borderRadius: '40px',
          border: '1px solid rgba(232,160,32,0.4)',
          background: 'rgba(232,160,32,0.08)',
        }}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={phase >= 3 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span
          style={{ width: 7, height: 7, borderRadius: '50%', background: '#e8a020', display: 'inline-block' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 'clamp(0.55rem, 1.1vw, 0.8rem)',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: '#f5c060',
          fontWeight: 700,
        }}>
          Professional Video Editor Portal
        </span>
      </motion.div>

      {/* Tagline */}
      <motion.p
        style={{
          marginTop: '2vh',
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)',
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.08em',
          fontWeight: 400,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.6, ease: 'circOut' }}
      >
        Edit. Deliver. Earn.
      </motion.p>

      {/* Bottom border line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #e8a020 30%, #f5c060 50%, #e8a020 70%, transparent)' }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={phase >= 5 ? { scaleX: 1, opacity: 0.7 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
