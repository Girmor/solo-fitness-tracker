import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { EXERCISES } from '../../data/exercises';

const COLORS = [
  '#00d4ff', // Neon blue
  '#06ffa5', // Neon green
  '#ff6b9d', // Pink
  '#ffd700', // Gold
  '#9d4edd', // Purple
  '#ff9e00', // Orange
  '#ff006e', // Hot pink
  '#8338ec'  // Electric purple
];

const ExerciseDistribution = ({ exerciseHistory }) => {
  // Prepare data for pie chart
  const chartData = Object.entries(exerciseHistory)
    .filter(([_, data]) => data.total > 0)
    .map(([exerciseId, data]) => ({
      name: EXERCISES[exerciseId]?.nameUA || exerciseId,
      value: data.total,
      exp: data.exp || 0,
    }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <div className="border-2 border-purple-500 p-6 bg-system-darker text-center">
        <h3 className="text-purple-400 font-bold text-lg mb-4">Розподіл вправ</h3>
        <p className="text-gray-400">Немає даних для відображення</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
      return (
        <div className="bg-system-darker border-2 border-purple-500 p-4 shadow-lg">
          <p className="text-purple-400 font-bold mb-2">{data.name}</p>
          <p className="text-white">
            <span className="text-purple-300">⚡</span> Кількість: <span className="text-purple-300 font-bold">{data.value.toFixed(1)}</span>
          </p>
          <p className="text-white">
            <span className="text-purple-300">📊</span> Відсоток: <span className="text-purple-300 font-bold">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border-2 border-purple-500 p-6 bg-system-darker glow-border relative overflow-hidden">
      {/* Hexagonal pattern background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-purple-500 rotate-45"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-purple-400 rotate-45 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-purple-500"></div>
          <h3 className="text-purple-400 font-bold text-xl tracking-wider">
            РОЗПОДІЛ ВПРАВ
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-6">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <radialGradient key={`gradient-${index}`} id={`pieGradient${index}`}>
                    <stop offset="0%" stopColor={color} stopOpacity={1}/>
                    <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
                  </radialGradient>
                ))}
              </defs>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={2}
                strokeWidth={2}
                stroke="#0a0e27"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#pieGradient${index % COLORS.length})`}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Custom Legend */}
          <div className="flex-1 space-y-2">
            {chartData.map((entry, index) => {
              const percentage = ((entry.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0);
              return (
                <div key={index} className="flex items-center gap-3 p-2 bg-black/30 border border-gray-700">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1">
                    <div className="text-sm text-gray-300 font-bold">{entry.name}</div>
                    <div className="text-xs text-gray-500">{entry.value.toFixed(1)} ({percentage}%)</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDistribution;
