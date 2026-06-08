import { useState, useEffect,useRef,useMemo  } from 'react';
import { Shield, Heart, Globe, DollarSign, Calendar, Clock, ChevronLeft, MapPin, Thermometer, AlertTriangle, Plane, Camera, Menu, X, Star, Map, Route, ArrowRight, ChevronUp, ChevronRight, Mountain, Share2 } from 'lucide-react';
import { eastAfricaTours } from '../lib/tourData';
import { COUNTRIES_DATA } from '../lib/countriesData';
import { findParkBySlug, findParkInCountryData, getParkPath, getParkSectionSlug, slugifyParkName } from '../lib/parkRoutes';
import { PARKS_DATA } from '../lib/parksData';
import { getBirdImagePath } from '../lib/birdImageMap';
import { shareImageToSocial } from '../lib/shareImage';

const DEFAULT_IMAGE_FALLBACK = '/safariHero.jfif';
const BIRD_IMAGE_FALLBACK = '';

const setImageFallback = (event, fallback = DEFAULT_IMAGE_FALLBACK) => {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  if (!fallback) {
    image.removeAttribute('src');
    image.classList.add('hidden');
    return;
  }
  image.src = fallback;
};

const getBirdDisplayImage = (bird) => getBirdImagePath(bird?.name, '');

const BirdImagePlaceholder = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-center px-4">
    <Camera className="w-9 h-9 text-orange-400 mb-3" />
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
      Exact bird photo coming soon
    </span>
  </div>
);

// Gallery modal kept near the top; park data now lives in ../lib/parksData.
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
            {currentImage.url ? (
              <img
                src={currentImage.url}
                alt={currentImage.caption || `Image ${currentIndex + 1}`}
                onError={(event) => setImageFallback(event, currentImage.fallback ?? DEFAULT_IMAGE_FALLBACK)}
                className="w-full h-full object-fill"
              />
            ) : (
              <BirdImagePlaceholder />
            )}
            
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
                  className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-15 md:h-15 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    idx === currentIndex
                      ? 'border-orange-500 scale-105 md:scale-110 shadow-lg shadow-orange-500/50 ring-2 ring-orange-400/30'
                      : 'border-slate-600 opacity-50 hover:opacity-100 hover:border-orange-400/50 active:scale-95'
                  }`}
                >
                  {img.url ? (
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      onError={(event) => setImageFallback(event, img.fallback ?? DEFAULT_IMAGE_FALLBACK)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BirdImagePlaceholder />
                  )}
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





// Add these BEFORE the line: function ParkDetail() {
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

const NAVIGATION_SECTIONS = [
  { id: 'overview', label: 'Overview', icon: Globe },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'wildlife', label: 'Wildlife', icon: Camera },
  { id: 'birds', label: 'Birds', icon: Camera },
  { id: 'best-time', label: 'Best Time To Visit', icon: Calendar },
  { id: 'weather', label: 'Weather & Climate', icon: Thermometer },
  { id: 'getting-there', label: 'How To Get There', icon: Plane },
  { id: 'malaria', label: 'Malaria & Safety', icon: AlertTriangle },
];


function ParkDetail() {
  const [selectedPark, setSelectedPark] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState('countries');
  const [showMobileMenu, setShowMobileMenu] = useState(true);
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

// Add this useEffect to set random images once when component mounts or section changes
useEffect(() => {
  if (selectedPark && activeSection ) {
    const park = PARKS_DATA.find(c => c.name === selectedPark);
    if (park?.photoGalleries){
      setRandomSeasonImages({
        dry: park.photoGalleries.drySeason[Math.floor(Math.random() * park.photoGalleries.drySeason.length)],
        wet: park.photoGalleries.wetSeason[Math.floor(Math.random() * park.photoGalleries.wetSeason.length)],
        wildlife: park.photoGalleries.wildlife[Math.floor(Math.random() * park.photoGalleries.wildlife.length)],
      displayImage: park.displayImage[Math.floor(Math.random() * park.displayImage.length)],
      
      });
    }
  }
}, [selectedPark, activeSection]);


  // Handle initial URL on component mount and browser back/forward
useEffect(() => {
  const handleInitialLoad = () => {
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    

    
    if (pathParts[0] === 'parks' && pathParts.length > 1) {
      const parkSlug = pathParts[1]; // e.g., "amboseli-national-park"
    
      
      // Try to find park by ID first
      let park = PARKS_DATA.find(p => p.id === parkSlug);
      
      // If not found by ID, try by converting name to slug
      if (!park) {
        park = PARKS_DATA.find(p => {
          const nameSlug = p.name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
          return nameSlug === parkSlug;
        });
      }

      const countryParkMatch = park ? null : findParkBySlug(parkSlug, COUNTRIES_DATA);
      
    
      
      if (park || countryParkMatch) {
        setSelectedPark(park?.name || countryParkMatch.park.name);
        
        if (pathParts.length > 2) {
          const section = pathParts[2];
          setActiveSection(section);
          setShowMobileMenu(false);
        } else {
          setActiveSection('overview');
          setShowMobileMenu(true);
        }
      } else {
        console.error('No park found for slug:', parkSlug);
        
      }
    }
  };

  handleInitialLoad();

  const handlePopState = () => {
    handleInitialLoad();
  };

  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, []);




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
    credit: typeof path === 'string' ? '' : path.credit,
    fallback: typeof path === 'string' ? DEFAULT_IMAGE_FALLBACK : path.fallback
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
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Find the park to get its ID
  const park = PARKS_DATA.find(p => p.name === selectedPark);
  if (park) {
    const parkSlug = park.id;
    const newUrl = `/parks/${parkSlug}/${sectionId}`;
    window.history.pushState({ park: selectedPark, section: sectionId }, '', newUrl);
  }
};

const handleBackToParks = () => {
  setSelectedPark(null);
  setActiveSection('overview');
  setShowMobileMenu(true);
  setThingsToDoCurrentPage(1); // Remove if you removed pagination
  window.history.pushState({}, '', '/parks');
};


  const handleShowAllPages = () => {
    setShowMobileMenu(true);
    setActiveSection('overview');
  };

const handleParkSelect = (parkName) => {
  setSelectedPark(parkName);
  setActiveSection('overview');
  setShowMobileMenu(true);
  
  // Find the park to get its ID
  const park = PARKS_DATA.find(p => p.name === parkName);
  if (park) {
    const parkSlug = park.id; // Use the park's ID for the URL
    const newUrl = `/parks/${parkSlug}`;
    window.history.pushState({ park: parkName, section: 'overview' }, '', newUrl);
  }
};


  const handleTourClick = (tourId) => {
    window.location.href = `/tours/${tourId}`;
  };

  const handleViewAllTours = (parkName) => {
    window.location.href = `/tours?search=${parkName.toLowerCase()}`;
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
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRandomparkTours = (parkName, count = 3) => {
    const parkTours = eastAfricaTours.filter(
      tour => tour.location.toLowerCase() === parkName.toLowerCase()
    );

    const shuffled = [...parkTours].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
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

    return pages;
  };

  const pages = getPageNumbers();

  // Add this helper function to handle page changes with scroll
  const handlePageChangeWithScroll = (page) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12" data-testid="pagination-container">
      <button
        onClick={() => handlePageChangeWithScroll(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 border rounded-lg font-semibold transition-all duration-200 ${
          currentPage === 1
            ? 'border-slate-700 text-slate-600 cursor-not-allowed'
            : 'border-slate-600 text-white hover:bg-slate-700 hover:border-orange-500'
        }`}
        data-testid="button-prev-page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-slate-500">...</span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChangeWithScroll(page)}
              className={`min-w-[44px] px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
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
        onClick={() => handlePageChangeWithScroll(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 border rounded-lg font-semibold transition-all duration-200 ${
          currentPage === totalPages
            ? 'border-slate-700 text-slate-600 cursor-not-allowed'
            : 'border-slate-600 text-white hover:bg-slate-700 hover:border-orange-500'
        }`}
        data-testid="button-next-page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

const ReviewsSection = ({ park, onViewAllExpert, onViewAllUser }) => {
  const [expertExpanded, setExpertExpanded] = useState(false);
  const [userExpanded, setUserExpanded] = useState(false);

  const expertReview = park.reviewsContent.mostHelpfulExpert;
  const userReview = park.reviewsContent.latestUserReview;

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

   const parkTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.name.toLowerCase()
  );
  const totalparkTours = parkTours.length;

   const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.country.toLowerCase()
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
              <StarRating rating={Math.round(park.reviewsContent.expertRating.overall)} />
              <span className="text-white font-bold text-3xl">{park.reviewsContent.expertRating.overall}</span>
              <span className="text-gray-400">/5</span>
            </div>
            <div className="space-y-3">
              {Object.entries(park.reviewsContent.expertRating.categories).map(([key, rating]) => (
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
              <StarRating rating={Math.round(park.reviewsContent.userRating.overall)} />
              <span className="text-white font-bold text-3xl">{park.reviewsContent.userRating.overall}</span>
              <span className="text-gray-400">/5</span>
            </div>
            <div className="space-y-3">
              {Object.entries(park.reviewsContent.userRating.categories).map(([key, rating]) => (
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
             <p className="text-gray-400 text-sm mb-2">
              <img 
                className="inline-block w-5 h-auto mr-2"
                src={`https://flagcdn.com/w40/${park.overviewContent.reviews.featuredExpertReview.park.toLowerCase()}.webp`} 
                alt={`${park.overviewContent.reviews.featuredExpertReview.park} flag`}
              />
              <span>{park.overviewContent.reviews.featuredExpertReview.park}</span>
            </p>
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
    className={`flex items-center gap-2 transition-colors duration-200 cursor-pointer ${
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
                onClick={onViewAllExpert}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                data-testid="button-all-expert-reviews"
              >
                <Star className="w-5 h-5" />
                All Expert Reviews ({park.reviewsContent.expertRating.totalReviews})
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
             <p className="text-gray-400 text-sm">
              <img 
                className="inline-block w-5 h-auto mr-2"
                src={`https://flagcdn.com/w40/${park.overviewContent.reviews.featuredUserReview.park.toLowerCase()}.webp`} 
                alt={`${park.overviewContent.reviews.featuredUserReview.park} flag`}
              />
              <span>{park.overviewContent.reviews.featuredUserReview.park}</span> • {park.overviewContent.reviews.featuredUserReview.date}
            </p>

                  {userReview.tourTaken && (
                    <button
                      onClick={() => {
                        const tourId = userReview.tourTaken.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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
    className={`flex items-center gap-2 transition-colors duration-200 cursor-pointer ${
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
                onClick={onViewAllUser}
                className="group relative overflow-hidden px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg text-sm lg:text-base transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-w-0"
                data-testid="button-all-user-reviews"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <Heart className="w-4 h-4 lg:w-5 lg:h-5 relative z-10 flex-shrink-0" />
                <span className="relative z-10 whitespace-nowrap">All User Reviews ({park.reviewsContent.userRating.totalReviews})</span>
              </button>
              <button
                onClick={() => window.location.href = `/destinations/${park.name.toLowerCase()}/write-review`}
                className="group relative overflow-hidden px-6 py-3.5 bg-slate-800 border-2 border-orange-500 text-white hover:bg-orange-500/20 font-bold rounded-lg text-sm lg:text-base transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                data-testid="button-write-review"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-orange-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="text-lg relative z-10">✍️</span>
                <span className="relative z-10">Write a Review</span>
              </button>
            </div>
          </div>
                         {/* Want To Visit [park] Section - Add to any sidebar page */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {park.country}?
    </h3>
    
    <button
      onClick={() => window.location.href = `/tours?search=${park.country.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {park.country} Tours
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



const AllExpertReviews = ({ park, onBack }) => {
  const [sortBy, setSortBy] = useState('helpful');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const [expandedReviews, setExpandedReviews] = useState({});
  const CHAR_LIMIT = 500;
  const sortedReviews = [...park.reviewsContent.allExpertReviews].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') {
      const dateA = new Date(a.date || '2025-01-01');
      const dateB = new Date(b.date || '2025-01-01');
      return dateB - dateA;
    }
    if (sortBy === 'oldest') {
      const dateA = new Date(a.date || '2025-01-01');
      const dateB = new Date(b.date || '2025-01-01');
      return dateA - dateB;
    }
    return 0;
  });

    const toggleReadMore = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = sortedReviews.slice(startIndex, startIndex + reviewsPerPage);

  const ratingBreakdown = [5, 4, 3, 2, 1].map(rating => ({
    stars: rating,
    count: park.reviewsContent.allExpertReviews.filter(r => Math.round(r.rating) === rating).length
  }));

  const isReviewLiked = (reviewId) => {
    return reviewLikes[reviewId] === true;
  };

  const getDisplayLikeCount = (reviewId, originalCount) => {
    return isReviewLiked(reviewId) ? originalCount + 1 : originalCount;
  };

 const handleLikeClick = (reviewId, currentCount) => {
  handleReviewLike(reviewId, currentCount);
};

  const parkTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.name.toLowerCase()
  );
  const totalparkTours = parkTours.length;

   const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.country.toLowerCase()
  );
  const totalCountryTours = countryTours.length;

  return (
    <div className="min-h-screen bg-slate-900 lg:p-4 lg:py-8">
      <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-orange-500 mb-6 transition-colors duration-200"
          data-testid="button-back-to-reviews"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-bold">Back to Reviews</span>
        </button>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Content */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Expert Reviews</h2>
                <p className="text-gray-400">
                  {startIndex + 1}-{Math.min(startIndex + reviewsPerPage, sortedReviews.length)} of {sortedReviews.length} Reviews
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gray-300 font-semibold text-sm mr-1">Sort By:</span>
                <button
                  onClick={() => setSortBy('helpful')}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-xs md:text-sm ${
                    sortBy === 'helpful'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'bg-slate-800 text-gray-300 hover:text-white'
                  }`}
                >
                  Most Helpful
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-xs md:text-sm ${
                    sortBy === 'rating'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'bg-slate-800 text-gray-300 hover:text-white'
                  }`}
                >
                  Rating
                </button>
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-xs md:text-sm ${
                    sortBy === 'newest'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'bg-slate-800 text-gray-300 hover:text-white'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy('oldest')}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-xs md:text-sm ${
                    sortBy === 'oldest'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'bg-slate-800 text-gray-300 hover:text-white'
                  }`}
                >
                  Oldest
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {currentReviews.map((review) => {
                const reviewId = `expert-all-${review.id}`;
                const isLiked = isReviewLiked(reviewId);
                const displayLikes = getDisplayLikeCount(reviewId, review.helpful);

                return (
                  <div key={review.id} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                        {review.author[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-white font-bold text-lg mb-1">{review.author}</h4>
                       <div className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
                        <img 
                          className="inline-block w-5 h-auto"
                          src={`https://flagcdn.com/w40/${review.parkFlag.toLowerCase()}.webp`} 
                          alt={`${review.park} flag`}
                        />
                        <span>{review.park}</span>
                        <span>•</span>
                        <span>Visited: {review.visitedTimes}</span>
                      </div>

                          </div>
                        </div>
                        <p className="text-gray-400 text-xs italic mt-2">{review.credentials}</p>
                      </div>
                    </div>

                    <h5 className="text-white font-bold text-xl mb-4">{review.title}</h5>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm font-semibold">Overall rating</span>
                        <StarRating rating={review.rating} />
                        <span className="text-white font-bold">{review.rating}/5</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-4">
                      {Object.entries(review.categories).map(([key, rating]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <StarRating rating={rating} />
                        </div>
                      ))}
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {expandedReviews[review.id] || review.fullReview.length <= CHAR_LIMIT
                          ? review.fullReview
                          : `${review.fullReview.slice(0, CHAR_LIMIT)}...`
                        }
                      </p>
                      {review.fullReview.length > CHAR_LIMIT && (
                        <button
                          onClick={() => toggleReadMore(review.id)}
                          className="text-orange-500 hover:text-orange-400 font-bold text-sm mt-3 transition-colors duration-200"
                        >
                          {expandedReviews[review.id] ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                 <button
                        onClick={() => handleLikeClick(reviewId, review.helpful)}
                        className={`flex items-center gap-2 transition-colors duration-200 ${
                          isReviewLiked(reviewId)
                            ? 'text-orange-500'
                            : 'text-gray-400 hover:text-orange-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isReviewLiked(reviewId) ? 'fill-orange-500' : ''}`} />
                        <span className="text-sm font-bold">
                          {getDisplayLikeCount(reviewId, review.helpful)}
                        </span>
                      </button>
                        <span className="text-gray-400 text-sm">found this helpful</span>
                      </div>
                    </div>
                    
                  </div>
                  
                  
                );
              })}
                 {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
                             {/* Want To Visit [park] Section - Add to any sidebar page */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {park.name}?
    </h3>
    
        <button
      onClick={() => window.location.href = `/tours?search=${park.country.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {park.country} Tours
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

          {/* Sidebar */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-6">Average Expert Rating</h3>
              <div className="flex items-center gap-3 mb-6">
                <StarRating rating={Math.round(park.reviewsContent.expertRating.overall)} />
                <span className="text-white font-bold text-3xl">{park.reviewsContent.expertRating.overall}</span>
                <span className="text-gray-400">/5</span>
              </div>
              <div className="space-y-3">
                {Object.entries(park.reviewsContent.expertRating.categories).map(([key, rating]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-300 capitalize text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <StarRating rating={rating} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-6">Rating Breakdown</h3>
              <div className="space-y-3">
                {ratingBreakdown.map((item) => {
                  const percentage = item.count > 0 
                    ? (item.count / park.reviewsContent.allExpertReviews.length) * 100 
                    : 0;
                  return (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className="text-gray-300 text-sm w-12">{item.stars} star</span>
                      <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-orange-500 font-bold text-sm w-12 text-right">{item.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const AllUserReviews = ({ park, onBack }) => {
  const [sortBy, setSortBy] = useState('helpful');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const [expandedReviews, setExpandedReviews] = useState({});
  const CHAR_LIMIT = 700;

  const sortedReviews = [...park.reviewsContent.allUserReviews].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') {
      const dateA = new Date(a.date || '2025-01-01');
      const dateB = new Date(b.date || '2025-01-01');
      return dateB - dateA;
    }
    if (sortBy === 'oldest') {
      const dateA = new Date(a.date || '2025-01-01');
      const dateB = new Date(b.date || '2025-01-01');
      return dateA - dateB;
    }
    return 0;
  });

    const toggleReadMore = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };
  


   const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.country.toLowerCase()
  );
  const totalCountryTours = countryTours.length;
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = sortedReviews.slice(startIndex, startIndex + reviewsPerPage);

  const ratingBreakdown = [5, 4, 3, 2, 1].map(rating => ({
    stars: rating,
    count: park.reviewsContent.allUserReviews.filter(r => Math.round(r.rating) === rating).length
  }));

  const isReviewLiked = (reviewId) => {
    return reviewLikes[reviewId] === true;
  };

  const getDisplayLikeCount = (reviewId, originalCount) => {
    return isReviewLiked(reviewId) ? originalCount + 1 : originalCount;
  };

 const handleLikeClick = (reviewId, currentCount) => {
  handleReviewLike(reviewId, currentCount);
};
  const parkTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.name.toLowerCase()
  );
  const totalparkTours = parkTours.length;


  return (
    <div className="min-h-screen bg-slate-900 lg:p-4 lg:py-8">
      <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-orange-500 mb-6 transition-colors duration-200"
          data-testid="button-back-to-reviews"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-bold">Back to Reviews</span>
        </button>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Content */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">User Reviews</h2>
                <p className="text-gray-400">
                  {startIndex + 1}-{Math.min(startIndex + reviewsPerPage, sortedReviews.length)} of {sortedReviews.length} Reviews
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gray-300 font-semibold text-sm mr-1">Sort By:</span>
                <button
                  onClick={() => setSortBy('helpful')}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-xs md:text-sm ${
                    sortBy === 'helpful'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'bg-slate-800 text-gray-300 hover:text-white'
                  }`}
                >
                  Most Helpful
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-xs md:text-sm ${
                    sortBy === 'rating'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'bg-slate-800 text-gray-300 hover:text-white'
                  }`}
                >
                  Rating
                </button>
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-xs md:text-sm ${
                    sortBy === 'newest'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'bg-slate-800 text-gray-300 hover:text-white'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy('oldest')}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-xs md:text-sm ${
                    sortBy === 'oldest'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'bg-slate-800 text-gray-300 hover:text-white'
                  }`}
                >
                  Oldest
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {currentReviews.map((review) => {
                const reviewId = `user-all-${review.id}`;
                const isLiked = isReviewLiked(reviewId);
                const displayLikes = getDisplayLikeCount(reviewId, review.helpful);

                return (
                  <div key={review.id} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                        {review.author[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-white font-bold text-lg">{review.author}</h4>
                              {review.verified && (
                                <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded">Verified</span>
                              )}
                            </div>
                           <div className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
                            <img 
                              className="inline-block w-5 h-auto"
                              src={`https://flagcdn.com/w40/${review.parkFlag.toLowerCase()}.webp`} 
                              alt={`${review.park} flag`}
                            />
                            <span>{review.park}</span>
                            <span>•</span>
                            <span>Reviewed: {review.date}</span>
                          </div>

                            {review.tourTaken && (
                              <button
                                onClick={() => {
                                  const tourId = review.tourTaken.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                                  window.location.href = `/tours/${tourId}`;
                                }}
                                className="text-orange-400 hover:text-orange-300 text-sm mt-1 block text-left transition-colors duration-200 underline"
                              >
                                Tour: {review.tourTaken}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <h5 className="text-white font-bold text-xl mb-4">{review.title}</h5>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm font-semibold">Overall rating</span>
                        <StarRating rating={review.rating} />
                        <span className="text-white font-bold">{review.rating}/5</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Wildlife</span>
                        <StarRating rating={5} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Bush Vibe</span>
                        <StarRating rating={5} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Scenery</span>
                        <StarRating rating={5} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Birding</span>
                        <StarRating rating={5} />
                      </div>
                    </div>

                      <div className="mb-4">
                      <p className="text-gray-300 leading-relaxed">
                        {expandedReviews[review.id] || review.fullReview.length <= CHAR_LIMIT
                          ? review.fullReview
                          : `${review.fullReview.slice(0, CHAR_LIMIT)}...`
                        }
                      </p>
                      {review.fullReview.length > CHAR_LIMIT && (
                        <button
                          onClick={() => toggleReadMore(review.id)}
                          className="text-orange-500 hover:text-orange-400 font-bold text-sm mt-3 transition-colors duration-200"
                        >
                          {expandedReviews[review.id] ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLikeClick(reviewId, review.helpful)}
                        className={`flex items-center gap-2 transition-colors duration-200 ${
                          isReviewLiked(reviewId)
                            ? 'text-orange-500'
                            : 'text-gray-400 hover:text-orange-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isReviewLiked(reviewId) ? 'fill-orange-500' : ''}`} />
                        <span className="text-sm font-bold">
                          {getDisplayLikeCount(reviewId, review.helpful)}
                        </span>
                      </button>
                        <span className="text-gray-400 text-sm">found this helpful</span>
                      </div>
                    </div>
                  </div>
                );
              })}
                    {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
                             {/* Want To Visit [park] Section - Add to any sidebar page */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {park.name}?
    </h3>
    
        <button
      onClick={() => window.location.href = `/tours?search=${park.country.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {park.country} Tours
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

          {/* Sidebar */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-6">Average User Rating</h3>
              <div className="flex items-center gap-3 mb-6">
                <StarRating rating={Math.round(park.reviewsContent.userRating.overall)} />
                <span className="text-white font-bold text-3xl">{park.reviewsContent.userRating.overall}</span>
                <span className="text-gray-400">/5</span>
              </div>
              <div className="space-y-3">
                {Object.entries(park.reviewsContent.userRating.categories).map(([key, rating]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-300 capitalize text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <StarRating rating={Math.round(rating)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-6">Rating Breakdown</h3>
              <div className="space-y-3">
                {ratingBreakdown.map((item) => {
                  const percentage = item.count > 0 
                    ? (item.count / park.reviewsContent.allUserReviews.length) * 100 
                    : 0;
                  return (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className="text-gray-300 text-sm w-12">{item.stars} star</span>
                      <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-orange-500 font-bold text-sm w-12 text-right">{item.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => window.location.href = `/destinations/${park.name.toLowerCase()}/write-review`}
              className="w-full px-6 py-3 border-2 border-orange-500 text-white hover:bg-orange-500/10 font-bold rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Write a User Review →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const getSectionHeaderText = (sectionId, parkName) => {
  const textMap = {
    'overview': {
      mainText: parkName,
      subText: 'Overview'
    },
    'reviews': {
      mainText: 'Safari Reviews',
      subText: `of ${parkName}`
    },
    'all-expert-reviews': {
      mainText: 'Safari Reviews',
      subText: `of ${parkName}`
    },
    'all-user-reviews': {
      mainText: 'Safari Reviews',
      subText: `of ${parkName}`
    },
    'wildlife': {
      mainText: 'Wildlife & Animals',
      subText: `in ${parkName}`
    },
    'birds': {
      mainText: 'Birds & Birding',
      subText: `in ${parkName}`
    },
    'best-time': {
      mainText: 'Best Time To Visit',
      subText: `${parkName} (Month by Month)`
    },
    'weather': {
      mainText: 'Weather & Climate',
      subText: `in ${parkName}`
    },
    'getting-there': {
      mainText: `How To Get to ${parkName}`,
      subText: 'Access & Entry Requirements'
    },
    'malaria': {
      mainText: 'Malaria & Vaccinations',
      subText: `${parkName} Travel Advice`
    },
    'safety': {
      mainText: 'Safety & Security',
      subText: `${parkName} Travel Advice`
    }
  };

  return textMap[sectionId] || { mainText: parkName, subText: 'Overview' };
};

  const featuredTours = useMemo(() => {
    if (!selectedPark) return [];
    return getRandomparkTours(selectedPark);
  }, [selectedPark]); // Only recalculate when park changes

    const sidebarLinks = useMemo(() => {
    if (!selectedPark) return [];
    const park = PARKS_DATA.find(c => c.name === selectedPark);
    if (!park?.sidebar_links) return [];
    
    // Shuffle and take first 4
    return [...park.sidebar_links]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [selectedPark]); // Only recalculate when park changes

const findCountryParkMatchByName = (parkName) => {
  for (const country of COUNTRIES_DATA) {
    const park = findParkInCountryData(parkName, country);
    if (park) return { park, country };
  }

  return null;
};

const matchesParkName = (candidateName, parkName) => {
  const candidateSlug = slugifyParkName(candidateName);
  const parkSlug = slugifyParkName(parkName);
  return candidateSlug === parkSlug || candidateSlug.includes(parkSlug) || parkSlug.includes(candidateSlug);
};

const findCountryRecordForPark = (records = [], parkName) =>
  records.find((record) => matchesParkName(record.name, parkName));

const handleFallbackSectionClick = (parkName, country, sectionId) => {
  setActiveSection(sectionId);
  setShowMobileMenu(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  window.history.pushState(
    { park: parkName, section: sectionId },
    '',
    getParkPath(parkName, country, sectionId)
  );
};

const renderFallbackSectionContent = (park, country) => {
  const sectionId = activeSection === 'safety' ? 'malaria' : activeSection;
  const wildlifeRating = findCountryRecordForPark(country.wildlifeContent?.parkRatings || [], park.name);
  const birdingRating = findCountryRecordForPark(country.birdsContent?.bestParksForBirding || [], park.name);
  const bestTimeRecord = findCountryRecordForPark(country.bestTimeToVisitContent?.parkByParkRatings || [], park.name);
  const defaultLinks = park.links?.length ? park.links : ['Wildlife', 'Birds', 'Best Time To Visit', 'Climate'];

  if (sectionId === 'wildlife') {
    return (
      <div className="space-y-6">
        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
          {country.wildlifeContent?.description || `${park.name} is part of ${country.name}'s wider safari ecosystem, with wildlife viewing shaped by its habitat, season, and guiding route.`}
        </p>
        {wildlifeRating && (
          <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-5">
            <div className="text-gray-400 text-sm font-bold uppercase mb-2">Wildlife Rating</div>
            <div className="flex items-center gap-3">
              {renderStars(wildlifeRating.rating)}
              <span className="text-white font-bold text-xl">{wildlifeRating.rating}/5</span>
              {wildlifeRating.reviews && <span className="text-gray-400">- {wildlifeRating.reviews} ratings</span>}
            </div>
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(country.wildlifeContent?.animals || []).slice(0, 9).map((animal) => (
            <div key={animal.name} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="text-white font-bold">{animal.name}</div>
              <div className="text-orange-300 text-sm">{animal.status}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sectionId === 'birds') {
    return (
      <div className="space-y-6">
        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
          {country.birdsContent?.description || `${park.name} can be paired with ${country.name}'s wider birding routes for richer safari planning.`}
        </p>
        {birdingRating && (
          <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-5">
            <div className="text-gray-400 text-sm font-bold uppercase mb-2">Birding Rating</div>
            <div className="flex items-center gap-3">
              {renderStars(birdingRating.rating)}
              <span className="text-white font-bold text-xl">{birdingRating.rating}/5</span>
              {birdingRating.reviews && <span className="text-gray-400">- {birdingRating.reviews} ratings</span>}
            </div>
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(country.birdsContent?.notableBirds || []).slice(0, 6).map((bird) => (
            <div key={bird.name} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="text-white font-bold">{bird.name}</div>
              {bird.status && <div className="text-orange-300 text-sm">{bird.status}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sectionId === 'best-time') {
    return (
      <div className="space-y-6">
        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
          {country.bestTimeToVisitContent?.introText || country.bestTime || `${country.name} has seasonal changes that shape road conditions, wildlife movement, and visibility.`}
        </p>
        {bestTimeRecord?.months && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {bestTimeRecord.months.map((month) => {
              const colorClass = {
                excellent: 'bg-green-600',
                good: 'bg-green-500',
                fair: 'bg-yellow-500',
                poor: 'bg-red-500',
              }[month.rating] || 'bg-slate-700';

              return (
                <div key={month.month} className={`${colorClass} text-white rounded-lg px-4 py-3 text-center font-bold`}>
                  <div>{month.month}</div>
                  <div className="text-xs uppercase opacity-90">{month.rating}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (sectionId === 'weather') {
    return (
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-5">
          <h3 className="text-white font-bold text-xl mb-3">{country.weatherAndClimateContent?.drySeason?.title || 'Dry Season'}</h3>
          <p className="text-gray-300 leading-relaxed">{country.weatherAndClimateContent?.drySeason?.description || country.bestTime}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-5">
          <h3 className="text-white font-bold text-xl mb-3">{country.weatherAndClimateContent?.wetSeason?.title || 'Green Season'}</h3>
          <p className="text-gray-300 leading-relaxed">{country.weatherAndClimateContent?.wetSeason?.description || country.highSeason}</p>
        </div>
      </div>
    );
  }

  if (sectionId === 'getting-there') {
    return (
      <p className="text-gray-300 text-base md:text-lg leading-relaxed">
        {country.howToGetThereContent?.gettingAround || `${park.name} is best planned as part of a ${country.name} safari route with road transfers, domestic flights, or private guiding depending on your itinerary.`}
      </p>
    );
  }

  if (sectionId === 'malaria') {
    return (
      <div className="space-y-5">
        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
          {country.malariaAndVaccinationsContent?.introText || country.safetyContent?.introText || `Health and safety requirements for ${park.name} should be checked before travel, especially for malaria prevention, vaccinations, and travel insurance.`}
        </p>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
          {country.safetyContent?.description || 'Travel with a reputable operator, follow guide instructions around wildlife, and confirm the latest entry and health guidance before departure.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-300 text-base md:text-lg leading-relaxed">
        {park.description || `${park.name} is one of ${country.name}'s safari areas, useful for wildlife viewing, route planning, and comparing the best parks for your travel style.`}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-4">
          <div className="text-gray-400 text-xs font-bold uppercase mb-1">Country</div>
          <div className="text-white font-bold">{country.name}</div>
        </div>
        {park.rating && (
          <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-xs font-bold uppercase mb-1">Rating</div>
            <div className="text-white font-bold">{park.rating}/5</div>
          </div>
        )}
        {park.reviewCount && (
          <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-xs font-bold uppercase mb-1">Reviews</div>
            <div className="text-white font-bold">{park.reviewCount}</div>
          </div>
        )}
        {park.badge && (
          <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-xs font-bold uppercase mb-1">Safari Note</div>
            <div className="text-orange-300 font-bold">{park.badge}</div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {defaultLinks.map((link) => {
          const normalizedSection = getParkSectionSlug(link);
          return (
            <button
              key={link}
              onClick={() => handleFallbackSectionClick(park.name, country, normalizedSection)}
              className="border border-orange-500/60 text-orange-300 hover:bg-orange-500/10 hover:text-orange-200 rounded-lg px-4 py-2 font-bold transition-colors"
            >
              {link}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const renderFallbackParkDetail = (park, country) => {
  const heroImage = park.image || country.thumbnailImage || country.overviewImage || '/safariHero.jfif';
  const currentSection = activeSection === 'safety' ? 'malaria' : activeSection;
  const headerText = getSectionHeaderText(currentSection, park.name);
  const countryTourCount = eastAfricaTours.filter(
    (tour) => tour.location.toLowerCase() === country.name.toLowerCase()
  ).length;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="relative h-[46vh] min-h-[360px] bg-slate-950">
        <img src={heroImage} alt={park.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/65 to-slate-900/20" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 pb-8">
            <button
              onClick={() => window.location.href = getParkPath(`All ${country.totalParks || ''} Parks & Reserves`, country)}
              className="mb-5 inline-flex items-center gap-2 text-orange-300 hover:text-orange-200 font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to {country.name} parks
            </button>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{park.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-300">
              <span className="inline-flex items-center gap-2"><MapPin className="w-5 h-5 text-orange-400" /> {country.name}</span>
              {park.rating && <span className="inline-flex items-center gap-2"><Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /> {park.rating}/5</span>}
              {park.reviewCount && <span>{park.reviewCount}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12 grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="lg:sticky lg:top-24 h-fit bg-slate-800/80 border border-slate-700 rounded-lg p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-orange-300 mb-3">Park Guide</div>
          <div className="space-y-1">
            {NAVIGATION_SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => handleFallbackSectionClick(park.name, country, section.id)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left font-bold transition-colors ${
                    currentSection === section.id ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-slate-700/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => handleViewAllTours(country.name)}
            className="mt-5 w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg px-4 py-3"
          >
            {countryTourCount} {country.name} Safaris
          </button>
        </aside>

        <main className="bg-slate-800/80 border border-slate-700 rounded-lg p-5 md:p-8">
          <div className="mb-7">
            <div className="text-orange-300 text-sm font-bold uppercase tracking-wide mb-2">{country.name} Park Detail</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">{headerText.mainText}</h2>
            <p className="text-gray-400 mt-2">{headerText.subText}</p>
          </div>
          {renderFallbackSectionContent(park, country)}
        </main>
      </div>
    </div>
  );
};

const renderParksDirectory = () => (
  <div className="min-h-screen bg-slate-900 text-white px-4 md:px-8 py-24">
    <div className="max-w-[1440px] mx-auto">
      <div className="mb-10">
        <div className="text-orange-300 text-sm font-bold uppercase tracking-wide mb-2">Safari Parks</div>
        <h1 className="text-4xl md:text-6xl font-bold text-white">Parks & Reserves</h1>
        <p className="text-gray-300 text-lg mt-4 max-w-3xl">
          Browse the major safari parks and reserves by country. Select a park to open its detail page.
        </p>
      </div>
      <div className="space-y-8">
        {COUNTRIES_DATA.map((country) => (
          <section key={country.name} className="bg-slate-800/80 border border-slate-700 rounded-lg p-5 md:p-7">
            <h2 className="text-2xl font-bold text-white mb-5">{country.name}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(country.parksAndReservesContent?.allParks || []).map((park) => (
                <button
                  key={`${country.name}-${park.name}`}
                  onClick={() => window.location.href = getParkPath(park.name, country)}
                  className="text-left bg-slate-900/60 border border-slate-700 hover:border-orange-500/60 rounded-lg p-4 transition-colors"
                >
                  <div className="text-white font-bold">{park.name}</div>
                  {park.description && <div className="text-gray-400 text-sm mt-1">{park.description}</div>}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  </div>
);

const renderParkDetail = () => {

  
  if (!selectedPark) {
   
    return null;
  }
  
  const park = PARKS_DATA.find(p => p.name === selectedPark);
  
  
  if (!park) {
    const countryParkMatch = findCountryParkMatchByName(selectedPark);
    return countryParkMatch
      ? renderFallbackParkDetail(countryParkMatch.park, countryParkMatch.country)
      : null;
  }

  if (!selectedPark) return null;

    const parkTours = featuredTours;
    const totalparkTours = eastAfricaTours.filter(tour =>
      tour.location.toLowerCase() === park.name.toLowerCase()
    ).length;

    const sections = {
        overview: ( () => {
  // Add this at the beginning to get real tour count
const parkTours = eastAfricaTours.filter(
  tour => tour.park?.toLowerCase() === park.name.toLowerCase()
);

  
     const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.country.toLowerCase()
  );
  const totalCountryTours = countryTours.length;

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
                  {park.overviewContent.overviewText}
                </p>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
  {/* Africa Map with Kenya */}
<button
  onClick={() => openGallery(
    park.photoGalleries?.maps || [],
    0,
    `${park.name} Maps`
  )}
  className="text-center group cursor-pointer"
>


    <div className="w-full h-48 md:h-64 mx-auto rounded-lg mb-3 overflow-hidden flex items-center justify-center relative">
      <img 
        src={park.overviewContent.mediaGallery.map.parkInCountry}
        alt={`${park.country} Map with ${park.name} highlighted`}
        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
        <Camera className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
    <span className="text-sm md:text-base font-bold text-white hover:text-orange-500 flex items-center gap-2 mx-auto justify-center">
      <Map className="w-4 h-4" />
      Kenya in Africa
    </span>
  </button>

  {/* View Photos */}
<button
  onClick={() => openGallery(
    park.photoGalleries?.wildlife || [],
    0,
    `${park.name} Wildlife Photos`
  )}
  className="relative w-full overflow-hidden group cursor-pointer"
>


    <div className="w-full h-64 md:h-64 mx-auto md:bg-slate-700/30 rounded-lg mb-3 overflow-hidden relative">
      <img 
        src={park.overviewContent.mediaGallery.photos.thumbnail} 
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
    park.photoGalleries?.maps || [],
    1,
    `${park.name} Maps`
  )}
  className="text-center group cursor-pointer"
>


    <div className="w-full h-64 md:h-64 mx-auto md:bg-slate-700/30 rounded-lg mb-3 overflow-hidden relative">
      <img 
        src={park.overviewContent.mediaGallery.map.parkMap} 
        alt={`${park.name} Parks Map`} 
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
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1 md:mb-2">Best Time To Go</div>
                      <div className="text-sm md:text-base text-gray-300 font-semibold">{park.overviewContent.quickInfo.bestTimeToGo}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:gap-4">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1 md:mb-2">High Season</div>
                      <div className="text-sm md:text-base text-gray-300 font-semibold">{park.overviewContent.quickInfo.highSeason}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:gap-4">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1 md:mb-2">Size</div>
                      <div className="text-sm md:text-base text-gray-300 font-semibold">{park.overviewContent.quickInfo.size}</div>
                    </div>
                  </div>
                     <div className="flex items-start gap-3 md:gap-4">
                    <Mountain className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1 md:mb-2">Altitude</div>
                      <div className="text-sm md:text-base text-white font-bold">{park.overviewContent.quickInfo.altitude} </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 md:gap-8 px-4 lg:px-0">
                <div className="space-y-6 md:space-y-8">
                  <section>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 pb-4 border-b border-slate-700/50">Pros & Cons</h3>
                    <div className="space-y-3 md:space-y-4">
                      {park.overviewContent.prosAndCons.pros.map((pro, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-green-400 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-400 rounded-full"></div>
                          </div>
                          <span className="text-sm md:text-base text-gray-300 font-medium">{pro}</span>
                        </div>
                      ))}
                      {park.overviewContent.prosAndCons.cons.map((con, idx) => (
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
                      {park.overviewContent.wildlifePreview.description}
                    </p>
                  <button 
                    onClick={() => handleSectionClick('wildlife')}
                    className="text-blue-500 hover:text-blue-400 text-sm md:text-base font-semibold"
                  >
                    › {park.overviewContent.wildlifePreview.linkText}
                  </button>

                  </section>

                  <section>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 pb-4 border-b border-slate-700/50">Things To Do</h3>
                    <div className="grid gap-4 md:gap-6">
                      {park.overviewContent.thingsToDoPreview.map((activity, idx) => (
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
                      {park.overviewContent.weatherPreview.description}
                    </p>
                <button 
                onClick={() => handleSectionClick('weather')}
                className="text-blue-500 hover:text-blue-400 text-sm md:text-base font-semibold"
              >
                › {park.overviewContent.weatherPreview.linkText}
              </button>
                  </section>

                  <section>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 pb-4 border-b border-slate-700/50">Best Time To Visit</h3>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 font-medium">
                      {park.overviewContent.bestTimePreview.description}
                    </p>
                 <button 
                  onClick={() => handleSectionClick('best-time')}
                  className="text-blue-500 hover:text-blue-400 text-sm md:text-base font-semibold"
                >
                  › {park.overviewContent.bestTimePreview.linkText}
                </button>
                  </section>
                   {/* Want To Visit [park] Section - Add to any sidebar page */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {park.name}?
    </h3>
    
       <button
      onClick={() => window.location.href = `/tours?search=${park.country.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {park.country} Tours
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
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 pb-4 border-b border-slate-700/50">{park.name} Safari Reviews</h3>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Expert Rating</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <StarRating rating={Math.round(park.overviewContent.reviews.expertRating.overall)} />
                          <span className="text-white font-bold text-lg">{park.overviewContent.reviews.expertRating.overall}</span>
                          <span className="text-gray-400 text-sm">({park.overviewContent.reviews.expertRating.totalReviews} reviews)</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        {Object.entries(park.overviewContent.reviews.expertRating.categories).map(([key, rating]) => (
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
                          <StarRating rating={Math.round(park.overviewContent.reviews.userRating.overall)} />
                          <span className="text-white font-bold text-lg">{park.overviewContent.reviews.userRating.overall}</span>
                          <span className="text-gray-400 text-sm">({park.overviewContent.reviews.userRating.totalReviews} reviews)</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        {Object.entries(park.overviewContent.reviews.userRating.categories).map(([key, rating]) => (
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
                              {park.overviewContent.reviews.featuredExpertReview.author[0]}
                            </div>
                            <div>
                              <div className="text-white font-bold text-sm">{park.overviewContent.reviews.featuredExpertReview.author}</div>
                              <div className='flex inline-flex'>
                                <img 
                                src={`https://flagcdn.com/w40/${park.overviewContent.reviews.featuredExpertReview.countryFlag}.webp`}
                                alt={`${park.overviewContent.reviews.featuredExpertReview.country} flag`}
                                className="w-5 h-4 object-cover mr-2 "
                              />
                              <div className="text-white font-bold text-xs">{park.overviewContent.reviews.featuredExpertReview.park}</div>
                              </div>
                             
                            </div>
                          </div>
                          <p className="text-gray-400 text-xs italic mb-3">{park.overviewContent.reviews.featuredExpertReview.credentials}</p>
                          <h4 className="text-white font-bold text-sm mb-2">{park.overviewContent.reviews.featuredExpertReview.title}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <StarRating rating={park.overviewContent.reviews.featuredExpertReview.rating} />
                            <span className="text-white font-bold text-sm">{park.overviewContent.reviews.featuredExpertReview.rating}</span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{park.overviewContent.reviews.featuredExpertReview.excerpt}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase block mb-3">Featured User Reviews</span>
                        <div className="space-y-3">
                          <div className="bg-[linear-gradient(to_right,_#4A00E0_0%,_#5b1be5_40%,_#4A00E0_100%)]  text-gray-100 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {park.overviewContent.reviews.featuredUserReview.author[0]}
                              </div>
                              <div>
                                <div className="text-white font-bold text-sm">{park.overviewContent.reviews.featuredUserReview.author}</div>
                                <div className="text-gray-400 text-xs flex flex-inline"> <img 
                              src={`https://flagcdn.com/w40/${park.overviewContent.reviews.featuredUserReview.countryFlag}.webp`}
                              alt={`${park.overviewContent.reviews.featuredUserReview.country} flag`}
                              className="w-5 h-4 object-cover mr-2"
                            />{park.overviewContent.reviews.featuredUserReview.park} · {park.overviewContent.reviews.featuredUserReview.date}</div>
                              </div>
                            </div>
                            <h4 className="text-white font-bold text-sm mb-2">{park.overviewContent.reviews.featuredUserReview.title}</h4>
                            <div className="flex items-center gap-2 mb-2">
                              <StarRating rating={park.overviewContent.reviews.featuredUserReview.rating} />
                              <span className="text-white font-bold text-sm">{park.overviewContent.reviews.featuredUserReview.rating}</span>
                            </div>
                            <p className="text-gray-200 text-sm leading-relaxed">{park.overviewContent.reviews.featuredUserReview.excerpt}</p>
                          </div>

                          {park.overviewContent.reviews.additionalUserReview && (
                            <div className="bg-[linear-gradient(to_right,_#4A00E0_0%,_#5b1be5_40%,_#4A00E0_100%)]  text-gray-100 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-gray-900  font-bold text-sm">
                              {park.overviewContent.reviews.additionalUserReview.author[0]}
                            </div>
                            <div>
                              <div className="text-white  font-bold text-sm">{park.overviewContent.reviews.additionalUserReview.author}</div>
                              <div className="text-gray-400 text-xs font-bold flex flex-inline"> <img 
                                    src={`https://flagcdn.com/w40/${park.overviewContent.reviews.additionalUserReview.countryFlag}.webp`}
                                    alt={`${park.overviewContent.reviews.additionalUserReview.country} flag`}
                                    className="w-5 h-4 object-cover mr-2"
                                  />{park.overviewContent.reviews.additionalUserReview.park} · {park.overviewContent.reviews.additionalUserReview.date}</div>
                            </div>
                          </div>
                              <h4 className="text-white font-bold text-sm mb-2">{park.overviewContent.reviews.additionalUserReview.title}</h4>
                              <div className="flex items-center gap-2 mb-2">
                                <StarRating rating={park.overviewContent.reviews.additionalUserReview.rating} />
                                <span className="text-white  font-bold text-sm">{park.overviewContent.reviews.additionalUserReview.rating}</span>
                              </div>
                              <p className="text-gray-200 text-sm font-bold leading-relaxed">{park.overviewContent.reviews.additionalUserReview.excerpt}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      );
     })() ,

  reviews: (
      <div id="reviews">
      <ReviewsSection 
        park={park} 
        onViewAllExpert={() => setActiveSection('all-expert-reviews')}
        onViewAllUser={() => setActiveSection('all-user-reviews')}
      />
      </div>
    ),
    'all-expert-reviews': (
       <div id="all-expert-reviews">
      <AllExpertReviews park={park} onBack={() => setActiveSection('reviews')} />
        
      </div>
    ),
    'all-user-reviews': (
       <div id="all-user-reviews">
      <AllUserReviews park={park} onBack={() => setActiveSection('reviews')} />
        </div>
    ),
    wildlife: (
                () => {
  // Add this at the beginning to get real tour count
  const parkTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.name.toLowerCase()
  );
  const totalparkTours = parkTours.length;

  const totalActivities = park.bestTimeToVisitContent.monthlyRatings.length;
  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE);
     const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.country.toLowerCase()
  );
  const totalCountryTours = countryTours.length;

  return (
      <div id="wildlife" className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
        <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
              {park.wildlifeContent.description}
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
        {park.wildlifeContent.animals.map((animal, idx) => {
          const statusColors = {
            'Abundant': 'text-green-500',
            'Common': 'text-green-400',
            'Occasional': 'text-orange-400',
            'Rare': 'text-red-500',
            'Very Rare': 'text-red-600'
          };

          const statusDotColors = {
            'Abundant': 'bg-green-500',
            'Common': 'bg-green-400',
            'Occasional': 'bg-orange-400',
            'Rare': 'bg-red-500',
            'Very Rare': 'bg-red-600'
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
      
              {/* Wildlife Highlights */}
              <section>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
                  {park.wildlifeContent.highlights.title}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {park.wildlifeContent.highlights.description}
                </p>
              </section>

              {/* Best Time for Wildlife Viewing */}
              <section>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
                  {park.wildlifeContent.bestTime.title}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {park.wildlifeContent.bestTime.description}
                </p>
              </section>


              
 {/* Want To Visit [park] Section - Add to any sidebar page */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {park.name}?
    </h3>
    
       <button
      onClick={() => window.location.href = `/tours?search=${park.country.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {park.country} Tours
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
                    <StarRating rating={park.wildlifeContent.expertRating.stars} />
                    <span className="text-white font-bold text-xl">{park.wildlifeContent.expertRating.overall}</span>
                    <span className="text-gray-400">/5</span>
                  </div>
                  <button 
                    onClick={() => setActiveSection('all-expert-reviews')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors duration-200"
                  >
                    {park.wildlifeContent.expertRating.totalReviews} Expert Wildlife Reviews
                  </button>
                </div>

                {/* User Rating */}
                <div className="border-t border-slate-700/50 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-400 uppercase">User Rating</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={park.wildlifeContent.userRating.stars} />
                    <span className="text-white font-bold text-xl">{park.wildlifeContent.userRating.overall}</span>
                    <span className="text-gray-400">/5</span>
                  </div>
                  <button 
                    onClick={() => setActiveSection('all-user-reviews')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors duration-200"
                  >
                    {park.wildlifeContent.userRating.totalReviews} User Wildlife Reviews
                  </button>
                </div>
              </section>

            
            {/* Wildlife Photos */}
{/* Wildlife Photos - In the sidebar */}
<button
  onClick={() => openGallery(
    park.photoGalleries?.wildlife || [],
    0,
    `${park.name} Wildlife Photos`
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
  const parkTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.name.toLowerCase()
  );


     const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.country.toLowerCase()
  );
  const totalCountryTours = countryTours.length;
  return (
      <div id="birds" className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
        <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
              {park.birdsContent.description}
            </p>
          </div>

         
{/* Notable birds carousel */}
<section className="mb-12 -mx-4 lg:-mx-8 px-4 lg:px-8 py-12 bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 border-y-4 border-orange-500/30 shadow-2xl">
  <div className="max-w-[1440px] mx-auto">
    <div className="text-center mb-10">
      <div className="inline-block">
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 relative">
          Notable Birds in {park.name}
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
        </h3>
      </div>
      <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
        Discover {park.name}'s most remarkable bird species, from endemic treasures to spectacular migrants
      </p>
    </div>
    
 {/* Desktop Grid - Hidden on mobile */}
<div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
  {park.birdsContent.notableBirds.map((bird, idx) => {
    const allBirdImages = park.birdsContent.notableBirds.map(b => ({
      url: getBirdDisplayImage(b),
      caption: b.name,
      credit: `Status: ${b.status}`,
      fallback: BIRD_IMAGE_FALLBACK
    }));
    const birdImage = getBirdDisplayImage(bird);

    return (
      <button
        key={idx}
        onClick={() => openGallery(
          allBirdImages,
          idx,
          `${park.name} Notable Birds`
        )}
        className="relative group cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
      >
        <div className="flex flex-col h-full">
          {/* Fixed height image container */}
          <div className="relative w-48 h-48 md:w-52 md:h-52 rounded-2xl overflow-hidden mb-4 border-4 border-slate-700 group-hover:border-orange-500 shadow-xl group-hover:shadow-orange-500/50 transition-all duration-300 mx-auto">
            {birdImage ? (
              <img
                src={birdImage}
                alt={bird.name}
                onError={(event) => setImageFallback(event, BIRD_IMAGE_FALLBACK)}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <BirdImagePlaceholder />
            )}
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
        {currentBirdIndex + 1} / {park.birdsContent.notableBirds.length}
      </div>

      {/* Carousel Container */}
      <div className="flex items-center justify-center gap-4 w-full">
        {/* Left Arrow */}
        <button
          onClick={() => setCurrentBirdIndex((prev) => 
            prev === 0 ? park.birdsContent.notableBirds.length - 1 : prev - 1
          )}
          className="flex-shrink-0 p-2 rounded-full hover:bg-slate-700/50 transition-colors duration-300 group"
          aria-label="Previous bird"
        >
          <ChevronLeft className="w-8 h-8 text-orange-500 group-hover:text-orange-400 transition-colors" />
        </button>

        {/* Bird Card */}
        <button
          onClick={() => {
            const allBirdImages = park.birdsContent.notableBirds.map(b => ({
              url: getBirdDisplayImage(b),
              caption: b.name,
              credit: `Status: ${b.status}`,
              fallback: BIRD_IMAGE_FALLBACK
            }));
            openGallery(allBirdImages, currentBirdIndex, `${park.name} Notable Birds`);
          }}
          className="relative group cursor-pointer flex-shrink-0"
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative w-56 h-56 rounded-2xl overflow-hidden mb-4 border-4 border-slate-700 group-hover:border-orange-500 shadow-xl group-hover:shadow-orange-500/50 transition-all duration-300">
              {getBirdDisplayImage(park.birdsContent.notableBirds[currentBirdIndex]) ? (
                <img
                  src={getBirdDisplayImage(park.birdsContent.notableBirds[currentBirdIndex])}
                  alt={park.birdsContent.notableBirds[currentBirdIndex].name}
                  onError={(event) => setImageFallback(event, BIRD_IMAGE_FALLBACK)}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <BirdImagePlaceholder />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
            <h4 className="text-white font-bold text-xl mb-2 group-hover:text-orange-400 transition-colors duration-300">
              {park.birdsContent.notableBirds[currentBirdIndex].name}
            </h4>
            <span className="inline-block px-3 py-1 bg-slate-700/80 text-orange-400 text-sm font-semibold rounded-full border border-orange-500/30">
              {park.birdsContent.notableBirds[currentBirdIndex].status}
            </span>
          </div>
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => setCurrentBirdIndex((prev) => 
            prev === park.birdsContent.notableBirds.length - 1 ? 0 : prev + 1
          )}
          className="flex-shrink-0 p-2 rounded-full hover:bg-slate-700/50 transition-colors duration-300 group"
          aria-label="Next bird"
        >
          <ChevronRight className="w-8 h-8 text-orange-500 group-hover:text-orange-400 transition-colors" />
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="flex gap-2">
        {park.birdsContent.notableBirds.map((_, idx) => (
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
        {park.birdsContent.endemicBirds.title}
      </h3>
      <p className="text-gray-400 text-sm mb-6 whitespace-pre-line">
        {park.birdsContent.endemicBirds.subtitle}
      </p>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
        {park.birdsContent.endemicBirds.species.map((bird, idx) => (
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
 <span className="text-gray-500 text-sm">
  {bird.type ? `(${bird.type})` : ''}
</span>
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
                  {park.birdsContent.bestTimeForBirdWatching.description}
                </p>
              </section>          
 {/* Want To Visit [park] Section - Add to any sidebar page */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {park.name}?
    </h3>
    
       <button
      onClick={() => window.location.href = `/tours?search=${park.country.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {park.country} Tours
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
                    <StarRating rating={park.birdsContent.birdingRating.expertRating.stars} />
                    <span className="text-white font-bold text-xl">{park.birdsContent.birdingRating.expertRating.overall}</span>
                    <span className="text-gray-400">/5</span>
                  </div>
                  <button 
                    onClick={() => setActiveSection('all-expert-reviews')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors duration-200"
                  >
                    {park.birdsContent.birdingRating.expertRating.totalReviews} Expert Birding Reviews
                  </button>
                </div>

                {/* User Rating */}
                <div className="border-t border-slate-700/50 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-400 uppercase">User Rating</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={park.birdsContent.birdingRating.userRating.stars} />
                    <span className="text-white font-bold text-xl">{park.birdsContent.birdingRating.userRating.overall}</span>
                    <span className="text-gray-400">/5</span>
                  </div>
                  <button 
                    onClick={() => setActiveSection('all-user-reviews')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors duration-200"
                  >
                    {park.birdsContent.birdingRating.userRating.totalReviews} User Birding Reviews
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
                      <div className="text-3xl font-bold text-white">{park.birdsContent.factsAndFigures.birdSpecies}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-t border-slate-700/50 pt-6">
                    <div className="w-20 h-20 flex-shrink-0">
                      <Calendar className="w-full h-full text-orange-400 opacity-20" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1">Migratory Birds</div>
                      <div className="text-2xl font-bold text-white">{park.birdsContent.factsAndFigures.migratoryBirds}</div>
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
  const parkTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.name.toLowerCase()
  );
  const totalparkTours = parkTours.length;
  const totalActivities = park.bestTimeToVisitContent.monthlyRatings.length;
  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE);
  const parkByParkRatings = Array.isArray(park.bestTimeToVisitContent?.parkByParkRatings)
    ? park.bestTimeToVisitContent.parkByParkRatings
    : [];

     const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.country.toLowerCase()
  );
  const totalCountryTours = countryTours.length;
  return (
  <div id="best-time" className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
    <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
      {/* Month Rating Bar */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {park.bestTimeToVisitContent.monthlyRatings.map((item, idx) => {
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
        {park.bestTimeToVisitContent.introText}
      </p>

      {/* Safari Button */}
    <div className="flex justify-start mb-12">
  <button
    onClick={() => handleViewAllTours(park.name)}
    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
  >
    {totalparkTours} {park.name} Tours
  </button>
</div>

      
     {/* Key Information Cards - Added hover effect */}
<div className="grid md:grid-cols-2 gap-6 mb-12">
  {park.bestTimeToVisitContent.keyInfo.map((info, idx) => {
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
        {park.bestTimeToVisitContent.drySeasonInfo.title}
      </h3>
      <p className="text-gray-400 text-sm mb-6">– {park.bestTimeToVisitContent.drySeasonInfo.subtitle}</p>
      
      <div className="space-y-3">
        {park.bestTimeToVisitContent.drySeasonInfo.pros.map((pro, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-green-400 flex items-center justify-center mt-0.5 flex-shrink-0">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-gray-300 text-base">{pro}</span>
          </div>
        ))}
        {park.bestTimeToVisitContent.drySeasonInfo.cons.map((con, idx) => (
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
            park.photoGalleries?.drySeason || [],
            0,
            `${park.name} Wet Season`
          )}
          className="relative w-full overflow-hidden group cursor-pointer"
        >
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden h-fit">
            <h3 className="text-xl font-bold text-white p-6 pb-4">Dry Season Photos</h3>
            <div className="relative h-64">
           <img
              src={randomSeasonImages.dry || park.photoGalleries.wetSeason[0]}
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

  {/* Wet Season - Keep in grid */}
  <div className="grid lg:grid-cols-[1fr_400px] gap-8 mb-12">
    <section>
      <h3 className="text-2xl font-bold text-white mb-2">
        {park.bestTimeToVisitContent.wetSeasonInfo.title}
      </h3>
      <p className="text-gray-400 text-sm mb-6">– {park.bestTimeToVisitContent.wetSeasonInfo.subtitle}</p>
      
      <div className="space-y-3">
        {park.bestTimeToVisitContent.wetSeasonInfo.pros.map((pro, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-green-400 flex items-center justify-center mt-0.5 flex-shrink-0">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-gray-300 text-base">{pro}</span>
          </div>
        ))}
        {park.bestTimeToVisitContent.wetSeasonInfo.cons.map((con, idx) => (
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
            park.photoGalleries?.wetSeason || [],
            0,
            `${park.name} Dry Season`
          )}
          className="relative w-full overflow-hidden group cursor-pointer"
        >
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden h-fit">
            <h3 className="text-xl font-bold text-white p-6 pb-4">Wet Season Photos</h3>
            <div className="relative h-64">
          <img
 src={randomSeasonImages.wet || park.photoGalleries.drySeason[0]}
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
  </div>

  {/* Best Time To Go by Major Park - FULL WIDTH from here */}
  {parkByParkRatings.length > 0 && (
  <section className="w-full">
    <h3 className="text-2xl font-bold text-white mb-6">Best Time To Go by Major Park</h3>
    <p className="text-gray-300 text-base leading-relaxed mb-6">
      Compare month-by-month safari conditions across the major parks in this region.
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
      {parkByParkRatings.map((ratedPark, idx) => (
        <div key={idx} className="bg-slate-800/30 rounded-lg p-4">
          <button className="text-blue-400 hover:text-blue-300 font-bold text-base mb-3 transition-colors duration-200">
            › {ratedPark.name}
          </button>
          <div className="flex flex-wrap gap-2">
            {(ratedPark.months || []).map((month, mIdx) => {
              const colorClass = {
                'excellent': 'bg-green-600',
                'good': 'bg-green-500',
                'fair': 'bg-yellow-500',
                'poor': 'bg-red-500'
              }[month.rating] || 'bg-slate-600';
              
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
  )}

  {/* Want To Visit Section - ALSO FULL WIDTH */}
  <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {park.name}?
    </h3>
    
       <button
      onClick={() => window.location.href = `/tours?search=${park.country.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {park.country} Tours
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
  const parkTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.name.toLowerCase()
  );
     const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.country.toLowerCase()
  );
  const totalCountryTours = countryTours.length;
  return (
  <div id="weather" className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
  <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
    {/* Introduction */}
    <div className="mb-8">
      <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
        {park.weatherAndClimateContent.introText}
      </p>
      <button
        onClick={() => handleViewAllTours(park.name)}
        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
      >
        {totalparkTours} {park.name} Tours
      </button>
    </div>

    {/* Main Layout: Content on Left, Images on Right */}
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      {/* Left Column: All Content */}
      <div>
    
        {/* Dry Season Content */}
        <section className="mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {park.weatherAndClimateContent.drySeason.title}
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            – {park.weatherAndClimateContent.drySeason.period}
          </p>
          
          <p className="text-gray-300 text-base leading-relaxed mb-6">
            {park.weatherAndClimateContent.drySeason.description}
          </p>
          
          {park.weatherAndClimateContent.drySeason.months.map((month, idx) => (
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
            {park.weatherAndClimateContent.wetSeason.title}
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            – {park.weatherAndClimateContent.wetSeason.period}
          </p>
          
          <p className="text-gray-300 text-base leading-relaxed mb-6">
            {park.weatherAndClimateContent.wetSeason.description}
          </p>
          
          {park.weatherAndClimateContent.wetSeason.months.map((month, idx) => (
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
      <div className="space-y-6">
        {/* Map Image */}
        <button
       onClick={() => openGallery(
    park.photoGalleries?.maps || [],
    1,
    `${park.name} Maps`
  )}
          
          className="relative w-full overflow-hidden group cursor-pointer"
        >
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden h-fit">
            <h3 className="text-xl font-bold text-white p-6 pb-4">{park.name} Map</h3>
            <div className="relative h-64">
              <img
                src={park.overviewContent.mediaGallery.map.parkMap}
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
    park.photoGalleries?.wildlife || [],
    0,
    `${park.name} Wildlife Photos`
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
      <div className="w-full py-3 text-center text-blue-500 hover:text-blue-400 font-bold">
        View Photos 
      </div>
    </div>
  </section>
</button>
      </div>
    </div>

    {/* Want To Visit Kenya */}
    <section className="mt-12 w-full">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
        Want To Visit {park.name}?
      </h3>
      
         <button
      onClick={() => window.location.href = `/tours?search=${park.country.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {park.country} Tours
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
  
'getting-there': (
             () => {
  // Add this at the beginning to get real tour count
  const parkTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.name.toLowerCase()
  );
     const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.country.toLowerCase()
  );
  const totalCountryTours = countryTours.length;

  return (
  <div id="getting-there" className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
    <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Main Airport */}
          <section>
            <p className="text-gray-300 text-base leading-relaxed mb-4">
              {park.howToGetThereContent.gettingAround}
            </p>

            <p className="text-yellow-400 text-base leading-relaxed mb-6">
              {park.howToGetThereContent.tourOperatorNote}
            </p>

            <button
              onClick={() => handleViewAllTours(park.name)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
            >{totalparkTours} {park.name} Tours
            </button>
          </section>

          {/* Flights & Airlines */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
              {park.howToGetThereContent.flightsAndAirlines.title}
            </h3>
            <p className="text-gray-300 text-base leading-relaxed mb-2">
              {park.howToGetThereContent.flightsAndAirlines.description}
            </p>
            <button className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base">
              <ChevronRight className="w-4 h-4" />
              <a 
               href={park.howToGetThereContent.flightsAndAirlines.link}
               target="_blank"
               rel="noopener noreferrer"
              > 
              {park.howToGetThereContent.flightsAndAirlines.bookingLink}
              </a>
            </button>
          </section>

          {/* Domestic Airlines */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
              {park.howToGetThereContent.domesticAirlines.title}
            </h3>
            <p className="text-gray-300 text-base leading-relaxed mb-6 italic">
              {park.howToGetThereContent.domesticAirlines.note}
            </p>

            <p className="text-gray-300 text-base leading-relaxed mb-4">
              Domestic flights can be booked with several carriers:
            </p>

            <ul className="space-y-4">
              {park.howToGetThereContent.domesticAirlines.carriers.map((carrier, idx) => (
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
             Passport, Visa & Other Entry Requirements
            </h3>
            
            <p className="text-gray-300 text-base leading-relaxed mb-6">
               Please check our{' '}
              <a 
                href={`/destinations/${park.country}/getting-there`}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                How To Get to {park.country}
              </a>{' '}
              page to learn more about passport, visa and other entry requirements.
            </p>

           
          </section>

          {/* Want To Visit */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {park.name}?
    </h3>
    
       <button
      onClick={() => window.location.href = `/tours?search=${park.country.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {park.country} Tours
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
    park.photoGalleries?.maps || [],
    1,
    `${park.name} Maps`
  )}
          
          className="relative w-full overflow-hidden group cursor-pointer"
        >
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden h-fit">
            <h3 className="text-xl font-bold text-white p-6 pb-4">{park.name} Map</h3>
            <div className="relative h-64">
              <img
                src={park.overviewContent.mediaGallery.map.parkMap}
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
  const parkTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.name.toLowerCase()
  );
     const countryTours = eastAfricaTours.filter(
    tour => tour.location.toLowerCase() === park.country.toLowerCase()
  );
  const totalCountryTours = countryTours.length;
  return (
  <div id="malaria" className="min-h-screen bg-slate-900 lg:p-4 lg:py-1">
    <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
      {/* Introduction */}
      <div className="mb-8">
        <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
          {park.malariaAndSafetyContent.introText}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 mb-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Vaccinations */}
          <section>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-4 border-b border-slate-700/50">
              {park.malariaAndSafetyContent.Safety.title}
            </h3>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              {park.malariaAndSafetyContent.Safety.description}
            </p>
          </section>

          {/* Malaria Risk */}
          <section>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-4 border-b border-slate-700/50">
              {park.malariaAndSafetyContent.malariaRisk.title}
            </h3>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              {park.malariaAndSafetyContent.malariaRisk.description}
            </p>
         
             <button className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-base mt-3">
              <ChevronRight className="w-4 h-4" />
              <a 
               href={`/destinations/${park.country}/malaria`}
               target=""
               rel="noopener noreferrer"
              > 
              Malaria & Vaccinations – {park.country}
              </a>
            </button>
          </section>

                   {/* Wildlife Viewing */}
          <section>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-4 border-b border-slate-700/50">
              {park.malariaAndSafetyContent.wildlifeViewing.title}
            </h3>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              {park.malariaAndSafetyContent.wildlifeViewing.description}
            </p>

<div className="relative py-10 px-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 mt-5">
  {/* Animated background */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-600 rounded-full blur-3xl animate-pulse"></div>
  </div>

  <div className="max-w-4xl mx-auto relative z-10">
    {/* Title */}
    <h1 className="text-5xl md:text-6xl font-bold text-center bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent leading-tight mb-12">
      Safety Precautions
    </h1>
    
    {/* Safety Rules */}
    <div className="mt-6">
      <ul className="space-y-4">
        {park.malariaAndSafetyContent.wildlifeViewing.rules.map((rule, idx) => (
          <li 
            key={idx} 
            className="group flex items-start gap-4 bg-slate-800/40 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-orange-500/60 hover:bg-slate-800/60 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20  w-full"
          >
            <span className="text-orange-500 text-2xl font-bold mt-1 group-hover:scale-110 transition-transform duration-300">›</span>
            <p className="text-gray-200 text-base md:text-lg leading-relaxed flex-1">{rule}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>
  </section>


 {/* Want To Visit [park] Section - Add to any sidebar page */}
 <section className="mt-12 w-full">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-4 border-b border-slate-700/50">
      Want To Visit {park.name}?
    </h3>
    
       <button
      onClick={() => window.location.href = `/tours?search=${park.country.toLowerCase()}`}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4 flex items-center gap-2"
    >
      {totalCountryTours} {park.country} Tours
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
              {park.malariaAndSafetyContent.preventionTips.map((tip, idx) => (
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
              {park.malariaAndSafetyContent.Safety.recommended.map((vac, idx) => (
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


    };

    const currentSectionData = NAVIGATION_SECTIONS.find(s => s.id === activeSection);

    return (
      <div className="min-h-screen bg-slate-900">
        <div className="lg:hidden bg-slate-900 px-4 pt-4 pb-2">
          <button 
            onClick={showMobileMenu ? handleBackToParks: handleShowAllPages}
            className=" bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            data-testid="button-mobile-nav-toggle"
          >
            <ChevronLeft className="w-5 h-5" />
           <span className="text-base">
  {showMobileMenu ? 'All Countries & Parks' : `All ${park.name
    .replace('National Park', 'NP')
    .replace('National Reserve', 'NR')
    .replace('Wildlife Sanctuary', 'WS')
    .replace('Game Reserve', 'GR')} Pages`}
</span>
          </button>
        </div>
{/* mobile */}
<div className="lg:hidden relative bg-cover bg-center h-80" style={{ backgroundImage: `url(${park.displayImage})` }}>
  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-slate-900/60"></div>
  <div className="relative h-full flex flex-col justify-end px-4 pb-6">
    {/* Safari Button and Reviews - Mobile Top Right */}
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      <button
        onClick={() => handleViewAllTours(park.name)}
        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-300 text-sm flex items-center gap-2 shadow-lg"
        data-testid="button-header-safaris-mobile"
      >
                {park.name
                        .replace('National Park', 'NP')
                        .replace('National Reserve', 'NR')
                        .replace('Wildlife Sanctuary', 'WS')
                        .replace('Game Reserve', 'GR')} Tours
        <ChevronRight className="w-4 h-4" />
      </button>
      
    </div>

    <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
      {getSectionHeaderText(activeSection, park.name).mainText}
    </h1>
    <p className="text-orange-400 font-semibold text-lg drop-shadow-lg">
      – {getSectionHeaderText(activeSection, park.name).subText}
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
  <div className="relative bg-cover bg-center h-72 md:h-80" style={{ backgroundImage: `url(${park.displayImage})` }}>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 to-slate-900/40"></div>
      <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 h-full">
        <div className="pt-8 md:pt-12 pb-6 ml-64 xl:ml-72">
          {/* Back button - Top Left */}
          <div className="absolute top-8 left-8">
            <button onClick={handleBackToParks} className="flex items-center gap-2 text-white hover:text-orange-500 transition-colors duration-200" data-testid="button-back-to-countries">
              <ChevronLeft className="w-5 h-5" />
              <span className="font-bold text-sm md:text-base">Back to Parks</span>
            </button>
          </div>
          
          {/* Safari Button and Reviews - Top Right */}
          <div className="absolute top-8 right-8 flex flex-col gap-3">
            <button
              onClick={() => handleViewAllTours(park.country)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              data-testid="button-header-safaris"
            >
              {park.country
                        .replace('National Park', 'NP')
                        .replace('National Reserve', 'NR')
                        .replace('Wildlife Sanctuary', 'WS')
                        .replace('Game Reserve', 'GR')} Safaris
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => handleSectionClick('reviews')}
              className="px-6 py-3 bg-slate-800/90 backdrop-blur-sm border-2 border-orange-500 text-white hover:bg-orange-500/20 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              data-testid="button-header-reviews"
            >
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span>{park.rating}</span>
              <span className="text-gray-300">- {park.reviewCount} Reviews</span>
            </button>
          </div>

          {/* Title and Subtitle - Repositioned */}
          <div className="absolute bottom-8 left-8 ml-64 xl:ml-72">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2"> 
              {getSectionHeaderText(activeSection, park.name).mainText}
            </h1>
            <p className="text-white font-semibold text-base md:text-lg">
              – {getSectionHeaderText(activeSection, park.name).subText}
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
                onClick={() => handleViewAllTours(park.name)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-4 rounded-lg font-bold text-base hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                data-testid="button-view-all-tours-mobile"
              >
                {totalparkTours} {park.name} Tours
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

                      <h2 className="text-white font-bold text-lg md:text-xl">
                      {park.name
                        .replace('National Park', 'NP')
                        .replace('National Reserve', 'NR')
                        .replace('Wildlife Sanctuary', 'WS')
                        .replace('Game Reserve', 'GR')}
                    </h2>
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
                    <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 md:px-5 py-3 md:py-4 rounded-lg font-bold text-sm md:text-base hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105" data-testid="button-request-quote">
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

          {parkTours.length > 0  && (
              <section className="bg-slate-800/30 py-10 md:py-12 mt-12 -mx-4 md:-mx-8 lg:-mx-0 lg:ml-[calc(-50vw+720px)] lg:mr-[calc(-50vw+720px)] lg:px-[calc(50vw-720px)]">
                <div className="max-w-[1440px]">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Featured {park.name} Tours</h3>

                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    {parkTours.map((tour) => (
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
                      onClick={() => handleViewAllTours(park.name)}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 md:py-4 px-6 md:px-10 rounded-xl text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 w-full sm:w-auto justify-center"
                      data-testid="button-view-all-tours-desktop"
                    >
                      All {totalparkTours} {park.name} Tours
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </section>
          )}
        </div>

        {!showMobileMenu && parkTours.length > 0 && (
          <section className="lg:hidden bg-slate-900 px-4 py-8">
            <div className="max-w-[1440px] mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6">Featured {park.name} Tours</h3>

              <div className="grid gap-6 mb-8">
                {parkTours.map((tour) => (
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
                  onClick={() => handleViewAllTours(park.name)}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-xl text-base transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 w-full sm:w-auto justify-center"
                  data-testid="button-view-all-safaris-mobile"
                >
                  All {totalparkTours} {park.name} Tours
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {showScrollTop && (
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
        )}
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
      {selectedPark ? (
        renderParkDetail()
      ) : (
        renderParksDirectory()
      )}


    </div>
  );
}

export default ParkDetail;

