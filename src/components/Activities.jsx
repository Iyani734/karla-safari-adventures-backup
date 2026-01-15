import { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Clock,
  ShoppingCart,
  X,
  Compass,
  Camera,
  Award,
  Users,
  Star
} from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import FloatingCart from '../pages/FloatingCart';
import CheckoutModal from '../pages/CheckoutModal';
import { getAllActivitiesWithLikes } from '../lib/activityData';
import ActivityDetailModal from './ActivityDetailModal'
const AddedToCartNotification = ({ show, activity }) => (
  <AnimatePresence>
    {show && activity && (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-20 right-6 z-[10000] w-[90%] max-w-md md:w-96"
      >
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-2xl p-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-white" />
            <div className="flex-1">
              <h3 className="text-white font-bold text-base">Added to Cart!</h3>
              <p className="text-white/90 text-sm line-clamp-1">{activity.title}</p>
            </div>
            <img
              src={activity.image}
              alt={activity.title}
              className="w-14 h-14 rounded-lg object-cover"
            />
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ActivityCard = memo(({ activity, onLike, onClick }) => {
  return (
    <div
      onClick={() => onClick(activity)}
      className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-800 cursor-pointer"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={activity.image}
          alt={activity.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onLike(activity.id);
          }}
          className={`absolute top-3 right-3 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg transition-all duration-200 z-10 ${
            activity.isLiked
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="text-sm font-medium">
            {activity.isLiked ? 'In Cart' : 'Add'}
          </span>
        </button>

        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium border border-slate-700 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {activity.country}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-300 transition-colors line-clamp-2">
          {activity.title}
        </h3>

        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {activity.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          {activity.duration && (
            <div className="flex items-center gap-1.5 text-orange-400">
              <Clock className="w-4 h-4" />
              <span>{activity.duration}</span>
            </div>
          )}
          {activity.difficulty && (
            <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              activity.difficulty.toLowerCase() === 'easy' ? 'bg-green-500/20 text-green-300' :
              activity.difficulty.toLowerCase() === 'moderate' ? 'bg-yellow-500/20 text-yellow-300' :
              'bg-red-500/20 text-red-300'
            }`}>
              {activity.difficulty}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ActivityCard.displayName = 'ActivityCard';

const Activity = () => {
  const { toast } = useToast();
  const [allActivities, setAllActivities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [likedActivitiesForCart, setLikedActivitiesForCart] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationActivity, setNotificationActivity] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const notificationTimeoutRef = useRef(null);

  const [activityLikes, setActivityLikes] = useState(() => {
    try {
      const stored = localStorage.getItem('safari_activity_likes');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading activity likes from localStorage:', error);
      return {};
    }
  });

  useEffect(() => {
    const activities = getAllActivitiesWithLikes();
    const activitiesWithLikes = activities.map(activity => ({
      ...activity,
      isLiked: activityLikes[activity.id] || false
    }));
    const sortedActivities = activitiesWithLikes.sort((a, b) => {
      if (a.isLiked && !b.isLiked) return -1;
      if (!a.isLiked && b.isLiked) return 1;
      return 0;
    });
    setAllActivities(sortedActivities);
  }, [activityLikes]);

  useEffect(() => {
    try {
      localStorage.setItem('safari_activity_likes', JSON.stringify(activityLikes));
      const likedActivitiesArray = getAllActivitiesWithLikes().filter(
        activity => activityLikes[activity.id]
      );
      setLikedActivitiesForCart(likedActivitiesArray);
    } catch (error) {
      console.error('Error saving activity likes to localStorage:', error);
    }
  }, [activityLikes]);

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  const handleActivityLike = (activityId) => {
    const activity = allActivities.find(a => a.id === activityId);
    const isCurrentlyLiked = activityLikes[activityId];

    setActivityLikes(prev => {
      const newLikes = { ...prev };
      if (isCurrentlyLiked) {
        delete newLikes[activityId];
      } else {
        newLikes[activityId] = true;
        if (activity) {
          if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
          }
          setNotificationActivity(activity);
          setShowNotification(true);
          notificationTimeoutRef.current = setTimeout(() => {
            setShowNotification(false);
            setTimeout(() => setNotificationActivity(null), 300);
          }, 3000);
        }
      }
      return newLikes;
    });
  };

  const handleRemoveFromCart = (activityId) => {
    setActivityLikes(prev => {
      const newLikes = { ...prev };
      delete newLikes[activityId];
      return newLikes;
    });
    toast({
      title: "Activity Removed",
      description: "Activity removed from your cart",
      variant: "default"
    });
  };

  const handleCheckout = (activities) => {
    if (activities.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add some activities to your cart first",
        variant: "destructive"
      });
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleActivityClick = (activity) => {
    const activityWithLikeStatus = {
      ...activity,
      isLiked: activityLikes[activity.id] || false
    };
    setSelectedActivity(activityWithLikeStatus);
  };

  const countries = [
    { name: 'Kenya', value: 'kenya' },
    { name: 'Tanzania', value: 'tanzania' },
    { name: 'Uganda', value: 'uganda' },
    { name: 'Rwanda', value: 'rwanda' },
    { name: 'South Africa', value: 'south-africa' }
  ];

  const getCountryCount = (countryValue) => {
    if (countryValue === 'all') return allActivities.length;
    return allActivities.filter(
      a => a.country.toLowerCase().replace(/\s+/g, '-') === countryValue
    ).length;
  };

  const getFilteredActivities = () => {
    let filtered = [...allActivities];

    if (selectedCountry !== 'all') {
      filtered = filtered.filter(
        activity => activity.country.toLowerCase().replace(/\s+/g, '-') === selectedCountry
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        activity =>
          activity.title?.toLowerCase().includes(query) ||
          activity.description?.toLowerCase().includes(query) ||
          activity.country?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredActivities = getFilteredActivities();
  const totalLiked = Object.keys(activityLikes).length;

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <section className="bg-gradient-to-b from-slate-800 to-slate-900 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Explore Activities for Your Custom Safari
            </h1>
            <p className="text-gray-400 text-base md:text-lg mb-2">
              Browse activities from different destinations to help inspire your perfect safari itinerary.
            </p>
            <p className="text-gray-500 text-sm md:text-base">
              Activities you've liked will appear first.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedCountry('all')}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
                selectedCountry === 'all'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              All Destinations <span className="text-sm ml-1">({getCountryCount('all')})</span>
            </button>
            {countries.map((country) => (
              <button
                key={country.value}
                onClick={() => setSelectedCountry(country.value)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
                  selectedCountry === country.value
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {country.name} <span className="text-sm ml-1">({getCountryCount(country.value)})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">No Activities Found</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? `No activities match your search for "${searchQuery}".`
                  : 'No activities match your current filters.'}
              </p>
              <button
                onClick={() => {
                  setSelectedCountry('all');
                  setSearchQuery('');
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onLike={handleActivityLike}
                  onClick={handleActivityClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-slate-800/50 border-t border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Let's Create Your Perfect Safari Experience
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Selected activities that interest you? Let's build a custom itinerary that brings your
              African adventure dreams to life.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/tours/custom-trip">
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
                  <Compass className="w-5 h-5" />
                  Plan Custom Safari
                </button>
              </Link>

              <Link to="/tours">
                <button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold border border-slate-700 hover:border-slate-600 transition-all duration-200 flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  View Package Tours
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <Users className="w-7 h-7 text-orange-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white mb-1">1200+</div>
                <div className="text-xs text-gray-400">Happy Travelers</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <Star className="w-7 h-7 text-orange-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white mb-1">4.9/5</div>
                <div className="text-xs text-gray-400">Average Rating</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <Award className="w-7 h-7 text-orange-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white mb-1">4+</div>
                <div className="text-xs text-gray-400">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FloatingCart
        likedActivities={likedActivitiesForCart}
        onRemoveActivity={handleRemoveFromCart}
        onCheckout={handleCheckout}
        onCartClick={() => {
          if (likedActivitiesForCart.length > 0) {
            handleCheckout(likedActivitiesForCart);
          }
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        activities={likedActivitiesForCart}
        onRemoveActivity={handleRemoveFromCart}
      />

      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onToggleCart={handleActivityLike}
      />

      <AddedToCartNotification
        show={showNotification}
        activity={notificationActivity}
      />
    </div>
  );
};

export default Activity;
