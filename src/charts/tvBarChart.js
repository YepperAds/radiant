import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function TVBarChart() {
  const data = [
    { name: 'RTV', visitors: 750 },
    { name: 'KC2', visitors: 1200 },
    { name: 'TV10', visitors: 2100 },
    { name: 'TV1', visitors: 1800 }
  ];

  const formatYAxis = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}k`;
    }
    return value;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div style={{
          backgroundColor: '#000',
          border: 'none',
          borderRadius: '8px',
          padding: '10px',
          color: '#fff'
        }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>{payload[0].payload.name}</p>
          <p style={{ margin: 0 }}>{`${value.toLocaleString()} visitors (${formatYAxis(value)})`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-screen bg-white flex items-center justify-start p-8">
      <div className="w-full max-w-4xl">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              stroke="#000" 
              tick={{ fill: '#000', fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: '#000', strokeWidth: 2 }}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              ticks={[500, 1000, 1500, 2000, 2500, 3000, 3500, 4000]}
              stroke="#000"
              tick={{ fill: '#000', fontSize: 14, fontWeight: 500 }}
              axisLine={{ stroke: '#000', strokeWidth: 2 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="visitors" 
              fill="#000" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TVBarChart;