import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const WeeklyProgress = ({ dailyHistory }) => {
  // Get last 7 days
  const last7Days = dailyHistory.slice(-7);

  const chartData = last7Days.map(day => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString('uk-UA', { weekday: 'short' });

    return {
      day: dayName,
      workouts: day.totalWorkouts || 0,
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="border-2 border-neon-blue p-6 bg-system-darker text-center">
        <h3 className="text-neon-blue font-bold text-lg mb-4">Тижневий прогрес</h3>
        <p className="text-gray-400">Немає даних для відображення</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-system-darker border-2 border-neon-cyan p-3 shadow-lg">
          <p className="text-neon-cyan font-bold mb-1">{label}</p>
          <p className="text-white">
            <span className="text-neon-cyan">⚡</span> Тренувань: <span className="text-neon-cyan font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Colors for bars with gradient effect
  const barColors = ['#00d4ff', '#06ffa5', '#00d4ff', '#06ffa5', '#00d4ff', '#06ffa5', '#00d4ff'];

  return (
    <div className="border-2 border-neon-cyan p-6 bg-system-darker glow-border relative overflow-hidden">
      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-neon-cyan opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-neon-cyan opacity-50"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-neon-cyan"></div>
          <h3 className="text-neon-cyan font-bold text-xl tracking-wider">
            ТИЖНЕВИЙ ПРОГРЕС (ОСТАННІ 7 ДНІВ)
          </h3>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06ffa5" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#00d4ff" stopOpacity={0.7}/>
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1a2332"
              strokeOpacity={0.3}
            />
            <XAxis
              dataKey="day"
              stroke="#06ffa5"
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
              tick={{ fill: '#06ffa5' }}
            />
            <YAxis
              stroke="#06ffa5"
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
              tick={{ fill: '#06ffa5' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="workouts"
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColors[index % barColors.length]}
                  opacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyProgress;
