import { motion } from 'motion/react';
import { Layers, Radar, Wind as WindIcon } from 'lucide-react';
import { useState } from 'react';

interface WeatherMapProps {
  location: {
    city: string;
    lat: number;
    lon: number;
  };
}

export function WeatherMap({ location }: WeatherMapProps) {
  const [mapLayer, setMapLayer] = useState<'radar' | 'temperature' | 'wind'>('radar');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass-panel p-6 rounded-[2.5rem] h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white">Weather Map</h3>
        
        {/* Layer Selector */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMapLayer('radar')}
            className={`p-2 rounded-xl transition-all ${
              mapLayer === 'radar'
                ? 'bg-cyan-400/20 border border-cyan-400/50 text-cyan-400'
                : 'bg-white/5 border border-white/10 text-white/60'
            }`}
          >
            <Radar className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMapLayer('temperature')}
            className={`p-2 rounded-xl transition-all ${
              mapLayer === 'temperature'
                ? 'bg-orange-400/20 border border-orange-400/50 text-orange-400'
                : 'bg-white/5 border border-white/10 text-white/60'
            }`}
          >
            <Layers className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMapLayer('wind')}
            className={`p-2 rounded-xl transition-all ${
              mapLayer === 'wind'
                ? 'bg-purple-400/20 border border-purple-400/50 text-purple-400'
                : 'bg-white/5 border border-white/10 text-white/60'
            }`}
          >
            <WindIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10">
        {/* Animated radar effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, transparent 30%, rgba(34, 211, 238, 0.1) 30%, rgba(34, 211, 238, 0.1) 31%, transparent 31%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Center marker */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-400"
              animate={{
                scale: [1, 2, 1],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.div>
        </div>

        {/* Weather pattern overlay based on selected layer */}
        {mapLayer === 'radar' && (
          <svg className="absolute inset-0 w-full h-full opacity-40">
            <defs>
              <radialGradient id="radarGradient">
                <stop offset="0%" stopColor="rgba(34, 211, 238, 0)" />
                <stop offset="50%" stopColor="rgba(34, 211, 238, 0.3)" />
                <stop offset="100%" stopColor="rgba(34, 211, 238, 0.6)" />
              </radialGradient>
            </defs>
            <motion.circle
              cx="50%"
              cy="50%"
              r="30%"
              fill="url(#radarGradient)"
              animate={{
                r: ['20%', '40%', '20%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </svg>
        )}

        {mapLayer === 'temperature' && (
          <div className="absolute inset-0 opacity-50">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-orange-400/40 blur-2xl" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-blue-400/40 blur-2xl" />
          </div>
        )}

        {mapLayer === 'wind' && (
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(168, 85, 247, 0.1) 10px, rgba(168, 85, 247, 0.1) 20px)',
              backgroundSize: '200% 200%',
            }}
          />
        )}
      </div>

      {/* Location Info */}
      <div className="mt-4 p-4 glass-panel-nested rounded-xl">
        <p className="text-white/60 text-sm mb-1">Current Location</p>
        <p className="text-white">{location.city}</p>
        <p className="text-white/40 text-xs mt-1">
          {location.lat.toFixed(4)}°, {location.lon.toFixed(4)}°
        </p>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400" />
          <span className="text-white/60">Light</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-white/60">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-600" />
          <span className="text-white/60">Heavy</span>
        </div>
      </div>
    </motion.div>
  );
}
