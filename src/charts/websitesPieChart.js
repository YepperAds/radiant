import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function WebsitesPieChart() {
  const data = [
    { name: 'Igihe', value: 1200000, percentage: 12 },
    { name: 'Newtimes', value: 800000, percentage: 8 },
    { name: 'Rwanda Jobs', value: 1500000, percentage: 15 },
    { name: 'KT Press', value: 600000, percentage: 6 },
    { name: 'Kigali Today', value: 1800000, percentage: 18 },
    { name: 'Inyarwanda', value: 900000, percentage: 9 },
    { name: 'Rushyashya', value: 700000, percentage: 7 },
    { name: 'Umuseke', value: 1300000, percentage: 13 },
    { name: 'Taarifa', value: 500000, percentage: 5 },
    { name: 'Blogs', value: 700000, percentage: 7 }
  ];

  const COLORS = {
    'Igihe': '#0062ffff',
    'Newtimes': '#000000',
    'Rwanda Jobs': 'url(#gradient-rj)',
    'KT Press': 'url(#gradient-kt)',
    'Kigali Today': '#fc0000ff',
    'Inyarwanda': 'url(#gradient-iny)',
    'Rushyashya': '#ff0040ff',
    'Umuseke': '#000000',
    'Taarifa': '#a30606ff',
    'Blogs': '#ffbf00ff'
  };

  const LEGEND_COLORS = {
    'Igihe': '#0062ffff',
    'Newtimes': '#000000',
    'Rwanda Jobs': '#22c55e',
    'KT Press': '#ef4444',
    'Kigali Today': '#fc0000ff',
    'Inyarwanda': '#34d399',
    'Rushyashya': '#ff0040ff',
    'Umuseke': '#000000',
    'Taarifa': '#a30606ff',
    'Blogs': '#ffbf00ff'
  };

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
        className="font-bold text-xs sm:text-sm"
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-start p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 text-center">
          Total: $10 Million
        </p>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-3">
          {/* Pie Chart */}
          <div className="w-full lg:w-[45%]">
            <ResponsiveContainer width="100%" height={300} className="sm:hidden">
              <PieChart>
                <defs>
                  <linearGradient id="gradient-rj" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                  <linearGradient id="gradient-kt" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>
                  <linearGradient id="gradient-iny" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#fcd34d" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={400} className="hidden sm:block lg:hidden">
              <PieChart>
                <defs>
                  <linearGradient id="gradient-rj" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                  <linearGradient id="gradient-kt" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>
                  <linearGradient id="gradient-iny" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#fcd34d" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={500} className="hidden lg:block">
              <PieChart>
                <defs>
                  <linearGradient id="gradient-rj" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                  <linearGradient id="gradient-kt" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>
                  <linearGradient id="gradient-iny" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#fcd34d" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
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
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend/Breakdown */}
          <div className="w-full lg:w-[55%] bg-gray-50 p-4 sm:p-6 rounded-lg border-2 border-black">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">Revenue Breakdown</h2>
            <div className="space-y-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div 
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" 
                      style={{ backgroundColor: LEGEND_COLORS[item.name] }}
                    />
                    <span className="font-medium text-black text-sm sm:text-base truncate">{item.name}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-black text-sm sm:text-base">{formatCurrency(item.value)}</span>
                    <span className="text-gray-600 ml-1 sm:ml-2 text-xs sm:text-sm">({item.percentage}%)</span>
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

export default WebsitesPieChart;