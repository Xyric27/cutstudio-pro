import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 0),
      setTimeout(() => setPhase(2), 400),
      setTimeout(() => setPhase(3), 900),
      setTimeout(() => setPhase(4), 1600),
      setTimeout(() => setPhase(5), 2400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const chars = 'CUTSTUDIO'.split('');

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: '#05050d' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Full-screen radial gold */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(232,160,32,0.13) 0%, transparent 70%)',
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Rotating ring */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 'clamp(280px, 45vw, 500px)',
          height: 'clamp(280px, 45vw, 500px)',
          border: '1px solid rgba(232,160,32,0.15)',
          top: '50%', left: '50%',
          marginTop: 'clamp(-140px, -22.5vw, -250px)',
          marginLeft: 'clamp(-140px, -22.5vw, -250px)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 'clamp(200px, 32vw, 360px)',
          height: 'clamp(200px, 32vw, 360px)',
          border: '1px solid rgba(0,229,220,0.1)',
          top: '50%', left: '50%',
          marginTop: 'clamp(-100px, -16vw, -180px)',
          marginLeft: 'clamp(-100px, -16vw, -180px)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
      />

      {/* CUTSTUDIO word */}
      <div style={{ position: 'relative', marginBottom: '0.5vh' }}>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(3.5rem, 10vw, 8rem)',
          letterSpacing: '0.08em',
          display: 'flex',
        }}>
          {chars.map((char, i) => (
            <motion.span
              key={i}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #ffd980, #e8a020, #f5c060)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              initial={{ opacity: 0, y: 50, scale: 0.7 }}
              animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24, delay: phase >= 1 ? i * 0.05 : 0 }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </div>

      {/* PRO */}
      <motion.div
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(1.4rem, 3.5vw, 3rem)',
          letterSpacing: '12px',
          color: 'rgba(255,255,255,0.35)',
          textAlign: 'center',
          marginBottom: '3vh',
        }}
        initial={{ opacity: 0, letterSpacing: '20px' }}
        animate={phase >= 2 ? { opacity: 1, letterSpacing: '12px' } : { opacity: 0, letterSpacing: '20px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        PRO
      </motion.div>

      {/* Divider */}
      <motion.div
        style={{
          width: 'clamp(60px, 10vw, 120px)',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #e8a020, transparent)',
          marginBottom: '2.5vh',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={phase >= 3 ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Tagline */}
      <motion.p
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(0.75rem, 1.6vw, 1.2rem)',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.12em',
          textAlign: 'center',
          fontWeight: 400,
          marginBottom: '3vh',
        }}
        initial={{ opacity: 0, y: 15 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.55, ease: 'circOut', delay: 0.1 }}
      >
        Edit. Deliver. Earn.
      </motion.p>

      {/* CTA pill */}
      <motion.div
        style={{
          padding: 'clamp(0.6rem, 1.2vw, 0.9rem) clamp(1.5rem, 3vw, 2.5rem)',
          background: 'linear-gradient(135deg, #e8a020, #f5c060)',
          borderRadius: '50px',
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(0.7rem, 1.3vw, 1rem)',
          fontWeight: 700,
          color: '#000',
          letterSpacing: '1px',
          boxShadow: '0 8px 40px rgba(232,160,32,0.45)',
        }}
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={phase >= 4 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 20 }}
        transition={{ type: 'spring', stiffness: 360, damping: 22, delay: 0.1 }}
      >
        Start Free Today
      </motion.div>

      {/* URL / brand */}
      <motion.p
        style={{
          marginTop: '2vh',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 'clamp(0.55rem, 1vw, 0.75rem)',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '3px',
          textTransform: 'lowercase',
        }}
        initial={{ opacity: 0 }}
        animate={phase >= 5 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        cutstudio.pro
      </motion.p>
    </motion.div>
  );
}
