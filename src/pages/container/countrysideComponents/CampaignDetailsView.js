// CampaignDetailsView.js
import React, { useState } from 'react';
import { X as XIcon, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

function CampaignDetailsView({ 
  campaign, 
  onClose, 
  onEdit, 
  onDelete,
  allPlatforms,
  getSocialIcon,
  formatCurrency,
  calculateRateCardTotal
}) {
  const [expandedPlatformId, setExpandedPlatformId] = useState(null);
  const [currentSlides, setCurrentSlides] = useState({});

  // Get full platform details
  const getPlatformDetails = (platformId) => {
    return Object.values(allPlatforms)
      .flat()
      .find(p => p.id === platformId);
  };

  // Navigate rate card slides
  const nextSlide = (platformId, totalCards) => {
    setCurrentSlides(prev => ({
      ...prev,
      [platformId]: ((prev[platformId] || 0) + 1) % totalCards
    }));
  };

  const prevSlide = (platformId, totalCards) => {
    setCurrentSlides(prev => ({
      ...prev,
      [platformId]: ((prev[platformId] || 0) - 1 + totalCards) % totalCards
    }));
  };

  const goToSlide = (platformId, index) => {
    setCurrentSlides(prev => ({
      ...prev,
      [platformId]: index
    }));
  };

  // Group platforms by category
  const platformsByCategory = campaign.selectedPlatforms.reduce((acc, platform) => {
    if (!acc[platform.category]) {
      acc[platform.category] = [];
    }
    acc[platform.category].push(platform);
    return acc;
  }, {});

  return (
    <div className="mb-24 bg-gradient-to-br from-purple-50 to-blue-50 border-4 border-purple-600 rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-white">{campaign.campaignName}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              campaign.status === 'active' ? 'bg-green-400 text-green-900' :
              campaign.status === 'draft' ? 'bg-gray-300 text-gray-800' :
              'bg-yellow-400 text-yellow-900'
            }`}>
              {campaign.status}
            </span>
          </div>
          <div className="flex items-center gap-6 text-white text-sm">
            <span>{campaign.selectedPlatforms.length} platforms selected</span>
            <span>•</span>
            <span className="text-lg font-bold">{formatCurrency(campaign.totalCost)}</span>
            <span>•</span>
            <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(campaign)}
            className="px-6 py-2.5 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 flex items-center gap-2 transition-all"
          >
            <Edit2 size={16} />
            Edit Campaign
          </button>
          <button
            onClick={() => {
              if (window.confirm('Delete this campaign?')) {
                onDelete(campaign._id);
                onClose();
              }
            }}
            className="px-6 py-2.5 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 flex items-center gap-2 transition-all"
          >
            <Trash2 size={16} />
            Delete
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <XIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Categories */}
        <div className="space-y-8">
          {Object.entries(platformsByCategory).map(([category, platforms]) => (
            <div key={category} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-purple-200">
              {/* Category Header */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-4 border-b-2 border-purple-200">
                <h3 className="text-xl font-bold text-purple-900 capitalize">{category}</h3>
                <p className="text-sm text-purple-600 mt-1">
                  {platforms.length} platform{platforms.length !== 1 ? 's' : ''} in this category
                </p>
              </div>

              {/* Platforms List */}
              <div className="divide-y divide-purple-100">
                {platforms.map(platform => {
                  const platformDetails = getPlatformDetails(platform.platformId);
                  if (!platformDetails) return null;

                  const isExpanded = expandedPlatformId === platform.platformId;
                  const Icon = platformDetails.icon;

                  return (
                    <div key={platform.platformId} className="bg-white">
                      {/* Platform Header */}
                      <button
                        onClick={() => setExpandedPlatformId(isExpanded ? null : platform.platformId)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-purple-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg border-2 border-purple-200">
                            {platformDetails.iconUrl ? (
                              <img 
                                src={platformDetails.iconUrl} 
                                alt={platformDetails.name} 
                                className="w-full h-full object-contain p-2"
                              />
                            ) : (
                              <Icon size={28} className="text-purple-600" />
                            )}
                          </div>
                          <div className="text-left">
                            <h4 className="text-lg font-bold text-gray-900">{platformDetails.name}</h4>
                            <p className="text-sm text-gray-600">
                              {platform.selectedRateCards?.length || 0} rate card{platform.selectedRateCards?.length !== 1 ? 's' : ''} selected
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {/* Calculate total for this platform */}
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Platform Total</div>
                            <div className="text-lg font-bold text-purple-600">
                              {formatCurrency(
                                (platform.selectedRateCards || []).reduce((sum, rc) => {
                                  const rateCard = platformDetails.rateCards?.[rc.rateCardIndex];
                                  return sum + (rateCard ? calculateRateCardTotal(rateCard) : 0);
                                }, 0)
                              )}
                            </div>
                          </div>
                          
                          <ChevronRight 
                            className={`w-5 h-5 text-purple-600 transition-transform ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {/* Expanded Rate Cards */}
                      {isExpanded && platformDetails.rateCards && platform.selectedRateCards && (
                        <div className="px-6 py-4 bg-gradient-to-br from-purple-50 to-blue-50 border-t-2 border-purple-200">
                          <h5 className="text-sm font-bold text-purple-900 uppercase mb-4">
                            Selected Rate Cards ({platform.selectedRateCards.length})
                          </h5>
                          
                          <div className="space-y-6">
                            {platform.selectedRateCards.map((selectedCard, idx) => {
                              const rateCard = platformDetails.rateCards[selectedCard.rateCardIndex];
                              if (!rateCard) return null;

                              const currentSlide = currentSlides[`${platform.platformId}-${idx}`] || 0;

                              return (
                                <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-purple-300">
                                  {/* Rate Card Content */}
                                  <div className="relative">
                                    {/* Navigation if multiple images */}
                                    {rateCard.imageUrl && (
                                      <>
                                        <button
                                          onClick={() => prevSlide(`${platform.platformId}-${idx}`, 1)}
                                          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                        >
                                          <ChevronLeft className="w-4 h-4 text-purple-600" />
                                        </button>
                                        <button
                                          onClick={() => nextSlide(`${platform.platformId}-${idx}`, 1)}
                                          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                        >
                                          <ChevronRight className="w-4 h-4 text-purple-600" />
                                        </button>
                                      </>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-4 p-4">
                                      {/* Left Side - Image */}
                                      <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 min-h-[250px]">
                                        {rateCard.imageUrl ? (
                                          <img
                                            src={rateCard.imageUrl}
                                            alt={rateCard.title || 'Rate Card'}
                                            className="w-full h-full object-contain max-h-[300px]"
                                          />
                                        ) : (
                                          <div className="text-center text-gray-400">
                                            <div className="w-20 h-20 mx-auto mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
                                              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                              </svg>
                                            </div>
                                            <p className="text-sm">No image</p>
                                          </div>
                                        )}
                                      </div>

                                      {/* Right Side - Details */}
                                      <div className="space-y-3">
                                        {rateCard.title && (
                                          <div>
                                            <h6 className="text-lg font-bold text-gray-900">{rateCard.title}</h6>
                                          </div>
                                        )}

                                        {/* All possible fields */}
                                        {rateCard.road && (
                                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                            <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Road</div>
                                            <div className="text-sm text-gray-700">{rateCard.road}</div>
                                          </div>
                                        )}

                                        {rateCard.closestLandmark && (
                                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                            <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Closest Landmark</div>
                                            <div className="text-sm text-gray-700">{rateCard.closestLandmark}</div>
                                          </div>
                                        )}

                                        {rateCard.location && (
                                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                            <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Location</div>
                                            <div className="text-sm text-gray-700">{rateCard.location}</div>
                                          </div>
                                        )}

                                        {rateCard.size && (
                                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                            <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Size</div>
                                            <div className="text-sm font-semibold text-gray-900">{rateCard.size}</div>
                                          </div>
                                        )}

                                        {rateCard.type && (
                                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                            <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Type</div>
                                            <div className="text-sm text-gray-700">{rateCard.type}</div>
                                          </div>
                                        )}

                                        {rateCard.description && (
                                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                            <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Description</div>
                                            <div className="text-sm text-gray-700">{rateCard.description}</div>
                                          </div>
                                        )}

                                        {rateCard.quantity && (
                                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                            <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Duration</div>
                                            <div className="text-sm font-semibold text-gray-900">{rateCard.quantity}</div>
                                          </div>
                                        )}

                                        {rateCard.item && (
                                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                            <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Item</div>
                                            <div className="text-sm text-gray-700">{rateCard.item}</div>
                                          </div>
                                        )}

                                        {rateCard.time && (
                                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                            <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Time Slot</div>
                                            <div className="text-sm font-semibold text-gray-900">{rateCard.time}</div>
                                          </div>
                                        )}

                                        {/* Price Display */}
                                        {rateCard.monthlyRental ? (
                                          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-4">
                                            <div className="text-xs font-semibold uppercase mb-2 opacity-90">Total Cost</div>
                                            <div className="text-2xl font-bold mb-3">
                                              {formatCurrency(calculateRateCardTotal(rateCard))}
                                            </div>
                                            <div className="pt-3 border-t border-white/20 space-y-2">
                                              <div className="text-xs font-semibold opacity-90 mb-2">Breakdown:</div>
                                              <div className="flex justify-between text-sm">
                                                <span className="opacity-80">Rental</span>
                                                <span className="font-bold">{rateCard.monthlyRental}</span>
                                              </div>
                                              {rateCard.monthlyInsurance && (
                                                <div className="flex justify-between text-sm">
                                                  <span className="opacity-80">Insurance</span>
                                                  <span className="font-bold">{rateCard.monthlyInsurance}</span>
                                                </div>
                                              )}
                                              {rateCard.flighting && (
                                                <div className="flex justify-between text-sm">
                                                  <span className="opacity-80">Flighting</span>
                                                  <span className="font-bold">{rateCard.flighting}</span>
                                                </div>
                                              )}
                                              {rateCard.production && (
                                                <div className="flex justify-between text-sm">
                                                  <span className="opacity-80">Production</span>
                                                  <span className="font-bold">{rateCard.production}</span>
                                                </div>
                                              )}
                                              {rateCard.freight && (
                                                <div className="flex justify-between text-sm">
                                                  <span className="opacity-80">Freight</span>
                                                  <span className="font-bold">{rateCard.freight}</span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        ) : rateCard.price && (
                                          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-4">
                                            <div className="text-xs font-semibold uppercase mb-2 opacity-90">Price</div>
                                            <div className="text-2xl font-bold">
                                              {formatCurrency(calculateRateCardTotal(rateCard))}
                                            </div>
                                            <div className="text-xs opacity-80 mt-2">
                                              Base: {rateCard.price}
                                            </div>
                                          </div>
                                        )}

                                        {rateCard.audienceCount && (
                                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                            <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Audience Count</div>
                                            <div className="text-sm font-semibold text-gray-900">{rateCard.audienceCount}</div>
                                          </div>
                                        )}

                                        {rateCard.format && (
                                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                            <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Ad Format</div>
                                            <div className="text-sm text-gray-700">{rateCard.format}</div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Summary */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 border-t-4 border-purple-700">
        <div className="flex items-center justify-between text-white">
          <div>
            <div className="text-sm opacity-90">Campaign Total</div>
            <div className="text-3xl font-bold">{formatCurrency(campaign.totalCost)}</div>
          </div>
          <div className="text-sm opacity-90">
            {campaign.selectedPlatforms.length} platforms • {
              campaign.selectedPlatforms.reduce((sum, p) => sum + (p.selectedRateCards?.length || 0), 0)
            } rate cards
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignDetailsView;