import React from 'react';

function TabFilter({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-black text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabFilter;