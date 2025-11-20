import { motion } from 'motion/react';
import { Wind, Droplets, Eye, Gauge, Thermometer, Sun } from 'lucide-react';

interface MetricsGridProps {
  current: {
    humidity: number;
    windSpeed: number;
    windDirection: string;
    visibility: number;
    pressure: number;
    uvIndex: number;
    dewPoint: number;
  };
}

export function MetricsGrid({ current }: MetricsGridProps) {
  const metrics = [
    {
      icon: <Wind className="w-6 h-6" />,
      label: 'Wind',
      value: `${current.windSpeed} mph`,
      subValue: current.windDirection,
      color: 'from-cyan-400 to-blue-500',
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      label: 'Humidity',
      value: `${current.humidity}%`,
      progress: current.humidity,
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: <Eye className="w-6 h-6" />,
      label: 'Visibility',
      value: `${current.visibility} mi`,
      color: 'from-purple-400 to-pink-500',
    },
    {
      icon: <Gauge className="w-6 h-6" />,
      label: 'Pressure',
      value: `${current.pressure} mb`,
      color: 'from-orange-400 to-red-500',
    },
    {
      icon: <Sun className="w-6 h-6" />,
      label: 'UV Index',
      value: current.uvIndex.toString(),
      progress: (current.uvIndex / 11) * 100,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: <Thermometer className="w-6 h-6" />,
      label: 'Dew Point',
      value: `${current.dewPoint}°F`,
      color: 'from-teal-400 to-cyan-500',
    },
  ];

  return (
    <div className="space-y-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.02, x: -5 }}
          className="glass-panel p-6 rounded-3xl group relative overflow-hidden"
        >
          {/* Gradient hover effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${metric.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}
                style={{
                  boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
                }}
              >
                <div className="text-white">
                  {metric.icon}
                </div>
              </motion.div>
              
              <div>
                <p className="text-white/60 text-sm mb-1">{metric.label}</p>
                <p className="text-white text-xl">{metric.value}</p>
                {metric.subValue && (
                  <p className="text-white/40 text-sm">{metric.subValue}</p>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar for applicable metrics */}
          {metric.progress !== undefined && (
            <motion.div
              className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${metric.progress}%` }}
                transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
              />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
