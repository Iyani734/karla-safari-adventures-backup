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
                onClick={onViewAllExpert}
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
                onClick={onViewAllUser}
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
      <div>
      <p>Hello</p>
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
        <div>
      <p>Hello</p>
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
          <div>
      <p>Hello</p>
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
      <div>
      <p>Hello</p>
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
    <div>
      <p>Hello</p>
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
          <button className="text-blue-400 hover:text-blue-300 font-bold text-base mb-3 transition-colors duration-200">
            › {park.name}
          </button>
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
    <div>
      <p>Hello</p>
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
    <div>
      <p>Hello</p>
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
     <div>
      <p>Hello</p>
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
   <div>
      <p>Hello</p>
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
   <div>
      <p>Hello</p>
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
<div className="lg:hidden relative bg-cover bg-center h-80 overflow-hidden" style={{ backgroundImage: `url(${activeSection === 'overview'   ? '/lions.webp' : (randomSeasonImages.displayImage || country.displayImage[0])})` }}>
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
  <div className="relative bg-cover bg-center h-72 md:h-80" style={{ backgroundImage: `url(${activeSection === 'overview' ? '/lions.webp' : (randomSeasonImages.displayImage || country.displayImage[0])})` }}>
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
              className="px-6 py-3 bg-slate-800/90 backdrop-blur-sm border-2 border-orange-500 text-white hover:bg-orange-500/20 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              data-testid="button-header-reviews"
            >
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span>{country.rating}</span>
              <span className="text-gray-300">- {country.reviewCount} Reviews</span>
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
      {selectedCountry ? (
        renderCountryDetail()
      ) : (
        <>
          <section className="relative bg-cover bg-center h-64 md:h-80" style={{ backgroundImage: 'url(https://images.pexels.com/photos/1670732/pexels-photo-1670732.webp?auto=compress&cs=tinysrgb&w=1200)' }}>
            <div className="absolute inset-0 bg-slate-900 bg-opacity-80"></div>
            <div className="relative h-full flex flex-col justify-center">
              <div className="w-full max-w-[1440px] mx-auto px-4 md:px-9">
                <div className="max-w-4xl">
                  <p className="text-orange-500 font-bold mb-2 md:mb-3 text-xs md:text-sm">About Karla Safari Adventures</p>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-white">
                    Your Gateway to <span className="block text-orange-500 mt-1">African Wilderness</span>
                  </h1>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    Explore Africa's spectacular wildlife and diverse cultures. Discover majestic elephants, powerful lions, and countless other species in their natural habitats.
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
                          onClick={() => handleCountrySelect(country.name)}
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
                            onClick={() => handleCountrySelect(country.name)}
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
                            <button className="text-sm md:text-base text-white hover:text-orange-500 text-left font-bold transition-colors duration-200">{park.name}</button>
                          </li>
                        ))}
                      </ul>
                      <button className="w-full px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded flex items-center justify-center gap-2 text-sm md:text-base hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105" data-testid={`button-all-parks-${country.name.toLowerCase()}`}>
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