import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Instagram, Youtube, Twitter } from 'lucide-react';

function InfluencersBarChart() {
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const data = [
    { 
      name: 'Aime Rwanda 250', 
      instagram: 750,
      youtube: 0,
      twitter: 0
    },
    { 
      name: 'Clapton Kibonke', 
      instagram: 400,
      youtube: 450,
      twitter: 350
    },
    { 
      name: 'Nishimwe Naomi', 
      instagram: 1100,
      youtube: 1000,
      twitter: 0
    },
    { 
      name: 'Solange Nishimwe', 
      instagram: 600,
      youtube: 650,
      twitter: 550
    },
    { 
      name: 'Ngabo Karegeya', 
      instagram: 0,
      youtube: 0,
      twitter: 3200
    },
    { 
      name: 'Zuba Mutesi', 
      instagram: 950,
      youtube: 1000,
      twitter: 850
    },
    { 
      name: 'The Long Form', 
      instagram: 0,
      youtube: 800,
      twitter: 700
    }
  ];

  const getBarColor = (item) => {
    const hasInstagram = item.instagram > 0;
    const hasYoutube = item.youtube > 0;
    const hasTwitter = item.twitter > 0;
    
    if (hasInstagram && hasYoutube && hasTwitter) return 'url(#allThreeGradient)';
    if (hasInstagram && hasYoutube) return 'url(#instagramYoutubeGradient)';
    if (hasInstagram && hasTwitter) return 'url(#instagramTwitterGradient)';
    if (hasYoutube && hasTwitter) return 'url(#youtubeTwitterGradient)';
    if (hasInstagram) return '#EC4899';
    if (hasYoutube) return '#FF0000';
    if (hasTwitter) return '#000000';
    return '#94A3B8';
  };

  const filteredData = selectedPlatform === 'all' 
    ? data.map(item => ({
        name: item.name,
        total: item.instagram + item.youtube + item.twitter,
        fill: getBarColor(item)
      }))
    : data.map(item => ({
        ...item,
        instagram: selectedPlatform === 'instagram' ? item.instagram : 0,
        youtube: selectedPlatform === 'youtube' ? item.youtube : 0,
        twitter: selectedPlatform === 'twitter' ? item.twitter : 0
      }));

  const formatYAxis = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value;
  };

  const CustomXAxisTick = ({ x, y, payload }) => {
    const influencer = data.find(d => d.name === payload.value);
    if (!influencer) return null;

    if (selectedPlatform !== 'all') {
      return (
        <g transform={`translate(${x},${y})`}>
          <text 
            x={0} 
            y={0} 
            dy={16} 
            textAnchor="middle" 
            fill="#666"
            fontSize={10}
            fontWeight={500}
          >
            {payload.value}
          </text>
        </g>
      );
    }

    const hasInstagram = influencer.instagram > 0;
    const hasYoutube = influencer.youtube > 0;
    const hasTwitter = influencer.twitter > 0;
    
    const iconSize = 12;
    const iconSpacing = 16;
    const activeIcons = [hasInstagram, hasYoutube, hasTwitter].filter(Boolean).length;
    const totalWidth = activeIcons * iconSpacing - 4;
    const startX = x - totalWidth / 2;
    
    let currentX = startX;

    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={16} 
          textAnchor="middle" 
          fill="#666"
          fontSize={10}
          fontWeight={500}
        >
          {payload.value}
        </text>
        
        <g transform={`translate(0, 28)`}>
          {hasInstagram && (
            <g transform={`translate(${currentX - x}, 0)`}>
              <rect x={-iconSize/2} y={-iconSize/2} width={iconSize} height={iconSize} fill="url(#instagramGradient)" rx={2} />
              <Instagram size={iconSize - 4} x={-iconSize/2 + 2} y={-iconSize/2 + 2} color="white" strokeWidth={2} />
              {(() => { currentX += iconSpacing; return null; })()}
            </g>
          )}
          {hasYoutube && (
            <g transform={`translate(${currentX - x}, 0)`}>
              <rect x={-iconSize/2} y={-iconSize/2} width={iconSize} height={iconSize} fill="#FF0000" rx={2} />
              <Youtube size={iconSize - 4} x={-iconSize/2 + 2} y={-iconSize/2 + 2} color="white" strokeWidth={2} />
              {(() => { currentX += iconSpacing; return null; })()}
            </g>
          )}
          {hasTwitter && (
            <g transform={`translate(${currentX - x}, 0)`}>
              <rect x={-iconSize/2} y={-iconSize/2} width={iconSize} height={iconSize} fill="#000000" rx={2} />
              <Twitter size={iconSize - 4} x={-iconSize/2 + 2} y={-iconSize/2 + 2} color="white" strokeWidth={2} />
            </g>
          )}
        </g>

        <g transform={`translate(0, 44)`}>
          <rect 
            x={-totalWidth/2 - 2} 
            y={-3} 
            width={totalWidth + 4} 
            height={5} 
            fill={getBarColor(influencer)} 
            rx={2}
          />
        </g>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      if (selectedPlatform === 'all') {
        const influencer = data.find(d => d.name === label);
        return (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-3 shadow-xl text-xs sm:text-sm">
            <p className="font-bold mb-2 text-sm">{label}</p>
            {influencer.instagram > 0 && (
              <p className="my-1 text-pink-600">
                <span className="font-semibold">Instagram:</span> {influencer.instagram.toLocaleString()}
              </p>
            )}
            {influencer.youtube > 0 && (
              <p className="my-1 text-red-600">
                <span className="font-semibold">YouTube:</span> {influencer.youtube.toLocaleString()}
              </p>
            )}
            {influencer.twitter > 0 && (
              <p className="my-1 text-black">
                <span className="font-semibold">X (Twitter):</span> {influencer.twitter.toLocaleString()}
              </p>
            )}
            <p className="mt-2 pt-2 border-t border-gray-200 font-bold">
              Total: {payload[0].value.toLocaleString()}
            </p>
          </div>
        );
      } else {
        const totalVisitors = payload.reduce((sum, entry) => sum + entry.value, 0);
        return (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-3 shadow-xl text-xs sm:text-sm">
            <p className="font-bold mb-2 text-sm">{label}</p>
            {payload.map((entry, index) => (
              entry.value > 0 && (
                <p key={index} className="my-1" style={{ color: entry.fill }}>
                  <span className="font-semibold">{entry.name}:</span> {entry.value.toLocaleString()}
                </p>
              )
            ))}
            <p className="mt-2 pt-2 border-t border-gray-200 font-bold">
              Total: {totalVisitors.toLocaleString()}
            </p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-3 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl bg-white rounded-lg sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Influencer Ad Performance</h1>
          <p className="text-sm sm:text-base text-gray-600">Track visitor engagement across Instagram, YouTube, and Twitter</p>
        </div>

        <div className="mb-4 sm:mb-6 flex gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setSelectedPlatform('all')}
            className={`px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-semibold transition-all ${
              selectedPlatform === 'all' 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Platforms
          </button>
          <button
            onClick={() => setSelectedPlatform('instagram')}
            className={`px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-semibold transition-all ${
              selectedPlatform === 'instagram' 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Instagram
          </button>
          <button
            onClick={() => setSelectedPlatform('youtube')}
            className={`px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-semibold transition-all ${
              selectedPlatform === 'youtube' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            YouTube
          </button>
          <button
            onClick={() => setSelectedPlatform('twitter')}
            className={`px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-semibold transition-all ${
              selectedPlatform === 'twitter' 
                ? 'bg-black text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            X (Twitter)
          </button>
        </div>

        <div className="sm:hidden overflow-x-auto">
          <div style={{ minWidth: `${data.length * 100}px` }}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={filteredData} margin={{ top: 10, right: 20, left: 10, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="name" 
                  height={selectedPlatform === 'all' ? 100 : 50}
                  stroke="#666" 
                  tick={<CustomXAxisTick />}
                  interval={0}
                />
                <YAxis 
                  tickFormatter={formatYAxis}
                  stroke="#666"
                  tick={{ fill: '#666', fontSize: 11, fontWeight: 500 }}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                {selectedPlatform === 'all' ? (
                  <Bar 
                    dataKey="total" 
                    name="Total Visitors"
                    radius={[4, 4, 0, 0]}
                  />
                ) : (
                  <>
                    <Bar 
                      dataKey="instagram" 
                      name="Instagram"
                      fill="#EC4899" 
                      radius={[4, 4, 0, 0]}
                      stackId="a"
                    />
                    <Bar 
                      dataKey="youtube" 
                      name="YouTube"
                      fill="#FF0000" 
                      radius={[4, 4, 0, 0]}
                      stackId="a"
                    />
                    <Bar 
                      dataKey="twitter" 
                      name="X (Twitter)"
                      fill="#000000" 
                      radius={[4, 4, 0, 0]}
                      stackId="a"
                    />
                  </>
                )}
                <defs>
                  <linearGradient id="instagramGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#833AB4" />
                    <stop offset="50%" stopColor="#E1306C" />
                    <stop offset="100%" stopColor="#FD1D1D" />
                  </linearGradient>
                  <linearGradient id="instagramYoutubeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E1306C" />
                    <stop offset="100%" stopColor="#FF0000" />
                  </linearGradient>
                  <linearGradient id="instagramTwitterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E1306C" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>
                  <linearGradient id="youtubeTwitterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF0000" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>
                  <linearGradient id="allThreeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E1306C" />
                    <stop offset="50%" stopColor="#FF0000" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={500} className="hidden sm:block">
          <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              height={selectedPlatform === 'all' ? 120 : 60}
              stroke="#666" 
              tick={<CustomXAxisTick />}
              interval={0}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              stroke="#666"
              tick={{ fill: '#666', fontSize: 13, fontWeight: 500 }}
              label={{ value: 'Visitors', angle: -90, position: 'insideLeft', style: { fill: '#666', fontWeight: 600 } }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
            {selectedPlatform === 'all' ? (
              <Bar 
                dataKey="total" 
                name="Total Visitors"
                radius={[6, 6, 0, 0]}
              />
            ) : (
              <>
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="rect"
                />
                <Bar 
                  dataKey="instagram" 
                  name="Instagram"
                  fill="#EC4899" 
                  radius={[6, 6, 0, 0]}
                  stackId="a"
                />
                <Bar 
                  dataKey="youtube" 
                  name="YouTube"
                  fill="#FF0000" 
                  radius={[6, 6, 0, 0]}
                  stackId="a"
                />
                <Bar 
                  dataKey="twitter" 
                  name="X (Twitter)"
                  fill="#000000" 
                  radius={[6, 6, 0, 0]}
                  stackId="a"
                />
              </>
            )}
            <defs>
              <linearGradient id="instagramGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#833AB4" />
                <stop offset="50%" stopColor="#E1306C" />
                <stop offset="100%" stopColor="#FD1D1D" />
              </linearGradient>
              <linearGradient id="instagramYoutubeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E1306C" />
                <stop offset="100%" stopColor="#FF0000" />
              </linearGradient>
              <linearGradient id="instagramTwitterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E1306C" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
              <linearGradient id="youtubeTwitterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF0000" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
              <linearGradient id="allThreeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E1306C" />
                <stop offset="50%" stopColor="#FF0000" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default InfluencersBarChart;