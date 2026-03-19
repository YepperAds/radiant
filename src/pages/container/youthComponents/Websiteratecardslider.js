import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function WebsiteRateCardSlider({ rateCards, platformName }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!rateCards || rateCards.length === 0) {
    return <div className="text-gray-500 text-center py-8">No rate cards available</div>;
  }

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % rateCards.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + rateCards.length) % rateCards.length);
  };

  const currentCard = rateCards[currentSlide];

  return (
    <div className="w-full">
      {/* Main Card Display */}
      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Image */}
          <div className="md:w-2/5 bg-gray-100 relative">
            <div className="aspect-[4/3] md:aspect-auto md:h-full relative">
              {currentCard.imageUrl && currentCard.imageUrl !== "*****" ? (
                <img
                  src={currentCard.imageUrl}
                  alt={currentCard.type}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              {/* Fallback placeholder */}
              <div className={`${currentCard.imageUrl && currentCard.imageUrl !== "*****" ? 'hidden' : 'flex'} absolute inset-0 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200`}>
                <div className="text-center p-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center shadow-md">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{platformName}</p>
                  <p className="text-xs text-gray-400 mt-1">Rate Card Image</p>
                </div>
              </div>

              {/* Navigation Arrows - Only show if more than 1 card */}
              {rateCards.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
                    aria-label="Previous rate card"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
                    aria-label="Next rate card"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Side - Information */}
          <div className="md:w-3/5 p-6 flex flex-col">
            {/* Type */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Type</h4>
              <p className="text-xl font-bold text-black">{currentCard.type}</p>
            </div>

            {/* Description */}
            <div className="mb-4 flex-grow">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{currentCard.description}</p>
            </div>

            {/* Quantity and Price Row */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              {/* Quantity */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Duration</h4>
                <p className="text-2xl font-bold text-black">
                  {currentCard.quantity} <span className="text-sm font-normal text-gray-600">days</span>
                </p>
              </div>

              {/* Price */}
              <div className="bg-black rounded-lg p-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Price</h4>
                <p className="text-2xl font-bold text-white">{currentCard.priceDisplay}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators - Only show if more than 1 card */}
      {rateCards.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {rateCards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'w-8 h-2 bg-black'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to rate card ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Card Counter */}
      {rateCards.length > 1 && (
        <div className="text-center mt-2">
          <span className="text-sm text-gray-500 font-medium">
            {currentSlide + 1} / {rateCards.length}
          </span>
        </div>
      )}
    </div>
  );
}

export default WebsiteRateCardSlider;