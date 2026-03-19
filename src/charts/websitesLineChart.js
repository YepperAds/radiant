import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function WebsitesLineChart() {
  const [activeMetric, setActiveMetric] = useState('all');
  
  // Combined data from bar chart (visitors) and pie chart (revenue/spending)
  const data = [
    { 
      name: 'Igihe', 
      visitors: 750, 
      revenue: 1200000,
      spending: 450000,
      roi: 166.67,
      efficiency: 1.67
    },
    { 
      name: 'Newtimes', 
      visitors: 1200, 
      revenue: 800000,
      spending: 520000,
      roi: 53.85,
      efficiency: 2.31
    },
    { 
      name: 'Rwanda Jobs', 
      visitors: 2100, 
      revenue: 1500000,
      spending: 680000,
      roi: 120.59,
      efficiency: 3.09
    },
    { 
      name: 'KT Press', 
      visitors: 1800, 
      revenue: 600000,
      spending: 550000,
      roi: 9.09,
      efficiency: 3.27
    },
    { 
      name: 'Kigali Today', 
      visitors: 3200, 
      revenue: 1800000,
      spending: 720000,
      roi: 150.00,
      efficiency: 4.44
    },
    { 
      name: 'Inyarwanda', 
      visitors: 2800, 
      revenue: 900000,
      spending: 610000,
      roi: 47.54,
      efficiency: 4.59
    },
    { 
      name: 'Rushyashya', 
      visitors: 1500, 
      revenue: 700000,
      spending: 480000,
      roi: 45.83,
      efficiency: 3.13
    },
    { 
      name: 'Umuseke', 
      visitors: 3800, 
      revenue: 1300000,
      spending: 750000,
      roi: 73.33,
      efficiency: 5.07
    },
    { 
      name: 'Taarifa', 
      visitors: 2400, 
      revenue: 500000,
      spending: 540000,
      roi: -7.41,
      efficiency: 4.44
    },
    { 
      name: 'Blogs', 
      visitors: 3500, 
      revenue: 700000,
      spending: 700000,
      roi: 0,
      efficiency: 5.00
    }
  ];

  // Calculate totals
  const totalVisitors = data.reduce((sum, d) => sum + d.visitors, 0);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalSpending = data.reduce((sum, d) => sum + d.spending, 0);
  const overallROI = ((totalRevenue - totalSpending) / totalSpending * 100).toFixed(1);

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-2 border-black p-3 sm:p-4 rounded-lg shadow-xl text-xs sm:text-sm">
          <p className="font-bold text-sm sm:text-lg mb-2">{data.name}</p>
          <div className="space-y-1">
            <p className="text-blue-600"><strong>Visitors:</strong> {data.visitors.toLocaleString()}</p>
            <p className="text-green-600"><strong>Revenue:</strong> {formatCurrency(data.revenue)}</p>
            <p className="text-red-600"><strong>Spending:</strong> {formatCurrency(data.spending)}</p>
            <p className="text-purple-600"><strong>ROI:</strong> {data.roi.toFixed(1)}%</p>
            <p className="text-orange-600"><strong>Efficiency:</strong> {data.efficiency.toFixed(2)} visitors/$K</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const metrics = [
    { id: 'all', label: 'All Metrics' },
    { id: 'visitors', label: 'Visitors', color: '#3b82f6' },
    { id: 'revenue', label: 'Revenue', color: '#10b981' },
    { id: 'spending', label: 'Spending', color: '#ef4444' },
    { id: 'roi', label: 'ROI %', color: '#8b5cf6' }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto bg-white rounded-lg sm:rounded-2xl shadow-lg p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2">Performance Analytics Study</h2>
          <p className="text-sm sm:text-base text-gray-600">Comprehensive analysis of visitor traffic, revenue generation, and marketing ROI</p>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-0 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg lg:rounded-l-2xl lg:rounded-r-none p-3 sm:p-5 border border-black">
            <p className="text-gray-600 text-xs sm:text-sm font-medium">Total Visitors</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black">{totalVisitors.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg lg:rounded-none p-3 sm:p-5 border lg:border-t lg:border-b border-black">
            <p className="text-gray-600 text-xs sm:text-sm font-medium">Total Revenue</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-lg lg:rounded-none p-3 sm:p-5 border border-black">
            <p className="text-gray-600 text-xs sm:text-sm font-medium">Total Spending</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black">{formatCurrency(totalSpending)}</p>
          </div>
          <div className="bg-white rounded-lg lg:rounded-none p-3 sm:p-5 border lg:border-t lg:border-b border-black">
            <p className="text-gray-600 text-xs sm:text-sm font-medium">Overall ROI</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black">{overallROI}%</p>
          </div>
          <div className="bg-white rounded-lg lg:rounded-r-2xl lg:rounded-l-none p-3 sm:p-5 border border-black col-span-2 lg:col-span-1">
            <p className="text-gray-600 text-xs sm:text-sm font-medium">Avg Efficiency</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black">{(totalVisitors / (totalSpending / 1000)).toFixed(2)}</p>
            <p className="text-[10px] sm:text-xs text-gray-500">visitors per $1K</p>
          </div>
        </div>

        {/* Metric Filter */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {metrics.map(metric => (
              <button
                key={metric.id}
                onClick={() => setActiveMetric(metric.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-all ${
                  activeMetric === metric.id
                    ? 'bg-black text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        {/* Line Chart */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Performance Trends</h3>
          <ResponsiveContainer width="100%" height={300} className="sm:hidden">
            <LineChart data={data} margin={{ top: 10, right: 5, left: -20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="name" 
                stroke="#000" 
                tick={{ fill: '#000', fontSize: 9, fontWeight: 500 }}
                angle={-45}
                textAnchor="end"
                height={80}
                axisLine={{ stroke: '#000', strokeWidth: 1 }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#000"
                tick={{ fill: '#000', fontSize: 10, fontWeight: 500 }}
                axisLine={{ stroke: '#000', strokeWidth: 1 }}
                width={40}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#000"
                tick={{ fill: '#000', fontSize: 10, fontWeight: 500 }}
                axisLine={{ stroke: '#000', strokeWidth: 1 }}
                tickFormatter={(value) => formatCurrency(value)}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {(activeMetric === 'all' || activeMetric === 'visitors') && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Visitors"
                />
              )}
              
              {(activeMetric === 'all' || activeMetric === 'revenue') && (
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Revenue"
                />
              )}
              
              {(activeMetric === 'all' || activeMetric === 'spending') && (
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="spending" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Spending"
                />
              )}
              
              {(activeMetric === 'all' || activeMetric === 'roi') && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="roi" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5 }}
                  name="ROI %"
                />
              )}
            </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={450} className="hidden sm:block">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="name" 
                stroke="#000" 
                tick={{ fill: '#000', fontSize: 11, fontWeight: 500 }}
                angle={-45}
                textAnchor="end"
                height={80}
                axisLine={{ stroke: '#000', strokeWidth: 2 }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#000"
                tick={{ fill: '#000', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: '#000', strokeWidth: 2 }}
                label={{ value: 'Count / Percentage', angle: -90, position: 'insideLeft', style: { fill: '#000' } }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#000"
                tick={{ fill: '#000', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: '#000', strokeWidth: 2 }}
                tickFormatter={(value) => formatCurrency(value)}
                label={{ value: 'USD', angle: 90, position: 'insideRight', style: { fill: '#000' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              
              {(activeMetric === 'all' || activeMetric === 'visitors') && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Visitors"
                />
              )}
              
              {(activeMetric === 'all' || activeMetric === 'revenue') && (
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Revenue"
                />
              )}
              
              {(activeMetric === 'all' || activeMetric === 'spending') && (
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="spending" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Spending"
                />
              )}
              
              {(activeMetric === 'all' || activeMetric === 'roi') && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="roi" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                  name="ROI %"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Top Performers */}
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <img className='w-6 sm:w-10' src='https://cdn-icons-png.flaticon.com/128/603/603653.png' alt="trophy"/> Top Performers
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {[...data].sort((a, b) => b.roi - a.roi).slice(0, 5).map((site, idx) => (
                <div key={site.name} className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-green-50 to-transparent rounded-lg">
                  <div>
                    <p className="font-bold text-sm sm:text-base text-gray-800">#{idx + 1} {site.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{site.visitors.toLocaleString()} visitors</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-bold text-sm sm:text-base">{site.roi.toFixed(1)}%</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">ROI</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Improvement */}
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <img className='w-6 sm:w-10' src='https://cdn-icons-png.flaticon.com/128/1041/1041891.png' alt="alert"/> Needs Optimization
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {[...data].sort((a, b) => a.roi - b.roi).slice(0, 5).map((site, idx) => (
                <div key={site.name} className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-red-50 to-transparent rounded-lg">
                  <div>
                    <p className="font-bold text-sm sm:text-base text-gray-800">{site.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{site.visitors.toLocaleString()} visitors</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-bold text-sm sm:text-base">{site.roi.toFixed(1)}%</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">ROI</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <img className='w-6 sm:w-8' src='https://cdn-icons-png.flaticon.com/128/2041/2041643.png' alt="insights"/>
            <span>Key Insights</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">Traffic Leader</p>
              <p className="text-gray-700 text-xs sm:text-base">Umuseke leads with 3,800 visitors and strong efficiency at 5.07 visitors per $1K spent.</p>
            </div>
            <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
              <p className="font-semibold text-green-900 mb-1 sm:mb-2 text-sm sm:text-base">Best ROI</p>
              <p className="text-gray-700 text-xs sm:text-base">Igihe delivers 166.67% ROI, generating significant returns despite moderate traffic volume.</p>
            </div>
            <div className="p-3 sm:p-4 bg-orange-50 rounded-lg">
              <p className="font-semibold text-orange-900 mb-1 sm:mb-2 text-sm sm:text-base">Efficiency Champion</p>
              <p className="text-gray-700 text-xs sm:text-base">Umuseke shows best cost-efficiency with 5.07 visitors per $1K, maximizing marketing spend.</p>
            </div>
            <div className="p-3 sm:p-4 bg-red-50 rounded-lg">
              <p className="font-semibold text-red-900 mb-1 sm:mb-2 text-sm sm:text-base">Optimization Opportunity</p>
              <p className="text-gray-700 text-xs sm:text-base">Taarifa shows -7.41% ROI despite good traffic, suggesting need for revenue strategy review.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebsitesLineChart;