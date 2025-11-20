import { motion } from 'motion/react';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Wind } from 'lucide-react';

interface HourlyTimelineProps {
  hourly: Array<{
    time: string;
    temp: number;
    precipitation: number;
    wind: number;
    uv: number;
    condition: string;
  }>;
}

export function HourlyTimeline({ hourly }: HourlyTimelineProps) {
  const maxTemp = Math.max(...hourly.map(h => h.temp));
  const minTemp = Math.min(...hourly.map(h => h.temp));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-panel p-8 rounded-[2.5rem] overflow-hidden"
    >
      <h2 className="text-white mb-6">Hourly Forecast</h2>
      
      <div className="relative">
        {/* Scrollable container */}
        <div className="overflow-x-auto scrollbar-custom pb-4">
          <div className="flex gap-6 min-w-max">
            {hourly.map((hour, index) => {
              // Calculate temperature position for the graph
              const tempPercent = ((hour.temp - minTemp) / (maxTemp - minTemp)) * 100;
              
              return (
                <motion.div
                  key={hour.time}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center gap-4 min-w-[80px] group"
                >
                  {/* Time */}
                  <p className="text-white/60 group-hover:text-white transition-colors">
                    {hour.time}
                  </p>

                  {/* Weather Icon */}
                  <div className="relative">
                    <WeatherIcon condition={hour.condition} size="small" animated />
                  </div>

                  {/* Temperature Graph Point */}
                  <div className="relative h-24 flex items-end">
                    <motion.div
                      className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50"
                      style={{
                        marginBottom: `${tempPercent}%`,
                      }}
                      whileHover={{ scale: 1.5 }}
                    />
                  </div>

                  {/* Temperature */}
                  <motion.p
                    className="text-white text-xl group-hover:scale-110 transition-transform"
                    whileHover={{ 
                      textShadow: '0 0 20px rgba(34, 211, 238, 0.8)',
                    }}
                  >
                    {hour.temp}°
                  </motion.p>

                  {/* Additional Metrics */}
                  <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Precipitation */}
                    {hour.precipitation > 0 && (
                      <div className="flex items-center gap-1 text-blue-300 text-xs">
                        <Droplets className="w-3 h-3" />
                        <span>{hour.precipitation}%</span>
                      </div>
                    )}
                    
                    {/* Wind */}
                    <div className="flex items-center gap-1 text-cyan-300 text-xs">
                      <Wind className="w-3 h-3" />
                      <span>{hour.wind}</span>
                    </div>
                  </div>

                  {/* UV Index Bar */}
                  <div className="w-full">
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(hour.uv / 11) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.05, duration: 0.6 }}
                      />
                    </div>
                    <p className="text-white/40 text-xs text-center mt-1">UV {hour.uv}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Temperature line connecting points */}
        <svg
          className="absolute top-[180px] left-0 w-full h-24 pointer-events-none"
          style={{ marginLeft: '40px' }}
        >
          <motion.path
            d={hourly.map((hour, index) => {
              const tempPercent = ((hour.temp - minTemp) / (maxTemp - minTemp)) * 100;
              const x = index * 104 + 40; // 80px width + 24px gap
              const y = 96 - (tempPercent / 100) * 96; // Inverted for SVG coordinates
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            stroke="url(#tempGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          <defs>
            <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(34, 211, 238, 0.8)" />
              <stop offset="50%" stopColor="rgba(168, 85, 247, 0.8)" />
              <stop offset="100%" stopColor="rgba(236, 72, 153, 0.8)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </motion.div>
  );
}
