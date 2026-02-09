// ExpandedPlatformDetails.js
import React from 'react';
import { X as XIcon } from 'lucide-react';
import RateCardSlider from './Ratecardslider';

function ExpandedPlatformDetails({ 
  expandedPlatform, 
  expandedRef,
  isPlatformSelected, 
  togglePlatform,
  setExpandedPlatform,
  getSocialIcon,
  selectedRateCards = {},
  onRateCardToggle,
  calculateRateCardTotal,
  formatCurrency,
  currentSlides,
  setCurrentSlides
}) {
  if (!expandedPlatform) return null;

  const Icon = expandedPlatform.icon;
  const hasRateCards = expandedPlatform.rateCards && expandedPlatform.rateCards.length > 0;
  const platformRateCards = selectedRateCards[expandedPlatform.id] || [];

  const handleRateCardToggle = (platformId, rateCardIndex) => {
    if (onRateCardToggle) {
      onRateCardToggle(platformId, rateCardIndex);
    }
  };

  return (
    <div ref={expandedRef} className="mb-24 bg-white border border-gray-200 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center bg-white rounded-sm border border-gray-200">
            {expandedPlatform.iconUrl ? (
              <img 
                src={expandedPlatform.iconUrl} 
                alt={expandedPlatform.name} 
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="hidden w-full h-full items-center justify-center">
              <Icon size={32} className="text-gray-400" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-black">{expandedPlatform.name}</h3>
            <span className="text-[13px] text-gray-500 capitalize">{expandedPlatform.category}</span>
          </div>
        </div>
        <button
          onClick={() => setExpandedPlatform(null)}
          className="p-2 hover:bg-gray-100 rounded-sm transition-colors"
        >
          <XIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {hasRateCards ? (
          /* Rate Cards View - FOR ALL MEDIA TYPES */
          <RateCardSlider 
            rateCards={expandedPlatform.rateCards}
            platformName={expandedPlatform.name}
            platformId={expandedPlatform.id}
            selectedRateCards={platformRateCards}
            onRateCardToggle={handleRateCardToggle}
            calculateRateCardTotal={calculateRateCardTotal}
            formatCurrency={formatCurrency}
            currentSlides={currentSlides}
            setCurrentSlides={setCurrentSlides}
          />
        ) : (
          /* Fallback View if no rate cards exist */
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <h4 className="text-[11px] font-medium text-gray-500 uppercase mb-2">Description</h4>
                <p className="text-[15px] text-gray-700">{expandedPlatform.description}</p>
              </div>
              
              {expandedPlatform.platforms && (
                <div>
                  <h4 className="text-[11px] font-medium text-gray-500 uppercase mb-2">Active On</h4>
                  <div className="flex gap-2 flex-wrap">
                    {expandedPlatform.platforms.map((socialPlatform) => {
                      const socialIconSrc = getSocialIcon(socialPlatform);
                      return (
                        <div
                          key={socialPlatform}
                          className="bg-gray-100 rounded-sm p-2 flex items-center gap-2"
                        >
                          <img
                            src={socialIconSrc}
                            alt={socialPlatform}
                            className="w-5 h-5 object-contain"
                          />
                          <span className="text-[13px] capitalize text-gray-700">{socialPlatform}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-sm p-4 border border-gray-200">
                <h4 className="text-[11px] font-medium text-gray-500 uppercase mb-3">Pricing</h4>
                <p className="text-2xl font-medium text-black tabular-nums">{expandedPlatform.price}</p>
              </div>
              
              <div className="bg-gray-50 rounded-sm p-4 border border-gray-200">
                <h4 className="text-[11px] font-medium text-gray-500 uppercase mb-3">Reach</h4>
                <p className="text-lg font-medium text-gray-700">{expandedPlatform.reach}</p>
              </div>
              
              <div className="bg-gray-50 rounded-sm p-4 border border-gray-200">
                <h4 className="text-[11px] font-medium text-gray-500 uppercase mb-3">Ad Format</h4>
                <p className="text-[15px] text-gray-700">{expandedPlatform.format}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-600">Status:</span>
          {isPlatformSelected(expandedPlatform.id) ? (
            <span className="px-3 py-1 bg-black text-white text-[12px] font-medium rounded-sm">Selected</span>
          ) : (
            <span className="px-3 py-1 bg-gray-300 text-gray-700 text-[12px] font-medium rounded-sm">Not Selected</span>
          )}
        </div>
        <button
          onClick={() => togglePlatform(expandedPlatform.id, expandedPlatform.name, expandedPlatform.category)}
          className={`px-6 py-2.5 rounded-sm font-medium text-[13px] transition-all ${
            isPlatformSelected(expandedPlatform.id)
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {isPlatformSelected(expandedPlatform.id) ? 'Deselect Platform' : 'Select Platform'}
        </button>
      </div>
    </div>
  );
}

export default ExpandedPlatformDetails;