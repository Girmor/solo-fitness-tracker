import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeeklyProgress = ({ dailyHistory }) => {
  // Get last 7 days
  const last7Days = dailyHistory.slice(-7);

  const chartData = last7Days.map(day => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString('uk-UA', { weekday: 'short' });

    return {
      day: dayName,
      exp: day.totalExp || 0,
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

  return (
    <div className="border-2 border-neon-blue p-6 bg-system-darker">
      <h3 className="text-neon-blue font-bold text-lg mb-4">
        Тижневий прогрес (останні 7 днів)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
          <XAxis
            dataKey="day"
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
          <Bar dataKey="exp" fill="#00d4ff" name="EXP" />
          <Bar dataKey="workouts" fill="#ffd700" name="Тренування" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyProgress;
