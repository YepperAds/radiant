import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Edit2, Trash2, Save, X as XIcon } from 'lucide-react';
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

// Import data
import { allPlatforms, tabs } from '../data/countrySideData/platformsData';

function Campaigns() {
  const [deletingCampaignId, setDeletingCampaignId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [expandedPlatform, setExpandedPlatform] = useState(null);
  const categoriesScrollRef = useRef(null);
  const expandedRef = useRef(null);

  // Campaign state
  const [campaignName, setCampaignName] = useState('');
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCampaignsDropdown, setShowCampaignsDropdown] = useState(false);

  // Rate card slider state
  const [currentSlides, setCurrentSlides] = useState({});

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
      case 'twitter': return X;
      case 'instagram': return IG;
      case 'linkedin': return Linked;
      case 'youtube': return YT;
      default: return null;
    }
  };

  const resetToCreateMode = () => {
    setSelectedCampaign(null);
    setCampaignName('');
    
    // Reset to all platforms selected
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
    
    const allRateCards = {};
    Object.entries(allPlatforms).forEach(([category, items]) => {
      items.forEach(platform => {
        if (platform.rateCards && platform.rateCards.length > 0) {
          allRateCards[platform.id] = platform.rateCards.map((_, index) => index);
        }
      });
    });
    setSelectedRateCards(allRateCards);
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
      setSelectedRateCards(prev => {
        const newRateCards = { ...prev };
        allPlatforms[category].forEach(platform => {
          delete newRateCards[platform.id];
        });
        return newRateCards;
      });
    }
  };

  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    
    let priceStr = priceString.toUpperCase();
    priceStr = priceStr
      .replace(/RWF|USD|\$|PER\s*WEEK|PER\s*SECOND|,/gi, '')
      .trim();
    
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

  const calculateRateCardTotal = (rateCard) => {
    if (!rateCard) return 0;

    if (rateCard.monthlyRental) {
      let billboardTotal = 0;
      
      if (rateCard.monthlyRental) {
        billboardTotal += parsePrice(rateCard.monthlyRental);
      }
      if (rateCard.monthlyInsurance) {
        billboardTotal += parsePrice(rateCard.monthlyInsurance);
      }
      if (rateCard.flighting) {
        billboardTotal += parsePrice(rateCard.flighting);
      }
      if (rateCard.production) {
        billboardTotal += parsePrice(rateCard.production);
      }
      if (rateCard.freight) {
        billboardTotal += parsePrice(rateCard.freight);
      }
      
      return billboardTotal;
    }

    if (rateCard.price) {
      const priceStr = rateCard.price.toUpperCase();
      const basePrice = parsePrice(rateCard.price);
      
      if (priceStr.includes('PER SECOND')) {
        const seconds = 50;
        return basePrice * seconds;
      }
      
      if (priceStr.includes('PER WEEK')) {
        let days = 30;
        
        if (rateCard.quantity) {
          const quantityStr = rateCard.quantity.toLowerCase();
          if (quantityStr.includes('30 days')) days = 30;
          else if (quantityStr.includes('14 days')) days = 14;
          else if (quantityStr.includes('7 days')) days = 7;
        }
        
        const weeks = Math.ceil(days / 7);
        return basePrice * weeks;
      }
      
      return basePrice;
    }

    return 0;
  };

  const getCategoryTotalCost = (category) => {
    const selectedInCategory = selectedPlatforms.filter(p => p.category === category);
    
    const total = allPlatforms[category]
      .filter(platform => selectedInCategory.some(p => p.platformId === platform.id))
      .reduce((sum, platform) => {
        const platformRateCards = selectedRateCards[platform.id] || [];
        
        if (platformRateCards.length > 0 && platform.rateCards) {
          const rateCardTotal = platformRateCards.reduce((cardSum, cardIndex) => {
            const rateCard = platform.rateCards[cardIndex];
            return cardSum + calculateRateCardTotal(rateCard);
          }, 0);
          
          return sum + rateCardTotal;
        }
        
        return sum;
      }, 0);
    
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
        const newSelected = prev.filter(p => p.platformId !== platformId);
        const remainingInCategory = newSelected.filter(p => p.category === category);
        if (remainingInCategory.length === 0) {
          setSelectedCategories(prevCat => ({ ...prevCat, [category]: false }));
        }
        setSelectedRateCards(prev => {
          const newRateCards = { ...prev };
          delete newRateCards[platformId];
          return newRateCards;
        });
        return newSelected;
      } else {
        const newSelected = [...prev, platformData];
        const allInCategory = allPlatforms[category].every(item =>
          newSelected.some(p => p.platformId === item.id)
        );
        if (allInCategory) {
          setSelectedCategories(prevCat => ({ ...prevCat, [category]: true }));
        }
        
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

  const handleRateCardToggle = (platformId, rateCardIndex) => {
    setSelectedRateCards(prev => {
      const platformCards = prev[platformId] || [];
      const isSelected = platformCards.includes(rateCardIndex);
      
      if (isSelected && platformCards.length === 1) {
        return prev;
      }
      
      const newCards = isSelected 
        ? platformCards.filter(i => i !== rateCardIndex)
        : [...platformCards, rateCardIndex];
      
      return {
        ...prev,
        [platformId]: newCards
      };
    });
  };

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
            total += calculateRateCardTotal(rateCard);
          });
        }
      }
    });
    
    return total;
  };

  const handleSaveCampaign = async () => {
    try {
      if (!campaignName.trim()) {
        return;
      }

      if (selectedPlatforms.length === 0) {
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
        "https://yepper-backend-ll50.onrender.com/api/countrySide-campaign",
        campaignData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setCampaignName('');
        setSelectedCampaign(response.data.data);
        await fetchCampaigns();
        setShowCampaignsDropdown(true);
      }

    } catch (error) {
      console.error('Save campaign error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);

      const response = await axios.get("https://yepper-backend-ll50.onrender.com/api/countrySide-campaign");

      if (response.data.success) {
        setSavedCampaigns(response.data.data);
      }

    } catch (error) {
      console.error('Fetch campaigns error:', error);
    } finally {
      setLoading(false);
    }
  };

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
    setShowCampaignsDropdown(false);
  };

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
        `https://yepper-backend-ll50.onrender.com/api/countrySide-campaign/${selectedCampaign._id}`,
        campaignData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Auto-reload after successful update
        await fetchCampaigns();
        resetToCreateMode();
        setShowCampaignsDropdown(true);
      }

    } catch (error) {
      console.error('Update campaign error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    try {
      setLoading(true);

      const response = await axios.delete(
        `https://yepper-backend-ll50.onrender.com/api/countrySide-campaign/${campaignId}`
      );

      if (response.data.success) {
        await fetchCampaigns();
        
        if (selectedCampaign?._id === campaignId) {
          resetToCreateMode();
        }
      }

    } catch (error) {
      console.error('Delete campaign error:', error);
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
    if (!campaignName.trim()) {
      setCampaignName('New Campaign ' + new Date().toLocaleDateString());
    }
    
    if (selectedCampaign) {
      handleUpdateCampaign();
    } else {
      handleSaveCampaign();
    }
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

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <header className="bg-white border-b border-gray-200">
        <div className="h-16 flex items-center justify-between px-6">
          <Link to='/'>
            <button className="flex items-center text-gray-600 hover:text-black transition-colors">
              <ArrowLeft size={18} className="mr-2" />
              <span className="font-medium text-[15px]">Back</span>
            </button>
          </Link>
        </div>
      </header>

      {/* Campaigns Dropdown Bar */}
      <div className="fixed top-16 right-0 z-50">
        <button
          onClick={() => setShowCampaignsDropdown(!showCampaignsDropdown)}
          className="bg-black text-white px-5 py-2.5 rounded-l-sm flex items-center gap-2 hover:bg-gray-800 transition-all text-[13px] font-medium"
        >
          <span>My Campaigns: {savedCampaigns.length}</span>
          {showCampaignsDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showCampaignsDropdown && (
          <div className="bg-white border border-gray-200 rounded-l-sm mt-2 w-80 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-black"></div>
              </div>
            ) : savedCampaigns.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-[13px]">
                No campaigns yet
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {savedCampaigns.map(campaign => (
                  <div
                    key={campaign._id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-[14px] text-black">{campaign.campaignName}</h4>
                        <p className="text-[12px] text-gray-500 mt-1">
                          {campaign.selectedPlatforms.length} platforms
                        </p>
                        <p className="text-[13px] font-medium text-black mt-1 tabular-nums">
                          {formatCurrency(campaign.totalCost)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadCampaign(campaign);
                        }}
                        className="flex-1 px-3 py-1.5 bg-black text-white rounded-sm text-[12px] font-medium hover:bg-gray-800 flex items-center justify-center gap-1"
                      >
                        <Edit2 size={12} />
                        Edit
                      </button>
                      {deletingCampaignId === campaign._id ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCampaign(campaign._id);
                              setDeletingCampaignId(null);
                            }}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-sm text-[12px] font-medium hover:bg-red-600 flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            Confirm
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingCampaignId(null);
                            }}
                            className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-sm text-[12px] font-medium hover:border-black flex items-center gap-1"
                          >
                            <XIcon size={12} />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingCampaignId(campaign._id);
                          }}
                          className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-sm text-[12px] font-medium hover:border-red-500 hover:text-red-500 flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Campaign Name Input - Redesigned for editing mode */}
        {selectedCampaign && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-5 shadow-md">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-lg shadow-sm">
                  <Edit2 size={20} className="text-white" />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-blue-700 uppercase tracking-wide block">
                    Editing Mode
                  </label>
                </div>
              </div>
              <button
                onClick={resetToCreateMode}
                className="px-5 py-2.5 bg-white border-2 border-blue-400 text-blue-600 rounded-lg text-[13px] font-semibold hover:bg-blue-50 hover:border-blue-500 transition-all shadow-sm flex items-center gap-2"
              >
                <XIcon size={14} />
                Create New Campaign
              </button>
            </div>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="Campaign name"
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg text-[15px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white font-medium"
            />
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-10 space-y-6">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <TabFilter tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Platforms Display */}
        <>
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
            currentSlides={currentSlides}
            setCurrentSlides={setCurrentSlides}
          />

          {/* Fixed Bottom Bar - Updated styling for edit mode */}
          <div className={`fixed bottom-0 left-0 right-0 border-t ${
            selectedCampaign 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-400' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  {!selectedCampaign && (
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Campaign name (optional)"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-sm text-[15px] focus:outline-none focus:border-black"
                    />
                  )}
                  {selectedCampaign && (
                    <div className="text-[14px]">
                      <span className="font-semibold text-white">
                        {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-[11px] ${selectedCampaign ? 'text-blue-100' : 'text-gray-500'}`}>
                      Total Cost
                    </div>
                    <div className={`text-lg font-medium tabular-nums ${selectedCampaign ? 'text-white' : 'text-black'}`}>
                      {formatCurrency(calculateTotalCost())}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleContinue}
                    disabled={selectedPlatforms.length === 0 || loading}
                    className={`px-8 py-3 text-[14px] font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg ${
                      selectedPlatforms.length === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : selectedCampaign
                        ? 'bg-white text-blue-600 hover:bg-blue-50 border-2 border-white'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                        <span>{selectedCampaign ? 'Updating...' : 'Saving...'}</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>{selectedCampaign ? 'Update Campaign' : 'Save Campaign'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default Campaigns;