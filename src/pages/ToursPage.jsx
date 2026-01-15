import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Filter, Search, Star, ArrowRight, Wand2, DollarSign, X, ChevronUp, Heart, ChevronDown } from 'lucide-react';
import { eastAfricaTours } from '../lib/tourData';

const Button = ({ children, className = '', onClick, variant = 'default', size = 'default', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    default: 'bg-orange-500 text-white hover:bg-orange-600',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50',
  };

  const sizes = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1.5 text-xs',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const StarRating = ({ rating, reviews }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-gray-600" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-600" />
        ))}
        <span className="text-white font-medium ml-2">{rating}</span>
      </div>
      <div className="text-gray-400 text-xs">
        ({reviews} reviews)
      </div>
    </div>
  );
};

const ToursPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [viewingFavorites, setViewingFavorites] = useState(false);
  const [flyingHearts, setFlyingHearts] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef(null);

  useEffect(() => {
    loadFavorites();

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('view') === 'favorites') {
      setViewingFavorites(true);
    }

    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }

    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }

    const countryParam = urlParams.get('country');
    if (countryParam) {
      setSelectedCountry(countryParam);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUniqueCountries = () => {
    const countries = [...new Set(eastAfricaTours
      .filter(tour => tour.location !== 'East Africa & Beyond')
      .map(tour => tour.location))];
    return countries.sort();
  };

  const handleCountryFilter = (country) => {
    setSelectedCountry(country);
    setViewingFavorites(false);
    setIsCountryDropdownOpen(false);
    updateURL(searchTerm, selectedCategory, false, country);
  };

  const updateURL = (search, category, favorites, country) => {
    const url = new URL(window.location);

    if (search) {
      url.searchParams.set('search', search);
    } else {
      url.searchParams.delete('search');
    }

    if (category) {
      url.searchParams.set('category', category);
    } else {
      url.searchParams.delete('category');
    }

    if (favorites) {
      url.searchParams.set('view', 'favorites');
    } else {
      url.searchParams.delete('view');
    }

    if (country) {
      url.searchParams.set('country', country);
    } else {
      url.searchParams.delete('country');
    }

    window.history.pushState({}, '', url);
  };

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
    const handleFavoritesChange = () => {
      loadFavorites();
    };

    window.addEventListener('favoritesChanged', handleFavoritesChange);
    return () => window.removeEventListener('favoritesChanged', handleFavoritesChange);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const categories = [
    { id: '', label: 'All Tours', color: 'bg-gray-600 hover:bg-gray-700' },
    { id: 'luxury plus', label: 'Luxury Plus', color: 'bg-purple-600 hover:bg-purple-700' },
    { id: 'luxury', label: 'Luxury', color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'mid-range', label: 'Mid-Range', color: 'bg-green-600 hover:bg-green-700' },
    { id: 'budget', label: 'Budget', color: 'bg-yellow-600 hover:bg-yellow-700' },
    { id: 'shared tours', label: 'Shared Tours', color: 'bg-pink-600 hover:bg-pink-700' }
  ];

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setViewingFavorites(false);
    updateURL(value, selectedCategory, false, selectedCountry);
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setViewingFavorites(false);
    updateURL(searchTerm, categoryId, false, selectedCountry);

    if (window.innerWidth < 768) {
      setIsFilterModalOpen(false);
    }
  };

  const handleTourClick = (tourId) => {
    window.location.href = `/tours/${tourId}`;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedCountry('');
    setViewingFavorites(false);
    updateURL('', '', false, '');
  };

  const filteredTours = eastAfricaTours.filter(tour => {
    if (viewingFavorites) {
      if (!favorites.includes(tour.id)) return false;
    }

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
                          tour.title.toLowerCase().includes(searchLower) ||
                          tour.location.toLowerCase().includes(searchLower) ||
                          (tour.subLocation && tour.subLocation.toLowerCase().includes(searchLower)) ||
                          tour.description.toLowerCase().includes(searchLower) ||
                          tour.tags.some(tag => tag.toLowerCase().includes(searchLower));

    const matchesCategory = selectedCategory === '' ||
                           tour.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());

    const matchesCountry = selectedCountry === '' || tour.location === selectedCountry;

    return matchesSearch && matchesCategory && matchesCountry;
  });

  const getCurrentFilterLabel = () => {
    if (viewingFavorites) return 'My Favorites';
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.label : 'All Tours';
  };

  const getFilterColor = () => {
    if (viewingFavorites) return 'bg-gradient-to-r from-red-500 to-pink-500';

    const category = categories.find(cat => cat.id === selectedCategory);
    if (!category || selectedCategory === '') return 'bg-gradient-to-r from-orange-500 to-red-500';

    const colorMap = {
      'bg-purple-600': 'bg-gradient-to-r from-purple-500 to-purple-600',
      'bg-blue-600': 'bg-gradient-to-r from-blue-500 to-blue-600',
      'bg-green-600': 'bg-gradient-to-r from-green-500 to-green-600',
      'bg-yellow-600': 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      'bg-pink-600': 'bg-gradient-to-r from-pink-500 to-pink-600',
      'bg-gray-600': 'bg-gradient-to-r from-gray-500 to-gray-600'
    };

    return colorMap[category.color] || 'bg-gradient-to-r from-orange-500 to-red-500';
  };

  const getFilterIcon = () => {
    if (viewingFavorites) return <Heart className="w-5 h-5 fill-current" />;
    return <Filter className="w-5 h-5" />;
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
 
       <div className="pt-8 pb-4">
         <div className="container mx-auto px-4">
           <div className="text-center mb-4">
             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
               Discover Our Safari Adventures
             </h1>
             <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
               From budget-friendly expeditions to ultra-luxury escapes, find your perfect African safari experience
             </p>
           </div>
         </div>
       </div>
<div className="container mx-auto px-4 pb-6">
  <div className="max-w-7xl mx-auto space-y-4">
<div className="hidden md:flex flex-col items-center justify-center gap-4">
  <div className="relative max-w-5xl w-full">
    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-100 z-10" />
    <input
      type="text"
      placeholder="Search tours by destination, activity, or keyword..."
      className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none backdrop-blur-sm"
      value={searchTerm}
      onChange={(e) => handleSearchChange(e.target.value)}
    />
  </div>


      <div className="flex items-center justify-center flex-wrap gap-3">
        <div className="relative" ref={countryDropdownRef}>
          <Button
            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <MapPin className="w-4 h-4" />
            <span>{selectedCountry || 'All Countries'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
          </Button>

          {isCountryDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 bg-slate-800 border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 min-w-[200px] backdrop-blur-sm">
              <button
                onClick={() => handleCountryFilter('')}
                className={`w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors ${selectedCountry === '' ? 'bg-blue-600' : ''}`}
              >
                All Countries
              </button>
              {getUniqueCountries().map(country => (
                <button
                  key={country}
                  onClick={() => handleCountryFilter(country)}
                  className={`w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors ${selectedCountry === country ? 'bg-blue-600' : ''}`}
                >
                  {country}
                </button>
              ))}
            </div>
          )}
        </div>

        <Filter className="w-5 h-5 text-orange-400 flex-shrink-0" />

        {categories.map(category => (
          <Button
            key={category.id}
            onClick={() => handleCategoryFilter(category.id)}
            className={`${selectedCategory === category.id && !viewingFavorites ?
              'bg-orange-500 hover:bg-orange-600 text-white' :
              `${category.color} text-white`}
              px-6 py-2.5 text-sm rounded-full font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap`}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>

    <div className="md:hidden flex justify-center">
      <Button
        onClick={() => setIsFilterModalOpen(true)}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2"
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
        {(selectedCategory || viewingFavorites || selectedCountry) && (
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
            {[selectedCategory, selectedCountry, viewingFavorites].filter(Boolean).length}
          </span>
        )}
      </Button>
    </div>
  </div>
</div>
 
       {isFilterModalOpen && (
         <div className="fixed inset-0 z-50 md:hidden">
           <div
             className="absolute inset-0 bg-black/70 backdrop-blur-sm"
             onClick={() => setIsFilterModalOpen(false)}
           ></div>
 
           <div className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-3xl shadow-2xl border-t border-white/10 max-h-[80vh] overflow-y-auto">
             <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-white flex items-center">
                   <Filter className="w-6 h-6 mr-2 text-orange-400" />
                   Filter Tours
                 </h2>
                 <button
                   onClick={() => setIsFilterModalOpen(false)}
                   className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>
 
               <div className="mb-6 pb-6 border-b border-white/20">
                 <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                   <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                   Country
                 </h3>
 
                 <div className="space-y-2">
                   <button
                     onClick={() => handleCountryFilter('')}
                     className={`w-full ${selectedCountry === '' ?
                       'bg-orange-500 hover:bg-orange-600 text-white' :
                       'bg-slate-700 hover:bg-slate-600 text-white'}
                       px-6 py-4 text-base rounded-xl font-semibold transition-all duration-300 flex items-center justify-between`}
                   >
                     <span>All Countries</span>
                     {selectedCountry === '' && (
                       <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                         <div className="w-3 h-3 bg-white rounded-full"></div>
                       </div>
                     )}
                   </button>
 
                   {getUniqueCountries().map(country => (
                     <button
                       key={country}
                       onClick={() => handleCountryFilter(country)}
                       className={`w-full ${selectedCountry === country ?
                         'bg-orange-500 hover:bg-orange-600 text-white' :
                         'bg-slate-700 hover:bg-slate-600 text-white'}
                         px-6 py-4 text-base rounded-xl font-semibold transition-all duration-300 flex items-center justify-between`}
                     >
                       <span>{country}</span>
                       {selectedCountry === country && (
                         <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                           <div className="w-3 h-3 bg-white rounded-full"></div>
                         </div>
                       )}
                     </button>
                   ))}
                 </div>
               </div>
 
               <div className="mb-6">
                 <h3 className="text-lg font-semibold text-white mb-3">Category</h3>
                 <div className="space-y-3">
                   {categories.map(category => (
                     <button
                       key={category.id}
                       onClick={() => handleCategoryFilter(category.id)}
                       className={`w-full ${selectedCategory === category.id && !viewingFavorites ?
                         'bg-orange-500 hover:bg-orange-600 text-white' :
                         `${category.color} text-white`}
                         px-6 py-4 text-base rounded-xl font-semibold transition-all duration-300 flex items-center justify-between`}
                     >
                       <span>{category.label}</span>
                       {selectedCategory === category.id && !viewingFavorites && (
                         <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                           <div className="w-3 h-3 bg-white rounded-full"></div>
                         </div>
                       )}
                     </button>
                   ))}
                 </div>
               </div>
 
               <div className="flex gap-3">
                 <Button
                   onClick={() => {
                     clearFilters();
                     setIsFilterModalOpen(false);
                   }}
                   className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-3 rounded-xl"
                 >
                   Clear All
                 </Button>
                 <Button
                   onClick={() => setIsFilterModalOpen(false)}
                   className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl"
                 >
                   Apply Filters
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}
 
       {(selectedCountry || selectedCategory || searchTerm || viewingFavorites) && (
         <div className="container mx-auto px-4 mb-8">
           <div className={`${getFilterColor()} rounded-2xl p-6 shadow-lg backdrop-blur-sm border border-white/10`}>
             <div className="flex flex-col sm:flex-row items-center justify-between text-white">
               <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                 <div className="bg-white/20 rounded-full p-2">
                   {getFilterIcon()}
                 </div>
                 <div>
                   <h2 className="text-xl font-semibold">
                     Viewing: {selectedCountry && <span>{selectedCountry} - </span>}{getCurrentFilterLabel()}
                   </h2>
                   <p className="text-white/90 text-sm">
                     {filteredTours.length} {filteredTours.length === 1 ? 'tour' : 'tours'} found
                     {searchTerm && <span> matching "{searchTerm}"</span>}
                   </p>
                 </div>
               </div>
 
               <Button
                 onClick={clearFilters}
                 className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-300"
               >
                 <X className="w-4 h-4" />
                 <span>Clear All Filters</span>
               </Button>
             </div>
           </div>
         </div>
       )}
 
       <div className="container mx-auto px-4 pb-12">
         {filteredTours.length > 0 ? (
           <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
             {filteredTours.map((tour) => (
               <div
                 key={tour.id}
                 className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/10 flex flex-col min-h-[580px]"
               >
                 <div className="relative overflow-hidden h-60 flex-shrink-0">
                   <img
                     className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                     alt={tour.title}
                     src={tour.link}
                     style={{
                       width: '100%',
                       height: '100%',
                       objectFit: 'cover',
                       objectPosition: 'center'
                     }}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
 
                   {tour.badge && (
                     <div className={`absolute top-4 left-4 bg-gradient-to-r ${tour.badge.color} text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg`}>
                       {tour.badge.text}
                     </div>
                   )}
 
                   {tour.isCustom && (
                     <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center shadow-lg">
                       <Wand2 className="w-3 h-3 mr-1" />
                       Tailor-Made
                     </div>
                   )}
 
                   {!tour.isCustom && (
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         toggleFavorite(tour.id, e);
                       }}
                       className="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2.5 transition-all duration-300 transform hover:scale-110 shadow-lg group"
                     >
                       <Heart
                         className={`w-5 h-5 transition-all duration-300 ${
                           favorites.includes(tour.id)
                             ? 'text-red-500 fill-current'
                             : 'text-gray-600 group-hover:text-red-500'
                         }`}
                       />
                     </button>
                   )}
                 </div>
 
                 <div className="p-4 flex flex-col flex-1">
                   <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2 -mt-2 hover:text-orange-400 transition-colors leading-tight">
                     {tour.title}
                   </h3>
 
                   <div className="grid grid-cols-2 gap-2 mb-3">
                     <div className="flex items-center text-lg text-gray-300">
                       <MapPin className="w-5 h-5 mr-3 text-orange-400 flex-shrink-0" />
                       <span className="truncate">{tour.location}</span>
                     </div>
 
                     <div className="flex items-center text-lg text-gray-300">
                       <Calendar className="w-5 h-5 mr-3 text-orange-400 flex-shrink-0" />
                       <span className="truncate">{tour.duration}</span>
                     </div>
 
                     {!tour.isCustom && tour.rating && (
                       <div className="col-span-1">
                         <StarRating rating={tour.rating} reviews={tour.reviews} />
                       </div>
                     )}
 
                     {tour.pricePerPerson && (
                       <div className="flex items-center text-lg text-green-400 font-semibold">
                         <DollarSign className="w-5 h-5 mr-3 flex-shrink-0" />
                         <span>${tour.pricePerPerson}/person</span>
                       </div>
                     )}
                   </div>
 
                   <div className="flex mb-4 flex-1">
                     <p className="text-gray-300 text-base leading-relaxed line-clamp-4">
                       {tour.description}
                     </p>
                   </div>
 
                   {tour.isCustom && (
                     <div className="mb-4">
                       <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-3 backdrop-blur-sm shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                         <p className="text-purple-200 text-sm font-medium text-center">
                           Request your personalized quote and receive a detailed proposal within 24 hours
                         </p>
                       </div>
                     </div>
                   )}
 
                   <div className="mt-auto mb-4">
                     <Button
                       onClick={() => handleTourClick(tour.id)}
                       className={`w-full text-white font-semibold py-2.5 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 ${
                         tour.isCustom ?
                         'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700' :
                         'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                       }`}
                     >
                       {tour.isCustom ? 'Design Your Trip' : 'View Details'}
                       <ArrowRight className="ml-2 w-4 h-4 inline" />
                     </Button>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         ) : (
           <div className="text-center py-12">
             <div className="max-w-md mx-auto">
               {viewingFavorites ? (
                 <>
                   <Heart className="w-16 h-16 mx-auto mb-6 text-gray-600"/>
                   <h3 className="text-2xl font-bold text-white mb-3">No Favorites Yet</h3>
                   <p className="text-gray-400 mb-6 leading-relaxed">
                     Start adding tours to your favorites to see them here.
                   </p>
                 </>
               ) : (
                 <>
                   <Search className="w-16 h-16 mx-auto mb-6 text-gray-600"/>
                   <h3 className="text-2xl font-bold text-white mb-3">No Tours Found</h3>
                   <p className="text-gray-400 mb-6 leading-relaxed">
                     Try adjusting your search terms or selecting a different category.
                   </p>
                 </>
               )}
               <Button
                 onClick={clearFilters}
                 className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
               >
                 Clear Filters
               </Button>
             </div>
           </div>
         )}
       </div>
 
       {/* {showScrollTop && (
         <button
           onClick={scrollToTop}
           className="fixed bottom-8 right-8 z-50 group"
         >
           <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
 
             <div className="relative bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-full p-4 shadow-2xl border border-orange-400/30 backdrop-blur-sm transition-all duration-300">
               <div className="absolute inset-1 bg-gradient-to-r from-orange-300/20 to-red-400/20 rounded-full"></div>
 
               <ChevronUp className="w-6 h-6 text-white relative z-10 group-hover:animate-bounce" />
 
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
 
 export default ToursPage;
 