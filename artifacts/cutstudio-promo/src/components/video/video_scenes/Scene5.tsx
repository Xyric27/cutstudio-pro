import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    tag: 'Begin',
    color: 'rgba(255,255,255,0.6)',
    border: 'rgba(255,255,255,0.1)',
    bg: 'rgba(255,255,255,0.02)',
    perks: ['5 projects/month', 'HD Export', 'Basic client portal'],
    featured: false,
  },
  {
    name: 'Creator',
    price: 'Rs 599',
    period: '/month',
    tag: 'Most Popular',
    color: '#f5c060',
    border: 'rgba(232,160,32,0.4)',
    bg: 'rgba(232,160,32,0.06)',
    perks: ['30 projects/month', '4K Export', 'AI Smart Cuts', 'Priority support'],
    featured: true,
  },
  {
    name: 'Studio',
    price: 'Rs 1499',
    period: '/month',
    tag: 'Full Power',
    color: '#00e5dc',
    border: 'rgba(0,229,220,0.35)',
    bg: 'rgba(0,229,220,0.04)',
    perks: ['Unlimited projects', '4K + HDR', 'Team workspace', 'White-label portal'],
    featured: false,
  },
];

export function Scene5() {
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
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
    >
      {/* Gold orb */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '60vw', height: '60vw',
          background: 'radial-gradient(circle, rgba(232,160,32,0.08) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
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
        Pricing
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
        Pick Your <span style={{ background: 'linear-gradient(135deg,#e8a020,#f5c060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Plan</span>
      </motion.div>

      <div style={{
        display: 'flex',
        gap: 'clamp(0.8rem, 2vw, 1.8rem)',
        maxWidth: '76vw',
        width: '100%',
        alignItems: 'stretch',
      }}>
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            style={{
              flex: 1,
              background: plan.bg,
              border: `1px solid ${plan.border}`,
              borderRadius: '22px',
              padding: 'clamp(1.2rem, 2.5vw, 2rem)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transform: plan.featured ? 'scale(1.04)' : 'scale(1)',
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: phase >= 2 ? i * 0.12 : 0 }}
          >
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: `linear-gradient(90deg, transparent, ${plan.color}, transparent)`,
            }} />

            {/* Tag */}
            {phase >= 3 && (
              <motion.div
                style={{
                  display: 'inline-block',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 'clamp(0.5rem, 0.85vw, 0.65rem)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  padding: '0.25rem 0.7rem',
                  borderRadius: '20px',
                  background: `${plan.color}18`,
                  color: plan.color,
                  border: `1px solid ${plan.color}33`,
                  marginBottom: '0.8rem',
                  width: 'fit-content',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                {plan.tag}
              </motion.div>
            )}

            <div style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(1.2rem, 2.4vw, 2rem)',
              letterSpacing: '2px',
              color: '#fff',
              marginBottom: '0.3rem',
            }}>
              {plan.name}
            </div>

            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
              fontWeight: 700,
              color: plan.color,
              lineHeight: 1,
              marginBottom: '0.2rem',
            }}>
              {plan.price}
              <span style={{ fontSize: '40%', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>{plan.period}</span>
            </div>

            <div style={{
              height: '1px',
              background: 'rgba(255,255,255,0.07)',
              margin: '0.8rem 0',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {plan.perks.map((perk, j) => (
                <motion.div
                  key={perk}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontFamily: 'Syne, sans-serif',
                    fontSize: 'clamp(0.58rem, 1.1vw, 0.8rem)',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ delay: phase >= 3 ? j * 0.07 + i * 0.1 : 0, duration: 0.4 }}
                >
                  <span style={{ color: plan.color, fontSize: '0.7rem' }}>✓</span>
                  {perk}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
