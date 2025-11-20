import { ReactNode } from 'react';

interface WeatherDetailProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export function WeatherDetail({ icon, label, value }: WeatherDetailProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-4 hover:bg-white/15 transition-all">
      <div className="text-white/70">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-white/70">{label}</p>
        <p className="text-white">{value}</p>
      </div>
    </div>
  );
}
