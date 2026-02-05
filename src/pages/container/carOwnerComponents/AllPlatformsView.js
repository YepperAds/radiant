import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryCard from './CategoryCard';

function AllPlatformsView({ 
  allPlatforms,
  searchQuery,
  selectedPlatforms,
  selectedCategories,
  expandedPlatform,
  showLeftButton,
  showRightButton,
  categoriesScrollRef,
  scrollCategories,
  toggleCategory,
  togglePlatform,
  handlePlatformClick,
  isPlatformSelected,
  getSocialIcon,
  getCategoryTotalCost,
  formatCurrency
}) {
  return (
    <div className="relative mb-24">
      {/* Left scroll button */}
      {showLeftButton && (
        <button
          onClick={() => scrollCategories('left')}
          className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-2 sm:p-3 shadow-lg hover:bg-gray-50 transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6 text-gray-700" />
        </button>
      )}

      {/* Categories Container */}
      <div 
        ref={categoriesScrollRef}
        className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-8 sm:px-12 md:px-16"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {Object.entries(allPlatforms).map(([category, items]) => (
          <CategoryCard
            key={category}
            category={category}
            items={items}
            isCategorySelected={selectedCategories[category]}
            selectedPlatforms={selectedPlatforms}
            expandedPlatform={expandedPlatform}
            searchQuery={searchQuery}
            toggleCategory={toggleCategory}
            togglePlatform={togglePlatform}
            handlePlatformClick={handlePlatformClick}
            isPlatformSelected={isPlatformSelected}
            getSocialIcon={getSocialIcon}
            getCategoryTotalCost={getCategoryTotalCost}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>

      {/* Right scroll button */}
      {showRightButton && (
        <button
          onClick={() => scrollCategories('right')}
          className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-2 sm:p-3 shadow-lg hover:bg-gray-50 transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} className="sm:w-6 sm:h-6 text-gray-700" />
        </button>
      )}
    </div>
  );
}

export default AllPlatformsView;