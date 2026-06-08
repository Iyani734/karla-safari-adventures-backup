import { useState, useEffect,useRef,useMemo, } from 'react';
import { Shield, Heart, Globe, DollarSign, Calendar, Clock, ChevronLeft, MapPin, Thermometer, AlertTriangle, Plane, Camera, Menu, X, Star, Map, Route, ArrowRight, ChevronUp, ChevronRight, Share2 } from 'lucide-react';
import { eastAfricaTours } from '../lib/tourData';
import { AllExpertReviews } from './AllExpertReviews';
import { AllUserReviews } from './AllUserReviews';
import { COUNTRIES_DATA } from '../lib/countriesData';
import { getCountryAllParksPath } from '../lib/parkRoutes';
import { shareImageToSocial } from '../lib/shareImage';
// Add this new component at the top of your file, after imports and before COUNTRIES_DATA
//working
const PhotoGalleryModal = ({ isOpen, onClose, images, startIndex = 0, title }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isSharing, setIsSharing] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const thumbnailRefs = useRef([]);
  const thumbnailContainerRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex, isOpen]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentIndex]);

  useEffect(() => {
    if (thumbnailRefs.current[currentIndex] && thumbnailContainerRef.current && isOpen) {
      setTimeout(() => {
        thumbnailRefs.current[currentIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }, 0);
    }
  }, [currentIndex, isOpen]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  const handleShare = async () => {
    setIsSharing(true);
    setShareStatus('Preparing image share...');
    try {
      const status = await shareImageToSocial({
        src: currentImage?.url,
        title: currentImage?.caption || title || 'Karla Safari Adventures gallery image',
        caption: currentImage?.caption || `${title || 'Karla Safari Adventures gallery'} - image ${currentIndex + 1}`,
      });
      setShareStatus(status);
      if (status) window.setTimeout(() => setShareStatus(''), 2600);
    } catch (error) {
      console.error('Unable to share image', error);
      setShareStatus('Image share unavailable. Link copy failed.');
      window.setTimeout(() => setShareStatus(''), 3200);
    } finally {
      setIsSharing(false);
    }
  };

  return (
<div className="fixed inset-0 z-50 flex items-start 2xl:items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn sm:p-4">      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="relative w-full h-screen md:h-auto lg:h-auto sm:h-full sm:max-h-screen sm:max-w-2xl md:max-w-3xl lg:max-w-3xl sm:rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl sm:border border-slate-700/50 flex flex-col justify-between sm:justify-between md:justify-start"> 
        <div className="flex-shrink-0 h-12 sm:h-14 md:h-16 bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 px-3 sm:px-4 md:px-6 flex items-center justify-between shadow-lg">
          <h2 className="text-white font-bold text-base sm:text-lg md:text-xl tracking-wide truncate pr-4">
            {title}
          </h2>
          
          <div className="flex-shrink-0 flex items-center gap-2">
            <button
              onClick={handleShare}
              disabled={isSharing || !currentImage?.url}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-xs font-extrabold text-slate-900 shadow-lg transition hover:bg-orange-50 disabled:cursor-wait disabled:opacity-70 sm:px-3 sm:py-2 sm:text-sm"
              aria-label={`Share ${currentImage?.caption || title || 'gallery image'} to social media`}
              title="Share image to social media"
            >
              <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{isSharing ? 'Preparing...' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="relative group p-2 rounded-full transition-all duration-300 hover:bg-white/20 active:scale-95"
              aria-label="Close gallery"
            >
              <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-all duration-300 scale-0 group-hover:scale-150 blur-sm"></div>
              <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white relative z-10 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
            </button>
          </div>
        </div>

        <div className="relative bg-black overflow-hidden min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[530px]">
          <div className="absolute inset-0">
            <img
              src={currentImage.url}
              alt={currentImage.caption || `Image ${currentIndex + 1}`}
              className="w-full h-full object-fill"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 active:from-orange-700 active:to-red-700 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 border-2 border-orange-400/50 shadow-lg z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 active:from-orange-700 active:to-red-700 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 border-2 border-orange-400/50 shadow-lg z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white relative z-10" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 bg-gradient-to-t from-black/80 to-transparent px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-t border-slate-700/50 flex items-center justify-between gap-2 sm:gap-4 hidden md:hidden lg:hidden xl:hidden">
          <div className="flex-1 text-center">
            <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 line-clamp-2">
              {currentImage.caption}
            </h3>
            {currentImage.credit && (
              <p className="text-gray-300 text-xs sm:text-xs md:text-sm line-clamp-1">{currentImage.credit}</p>
            )}
          </div>
          
          <div className="flex-shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-full">
            <span className="text-white font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </div>

        {images.length > 1 && (
          <div 
            ref={thumbnailContainerRef} 
            className="flex-shrink-0 bg-slate-800 border-t-2 border-orange-600/30 px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 overflow-x-auto min-h-20 sm:min-h-24 md:min-h-24 scrollbar-hide"
          >
            <div className="flex gap-1.5 sm:gap-2 md:gap-3 justify-start h-full items-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  ref={(el) => (thumbnailRefs.current[idx] = el)}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-15 md:h-15 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    idx === currentIndex
                      ? 'border-orange-500 scale-105 md:scale-110 shadow-lg shadow-orange-500/50 ring-2 ring-orange-400/30'
                      : 'border-slate-600 opacity-50 hover:opacity-100 hover:border-orange-400/50 active:scale-95'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {shareStatus && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl">
          {shareStatus}
        </div>
      )}
    </div>
  );
};




const NAVIGATION_SECTIONS = [
  { id: 'overview', label: 'Overview', icon: Globe },
  { id: 'parks', label: 'Parks & Reserves', icon: MapPin },
  { id: 'things-to-do', label: 'Things To Do', icon: Heart },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'wildlife', label: 'Wildlife', icon: Camera },
  { id: 'birds', label: 'Birds', icon: Camera },
  { id: 'best-time', label: 'Best Time To Visit', icon: Calendar },
  { id: 'weather', label: 'Weather & Climate', icon: Thermometer },
  { id: 'routes', label: 'Popular Routes', icon: Route },
  { id: 'getting-there', label: 'How To Get There', icon: Plane },
  { id: 'malaria', label: 'Malaria & Vaccinations', icon: AlertTriangle },
  { id: 'safety', label: 'Safety', icon: Shield }
];


// Add these BEFORE the line: function Destination() {
// These should be at the top of your file, after imports

const LIKES_STORAGE_KEY = 'safari_review_likes';

const getLikesFromStorage = () => {
  try {
    const stored = localStorage.getItem(LIKES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading likes from localStorage:', error);
    return {};
  }
};

const saveLikesToStorage = (likes) => {
  try {
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));
  } catch (error) {
    console.error('Error saving likes to localStorage:', error);
  }
};


function Destination() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState('countries');
  const [showMobileMenu, setShowMobileMenu] = useState(true);
  const [thingsToDoCurrentPage, setThingsToDoCurrentPage] = useState(1);
const [expertReviewsCurrentPage, setExpertReviewsCurrentPage] = useState(() => {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('page') || '1', 10);
});
const [userReviewsCurrentPage, setUserReviewsCurrentPage] = useState(() => {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('page') || '1', 10);
});
const userReviewsRef = useRef(null);
const expertReviewsRef = useRef(null);
  const [reviewLikes, setReviewLikes] = useState(getLikesFromStorage());

  const [favorites, setFavorites] = useState([]);
  const [flyingHearts, setFlyingHearts] = useState([]);
 const [currentBirdIndex, setCurrentBirdIndex] = useState(0);

  // Add this near the top of your Destination component, with other useState declarations
const [randomSeasonImages, setRandomSeasonImages] = useState({
  dry: null,
  wet: null,
  wildlife: null,
  displayImage: null
});

const [activityLikes, setActivityLikes] = useState(() => {
  try {
    const stored = localStorage.getItem('safari_activity_likes');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading activity likes from localStorage:', error);
    return {};
  }
});
// Helper function to parse URL and extract country and section
const parseUrlPath = () => {
  const path = window.location.pathname;
  const parts = path.split('/').filter(Boolean); // Remove empty strings
  
  // Expected format: /destinations or /destinations/kenya or /destinations/kenya/parks
  if (parts[0] !== 'destinations') {
    return { country: null, section: 'overview' };
  }
  
  const country = parts[1] || null;
  const section = parts[2] || 'overview';
  
  return { 
    country: country ? country.charAt(0).toUpperCase() + country.slice(1) : null, 
    section 
  };
};

const handleUserPageChange = (pageNumber) => {
  setCurrentUserPage(pageNumber);
  
  // Update URL
  const params = new URLSearchParams(window.location.search);
  params.set('userPage', pageNumber.toString());
  window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
  
  // Scroll to reviews section smoothly
  setTimeout(() => {
    if (userReviewsRef.current) {
      userReviewsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  }, 100);
};
const handleExpertPageChange = (pageNumber) => {
  setCurrentExpertPage(pageNumber);
  
  // Update URL
  const params = new URLSearchParams(window.location.search);
  params.set('expertPage', pageNumber.toString());
  window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
  
  // Scroll to reviews section smoothly
  setTimeout(() => {
    if (expertReviewsRef.current) {
      expertReviewsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  }, 100);
};


// ✅ Load initial state from URL when component mounts
useEffect(() => {
  const { country, section } = parseUrlPath();
  
  if (country) {
    // Check if country exists in our data
    const countryData = COUNTRIES_DATA.find(c => c.name.toLowerCase() === country.toLowerCase());
    
    if (countryData) {
      setSelectedCountry(countryData.name);
      setActiveSection(section);
      setShowMobileMenu(true);
      
      // If on a review section, parse page number from URL
      if (section === 'all-expert-reviews' || section === 'all-user-reviews') {
        const params = new URLSearchParams(window.location.search);
        const page = parseInt(params.get('page') || '1', 10);
        
        if (section === 'all-expert-reviews') {
          setExpertReviewsCurrentPage(page);
        } else {
          setUserReviewsCurrentPage(page);
        }
      }
    }
  }
}, []); // Empty dependency array = runs only once on mount
// ✅ Handle browser back/forward buttons
useEffect(() => {
  const handlePopState = () => {
    const { country, section } = parseUrlPath();
    
    if (country) {
      const countryData = COUNTRIES_DATA.find(c => c.name.toLowerCase() === country.toLowerCase());
      if (countryData) {
        setSelectedCountry(countryData.name);
        setActiveSection(section);
        setShowMobileMenu(true);
        
        // Handle review pagination
        if (section === 'all-expert-reviews' || section === 'all-user-reviews') {
          const params = new URLSearchParams(window.location.search);
          const page = parseInt(params.get('page') || '1', 10);
          
          if (section === 'all-expert-reviews') {
            setExpertReviewsCurrentPage(page);
          } else {
            setUserReviewsCurrentPage(page);
          }
        }
      }
    } else {
      // Back to countries list
      setSelectedCountry(null);
      setActiveSection('overview');
      setShowMobileMenu(true);
    }
  };
  
  window.addEventListener('popstate', handlePopState);
  
  // Cleanup: remove listener when component unmounts
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}, []); // Empty dependency array

// Add this useEffect to set random images once when component mounts or section changes
useEffect(() => {
  if (selectedCountry && activeSection ) {
    const country = COUNTRIES_DATA.find(c => c.name === selectedCountry);
    if (country?.photoGalleries){
      setRandomSeasonImages({
        dry: country.photoGalleries.drySeason[Math.floor(Math.random() * country.photoGalleries.drySeason.length)],
        wet: country.photoGalleries.wetSeason[Math.floor(Math.random() * country.photoGalleries.wetSeason.length)],
        wildlife: country.photoGalleries.wildlife[Math.floor(Math.random() * country.photoGalleries.wildlife.length)],
      displayImage: country.displayImage[Math.floor(Math.random() * country.displayImage.length)],
      
      });
    }
  }
}, [selectedCountry, activeSection]);


  // Handle initial URL on component mount and browser back/forward
// Add this hook to sync URL params with page state
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const userPageParam = params.get('userPage');
  const expertPageParam = params.get('expertPage');
  
  if (userPageParam) {
    const pageNum = parseInt(userPageParam, 10);
    if (!isNaN(pageNum) && pageNum > 0) {
      setCurrentUserPage(pageNum);
    }
  }
  
  if (expertPageParam) {
    const pageNum = parseInt(expertPageParam, 10);
    if (!isNaN(pageNum) && pageNum > 0) {
      setCurrentExpertPage(pageNum);
    }
  }
}, [window.location.search]);

///
// ✅ ADD THIS: Sync parent state with URL changes for pagination
useEffect(() => {
  const syncPageFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const urlPage = parseInt(params.get('page') || '1', 10);
    
 
    
    if (activeSection === 'all-expert-reviews') {
    
      setExpertReviewsCurrentPage(urlPage);
    } else if (activeSection === 'all-user-reviews') {
      
      setUserReviewsCurrentPage(urlPage);
    }
  };

  // Sync whenever section changes or page loads
  syncPageFromUrl();

  // Also handle back/forward browser buttons
  window.addEventListener('popstate', syncPageFromUrl);
  return () => window.removeEventListener('popstate', syncPageFromUrl);
}, [activeSection]); // Runs when section changes

// Inside the Destination component, after other useState declarations
const [galleryModal, setGalleryModal] = useState({
  isOpen: false,
  images: [],
  startIndex: 0,
  title: ''
});


// Helper function to open gallery with specific images
const openGallery = (images, startIndex = 0, title = '') => {
  // Convert simple path array to object format expected by PhotoGalleryModal
  const formattedImages = images.map((path, index) => ({
    url: typeof path === 'string' ? path : path.url,
    caption: typeof path === 'string' ? `${title} - Image ${index + 1}` : path.caption,
    credit: typeof path === 'string' ? '' : path.credit
  }));
  
  setGalleryModal({
    isOpen: true,
    images: formattedImages,
    startIndex,
    title
  });
};


// Helper function to close gallery
const closeGallery = () => {
  setGalleryModal({
    isOpen: false,
    images: [],
    startIndex: 0,
    title: ''
  });
};




const handleReviewLike = (reviewId, currentLikes) => {
  setReviewLikes(prev => {
    const hasLiked = prev[reviewId];
    // Toggle like status - if liked, unlike; if not liked, like
    const newLikes = { ...prev };
    if (hasLiked) {
      delete newLikes[reviewId]; // Unlike
    } else {
      newLikes[reviewId] = true; // Like
    }
    return newLikes;
  });
};

const getReviewLikeCount = (reviewId, originalCount) => {
  const hasLiked = reviewLikes[reviewId];
  return hasLiked ? originalCount + 1 : originalCount;
};

const handleActivityLike = (activityId) => {
  setActivityLikes(prev => {
    const hasLiked = prev[activityId];
    const newLikes = { ...prev };
    if (hasLiked) {
      delete newLikes[activityId];
    } else {
      newLikes[activityId] = true;
    }
    return newLikes;
  });
};

const isActivityLiked = (activityId) => {
  return activityLikes[activityId] === true;
};

useEffect(() => {
  try {
    localStorage.setItem('safari_activity_likes', JSON.stringify(activityLikes));
  } catch (error) {
    console.error('Error saving activity likes to localStorage:', error);
  }
}, [activityLikes]);


useEffect(() => {
  saveLikesToStorage(reviewLikes);
}, [reviewLikes]);

const loadFavorites = () => {
  try {
    const stored = localStorage.getItem('safari_favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
};

const toggleFavorite = (tourId, event) => {
  try {
    let updatedFavorites;

    if (favorites.includes(tourId)) {
      updatedFavorites = favorites.filter(id => id !== tourId);
    } else {
      updatedFavorites = [...favorites, tourId];

      if (event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const heartId = Date.now();
        setFlyingHearts(prev => [...prev, {
          id: heartId,
          startX: rect.left + rect.width / 2,
          startY: rect.top + rect.height / 2
        }]);

        setTimeout(() => {
          setFlyingHearts(prev => prev.filter(h => h.id !== heartId));
        }, 1500);
      }
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('safari_favorites', JSON.stringify(updatedFavorites));
    window.dispatchEvent(new Event('favoritesChanged'));
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
};

useEffect(() => {
  loadFavorites();

  const handleFavoritesChange = () => {
    loadFavorites();
  };

  window.addEventListener('favoritesChanged', handleFavoritesChange);
  return () => window.removeEventListener('favoritesChanged', handleFavoritesChange);
}, []);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

const handleSectionClick = (sectionId) => {
  setActiveSection(sectionId);
  setShowMobileMenu(false);
  setThingsToDoCurrentPage(1);
  
  // Reset pagination when switching sections
  if (sectionId === 'all-expert-reviews') {
    const params = new URLSearchParams(window.location.search);
    const urlPage = parseInt(params.get('page') || '1', 10);
    setExpertReviewsCurrentPage(urlPage);
  } else if (sectionId === 'all-user-reviews') {
    const params = new URLSearchParams(window.location.search);
    const urlPage = parseInt(params.get('page') || '1', 10);
    setUserReviewsCurrentPage(urlPage);
  } else {
    // Reset both review pages when leaving reviews section
    setExpertReviewsCurrentPage(1);
    setUserReviewsCurrentPage(1);
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const countryName = selectedCountry.toLowerCase();
  const newUrl = `/destinations/${countryName}/${sectionId}`;
  window.history.pushState({ country: selectedCountry, section: sectionId }, '', newUrl);
};


const handleBackToCountries = () => {
  setSelectedCountry(null);
  setActiveSection('overview');
  setShowMobileMenu(true);
  setThingsToDoCurrentPage(1);
  setExpertReviewsCurrentPage(1);  // Reset pagination
  setUserReviewsCurrentPage(1);     // Reset pagination
  window.history.pushState({}, '', '/destinations');
};


  const handleShowAllPages = () => {
    setShowMobileMenu(true);
    setActiveSection('overview');
  };

const handleCountrySelect = (countryName) => {
  setSelectedCountry(countryName);
  setActiveSection('overview');
  setShowMobileMenu(true);
  setThingsToDoCurrentPage(1);
    setExpertReviewsCurrentPage(1);  // Add this
  setUserReviewsCurrentPage(1);     // Add this
  const countryNameLower = countryName.toLowerCase();
  const newUrl = `/destinations/${countryNameLower}`;
  window.history.pushState({ country: countryName, section: 'overview' }, '', newUrl);
};


  const handleTourClick = (tourId) => {
    window.location.href = `/tours/${tourId}`;
  };

  const handleViewAllTours = (countryName) => {
    window.location.href = `/tours?search=${countryName.toLowerCase()}`;
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < fullStars
                ? 'fill-yellow-400 text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'fill-yellow-400 text-yellow-400 opacity-50'
                : 'text-slate-600'
            }`}
          />
        ))}
      </div>
    );
  };

 const StarRating = ({ rating }) => {
  const getStarFill = (starPosition) => {
    const difference = rating - starPosition + 1;
    
    if (difference >= 1) {
      // Full star
      return 'fill-yellow-400 text-yellow-400';
    } else if (difference > 0) {
      // Partial star - use gradient
      const percentage = Math.round(difference * 100);
      return `text-yellow-400`;
    } else {
      // Empty star
      return 'text-gray-600';
    }
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const difference = rating - star + 1;
        const percentage = difference > 0 && difference < 1 
          ? Math.round(difference * 100) 
          : null;
        
        return (
          <div key={star} className="relative w-4 h-4">
            {percentage !== null ? (
              <>
                {/* Background empty star */}
                <Star className="w-4 h-4 text-gray-600 absolute" />
                {/* Partial filled star with clip-path */}
                <Star 
                  className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute"
                  style={{
                    clipPath: `inset(0 ${100 - percentage}% 0 0)`
                  }}
                />
              </>
            ) : (
              <Star className={`w-4 h-4 ${getStarFill(star)}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

  const getRandomCountryTours = (countryName, count = 3) => {
    const countryTours = eastAfricaTours.filter(
      tour => tour.location.toLowerCase() === countryName.toLowerCase()
    );

    const shuffled = [...countryTours].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const isMobile = window.innerWidth < 640;
    const maxButtons = isMobile ? 4 : 7;
    const showEllipsis = totalPages > maxButtons;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (isMobile) {
        if (currentPage <= 2) {
          for (let i = 1; i <= Math.min(4, totalPages - 1); i++) pages.push(i);
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 1) {
          pages.push(1);
          pages.push('...');
          for (let i = Math.max(totalPages - 3, 2); i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push('...');
          pages.push(currentPage);
          pages.push('...');
          pages.push(totalPages);
        }
      } else {
        if (currentPage <= 4) {
          for (let i = 1; i <= 5; i++) pages.push(i);
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 3) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
          pages.push('...');
          pages.push(totalPages);
        }
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-12 px-4" data-testid="pagination-container">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2 sm:px-4 py-2 border rounded-lg font-semibold transition-all duration-200 ${
          currentPage === 1
            ? 'border-slate-700 text-slate-600 cursor-not-allowed'
            : 'border-slate-600 text-white hover:bg-slate-700 hover:border-orange-500'
        }`}
        data-testid="button-prev-page"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <div className="flex items-center gap-1 sm:gap-2">
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-1 sm:px-2 text-slate-500">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] sm:min-w-[44px] px-2 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
                currentPage === page
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'border border-slate-600 text-white hover:bg-slate-700 hover:border-orange-500'
              }`}
              data-testid={`button-page-${page}`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-2 sm:px-4 py-2 border rounded-lg font-semibold transition-all duration-200 ${
          currentPage === totalPages
            ? 'border-slate-700 text-slate-600 cursor-not-allowed'
            : 'border-slate-600 text-white hover:bg-slate-700 hover:border-orange-500'
        }`}
        data-testid="button-next-page"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

const ReviewsSection = ({ country, onViewAllExpert, onViewAllUser }) => {
  const [expertExpanded, setExpertExpanded] = useState(false);
  const [userExpanded, setUserExpanded] = useState(false);

  const expertReview = country.reviewsContent.mostHelpfulExpert;
  const userReview = country.reviewsContent.latestUserReview;

    const expertReviewId = `expert-${expertReview.id}`;
  const userReviewId = `user-${userReview.id}`;

  const EXPERT_CHAR_LIMIT = 200;
  const USER_CHAR_LIMIT = 300; // Longer limit for user reviews

  const shouldShowReadMore = (text, limit) => {
    return text && text.length > limit;
  };

  const getTruncatedText = (text, limit) => {
    if (!text || text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  };

  const isReviewLiked = (reviewId) => {
    return reviewLikes[reviewId] === true;
  };

  const getDisplayLikeCount = (reviewId, originalCount) => {
    return isReviewLiked(reviewId) ? originalCount + 1 : originalCount;
  };

const handleLikeClick = (reviewId, currentCount) => {
  handleReviewLike(reviewId, currentCount);
};

   const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === country.name.toLowerCase()
  );
  const totalCountryTours = countryTours.length;


  return (
    <div  className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
      <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
        {/* Ratings Overview Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6">Expert Rating</h3>
            <div className="flex items-center gap-4 mb-6">
              <StarRating rating={Math.round(country.reviewsContent.expertRating.overall)} />
              <span className="text-white font-bold text-3xl">{country.reviewsContent.expertRating.overall}</span>
              <span className="text-gray-400">/5</span>
            </div>
            <div className="space-y-3">
              {Object.entries(country.reviewsContent.expertRating.categories).map(([key, rating]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <StarRating rating={rating} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6">User Rating</h3>
            <div className="flex items-center gap-4 mb-6">
              <StarRating rating={Math.round(country.reviewsContent.userRating.overall)} />
              <span className="text-white font-bold text-3xl">{country.reviewsContent.userRating.overall}</span>
              <span className="text-gray-400">/5</span>
            </div>
            <div className="space-y-3">
              {Object.entries(country.reviewsContent.userRating.categories).map(([key, rating]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <StarRating rating={Math.round(rating)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Reviews */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Most Helpful Expert Review */}
          <div className="flex flex-col">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Most Helpful Expert Review
            </h3>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:shadow-2xl transition-all duration-300 flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {expertReview.author[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-lg mb-1">{expertReview.author}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <img 
                    src={`https://flagcdn.com/w40/${expertReview.countryFlag}.webp`}
                    alt={`${expertReview.country} flag`}
                    className="w-5 h-4 object-cover rounded-sm"
                  />
                  <span>{expertReview.country}</span>
                  <span>•</span>
                  <span>{expertReview.date}</span>
                </div>
                  <p className="text-gray-400 text-xs italic line-clamp-2">{expertReview.credentials}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <StarRating rating={expertReview.rating} />
                <span className="text-white font-bold">{expertReview.rating}/5</span>
              </div>

              <h5 className="text-white font-bold text-lg mb-3">{expertReview.title}</h5>
              <div className="flex flex-col mb-4">
                <p className="text-gray-300 leading-relaxed">
                  {expertExpanded 
                    ? expertReview.fullReview 
                    : getTruncatedText(expertReview.fullReview, EXPERT_CHAR_LIMIT)
                  }
                </p>
                {shouldShowReadMore(expertReview.fullReview, EXPERT_CHAR_LIMIT) && (
                  <button
                    onClick={() => setExpertExpanded(!expertExpanded)}
                    className="text-orange-500 hover:text-orange-400 font-bold text-sm mt-3 transition-colors duration-200 self-start"
                  >
                    {expertExpanded ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50 mt-auto">
               <button
                onClick={() => handleLikeClick(expertReviewId, expertReview.helpful)}
                className={`flex items-center gap-2 transition-colors duration-200 ${
                  isReviewLiked(expertReviewId)
                    ? 'text-orange-500'
                    : 'text-gray-400 hover:text-orange-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isReviewLiked(expertReviewId) ? 'fill-orange-500' : ''}`} />
                <span className="text-sm font-bold">
                  {getDisplayLikeCount(expertReviewId, expertReview.helpful)}
                </span>
              </button>
                <span className="text-gray-400 text-sm">found this helpful</span>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <button
                onClick={() => {
                  onViewAllExpert();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                data-testid="button-all-expert-reviews"
              >
                <Star className="w-5 h-5" />
                All Expert Reviews ({country.reviewsContent.allExpertReviews.length})
              </button>
            </div>
          </div>

          {/* Latest User Review */}
          <div className="flex flex-col">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-500" />
              Latest User Review
            </h3>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:shadow-2xl transition-all duration-300 flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {userReview.author[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-white font-bold text-lg">{userReview.author}</h4>
                    {userReview.verified && (
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded">Verified</span>
                    )}
                  </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <img 
                  src={`https://flagcdn.com/w40/${userReview.countryFlag}.webp`}
                  alt={`${userReview.country} flag`}
                  className="w-5 h-4 object-cover rounded-sm"
                />
                <span>{userReview.country}</span>
                <span>•</span>
                <span>{userReview.date}</span>
              </div>
                  {userReview.tourTaken && (
                    <button
                      onClick={() => {
                        const tourId = userReview.tourId;
                        window.location.href = `/tours/${tourId}`;
                       
                      }}
                      className="text-orange-400 hover:text-orange-300 text-xs mt-1 block text-left transition-colors duration-200 underline"
                    >
                      Tour: {userReview.tourTaken}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <StarRating rating={userReview.rating} />
                <span className="text-white font-bold">{userReview.rating}/5</span>
              </div>

              <h5 className="text-white font-bold text-lg mb-3">{userReview.title}</h5>
              <div className="flex flex-col mb-4 flex-1">
                <p className="text-gray-300 leading-relaxed">
                  {userExpanded 
                    ? userReview.fullReview 
                    : getTruncatedText(userReview.fullReview, USER_CHAR_LIMIT)
                  }
                </p>
                {shouldShowReadMore(userReview.fullReview, USER_CHAR_LIMIT) && (
                  <button
                    onClick={() => setUserExpanded(!userExpanded)}
                    className="text-orange-500 hover:text-orange-400 font-bold text-sm mt-3 transition-colors duration-200 self-start"
                  >
                    {userExpanded ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50 mt-auto">
       <button
        onClick={() => handleLikeClick(userReviewId, userReview.helpful)}
        className={`flex items-center gap-2 transition-colors duration-200 ${
          isReviewLiked(userReviewId)
            ? 'text-orange-500'
            : 'text-gray-400 hover:text-orange-500'
        }`}
      >
        <Heart className={`w-5 h-5 ${isReviewLiked(userReviewId) ? 'fill-orange-500' : ''}`} />
        <span className="text-sm font-bold">
          {getDisplayLikeCount(userReviewId, userReview.helpful)}
        </span>
      </button>
                <span className="text-gray-400 text-sm">found this helpful</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-6">
              <button
                
                onClick={() => {
                  onViewAllUser();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative overflow-hidden px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg text-sm lg:text-base transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                data-testid="button-all-user-reviews"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <Heart className="w-4 h-4 lg:w-5 lg:h-5 relative z-10" />
                <span className="relative z-10">All Reviews ({country.reviewsContent.allUserReviews.length})</span>
              </button>
              <button
                onClick={() => window.location.href = `/write-review`}
                className="group relative overflow-hidden px-6 py-3.5 bg-slate-800 border-2 border-orange-500 text-white hover:bg-orange-500/20 font-bold rounded-lg text-sm lg:text-base transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                data-testid="button-write-review"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-orange-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="text-lg relative z-10">✍️</span>
                <span className="relative z-10">Write a Review</span>
              </button>
            </div>
          </div>
                         {/* Want To Visit [Country] Section - Add to any sidebar page */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {country.name}?
    </h3>
    
    <button
      onClick={() => window.location.href = `/tours?search=${country.name.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {country.name} Safaris
      <ChevronRight className="w-5 h-5" />
    </button>
<div className="space-y-2">
  {sidebarLinks.map((link, index) => (
    <button
      key={index}
      onClick={() => window.location.href = link.url}
      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base transition-colors"
    >
      <ChevronRight className="w-4 h-4" />
      {link.text}
    </button>
  ))}
</div>
  </section>
        </div>
      </div>
    </div>
  );
};

const getSectionHeaderText = (sectionId, countryName) => {
  const textMap = {
    'overview': {
      mainText: countryName,
      subText: 'Overview'
    },
    'parks': {
      mainText: 'National Parks & Reserves',
      subText: `in ${countryName}`
    },
    'things-to-do': {
      mainText: `Best Things To Do in ${countryName}`,
      subText: "Our Expert's Choice"
    },
    'reviews': {
      mainText: 'Safari Reviews',
      subText: `of ${countryName}`
    },
    'all-expert-reviews': {
      mainText: 'Safari Reviews',
      subText: `of ${countryName}`
    },
    'all-user-reviews': {
      mainText: 'Safari Reviews',
      subText: `of ${countryName}`
    },
    'wildlife': {
      mainText: 'Wildlife & Animals',
      subText: `in ${countryName}`
    },
    'birds': {
      mainText: 'Birds & Birding',
      subText: `in ${countryName}`
    },
    'best-time': {
      mainText: 'Best Time To Visit',
      subText: `${countryName} (Month by Month)`
    },
    'weather': {
      mainText: 'Weather & Climate',
      subText: `in ${countryName}`
    },
    'routes': {
      mainText: 'Popular Routes',
      subText: `in ${countryName}`
    },
    'getting-there': {
      mainText: `How To Get to ${countryName}`,
      subText: 'Airports, Visa & Entry Requirements'
    },
    'malaria': {
      mainText: 'Malaria & Vaccinations',
      subText: `${countryName} Travel Advice`
    },
    'safety': {
      mainText: 'Safety & Security',
      subText: `${countryName} Travel Advice`
    }
  };

  return textMap[sectionId] || { mainText: countryName, subText: 'Overview' };
};

  const featuredTours = useMemo(() => {
    if (!selectedCountry) return [];
    return getRandomCountryTours(selectedCountry);
  }, [selectedCountry]); // Only recalculate when country changes

    const sidebarLinks = useMemo(() => {
    if (!selectedCountry) return [];
    const country = COUNTRIES_DATA.find(c => c.name === selectedCountry);
    if (!country?.sidebar_links) return [];
    
    // Shuffle and take first 4
    return [...country.sidebar_links]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [selectedCountry]); // Only recalculate when country changes

  const renderCountryDetail = () => {
    if (!selectedCountry) return null;

    const country = COUNTRIES_DATA.find(c => c.name === selectedCountry);
    if (!country) return null;

    const countryTours = featuredTours;
    const totalCountryTours = eastAfricaTours.filter(tour =>
      tour.location.toLowerCase() === country.name.toLowerCase()
    ).length;

    const sections = {
        overview: ( () => {
  // Add this at the beginning to get real tour count
  const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === country.name.toLowerCase()
  );
  const totalCountryTours = countryTours.length;

  const totalActivities = country.bestTimeToVisitContent.monthlyRatings.length;
  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE);
  const startIndex = (thingsToDoCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return (
        <div id="overview"  className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
          <div className="max-w-[1440px] mx-auto">
            <div className="space-y-8 md:space-y-12">
              <section className="px-4 py-6 lg:p-0">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />
                  Overview
                </h2>

                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6 md:mb-10">
                  {country.overviewContent.overviewText}
                </p>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
  {/* Africa Map with Kenya */}
<button
  onClick={() => openGallery(
    country.photoGalleries?.maps || [],
    0,
    `${country.name} Maps`
  )}
  className="text-center group cursor-pointer"
>


    <div className="w-full h-48 md:h-64 mx-auto rounded-lg mb-3 overflow-hidden flex items-center justify-center relative">
      <img 
        src={country.overviewContent.mediaGallery.map.countryInAfrica}
        alt={`Africa Map with ${country.name} highlighted`}
        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
        <Camera className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
    <span className="text-sm md:text-base font-bold text-white hover:text-orange-500 flex items-center gap-2 mx-auto justify-center">
      <Map className="w-4 h-4" />
     {country.overviewContent.mediaGallery.map.text}
    </span>
  </button>

  {/* View Photos */}
<button
  onClick={() => openGallery(
    country.photoGalleries?.wildlife || [],
    0,
    `${country.name} Wildlife Photos`
  )}
  className="relative w-full overflow-hidden group cursor-pointer"
>


    <div className="w-full h-64 md:h-64 mx-auto md:bg-slate-700/30 rounded-lg mb-3 overflow-hidden relative">
      <img 
        src={country.overviewContent.mediaGallery.photos.thumbnail} 
        alt="Wildlife photos" 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
        <div className="bg-orange-500/90 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
          <Camera className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
    <span className="text-sm md:text-base font-bold text-white hover:text-orange-500 flex items-center gap-2 mx-auto justify-center">
      <Camera className="w-4 h-4" />
      View Photos 
    </span>
  </button>
  
  {/* Kenya Parks Map */}
<button
  onClick={() => openGallery(
    country.photoGalleries?.maps || [],
    1,
    `${country.name} Maps`
  )}
  className="text-center group cursor-pointer"
>


    <div className="w-full h-64 md:h-64 mx-auto md:bg-slate-700/30 rounded-lg mb-3 overflow-hidden relative">
      <img 
        src={country.overviewContent.mediaGallery.map.nationalParks} 
        alt={`${country.name} Parks Map`} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
        <Map className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
    <span className="text-sm md:text-base font-bold text-white hover:text-orange-500 flex items-center gap-2 mx-auto justify-center">
      <Map className="w-4 h-4" />
      Open Map
    </span>
  </button>
</div>




                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 py-6 md:py-8 border-t border-b border-slate-700/50">
                  <div className="flex items-start gap-3 md:gap-4">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1 md:mb-2">Rates (USD)</div>
                      <div className="text-sm md:text-base text-white font-bold">${country.overviewContent.quickInfo.rates.min} to ${country.overviewContent.quickInfo.rates.max} pp/day</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:gap-4">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1 md:mb-2">Best Time To Go</div>
                      <div className="text-sm md:text-base text-gray-300 font-semibold">{country.overviewContent.quickInfo.bestTimeToGo}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:gap-4">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1 md:mb-2">High Season</div>
                      <div className="text-sm md:text-base text-gray-300 font-semibold">{country.overviewContent.quickInfo.highSeason}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:gap-4">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1 md:mb-2">Size</div>
                      <div className="text-sm md:text-base text-gray-300 font-semibold">{country.overviewContent.quickInfo.size}</div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 md:gap-8 px-4 lg:px-0">
                <div className="space-y-6 md:space-y-8">
                  <section>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 pb-4 border-b border-slate-700/50">Pros & Cons</h3>
                    <div className="space-y-3 md:space-y-4">
                      {country.overviewContent.prosAndCons.pros.map((pro, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-green-400 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-400 rounded-full"></div>
                          </div>
                          <span className="text-sm md:text-base text-gray-300 font-medium">{pro}</span>
                        </div>
                      ))}
                      {country.overviewContent.prosAndCons.cons.map((con, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-red-400 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <div className="w-2.5 h-0.5 md:w-3 md:h-0.5 bg-red-400"></div>
                          </div>
                          <span className="text-sm md:text-base text-gray-300 font-medium">{con}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 pb-4 border-b border-slate-700/50">Wildlife</h3>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 font-medium">
                      {country.overviewContent.wildlifePreview.description}
                    </p>
               <button 
                  onClick={() => handleSectionClick('wildlife')}
                  className="text-blue-500 hover:text-blue-400 text-sm md:text-base font-semibold"
                >
                  › {country.overviewContent.wildlifePreview.linkText}
                </button>

                  </section>

                  <section>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 pb-4 border-b border-slate-700/50">Things To Do</h3>
                    <div className="grid gap-4 md:gap-6">
                      {country.overviewContent.thingsToDoPreview.map((activity, idx) => (
                        <div key={idx}>
                          {activity.title && <h4 className="text-white font-bold text-base md:text-lg mb-2">{activity.title}</h4>}
                          <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed">{activity.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 pb-4 border-b border-slate-700/50">Weather & Climate</h3>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 font-medium">
                      {country.overviewContent.weatherPreview.description}
                    </p>
                 <button 
                    onClick={() => handleSectionClick('weather')}
                    className="text-blue-500 hover:text-blue-400 text-sm md:text-base font-semibold"
                  >
                    › {country.overviewContent.weatherPreview.linkText}
                  </button>
                  </section>

                  <section>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 pb-4 border-b border-slate-700/50">Best Time To Visit</h3>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 font-medium">
                      {country.overviewContent.bestTimePreview.description}
                    </p>
                <button 
                  onClick={() => handleSectionClick('best-time')}
                  className="text-blue-500 hover:text-blue-400 text-sm md:text-base font-semibold"
                >
                  › {country.overviewContent.bestTimePreview.linkText}
                </button>
                  </section>
                   {/* Want To Visit [Country] Section - Add to any sidebar page */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {country.name}?
    </h3>
    
    <button
      onClick={() => window.location.href = `/tours?search=${country.name.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {country.name} Safaris
      <ChevronRight className="w-5 h-5" />
    </button>
    <div className="space-y-2">
  {sidebarLinks.map((link, index) => (
    <button
      key={index}
      onClick={() => window.location.href = link.url}
      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base transition-colors"
    >
      <ChevronRight className="w-4 h-4" />
      {link.text}
    </button>
  ))}
</div>
  </section>
                </div>

                <div>
                  <section>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 pb-4 border-b border-slate-700/50">{country.name} Safari Reviews</h3>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Expert Rating</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <StarRating rating={Math.round(country.overviewContent.reviews.expertRating.overall)} />
                          <span className="text-white font-bold text-lg">{country.overviewContent.reviews.expertRating.overall}</span>
                          <span className="text-gray-400 text-sm">({country.reviewsContent.allExpertReviews.length} reviews)</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        {Object.entries(country.overviewContent.reviews.expertRating.categories).map(([key, rating]) => (
                          <div key={key} className="flex items-center justify-between text-center">
                            <span className="text-gray-300 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <div className="flex items-center gap-2">
                              <StarRating rating={rating} />
                              <span className="text-white font-bold w-6">{rating}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">User Rating</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <StarRating rating={Math.round(country.overviewContent.reviews.userRating.overall)} />
                          <span className="text-white font-bold text-lg">{country.overviewContent.reviews.userRating.overall}</span>
                          <span className="text-gray-400 text-sm">({country.reviewsContent.allUserReviews.length} reviews)</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        {Object.entries(country.overviewContent.reviews.userRating.categories).map(([key, rating]) => (
                          <div key={key} className="flex items-center justify-between text-center">
                            <span className="text-gray-300 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <div className="flex items-center gap-2">
                              <StarRating rating={Math.round(rating)} />
                              <span className="text-white font-bold w-6">{rating}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-700/50 pt-6">
                      <div className="mb-4">
                        <span className="text-xs font-bold text-gray-400 uppercase block mb-3">Featured Expert Review</span>
                        <div className="bg-[linear-gradient(135deg,_#4b1160_0%,_#360940_100%)] transition-all duration-500 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                              {country.overviewContent.reviews.featuredExpertReview.author[0]}
                            </div>
                            <div>
                            <div className="text-white font-bold text-sm">{country.overviewContent.reviews.featuredExpertReview.author}</div>
                            <div className="flex items-center gap-2">
                              <img 
                                src={`https://flagcdn.com/w40/${country.overviewContent.reviews.featuredExpertReview.countryFlag}.webp`}
                                alt={`${country.overviewContent.reviews.featuredExpertReview.country} flag`}
                                className="w-5 h-4 object-cover "
                              />
                              <span className="text-white font-bold text-xs">{country.overviewContent.reviews.featuredExpertReview.country}</span>
                            </div>
                            </div>
                          </div>
                          <p className="text-gray-400 text-xs italic mb-3">{country.overviewContent.reviews.featuredExpertReview.credentials}</p>
                          <h4 className="text-white font-bold text-sm mb-2">{country.overviewContent.reviews.featuredExpertReview.title}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <StarRating rating={country.overviewContent.reviews.featuredExpertReview.rating} />
                            <span className="text-white font-bold text-sm">{country.overviewContent.reviews.featuredExpertReview.rating}</span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{country.overviewContent.reviews.featuredExpertReview.excerpt}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase block mb-3">Featured User Reviews</span>
                        <div className="space-y-3">
                          <div className="bg-[linear-gradient(to_right,_#4A00E0_0%,_#5b1be5_40%,_#4A00E0_100%)]  text-gray-100 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {country.overviewContent.reviews.featuredUserReview.author[0]}
                              </div>
                              <div>
                         <div className="text-white font-bold text-sm">{country.overviewContent.reviews.featuredUserReview.author}</div>
                          <div className="flex items-center gap-2 text-xs">
                            <img 
                              src={`https://flagcdn.com/w40/${country.overviewContent.reviews.featuredUserReview.countryFlag}.webp`}
                              alt={`${country.overviewContent.reviews.featuredUserReview.country} flag`}
                              className="w-5 h-4 object-cover "
                            />
                            <span className="text-gray-400">{country.overviewContent.reviews.featuredUserReview.country} · {country.overviewContent.reviews.featuredUserReview.date}</span>
                          </div>
                              </div>
                            </div>
                            <h4 className="text-white font-bold text-sm mb-2">{country.overviewContent.reviews.featuredUserReview.title}</h4>
                            <div className="flex items-center gap-2 mb-2">
                              <StarRating rating={country.overviewContent.reviews.featuredUserReview.rating} />
                              <span className="text-white font-bold text-sm">{country.overviewContent.reviews.featuredUserReview.rating}</span>
                            </div>
                            <p className="text-gray-200 text-sm leading-relaxed">{country.overviewContent.reviews.featuredUserReview.excerpt}</p>
                          </div>

                          {country.overviewContent.reviews.additionalUserReview && (
                            <div className="bg-[linear-gradient(to_right,_#4A00E0_0%,_#5b1be5_40%,_#4A00E0_100%)]  text-gray-100 rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-gray-900  font-bold text-sm">
                                  {country.overviewContent.reviews.additionalUserReview.author[0]}
                                </div>
                                <div>
                                <div className="text-white font-bold text-sm">{country.overviewContent.reviews.additionalUserReview.author}</div>
                                <div className="flex items-center gap-2 text-xs">
                                  <img 
                                    src={`https://flagcdn.com/w40/${country.overviewContent.reviews.additionalUserReview.countryFlag}.webp`}
                                    alt={`${country.overviewContent.reviews.additionalUserReview.country} flag`}
                                    className="w-5 h-4 object-cover "
                                  />
                                  <span className="text-gray-400 font-bold">{country.overviewContent.reviews.additionalUserReview.country} · {country.overviewContent.reviews.additionalUserReview.date}</span>
                                </div>
                                </div>
                              </div>
                              <h4 className="text-white font-bold text-sm mb-2">{country.overviewContent.reviews.additionalUserReview.title}</h4>
                              <div className="flex items-center gap-2 mb-2">
                                <StarRating rating={country.overviewContent.reviews.additionalUserReview.rating} />
                                <span className="text-white  font-bold text-sm">{country.overviewContent.reviews.additionalUserReview.rating}</span>
                              </div>
                              <p className="text-gray-200 text-sm font-bold leading-relaxed">{country.overviewContent.reviews.additionalUserReview.excerpt}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="mt-8">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 pb-4 border-b border-slate-700/50">Premier Parks & Reserves</h3>
                    <ul className="space-y-3 mb-6">
                      {country.overviewContent.premierParks.map((park, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-orange-500 mr-3 text-base font-bold">›</span>
                          <div>
                            <span className="block text-base text-white text-left font-bold">
                              {park.name}
                            </span>
                            {park.type && <span className="text-gray-400 text-sm block">{park.type}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                  
                </div>
              </div>
            </div>
          </div>
          
        </div>
      );
     })() ,

      parks: (
                              () => {
  // Add this at the beginning to get real tour count
  const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === country.name.toLowerCase()
  );
  const totalCountryTours = countryTours.length;

  const totalActivities = country.bestTimeToVisitContent.monthlyRatings.length;
  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE);
  const startIndex = (thingsToDoCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return (
        <div id="parks" className="space-y-6 md:space-y-8 px-4 py-6 lg:p-0">
          <div className="bg-blue-900/50 border border-slate-700/50 rounded-lg p-4 md:p-8 hover:shadow-2xl transition-all duration-300 transform   hover:border-orange-500/30">
            <h2 className="text-xl md:text-2xl font-bold text-orange-500 mb-4 md:mb-6">Premier Parks & Reserves</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-4">
              {country.parksAndReservesContent.premierParks.map((park, idx) => (
                <div key={idx} className="flex items-start gap-2 group">
                  <span className="text-lg md:text-xl mt-0.5 transform group-hover:scale-110 transition-transform duration-200">
                    {park.badge === 'best' ?  
                     <svg 
                    className="w-7 h-7 inline-block fill-orange-500" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.408 18c.498-3.947 5.592-7.197 5.592-17h-14c0 9.803 5.105 13.053 5.604 17h2.804zm-3.614-11.472l1.46-.202.643-1.326.643 1.326 1.46.202-1.063 1.021.26 1.451-1.3-.695-1.3.695.26-1.451-1.063-1.021zm-3.803 4.128c.286.638.585 1.231.882 1.783-4.065-1.348-6.501-5.334-6.873-9.439h4.077c.036.482.08.955.139 1.405h-2.689c.427 2.001 1.549 4.729 4.464 6.251zm10.009 10.963v1.381h-8v-1.381c1.941 0 2.369-1.433 2.571-2.619h2.866c.193 1.187.565 2.619 2.563 2.619zm8-18.619c-.372 4.105-2.808 8.091-6.873 9.438.297-.552.596-1.145.882-1.783 2.915-1.521 4.037-4.25 4.464-6.251h-2.689c.059-.45.103-.923.139-1.405h4.077z"/>
                  </svg>
                   : 
                  <svg 
                    className="w-7 h-7 inline-block fill-orange-500" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 14c2.205 0 4 1.794 4 4s-1.795 4-4 4c-2.207 0-4-1.794-4-4s1.793-4 4-4zm0-2c-3.314 0-6 2.687-6 6s2.686 6 6 6 6-2.687 6-6-2.686-6-6-6zm1.236 6.452l1.264-1.214-1.736-.239-.764-1.577-.764 1.577-1.736.239 1.264 1.214-.309 1.725 1.545-.826 1.543.827-.307-1.726zm-9.578-16.438l-.658.986 5.234 7.946c.355-.19.731-.345 1.116-.48l-5.692-8.452zm11.537.986l3.051-3h-12.539l3.293 3h6.195zm4.699-1.661l-.667-1-6.605 9.692c.437.034.859.112 1.274.213l5.998-8.905zm-15.787.001l5.996 8.903c.397-.097.802-.173 1.219-.208l-6.571-9.66-.644.965zm10.541 9.127c.369.13.73.277 1.073.458l5.279-7.925-.657-.986-5.695 8.453z"/>
                  </svg>
                  
                  }
                  </span>
                  <div className="flex-1">
                    <span className="block text-white font-bold text-left text-base md:text-lg">
                      {park.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm md:text-base">
              <div className="flex items-center gap-2">
               <span className="text-lg md:text-xl">
                    <svg 
                    className="w-8 h-8 inline-block fill-orange-500" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.408 18c.498-3.947 5.592-7.197 5.592-17h-14c0 9.803 5.105 13.053 5.604 17h2.804zm-3.614-11.472l1.46-.202.643-1.326.643 1.326 1.46.202-1.063 1.021.26 1.451-1.3-.695-1.3.695.26-1.451-1.063-1.021zm-3.803 4.128c.286.638.585 1.231.882 1.783-4.065-1.348-6.501-5.334-6.873-9.439h4.077c.036.482.08.955.139 1.405h-2.689c.427 2.001 1.549 4.729 4.464 6.251zm10.009 10.963v1.381h-8v-1.381c1.941 0 2.369-1.433 2.571-2.619h2.866c.193 1.187.565 2.619 2.563 2.619zm8-18.619c-.372 4.105-2.808 8.091-6.873 9.438.297-.552.596-1.145.882-1.783 2.915-1.521 4.037-4.25 4.464-6.251h-2.689c.059-.45.103-.923.139-1.405h4.077z"/>
                  </svg>
              
                </span>
                <span className="text-white font-bold hover:text-orange-500">Best Park (not to be missed)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg md:text-xl hover:text-white">
                  <svg 
                    className="w-8 h-8 inline-block fill-orange-500 " 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 14c2.205 0 4 1.794 4 4s-1.795 4-4 4c-2.207 0-4-1.794-4-4s1.793-4 4-4zm0-2c-3.314 0-6 2.687-6 6s2.686 6 6 6 6-2.687 6-6-2.686-6-6-6zm1.236 6.452l1.264-1.214-1.736-.239-.764-1.577-.764 1.577-1.736.239 1.264 1.214-.309 1.725 1.545-.826 1.543.827-.307-1.726zm-9.578-16.438l-.658.986 5.234 7.946c.355-.19.731-.345 1.116-.48l-5.692-8.452zm11.537.986l3.051-3h-12.539l3.293 3h6.195zm4.699-1.661l-.667-1-6.605 9.692c.437.034.859.112 1.274.213l5.998-8.905zm-15.787.001l5.996 8.903c.397-.097.802-.173 1.219-.208l-6.571-9.66-.644.965zm10.541 9.127c.369.13.73.277 1.073.458l5.279-7.925-.657-.986-5.695 8.453z"/>
                  </svg>
                </span>
                <span className="text-white font-bold hover:text-orange-500">Great Park (worth a detour)</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">All Parks & Reserves</h2>
            <div className="space-y-4">
              {country.parksAndReservesContent.allParks.map((park, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden flex flex-col lg:flex-row hover:shadow-2xl transition-all duration-300 transform  hover:border-orange-500/30"
                >
                  <div className="relative w-full lg:w-72 flex-shrink-0 h-48 lg:h-48 overflow-hidden group">
                    <img
                      src={park.image}
                      alt={park.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    {park.badge && (
                      <div className="absolute top-0 left-4">
                        <div className="relative">
                          <svg width="70" height="75" viewBox="0 0 70 75" className="drop-shadow-lg">
                            <path
                              d="M0 0 L70 0 L70 52 L35 62 L0 52 Z"
                              className="fill-orange-500"
                            />
                          </svg>
                          <div className="absolute top-0 left-0 w-[70px] h-14 flex flex-col items-center justify-center text-center px-2">
                            <span className="text-white font-bold text-sm leading-tight">
                              {park.badge.split(' ')[0]}
                            </span>
                            <span className="text-white font-bold text-sm leading-tight">
                              {park.badge.split(' ')[1]}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 px-4 md:px-6 py-4 md:py-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl md:text-2xl text-orange-500 font-bold mb-2 md:mb-3 text-left">
                        {park.name}
                      </h3>
                      {park.rating && (
                        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 flex-wrap">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 md:w-5 md:h-5 ${
                                  star <= Math.floor(park.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : star <= park.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-400 text-gray-400'
                                }`}
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-gray-300 text-sm md:text-base font-medium">
                            {park.rating} /5 {park.reviewCount && `— ${park.reviewCount}`}
                          </span>
                        </div>
                      )}
                      <p className="text-gray-200 text-sm md:text-[17px] font-semibold leading-relaxed mb-4 md:mb-5">{park.description}</p>
                    </div>
                    {park.links && park.links.length > 0 && (
                      <div className="flex flex-wrap gap-3 md:gap-5 text-sm md:text-base">
                        {park.links.map((link, linkIdx) => (
                          <span
                            key={linkIdx}
                            className="text-blue-300 font-bold"
                          >
                            › {link}
                          </span>
                        ))}
                      </div>
                    )}
                    
                  </div>
                </div>
              ))}
               {/* Want To Visit [Country] Section - Add to any sidebar page */}
 <section className="mt-12 w-full mt-10">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b mt-10 border-slate-700/50">
      Want To Visit {country.name}?
    </h3>
    
    <button
      onClick={() => window.location.href = `/tours?search=${country.name.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {country.name} Safaris
      <ChevronRight className="w-5 h-5" />
    </button>
  <div className="space-y-2">
  {sidebarLinks.map((link, index) => (
    <button
      key={index}
      onClick={() => window.location.href = link.url}
      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base transition-colors"
    >
      <ChevronRight className="w-4 h-4" />
      {link.text}
    </button>
  ))}
</div>
  </section>
            </div>
          </div>
        </div>
      );
     })() ,
      'things-to-do': (() => {
        const totalActivities = country.thingsToDoContent.activities.length;
        const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE);
        const startIndex = (thingsToDoCurrentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentActivities = country.thingsToDoContent.activities.slice(startIndex, endIndex);
      

        return (
          <div id="things-to-do" className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
            <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
              <div className="mb-8">
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                  {country.thingsToDoContent.intro}
                </p>
                <button
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg text-base transition-all duration-300 transform hover:scale-105"
                  data-testid="button-kenya-safaris"
                  onClick={() => window.location.href = `/tours?search=${country.name.toLowerCase()}`}
                >
                 {country.name} Safari Tours ›
                </button>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                {totalActivities} Best Things To Do in {country.name}
              </h2>

              <div className="space-y-12 md:space-y-16">
                {currentActivities.map((activity, idx) => {
                  const activityNumber = startIndex + idx + 1;
                  return (
                    <div key={idx} className="group" data-testid={`activity-${activityNumber}`}>
                    <div className="relative mb-6">
                        <div className="relative h-64 md:h-96 w-full max-w-3xl rounded-lg overflow-hidden">
                          <img
                            src={activity.image}
                            alt={activity.title}
                            loading="lazy"
                            className="w-full h-full object-cover transform transition-transform duration-500"
                          />
                          
                          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-orange-500/50">
                            <span className="text-4xl md:text-3xl font-thin text-orange-500">{activityNumber}</span>
                          </div>

                          {/* Like Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const activityId = `${country.name}-activity-${activityNumber}`;
                              handleActivityLike(activityId);
                              
                              // Flying heart animation
                              const rect = e.currentTarget.getBoundingClientRect();
                              const heartId = Date.now();
                              setFlyingHearts(prev => [...prev, {
                                id: heartId,
                                startX: rect.left + rect.width / 2,
                                startY: rect.top + rect.height / 2
                              }]);
                              setTimeout(() => {
                                setFlyingHearts(prev => prev.filter(h => h.id !== heartId));
                              }, 1500);
                            }}
                            className="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2.5 transition-all duration-300 transform hover:scale-110 shadow-lg group z-10"
                            aria-label="Like this activity"
                          >
                            <Heart
                              className={`w-5 h-5 transition-all duration-300 ${
                                isActivityLiked(`${country.name}-activity-${activityNumber}`)
                                  ? 'text-red-500 fill-current'
                                  : 'text-gray-600 group-hover:text-red-500'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2" data-testid={`text-activity-title-${activityNumber}`}>
                            {activity.title}
                          </h3>
                          <p className="text-base md:text-lg text-gray-400 italic font-medium" data-testid={`text-activity-subtitle-${activityNumber}`}>
                            {activity.subtitle}
                          </p>
                        </div>

                        <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
                          {Array.isArray(activity.description) ? (
                            activity.description.map((paragraph, pIdx) => (
                              <p key={pIdx}>{paragraph}</p>
                            ))
                          ) : (
                            <p>{activity.description}</p>
                          )}
                        </div>

                        {activity.buttons && activity.buttons.length > 0 && (
                          <div className="flex flex-wrap gap-3 md:gap-4 pt-4">
                            {activity.buttons.map((button, btnIdx) => (
                              <button
                                key={btnIdx}
                                onClick={() => window.location.href = button.link}
                                className={`px-5 md:px-6 py-3 rounded-lg font-bold text-sm md:text-base transition-all duration-300 transform hover:scale-105 ${
                                  btnIdx === 0
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                                    : 'border-2 border-blue-600 text-white hover:bg-blue-600/10'
                                }`}
                                data-testid={`button-${button.text.toLowerCase().replace(/\s+/g, '-')}`}
                              >
                                {button.text} ›
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={thingsToDoCurrentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setThingsToDoCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </div>
          </div>
        );
      })() ,
  reviews: (
      <div id="reviews">
      <ReviewsSection 
        country={country} 
        onViewAllExpert={() => setActiveSection('all-expert-reviews')}
        onViewAllUser={() => setActiveSection('all-user-reviews')}
      />
      </div>
    ),
   'all-expert-reviews': (
  <div id="all-expert-reviews" ref={expertReviewsRef}>
    <AllExpertReviews 
      country={country} 
      onBack={() => setActiveSection('reviews')}
      currentPage={expertReviewsCurrentPage}
      setCurrentPage={setExpertReviewsCurrentPage}
    />
  </div>
),
'all-user-reviews': (
  <div id="all-user-reviews" ref={userReviewsRef}>
    <AllUserReviews 
      country={country} 
      onBack={() => setActiveSection('reviews')}
      currentPage={userReviewsCurrentPage}
      setCurrentPage={setUserReviewsCurrentPage}
    />
  </div>
),
    wildlife: (
                () => {
  // Add this at the beginning to get real tour count
  const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === country.name.toLowerCase()
  );
  const totalCountryTours = countryTours.length;

  const totalActivities = country.bestTimeToVisitContent.monthlyRatings.length;
  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE);
  const startIndex = (thingsToDoCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return (
      <div id="wildlife" className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
        <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
              {country.wildlifeContent.description}
            </p>
          </div>

          
    {/* Animal Availability Grid */}
    <div className="bg-white rounded-lg p-6 md:p-8 mb-8">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 md:gap-6 mb-8 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-900 text-base font-bold">Abundant</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span className="text-gray-900 text-base font-bold">Common</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-400"></div>
          <span className="text-gray-900 text-base font-bold">Occasional</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-900 text-base font-bold">Rare</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span className="text-gray-900 text-base font-bold">None</span>
        </div>
      </div>

      {/* Animals Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6">
        {country.wildlifeContent.animals.map((animal, idx) => {
          const statusColors = {
            'Abundant': 'text-green-500',
            'Common': 'text-green-400',
            'Occasional': 'text-orange-400',
            'Rare': 'text-red-500',
            'Very Rare': 'text-red-600',
            'None': 'text-gray-400',
          };

          const statusDotColors = {
            'Abundant': 'bg-green-500',
            'Common': 'bg-green-400',
            'Occasional': 'bg-orange-400',
            'Rare': 'bg-red-500',
            'Very Rare': 'bg-red-600',
            'None': 'text-gray-400',

          };

          return (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="mb-3 relative flex items-center justify-center h-28 md:h-32">
                <img
                  src={`/${animal.icon}`}
                  alt={animal.name}
                  className="max-h-full w-auto object-contain filter brightness-0 opacity-70"
                />
              </div>
              <h4 className="text-gray-800 font-bold text-sm mb-1">{animal.name}</h4>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${statusDotColors[animal.status]}`}></div>
                <span className={`text-xs font-semibold ${statusColors[animal.status]}`}>
                  {animal.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>


          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 mb-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Wildebeest Migration */}
              <section>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
                  {country.wildlifeContent.migration.title}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {country.wildlifeContent.migration.description}
                </p>
              </section>

              {/* Wildlife Highlights */}
              <section>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
                  {country.wildlifeContent.highlights.title}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {country.wildlifeContent.highlights.description}
                </p>
              </section>

              {/* Best Time for Wildlife Viewing */}
              <section>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
                  {country.wildlifeContent.bestTime.title}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {country.wildlifeContent.bestTime.description}
                </p>
              </section>

      {/* Wildlife Rating per Major Park */}
    <section>
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-4 border-b border-slate-700/50">
        Wildlife Rating per Major Park
      </h3>
      <div>
        {country.wildlifeContent.parkRatings.map((park, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-start gap-x-20 py-3 border-b border-slate-700/30 last:border-b-"
          >
            {/* Park Name - Left Side */}
            <span className="text-blue-300 font-bold text-base">
              {park.name}
            </span>
            
            {/* Rating Info - Right Side */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-white font-bold text-lg">{park.rating}</span>
              <span className="text-gray-400 text-base">/5</span>
              <span className="text-gray-500 mx-1">-</span>
              <button className="text-blue-400 hover:text-blue-300 text-base font-semibold transition-colors duration-200">
                {park.reviews} Wildlife Ratings
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>

            {/* Recommended Wildlife Books */}
    <section>
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">Recommended Wildlife Books</h3>
      <div className="space-y-5">
        {country.wildlifeContent.recommendedBooks.map((book, idx) => (
          <div key={idx}>
            <h4 className="text-white font-bold text-base md:text-lg mb-2 italic">
              {book.title} {book.subtitle && <span className="font-normal">{book.subtitle}</span>}
            </h4>
            <p className="text-gray-300 text-base md:text-lg mb-2 leading-relaxed">{book.description}</p>
            <p className="text-gray-400 text-sm md:text-base italic">{book.authors}</p>
          </div>
        ))}
      </div>
    </section>


              
 {/* Want To Visit [Country] Section - Add to any sidebar page */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {country.name}?
    </h3>
    
    <button
      onClick={() => window.location.href = `/tours?search=${country.name.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {country.name} Safaris
      <ChevronRight className="w-5 h-5" />
    </button>
   <div className="space-y-2">
  {sidebarLinks.map((link, index) => (
    <button
      key={index}
      onClick={() => window.location.href = link.url}
      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base transition-colors"
    >
      <ChevronRight className="w-4 h-4" />
      {link.text}
    </button>
  ))}
</div>
  </section>
    </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Wildlife Rating */}
              <section className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6">Wildlife Rating</h3>
                
                {/* Expert Rating */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-400 uppercase">Expert Rating</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={country.wildlifeContent.expertRating.stars} />
                    <span className="text-white font-bold text-xl">{country.reviewsContent.expertRating.overall}</span>
                    <span className="text-gray-400">/5</span>
                  </div>
                  <button 
                    onClick={() => setActiveSection('all-expert-reviews')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors duration-200"
                  >
                    {country.reviewsContent.allExpertReviews.length} Expert Wildlife Reviews
                  </button>
                </div>

                {/* User Rating */}
                <div className="border-t border-slate-700/50 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-400 uppercase">User Rating</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={country.wildlifeContent.userRating.stars} />
                    <span className="text-white font-bold text-xl">{country.reviewsContent.userRating.overall}</span>
                    <span className="text-gray-400">/5</span>
                  </div>
                  <button 
                    onClick={() => setActiveSection('all-user-reviews')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors duration-200"
                  >
                    {country.reviewsContent.allUserReviews.length} User Wildlife Reviews
                  </button>
                </div>
              </section>

            
            {/* Wildlife Photos */}
{/* Wildlife Photos - In the sidebar */}
<button
  onClick={() => openGallery(
    country.photoGalleries?.wildlife || [],
    0,
    `${country.name} Wildlife Photos`
  )}
  className="relative w-full overflow-hidden group cursor-pointer"
>

  <section className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
    <h3 className="text-xl font-bold text-white p-6 pb-4">Wildlife Photos</h3>
    <div className="relative h-64">
      <img
        src={randomSeasonImages.wildlife}
        alt="Wildlife"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/0  transition-colors duration-300 flex items-center justify-center">
        <div className="bg-orange-500/90 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
          <Camera className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
    <div className="p-4">
      <div className="w-full py-3 text-center text-white font-bold">
        <Camera className="w-5 h-5 inline-block mr-2" />
        View Photos 
      </div>
    </div>
  </section>
</button>

            </div>
          </div>
        </div>
      </div>
      
    );
  }) ()  ,
    birds: (
          () => {
  // Add this at the beginning to get real tour count
  const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === country.name.toLowerCase()
  );
  const totalCountryTours = countryTours.length;

  const totalActivities = country.bestTimeToVisitContent.monthlyRatings.length;
  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE);
  const startIndex = (thingsToDoCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return (
      <div id="birds" className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
        <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
              {country.birdsContent.description}
            </p>
          </div>

<section className="mb-12 -mx-4 lg:-mx-8 px-4 lg:px-8 py-12 bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 border-y-4 border-orange-500/30 shadow-2xl">
  <div className="max-w-[1440px] mx-auto">
    <div className="text-center mb-10">
      <div className="inline-block">
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 relative">
          Notable Birds in {country.name}
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
        </h3>
      </div>
      <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
        Discover {country.name}'s most remarkable bird species, from endemic treasures to spectacular migrants
      </p>
    </div>
    
    {/* Desktop Grid - Hidden on mobile */}
    <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
      {country.birdsContent.notableBirds.map((bird, idx) => {
        const allBirdImages = country.birdsContent.notableBirds.map(b => ({
          url: b.image,
          caption: b.name,
          credit: `Status: ${b.status}`
        }));

        return (
          <button
            key={idx}
            onClick={() => openGallery(
              allBirdImages,
              idx,
              `${country.name} Notable Birds`
            )}
            className="relative group cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
          >
            <div className="flex flex-col h-full">
              {/* Fixed height image container */}
              <div className="relative w-48 h-48 md:w-52 md:h-52 rounded-2xl overflow-hidden mb-4 border-4 border-slate-700 group-hover:border-orange-500 shadow-xl group-hover:shadow-orange-500/50 transition-all duration-300 mx-auto">
                <img
                  src={bird.image}
                  alt={bird.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-semibold">Click to view gallery</p>
                  </div>
                </div>
              </div>
              
              {/* Fixed height text container */}
              <div className="flex flex-col items-center text-center flex-grow">
                <h4 className="text-white font-bold text-lg mb-2 group-hover:text-orange-400 transition-colors duration-300 min-h-[3.5rem] flex items-center justify-center px-2">
                  {bird.name}
                </h4>
                <span className="inline-block px-3 py-1 bg-slate-700/80 text-orange-400 text-sm font-semibold rounded-full border border-orange-500/30 mt-auto">
                  {bird.status}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>

    {/* Mobile Carousel - Visible only on small screens */}
    <div className="sm:hidden flex flex-col items-center gap-8">
      {/* Bird Counter */}
      <div className="text-gray-400 text-sm font-semibold">
        {currentBirdIndex + 1} / {country.birdsContent.notableBirds.length}
      </div>

      {/* Carousel Container */}
      <div className="flex items-center justify-center gap-4 w-full">
        {/* Left Arrow */}
        <button
          onClick={() => setCurrentBirdIndex((prev) => 
            prev === 0 ? country.birdsContent.notableBirds.length - 1 : prev - 1
          )}
          className="flex-shrink-0 p-2 rounded-full hover:bg-slate-700/50 transition-colors duration-300 group"
          aria-label="Previous bird"
        >
          <ChevronLeft className="w-8 h-8 text-orange-500 group-hover:text-orange-400 transition-colors" />
        </button>

        {/* Bird Card */}
        <button
          onClick={() => {
            const allBirdImages = country.birdsContent.notableBirds.map(b => ({
              url: b.image,
              caption: b.name,
              credit: `Status: ${b.status}`
            }));
            openGallery(allBirdImages, currentBirdIndex, `${country.name} Notable Birds`);
          }}
          className="relative group cursor-pointer flex-shrink-0"
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative w-56 h-56 rounded-2xl overflow-hidden mb-4 border-4 border-slate-700 group-hover:border-orange-500 shadow-xl group-hover:shadow-orange-500/50 transition-all duration-300">
              <img
                src={country.birdsContent.notableBirds[currentBirdIndex].image}
                alt={country.birdsContent.notableBirds[currentBirdIndex].name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
            <h4 className="text-white font-bold text-xl mb-2 group-hover:text-orange-400 transition-colors duration-300">
              {country.birdsContent.notableBirds[currentBirdIndex].name}
            </h4>
            <span className="inline-block px-3 py-1 bg-slate-700/80 text-orange-400 text-sm font-semibold rounded-full border border-orange-500/30">
              {country.birdsContent.notableBirds[currentBirdIndex].status}
            </span>
          </div>
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => setCurrentBirdIndex((prev) => 
            prev === country.birdsContent.notableBirds.length - 1 ? 0 : prev + 1
          )}
          className="flex-shrink-0 p-2 rounded-full hover:bg-slate-700/50 transition-colors duration-300 group"
          aria-label="Next bird"
        >
          <ChevronRight className="w-8 h-8 text-orange-500 group-hover:text-orange-400 transition-colors" />
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="flex gap-2">
        {country.birdsContent.notableBirds.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentBirdIndex(idx)}
            className={`h-2 transition-all duration-300 ${
              idx === currentBirdIndex ? 'w-8 bg-orange-500' : 'w-2 bg-slate-600 hover:bg-slate-500'
            } rounded-full`}
            aria-label={`Go to bird ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  </div>
</section>


          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 mb-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Endemic & Near-endemic Birds */}
            {/* Endemic & Near-endemic Birds */}
    <section>
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
        {country.birdsContent.endemicBirds.title}
      </h3>
      <p className="text-gray-400 text-sm mb-6 whitespace-pre-line">
        {country.birdsContent.endemicBirds.subtitle}
      </p>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
        {country.birdsContent.endemicBirds.species.map((bird, idx) => (
     <div key={idx} className="flex items-start gap-2">
  <span className="text-orange-500 font-bold">•</span>
  <a
    href={bird.link}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-400 hover:text-blue-300 text-base md:text-lg font-semibold transition-colors duration-200 text-left"
  >
    {bird.name}
  </a>
  <span className="text-gray-500 text-sm">{bird.type? `(${bird.type})` : '' }</span>
</div>

        ))}
      </div>
    </section>


              {/* Other Birding Specials */}
          {/* Other Birding Specials */}
    <section>
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 pb-4 border-b border-slate-700/50">
        {country.birdsContent.otherSpecials.title}
      </h3>
      <p className="text-gray-400 text-sm italic mb-6">
        – {country.birdsContent.otherSpecials.subtitle}
      </p>
<div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
  {country.birdsContent.otherSpecials.species.map((bird, idx) => (
    <div key={idx} className="flex items-start gap-2">
      <span className="text-orange-500 font-bold">•</span>
       <a
        href={bird.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 text-base md:text-lg font-semibold transition-colors duration-200 text-left"
      >
        {bird.name}
      </a>
    </div>
  ))}
</div>
    </section>


              {/* Best Time for Bird Watching */}
              <section>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
                  Best Time for Bird Watching
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {country.birdsContent.bestTimeForBirdWatching.description}
                </p>
              </section>

              {/* Best Parks for Birding */}
              <section>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 pb-4 border-b border-slate-700/50">
                  Best Parks for Birding
                </h3>
                <p className="text-gray-400 text-sm italic mb-6">– Includes Birding Rating</p>
                <p className="text-gray-300 text-base leading-relaxed mb-6">
                  {country.birdsContent.bestParksForBirdingIntro.description}
                </p>
                <div>
                  {country.birdsContent.bestParksForBirding.map((park, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between py-3 border-b border-slate-700/30 last:border-b-0"
                    >
                      <span className="text-blue-300 font-bold text-base">
                        {park.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-bold text-lg">{park.rating}</span>
                        <span className="text-gray-400 text-base">/5</span>
                        <span className="text-gray-500 mx-1">-</span>
                        <button className="text-blue-400 hover:text-blue-300 text-base font-semibold transition-colors duration-200">
                          {park.reviews} Birding Ratings
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recommended Birding Books */}
          {/* Recommended Birding Books */}
    <section>
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">Recommended Birding Books</h3>
      <div className="space-y-5">
        {country.birdsContent.recommendedBooks.map((book, idx) => (
          <div key={idx}>
            <h4 className="text-white font-bold text-base md:text-lg mb-2 italic">
              {book.title} {book.subtitle && <span className="font-normal">{book.subtitle}</span>}
            </h4>
            <p className="text-gray-300 text-base md:text-lg mb-2 leading-relaxed">{book.description}</p>
            <p className="text-gray-400 text-sm md:text-base italic">{book.authors}</p>
          </div>
        ))}
      </div>
    </section>


             
 {/* Want To Visit [Country] Section - Add to any sidebar page */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {country.name}?
    </h3>
    
    <button
      onClick={() => window.location.href = `/tours?search=${country.name.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {country.name} Safaris
      <ChevronRight className="w-5 h-5" />
    </button>
 <div className="space-y-2">
  {sidebarLinks.map((link, index) => (
    <button
      key={index}
      onClick={() => window.location.href = link.url}
      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base transition-colors"
    >
      <ChevronRight className="w-4 h-4" />
      {link.text}
    </button>
  ))}
</div>
  </section>

            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Birding Rating */}
              <section className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6">Birding Rating</h3>
                
                {/* Expert Rating */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-400 uppercase">Expert Rating</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={country.birdsContent.birdingRating.expertRating.stars} />
                    <span className="text-white font-bold text-xl">{country.reviewsContent.expertRating.overall}</span>
                    <span className="text-gray-400">/5</span>
                  </div>
                  <button 
                    onClick={() => setActiveSection('all-expert-reviews')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors duration-200"
                  >
                    {country.reviewsContent.allExpertReviews.length} Expert Birding Reviews
                  </button>
                </div>

                {/* User Rating */}
                <div className="border-t border-slate-700/50 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-400 uppercase">User Rating</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={country.birdsContent.birdingRating.userRating.stars} />
                    <span className="text-white font-bold text-xl">{country.reviewsContent.userRating.overall}</span>
                    <span className="text-gray-400">/5</span>
                  </div>
                  <button 
                    onClick={() => setActiveSection('all-user-reviews')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors duration-200"
                  >
                    {country.reviewsContent.allUserReviews.length} User Birding Reviews
                  </button>
                </div>
              </section>

              {/* Facts & Figures */}
              <section className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6">Facts & Figures</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 flex-shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400 opacity-20">
                        <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1">Bird Species</div>
                      <div className="text-3xl font-bold text-white">{country.birdsContent.factsAndFigures.birdSpecies}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-t border-slate-700/50 pt-6">
                    <div className="w-20 h-20 flex-shrink-0">
                      <Calendar className="w-full h-full text-orange-400 opacity-20" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1">Migratory Birds</div>
                      <div className="text-2xl font-bold text-white">{country.birdsContent.factsAndFigures.migratoryBirds}</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }) ()  ,
   'best-time': (  
    () => {
  // Add this at the beginning to get real tour count
  const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === country.name.toLowerCase()
  );
  const totalCountryTours = countryTours.length;

  const totalActivities = country.bestTimeToVisitContent.monthlyRatings.length;
  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE);
  const startIndex = (thingsToDoCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return (
  <div id="best-time" className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
    <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
      {/* Month Rating Bar */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {country.bestTimeToVisitContent.monthlyRatings.map((item, idx) => {
            const colorClass = {
              'excellent': 'bg-green-600 hover:bg-green-700',
              'good': 'bg-green-500 hover:bg-green-600',
              'fair': 'bg-yellow-500 hover:bg-yellow-600',
              'poor': 'bg-red-500 hover:bg-red-600'
            }[item.rating];
            
            return (
              <button
                key={idx}
                className={`${colorClass} text-white font-bold px-4 py-2 rounded transition-all duration-200 text-sm flex-1 min-w-[70px]`}
              >
                {item.month}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-600"></div>
            <span className="text-gray-300 font-semibold">Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-gray-300 font-semibold">Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-gray-300 font-semibold">Fair</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-gray-300 font-semibold">Poor</span>
          </div>
        </div>
      </div>

      {/* Intro Text */}
      <p className="text-gray-300 text-base leading-relaxed mb-8">
        {country.bestTimeToVisitContent.introText}
      </p>

      {/* Safari Button */}
    <div className="flex justify-start mb-12">
  <button
    onClick={() => handleViewAllTours(country.name)}
    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
  >
    {totalCountryTours} {country.name} Safaris
  </button>
</div>

      
     {/* Key Information Cards - Added hover effect */}
<div className="grid md:grid-cols-2 gap-6 mb-12">
  {country.bestTimeToVisitContent.keyInfo.map((info, idx) => {
    const icons = {
      'calendar': Calendar,
      'users': Globe,
      'umbrella': AlertTriangle,
      'sun': Thermometer,
      'cloud-rain': AlertTriangle
    };
    const Icon = icons[info.icon];
    
    return (
      <div 
        key={idx} 
        className="bg-slate-800/30 border border-slate-700/50 rounded-md p-5 hover:border-orange-500 transition-all duration-300"
      >
        <div className="flex items-start gap-3">
          <Icon className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wide">{info.label}</div>
            <div className="text-white font-bold text-base mb-1.5 leading-snug">{info.title}</div>
            <div className="text-gray-400 text-sm leading-relaxed">{info.subtitle}</div>
          </div>
        </div>
      </div>
    );
  })}
</div>


    {/* Main Content Grid - Updated layout */}
<div className="mb-12">
  {/* Dry Season - Keep in grid */}
  <div className="grid lg:grid-cols-[1fr_400px] gap-8 mb-12">
    <section>
      <h3 className="text-2xl font-bold text-white mb-2">
        {country.bestTimeToVisitContent.drySeasonInfo.title}
      </h3>
      <p className="text-gray-400 text-sm mb-6">– {country.bestTimeToVisitContent.drySeasonInfo.subtitle}</p>
      
      <div className="space-y-3">
        {country.bestTimeToVisitContent.drySeasonInfo.pros.map((pro, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-green-400 flex items-center justify-center mt-0.5 flex-shrink-0">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-gray-300 text-base">{pro}</span>
          </div>
        ))}
        {country.bestTimeToVisitContent.drySeasonInfo.cons.map((con, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-red-400 flex items-center justify-center mt-0.5 flex-shrink-0">
              <div className="w-3 h-0.5 bg-red-400"></div>
            </div>
            <span className="text-gray-300 text-base">{con}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Dry Season Image - Sidebar */}
         <button
          onClick={() => openGallery(
            country.photoGalleries?.drySeason || [],
            0,
            `${country.name} Dry Season`
          )}
          className="relative w-full overflow-hidden group cursor-pointer"
        >
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden h-fit">
            <h3 className="text-xl font-bold text-white p-6 pb-4">Dry Season Photos</h3>
            <div className="relative h-64">
           <img
              src={randomSeasonImages.dry || country.photoGalleries.wetSeason[0]}
              alt="Wet Season"
              className="w-full h-full object-cover transition-transform duration-500"
           />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-orange-500/90 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="w-full py-3 text-center text-blue-500 font-bold hover:text-blue-400">
               
                View Dry Season Photos
              </div>
            </div>
          </div>
        </button>
  </div>

  {/* Wet Season - Keep in grid */}
  <div className="grid lg:grid-cols-[1fr_400px] gap-8 mb-12">
    <section>
      <h3 className="text-2xl font-bold text-white mb-2">
        {country.bestTimeToVisitContent.wetSeasonInfo.title}
      </h3>
      <p className="text-gray-400 text-sm mb-6">– {country.bestTimeToVisitContent.wetSeasonInfo.subtitle}</p>
      
      <div className="space-y-3">
        {country.bestTimeToVisitContent.wetSeasonInfo.pros.map((pro, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-green-400 flex items-center justify-center mt-0.5 flex-shrink-0">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-gray-300 text-base">{pro}</span>
          </div>
        ))}
        {country.bestTimeToVisitContent.wetSeasonInfo.cons.map((con, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-red-400 flex items-center justify-center mt-0.5 flex-shrink-0">
              <div className="w-3 h-0.5 bg-red-400"></div>
            </div>
            <span className="text-gray-300 text-base">{con}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Wet Season Image - Sidebar */}
    <button
          onClick={() => openGallery(
            country.photoGalleries?.wetSeason || [],
            0,
            `${country.name} Wet Season`
          )}
          className="relative w-full overflow-hidden group cursor-pointer"
        >
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden h-fit">
            <h3 className="text-xl font-bold text-white p-6 pb-4">Wet Season Photos</h3>
            <div className="relative h-64">
          <img
 src={randomSeasonImages.wet || country.photoGalleries.drySeason[0]}
  alt="Wet Season"
  className="w-full h-full object-cover transition-transform duration-500"
/>
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-orange-500/90 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="w-full py-3 text-center text-blue-500 font-bold hover:text-blue-400">
             
                View Wet Season Photos
              </div>
            </div>
          </div>
        </button>
  </div>

  {/* Best Time To Go by Major Park - FULL WIDTH from here */}
  <section className="w-full">
    <h3 className="text-2xl font-bold text-white mb-6">Best Time To Go by Major Park</h3>
    <p className="text-gray-300 text-base leading-relaxed mb-6">
   {country.bestTimeToVisitContent.bestTimeToGoByMajorPark}   
    </p>

    {/* Legend */}
    <div className="flex flex-wrap gap-4 justify-end mb-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-green-600"></div>
        <span className="text-gray-300 font-semibold">Excellent</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-green-500"></div>
        <span className="text-gray-300 font-semibold">Good</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
        <span className="text-gray-300 font-semibold">Fair</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-red-500"></div>
        <span className="text-gray-300 font-semibold">Poor</span>
      </div>
    </div>

    {/* Park Ratings */}
    <div className="space-y-4">
      {country.bestTimeToVisitContent.parkByParkRatings.map((park, idx) => (
        <div key={idx} className="bg-slate-800/30 rounded-lg p-4">
          <div className="text-blue-300 font-bold text-base mb-3">
            › {park.name}
          </div>
          <div className="flex flex-wrap gap-2">
            {park.months.map((month, mIdx) => {
              const colorClass = {
                'excellent': 'bg-green-600',
                'good': 'bg-green-500',
                'fair': 'bg-yellow-500',
                'poor': 'bg-red-500'
              }[month.rating];
              
              return (
                <div
                  key={mIdx}
                  className={`${colorClass} text-white font-bold px-3 py-1.5 rounded text-xs flex-1 min-w-[60px] text-center`}
                >
                  {month.month}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </section>

  {/* Want To Visit Section - ALSO FULL WIDTH */}
  <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {country.name}?
    </h3>
    
    <button
      onClick={() => window.location.href = `/tours?search=${country.name.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {country.name} Safaris
      <ChevronRight className="w-5 h-5" />
    </button>
  <div className="space-y-2">
  {sidebarLinks.map((link, index) => (
    <button
      key={index}
      onClick={() => window.location.href = link.url}
      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base transition-colors"
    >
      <ChevronRight className="w-4 h-4" />
      {link.text}
    </button>
  ))}
</div>
  </section>
</div>

    </div>
  </div>
);
}) (),
    weather: (() => {
  // Add this at the beginning to get real tour count
  const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === country.name.toLowerCase()
  );
  const totalCountryTours = countryTours.length;

  const totalActivities = country.bestTimeToVisitContent.monthlyRatings.length;
  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE);
  const startIndex = (thingsToDoCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return (
  <div id="weather" className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
  <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
    {/* Introduction */}
    <div className="mb-8">
      <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
        {country.weatherAndClimateContent.introText}
      </p>
      <button
        onClick={() => handleViewAllTours(country.name)}
        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
      >
        {totalCountryTours} {country.name} Safaris
      </button>
    </div>

    {/* Main Layout: Content on Left, Images on Right */}
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      {/* Left Column: All Content */}
      <div>
        {/* Climate Comparison Section */}
        <section className="mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {country.weatherAndClimateContent.climateComparison.title}
          </h3>
          <p className="text-gray-300 text-base leading-relaxed">
            {country.weatherAndClimateContent.climateComparison.description}
          </p>
        </section>

        {/* Dry Season Content */}
        <section className="mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {country.weatherAndClimateContent.drySeason.title}
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            – {country.weatherAndClimateContent.drySeason.period}
          </p>
          
          <p className="text-gray-300 text-base leading-relaxed mb-6">
            {country.weatherAndClimateContent.drySeason.description}
          </p>
          
          {country.weatherAndClimateContent.drySeason.months.map((month, idx) => (
            <div key={idx} className="mb-4">
              <h4 className="text-white font-bold text-lg mb-2">• {month.title}</h4>
              <p className="text-gray-300 text-base leading-relaxed ml-4">
                – {month.description}
              </p>
            </div>
          ))}
        </section>

        {/* Wet Season Content */}
        <section className="mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {country.weatherAndClimateContent.wetSeason.title}
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            – {country.weatherAndClimateContent.wetSeason.period}
          </p>
          
          <p className="text-gray-300 text-base leading-relaxed mb-6">
            {country.weatherAndClimateContent.wetSeason.description}
          </p>
          
          {country.weatherAndClimateContent.wetSeason.months.map((month, idx) => (
            <div key={idx} className="mb-4">
              <h4 className="text-white font-bold text-lg mb-1">
                • {month.title} {month.subtitle && `– ${month.subtitle}`}
              </h4>
              <p className="text-gray-300 text-base leading-relaxed ml-4">
                – {month.description}
              </p>
            </div>
          ))}
        </section>
      </div>

      {/* Right Column: All Images */}
      <div className="space-y-6 md:space-y-20">
        {/* Map Image */}
        <button
       onClick={() => openGallery(
    country.photoGalleries?.maps || [],
    1,
    `${country.name} Maps`
  )}
          
          className="relative w-full overflow-hidden group cursor-pointer"
        >
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden h-fit">
            <h3 className="text-xl font-bold text-white p-6 pb-4">{country.name} Map</h3>
            <div className="relative h-64">
              <img
                src={country.overviewContent.mediaGallery.map.nationalParks}
                alt="Map"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-orange-500/90 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="w-full py-3 text-center text-blue-500 font-bold">
               
                View Map
              </div>
            </div>
          </div>
        </button>

        {/* Dry Season Image */}
        <button
          onClick={() => openGallery(
            country.photoGalleries?.drySeason || [],
            0,
            `${country.name} Dry Season`
          )}
          className="relative w-full overflow-hidden group cursor-pointer"
        >
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden h-fit">
            <h3 className="text-xl font-bold text-white p-6 pb-4">Dry Season Photos</h3>
            <div className="relative h-64">
                <img
                src={randomSeasonImages.dry || country.photoGalleries.drySeason[0]}
                alt="Dry Season"
                className="w-full h-full object-cover transition-transform duration-500"
                />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-orange-500/90 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="w-full py-3 text-center text-blue-500 font-bold hover:text-blue-400">
             
                View Dry Season Photos
              </div>
            </div>
          </div>
        </button>

        {/* Wet Season Image */}
        <button
          onClick={() => openGallery(
            country.photoGalleries?.wetSeason || [],
            0,
            `${country.name} Wet Season`
          )}
          className="relative w-full overflow-hidden group cursor-pointer"
        >
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden h-fit">
            <h3 className="text-xl font-bold text-white p-6 pb-4">Wet Season Photos</h3>
            <div className="relative h-64">
                <img
                  src={randomSeasonImages.wet || country.photoGalleries.wetSeason[0]} 
                  alt="Wet Season"
                  className="w-full h-full object-cover transition-transform duration-500"
                />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-orange-500/90 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="w-full py-3 text-center text-blue-500 font-bold hover:text-blue-400">
               
                View Wet Season Photos
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>

    {/* Want To Visit Kenya */}
    <section className="mt-12 w-full">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
        Want To Visit {country.name}?
      </h3>
      
      <button
        onClick={() => window.location.href = `/tours?search=${country.name.toLowerCase()}`}
        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
      >
        {totalCountryTours} {country.name} Safaris
        <ChevronRight className="w-5 h-5" />
      </button>
    <div className="space-y-2">
  {sidebarLinks.map((link, index) => (
    <button
      key={index}
      onClick={() => window.location.href = link.url}
      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base transition-colors"
    >
      <ChevronRight className="w-4 h-4" />
      {link.text}
    </button>
  ))}
</div>
    </section>
  </div>
</div>

    );
   })() ,
    routes: (
           () => {
  // Add this at the beginning to get real tour count
  const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === country.name.toLowerCase()
  );
  const totalCountryTours = countryTours.length;

  const totalActivities = country.bestTimeToVisitContent.monthlyRatings.length;
  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE);
  const startIndex = (thingsToDoCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return (
      <div id="routes" className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
        <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
          {/* Header */}
          <div className="mb-8">
<div className="mb-8 mx-auto rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-4xl">
  <img 
    src={country.overviewContent.mediaGallery.map.nationalParks} 
    alt={`${country.name} National Parks Map`}
    className="w-full h-96 md:h-[500px] lg:h-[500px] object-contain"
  />
</div>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-500 mb-6">
              Popular Routes Where Wildlife Viewing Is a Major Part of the Tour
            </h2>
            <p className="text-gray-300 text-base leading-relaxed mb-4">
              {country.popularRoutesContent.introText}
            </p>

          </div>

          {/* Routes */}
          <div className="space-y-12">
            {country.popularRoutesContent.routes.map((route, idx) => (
              <section key={idx}>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {route.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">– {route.duration}</p>
                
                <p className="text-gray-300 text-base leading-relaxed mb-6">
                  {route.description}
                </p>

                {/* Destinations */}
                <div className="mb-6">
                  <h4 className="text-white font-bold text-lg mb-4">Destinations:</h4>
                  <ul className="space-y-4">
                    {route.destinations.map((dest, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold mt-1">•</span>
                        <div>
                          <button className="text-blue-500 hover:text-blue-400 font-bold text-base transition-colors duration-200">
                            {dest.name}
                          </button>
                          <span className="text-gray-300 text-base ml-2">
                            {dest.duration} {dest.description}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Add-ons */}
                {route.addOns.length > 0 && (
                  <div>
                    <h4 className="text-white font-bold text-lg mb-4">Popular add-ons:</h4>
                    <ul className="space-y-3">
                      {route.addOns.map((addon, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2">
                          <span className="text-orange-500 font-bold mt-1">•</span>
                          <div>
                            <button className="text-blue-500 hover:text-blue-400 font-bold text-base transition-colors duration-200">
                              {addon.name}
                            </button>
                            <span className="text-gray-300 text-base ml-2">
                              {addon.description}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>
                         {/* Want To Visit [Country] Section - Add to any sidebar page */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {country.name}?
    </h3>
    
    <button
      onClick={() => window.location.href = `/tours?search=${country.name.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {country.name} Safaris
      <ChevronRight className="w-5 h-5" />
    </button>
   <div className="space-y-2">
  {sidebarLinks.map((link, index) => (
    <button
      key={index}
      onClick={() => window.location.href = link.url}
      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base transition-colors"
    >
      <ChevronRight className="w-4 h-4" />
      {link.text}
    </button>
  ))}
</div>
  </section>
        </div>
      </div>
    ); 
    })(),

'getting-there': (
             () => {
  // Add this at the beginning to get real tour count
  const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === country.name.toLowerCase()
  );
  const totalCountryTours = countryTours.length;

  const totalActivities = country.bestTimeToVisitContent.monthlyRatings.length;
  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE);
  const startIndex = (thingsToDoCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return (
  <div id="getting-there" className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
    <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Main Airport */}
          <section>

            <p className="text-gray-300 text-base leading-relaxed mb-4">
              {country.howToGetThereContent.gettingAround}
            </p>

            <p className="text-gray-300 text-base leading-relaxed mb-6">
              {country.howToGetThereContent.tourOperatorNote}
            </p>

            <button
              onClick={() => handleViewAllTours(country.name)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
            >{totalCountryTours} {country.name} Safaris
            </button>
          </section>

          {/* Flights & Airlines */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
              {country.howToGetThereContent.flightsAndAirlines.title}
            </h3>
            <p className="text-gray-300 text-base leading-relaxed mb-2">
              {country.howToGetThereContent.flightsAndAirlines.description}
            </p>
            <button className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base">
              <ChevronRight className="w-4 h-4" />
              <a 
               href={country.howToGetThereContent.flightsAndAirlines.link}
               target="_blank"
               rel="noopener noreferrer"
              > 
              {country.howToGetThereContent.flightsAndAirlines.bookingLink}
              </a>
            </button>
          </section>

          {/* Domestic Airlines */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
              {country.howToGetThereContent.domesticAirlines.title}
            </h3>
            <p className="text-gray-300 text-base leading-relaxed mb-6 italic">
              {country.howToGetThereContent.domesticAirlines.note}
            </p>

            <p className="text-gray-300 text-base leading-relaxed mb-4">
              Domestic flights can be booked with several carriers:
            </p>

            <ul className="space-y-4">
              {country.howToGetThereContent.domesticAirlines.carriers.map((carrier, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold mt-1">›</span>
                  <div>
                    <a className="text-blue-400 hover:text-blue-300 font-bold text-base transition-colors duration-200"
                      href={carrier.link}
                      target="_blank"
                      rel="noopener noreferrer">
                      {carrier.name}
                    </a>
                    <p className="text-gray-300 text-sm mt-1">
                      {carrier.routes}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Visa Requirements */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
              {country.howToGetThereContent.visaRequirements.title}
            </h3>
            
            <p className="text-gray-300 text-base leading-relaxed mb-6">
              {country.howToGetThereContent.visaRequirements.intro}
            </p>

        <ul className="space-y-3 mb-6">
  {country.howToGetThereContent.visaRequirements.requirements.map((req, idx) => (
    <li key={idx} className="flex items-start gap-2">
      <span className="text-orange-500 font-bold mt-1">›</span>
      <p className="text-gray-300 text-base leading-relaxed">
        {req.split(/(www\.[^\s]+)/g).map((part, i) => 
          part.match(/^www\.[^\s]+$/) ? (
            <a 
              key={i} 
              href={`https://${part}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-orange-300 underline"
            >
              {part}
            </a>
          ) : (
            part
          )
        )}
      </p>
    </li>
  ))}
</ul>


            <div className="space-y-3">
              {country.howToGetThereContent.visaRequirements.embassies.map((embassy, idx) => (
                <div key={idx} className="flex items-start gap-3 ml-6">
                  <span className="text-orange-500 font-bold mt-1">›</span>
                  <div>
                    <span className="text-gray-300 text-base">
                      {embassy.country} {embassy.flag}
                    </span>
                    <span className="text-gray-500 mx-2">–</span>
                    <a className="text-blue-400 hover:text-blue-300 font-semibold text-base transition-colors duration-200"
                     href={embassy.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {embassy.link}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Want To Visit */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {country.name}?
    </h3>
    
    <button
      onClick={() => window.location.href = `/tours?search=${country.name.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {country.name} Safaris
      <ChevronRight className="w-5 h-5" />
    </button>
   <div className="space-y-2">
  {sidebarLinks.map((link, index) => (
    <button
      key={index}
      onClick={() => window.location.href = link.url}
      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base transition-colors"
    >
      <ChevronRight className="w-4 h-4" />
      {link.text}
    </button>
  ))}
</div>
  </section>
        </div>

        {/* Sidebar Map */}
        <div className="lg:sticky lg:top-32 h-fit">
       <button
       onClick={() => openGallery(
    country.photoGalleries?.maps || [],
    1,
    `${country.name} Maps`
  )}
          
          className="relative w-full overflow-hidden group cursor-pointer"
        >
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden h-fit">
            <h3 className="text-xl font-bold text-white p-6 pb-4">{country.name} Map</h3>
            <div className="relative h-64">
              <img
                src={country.overviewContent.mediaGallery.map.nationalParks}
                alt="Map"
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-orange-500/90 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="w-full py-3 text-center text-blue-500 font-bold">
               
                View Map
              </div>
            </div>
          </div>
        </button>
        </div>
      </div>
    </div>
  </div>
);
})(),
malaria: (
   () => {
   // Add this at the beginning to get real tour count
  const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === country.name.toLowerCase()
  );
  const totalCountryTours = countryTours.length;

  const totalActivities = country.bestTimeToVisitContent.monthlyRatings.length;
  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE);
  const startIndex = (thingsToDoCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return (
  <div id="malaria" className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
    <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
      {/* Introduction */}
      <div className="mb-8">
        <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
          {country.malariaAndVaccinationsContent.introText}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 mb-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Vaccinations */}
          <section>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-4 border-b border-slate-700/50">
              {country.malariaAndVaccinationsContent.vaccinations.title}
            </h3>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              {country.malariaAndVaccinationsContent.vaccinations.description}
            </p>
          </section>

          {/* Malaria Risk */}
          <section>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-4 border-b border-slate-700/50">
              {country.malariaAndVaccinationsContent.malariaRisk.title}
            </h3>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              {country.malariaAndVaccinationsContent.malariaRisk.description}
            </p>
          </section>

          {/* More Info */}
          <section>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-4 border-b border-slate-700/50">
              More Info
            </h3>
            <div className="space-y-4">
              {country.malariaAndVaccinationsContent.healthResources.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold mt-1">›</span>
                  <div>
                    <span className="text-gray-300 text-base md:text-lg">
                      {item.country} {item.flag}
                    </span>
                    <span className="text-gray-500 mx-2">–</span>
                    <a className="text-blue-400 hover:text-blue-300 font-semibold text-base md:text-lg transition-colors duration-200"
                     href={item.website}
                     target="_blank"
                     rel="noopener noreferrer">
                      {item.link}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

 {/* Want To Visit [Country] Section - Add to any sidebar page */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {country.name}?
    </h3>
    
    <button
      onClick={() => window.location.href = `/tours?search=${country.name.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {country.name} Safaris
      <ChevronRight className="w-5 h-5" />
    </button>
  <div className="space-y-2">
  {sidebarLinks.map((link, index) => (
    <button
      key={index}
      onClick={() => window.location.href = link.url}
      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base transition-colors"
    >
      <ChevronRight className="w-4 h-4" />
      {link.text}
    </button>
  ))}
</div>
  </section>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:sticky lg:top-32 h-fit space-y-6">
          {/* Health Advisory Card */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-bold text-white">Important Notice</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Always consult with a qualified travel health professional at least 4-6 weeks before your trip for personalized medical advice.
            </p>
          </div>

          {/* Malaria Prevention Card */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Malaria Prevention Tips</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              {country.malariaAndVaccinationsContent.preventionTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold mt-0.5">›</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Vaccinations Card */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recommended Vaccinations</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              {country.malariaAndVaccinationsContent.vaccinations.recommended.map((vac, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>
                    {vac.name} {vac.required && '(required)'} {vac.note && `(${vac.note})`}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-gray-400 text-xs mt-4 italic">
              *Consult your doctor for personalized advice
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
})(),
safety: (
     () => {
   // Add this at the beginning to get real tour count
  const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === country.name.toLowerCase()
  );
  const totalCountryTours = countryTours.length;

  const totalActivities = country.bestTimeToVisitContent.monthlyRatings.length;
  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE);
  const startIndex = (thingsToDoCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return (
  <div id="safety" className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
    <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
      {/* Introduction */}
      <div className="mb-8">
        <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
          {country.safetyContent.overview}
        </p>
        {country.safetyContent.additionalInfo.map((info, idx) => (
          <p key={idx} className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
            {info}
          </p>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 mb-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Wildlife Safety */}
          <section>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
              {country.safetyContent.wildlifeSafety.title}
            </h3>
            <p className="text-gray-300 text-base leading-relaxed mb-4">
              {country.safetyContent.wildlifeSafety.description}
            </p>
            <button className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base transition-colors duration-200">
              
              {country.safetyContent.wildlifeSafety.link}
            </button>
          </section>

          {/* City Safety */}
          <section>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
              {country.safetyContent.citySafety.title}
            </h3>
            <p className="text-gray-300 text-base leading-relaxed mb-4">
              {country.safetyContent.citySafety.description}
            </p>
            <button className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base transition-colors duration-200">
              
              {country.safetyContent.citySafety.link}
            </button>
          </section>

          {/* Other Tips */}
          <section>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
              {country.safetyContent.otherTips.title}
            </h3>
            <p className="text-gray-300 text-base leading-relaxed mb-6">
              {country.safetyContent.otherTips.description}
            </p>
            <div className="space-y-3">
              {country.safetyContent.otherTips.links.map((link, idx) => (
                <button key={idx} className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base transition-colors duration-200">
                  <ChevronRight className="w-4 h-4" />
                  {link}
                </button>
              ))}
            </div>
          </section>

          {/* Travel Advisories */}
          <section>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
              Governments' Travel Advice
            </h3>
            <p className="text-gray-300 text-base leading-relaxed mb-6">
              Please use the links below for Governments' travel advice on {country.name}.
            </p>
            <div className="space-y-4">
              {country.safetyContent.travelAdvisories.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold mt-1">›</span>
                  <div>
                    <span className="text-gray-300 text-base">
                      {item.country} {item.flag}
                    </span>
                    <span className="text-gray-500 mx-2">–</span>
                    <a href={item.website} target='_blank' className="text-blue-400 hover:text-blue-300 font-semibold text-base transition-colors duration-200">
                      {item.link}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

 {/* Want To Visit [Country] Section - Add to any sidebar page */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {country.name}?
    </h3>
    
    <button
      onClick={() => window.location.href = `/tours?search=${country.name.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {country.name} Safaris
      <ChevronRight className="w-5 h-5" />
    </button>
<div className="space-y-2">
  {sidebarLinks.map((link, index) => (
    <button
      key={index}
      onClick={() => window.location.href = link.url}
      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base transition-colors"
    >
      <ChevronRight className="w-4 h-4" />
      {link.text}
    </button>
  ))}
</div>
  </section>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:sticky lg:top-32 h-fit space-y-6">
          {/* Quick Links Card */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Safety Resources</h3>
            <div className="space-y-3">
              <button className="w-full text-left text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors duration-200 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Wildlife Safety Tips
              </button>
              <button className="w-full text-left text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors duration-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                City Safety Guide
              </button>
              <button className="w-full text-left text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors duration-200 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Health Precautions
              </button>
            </div>
          </div>

          {/* Emergency Contacts Card */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Emergency Numbers</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              {country.safetyContent.emergencyContacts.map((contact, idx) => (
                <div key={idx}>
                  <div className="font-bold text-white mb-1">{contact.service}</div>
                  <div>{contact.number}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
})(),

    };

    const currentSectionData = NAVIGATION_SECTIONS.find(s => s.id === activeSection);

    return (
      <div className="min-h-screen bg-slate-900">
<div className="lg:hidden bg-slate-900 px-4 pt-4 pb-2 max-w-full overflow-hidden">
  <button 
    onClick={showMobileMenu ? handleBackToCountries : handleShowAllPages}
    className=" max-w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
    data-testid="button-mobile-nav-toggle"
  >
    <ChevronLeft className="w-5 h-5 flex-shrink-0" />
    <span className="text-base truncate">{showMobileMenu ? 'All Countries & Parks' : `All ${country.name} Pages`}</span>
  </button>
</div>

{/* mobile */}
<div className="lg:hidden relative bg-cover bg-center h-80 overflow-hidden" style={{ backgroundImage: `url(${
         activeSection === 'overview' 
           ? (country.overviewImage || '/lions.webp')
           : (randomSeasonImages.displayImage || country.displayImage[0])
       })`  }}>
  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-slate-900/60"></div>
  <div className="relative h-full flex flex-col justify-end px-4 pb-6">
    {/* Safari Button and Reviews - Mobile Top Right */}
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      <button
        onClick={() => handleViewAllTours(country.name)}
        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-300 text-sm flex items-center gap-2 shadow-lg"
        data-testid="button-header-safaris-mobile"
      >
        {country.name} Safaris
        <ChevronRight className="w-4 h-4" />
      </button>
      
    </div>

    <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
      {getSectionHeaderText(activeSection, country.name).mainText}
    </h1>
    <p className="text-orange-400 font-semibold text-lg drop-shadow-lg">
      – {getSectionHeaderText(activeSection, country.name).subText}
    </p>
  </div>
</div>

{/* Photo Gallery Modal - NOW AVAILABLE FOR ALL SCREEN SIZES */}
<PhotoGalleryModal
  isOpen={galleryModal.isOpen}
  onClose={closeGallery}
  images={galleryModal.images}
  startIndex={galleryModal.startIndex}
  title={galleryModal.title}
/>
<div className="hidden lg:block relative w-full bg-slate-900">
  <div className="max-w-[1440px] mx-auto">
    {/* desktop */}
  <div className="relative bg-cover bg-center h-72 md:h-80" style={{ backgroundImage: `url(${
         activeSection === 'overview' 
           ? (country.overviewImage || '/lions.webp')
           : (randomSeasonImages.displayImage || country.displayImage[0])
       })`  }}>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 to-slate-900/40"></div>
      <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 h-full">
        <div className="pt-8 md:pt-12 pb-6 ml-64 xl:ml-72">
          {/* Back button - Top Left */}
          <div className="absolute top-8 left-8">
            <button onClick={handleBackToCountries} className="flex items-center gap-2 text-white hover:text-orange-500 transition-colors duration-200" data-testid="button-back-to-countries">
              <ChevronLeft className="w-5 h-5" />
              <span className="font-bold text-sm md:text-base">Back to Countries</span>
            </button>
          </div>
          
          {/* Safari Button and Reviews - Top Right */}
          <div className="absolute top-8 right-8 flex flex-col gap-3">
            <button
              onClick={() => handleViewAllTours(country.name)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              data-testid="button-header-safaris"
            >
              {country.name} Safaris
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => handleSectionClick('reviews')}
              className="px-6 py-3 bg-slate-800/90 backdrop-blur-sm border-2 border-orange-500 text-white hover:scale-105  font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              data-testid="button-header-reviews"
            >
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span>{country.reviewsContent.userRating.overall}</span>
              <span className="text-gray-300">- {country.reviewsContent.allUserReviews.length} Reviews</span>
            </button>
          </div>

          {/* Title and Subtitle - Repositioned */}
          <div className="absolute bottom-8 left-8 ml-64 xl:ml-72">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
              {getSectionHeaderText(activeSection, country.name).mainText}
            </h1>
            <p className="text-white font-semibold text-base md:text-lg">
              – {getSectionHeaderText(activeSection, country.name).subText}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>




        {showMobileMenu ? (
          <div className="lg:hidden bg-slate-800/90 border-b border-slate-700/50">
            <nav className="pb-2">
              {NAVIGATION_SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 border-b border-slate-700/30 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                        : 'text-white hover:bg-slate-700/30'
                    }`}
                    data-testid={`button-nav-${section.id}`}
                  >
                    <span className="text-base font-semibold">{section.label}</span>
                    <ChevronLeft className="w-5 h-5 rotate-180" />
                  </button>
                );
              })}
            </nav>
          </div>
        ) : (
          <div className="lg:hidden">
            <main className="pb-20">
              {sections[activeSection]}
            </main>
            <div className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700/50 p-4 z-40">
              <button
                onClick={() => handleViewAllTours(country.name)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-4 rounded-lg font-bold text-base hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                data-testid="button-view-all-tours-mobile"
              >
                {totalCountryTours} {country.name} Safaris
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

<div className="hidden lg:block max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-8">
  <div className="grid lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr] gap-4 md:gap-6 relative">
 <aside className="z-10" style={{ marginTop: '-170px' }}>
  <div className="lg:sticky lg:top-36">
              <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-700/50 overflow-hidden shadow-2xl">
  <div className="bg-slate-900/95 px-3 md:px-4 py-2 md:py-3">

                    <h2 className="text-white font-bold text-lg md:text-xl">{country.name}</h2>
                  </div>
                  <nav className="py-2">
                    {NAVIGATION_SECTIONS.map((section) => {
                      const Icon = section.icon;
                      return (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className={`w-full flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-3 text-left transition-all duration-200 ${
                        activeSection === section.id || 
                        (section.id === 'reviews' && (activeSection === 'all-expert-reviews' || activeSection === 'all-user-reviews'))
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                          : 'text-white hover:bg-slate-700/30'
                      }`}
                      data-testid={`button-sidebar-${section.id}`}
                    >
                         <Icon className="w-4 h-4 flex-shrink-0" />
<span className="text-xs md:text-sm font-bold">{section.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                  <div className="p-4 md:p-5 border-t border-slate-700/50">
                    <button onClick={() => { window.location.href = `/contact` } } className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 md:px-5 py-3 md:py-4 rounded-lg font-bold text-sm md:text-base hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105" data-testid="button-request-quote">
                      Request a Quote
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            <main>
              {sections[activeSection]}
            </main>
          </div>

          {countryTours.length > 0  && (
              <section className="bg-slate-800/30 py-10 md:py-12 mt-12 -mx-4 md:-mx-8 lg:-mx-0 lg:ml-[calc(-50vw+720px)] lg:mr-[calc(-50vw+720px)] lg:px-[calc(50vw-720px)]">
                <div className="max-w-[1440px]">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Featured {country.name} Safaris</h3>

                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    {countryTours.map((tour) => (
                      <div
                        key={tour.id}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform  border border-white/10 flex flex-col cursor-pointer"
                        onClick={() => handleTourClick(tour.id)}
                        data-testid={`card-tour-${tour.id}`}
                      >
                        <div className="relative overflow-hidden h-56 md:h-64 flex-shrink-0">
                          <img
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            alt={tour.title}
                            src={tour.link}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
  
  {/* Heart Button - Add this */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      toggleFavorite(tour.id, e);
    }}
    className="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2.5 transition-all duration-300 transform hover:scale-110 shadow-lg group z-10"
  >
    <Heart
      className={`w-5 h-5 transition-all duration-300 ${
        favorites.includes(tour.id)
          ? 'text-red-500 fill-current'
          : 'text-gray-600 group-hover:text-red-500'
      }`}
    />
  </button>
                        </div>

                       <div className="p-4 md:p-5 flex flex-col flex-1">
                          <h4 className="text-xl md:text-2xl font-bold text-white mb-4 line-clamp-2 hover:text-orange-400 transition-colors">
                            {tour.title}
                          </h4>

                          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                            <div className="flex items-center text-sm md:text-base text-gray-300">
                              <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2 text-orange-400 flex-shrink-0" />
                              <span className="truncate font-semibold">{tour.location}</span>
                            </div>

                            <div className="flex items-center text-sm md:text-base text-gray-300">
                              <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 text-orange-400 flex-shrink-0" />
                              <span className="truncate font-semibold">{tour.duration}</span>
                            </div>
                          </div>

                          {tour.pricePerPerson && (
                            <div className="flex items-center justify-between mb-4 bg-slate-900/50 rounded-lg p-3">
                              <div className="flex items-center text-lg md:text-xl text-green-400 font-bold">
                                <DollarSign className="w-5 h-5 md:w-6 md:h-6 mr-1 flex-shrink-0" />
                                <span>${tour.pricePerPerson}/person</span>
                              </div>

                              {tour.rating && (
                                <div className="flex flex-col items-end">
                                  <div className="flex items-center gap-1">
                                    <div className="flex gap-0.5">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`w-3 h-3 md:w-4 md:h-4 ${
                                            star <= tour.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-white font-bold text-sm md:text-base ml-1">{tour.rating}</span>
                                  </div>
                                  <span className="text-gray-400 text-xs mt-0.5">({tour.reviews} reviews)</span>
                                </div>
                              )}
                            </div>
                          )}

                          <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-3 mb-4 flex-1 font-medium">
                            {tour.description}
                          </p>

                          <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 md:py-3.5 rounded-xl text-sm md:text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2" data-testid={`button-tour-details-${tour.id}`}>
                            View Details
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => handleViewAllTours(country.name)}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 md:py-4 px-6 md:px-10 rounded-xl text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 w-full sm:w-auto justify-center"
                      data-testid="button-view-all-tours-desktop"
                    >
                      All {totalCountryTours} {country.name} Safaris
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </section>
          )}
        </div>

        {!showMobileMenu && countryTours.length > 0 && (
          <section className="lg:hidden bg-slate-900 px-4 py-8">
            <div className="max-w-[1440px] mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6">Featured {country.name} Safaris</h3>

              <div className="grid gap-6 mb-8">
                {countryTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform  border border-white/10 flex flex-col cursor-pointer"
                    onClick={() => handleTourClick(tour.id)}
                    data-testid={`card-tour-mobile-${tour.id}`}
                  >
                    <div className="relative overflow-hidden h-56 flex-shrink-0">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        alt={tour.title}
                        src={tour.link}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
  
  {/* Heart Button - Add this */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      toggleFavorite(tour.id, e);
    }}
    className="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2.5 transition-all duration-300 transform hover:scale-110 shadow-lg group z-10"
  >
    <Heart
      className={`w-5 h-5 transition-all duration-300 ${
        favorites.includes(tour.id)
          ? 'text-red-500 fill-current'
          : 'text-gray-600 group-hover:text-red-500'
      }`}
    />
  </button>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h4 className="text-xl font-bold text-white mb-4 line-clamp-2 hover:text-orange-400 transition-colors">
                        {tour.title}
                      </h4>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center text-sm text-gray-300">
                          <MapPin className="w-4 h-4 mr-2 text-orange-400 flex-shrink-0" />
                          <span className="truncate font-semibold">{tour.location}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-300">
                          <Calendar className="w-4 h-4 mr-2 text-orange-400 flex-shrink-0" />
                          <span className="truncate font-semibold">{tour.duration}</span>
                        </div>
                      </div>

                      {tour.pricePerPerson && (
                        <div className="flex items-center justify-between mb-4 bg-slate-900/50 rounded-lg p-3">
                          <div className="flex items-center text-lg text-green-400 font-bold">
                            <DollarSign className="w-5 h-5 mr-1 flex-shrink-0" />
                            <span>${tour.pricePerPerson}/person</span>
                          </div>

                          {tour.rating && (
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-1">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-3 h-3 ${
                                        star <= tour.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-white font-bold text-sm ml-1">{tour.rating}</span>
                              </div>
                              <span className="text-gray-400 text-xs mt-0.5">({tour.reviews} reviews)</span>
                            </div>
                          )}
                        </div>
                      )}

                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4 flex-1 font-medium">
                        {tour.description}
                      </p>

                      <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => handleViewAllTours(country.name)}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-xl text-base transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 w-full sm:w-auto justify-center"
                  data-testid="button-view-all-safaris-mobile"
                >
                  All {totalCountryTours} {country.name} Safaris
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-28 lg:bottom-8 right-4 lg:right-8 z-50 group"
            data-testid="button-scroll-top"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>

              <div className="relative bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-full p-2.5 lg:p-4 shadow-2xl border border-orange-400/30 backdrop-blur-sm transition-all duration-300">
                <div className="absolute inset-1 bg-gradient-to-r from-orange-300/20 to-red-400/20 rounded-full"></div>

                <ChevronUp className="w-5 h-5 lg:w-6 lg:h-6 text-white relative z-10 group-hover:animate-bounce" />

                <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap backdrop-blur-sm">
                Back to top
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
              </div>
            </div>
          </button>
        )} */}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {flyingHearts.map(heart => {
  const headerElement = document.querySelector('header');
  const favoritesButton = headerElement?.querySelector('[class*="My Favorites"]')?.parentElement ||
                          headerElement?.querySelector('button[class*="Heart"]');

  let endX = window.innerWidth / 2;
  let endY = 80;

  if (favoritesButton) {
    const rect = favoritesButton.getBoundingClientRect();
    endX = rect.left + rect.width / 2;
    endY = rect.top + rect.height / 2;
  }

  return (
    <div
      key={heart.id}
      className="fixed pointer-events-none z-[100]"
      style={{
        left: 0,
        top: 0,
        animation: `flyToFavorites 1.2s ease-out forwards`
      }}
    >
      <Heart className="w-8 h-8 text-red-500 fill-current drop-shadow-lg" />
    </div>
  );
})}
      {selectedCountry ? (
        renderCountryDetail()
      ) : (
        <>
          <section className="relative bg-cover bg-center  h-80 md:h-80" style={{ backgroundImage: "url('/kenyaWet17.webp')" }}>
            <div className="absolute inset-0 bg-slate-900 bg-opacity-80"></div>
            <div className="relative h-full flex flex-col justify-center">
              <div className="w-full max-w-[1440px] mx-auto px-4 md:px-9 ">
                <div className="max-w-4xl">
                  <p className="text-orange-500 font-bold mb-2 md:mb-3 text-xs md:text-sm"></p>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-white">
                   Africa’s Finest Safari Destinations,  <span className="block text-orange-500 mt-1">Expertly Curated</span>
                  </h1>
                  <p className="text-gray-300 text-base md:text-xl leading-relaxed">
                  Journey across Africa’s most iconic and emerging safari countries with Karla Safari Adventures. We specialize in immersive wildlife safaris, luxury lodge experiences, and authentic cultural encounters across Kenya, Tanzania, Uganda, Rwanda, South Africa, and beyond.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="lg:hidden bg-slate-800 border-b border-slate-700/50">
            <div className="flex">
              <button
                onClick={() => setActiveTab('countries')}
                className={`flex-1 py-4 px-4 font-bold text-sm transition-all duration-200 ${
                  activeTab === 'countries'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                data-testid="button-tab-countries"
              >
                Countries
              </button>
              <button
                onClick={() => setActiveTab('parks')}
                className={`flex-1 py-4 px-4 font-bold text-sm transition-all duration-200 ${
                  activeTab === 'parks'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                data-testid="button-tab-parks"
              >
                Parks & Reserves
              </button>
            </div>
          </div>

          {activeTab === 'countries' && (
            <>
              <section className="lg:hidden bg-slate-800 border-b border-slate-700/50 py-4 px-4">
                <h2 className="text-xl font-bold text-center text-white">Top-rated Safari Countries</h2>
              </section>

              <div className="lg:hidden bg-slate-900 px-4 py-6 space-y-4">
                {COUNTRIES_DATA.map((country, index) => (
                  <div
                    key={index}
                    onClick={() => handleCountrySelect(country.name)}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform  hover:border-orange-500/30"
                    data-testid={`card-country-mobile-${country.name.toLowerCase()}`}
                  >
                    <div className="relative h-48 overflow-hidden group">
                      <img
                        src={country.thumbnailImage}
                        alt={country.name}
                        loading="lazy"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-4">
                      <div className="mb-3">
                        <h2 className="text-xl font-bold text-white mb-2">{country.name}</h2>
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                          {renderStars(country.rating)}
                          <span className="font-bold text-white text-base">{country.rating}</span>
                          <span className="text-gray-400 text-sm">/5</span>
                          <span className="text-gray-500">-</span>
                          <button className="text-white hover:text-orange-500 font-bold text-sm transition-colors duration-200">{country.reviewsContent.allUserReviews.length} Reviews</button>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm leading-relaxed mb-4">{country.description}</p>

                      <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                            setTimeout(() => {
                                window.scrollTo(0, 0);   
                              }, 0);
                            handleCountrySelect(country.name);
                          }}
                          
                          className="px-4 py-2 border-2 border-orange-500 text-white hover:bg-orange-500/10 font-bold rounded text-sm w-full text-center transition-all duration-300 transform hover:scale-105"
                          data-testid={`button-more-about-${country.name.toLowerCase()}`}
                        >
                          More About {country.name}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewAllTours(country.name);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded text-sm w-full text-center hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
                          data-testid={`button-view-tours-${country.name.toLowerCase()}`}
                        >
                          View {country.name} Tours
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'parks' && (
            <>
              <section className="lg:hidden bg-slate-800 border-b border-slate-700/50 py-4 px-4">
                <h2 className="text-xl font-bold text-white">Discover All Major Parks & Reserves</h2>
                <p className="text-gray-400 text-sm mt-1">In each country</p>
              </section>

              <div className="lg:hidden bg-slate-900 px-4 py-6 space-y-3">
                {COUNTRIES_DATA.map((country, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleCountrySelect(country.name);
                      setActiveSection('parks');
                    }}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:border-orange-500/30 flex items-center justify-between"
                    data-testid={`button-parks-${country.name.toLowerCase()}`}
                  >
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-white mb-1">{country.name}</h3>
                      <p className="text-orange-500 text-sm font-semibold">{country.totalParks} Parks & Reserves</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-orange-500 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </>
          )}

          <section className="hidden lg:block bg-slate-800 border-b border-slate-700/50 py-6 md:py-8">
            <div className="w-full max-w-[1440px] mx-auto px-4 md:px-9 text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Top-rated Safari Countries</h2>
            </div>
          </section>

          <div className="hidden lg:block bg-slate-900">
            <div className="w-full max-w-[1440px] mx-auto px-4 md:px-9 py-8 md:py-12 space-y-6 md:space-y-8">
              {COUNTRIES_DATA.map((country, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform  hover:border-orange-500/30"
                  data-testid={`card-country-desktop-${country.name.toLowerCase()}`}
                >
                  <div className="grid lg:grid-cols-[1fr_320px]">
                    <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
                      <div className="relative h-56 md:h-auto overflow-hidden group">
                        <img
                          src={country.thumbnailImage}
                          alt={country.name}
                          loading="lazy"
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-4 md:p-8">
                        <div className="mb-4 md:mb-6">
                          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">{country.name}</h2>
                          <div className="flex items-center gap-2 md:gap-3 text-sm flex-wrap">
                            {renderStars(country.rating)}
                            <span className="font-bold text-white text-base md:text-lg">{country.rating}</span>
                            <span className="text-gray-400 text-sm md:text-base">/5</span>
                            <span className="text-gray-500">-</span>
                            <button className="text-white hover:text-orange-500 font-bold text-sm md:text-base transition-colors duration-200">{country.reviewsContent.allUserReviews.length} Reviews</button>
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 md:mb-6">{country.description}</p>

                        <div className="bg-slate-900/50 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                            <div className="flex items-start gap-3 md:gap-4">
                              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-orange-500 flex-shrink-0" />
                              <div>
                                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Rates (USD)</div>
                                <div className="text-sm md:text-base text-white font-bold">${country.rates.min} to ${country.rates.max} pp/day</div>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 md:gap-4">
                              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-orange-500 flex-shrink-0" />
                              <div>
                                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Best Time To Go</div>
                                <div className="text-sm md:text-base text-gray-300 font-semibold">{country.bestTime}</div>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 md:gap-4">
                              <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-500 flex-shrink-0" />
                              <div>
                                <div className="text-xs font-bold text-gray-400 uppercase mb-1">High Season</div>
                                <div className="text-sm md:text-base text-gray-300 font-semibold">{country.highSeason}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                          <button
                             onClick={() => {
                                setTimeout(() => {
                                    window.scrollTo(0, 0);
                                  }, 0);
                            handleCountrySelect(country.name);
                          }}
                            className="px-4 md:px-6 py-2 md:py-3 border-2 border-orange-500 text-white hover:bg-orange-500/10 font-bold rounded text-sm md:text-base w-full sm:w-auto text-center transition-all duration-300 transform hover:scale-105"
                            data-testid={`button-desktop-more-about-${country.name.toLowerCase()}`}
                          >
                            More About {country.name}
                          </button>
                          <button
                            onClick={() => handleViewAllTours(country.name)}
                            className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded text-sm md:text-base w-full sm:w-auto text-center hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
                            data-testid={`button-desktop-view-tours-${country.name.toLowerCase()}`}
                          >
                            View {country.name} Tours
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800/40 border-t lg:border-t-0 lg:border-l border-slate-700/50 p-4 md:p-8">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">{country.name} Parks & Reserves</h3>
                      <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                        {country.parksAndReservesContent.premierParks.map((park, parkIndex) => (
                          <li key={parkIndex} className="flex items-start">
                            <span className="text-orange-500 mr-2 md:mr-3 text-sm md:text-base font-bold">›</span>
                            <span className="text-sm md:text-base text-white text-left font-bold">
                              {park.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <button onClick={() => window.location.href = getCountryAllParksPath(country)} className="w-full px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded flex items-center justify-center gap-2 text-sm md:text-base hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105" data-testid={`button-all-parks-${country.name.toLowerCase()}`}>
                        All {country.totalParks} Parks & Reserves <span className="text-lg md:text-xl">›</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}


    </div>
  );
}

export default Destination;
