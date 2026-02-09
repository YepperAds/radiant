import React from 'react';

function TabFilter({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-5 py-2.5 text-[13px] font-medium rounded-sm transition-all ${
            activeTab === tab.id
              ? 'bg-black text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-black'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabFilter;