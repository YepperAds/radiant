import React from 'react';
import { X as XIcon } from 'lucide-react';
import PlatformCard from './PlatformCard';

function CategoryCard({ 
  category, 
  items, 
  isCategorySelected, 
  selectedPlatforms, 
  expandedPlatform,
  searchQuery,
  toggleCategory, 
  togglePlatform, 
  handlePlatformClick,
  isPlatformSelected,
  getSocialIcon,
  getCategoryTotalCost,
  formatCurrency
}) {
  const filteredItems = searchQuery
    ? items.filter(item => item?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  if (filteredItems.length === 0) return null;

  return (
    <div className={`flex-shrink-0 w-[85vw] md:w-full md:max-w-md border rounded-sm overflow-hidden transition-all ${
      isCategorySelected ? 'border-black bg-white' : 'border-gray-200 bg-white'
    }`}>
      {/* Category Header with Toggle */}
      <div 
        className={`px-6 py-4 border-b cursor-pointer transition-colors ${
          isCategorySelected 
            ? 'bg-gray-50 border-gray-200' 
            : 'bg-white border-gray-200'
        }`}
        onClick={() => toggleCategory(category)}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-medium text-black capitalize flex-shrink-0">
            {category}
          </h2>
          
          {/* Total Cost - Center */}
          <div className="flex-1 flex justify-center">
            <div className="bg-black text-white px-4 py-1 rounded-sm">
              <span className="text-[13px] font-medium tabular-nums">
                {formatCurrency(getCategoryTotalCost(category))}
              </span>
            </div>
          </div>
          
          {/* Selection Status - Right */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] text-gray-500 tabular-nums">
              {selectedPlatforms.filter(p => p.category === category).length}/{items.length}
            </span>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
              isCategorySelected ? 'bg-black' : 'bg-gray-300'
            }`}>
              {isCategorySelected ? (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <XIcon className="w-2.5 h-2.5 text-white" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Platforms Grid */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        <div className="grid grid-cols-3 gap-3">
          {filteredItems.map(platform => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              category={category}
              isSelected={isPlatformSelected(platform.id)}
              isExpanded={expandedPlatform?.id === platform.id}
              isInfluencer={category === 'influencers'}
              togglePlatform={togglePlatform}
              handlePlatformClick={handlePlatformClick}
              getSocialIcon={getSocialIcon}
              size="small"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;