import React, { useState } from 'react';
import WebsitesBarChart from '../charts/websitesBarChart'
import WebsitesPieChart from '../charts/websitesPieChart'
import WebsitesLineChart from '../charts/websitesLineChart'

import InfluencersBarChart from '../charts/influencersBarChart'
import InfluencersPieChart from '../charts/influencersPieChart'
import InfluencersLineChart from '../charts/influencersLineChart'

import TVBarChart from '../charts/tvBarChart'
import TVPieChart from '../charts/tvPieChart'
import TVLineChart from '../charts/tvLineChart'

import BillboardsBarChart from '../charts/billboardsBarChart'
import BillboardsPieChart from '../charts/billboardsPieChart'
import BillboardsLineChart from '../charts/billboardsLineChart'

function CampaignReview() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dataSource, setDataSource] = useState('websites');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'budget', label: 'Budget' },
    { id: 'growth', label: 'Growth' }
  ];

  const dataSourceTabs = [
    { id: 'websites', label: 'Websites' },
    { id: 'influencers', label: 'Influencers'},
    { id: 'tv', label: 'TV' },
    { id: 'billboards', label: 'Billboards' },
  ];

  return (
    <div className="w-full min-h-screen">
      {/* Top Tabs */}
      <div className="flex gap-4 sm:gap-8 px-4 sm:px-8 pt-4 sm:pt-6 justify-center items-center overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 sm:pb-3 text-base sm:text-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-black border-b-2 border-black'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content with Side Tabs */}
      <div className="flex flex-col lg:flex-row pb-20 lg:pb-0">
        {/* Main Content Area */}
        <div className="flex-1 px-4 sm:px-8">
          {activeTab === 'overview' && dataSource === 'websites' && <WebsitesBarChart />}
          {activeTab === 'overview' && dataSource === 'influencers' && <InfluencersBarChart />}
          {activeTab === 'overview' && dataSource === 'tv' && <TVBarChart />}
          {activeTab === 'overview' && dataSource === 'billboards' && <BillboardsBarChart />}
          {activeTab === 'budget' && dataSource === 'websites' && <WebsitesPieChart />}
          {activeTab === 'budget' && dataSource === 'influencers' && <InfluencersPieChart />}
          {activeTab === 'budget' && dataSource === 'tv' && <TVPieChart />}
          {activeTab === 'budget' && dataSource === 'billboards' && <BillboardsPieChart />}
          {activeTab === 'growth' && dataSource === 'websites' && <WebsitesLineChart />}
          {activeTab === 'growth' && dataSource === 'influencers' && <InfluencersLineChart />}
          {activeTab === 'growth' && dataSource === 'tv' && <TVLineChart />}
          {activeTab === 'growth' && dataSource === 'billboards' && <BillboardsLineChart />}
        </div>

        {/* Desktop Layout - Vertical buttons on right */}
        <div className="hidden lg:flex flex-col gap-4 pr-8 pt-8">
          {dataSourceTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDataSource(tab.id)}
              className={`px-8 py-3 text-sm font-medium transition-colors rounded-full flex items-center gap-2 ${
                dataSource === tab.id
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Layout - Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {dataSourceTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDataSource(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                dataSource === tab.id
                  ? 'bg-black text-white'
                  : 'text-gray-600'
              }`}
            >
              <span className="text-[10px] font-medium mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CampaignReview;