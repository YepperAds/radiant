import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

function WebsitesBarChart() {
  const svgRef = useRef();
  const containerRef = useRef();
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const visitorData = [
    { name: 'Igihe', visitors: 750 },
    { name: 'Newtimes', visitors: 1200 },
    { name: 'Rwanda Jobs', visitors: 2100 },
    { name: 'KT Press', visitors: 1800 },
    { name: 'Kigali Today', visitors: 3200 },
    { name: 'Inyarwanda', visitors: 2800 },
    { name: 'Rushyashya', visitors: 1500 },
    { name: 'Umuseke', visitors: 3800 },
    { name: 'Taarifa', visitors: 2400 },
    { name: 'Blogs', visitors: 3500 }
  ];

  const barColors = {
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

  const countryData = {
    '840': { name: 'United States', views: 1245, clicks: 423 },
    '826': { name: 'United Kingdom', views: 876, clicks: 298 },
    '404': { name: 'Kenya', views: 654, clicks: 201 },
    '646': { name: 'Rwanda', views: 2134, clicks: 892 },
    '800': { name: 'Uganda', views: 543, clicks: 178 },
    '834': { name: 'Tanzania', views: 432, clicks: 145 },
    '710': { name: 'South Africa', views: 789, clicks: 267 },
    '566': { name: 'Nigeria', views: 923, clicks: 312 },
    '124': { name: 'Canada', views: 567, clicks: 189 },
    '276': { name: 'Germany', views: 712, clicks: 245 },
    '250': { name: 'France', views: 645, clicks: 218 },
    '356': { name: 'India', views: 1123, clicks: 389 },
    '156': { name: 'China', views: 234, clicks: 0 },
    '392': { name: 'Japan', views: 456, clicks: 0 },
    '036': { name: 'Australia', views: 534, clicks: 182 },
    '076': { name: 'Brazil', views: 678, clicks: 0 }
  };

  const totalViews = Object.values(countryData).reduce((sum, c) => sum + c.views, 0);
  const totalClicks = Object.values(countryData).reduce((sum, c) => sum + c.clicks, 0);
  const clickRate = ((totalClicks / totalViews) * 100).toFixed(1);

  useEffect(() => {
    const width = containerRef.current?.offsetWidth || 1000;
    const height = containerRef.current?.offsetHeight || 400;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const projection = d3.geoNaturalEarth1()
      .scale(Math.min(width, height) * 0.16)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(world => {
        const countries = topojson.feature(world, world.objects.countries);

        g.selectAll('path')
          .data(countries.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('fill', d => {
            const data = countryData[d.id];
            if (!data || data.views === 0) return '#e5e7eb';
            if (data.clicks > 0) return '#f97316';
            return '#9ca3af';
          })
          .attr('stroke', '#4b5563')
          .attr('stroke-width', 1)
          .style('cursor', 'pointer')
          .on('mouseenter', function(event, d) {
            const data = countryData[d.id];
            const countryName = world.objects.countries.geometries.find(g => g.id === d.id)?.properties?.name || 'Unknown';
            
            d3.select(this)
              .attr('stroke-width', 2)
              .attr('fill', () => {
                if (!data || data.views === 0) return '#d1d5db';
                if (data.clicks > 0) return '#ea580c';
                return '#6b7280';
              });
            
            const containerRect = containerRef.current.getBoundingClientRect();
            setTooltipPos({
              x: event.clientX - containerRect.left,
              y: event.clientY - containerRect.top
            });
            setTooltipData(data || { name: countryName, views: 0, clicks: 0 });
          })
          .on('mousemove', function(event) {
            const containerRect = containerRef.current.getBoundingClientRect();
            setTooltipPos({
              x: event.clientX - containerRect.left,
              y: event.clientY - containerRect.top
            });
          })
          .on('mouseleave', function(event, d) {
            const data = countryData[d.id];
            d3.select(this)
              .attr('stroke-width', 1)
              .attr('fill', () => {
                if (!data || data.views === 0) return '#e5e7eb';
                if (data.clicks > 0) return '#f97316';
                return '#9ca3af';
              });
            setTooltipData(null);
          });
      });

    return () => {
      svg.selectAll('*').remove();
    };
  }, []);

  const formatYAxis = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-black text-white rounded-lg px-3 py-2">
          <p className="font-bold mb-1">{payload[0].payload.name}</p>
          <p>{`${value.toLocaleString()} visitors (${formatYAxis(value)})`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 md:p-8">
      <div className='bg-white rounded-lg sm:rounded-2xl shadow-lg'>
        {/* Bar Chart Section */}
        <div className="w-full max-w-6xl mx-auto mb-6 sm:mb-12 p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-4 sm:mb-6">Website Visitors Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={visitorData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="gradient-rj" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <linearGradient id="gradient-kt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>
                <linearGradient id="gradient-iny" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="50%" stopColor="#fcd34d" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
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
                tickFormatter={formatYAxis}
                ticks={[500, 1000, 1500, 2000, 2500, 3000, 3500, 4000]}
                stroke="#000"
                tick={{ fill: '#000', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: '#000', strokeWidth: 2 }}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="visitors" 
                radius={[8, 8, 0, 0]}
              >
                {visitorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* World Map Section */}
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">Global Engagement Map</h2>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="rounded-lg p-3 sm:p-4 border border-black bg-gray-100">
              <p className="text-gray-600 text-xs sm:text-sm">Total Views</p>
              <p className="text-xl sm:text-2xl font-bold text-black">{totalViews.toLocaleString()}</p>
            </div>
            <div className="rounded-lg p-3 sm:p-4 border border-orange-600 bg-orange-100">
              <p className="text-gray-600 text-xs sm:text-sm">Total Clicks</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600">{totalClicks.toLocaleString()}</p>
            </div>
            <div className="rounded-lg p-3 sm:p-4 border border-blue-600 bg-blue-100">
              <p className="text-gray-600 text-xs sm:text-sm">Click Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{clickRate}%</p>
            </div>
          </div>

          {/* Map Container */}
          <div ref={containerRef} className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl overflow-hidden" style={{ height: '400px', minHeight: '300px' }}>
            <svg ref={svgRef} className="w-full h-full"></svg>
            
            {/* Tooltip */}
            {tooltipData && (
              <div
                className="absolute bg-white border-2 border-gray-300 rounded-lg shadow-2xl px-3 py-2 pointer-events-none text-xs sm:text-sm"
                style={{
                  left: `${Math.min(tooltipPos.x + 15, (containerRef.current?.offsetWidth || 400) - 180)}px`,
                  top: `${Math.max(tooltipPos.y - 10, 10)}px`,
                  zIndex: 1000,
                  maxWidth: '180px'
                }}
              >
                <div className="font-bold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2">{tooltipData.name}</div>
                <div className="flex justify-between gap-3 sm:gap-6 mb-1">
                  <span className="text-gray-700">Views:</span>
                  <strong className="text-blue-600">{tooltipData.views.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between gap-3 sm:gap-6 mb-1">
                  <span className="text-gray-700">Clicks:</span>
                  <strong className="text-orange-600">{tooltipData.clicks.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between gap-3 sm:gap-6 border-t border-gray-300 pt-1 sm:pt-2 mt-1 sm:mt-2">
                  <span className="text-gray-700">Click Rate:</span>
                  <strong className="text-green-600">{tooltipData.views > 0 ? ((tooltipData.clicks / tooltipData.views) * 100).toFixed(1) : '0'}%</strong>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white rounded-lg shadow-lg p-2 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gray-400"></div>
                  <span className="text-xs sm:text-sm text-gray-700">Views Only</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-orange-500"></div>
                  <span className="text-xs sm:text-sm text-gray-700">Views + Clicks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebsitesBarChart;