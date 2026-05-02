import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';

export const SCENE_DURATIONS = {
  intro: 7000,
  stats: 8000,
  features: 9000,
  workflow: 9000,
  pricing: 8000,
  outro: 7000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  intro: Scene1,
  stats: Scene2,
  features: Scene3,
  workflow: Scene4,
  pricing: Scene5,
  outro: Scene6,
};

// Persistent orb positions keyed by scene index
const ORB_POS = [
  { x: '75vw', y: '-15vh', scale: 1.4, opacity: 0.55 },
  { x: '-8vw', y: '60vh', scale: 1.1, opacity: 0.45 },
  { x: '80vw', y: '70vh', scale: 1.6, opacity: 0.4 },
  { x: '20vw', y: '-10vh', scale: 1.0, opacity: 0.5 },
  { x: '50vw', y: '50vh', scale: 2.0, opacity: 0.35 },
  { x: '40vw', y: '30vh', scale: 1.3, opacity: 0.6 },
];

const ACCENT_LINE = [
  { left: '5%', width: '30%', top: '80%' },
  { left: '60%', width: '35%', top: '20%' },
  { left: '10%', width: '45%', top: '88%' },
  { left: '50%', width: '40%', top: '15%' },
  { left: '5%', width: '25%', top: '75%' },
  { left: '35%', width: '30%', top: '10%' },
];

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  const orbPos = ORB_POS[sceneIndex] ?? ORB_POS[0];
  const accentLine = ACCENT_LINE[sceneIndex] ?? ACCENT_LINE[0];

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#05050d' }}>

      {/* ── PERSISTENT: drifting background orb (gold) ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 'clamp(400px, 55vw, 700px)',
          height: 'clamp(400px, 55vw, 700px)',
          background: 'radial-gradient(circle, rgba(232,160,32,0.11) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ x: orbPos.x, y: orbPos.y, scale: orbPos.scale, opacity: orbPos.opacity }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* ── PERSISTENT: cyan orb (bottom-left drift) ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 'clamp(280px, 40vw, 500px)',
          height: 'clamp(280px, 40vw, 500px)',
          background: 'radial-gradient(circle, rgba(0,229,220,0.07) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: ['-10%', '20%', '-10%'],
          y: ['60%', '80%', '60%'],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── PERSISTENT: magenta orb ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 'clamp(200px, 30vw, 380px)',
          height: 'clamp(200px, 30vw, 380px)',
          background: 'radial-gradient(circle, rgba(224,64,160,0.06) 0%, transparent 70%)',
          filter: 'blur(45px)',
        }}
        animate={{
          x: ['70%', '50%', '70%'],
          y: ['-5%', '20%', '-5%'],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── PERSISTENT: grain overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
          opacity: 0.55,
          zIndex: 50,
        }}
      />

      {/* ── PERSISTENT: accent line ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.5), transparent)' }}
        animate={{ left: accentLine.left, width: accentLine.width, top: accentLine.top }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* ── PERSISTENT: floating dot grid ── */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: i % 2 === 0 ? 4 : 3,
            height: i % 2 === 0 ? 4 : 3,
            background: i % 3 === 0 ? 'rgba(232,160,32,0.5)' : i % 3 === 1 ? 'rgba(0,229,220,0.4)' : 'rgba(224,64,160,0.4)',
            left: `${10 + i * 14}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
        />
      ))}

      {/* ── SCENES inside AnimatePresence ── */}
      <AnimatePresence initial={false} mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
