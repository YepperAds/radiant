import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function TVPieChart() {
  const data = [
    { name: 'RTV', value: 1200000, percentage: 12 },
    { name: 'KC2', value: 800000, percentage: 8 },
    { name: 'TV10', value: 1500000, percentage: 15 },
    { name: 'TV1', value: 600000, percentage: 6 }
  ];

  const COLORS = ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#b3b3b3', '#cccccc', '#e6e6e6'];

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white p-3 rounded-lg shadow-lg">
          <p className="font-bold">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
          <p className="text-sm">{payload[0].payload.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-screen bg-white flex items-center justify-start p-8">
      <div className="w-full max-w-4xl">
        <p className="text-xl text-gray-600 mb-8 text-center">
          Total: $10 Million
        </p>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-3">
          <ResponsiveContainer width="40%" height={500}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={180}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="bg-gray-50 p-6 rounded-lg border-2 border-black">
            <h2 className="text-xl font-bold mb-4 text-black">Revenue Breakdown</h2>
            <div className="space-y-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="font-medium text-black">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-black">{formatCurrency(item.value)}</span>
                    <span className="text-gray-600 ml-2">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TVPieChart;