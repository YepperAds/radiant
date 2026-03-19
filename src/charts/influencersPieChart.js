import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

function InfluencersPieChart() {
    const data = [
        { name: 'Aime Rwanda 250', value: 1200000, percentage: 12 },
        { name: 'Clapton Kibonke', value: 800000, percentage: 8 },
        { name: 'Nishimwe Naomi', value: 1500000, percentage: 15 },
        { name: 'Solange Nishimwe', value: 600000, percentage: 6 },
        { name: 'Ngabo Karegeya', value: 1800000, percentage: 18 },
        { name: 'Zuba Mutesi', value: 900000, percentage: 9 },
        { name: 'The Long Form', value: 700000, percentage: 7 }
    ];

    const platformSpending = [
        { influencer: 'Aime Rwanda 250', instagram: 1200000, youtube: 0, twitter: 0 },
        { influencer: 'Clapton Kibonke', instagram: 300000, youtube: 350000, twitter: 150000 },
        { influencer: 'Nishimwe Naomi', instagram: 800000, youtube: 700000, twitter: 0 },
        { influencer: 'Solange Nishimwe', instagram: 200000, youtube: 250000, twitter: 150000 },
        { influencer: 'Ngabo Karegeya', instagram: 0, youtube: 0, twitter: 1800000 },
        { influencer: 'Zuba Mutesi', instagram: 300000, youtube: 350000, twitter: 250000 },
        { influencer: 'The Long Form', instagram: 0, youtube: 450000, twitter: 250000 }
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
        <div className="w-full min-h-screen bg-white flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-6xl">
                <p className="text-lg sm:text-xl text-gray-600 mb-4 sm:mb-8 text-center">
                    Total: $10 Million
                </p>
                
                <div className="flex flex-col lg:flex-row items-start justify-center gap-4 sm:gap-6">
                    <div className="w-full lg:w-auto flex justify-center">
                        <div className="sm:hidden w-full">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
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
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="hidden sm:block w-full lg:w-[400px]">
                            <ResponsiveContainer width="100%" height={500}>
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
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border-2 border-black w-full lg:w-auto">
                        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">Revenue Breakdown</h2>
                        <div className="space-y-2">
                            {data.map((item, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-1 sm:gap-4">
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-4 h-4 rounded" 
                                            style={{ backgroundColor: COLORS[index] }}
                                        />
                                        <span className="font-medium text-black text-sm sm:text-base">{item.name}</span>
                                    </div>
                                    <div className="text-left sm:text-right ml-6 sm:ml-0">
                                        <span className="font-bold text-black text-sm sm:text-base">{formatCurrency(item.value)}</span>
                                        <span className="text-gray-600 ml-2 text-sm">({item.percentage}%)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border-2 border-black w-full lg:w-auto max-h-[400px] sm:max-h-[500px] overflow-y-auto">
                        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">Platform Spending</h2>
                        <div className="space-y-4">
                            {platformSpending.map((item, index) => (
                                <div key={index} className="pb-3 border-b border-gray-300 last:border-b-0">
                                    <p className="font-bold text-black mb-2">{item.influencer}</p>
                                    <div className="space-y-1 ml-2">
                                        {item.instagram > 0 && (
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#E1306C' }} />
                                                    <span className="text-sm text-gray-700">Instagram</span>
                                                </div>
                                                <span className="text-sm font-semibold text-black">{formatCurrency(item.instagram)}</span>
                                            </div>
                                        )}
                                        {item.youtube > 0 && (
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FF0000' }} />
                                                    <span className="text-sm text-gray-700">YouTube</span>
                                                </div>
                                                <span className="text-sm font-semibold text-black">{formatCurrency(item.youtube)}</span>
                                            </div>
                                        )}
                                        {item.twitter > 0 && (
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#000000' }} />
                                                    <span className="text-sm text-gray-700">Twitter</span>
                                                </div>
                                                <span className="text-sm font-semibold text-black">{formatCurrency(item.twitter)}</span>
                                            </div>
                                        )}
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

export default InfluencersPieChart;