import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressChart = ({ dailyHistory }) => {
  // Prepare data for chart (last 30 days)
  const chartData = dailyHistory.slice(-30).map(day => ({
    date: new Date(day.date).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' }),
    workouts: day.totalWorkouts || 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-system-darker border-2 border-neon-blue p-3 shadow-lg">
          <p className="text-neon-cyan font-bold mb-1">{label}</p>
          <p className="text-white">
            <span className="text-neon-blue">⚡</span> Тренувань: <span className="text-neon-cyan font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border-2 border-neon-blue p-6 bg-system-darker glow-border relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-neon-blue"></div>
          <h3 className="text-neon-blue font-bold text-xl tracking-wider">
            ПРОГРЕС ЗА ОСТАННІ 30 ДНІВ
          </h3>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#06ffa5" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1a2332"
              strokeOpacity={0.3}
            />
            <XAxis
              dataKey="date"
              stroke="#00d4ff"
              style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
              tick={{ fill: '#00d4ff' }}
            />
            <YAxis
              stroke="#00d4ff"
              style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
              tick={{ fill: '#00d4ff' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="workouts"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={{
                fill: '#00d4ff',
                r: 5,
                strokeWidth: 2,
                stroke: '#0a0e27',
                filter: 'url(#glow)'
              }}
              activeDot={{
                r: 8,
                fill: '#06ffa5',
                stroke: '#00d4ff',
                strokeWidth: 3,
                filter: 'url(#glow)'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
