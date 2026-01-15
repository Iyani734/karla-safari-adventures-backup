import { useState, useEffect, useRef } from 'react';
import { Star, X, Check, AlertCircle, ChevronDown, Search } from 'lucide-react';
import { eastAfricaTours } from '../lib/tourData';
import emailjs from '@emailjs/browser';

const COUNTRIES = [
  { name: 'United States', code: 'us' },
  { name: 'United Kingdom', code: 'gb' },
  { name: 'Canada', code: 'ca' },
  { name: 'Australia', code: 'au' },
  { name: 'Germany', code: 'de' },
  { name: 'France', code: 'fr' },
  { name: 'Spain', code: 'es' },
  { name: 'Italy', code: 'it' },
  { name: 'Netherlands', code: 'nl' },
  { name: 'Belgium', code: 'be' },
  { name: 'Switzerland', code: 'ch' },
  { name: 'Austria', code: 'at' },
  { name: 'Sweden', code: 'se' },
  { name: 'Norway', code: 'no' },
  { name: 'Denmark', code: 'dk' },
  { name: 'Finland', code: 'fi' },
  { name: 'Ireland', code: 'ie' },
  { name: 'New Zealand', code: 'nz' },
  { name: 'South Africa', code: 'za' },
  { name: 'Kenya', code: 'ke' },
  { name: 'Tanzania', code: 'tz' },
  { name: 'Uganda', code: 'ug' },
  { name: 'Rwanda', code: 'rw' },
  { name: 'Japan', code: 'jp' },
  { name: 'China', code: 'cn' },
  { name: 'India', code: 'in' },
  { name: 'Brazil', code: 'br' },
  { name: 'Mexico', code: 'mx' },
  { name: 'Argentina', code: 'ar' },

  // AFRICA
  { name: 'Nigeria', code: 'ng' },
  { name: 'Ghana', code: 'gh' },
  { name: 'Ethiopia', code: 'et' },
  { name: 'Egypt', code: 'eg' },
  { name: 'Morocco', code: 'ma' },
  { name: 'Tunisia', code: 'tn' },
  { name: 'Algeria', code: 'dz' },
  { name: 'Zimbabwe', code: 'zw' },
  { name: 'Zambia', code: 'zm' },
  { name: 'Botswana', code: 'bw' },
  { name: 'Namibia', code: 'na' },
  { name: 'Mozambique', code: 'mz' },
  { name: 'Madagascar', code: 'mg' },
  { name: 'Somalia', code: 'so' },
  { name: 'Sudan', code: 'sd' },
  { name: 'South Sudan', code: 'ss' },
  { name: 'Cameroon', code: 'cm' },
  { name: 'Ivory Coast', code: 'ci' },
  { name: 'Senegal', code: 'sn' },
  { name: 'Mali', code: 'ml' },
  { name: 'Angola', code: 'ao' },
  { name: 'Mauritius', code: 'mu' },
  { name: 'Seychelles', code: 'sc' },
  { name: 'Democratic Republic of Congo', code: 'cd' },
  { name: 'Republic of Congo', code: 'cg' },
  { name: 'Libya', code: 'ly' },
  { name: 'Eritrea', code: 'er' },
  { name: 'Burkina Faso', code: 'bf' },
  { name: 'Benin', code: 'bj' },
  { name: 'Togo', code: 'tg' },
  { name: 'Gabon', code: 'ga' },
  { name: 'Lesotho', code: 'ls' },
  { name: 'Eswatini', code: 'sz' },
  { name: 'Mauritania', code: 'mr' },
  { name: 'Chad', code: 'td' },
  { name: 'Niger', code: 'ne' },
  { name: 'Central African Republic', code: 'cf' },
  { name: 'Equatorial Guinea', code: 'gq' },
  { name: 'Guinea', code: 'gn' },
  { name: 'Guinea-Bissau', code: 'gw' },
  { name: 'Sierra Leone', code: 'sl' },
  { name: 'Liberia', code: 'lr' },
  { name: 'Burundi', code: 'bi' },
  { name: 'Malawi', code: 'mw' },
  { name: 'Cape Verde', code: 'cv' },
  { name: 'Sao Tome and Principe', code: 'st' },
  { name: 'Djibouti', code: 'dj' },
  { name: 'Gambia', code: 'gm' },

  // ASIA
  { name: 'South Korea', code: 'kr' },
  { name: 'North Korea', code: 'kp' },
  { name: 'Saudi Arabia', code: 'sa' },
  { name: 'United Arab Emirates', code: 'ae' },
  { name: 'Qatar', code: 'qa' },
  { name: 'Oman', code: 'om' },
  { name: 'Iraq', code: 'iq' },
  { name: 'Iran', code: 'ir' },
  { name: 'Pakistan', code: 'pk' },
  { name: 'Bangladesh', code: 'bd' },
  { name: 'Sri Lanka', code: 'lk' },
  { name: 'Nepal', code: 'np' },
  { name: 'Bhutan', code: 'bt' },
  { name: 'Philippines', code: 'ph' },
  { name: 'Indonesia', code: 'id' },
  { name: 'Malaysia', code: 'my' },
  { name: 'Singapore', code: 'sg' },
  { name: 'Vietnam', code: 'vn' },
  { name: 'Thailand', code: 'th' },
  { name: 'Cambodia', code: 'kh' },
  { name: 'Laos', code: 'la' },
  { name: 'Myanmar', code: 'mm' },
  { name: 'Kazakhstan', code: 'kz' },
  { name: 'Uzbekistan', code: 'uz' },
  { name: 'Turkmenistan', code: 'tm' },
  { name: 'Kyrgyzstan', code: 'kg' },
  { name: 'Tajikistan', code: 'tj' },
  { name: 'Mongolia', code: 'mn' },
  { name: 'Israel', code: 'il' },
  { name: 'Jordan', code: 'jo' },
  { name: 'Lebanon', code: 'lb' },
  { name: 'Yemen', code: 'ye' },
  { name: 'Turkey', code: 'tr' },
  { name: 'Georgia', code: 'ge' },
  { name: 'Armenia', code: 'am' },
  { name: 'Azerbaijan', code: 'az' },

  // EUROPE
  { name: 'Portugal', code: 'pt' },
  { name: 'Poland', code: 'pl' },
  { name: 'Czech Republic', code: 'cz' },
  { name: 'Slovakia', code: 'sk' },
  { name: 'Hungary', code: 'hu' },
  { name: 'Romania', code: 'ro' },
  { name: 'Bulgaria', code: 'bg' },
  { name: 'Greece', code: 'gr' },
  { name: 'Croatia', code: 'hr' },
  { name: 'Serbia', code: 'rs' },
  { name: 'Slovenia', code: 'si' },
  { name: 'Bosnia and Herzegovina', code: 'ba' },
  { name: 'North Macedonia', code: 'mk' },
  { name: 'Albania', code: 'al' },
  { name: 'Estonia', code: 'ee' },
  { name: 'Latvia', code: 'lv' },
  { name: 'Lithuania', code: 'lt' },
  { name: 'Belarus', code: 'by' },
  { name: 'Ukraine', code: 'ua' },
  { name: 'Moldova', code: 'md' },
  { name: 'Iceland', code: 'is' },
  { name: 'Luxembourg', code: 'lu' },
  { name: 'Liechtenstein', code: 'li' },
  { name: 'Malta', code: 'mt' },
  { name: 'Monaco', code: 'mc' },
  { name: 'San Marino', code: 'sm' },
  { name: 'Vatican City', code: 'va' },
  { name: 'Andorra', code: 'ad' },
  { name: 'Cyprus', code: 'cy' },

  // NORTH AMERICA
  { name: 'Costa Rica', code: 'cr' },
  { name: 'Panama', code: 'pa' },
  { name: 'Guatemala', code: 'gt' },
  { name: 'Honduras', code: 'hn' },
  { name: 'El Salvador', code: 'sv' },
  { name: 'Nicaragua', code: 'ni' },
  { name: 'Belize', code: 'bz' },
  { name: 'Jamaica', code: 'jm' },
  { name: 'Cuba', code: 'cu' },
  { name: 'Dominican Republic', code: 'do' },
  { name: 'Haiti', code: 'ht' },
  { name: 'Trinidad and Tobago', code: 'tt' },
  { name: 'Barbados', code: 'bb' },
  { name: 'Bahamas', code: 'bs' },
  { name: 'Saint Lucia', code: 'lc' },
  { name: 'Grenada', code: 'gd' },
  { name: 'Saint Kitts and Nevis', code: 'kn' },
  { name: 'Dominica', code: 'dm' },
  { name: 'Antigua and Barbuda', code: 'ag' },
  { name: 'Saint Vincent and the Grenadines', code: 'vc' },

  // SOUTH AMERICA
  { name: 'Chile', code: 'cl' },
  { name: 'Peru', code: 'pe' },
  { name: 'Colombia', code: 'co' },
  { name: 'Venezuela', code: 've' },
  { name: 'Ecuador', code: 'ec' },
  { name: 'Paraguay', code: 'py' },
  { name: 'Uruguay', code: 'uy' },
  { name: 'Bolivia', code: 'bo' },
  { name: 'Suriname', code: 'sr' },
  { name: 'Guyana', code: 'gy' },

  // OCEANIA
  { name: 'Fiji', code: 'fj' },
  { name: 'Papua New Guinea', code: 'pg' },
  { name: 'Samoa', code: 'ws' },
  { name: 'Tonga', code: 'to' },
  { name: 'Vanuatu', code: 'vu' },
  { name: 'Kiribati', code: 'ki' },
  { name: 'Micronesia', code: 'fm' },
  { name: 'Marshall Islands', code: 'mh' },
  { name: 'Solomon Islands', code: 'sb' },
  { name: 'Nauru', code: 'nr' },
  { name: 'Tuvalu', code: 'tv' },
  { name: 'Palau', code: 'pw' }
].sort((a, b) => a.name.localeCompare(b.name));

const SAFARI_DESTINATIONS = ['Kenya', 'Tanzania', 'Uganda', 'Rwanda'];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - i);

function WriteReview() {
  const [formData, setFormData] = useState({
    authorName: '',
    email: '',
    country: '',
    countryFlag: '',
    tourId: '',
    tourName: '',
    destinationCountry: '',
    travelMonth: '',
    travelYear: '',
    reviewTitle: '',
    reviewText: '',
    overallRating: 0,
    wildlifeRating: 0,
    bushVibeRating: 0,
    sceneryRating: 0,
    birdingRating: 0,
  });

  const [tourSearch, setTourSearch] = useState('');
  const [showTourSuggestions, setShowTourSuggestions] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [filteredTours, setFilteredTours] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState(COUNTRIES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const tourInputRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const form = useRef();
const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_l1w3w2q', 'template_ojdkifb', form.current, {
        publicKey: 'HTiCAucEf0u_GKfKH',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
    }

  useEffect(() => {
    if (tourSearch.length > 0) {
      const filtered = eastAfricaTours.filter(tour =>
        tour.title.toLowerCase().includes(tourSearch.toLowerCase()) ||
        tour.location.toLowerCase().includes(tourSearch.toLowerCase()) ||
        tour.subLocation?.toLowerCase().includes(tourSearch.toLowerCase())
      ).slice(0, 8);
      setFilteredTours(filtered);
      setShowTourSuggestions(true);
    } else {
      setFilteredTours([]);
      setShowTourSuggestions(false);
    }
  }, [tourSearch]);

  useEffect(() => {
    if (countrySearch.length > 0) {
      const filtered = COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(countrySearch.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(COUNTRIES);
    }
  }, [countrySearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tourInputRef.current && !tourInputRef.current.contains(event.target)) {
        setShowTourSuggestions(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTourSelect = (tour) => {
    setFormData({
      ...formData,
      tourId: tour.id,
      tourName: tour.title,
      destinationCountry: tour.location,
    });
    setTourSearch(tour.title);
    setShowTourSuggestions(false);
    setErrors({ ...errors, tourName: null, destinationCountry: null });
  };

  const handleCountrySelect = (country) => {
    setFormData({
      ...formData,
      country: country.name,
      countryFlag: country.code,
    });
    setCountrySearch('');
    setShowCountryDropdown(false);
    setErrors({ ...errors, country: null });
  };

  const handleRatingChange = (category, rating) => {
    setFormData({ ...formData, [category]: rating });
    setErrors({ ...errors, [category]: null });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData.destinationCountry) {
      newErrors.destinationCountry = 'Destination country is required';
    }

    if (!formData.travelMonth) {
      newErrors.travelMonth = 'Travel month is required';
    }

    if (!formData.travelYear) {
      newErrors.travelYear = 'Travel year is required';
    }

    if (!formData.reviewTitle.trim()) {
      newErrors.reviewTitle = 'Review title is required';
    }

    if (!formData.reviewText.trim() || formData.reviewText.trim().length < 50) {
      newErrors.reviewText = 'Review must be at least 50 characters';
    }

    if (formData.overallRating === 0) {
      newErrors.overallRating = 'Overall rating is required';
    }

    if (formData.wildlifeRating === 0) {
      newErrors.wildlifeRating = 'Wildlife rating is required';
    }

    if (formData.bushVibeRating === 0) {
      newErrors.bushVibeRating = 'Bush Vibe rating is required';
    }

    if (formData.sceneryRating === 0) {
      newErrors.sceneryRating = 'Scenery rating is required';
    }

    if (formData.birdingRating === 0) {
      newErrors.birdingRating = 'Birding rating is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const reviewData = {
        authorName: formData.authorName,
        email: formData.email,
        country: formData.country,
        countryFlag: formData.countryFlag,
        tourId: formData.tourId || null,
        tourName: formData.tourName || null,
        destinationCountry: formData.destinationCountry,
        travelMonth: formData.travelMonth,
        travelYear: formData.travelYear,
        reviewTitle: formData.reviewTitle,
        reviewText: formData.reviewText,
        overallRating: formData.overallRating,
        wildlifeRating: formData.wildlifeRating,
        bushVibeRating: formData.bushVibeRating,
        sceneryRating: formData.sceneryRating,
        birdingRating: formData.birdingRating,
        submittedAt: new Date().toISOString(),
      };

      console.log('Review data to be sent via email:', reviewData);

      setSubmitStatus('success');
      setFormData({
        authorName: '',
        email: '',
        country: '',
        countryFlag: '',
        tourId: '',
        tourName: '',
        destinationCountry: '',
        travelMonth: '',
        travelYear: '',
        reviewTitle: '',
        reviewText: '',
        overallRating: 0,
        wildlifeRating: 0,
        bushVibeRating: 0,
        sceneryRating: 0,
        birdingRating: 0,
      });
      setTourSearch('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, size = 'medium', error }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const sizeClasses = {
      small: 'w-5 h-5',
      medium: 'w-8 h-8',
      large: 'w-10 h-10',
    };

    return (
      <div className="flex flex-col">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform duration-200 hover:scale-110"
            >
              <Star
                className={`${sizeClasses[size]} transition-colors duration-200 ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-600'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-white font-bold text-lg">{rating}/5</span>
          )}
        </div>
        {error && (
          <span className="text-red-400 text-sm mt-1">{error}</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Write a Review</h1>
            <p className="text-gray-400">Share your safari experience with other travelers</p>
          </div>

          {submitStatus === 'success' && (
            <div className="mb-6 bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-green-400 font-bold mb-1">Review Submitted Successfully!</h3>
                <p className="text-green-300 text-sm">
                  Thank you for your review. We will contact you via email shortly.
                </p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-bold mb-1">Submission Failed</h3>
                <p className="text-red-300 text-sm">
                  There was an error submitting your review. Please try again.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={sendEmail} ref={form} className="space-y-6">
             <input type="hidden" name="overall_rating" value={formData.overallRating} />
            <input type="hidden" name="wildlife_rating" value={formData.wildlifeRating} />
            <input type="hidden" name="bush_vibe_rating" value={formData.bushVibeRating} />
            <input type="hidden" name="scenery_rating" value={formData.sceneryRating} />
            <input type="hidden" name="birding_rating" value={formData.birdingRating} />
           
  
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-bold mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.authorName}
                  name="user_name"
                  onChange={(e) => {
                    setFormData({ ...formData, authorName: e.target.value });
                    setErrors({ ...errors, authorName: null });
                  }}
                  className={`w-full bg-slate-900/50 border ${
                    errors.authorName ? 'border-red-500' : 'border-slate-700'
                  } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="Enter your full name"
                />
                {errors.authorName && (
                  <span className="text-red-400 text-sm mt-1 block">{errors.authorName}</span>
                )}
              </div>

              <div>
                <label className="block text-white font-bold mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="user_email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: null });
                  }}
                  className={`w-full bg-slate-900/50 border ${
                    errors.email ? 'border-red-500' : 'border-slate-700'
                  } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <span className="text-red-400 text-sm mt-1 block">{errors.email}</span>
                )}
              </div>
            </div>

            <div ref={countryDropdownRef} className="relative">
              <label className="block text-white font-bold mb-2">
                Your Country <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="text"
                  name='user_country'
                  value={showCountryDropdown ? countrySearch : formData.country}
                  onChange={(e) => {
                    setCountrySearch(e.target.value);
                    setShowCountryDropdown(true);
                  }}
                  onFocus={() => setShowCountryDropdown(true)}
                  className={`w-full bg-slate-900/50 border ${
                    errors.country ? 'border-red-500' : 'border-slate-700'
                  } rounded-lg pl-12 pr-10 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="Search for your country..."
                />
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {showCountryDropdown && (
                <div className="absolute z-50 mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        name=''
                        className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors flex items-center gap-3 text-white"
                      >
                        <img
                          src={`https://flagcdn.com/w40/${country.code}.webp`}
                          alt={country.name}
                          className="w-6 h-4 object-cover rounded-sm"
                        />
                        {country.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-400 text-sm">
                      No countries found
                    </div>
                  )}
                </div>
              )}
              {errors.country && (
                <span className="text-red-400 text-sm mt-1 block">{errors.country}</span>
              )}
            </div>

            <div ref={tourInputRef} className="relative">
              <label className="block text-white font-bold mb-2">
                Tour Package
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={tourSearch}
                  name='tour_package'
                  onChange={(e) => setTourSearch(e.target.value)}
                  onFocus={() => tourSearch.length > 0 && setShowTourSuggestions(true)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Search for the tour you experienced..."
                />
              </div>
              {showTourSuggestions && filteredTours.length > 0 && (
                <div className="absolute z-50 mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-h-80 overflow-y-auto">
                  {filteredTours.map((tour) => (
                    <button
                      key={tour.id}
                      type="button"
                      onClick={() => handleTourSelect(tour)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors border-b border-slate-700/50 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={tour.link}
                          alt={tour.title}
                          className="w-16 h-12 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold text-sm line-clamp-1">{tour.title}</h4>
                          <p className="text-gray-400 text-xs mt-1">
                            {tour.location} • {tour.duration}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-white font-bold mb-2">
                Safari Destination <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.destinationCountry}
                name='destination_country'
                onChange={(e) => {
                  setFormData({ ...formData, destinationCountry: e.target.value });
                  setErrors({ ...errors, destinationCountry: null });
                }}
                className={`w-full bg-slate-900/50 border ${
                  errors.destinationCountry ? 'border-red-500' : 'border-slate-700'
                } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors`}
              >
                <option value="">Select destination country</option>
                {SAFARI_DESTINATIONS.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
              {errors.destinationCountry && (
                <span className="text-red-400 text-sm mt-1 block">{errors.destinationCountry}</span>
              )}
            </div>

            <div>
              <label className="block text-white font-bold mb-2">
                When Did You Go? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <select
                    value={formData.travelMonth}
                    name='travel_month'
                    onChange={(e) => {
                      setFormData({ ...formData, travelMonth: e.target.value });
                      setErrors({ ...errors, travelMonth: null });
                    }}
                    className={`w-full bg-slate-900/50 border ${
                      errors.travelMonth ? 'border-red-500' : 'border-slate-700'
                    } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors`}
                  >
                    <option value="">- Select month -</option>
                    {MONTHS.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  {errors.travelMonth && (
                    <span className="text-red-400 text-sm mt-1 block">{errors.travelMonth}</span>
                  )}
                </div>
                <div>
                  <select
                    value={formData.travelYear}
                    name='travel_year'
                    onChange={(e) => {
                      setFormData({ ...formData, travelYear: e.target.value });
                      setErrors({ ...errors, travelYear: null });
                    }}
                    className={`w-full bg-slate-900/50 border ${
                      errors.travelYear ? 'border-red-500' : 'border-slate-700'
                    } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors`}
                  >
                    <option value="">- Select year -</option>
                    {YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.travelYear && (
                    <span className="text-red-400 text-sm mt-1 block">{errors.travelYear}</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white font-bold mb-2">
                Review Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name='review_title'
                value={formData.reviewTitle}
                onChange={(e) => {
                  setFormData({ ...formData, reviewTitle: e.target.value });
                  setErrors({ ...errors, reviewTitle: null });
                }}
                className={`w-full bg-slate-900/50 border ${
                  errors.reviewTitle ? 'border-red-500' : 'border-slate-700'
                } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors`}
                placeholder="Summarize your experience in one line"
              />
              {errors.reviewTitle && (
                <span className="text-red-400 text-sm mt-1 block">{errors.reviewTitle}</span>
              )}
            </div>

            <div className="bg-slate-900/50 rounded-lg p-6 space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">Rate Your Experience</h3>

              <div>
                <label className="block text-white font-bold mb-3">
                  Overall Rating <span className="text-red-500">*</span>
                </label>
                <StarRating
                  rating={formData.overallRating}
                  onRatingChange={(rating) => handleRatingChange('overallRating', rating)}
                  size="large"
                  error={errors.overallRating}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Wildlife <span className="text-red-500">*</span>
                  </label>
                  <StarRating
                    rating={formData.wildlifeRating}
                    onRatingChange={(rating) => handleRatingChange('wildlifeRating', rating)}
                    error={errors.wildlifeRating}
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Bush Vibe <span className="text-red-500">*</span>
                  </label>
                  <StarRating
                    rating={formData.bushVibeRating}
                    onRatingChange={(rating) => handleRatingChange('bushVibeRating', rating)}
                    error={errors.bushVibeRating}
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Scenery <span className="text-red-500">*</span>
                  </label>
                  <StarRating
                    rating={formData.sceneryRating}
                    onRatingChange={(rating) => handleRatingChange('sceneryRating', rating)}
                    error={errors.sceneryRating}
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Birding <span className="text-red-500">*</span>
                  </label>
                  <StarRating
                    rating={formData.birdingRating}
                    onRatingChange={(rating) => handleRatingChange('birdingRating', rating)}
                    error={errors.birdingRating}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white font-bold mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.reviewText}
                name='review_text'
                onChange={(e) => {
                  setFormData({ ...formData, reviewText: e.target.value });
                  setErrors({ ...errors, reviewText: null });
                }}
                rows={8}
                className={`w-full bg-slate-900/50 border ${
                  errors.reviewText ? 'border-red-500' : 'border-slate-700'
                } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none`}
                placeholder="Share your safari experience in detail. What did you love? What could be improved? (Minimum 50 characters)"
              />
              <div className="flex justify-between items-center mt-2">
                {errors.reviewText && (
                  <span className="text-red-400 text-sm">{errors.reviewText}</span>
                )}
                <span className={`text-sm ml-auto ${
                  formData.reviewText.length < 50 ? 'text-gray-400' : 'text-green-400'
                }`}>
                  {formData.reviewText.length} / 50 characters minimum
                </span>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Submit Review
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-8 py-4 border-2 border-slate-700 text-white hover:border-slate-600 hover:bg-slate-700/30 font-bold rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
            </div>

            <p className="text-gray-400 text-sm text-center">
              Your review will be sent to our team for processing.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WriteReview;
