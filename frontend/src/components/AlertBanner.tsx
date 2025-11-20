import { motion } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

interface Alert {
  id: number;
  type: string;
  title: string;
  message: string;
  severity: 'low' | 'moderate' | 'high';
}

interface AlertBannerProps {
  alerts: Alert[];
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          border: 'border-red-400/50',
          bg: 'from-red-500/20 to-orange-500/20',
          glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]',
          icon: 'text-red-400',
        };
      case 'moderate':
        return {
          border: 'border-yellow-400/50',
          bg: 'from-yellow-500/20 to-orange-500/20',
          glow: 'shadow-[0_0_30px_rgba(234,179,8,0.3)]',
          icon: 'text-yellow-400',
        };
      default:
        return {
          border: 'border-blue-400/50',
          bg: 'from-blue-500/20 to-cyan-500/20',
          glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]',
          icon: 'text-blue-400',
        };
    }
  };

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {visibleAlerts.map((alert, index) => {
        const styles = getSeverityStyles(alert.severity);
        
        return (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`glass-panel p-6 rounded-3xl border ${styles.border} ${styles.glow} relative overflow-hidden group`}
          >
            {/* Animated gradient background */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${styles.bg} opacity-50`}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ backgroundSize: '200% 100%' }}
            />

            {/* Pulsing border glow */}
            <motion.div
              className={`absolute inset-0 border ${styles.border} rounded-3xl`}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <div className="relative z-10 flex items-start gap-4">
              {/* Animated icon */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-white mb-1">{alert.title}</h3>
                <p className="text-white/70">{alert.message}</p>
              </div>

              {/* Dismiss button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDismissedAlerts([...dismissedAlerts, alert.id])}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </motion.button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
