// src/components/LikedActivities.jsx
import { useState, useEffect } from 'react';
import { Heart, MapPin, ChevronRight } from 'lucide-react';
import { getAllLikedActivities, COUNTRIES_DATA } from '../lib/activityData';

function LikedActivities() {
  const [likedActivities, setLikedActivities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [activityLikes, setActivityLikes] = useState({});

  // Load liked activities
  useEffect(() => {
    loadLikedActivities();
    loadActivityLikes();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadLikedActivities();
      loadActivityLikes();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('activityLikesChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('activityLikesChanged', handleStorageChange);
    };
  }, []);

  const loadLikedActivities = () => {
    const activities = getAllLikedActivities();
    setLikedActivities(activities);
  };

  const loadActivityLikes = () => {
    try {
      const stored = localStorage.getItem('safari_activity_likes');
      setActivityLikes(stored ? JSON.parse(stored) : {});
    } catch (error) {
      console.error('Error loading activity likes:', error);
    }
  };

  // Toggle like status
  const handleActivityLike = (activityId) => {
    try {
      const stored = localStorage.getItem('safari_activity_likes');
      const likes = stored ? JSON.parse(stored) : {};
      
      if (likes[activityId]) {
        delete likes[activityId];
      } else {
        likes[activityId] = true;
      }
      
      localStorage.setItem('safari_activity_likes', JSON.stringify(likes));
      setActivityLikes(likes);
      loadLikedActivities();
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('activityLikesChanged'));
    } catch (error) {
      console.error('Error toggling activity like:', error);
    }
  };

  // Get unique countries from liked activities
  const countries = ['all', ...new Set(likedActivities.map(a => a.country))];

  // Filter activities
  const filteredActivities = selectedCountry === 'all'
    ? likedActivities
    : likedActivities.filter(a => a.country === selectedCountry);

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            My Favorite Activities
          </h1>
          <p className="text-gray-400">
            {likedActivities.length} saved {likedActivities.length === 1 ? 'activity' : 'activities'}
          </p>
        </div>

        {/* Country Filter */}
        {likedActivities.length > 0 && (
          <div className="mb-6">
            <label className="text-gray-300 font-semibold mb-3 block">
              Filter by Country:
            </label>
            <div className="flex flex-wrap gap-2">
              {countries.map(country => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    selectedCountry === country
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'bg-slate-800 text-gray-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {country === 'all' ? 'All Countries' : country}
                  {country !== 'all' && (
                    <span className="ml-2 text-xs opacity-75">
                      ({likedActivities.filter(a => a.country === country).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Activities List */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              No favorite activities yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start exploring activities and save your favorites!
            </p>
            <button
              onClick={() => window.location.href = '/destinations'}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-300"
            >
              Explore Destinations
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="grid md:grid-cols-[300px_1fr] gap-6">
                  {/* Image */}
                  <div className="relative h-48 md:h-64 overflow-hidden group">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Like Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivityLike(activity.id);
                      }}
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2.5 transition-all duration-300 transform hover:scale-110 shadow-lg group z-10"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all duration-300 ${
                          activityLikes[activity.id]
                            ? 'text-red-500 fill-current'
                            : 'text-gray-600 group-hover:text-red-500'
                        }`}
                      />
                    </button>

                    {/* Activity Number Badge */}
                    <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-1 border border-orange-500/50">
                      <span className="text-2xl font-thin text-orange-500">
                        {activity.activityNumber}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Country Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className="text-orange-400 font-semibold">
                        {activity.country}
                      </span>
                    </div>

                    {/* Title and Subtitle */}
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-gray-400 italic font-medium mb-4">
                      {activity.subtitle}
                    </p>

                    {/* Description */}
                    <div className="text-gray-300 text-sm leading-relaxed mb-4">
                      {Array.isArray(activity.description) ? (
                        <p className="line-clamp-3">{activity.description[0]}</p>
                      ) : (
                        <p className="line-clamp-3">{activity.description}</p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => window.location.href = `/destinations/${activity.country.toLowerCase()}/things-to-do`}
                        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                      >
                        View Full Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LikedActivities;
  