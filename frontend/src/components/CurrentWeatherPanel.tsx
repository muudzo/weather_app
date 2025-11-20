import { motion } from 'motion/react';
import { WeatherIcon } from './WeatherIcon';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CurrentWeatherPanelProps {
  current: {
    temperature: number;
    feelsLike: number;
    condition: string;
    description: string;
    high: number;
    low: number;
  };
}

export function CurrentWeatherPanel({ current }: CurrentWeatherPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden group"
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      <div className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Temperature Display */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-start gap-2"
            >
              <motion.span
                className="text-[120px] md:text-[140px] lg:text-[160px] leading-none text-white neon-text-strong"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(34, 211, 238, 0.5)',
                    '0 0 40px rgba(34, 211, 238, 0.8)',
                    '0 0 20px rgba(34, 211, 238, 0.5)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {current.temperature}
              </motion.span>
              <span className="text-6xl md:text-7xl text-white/60 mt-4">°F</span>
            </motion.div>

            <div className="space-y-3">
              <p className="text-white/90 text-2xl">{current.description}</p>
              <div className="flex items-center gap-4">
                <span className="text-white/60">Feels like {current.feelsLike}°F</span>
              </div>
            </div>

            {/* High/Low with animated indicators */}
            <div className="flex items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10"
              >
                <TrendingUp className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-white/60 text-sm">High</p>
                  <p className="text-white text-xl">{current.high}°</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10"
              >
                <TrendingDown className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white/60 text-sm">Low</p>
                  <p className="text-white text-xl">{current.low}°</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Weather Icon */}
          <div className="flex justify-center lg:justify-end">
            <WeatherIcon 
              condition={current.condition}
              size="large"
              animated
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
