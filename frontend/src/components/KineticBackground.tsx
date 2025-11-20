import { motion } from 'motion/react';

interface KineticBackgroundProps {
  condition: string;
  timeOfDay: 'day' | 'night' | 'sunrise' | 'sunset';
}

export function KineticBackground({ condition, timeOfDay }: KineticBackgroundProps) {
  // Define color schemes based on time and weather
  const getGradient = () => {
    const base = {
      day: 'from-blue-400 via-cyan-300 to-blue-200',
      night: 'from-slate-900 via-purple-900 to-slate-800',
      sunrise: 'from-orange-400 via-pink-400 to-purple-400',
      sunset: 'from-orange-500 via-red-400 to-purple-500',
    };

    const weatherOverlay = {
      'sunny': 'from-yellow-400/20 via-orange-300/10 to-transparent',
      'rainy': 'from-slate-600/30 via-blue-900/20 to-slate-700/30',
      'cloudy': 'from-gray-500/20 via-slate-400/10 to-gray-600/20',
      'partly-cloudy': 'from-blue-300/20 via-slate-300/10 to-blue-400/20',
      'stormy': 'from-slate-800/40 via-purple-900/30 to-slate-900/40',
    };

    return {
      base: base[timeOfDay],
      overlay: weatherOverlay[condition as keyof typeof weatherOverlay] || weatherOverlay['partly-cloudy'],
    };
  };

  const gradients = getGradient();

  return (
    <div className="fixed inset-0 -z-10">
      {/* Base Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients.base}`} />
      
      {/* Weather Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients.overlay}`} />

      {/* Animated Orbs */}
      <motion.div
        className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-[40%] right-[15%] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-[10%] left-[30%] w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Mesh Gradient Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(at 20% 30%, rgba(34, 211, 238, 0.3) 0px, transparent 50%),
            radial-gradient(at 80% 20%, rgba(168, 85, 247, 0.3) 0px, transparent 50%),
            radial-gradient(at 40% 70%, rgba(59, 130, 246, 0.3) 0px, transparent 50%),
            radial-gradient(at 90% 80%, rgba(236, 72, 153, 0.3) 0px, transparent 50%)
          `,
        }}
      />

      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
