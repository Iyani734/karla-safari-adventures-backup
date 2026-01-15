import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, Phone, Mail, Heart, Trash2, Calendar, DollarSign, Star, ArrowRight, Wand2 } from 'lucide-react';
import { eastAfricaTours } from '../lib/tourData';

const StarRating = ({ rating, reviews }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-3 h-3 text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-3 h-3 text-gray-600" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-3 h-3 text-gray-600" />
        ))}
        <span className="text-white font-medium ml-1 text-xs">{rating}</span>
      </div>
      <div className="text-gray-400 text-xs">
        ({reviews} reviews)
      </div>
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFavoritesPanel, setShowFavoritesPanel] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const topBarRef = useRef(null);
  const navRef = useRef(null);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (topBarRef.current) {
      setTopBarHeight(topBarRef.current.offsetHeight);
    }
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, [favorites]);

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

  useEffect(() => {
    const handleFavoritesChange = () => {
      loadFavorites();
    };

    window.addEventListener('favoritesChanged', handleFavoritesChange);

    const interval = setInterval(() => {
      loadFavorites();
    }, 1000);

    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
      clearInterval(interval);
    };
  }, []);

  const removeFavorite = (tourId) => {
    const updatedFavorites = favorites.filter(id => id !== tourId);
    setFavorites(updatedFavorites);
    localStorage.setItem('safari_favorites', JSON.stringify(updatedFavorites));
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    localStorage.setItem('safari_favorites', JSON.stringify([]));
    setShowFavoritesPanel(false);
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  const favoriteTours = eastAfricaTours.filter(tour => favorites.includes(tour.id));

  const handleTourClick = (tourId) => {
    setShowFavoritesPanel(false);
    window.location.href = `/tours/${tourId}`;
  };

  const handleViewAllFavorites = () => {
    window.location.href = '/tours?view=favorites';
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Tours', href: '/tours' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Activities', href: '/activities' },
    { name: 'Contact', href: '/contact' }
  ];

  const hasFavorites = favorites.length > 0;

  return (
    <>
      <div
        ref={topBarRef}
        className="bg-orange-600 text-white py-2.5 px-4 text-xs sm:text-sm md:fixed md:top-0 md:left-0 md:right-0 z-50"
      >
        <div className="container mx-auto">
          <div className="hidden lg:flex justify-between items-center">
            <div className="flex items-center space-x-4 xl:space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="tracking-wide">+254 745 969 305 / +254 717 849 140</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="tracking-wide">info@karlatoursandtravel@gmail.com</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Nairobi, Kenya</span>
              </div>

              <button
                onClick={handleViewAllFavorites}
                className="relative flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-all duration-300 group"
              >
                <Heart className={`w-4 h-4 ${hasFavorites ? 'fill-current text-red-200' : ''} group-hover:scale-110 transition-transform`} />
                <span className="font-semibold">My Favorites</span>
                {hasFavorites && (
                  <motion.span
                    key={favorites.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                  >
                    {favorites.length}
                  </motion.span>
                )}
              </button>
            </div>
          </div>

          <div className="hidden md:flex lg:hidden justify-between items-center">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs">+254 745 969 305</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs truncate max-w-[180px]">info@karlatoursandtravel@gmail.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs">Nairobi</span>
              </div>
            </div>
          </div>

          <div className="md:hidden flex justify-between items-center gap-2">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span className="text-xs truncate">+254 745 969 305 </span>
            </div>
            <div className="flex items-center space-x-1.5 flex-shrink-0">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="text-xs">Nairobi,Kenya</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block" style={{ height: `${topBarHeight}px` }} />

      <motion.header
        ref={navRef}
        className="sticky top-0 md:fixed md:left-0 md:right-0 z-40 bg-slate-900/95 backdrop-blur-md shadow-lg"
        style={{
          top: window.innerWidth >= 768 ? `${topBarHeight}px` : '0'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <a href="/">
              <motion.div
                className="flex items-center space-x-2 sm:space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm sm:text-base lg:text-xl">SA</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold text-white md:text-gradient leading-tight">Karla Safari Adventures</span>
                  <p className="text-xs text-orange-400 leading-tight">African Wildlife Tours</p>
                </div>
              </motion.div>
            </a>

            <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-orange-400 transition-colors duration-300 font-medium text-sm xl:text-base"
                >
                  <motion.span
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.name}
                  </motion.span>
                </a>
              ))}
              <button onClick={() => { setIsMenuOpen(false); window.location.href = `/contact` }} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 xl:px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm xl:text-base">
                Request a Quote
              </button>
            </div>

            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={handleViewAllFavorites}
                className="relative text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <Heart className={`w-5 h-5 ${hasFavorites ? 'fill-current text-red-400' : ''}`} />
                {hasFavorites && (
                  <motion.span
                    key={favorites.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {favorites.length}
                  </motion.span>
                )}
              </button>

              <button
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="lg:hidden mt-4 bg-slate-800/95 backdrop-blur-md rounded-lg p-4 shadow-xl"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <a
                        href={item.href}
                        className="block py-3 px-2 text-white hover:text-orange-400 hover:bg-white/5 rounded-lg transition-all duration-300 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-lg font-semibold shadow-lg"
                    onClick={() => { setIsMenuOpen(false); window.location.href = `/contact` }}
                  >
                    Request a Quote
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>

      <div className="hidden md:block" style={{ height: `${navHeight}px` }} />
    </>
  );
};

export default Header;
