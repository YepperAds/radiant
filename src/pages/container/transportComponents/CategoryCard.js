// CategoryCard.js
import React from 'react';
import { X as XIcon, ChevronDown } from 'lucide-react';
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
    <div className={`flex-shrink-0 w-[85vw] sm:w-[75vw] md:w-full md:max-w-md border-2 rounded-2xl shadow-md overflow-hidden transition-all ${
      isCategorySelected ? 'border-black bg-white' : 'border-gray-200 bg-gray-50'
    }`}>
      {/* Category Header with Toggle */}
      <div 
        className={`px-4 sm:px-6 py-3 sm:py-4 border-b cursor-pointer transition-colors ${
          isCategorySelected 
            ? 'bg-gradient-to-r from-gray-50 to-white border-gray-200' 
            : 'bg-gray-100 border-gray-300'
        }`}
        onClick={() => toggleCategory(category)}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-bold text-black capitalize flex-shrink-0">
            {category}
          </h2>
          
          {/* Total Cost - Center */}
          <div className="flex-1 flex justify-center">
            <div className="bg-black text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">
              <span className="text-xs sm:text-sm font-bold">
                {formatCurrency(getCategoryTotalCost(category))}
              </span>
            </div>
          </div>
          
          {/* Selection Status - Right */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-gray-600">
              {selectedPlatforms.filter(p => p.category === category).length}/{items.length}
            </span>
            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-colors ${
              isCategorySelected ? 'bg-black' : 'bg-gray-300'
            }`}>
              {isCategorySelected ? (
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <XIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Platforms Grid */}
      <div className="p-3 sm:p-4 max-h-[500px] overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
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