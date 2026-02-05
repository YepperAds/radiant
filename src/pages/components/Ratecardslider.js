// RateCardSlider.js - Updated to show calculated total prices
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

function RateCardSlider({ 
  rateCards, 
  platformName, 
  selectedRateCards = [], 
  onRateCardToggle,
  calculateRateCardTotal,
  formatCurrency 
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % rateCards.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + rateCards.length) % rateCards.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (!rateCards || rateCards.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No rate cards available
      </div>
    );
  }

  const currentCard = rateCards[currentSlide];
  const isSelected = selectedRateCards.includes(currentSlide);

  const handleToggle = () => {
    if (onRateCardToggle) {
      onRateCardToggle(currentSlide);
    }
  };

  // Calculate total price for display
  const getTotalPrice = () => {
    if (calculateRateCardTotal && formatCurrency) {
      const total = calculateRateCardTotal(currentCard);
      return formatCurrency(total);
    }
    return currentCard.price || 'N/A';
  };

  // Get pricing breakdown info
  const getPricingInfo = () => {
    if (!currentCard.price) return null;
    
    const priceStr = currentCard.price.toUpperCase();
    
    if (priceStr.includes('PER SECOND')) {
      return {
        type: 'Per Second',
        duration: '50 seconds',
        note: 'Average ad duration (40-60 sec)'
      };
    }
    
    if (priceStr.includes('PER WEEK')) {
      let days = 30;
      if (currentCard.quantity) {
        const quantityStr = currentCard.quantity.toLowerCase();
        if (quantityStr.includes('30 days')) days = 30;
        else if (quantityStr.includes('14 days')) days = 14;
        else if (quantityStr.includes('7 days')) days = 7;
      }
      const weeks = Math.ceil(days / 7);
      
      return {
        type: 'Per Week',
        duration: `${weeks} weeks (${days} days)`,
        note: `Based on ${currentCard.quantity || '30 days'} campaign`
      };
    }
    
    return null;
  };

  const pricingInfo = getPricingInfo();

  return (
    <div className="relative">
      {/* Main Card Container */}
      <div className="relative overflow-hidden rounded-xl">
        {/* Navigation Arrows */}
        {rateCards.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}

        {/* Selection Badge - Top Right */}
        {rateCards.length > 1 && (
          <button
            onClick={handleToggle}
            className={`absolute top-4 right-4 z-10 px-4 py-2 rounded-full font-semibold transition-all shadow-lg hover:scale-105 ${
              isSelected
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 border-2 border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {isSelected && <Check className="w-4 h-4" />}
              <span className="text-sm">{isSelected ? 'Selected' : 'Select'}</span>
            </div>
          </button>
        )}

        {/* Card Content */}
        <div className={`bg-gradient-to-br from-gray-50 to-white p-6 min-h-[400px] transition-all ${
          isSelected ? 'ring-2 ring-black' : ''
        }`}>
          <div className="grid md:grid-cols-2 gap-6 h-full">
            {/* Left Side - Image */}
            <div className="flex items-center justify-center bg-white rounded-lg border-2 border-gray-200 p-4 overflow-hidden">
              {currentCard.imageUrl ? (
                <img
                  src={currentCard.imageUrl}
                  alt={`${platformName} - ${currentCard.title || 'Rate Card'}`}
                  className="w-full h-full object-contain max-h-[350px]"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="hidden w-full h-full items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Add image here</p>
                </div>
              </div>
            </div>

            {/* Right Side - Information */}
            <div className="space-y-4">
              
              {/* Title */}
              {currentCard.title && (
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentCard.title}
                  </h4>
                </div>
              )}

              {/* Billboard Fields */}
              {currentCard.road && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Road</h5>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentCard.road}</p>
                </div>
              )}

              {currentCard.closestLandmark && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Closest Landmark</h5>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentCard.closestLandmark}</p>
                </div>
              )}

              {currentCard.location && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Location</h5>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentCard.location}</p>
                </div>
              )}

              {currentCard.size && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Size</h5>
                  <p className="text-lg font-semibold text-gray-900">{currentCard.size}</p>
                </div>
              )}

              {/* Website Fields */}
              {currentCard.type && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Type</h5>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentCard.type}</p>
                </div>
              )}

              {currentCard.description && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Description</h5>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentCard.description}</p>
                </div>
              )}

              {currentCard.quantity && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Duration</h5>
                  <p className="text-lg font-semibold text-gray-900">{currentCard.quantity}</p>
                </div>
              )}

              {/* Radio & TV Fields */}
              {currentCard.item && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Item</h5>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentCard.item}</p>
                </div>
              )}

              {currentCard.time && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Time Slot</h5>
                  <p className="text-lg font-semibold text-gray-900">{currentCard.time}</p>
                </div>
              )}

              {/* Standard Price Display with Calculation Info */}
              {currentCard.price && (
                <div className="bg-black text-white rounded-lg p-4">
                  <h5 className="text-xs font-semibold uppercase mb-2 opacity-80">
                    {pricingInfo ? 'Calculated Total Price' : 'Price'}
                  </h5>
                  <p className="text-3xl font-bold">
                    {getTotalPrice()}
                  </p>
                  
                  {pricingInfo && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-sm opacity-90">
                        <span className="font-semibold">Base: </span>
                        {currentCard.price}
                      </p>
                      <p className="text-xs opacity-80 mt-1">
                        {pricingInfo.note}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {pricingInfo.duration}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Billboard Monthly Costs */}
              {currentCard.monthlyRental && (
                <div className="bg-black text-white rounded-lg p-4">
                  <h5 className="text-xs font-semibold uppercase mb-3 opacity-80">
                    Total Cost
                  </h5>
                  <p className="text-3xl font-bold mb-3">
                    {getTotalPrice()}
                  </p>
                  <div className="pt-3 border-t border-white/20 space-y-2">
                    <p className="text-xs font-semibold opacity-90 mb-2">Breakdown:</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs opacity-80">Rental</span>
                      <span className="text-sm font-bold">{currentCard.monthlyRental}</span>
                    </div>
                    {currentCard.monthlyInsurance && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs opacity-80">Insurance</span>
                        <span className="text-sm font-bold">{currentCard.monthlyInsurance}</span>
                      </div>
                    )}
                    {currentCard.flighting && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs opacity-80">Flighting</span>
                        <span className="text-sm font-bold">{currentCard.flighting}</span>
                      </div>
                    )}
                    {currentCard.production && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs opacity-80">Production</span>
                        <span className="text-sm font-bold">{currentCard.production}</span>
                      </div>
                    )}
                    {currentCard.freight && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs opacity-80">Freight</span>
                        <span className="text-sm font-bold">{currentCard.freight}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Other Optional Fields */}
              {currentCard.audienceCount && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Audience Count</h5>
                  <p className="text-lg font-semibold text-gray-900">{currentCard.audienceCount}</p>
                </div>
              )}

              {currentCard.format && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Ad Format</h5>
                  <p className="text-sm text-gray-700">{currentCard.format}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Dot Indicators with Selection Status */}
      {rateCards.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {rateCards.map((_, index) => {
            const isDotSelected = selectedRateCards.includes(index);
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all rounded-full relative ${
                  index === currentSlide
                    ? 'w-8 h-3'
                    : 'w-3 h-3 hover:bg-gray-400'
                } ${
                  isDotSelected
                    ? 'bg-black'
                    : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                {isDotSelected && index !== currentSlide && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Slide Counter with Selection Count */}
      {rateCards.length > 1 && (
        <div className="text-center mt-3 text-sm text-gray-500 font-medium">
          <span>{currentSlide + 1} / {rateCards.length}</span>
          {selectedRateCards.length > 0 && (
            <span className="ml-3 text-black font-semibold">
              • {selectedRateCards.length} selected
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default RateCardSlider;