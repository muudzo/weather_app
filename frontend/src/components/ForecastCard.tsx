import { Cloud, CloudRain, Sun, CloudSun } from 'lucide-react';
import { motion } from 'motion/react';

interface ForecastCardProps {
  day: string;
  high: number;
  low: number;
  condition: string;
  delay?: number;
}

export function ForecastCard({ day, high, low, condition, delay = 0 }: ForecastCardProps) {
  const getWeatherIcon = () => {
    const iconClass = "w-8 h-8";
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className={`${iconClass} text-yellow-300`} />;
      case 'cloudy':
        return <Cloud className={`${iconClass} text-gray-300`} />;
      case 'rainy':
        return <CloudRain className={`${iconClass} text-blue-300`} />;
      case 'partly-cloudy':
        return <CloudSun className={`${iconClass} text-yellow-200`} />;
      default:
        return <CloudSun className={`${iconClass} text-yellow-200`} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-center gap-4 cursor-pointer transition-all hover:bg-white/15"
    >
      <span className="text-white/90">{day}</span>
      <div className="my-2">
        {getWeatherIcon()}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white">{high}°</span>
        <span className="text-white/50">{low}°</span>
      </div>
    </motion.div>
  );
}
