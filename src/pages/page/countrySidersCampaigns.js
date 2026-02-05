// Campaigns.js - Updated with duration-based pricing calculations
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Share2 } from 'lucide-react';
import X from '../../logos/twitter.png';
import IG from '../../logos/instagram.png';
import Linked from '../../logos/linkedin.png';
import YT from '../../logos/youtube.png';

// Import components
import SearchBar from '../container/countrysideComponents/SearchBar';
import TabFilter from '../container/countrysideComponents/TabFilter';
import AllPlatformsView from '../container/countrysideComponents/AllPlatformsView';
import SingleCategoryView from '../container/countrysideComponents/SingleCategoryView';
import ExpandedPlatformDetails from '../container/countrysideComponents/ExpandedPlatformDetails';
import BottomBar from '../container/countrysideComponents/BottomBar';

// Import data
import { allPlatforms, tabs } from '../data/countrySideData/platformsData';

function Campaigns() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [expandedPlatform, setExpandedPlatform] = useState(null);
  const categoriesScrollRef = useRef(null);
  const expandedRef = useRef(null);

  // Campaign state
  const [campaignName, setCampaignName] = useState('');
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [showCampaignsModal, setShowCampaignsModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(false);

  // API base URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://yepper-backend-ll50.onrender.com/api';

  // Initialize with all platforms selected
  const [selectedPlatforms, setSelectedPlatforms] = useState(() => {
    const allSelected = [];
    Object.entries(allPlatforms).forEach(([category, items]) => {
      items.forEach(item => {
        allSelected.push({ platformId: item.id, platformName: item.name, category });
      });
    });
    return allSelected;
  });

  // Initialize with ALL rate cards selected for all platforms
  const [selectedRateCards, setSelectedRateCards] = useState(() => {
    const allRateCards = {};
    Object.entries(allPlatforms).forEach(([category, items]) => {
      items.forEach(platform => {
        if (platform.rateCards && platform.rateCards.length > 0) {
          // Select all rate cards by default
          allRateCards[platform.id] = platform.rateCards.map((_, index) => index);
        }
      });
    });
    return allRateCards;
  });

  // Initialize with all categories selected
  const [selectedCategories, setSelectedCategories] = useState({
    websites: true,
    tv: true,
    radio: true,
    billboards: true,
    influencers: true
  });

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'twitter':
        return X;
      case 'instagram':
        return IG;
      case 'linkedin':
        return Linked;
      case 'youtube':
        return YT;
      default:
        return Share2;
    }
  };

  const toggleCategory = (category) => {
    const newSelectedCategories = {
      ...selectedCategories,
      [category]: !selectedCategories[category]
    };
    setSelectedCategories(newSelectedCategories);

    if (newSelectedCategories[category]) {
      const platformsToAdd = allPlatforms[category].map(item => ({
        platformId: item.id,
        platformName: item.name,
        category
      }));
      setSelectedPlatforms(prev => [...prev, ...platformsToAdd]);
      
      // Re-select all rate cards for platforms in this category
      setSelectedRateCards(prev => {
        const newRateCards = { ...prev };
        allPlatforms[category].forEach(platform => {
          if (platform.rateCards && platform.rateCards.length > 0) {
            newRateCards[platform.id] = platform.rateCards.map((_, index) => index);
          }
        });
        return newRateCards;
      });
    } else {
      setSelectedPlatforms(prev => prev.filter(p => p.category !== category));
      // Clear rate cards for platforms in this category
      setSelectedRateCards(prev => {
        const newRateCards = { ...prev };
        allPlatforms[category].forEach(platform => {
          delete newRateCards[platform.id];
        });
        return newRateCards;
      });
    }
  };

  // Helper function to parse price strings
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    
    // Convert to uppercase for consistency
    let priceStr = priceString.toUpperCase();
    
    // Remove "RWF", "$", "PER WEEK", "PER SECOND", and any spaces/commas
    priceStr = priceStr
      .replace(/RWF|USD|\$|PER\s*WEEK|PER\s*SECOND|,/gi, '')
      .trim();
    
    // Check for K or M suffix
    let multiplier = 1;
    if (priceStr.includes('K')) {
      multiplier = 1000;
      priceStr = priceStr.replace('K', '');
    } else if (priceStr.includes('M')) {
      multiplier = 1000000;
      priceStr = priceStr.replace('M', '');
    }
    
    const price = parseFloat(priceStr) * multiplier;
    
    return isNaN(price) ? 0 : price;
  };

  // Calculate total price for a rate card based on duration and pricing structure
  const calculateRateCardTotal = (rateCard) => {
    if (!rateCard) return 0;

    // Handle Billboard pricing (monthlyRental, production, flighting)
    if (rateCard.monthlyRental) {
      let billboardTotal = 0;
      
      // Add monthly costs
      if (rateCard.monthlyRental) {
        billboardTotal += parsePrice(rateCard.monthlyRental);
      }
      if (rateCard.monthlyInsurance) {
        billboardTotal += parsePrice(rateCard.monthlyInsurance);
      }
      if (rateCard.flighting) {
        billboardTotal += parsePrice(rateCard.flighting);
      }
      
      // Add one-time costs
      if (rateCard.production) {
        billboardTotal += parsePrice(rateCard.production);
      }
      if (rateCard.freight) {
        billboardTotal += parsePrice(rateCard.freight);
      }
      
      return billboardTotal;
    }

    // Handle standard price field
    if (rateCard.price) {
      const priceStr = rateCard.price.toUpperCase();
      const basePrice = parsePrice(rateCard.price);
      
      // Check if price is "per second" (TV/Radio)
      if (priceStr.includes('PER SECOND')) {
        // Default: 50 seconds per ad (between 40-60 seconds)
        const seconds = 50;
        const totalPrice = basePrice * seconds;
        
        console.log(`Per Second pricing: ${basePrice} × ${seconds}s = ${totalPrice}`);
        return totalPrice;
      }
      
      // Check if price is "per week" with a duration specified
      if (priceStr.includes('PER WEEK')) {
        // Extract duration from quantity field or default to 30 days
        let days = 30; // Default
        
        if (rateCard.quantity) {
          const quantityStr = rateCard.quantity.toLowerCase();
          if (quantityStr.includes('30 days')) {
            days = 30;
          } else if (quantityStr.includes('14 days')) {
            days = 14;
          } else if (quantityStr.includes('7 days')) {
            days = 7;
          }
        }
        
        // Calculate number of weeks
        const weeks = Math.ceil(days / 7);
        const totalPrice = basePrice * weeks;
        
        console.log(`Per Week pricing: ${basePrice} × ${weeks} weeks (${days} days) = ${totalPrice}`);
        return totalPrice;
      }
      
      // Standard one-time price
      return basePrice;
    }

    return 0;
  };

  // Calculate category total based on selected rate cards
  const getCategoryTotalCost = (category) => {
    const selectedInCategory = selectedPlatforms.filter(p => p.category === category);
    
    const total = allPlatforms[category]
      .filter(platform => selectedInCategory.some(p => p.platformId === platform.id))
      .reduce((sum, platform) => {
        const platformRateCards = selectedRateCards[platform.id] || [];
        
        if (platformRateCards.length > 0 && platform.rateCards) {
          const rateCardTotal = platformRateCards.reduce((cardSum, cardIndex) => {
            const rateCard = platform.rateCards[cardIndex];
            const cardTotal = calculateRateCardTotal(rateCard);
            
            console.log(`${platform.name} - Card ${cardIndex}: ${cardTotal}`);
            return cardSum + cardTotal;
          }, 0);
          
          console.log(`${platform.name} total: ${rateCardTotal}`);
          return sum + rateCardTotal;
        }
        
        return sum;
      }, 0);
    
    console.log(`Category ${category} total: ${total}`);
    return total;
  };

  const formatCurrency = (amount) => {
    return `RWF ${new Intl.NumberFormat('en-RW', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)}`;
  };

  const togglePlatform = (platformId, platformName, category) => {
    const platformData = { platformId, platformName, category };
    setSelectedPlatforms(prev => {
      const exists = prev.find(p => p.platformId === platformId);
      if (exists) {
        // Deselecting platform
        const newSelected = prev.filter(p => p.platformId !== platformId);
        const remainingInCategory = newSelected.filter(p => p.category === category);
        if (remainingInCategory.length === 0) {
          setSelectedCategories(prevCat => ({ ...prevCat, [category]: false }));
        }
        // Clear rate cards for this platform when deselected
        setSelectedRateCards(prev => {
          const newRateCards = { ...prev };
          delete newRateCards[platformId];
          return newRateCards;
        });
        return newSelected;
      } else {
        // Selecting platform - select all its rate cards
        const newSelected = [...prev, platformData];
        const allInCategory = allPlatforms[category].every(item =>
          newSelected.some(p => p.platformId === item.id)
        );
        if (allInCategory) {
          setSelectedCategories(prevCat => ({ ...prevCat, [category]: true }));
        }
        
        // Select all rate cards for this platform
        const platform = Object.values(allPlatforms)
          .flat()
          .find(p => p.id === platformId);
        
        if (platform?.rateCards && platform.rateCards.length > 0) {
          setSelectedRateCards(prev => ({
            ...prev,
            [platformId]: platform.rateCards.map((_, index) => index)
          }));
        }
        
        return newSelected;
      }
    });
  };

  const isPlatformSelected = (platformId) => {
    return selectedPlatforms.some(p => p.platformId === platformId);
  };

  const handlePlatformClick = (platform, category) => {
    if (expandedPlatform?.id === platform.id) {
      setExpandedPlatform(null);
    } else {
      setExpandedPlatform({ ...platform, category });
      setTimeout(() => {
        expandedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  // Handle rate card toggle with validation
  const handleRateCardToggle = (platformId, rateCardIndex) => {
    setSelectedRateCards(prev => {
      const platformCards = prev[platformId] || [];
      const isSelected = platformCards.includes(rateCardIndex);
      
      if (isSelected) {
        // Trying to deselect - check if it's the last one
        if (platformCards.length === 1) {
          alert('Each platform must have at least one rate card selected. Please select another rate card before deselecting this one.');
          return prev; // Don't allow deselection
        }
        
        const newCards = platformCards.filter(i => i !== rateCardIndex);
        console.log(`Deselected rate card ${rateCardIndex} for platform ${platformId}`);
        return {
          ...prev,
          [platformId]: newCards
        };
      } else {
        // Selecting a rate card
        const newCards = [...platformCards, rateCardIndex];
        console.log(`Selected rate card ${rateCardIndex} for platform ${platformId}`);
        return {
          ...prev,
          [platformId]: newCards
        };
      }
    });
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    let total = 0;
    
    selectedPlatforms.forEach(platform => {
      const platformData = Object.values(allPlatforms)
        .flat()
        .find(p => p.id === platform.platformId);
      
      if (platformData) {
        const platformRateCards = selectedRateCards[platform.platformId] || [];
        
        if (platformRateCards.length > 0 && platformData.rateCards) {
          platformRateCards.forEach(cardIndex => {
            const rateCard = platformData.rateCards[cardIndex];
            const cardTotal = calculateRateCardTotal(rateCard);
            total += cardTotal;
          });
        }
      }
    });
    
    console.log(`Total campaign cost: ${total}`);
    return total;
  };

  // Save campaign
  const handleSaveCampaign = async () => {
    try {
      if (!campaignName.trim()) {
        alert('Please enter a campaign name');
        return;
      }

      if (selectedPlatforms.length === 0) {
        alert('Please select at least one platform');
        return;
      }

      setLoading(true);

      const campaignData = {
        campaignName,
        selectedPlatforms,
        selectedCategories,
        selectedRateCards,
        totalCost: calculateTotalCost(),
        status: 'draft'
      };

      const response = await axios.post(
        `${API_URL}/countrySide-campaign`,
        campaignData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert('Campaign saved successfully!');
        setShowCampaignModal(false);
        setCampaignName('');
        setSelectedCampaign(response.data.data);
      }

    } catch (error) {
      console.error('Save campaign error:', error);
      alert(error.response?.data?.message || 'Error saving campaign');
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved campaigns
  const fetchCampaigns = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/countrySide-campaign`);

      if (response.data.success) {
        setSavedCampaigns(response.data.data);
      }

    } catch (error) {
      console.error('Fetch campaigns error:', error);
      alert('Error loading campaigns');
    } finally {
      setLoading(false);
    }
  };

  // Load campaign for editing
  const handleLoadCampaign = (campaign) => {
    setCampaignName(campaign.campaignName);
    setSelectedPlatforms(campaign.selectedPlatforms);
    setSelectedCategories(campaign.selectedCategories);
    
    const rateCardsObj = {};
    campaign.selectedPlatforms.forEach(platform => {
      if (platform.selectedRateCards && platform.selectedRateCards.length > 0) {
        rateCardsObj[platform.platformId] = platform.selectedRateCards.map(
          rc => rc.rateCardIndex
        );
      }
    });
    setSelectedRateCards(rateCardsObj);
    
    setSelectedCampaign(campaign);
    setShowCampaignsModal(false);
  };

  // Update existing campaign
  const handleUpdateCampaign = async () => {
    try {
      if (!selectedCampaign) {
        return handleSaveCampaign();
      }

      setLoading(true);

      const campaignData = {
        campaignName,
        selectedPlatforms,
        selectedCategories,
        selectedRateCards,
        totalCost: calculateTotalCost()
      };

      const response = await axios.put(
        `${API_URL}/countrySide-campaign/${selectedCampaign._id}`,
        campaignData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert('Campaign updated successfully!');
        setSelectedCampaign(response.data.data);
      }

    } catch (error) {
      console.error('Update campaign error:', error);
      alert(error.response?.data?.message || 'Error updating campaign');
    } finally {
      setLoading(false);
    }
  };

  // Delete campaign
  const handleDeleteCampaign = async (campaignId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this campaign?')) {
        return;
      }

      setLoading(true);

      const response = await axios.delete(
        `${API_URL}/countrySide-campaign/${campaignId}`
      );

      if (response.data.success) {
        alert('Campaign deleted successfully!');
        fetchCampaigns();
        
        // If deleted campaign was currently selected, clear selection
        if (selectedCampaign?._id === campaignId) {
          setSelectedCampaign(null);
          // Reset to default selections
          const allSelected = [];
          Object.entries(allPlatforms).forEach(([category, items]) => {
            items.forEach(item => {
              allSelected.push({ platformId: item.id, platformName: item.name, category });
            });
          });
          setSelectedPlatforms(allSelected);
          setSelectedCategories({
            websites: true,
            tv: true,
            radio: true,
            billboards: true,
            influencers: true
          });
          
          // Re-select all rate cards
          const allRateCards = {};
          Object.entries(allPlatforms).forEach(([category, items]) => {
            items.forEach(platform => {
              if (platform.rateCards && platform.rateCards.length > 0) {
                allRateCards[platform.id] = platform.rateCards.map((_, index) => index);
              }
            });
          });
          setSelectedRateCards(allRateCards);
          setCampaignName('');
        }
      }

    } catch (error) {
      console.error('Delete campaign error:', error);
      alert('Error deleting campaign');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPlatforms = () => {
    let filtered;
    if (activeTab === 'all') {
      filtered = Object.entries(allPlatforms).flatMap(([category, items]) =>
        items.map(item => ({ ...item, category }))
      );
    } else {
      filtered = allPlatforms[activeTab]?.map(item => ({ ...item, category: activeTab })) || [];
    }

    if (searchQuery) {
      filtered = filtered.filter(platform =>
        platform?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const handleContinue = () => {
    setShowCampaignModal(true);
  };

  const scrollCategories = (direction) => {
    const container = categoriesScrollRef.current;
    if (container) {
      const scrollAmount = container.clientWidth;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    const container = categoriesScrollRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = categoriesScrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [activeTab]);

  const totalPlatformCount = Object.values(allPlatforms).flat().length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Header */}
        <div className="mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-tight">
            Select your advertising platforms
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            All platforms and rate cards are selected by default. Click to deselect or tap any platform to see details.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 sm:mb-10 space-y-4 sm:space-y-6">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <TabFilter tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Platforms Display */}
        {activeTab === 'all' ? (
          <AllPlatformsView
            allPlatforms={allPlatforms}
            searchQuery={searchQuery}
            selectedPlatforms={selectedPlatforms}
            selectedCategories={selectedCategories}
            expandedPlatform={expandedPlatform}
            showLeftButton={showLeftButton}
            showRightButton={showRightButton}
            categoriesScrollRef={categoriesScrollRef}
            scrollCategories={scrollCategories}
            toggleCategory={toggleCategory}
            togglePlatform={togglePlatform}
            handlePlatformClick={handlePlatformClick}
            isPlatformSelected={isPlatformSelected}
            getSocialIcon={getSocialIcon}
            getCategoryTotalCost={getCategoryTotalCost}
            formatCurrency={formatCurrency}
          />
        ) : (
          <SingleCategoryView
            filteredPlatforms={getFilteredPlatforms()}
            expandedPlatform={expandedPlatform}
            togglePlatform={togglePlatform}
            handlePlatformClick={handlePlatformClick}
            isPlatformSelected={isPlatformSelected}
            getSocialIcon={getSocialIcon}
          />
        )}

        {/* Expanded Platform Details */}
        <ExpandedPlatformDetails
          expandedPlatform={expandedPlatform}
          expandedRef={expandedRef}
          isPlatformSelected={isPlatformSelected}
          togglePlatform={togglePlatform}
          setExpandedPlatform={setExpandedPlatform}
          getSocialIcon={getSocialIcon}
          selectedRateCards={selectedRateCards}
          onRateCardToggle={handleRateCardToggle}
          calculateRateCardTotal={calculateRateCardTotal}
          formatCurrency={formatCurrency}
        />

        {/* Fixed Bottom Bar */}
        <BottomBar
          selectedCount={selectedPlatforms.length}
          totalCount={totalPlatformCount}
          handleContinue={handleContinue}
        />
      </div>

      {/* Campaign Name Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">
              {selectedCampaign ? 'Update Campaign' : 'Save Campaign'}
            </h3>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="Enter campaign name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Summary:</p>
              <p className="font-semibold">{selectedPlatforms.length} platforms selected</p>
              <p className="text-sm text-gray-600 mt-1">
                {Object.values(selectedRateCards).flat().length} rate cards selected
              </p>
              <p className="text-lg font-bold mt-2">
                Total: {formatCurrency(calculateTotalCost())}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCampaignModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={selectedCampaign ? handleUpdateCampaign : handleSaveCampaign}
                className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : (selectedCampaign ? 'Update' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Campaigns Modal */}
      {showCampaignsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">My Campaigns</h3>
              <button
                onClick={() => setShowCampaignsModal(false)}
                className="text-gray-500 hover:text-black text-2xl"
              >
                ✕
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-black"></div>
                <p className="mt-2 text-gray-600">Loading campaigns...</p>
              </div>
            ) : savedCampaigns.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No campaigns yet</p>
            ) : (
              <div className="space-y-4">
                {savedCampaigns.map(campaign => (
                  <div
                    key={campaign._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-lg">{campaign.campaignName}</h4>
                        <p className="text-sm text-gray-600">
                          {campaign.selectedPlatforms.length} platforms • {formatCurrency(campaign.totalCost)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {new Date(campaign.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleLoadCampaign(campaign)}
                        className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(campaign._id)}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Campaigns Button */}
      <button
        onClick={() => {
          fetchCampaigns();
          setShowCampaignsModal(true);
        }}
        className="fixed top-4 right-4 px-6 py-3 bg-black text-white rounded-lg font-semibold shadow-lg z-40"
      >
        My Campaigns 
      </button>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Campaigns;