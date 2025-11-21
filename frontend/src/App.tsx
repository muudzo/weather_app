import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Settings, Bell } from 'lucide-react';
import { CurrentWeatherPanel } from './components/CurrentWeatherPanel';
import { ForecastGrid } from './components/ForecastGrid';
import { HourlyTimeline } from './components/HourlyTimeline';
import { WeatherMap } from './components/WeatherMap';
import { AlertBanner } from './components/AlertBanner';
import { KineticBackground } from './components/KineticBackground';
import { WeatherParticles } from './components/WeatherParticles';
import { MetricsGrid } from './components/MetricsGrid';

// Mock comprehensive weather data
const mockWeatherData = {
  location: {
    city: 'San Francisco',
    country: 'US',
    lat: 37.7749,
    lon: -122.4194,
  },
  current: {
    temperature: 72,
    feelsLike: 70,
    condition: 'partly-cloudy',
    description: 'Partly Cloudy',
    high: 78,
    low: 65,
    humidity: 65,
    windSpeed: 12,
    windDirection: 'NW',
    visibility: 10,
    pressure: 1013,
    uvIndex: 6,
    dewPoint: 58,
    precipitation: 0,
  },
  hourly: [
    { time: '12 PM', temp: 72, precipitation: 0, wind: 12, uv: 6, condition: 'partly-cloudy' },
    { time: '1 PM', temp: 74, precipitation: 0, wind: 13, uv: 7, condition: 'partly-cloudy' },
    { time: '2 PM', temp: 76, precipitation: 0, wind: 14, uv: 8, condition: 'sunny' },
    { time: '3 PM', temp: 78, precipitation: 5, wind: 15, uv: 7, condition: 'sunny' },
    { time: '4 PM', temp: 77, precipitation: 10, wind: 14, uv: 6, condition: 'partly-cloudy' },
    { time: '5 PM', temp: 75, precipitation: 15, wind: 13, uv: 4, condition: 'cloudy' },
    { time: '6 PM', temp: 73, precipitation: 20, wind: 12, uv: 2, condition: 'cloudy' },
    { time: '7 PM', temp: 70, precipitation: 25, wind: 11, uv: 1, condition: 'rainy' },
    { time: '8 PM', temp: 68, precipitation: 30, wind: 10, uv: 0, condition: 'rainy' },
    { time: '9 PM', temp: 66, precipitation: 20, wind: 9, uv: 0, condition: 'cloudy' },
  ],
  forecast: [
    { day: 'Mon', date: 'Nov 20', high: 78, low: 65, condition: 'partly-cloudy', precipitation: 10, humidity: 65, wind: 12 },
    { day: 'Tue', date: 'Nov 21', high: 75, low: 63, condition: 'cloudy', precipitation: 30, humidity: 70, wind: 14 },
    { day: 'Wed', date: 'Nov 22', high: 70, low: 60, condition: 'rainy', precipitation: 80, humidity: 85, wind: 18 },
    { day: 'Thu', date: 'Nov 23', high: 72, low: 62, condition: 'partly-cloudy', precipitation: 20, humidity: 68, wind: 13 },
    { day: 'Fri', date: 'Nov 24', high: 76, low: 64, condition: 'sunny', precipitation: 5, humidity: 60, wind: 10 },
    { day: 'Sat', date: 'Nov 25', high: 79, low: 66, condition: 'sunny', precipitation: 0, humidity: 58, wind: 9 },
    { day: 'Sun', date: 'Nov 26', high: 77, low: 65, condition: 'partly-cloudy', precipitation: 15, humidity: 62, wind: 11 },
  ],
  alerts: [
    {
      id: 1,
      type: 'warning',
      title: 'High UV Index Alert',
      message: 'UV index will reach 8 this afternoon. Use sun protection.',
      severity: 'moderate',
    }
  ],
  timeOfDay: 'day', // day, night, sunrise, sunset
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [weather, setWeather] = useState<any>(mockWeatherData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night' | 'sunrise' | 'sunset'>('day');

  // Simulate time-based color changes
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 7) setTimeOfDay('sunrise');
    else if (hour >= 7 && hour < 18) setTimeOfDay('day');
    else if (hour >= 18 && hour < 20) setTimeOfDay('sunset');
    else setTimeOfDay('night');
  }, []);

  // Try to fetch real weather from backend; fall back to mock data on failure.
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setError(null);
        setLoading(true);
        const base = (import.meta.env.VITE_API_BASE as string) || 'http://127.0.0.1:8001';
        const city = encodeURIComponent(mockWeatherData.location.city || 'San Francisco');
        const res = await fetch(`${base}/weather?city=${city}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const transformedData = {
          location: {
            city: data.city,
            country: data.country,
            lat: 0,
            lon: 0,
          },
          current: {
            temperature: Math.round(data.temperature * 9/5 + 32),
            feelsLike: Math.round(data.feels_like * 9/5 + 32),
            condition: data.description.toLowerCase().includes('cloud') ? 'partly-cloudy' : 'sunny',
            description: data.description,
            high: Math.round(data.temperature * 9/5 + 32) + 5,
            low: Math.round(data.temperature * 9/5 + 32) - 5,
            humidity: data.humidity,
            windSpeed: Math.round(data.wind_speed * 2.237),
            windDirection: 'NW',
            visibility: 10,
            pressure: 1013,
            uvIndex: 6,
            dewPoint: 58,
            precipitation: 0,
          },
          hourly: mockWeatherData.hourly,
          forecast: mockWeatherData.forecast,
          alerts: mockWeatherData.alerts,
          timeOfDay: 'day',
        };

        setWeather(transformedData);
        setLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn('Could not fetch weather from backend, using mock data', message);
        setError(message);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Kinetic Background */}
      <KineticBackground 
        condition={weather.current.condition}
        timeOfDay={timeOfDay}
      />
      
      {/* Weather Particles */}
      <WeatherParticles condition={weather.current.condition} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Minimal visible error banner for API failures */}
        {error && (
          <div className="px-4 md:px-8 py-3">
            <div className="max-w-[1800px] mx-auto">
              <div className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm">
                Error fetching weather: {error}
              </div>
            </div>
          </div>
        )}
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="px-4 md:px-8 py-6"
        >
          <div className="max-w-[1800px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* Location & Logo */}
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50"
                >
                  <MapPin className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-white neon-text">{weather.location.city}</h1>
                  <p className="text-white/60">{weather.location.country}</p>
                </div>
              </div>

              {/* Search & Actions */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-96">
                  <input
                    type="text"
                    placeholder="Search location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pl-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50 focus:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300"
                  />
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
                >
                  <Bell className="w-5 h-5 text-white/70" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
                >
                  <Settings className="w-5 h-5 text-white/70" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Alert Banner */}
        <AnimatePresence>
          {weather.alerts.length > 0 && (
            <div className="px-4 md:px-8 mb-6">
              <div className="max-w-[1800px] mx-auto">
                <AlertBanner alerts={weather.alerts} />
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <main className="px-4 md:px-8 pb-8">
          <div className="max-w-[1800px] mx-auto space-y-6">
            {/* Top Section: Current Weather + Metrics */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <CurrentWeatherPanel current={weather.current} />
              </div>
              <div>
                <MetricsGrid current={weather.current} />
              </div>
            </div>

            {/* Hourly Timeline */}
            <HourlyTimeline hourly={weather.hourly} />

            {/* Forecast & Map */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <ForecastGrid forecast={weather.forecast} />
              </div>
              <div>
                <WeatherMap location={weather.location} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
