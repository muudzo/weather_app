import { motion } from 'motion/react';
import { Cloud, CloudRain, Sun, CloudSun, CloudSnow, CloudDrizzle, Wind } from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export function WeatherIcon({ condition, size = 'medium', animated = false }: WeatherIconProps) {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-24 h-24',
    large: 'w-48 h-48',
  };

  const getIcon = () => {
    const className = `${sizeClasses[size]} drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]`;
    
    switch (condition.toLowerCase()) {
      case 'sunny':
        return (
          <motion.div
            animate={animated ? {
              rotate: 360,
              scale: [1, 1.1, 1],
            } : {}}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <Sun className={`${className} text-yellow-300`} />
          </motion.div>
        );
      
      case 'cloudy':
        return (
          <motion.div
            animate={animated ? {
              x: [0, 10, 0],
            } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Cloud className={`${className} text-gray-300`} />
          </motion.div>
        );
      
      case 'rainy':
        return (
          <motion.div
            animate={animated ? {
              y: [0, 5, 0],
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CloudRain className={`${className} text-blue-300`} />
          </motion.div>
        );
      
      case 'partly-cloudy':
        return (
          <motion.div
            animate={animated ? {
              x: [0, 8, 0],
              y: [0, -5, 0],
            } : {}}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CloudSun className={`${className} text-yellow-200`} />
          </motion.div>
        );
      
      case 'snowy':
        return (
          <motion.div
            animate={animated ? {
              y: [0, 8, 0],
            } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CloudSnow className={`${className} text-blue-200`} />
          </motion.div>
        );
      
      case 'drizzle':
        return <CloudDrizzle className={`${className} text-cyan-300`} />;
      
      case 'windy':
        return (
          <motion.div
            animate={animated ? {
              x: [0, 15, 0],
            } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Wind className={`${className} text-cyan-200`} />
          </motion.div>
        );
      
      default:
        return <CloudSun className={`${className} text-yellow-200`} />;
    }
  };

  return (
    <div className="relative">
      {/* Glow effect for large icons */}
      {size === 'large' && (
        <motion.div
          className="absolute inset-0 blur-3xl opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.6) 0%, transparent 70%)',
          }}
        />
      )}
      {getIcon()}
    </div>
  );
}
