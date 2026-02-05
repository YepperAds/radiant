import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function InfluencersLineChart() {
    const data = [
        { name: 'Aime Rwanda 250', performance: 45 },
        { name: 'Clapton Kibonke', performance: 65 },
        { name: 'Nishimwe Naomi', performance: 55 },
        { name: 'Solange Nishimwe', performance: 75 },
        { name: 'Ngabo Karegeya', performance: 85 },
        { name: 'Zuba Mutesi', performance: 70 },
        { name: 'The Long Form', performance: 60 }
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black text-white p-3 rounded-lg shadow-lg">
                    <p className="font-bold text-sm">{payload[0].payload.name}</p>
                    <p className="text-xs">Performance: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full min-h-screen bg-white flex items-center justify-start p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-4xl">
                <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6 text-center sm:text-left">
                    Influencer Performance
                </h2>
                
                <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                        <ResponsiveContainer width="100%" height={300} className="sm:hidden">
                            <LineChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#000" 
                                    tick={{ fill: '#000', fontSize: 10, fontWeight: 500 }}
                                    axisLine={{ stroke: '#000', strokeWidth: 2 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis 
                                    ticks={[0, 20, 40, 60, 80, 100]}
                                    domain={[0, 100]}
                                    stroke="#000"
                                    tick={{ fill: '#000', fontSize: 10, fontWeight: 500 }}
                                    axisLine={{ stroke: '#000', strokeWidth: 2 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend 
                                    wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                                    iconType="line"
                                    formatter={() => 'Performance Score'}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="performance" 
                                    stroke="#000" 
                                    strokeWidth={2}
                                    dot={{ fill: '#000', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, fill: '#000', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>

                        <ResponsiveContainer width="100%" height={350} className="hidden sm:block">
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
                    </div>
                </div>
                
                <div className="mt-4 sm:mt-8 text-center">
                    <p className="text-gray-600 text-xs sm:text-sm px-2">
                        Performance scores range from 0 to 100, tracking metrics across all websites
                    </p>
                </div>
            </div>
        </div>
    );
}

export default InfluencersLineChart;