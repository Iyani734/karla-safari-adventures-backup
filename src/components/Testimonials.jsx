import { useState, useEffect, useMemo } from 'react';
import { Star, Quote, MapPin, Heart } from 'lucide-react';
import { COUNTRIES_DATA } from '../lib/countriesData';

const STORAGE_KEYS = {
  LIKES: 'testimonials_review_likes',
};
  const scrollToContact = () => {
    const section = document.getElementById("contact");
    section?.scrollIntoView({ behavior: "smooth" });
  };
const Testimonials = () => {
  const [reviewLikes, setReviewLikes] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LIKES);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(reviewLikes));
    } catch (error) {
      console.error('Failed to save likes to localStorage:', error);
    }
  }, [reviewLikes]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const allReviews = useMemo(() => {
    return shuffleArray(
      COUNTRIES_DATA.flatMap(country =>
         country.reviewsContent.allUserReviews  || []
      )
    ).slice(0, 6);
  }, []);

  const getCountryFlag = (countryCode) => {
    return `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.webp`;
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 text-amber-400 fill-amber-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-amber-400" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  const handleLikeClick = (reviewId) => {
    setReviewLikes(prev => {
      const newLikes = { ...prev };
      if (newLikes[reviewId]) {
        delete newLikes[reviewId];
      } else {
        newLikes[reviewId] = true;
      }
      return newLikes;
    });
  };

  return (
    <section id="testimonials" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <span className="text-orange-500 font-semibold text-base sm:text-lg mb-3 sm:mb-4 block">
            What Our Travelers Say
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-5 md:mb-6 px-4">
            <span className="text-white">
              Stories from the
            </span>
            <span className="block mt-1 sm:mt-2 text-orange-600">
              African Wilderness
            </span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Hear from adventurers who have experienced the magic of Africa with us. Their stories inspire our commitment to creating unforgettable journeys.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
          {allReviews.map((review) => {
            const reviewId = `testimonial-${review.id}`;
            const isLiked = reviewLikes[reviewId] === true;
            const displayLikes = isLiked ? review.helpful + 1 : review.helpful;

            return (
              <div
                key={review.id}
                className="group relative bg-white rounded-3xl p-6 sm:p-7 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 flex flex-col"
              >
                <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>

                <div className="relative z-10 pt-4 sm:pt-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex-shrink-0">
                      <img
                        src={getCountryFlag(review.countryFlag)}
                        alt={review.country}
                        className="w-10 h-8 sm:w-12 sm:h-9 rounded object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-gray-900 font-bold text-base sm:text-lg truncate">{review.author}</h3>
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs sm:text-sm">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{review.country}</span>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 leading-snug">
                    {review.title}
                  </h4>

                  <div className="flex items-center gap-2 mb-4 sm:mb-5">
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-amber-500 font-bold text-sm sm:text-base ml-1">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base flex-grow">
                    {review.excerpt}
                  </p>

                  <div className="mt-auto space-y-2 sm:space-y-3">
                    <a
                      href={`/tours/${review.tourId}`}
                      className="inline-block w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 text-center"
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{review.tourTaken}</span>
                        <svg className="w-4 h-4 flex-shrink-0 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </a>

                    <div className="text-gray-500 text-xs">
                      {review.date}
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
                      <button
                        onClick={() => handleLikeClick(reviewId)}
                        className={`flex items-center gap-1.5 sm:gap-2 transition-colors duration-200 ${
                          isLiked
                            ? 'text-pink-500'
                            : 'text-gray-600 hover:text-pink-500'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isLiked ? 'fill-pink-500' : ''}`} />
                        <span className="font-semibold">{displayLikes} people found this helpful</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 sm:mt-16 md:mt-20 text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-5">
            Ready for Your African Adventure?
          </h3>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
            Join thousands of travelers who have discovered the magic of Africa. Start planning your unforgettable journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center px-4">
            <button onClick={() => window.location.href = `/tours`} className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base">
              Explore Tours
            </button>
            <button onClick={scrollToContact} className="border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base">
              Get Free Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
