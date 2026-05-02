import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const STEPS = [
  { num: '01', title: 'Upload', desc: 'Drag & drop footage directly to your dashboard', color: '#e8a020' },
  { num: '02', title: 'Edit', desc: 'Timeline, AI cuts, color grade — all in one place', color: '#00e5dc' },
  { num: '03', title: 'Review', desc: 'Share live preview link for real-time client feedback', color: '#e040a0' },
  { num: '04', title: 'Deliver', desc: 'Export 4K, collect payment, done', color: '#00e57a' },
];

export function Scene4() {
  const [phase, setPhase] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 0),
      setTimeout(() => setPhase(2), 400),
      setTimeout(() => setActiveStep(0), 700),
      setTimeout(() => setActiveStep(1), 1600),
      setTimeout(() => setActiveStep(2), 2500),
      setTimeout(() => setActiveStep(3), 3400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: '#05050d' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
    >
      {/* Gold orb bottom-right */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '55vw', height: '55vw',
          background: 'radial-gradient(circle, rgba(232,160,32,0.09) 0%, transparent 70%)',
          bottom: '-15vw', right: '-10vw',
        }}
        animate={{ scale: [1, 1.08, 1], rotate: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
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
        Workflow
      </motion.p>

      <motion.div
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
          letterSpacing: '3px',
          color: '#fff',
          textAlign: 'center',
          marginBottom: '5vh',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        From Raw Footage to <span style={{ background: 'linear-gradient(135deg,#e8a020,#f5c060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Paid Invoice</span>
      </motion.div>

      <div style={{
        display: 'flex',
        gap: 'clamp(0.8rem, 2vw, 1.8rem)',
        maxWidth: '80vw',
        width: '100%',
        alignItems: 'flex-start',
      }}>
        {STEPS.map((step, i) => {
          const isActive = activeStep >= i;
          return (
            <div key={step.title} style={{ flex: 1, position: 'relative' }}>
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: 'clamp(1.1rem, 2.2vw, 1.8rem)',
                  left: '100%',
                  width: '100%',
                  height: '1px',
                  zIndex: 0,
                  overflow: 'hidden',
                }}>
                  <motion.div
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${step.color}, ${STEPS[i + 1].color})`,
                      transformOrigin: 'left',
                    }}
                    initial={{ scaleX: 0 }}
                    animate={activeStep >= i + 1 ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              )}

              <motion.div
                style={{
                  background: isActive ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.015)',
                  border: `1px solid ${isActive ? step.color + '55' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '18px',
                  padding: 'clamp(1rem, 2vw, 1.8rem)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: phase >= 2 ? i * 0.1 : 0 }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: `linear-gradient(90deg, transparent, ${step.color}, transparent)`,
                  }} />
                )}

                {/* Step number */}
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 'clamp(0.55rem, 1vw, 0.8rem)',
                  fontWeight: 700,
                  color: step.color,
                  letterSpacing: '2px',
                  marginBottom: '0.6rem',
                  opacity: isActive ? 1 : 0.4,
                }}>
                  {step.num}
                </div>

                {/* Circle indicator */}
                <motion.div style={{
                  width: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                  height: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                  borderRadius: '50%',
                  background: isActive ? `${step.color}25` : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${isActive ? step.color : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.8rem',
                  transition: 'all 0.4s',
                }}>
                  <motion.div
                    style={{
                      width: '40%', height: '40%', borderRadius: '50%',
                      background: step.color,
                    }}
                    animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>

                <div style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(1rem, 2vw, 1.6rem)',
                  letterSpacing: '1.5px',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                  marginBottom: '0.4rem',
                  transition: 'color 0.4s',
                }}>
                  {step.title}
                </div>

                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 'clamp(0.58rem, 1.1vw, 0.8rem)',
                  color: isActive ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.25)',
                  lineHeight: 1.5,
                  transition: 'color 0.4s',
                }}>
                  {step.desc}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
