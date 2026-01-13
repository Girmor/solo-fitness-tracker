import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EXERCISES } from '../../data/exercises';

const COLORS = ['#00d4ff', '#ffd700', '#ff6b9d', '#9d4edd', '#06ffa5', '#ff9e00', '#ff006e', '#8338ec'];

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
      <div className="border-2 border-neon-blue p-6 bg-system-darker text-center">
        <h3 className="text-neon-blue font-bold text-lg mb-4">Розподіл вправ</h3>
        <p className="text-gray-400">Немає даних для відображення</p>
      </div>
    );
  }

  const renderCustomLabel = ({ name, percent }) => {
    if (percent < 0.05) return null; // Don't show label if less than 5%
    return `${name} (${(percent * 100).toFixed(0)}%)`;
  };

  return (
    <div className="border-2 border-neon-blue p-6 bg-system-darker">
      <h3 className="text-neon-blue font-bold text-lg mb-4">
        Розподіл вправ
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={renderCustomLabel}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a0e27',
              border: '1px solid #00d4ff',
              borderRadius: '0',
            }}
            labelStyle={{ color: '#00d4ff' }}
          />
          <Legend
            wrapperStyle={{ color: '#00d4ff', fontSize: '12px' }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExerciseDistribution;
