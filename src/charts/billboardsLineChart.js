import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function BillboardsLineChart() {
    const data = [
        { name: 'Akagera Media', performance: 45 },
        { name: 'Alliance Media', performance: 65 }
    ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white p-3 rounded-lg shadow-lg">
          <p className="font-bold">{payload[0].payload.name}</p>
          <p className="text-sm">Performance: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-screen bg-white flex items-center justify-start p-8">
      <div className="w-full max-w-4xl">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              stroke="#000" 
              tick={{ fill: '#000', fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: '#000', strokeWidth: 2 }}
            />
            <YAxis 
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              domain={[0, 100]}
              stroke="#000"
              tick={{ fill: '#000', fontSize: 14, fontWeight: 500 }}
              axisLine={{ stroke: '#000', strokeWidth: 2 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
              formatter={() => 'Performance Score'}
            />
            <Line 
              type="monotone" 
              dataKey="performance" 
              stroke="#000" 
              strokeWidth={3}
              dot={{ fill: '#000', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: '#000', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Performance scores range from 0 to 100, tracking metrics across all websites
          </p>
        </div>
      </div>
    </div>
  );
}

export default BillboardsLineChart;