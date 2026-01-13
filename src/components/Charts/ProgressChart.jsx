import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProgressChart = ({ dailyHistory }) => {
  // Prepare data for chart (last 30 days)
  const chartData = dailyHistory.slice(-30).map(day => ({
    date: new Date(day.date).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' }),
    exp: day.totalExp || 0,
    workout: day.totalWorkouts || 0,
  }));

  return (
    <div className="border-2 border-neon-blue p-6 bg-system-darker">
      <h3 className="text-neon-blue font-bold text-lg mb-4">
        Прогрес за останні 30 днів
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
          <XAxis
            dataKey="date"
            stroke="#00d4ff"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#00d4ff"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a0e27',
              border: '1px solid #00d4ff',
              borderRadius: '0',
            }}
            labelStyle={{ color: '#00d4ff' }}
          />
          <Legend
            wrapperStyle={{ color: '#00d4ff' }}
          />
          <Line
            type="monotone"
            dataKey="exp"
            stroke="#00d4ff"
            strokeWidth={2}
            name="EXP"
            dot={{ fill: '#00d4ff', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="workout"
            stroke="#ffd700"
            strokeWidth={2}
            name="Тренувань"
            dot={{ fill: '#ffd700', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
