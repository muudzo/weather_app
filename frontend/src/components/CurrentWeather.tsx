import { Cloud, CloudRain, Sun, CloudSun } from 'lucide-react';

interface CurrentWeatherProps {
  temperature: number;
  condition: string;
  high: number;
  low: number;
}

export function CurrentWeather({ temperature, condition, high, low }: CurrentWeatherProps) {
  const getWeatherIcon = () => {
    const iconClass = "w-32 h-32 md:w-40 md:h-40";
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className={`${iconClass} text-yellow-300`} />;
      case 'cloudy':
        return <Cloud className={`${iconClass} text-gray-300`} />;
      case 'rainy':
        return <CloudRain className={`${iconClass} text-blue-300`} />;
      case 'partly cloudy':
        return <CloudSun className={`${iconClass} text-yellow-200`} />;
      default:
        return <CloudSun className={`${iconClass} text-yellow-200`} />;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 h-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Temperature Display */}
        <div className="flex items-center gap-8">
          <div className="flex items-start">
            <span className="text-8xl md:text-9xl text-white">{temperature}</span>
            <span className="text-4xl md:text-5xl text-white/70 mt-4">°F</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-white/70">High:</span>
              <span className="text-white">{high}°</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/70">Low:</span>
              <span className="text-white">{low}°</span>
            </div>
          </div>
        </div>

        {/* Weather Icon & Condition */}
        <div className="flex flex-col items-center gap-4">
          {getWeatherIcon()}
          <p className="text-white/90 text-center">{condition}</p>
        </div>
      </div>
    </div>
  );
}
