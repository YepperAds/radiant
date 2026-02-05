import React from 'react';
import PlatformCard from './PlatformCard';

function SingleCategoryView({ 
  filteredPlatforms,
  expandedPlatform,
  togglePlatform,
  handlePlatformClick,
  isPlatformSelected,
  getSocialIcon
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 sm:p-6 mb-24">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {filteredPlatforms.map(platform => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            category={platform.category}
            isSelected={isPlatformSelected(platform.id)}
            isExpanded={expandedPlatform?.id === platform.id}
            isInfluencer={platform.category === 'influencers'}
            togglePlatform={togglePlatform}
            handlePlatformClick={handlePlatformClick}
            getSocialIcon={getSocialIcon}
            size="medium"
          />
        ))}
      </div>
    </div>
  );
}

export default SingleCategoryView;