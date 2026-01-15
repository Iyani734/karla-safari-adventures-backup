import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Trash2, Send, Heart, Compass,  } from 'lucide-react';

// SOUND EFFECTS
const playLikeSound = (soundUrl) => {
  try {
    const audio = new Audio(soundUrl);
    audio.volume = 0.5;
    audio.play().catch((error) => {
      console.warn('Could not play like sound:', error);
    });
  } catch (error) {
    console.warn('Error creating audio:', error);
  }
};

// FLOATING ANIMATION HOOK
const useFloatingAnimation = (isHovered, isExpanded) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [velocity, setVelocity] = useState({ x: 2, y: 1.5 });
  const animationRef = useRef(null);

  useEffect(() => {
    if (isHovered || isExpanded) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = () => {
      setPosition((prev) => {
        const cartWidth = 80;
        const cartHeight = 80;
        const maxX = window.innerWidth - cartWidth - 20;
        const maxY = window.innerHeight - cartHeight - 20;

        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        let newVelocityX = velocity.x;
        let newVelocityY = velocity.y;

        if (newX <= 0 || newX >= maxX) {
          newVelocityX = -velocity.x;
          newX = Math.max(0, Math.min(newX, maxX));
        }
        if (newY <= 0 || newY >= maxY) {
          newVelocityY = -velocity.y;
          newY = Math.max(0, Math.min(newY, maxY));
        }

        setVelocity({ x: newVelocityX, y: newVelocityY });

        return { x: newX, y: newY };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, isExpanded, velocity]);

  return position;
};

// ADDED TO CART NOTIFICATION
const AddedToCartNotification = ({ show, activity }) => (
  <AnimatePresence>

  </AnimatePresence>
);


// EMPTY CART SECTION
const EmptyCart = ({ isCustomPage }) => {
  const handleExploreClick = (e) => {
    e.preventDefault();
    
    if (isCustomPage) {
      // If we're already on the custom tour page, just scroll to activities
      const activitiesSection = document.getElementById('activities');
      if (activitiesSection) {
        activitiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // If we're on another page, navigate to custom tour page with activities hash
      window.location.href = '/tours/custom-trip#activities';
    }
  };

  return (
    <div className="p-8 text-center">
      <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <p className="text-gray-400">Your cart is empty</p>
      <p className="text-gray-500 text-sm mt-2">
        Like activities to add them here
      </p>

      <motion.button
        onClick={handleExploreClick}
        className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Compass className="w-5 h-5" />
        Explore Activities
      </motion.button>
    </div>
  );
};
// CART ITEM SECTION
const CartItem = ({ activity, index, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ delay: index * 0.05 }}
    className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50 hover:bg-slate-700 transition-all duration-300 group"
  >
    <div className="flex gap-3">
      <img
        src={activity.image}
        alt={activity.title}
        className="w-20 h-20 object-cover rounded-lg"
      />

      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-sm mb-1 line-clamp-1">
          {activity.title}
        </h4>
        <p className="text-gray-400 text-xs mb-1">
          {activity.country}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-orange-400 text-xs">
            {activity.duration}
          </span>
          <span className="text-gray-500 text-xs">•</span>
          <span className="text-gray-400 text-xs">
            {activity.difficulty}
          </span>
        </div>
      </div>

      <button
        onClick={() => onRemove(activity.id)}
        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg p-2 transition-all duration-300 h-fit"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);


// CART FOOTER SECTION
const CartFooter = ({ cartCount, onCheckout }) => (
  <div className="border-t border-slate-700 p-6 bg-slate-800/50">
    <motion.button
      onClick={onCheckout}
      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Send className="w-5 h-5" />
      Checkout ({cartCount} {cartCount === 1 ? 'Activity' : 'Activities'})
    </motion.button>
    <p className="text-gray-400 text-xs text-center mt-3">
      Our experts will create your custom itinerary
    </p>
  </div>
);


// CART PANEL SECTION
const CartPanel = ({
  isExpanded,
  cartCount,
  likedActivities,
  isCustomPage,
  onClose,
  onRemoveActivity,
  onCheckout,
  isMobile = false,
}) => (
  <AnimatePresence>
    {isExpanded && (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: isMobile ? 20 : -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: isMobile ? 20 : -20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`absolute ${
          isMobile ? 'bottom-20 right-0' : 'top-20 left-0'
        } w-96 max-w-[calc(100vw-2rem)] max-h-[600px] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Your Safari Cart</h2>
            <p className="text-orange-100 text-sm">
              {cartCount} {cartCount === 1 ? 'activity' : 'activities'} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {cartCount === 0 ? (
            <EmptyCart isCustomPage={isCustomPage} />
          ) : (
            <div className="p-6 space-y-3">
              <AnimatePresence>
                {likedActivities.map((activity, index) => (
                  <CartItem
                    key={activity.id}
                    activity={activity}
                    index={index}
                    onRemove={onRemoveActivity}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {cartCount > 0 && (
          <CartFooter cartCount={cartCount} onCheckout={onCheckout} />
        )}
      </motion.div>
    )}
  </AnimatePresence>
);


// CART BUTTON SECTION
const CartButton = ({ cartCount, isExpanded, onClick, shouldSpin, rotationCount }) => (
  <motion.button
    onClick={onClick}
    className="relative bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full p-4 shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 group"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      animate={{ rotate: rotationCount * 360 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <ShoppingCart className="w-8 h-8" />
    </motion.div>

    <AnimatePresence>
      {cartCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-2 -right-2 bg-white text-orange-600 font-bold rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-lg"
        >
          {cartCount}
        </motion.div>
      )}
    </AnimatePresence>

    {cartCount > 0 && (
      <motion.div
        className="absolute inset-0 rounded-full bg-orange-400"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    )}
  </motion.button>
);

// MAIN COMPONENT
const FloatingCart = ({
  likedActivities,
  onRemoveActivity,
  onCheckout,
  onCartClick, // ← Add this prop
  isCustomPage = false,
  likeSoundUrl = '/sounds/like.mp3'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [lastActivityAdded, setLastActivityAdded] = useState(null);
  const [rotationCount, setRotationCount] = useState(0);
  const cartRef = useRef(null);
  const previousCountRef = useRef(likedActivities.length);

  const position = useFloatingAnimation(isHovered, isExpanded);

  useEffect(() => {
    if (likedActivities.length > previousCountRef.current) {
      const newActivity = likedActivities[likedActivities.length - 1];
      setLastActivityAdded(newActivity);
      setShowNotification(true);
      playLikeSound(likeSoundUrl);

      // Trigger spin animation by incrementing rotation count
      setRotationCount(prev => prev + 1);

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
    previousCountRef.current = likedActivities.length;
  }, [likedActivities, likeSoundUrl]);

  const handleCheckout = () => {
    onCheckout(likedActivities);
    setIsExpanded(false);
  };

  const toggleCart = () => {
    // If onCartClick is provided and there are items, call it directly
    if (onCartClick && likedActivities.length > 0) {
      onCartClick();
    } else {
      // Otherwise toggle the cart panel (fallback behavior)
      setIsExpanded(!isExpanded);
    }
  };

  const cartCount = likedActivities.length;

  return (
    <>
      {/* DESKTOP FLOATING CART */}
      <motion.div
        ref={cartRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="md:block hidden"
      >
        <CartButton
          cartCount={cartCount}
          isExpanded={isExpanded}
          onClick={toggleCart}
          rotationCount={rotationCount}
        />

        <CartPanel
          isExpanded={isExpanded}
          cartCount={cartCount}
          likedActivities={likedActivities}
          isCustomPage={isCustomPage}
          onClose={() => setIsExpanded(false)}
          onRemoveActivity={onRemoveActivity}
          onCheckout={handleCheckout}
        />
      </motion.div>

      {/* MOBILE FLOATING CART */}
      <div className="md:hidden fixed bottom-6 right-6 z-[9999]">
        <CartButton
          cartCount={cartCount}
          isExpanded={isExpanded}
          onClick={toggleCart}
          rotationCount={rotationCount}
        />

        <CartPanel
          isExpanded={isExpanded}
          cartCount={cartCount}
          likedActivities={likedActivities}
          isCustomPage={isCustomPage}
          onClose={() => setIsExpanded(false)}
          onRemoveActivity={onRemoveActivity}
          onCheckout={handleCheckout}
          isMobile={true}
        />
      </div>

      {/* NOTIFICATION */}
      <AddedToCartNotification
        show={showNotification}
        activity={lastActivityAdded}
      />

      {/* STYLES */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.8);
        }
      `}</style>
    </>
  );
};




export default FloatingCart;