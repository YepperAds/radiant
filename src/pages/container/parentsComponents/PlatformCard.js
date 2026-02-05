// PlatformCard.js
import React from 'react';
import { ChevronDown, X as XIcon } from 'lucide-react';

function PlatformCard({ 
  platform, 
  category, 
  isSelected, 
  isExpanded, 
  isInfluencer,
  togglePlatform, 
  handlePlatformClick,
  getSocialIcon,
  size = 'medium' // 'small' or 'medium'
}) {
  const Icon = platform.icon;
  
  const sizeClasses = {
    small: {
      container: 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20',
      icon: 'w-6 h-6 sm:w-8 sm:h-8',
      text: 'text-[10px] sm:text-xs min-h-[28px] sm:min-h-[32px]',
      checkbox: 'w-4 h-4 sm:w-5 sm:h-5 top-1.5 right-1.5 sm:top-2 sm:right-2',
      checkboxIcon: 'w-2.5 h-2.5 sm:w-3 sm:h-3',
      socialIcon: 'w-2.5 h-2.5 sm:w-3.5 sm:h-3.5'
    },
    medium: {
      container: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
      icon: 'w-8 h-8 sm:w-10 sm:h-10',
      text: 'text-xs sm:text-sm min-h-[32px] sm:min-h-[40px]',
      checkbox: 'w-5 h-5 sm:w-6 sm:h-6 top-2 right-2 sm:top-3 sm:right-3',
      checkboxIcon: 'w-3 h-3 sm:w-3.5 sm:h-3.5',
      socialIcon: 'w-2.5 h-2.5 sm:w-3.5 sm:h-3.5'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePlatformClick(platform, category);
        }}
        className={`w-full flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-5 border rounded-lg sm:rounded-xl transition-all duration-200 relative hover:shadow-md group ${
          isSelected
            ? 'border-black bg-white shadow-sm'
            : 'border-gray-300 bg-gray-100'
        } ${isExpanded ? 'ring-2 ring-black' : ''}`}
      >
        {/* Platform Icon */}
        <div className={`relative ${currentSize.container} flex items-center justify-center bg-white rounded-lg overflow-hidden flex-shrink-0`}>
          {platform.iconUrl ? (
            <img 
              src={platform.iconUrl} 
              alt={platform.name} 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="hidden w-full h-full items-center justify-center bg-gray-100">
            <Icon className={`text-gray-400 ${currentSize.icon}`} />
          </div>
        </div>

        {/* Platform Name */}
        <span className={`${currentSize.text} font-semibold text-gray-900 text-center leading-tight flex items-center px-1 ${size === 'medium' ? 'sm:px-2' : ''}`}>
          {platform.name}
        </span>

        {/* Social Platform Icons for Influencers */}
        {isInfluencer && platform.platforms && (
          <div className="mt-0.5 sm:mt-1 flex items-center gap-1 sm:gap-1.5">
            <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium">on</span>
            <div className="flex -space-x-1 sm:-space-x-1.5">
              {platform.platforms.map((socialPlatform, idx) => {
                const socialIconSrc = getSocialIcon(socialPlatform);
                return (
                  <div
                    key={socialPlatform}
                    className="bg-white border-2 border-white rounded-full p-0.5 sm:p-1 shadow-sm"
                    style={{ zIndex: platform.platforms.length - idx }}
                  >
                    <img
                      src={socialIconSrc}
                      alt={socialPlatform}
                      className={`object-contain ${currentSize.socialIcon}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Selection Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlatform(platform.id, platform.name, category);
          }}
          className={`absolute ${currentSize.checkbox} z-10`}
        >
          <div className={`w-full h-full rounded-full flex items-center justify-center transition-colors ${
            isSelected ? 'bg-black' : 'bg-gray-300'
          }`}>
            {isSelected ? (
              <svg className={`${currentSize.checkboxIcon} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <XIcon className={`${currentSize.checkboxIcon} text-white`} />
            )}
          </div>
        </button>

        {/* Expand Indicator */}
        <ChevronDown 
          className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
}

export default PlatformCard;