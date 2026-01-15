import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Star, ArrowDown, ArrowUp } from 'lucide-react';

const STORAGE_KEYS = {
  PAGE: 'user_reviews_page',
  SORT: 'user_reviews_sort',
  LIKES: 'safari_user_review_likes',
  RATING_DIRECTION: 'user_reviews_rating_direction'
};

const REVIEWS_PER_PAGE = 6;
const CHAR_LIMIT = 580;

const StarRating = ({ rating }) => {
  const getStarFill = (starPosition) => {
    const difference = rating - starPosition + 1;

    if (difference >= 1) {
      return 'fill-yellow-400 text-yellow-400';
    } else if (difference > 0) {
      return 'text-yellow-400';
    } else {
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
                <Star className="w-4 h-4 text-gray-600 absolute" />
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

const useUserReviewsState = (countryName) => {
  const getStorageKey = (key) => `${key}_${countryName.toLowerCase()}`;

  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const stored = localStorage.getItem(getStorageKey(STORAGE_KEYS.PAGE));
      return stored ? parseInt(stored, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [sortBy, setSortBy] = useState(() => {
    try {
      const stored = localStorage.getItem(getStorageKey(STORAGE_KEYS.SORT));
      return stored || 'helpful';
    } catch {
      return 'helpful';
    }
  });

  const [ratingDirection, setRatingDirection] = useState(() => {
    try {
      const stored = localStorage.getItem(getStorageKey(STORAGE_KEYS.RATING_DIRECTION));
      return stored || 'desc';
    } catch {
      return 'desc';
    }
  });

  const [reviewLikes, setReviewLikes] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LIKES);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [expandedReviews, setExpandedReviews] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem(getStorageKey(STORAGE_KEYS.PAGE), currentPage.toString());
    } catch (error) {
      console.error('Failed to save page to localStorage:', error);
    }
  }, [currentPage, countryName]);

  useEffect(() => {
    try {
      localStorage.setItem(getStorageKey(STORAGE_KEYS.SORT), sortBy);
    } catch (error) {
      console.error('Failed to save sort to localStorage:', error);
    }
  }, [sortBy, countryName]);

  useEffect(() => {
    try {
      localStorage.setItem(getStorageKey(STORAGE_KEYS.RATING_DIRECTION), ratingDirection);
    } catch (error) {
      console.error('Failed to save rating direction to localStorage:', error);
    }
  }, [ratingDirection, countryName]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(reviewLikes));
    } catch (error) {
      console.error('Failed to save likes to localStorage:', error);
    }
  }, [reviewLikes]);

  const resetState = () => {
    try {
      localStorage.removeItem(getStorageKey(STORAGE_KEYS.PAGE));
      localStorage.removeItem(getStorageKey(STORAGE_KEYS.SORT));
      localStorage.removeItem(getStorageKey(STORAGE_KEYS.RATING_DIRECTION));
      setCurrentPage(1);
      setSortBy('helpful');
      setRatingDirection('desc');
      setExpandedReviews({});
    } catch (error) {
      console.error('Failed to reset state:', error);
    }
  };

  return {
    currentPage,
    setCurrentPage,
    sortBy,
    setSortBy,
    ratingDirection,
    setRatingDirection,
    reviewLikes,
    setReviewLikes,
    expandedReviews,
    setExpandedReviews,
    resetState
  };
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

const SortButtons = ({ sortBy, ratingDirection, onSortChange }) => {
  const sortOptions = [
    { value: 'helpful', label: 'Most Helpful' },
    { value: 'rating', label: 'Rating' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' }
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-gray-300 font-semibold text-sm mr-1">Sort By:</span>
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onSortChange(option.value)}
          className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-xs md:text-sm flex items-center gap-1.5 ${
            sortBy === option.value
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
              : 'bg-slate-800 text-gray-300 hover:text-white'
          }`}
          data-testid={`button-sort-${option.value}`}
        >
          {option.label}
          {option.value === 'rating' && sortBy === 'rating' && (
            ratingDirection === 'desc'
              ? <ArrowDown className="w-3.5 h-3.5" />
              : <ArrowUp className="w-3.5 h-3.5" />
          )}
        </button>
      ))}
    </div>
  );
};

const RatingSidebar = ({ country, onWriteReview }) => {
  const ratingBreakdown = [5, 4, 3, 2, 1].map(rating => ({
    stars: rating,
    count: country.reviewsContent.allUserReviews.filter(r => Math.round(r.rating) === rating).length
  }));

  const totalReviews = country.reviewsContent.allUserReviews.length;

  return (
    <div className="lg:sticky lg:top-32 h-fit">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-6">Average User Rating</h3>
        <div className="flex items-center gap-3 mb-6">
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

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-6">Rating Breakdown</h3>
        <div className="space-y-3">
          {ratingBreakdown.map((item) => {
            const percentage = item.count > 0
              ? (item.count / totalReviews) * 100
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
         onClick={() => window.location.href = `/write-review`}
        className="w-full px-6 py-3 border-2 border-orange-500 text-white hover:bg-orange-500/10 font-bold rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
      >
        Write a User Review →
      </button>
    </div>
  );
};

const ReviewCard = ({
  review,
  isExpanded,
  isLiked,
  displayLikes,
  onToggleExpanded,
  onToggleLike
}) => {
  const Rating = Math.round((review.birdingRating + review.sceneryRating + review.bushVibe + review.wildlifeRating) / 4 * 10) / 10;

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:shadow-2xl transition-all duration-300">
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
                  src={`https://flagcdn.com/w40/${review.countryFlag.toLowerCase()}.webp`}
                  alt={`${review.countryFlag}`}
                  className="w-5 h-4 object-cover rounded-sm"
                />
                <span>{review.countryFlag}</span>
                <span>•</span>
                <span>Reviewed: {review.date}</span>
              </div>
              {review.tourTaken && (
                <button
                  onClick={() => {
                    window.location.href = `/tours/${review.tourId}`;
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
          <StarRating rating={Rating} />
          <span className="text-white font-bold">{Rating}/5</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Wildlife</span>
          <StarRating rating={review.wildlifeRating} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Bush Vibe</span>
          <StarRating rating={review.bushVibe} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Scenery</span>
          <StarRating rating={review.sceneryRating} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Birding</span>
          <StarRating rating={review.birdingRating} />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {isExpanded || review.fullReview.length <= CHAR_LIMIT
            ? review.fullReview
            : `${review.fullReview.slice(0, CHAR_LIMIT)}...`
          }
        </p>
        {review.fullReview.length > CHAR_LIMIT && (
          <button
            onClick={onToggleExpanded}
            className="text-orange-500 hover:text-orange-400 font-bold text-sm mt-3 transition-colors duration-200"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLike}
            className={`flex items-center gap-2 transition-colors duration-200 ${
              isLiked
                ? 'text-orange-500'
                : 'text-gray-400 hover:text-orange-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-orange-500' : ''}`} />
            <span className="text-sm font-bold">{displayLikes}</span>
          </button>
          <span className="text-gray-400 text-sm">found this helpful</span>
        </div>
      </div>
    </div>
  );
};

export const AllUserReviews = ({ country, onBack, eastAfricaTours, sidebarLinks }) => {
  const {
    currentPage,
    setCurrentPage,
    sortBy,
    setSortBy,
    ratingDirection,
    setRatingDirection,
    reviewLikes,
    setReviewLikes,
    expandedReviews,
    setExpandedReviews,
    resetState
  } = useUserReviewsState(country.name);

  const handleSortChange = (newSort) => {
    if (newSort === 'rating' && sortBy === 'rating') {
      setRatingDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(newSort);
      if (newSort === 'rating') {
        setRatingDirection('desc');
      }
    }
    setCurrentPage(1);
  };

  const sortedReviews = [...country.reviewsContent.allUserReviews].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    if (sortBy === 'rating') {
      return ratingDirection === 'desc'
        ? b.rating - a.rating
        : a.rating - b.rating;
    }
    if (sortBy === 'newest') {
      const dateA = new Date(a.date || '2025-01-01');
      const dateB = new Date(b.date || '2025-01-01');
      return dateB.getTime() - dateA.getTime();
    }
    if (sortBy === 'oldest') {
      const dateA = new Date(a.date || '2025-01-01');
      const dateB = new Date(b.date || '2025-01-01');
      return dateA.getTime() - dateB.getTime();
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const currentReviews = sortedReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleReadMore = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
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

  const handleBack = () => {
    resetState();
    onBack();
  };

  const countryTours = eastAfricaTours?.filter(
    tour => tour.location.toLowerCase() === country.name.toLowerCase()
  ) || [];
  const totalCountryTours = countryTours.length;

  return (
    <div id="all-user-reviews-top" className="min-h-screen bg-slate-900 lg:p-4 lg:py-8">
      <div className="max-w-[1440px] mx-auto px-4 py-6 lg:p-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white hover:text-orange-500 mb-6 transition-colors duration-200"
          data-testid="button-back-to-reviews"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-bold">Back to Reviews</span>
        </button>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">User Reviews</h2>
                <p className="text-gray-400">
                  {startIndex + 1}-{Math.min(startIndex + REVIEWS_PER_PAGE, sortedReviews.length)} of {sortedReviews.length} Reviews
                </p>
              </div>

              <SortButtons
                sortBy={sortBy}
                ratingDirection={ratingDirection}
                onSortChange={handleSortChange}
              />
            </div>

            <div className="space-y-6">
              {currentReviews.map((review) => {
                const reviewId = `user-all-${review.id}`;
                const isLiked = reviewLikes[reviewId] === true;
                const displayLikes = isLiked ? review.helpful + 1 : review.helpful;

                return (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    isExpanded={expandedReviews[review.id] || false}
                    isLiked={isLiked}
                    displayLikes={displayLikes}
                    onToggleExpanded={() => toggleReadMore(review.id)}
                    onToggleLike={() => handleLikeClick(reviewId)}
                  />
                );
              })}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {/* <section className="mt-12 w-full">
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

              {sidebarLinks && sidebarLinks.length > 0 && (
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
              )}
            </section> */}
          </div>

          <RatingSidebar
            country={country}
            onWriteReview={() => window.location.href = `/destinations/${country.name.toLowerCase()}/write-review`}
          />
        </div>
      </div>
    </div>
  );
};

export default AllUserReviews;
