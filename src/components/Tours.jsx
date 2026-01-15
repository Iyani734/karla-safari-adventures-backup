import { useState, useEffect, useMemo } from 'react';
import { Calendar, MapPin, Star, DollarSign, Heart, ArrowRight } from 'lucide-react';
import { eastAfricaTours } from '../lib/tourData';

const Tours = () => {
  const [favorites, setFavorites] = useState([]);
  const [flyingHearts, setFlyingHearts] = useState([]);

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

  const handleTourClick = (tourId) => {
    window.location.href = `/tours/${tourId}`;
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-slate-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const categorizeToursByTags = () => {
    const luxury = [];
    const midRange = [];
    const budget = [];

    eastAfricaTours.forEach(tour => {
      const tagsLower = tour.tags.map(tag => tag.toLowerCase());

      if (tagsLower.some(tag => tag.includes('luxury'))) {
        luxury.push(tour);
      } else if (tagsLower.some(tag => tag.includes('mid-range') || tag === 'mid range')) {
        midRange.push(tour);
      } else if (tagsLower.some(tag => tag.includes('budget'))) {
        budget.push(tour);
      }
    });

    return { luxury, midRange, budget };
  };

  const getRandomTours = (tours, count) => {
    if (tours.length === 0) return [];

    const countries = Array.from(new Set(tours.map(tour => tour.location)));
    const toursPerCountry = Math.ceil(count / countries.length);

    let selectedTours = [];

    countries.forEach(country => {
      const countryTours = tours.filter(tour => tour.location === country);
      const shuffled = [...countryTours].sort(() => Math.random() - 0.5);
      selectedTours = [...selectedTours, ...shuffled.slice(0, toursPerCountry)];
    });

    const finalShuffled = selectedTours.sort(() => Math.random() - 0.5);
    return finalShuffled.slice(0, count);
  };

  const { luxury, midRange, budget } = useMemo(() => categorizeToursByTags(), []);
  const luxuryTours = useMemo(() => getRandomTours(luxury, 3), [luxury]);
  const midRangeTours = useMemo(() => getRandomTours(midRange, 3), [midRange]);
  const budgetTours = useMemo(() => getRandomTours(budget, 3), [budget]);

  const renderTourCard = (tour) => (
    <div
      key={tour.id}
      className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 bg-slate-800/50 border border-slate-700/50 flex flex-col cursor-pointer"
      onClick={() => handleTourClick(tour.id)}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={`${tour.title} safari tour in ${tour.location}`}
          src={tour.link}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {tour.badge && (
          <div className={`absolute top-4 left-4 bg-gradient-to-r ${tour.badge.color} px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg`}>
            {tour.badge.text}
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(tour.id, e);
          }}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2.5 transition-all duration-300 transform hover:scale-110 shadow-lg z-10"
          aria-label="Add to favorites"
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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 font-medium text-base">{tour.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            {renderStars(tour.rating)}
            <span className="text-white text-sm ml-1">
              {tour.rating}
              {tour.reviews && <span className="text-gray-400"> ({tour.reviews} reviews)</span>}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors line-clamp-2">
          {tour.title}
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-gray-300 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{tour.duration}</span>
          </div>
          <div className="flex items-center text-green-400 font-bold">
            <DollarSign className="w-4 h-4" />
            <span className="text-base">${tour.pricePerPerson}/person</span>
          </div>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
          {tour.description}
        </p>

        <button
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-full py-3 text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            handleTourClick(tour.id);
          }}
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <section id="tours" className="py-12 sm:py-20 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
      {flyingHearts.map(heart => (
        <div
          key={heart.id}
          className="fixed pointer-events-none z-[100]"
          style={{
            left: 0,
            top: 0,
            animation: 'flyToFavorites 1.2s ease-out forwards'
          }}
        >
          <Heart className="w-8 h-8 text-red-500 fill-current drop-shadow-lg" />
        </div>
      ))}

      <style>{`
        @keyframes flyToFavorites {
          0% {
            transform: translate(var(--start-x), var(--start-y)) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(calc((var(--start-x) + var(--end-x)) / 2), calc((var(--start-y) + var(--end-y)) / 2 - 100px)) scale(1.5);
            opacity: 0.8;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>

      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-red-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-orange-400 font-semibold text-base sm:text-lg mb-3 sm:mb-4 block">
            Safari Packages
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Choose Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              African Adventure
            </span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto px-4 sm:px-0">
            From luxury escapes to budget-friendly adventures, discover our carefully curated safari experiences across Africa's most iconic destinations. Every tour features expert guides and authentic wildlife encounters.
          </p>
        </div>

        {luxuryTours.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Luxury Safaris</h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  Premium experiences with exclusive accommodations and personalized service
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-600/20 border border-orange-500/30 rounded-full">
                <Star className="w-5 h-5 text-orange-400 fill-current" />
                <span className="text-orange-400 font-bold">Premium</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {luxuryTours.map(tour => renderTourCard(tour))}
            </div>
          </div>
        )}

        {midRangeTours.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Mid-Range Safaris</h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  Excellent value with comfortable accommodations and great wildlife viewing
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 border border-blue-500/30 rounded-full">
                <Star className="w-5 h-5 text-blue-400 fill-current" />
                <span className="text-blue-400 font-bold">Great Value</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {midRangeTours.map(tour => renderTourCard(tour))}
            </div>
          </div>
        )}

        {budgetTours.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Budget Safaris</h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  Affordable adventures without compromising on wildlife experiences
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-teal-600/20 border border-green-500/30 rounded-full">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold">Best Price</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {budgetTours.map(tour => renderTourCard(tour))}
            </div>
          </div>
        )}

        <div className="text-center mt-12 sm:mt-16 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 sm:p-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Can't Find the Perfect Tour?
          </h3>
          <p className="text-gray-300 mb-6 text-base sm:text-lg max-w-2xl mx-auto">
            We specialize in creating custom safari experiences tailored to your preferences, budget, and travel dates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => window.location.href = `tours/custom-trip`} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
              Create Custom Tour
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => window.location.href = `tours`} className="w-full sm:w-auto px-8 py-4 border-2 border-orange-500 text-white hover:bg-orange-500/10 font-bold rounded-full text-base sm:text-lg transition-all duration-300">
              View All Tours
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tours;
