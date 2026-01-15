import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, ShoppingCart, Star } from 'lucide-react';

const ActivityDetailModal = ({ activity, isOpen, onClose, onToggleCart }) => {
  if (!activity) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-[9998]"
            onClick={onClose}
          />

<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ duration: 0.3 }}
  className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
>
            <div className="bg-slate-950/50 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-white/10 ring-1 ring-white/20">
              <div className="relative h-64 md:h-96 flex-shrink-0">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  {activity.country}
                </div>

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/20 transition-colors border border-white/20"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {activity.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {activity.duration && (
                      <div className="flex items-center gap-2 text-orange-400 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium text-sm">{activity.duration}</span>
                      </div>
                    )}
                    {activity.difficulty && (
                      <div className={`px-3 py-1.5 rounded-full font-semibold text-sm backdrop-blur-sm border ${
                        activity.difficulty.toLowerCase() === 'easy' ? 'bg-green-500/10 text-green-300 border-green-500/20' :
                        activity.difficulty.toLowerCase() === 'moderate' ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' :
                        'bg-red-500/10 text-red-300 border-red-500/20'
                      }`}>
                        {activity.difficulty}
                      </div>
                    )}
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {activity.description}
                    </p>

                    {activity.longDescription && (
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line mb-6">
                        {activity.longDescription}
                      </div>
                    )}
                  </div>

                  {activity.highlights && activity.highlights.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Star className="w-5 h-5 text-orange-400" />
                        Highlights
                      </h2>
                      <ul className="space-y-2">
                        {activity.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-300 text-sm">
                            <span className="text-orange-400 mt-1">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activity.included && activity.included.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-xl font-bold text-white mb-3">What's Included</h2>
                      <ul className="space-y-2">
                        {activity.included.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-300 text-sm">
                            <span className="text-green-400">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activity.requirements && activity.requirements.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-xl font-bold text-white mb-3">Requirements</h2>
                      <ul className="space-y-2">
                        {activity.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-300 text-sm">
                            <span className="text-orange-400">!</span>
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-8 p-5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-3">Ready to Experience This?</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Add this activity to your cart and let's create a custom safari itinerary that includes this amazing experience.
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCart(activity.id);
                      }}
                      className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        activity.isLiked
                          ? 'bg-slate-700 text-white hover:bg-slate-600'
                          : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>{activity.isLiked ? 'Remove from Cart' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActivityDetailModal;
