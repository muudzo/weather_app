import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Wind } from 'lucide-react';

interface ForecastGridProps {
  forecast: Array<{
    day: string;
    date: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
    humidity: number;
    wind: number;
  }>;
}

export function ForecastGrid({ forecast }: ForecastGridProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-panel p-8 rounded-[2.5rem]"
    >
      <h2 className="text-white mb-6">7-Day Forecast</h2>
      
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, x: 5 }}
            onClick={() => setSelectedDay(selectedDay === index ? null : index)}
            className="relative cursor-pointer group"
          >
            {/* Main Card */}
            <div className="glass-panel-nested p-6 rounded-2xl overflow-hidden">
              {/* Hover gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-purple-400/0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />

              <div className="relative z-10 grid grid-cols-12 gap-4 items-center">
                {/* Day & Date */}
                <div className="col-span-3">
                  <p className="text-white">{day.day}</p>
                  <p className="text-white/50 text-sm">{day.date}</p>
                </div>

                {/* Weather Icon */}
                <div className="col-span-2 flex justify-center">
                  <WeatherIcon condition={day.condition} size="small" animated />
                </div>

                {/* Precipitation */}
                <div className="col-span-2 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="text-white/70">{day.precipitation}%</span>
                </div>

                {/* Temperature Range */}
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <span className="text-white">{day.high}°</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-400"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                    <span className="text-white/50">{day.low}°</span>
                  </div>
                </div>

                {/* Expand Indicator */}
                <div className="col-span-2 flex justify-end">
                  <motion.div
                    animate={{ rotate: selectedDay === index ? 180 : 0 }}
                    className="w-6 h-6 text-white/40 group-hover:text-white/70"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {selectedDay === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-3 gap-4 mt-3 px-6 pb-4">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="glass-panel-nested p-4 rounded-xl"
                    >
                      <Droplets className="w-5 h-5 text-blue-400 mb-2" />
                      <p className="text-white/60 text-sm">Humidity</p>
                      <p className="text-white text-lg">{day.humidity}%</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="glass-panel-nested p-4 rounded-xl"
                    >
                      <Wind className="w-5 h-5 text-cyan-400 mb-2" />
                      <p className="text-white/60 text-sm">Wind</p>
                      <p className="text-white text-lg">{day.wind} mph</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="glass-panel-nested p-4 rounded-xl"
                    >
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 mb-2" />
                      <p className="text-white/60 text-sm">Precipitation</p>
                      <p className="text-white text-lg">{day.precipitation}%</p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
