import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { allToursData } from '@/lib/allToursData';
import { allPosts } from '@/lib/blogData';
import { COUNTRIES_DATA } from '@/lib/countriesData';
import { PARKS_DATA } from '@/lib/parksData';
import { findParkBySlug, slugifyParkName } from '@/lib/parkRoutes';

const SITE_NAME = 'Karla Safari Adventures';
const SITE_URL = 'https://karlasafariadventures.com';
const DEFAULT_IMAGE = `${SITE_URL}/Elephants_luxury.webp`;

const DEFAULT_SEO = {
  title: `${SITE_NAME} | Kenya Luxury Trip`,
  description:
    'Plan a Kenya luxury trip with Karla Safari Adventures: Masai Mara safaris, private wildlife tours, beach extensions, and tailor-made East Africa journeys.',
  keywords:
    'Kenya luxury trip, Kenya safari, Masai Mara safari, luxury safari Kenya, African safari tours',
};

const STATIC_PAGE_SEO = {
  about: {
    title: `About ${SITE_NAME} | Kenya Safari Planners`,
    description:
      'Meet Karla Safari Adventures, an East African safari planner creating private Kenya, Tanzania, Uganda, Rwanda, and South Africa journeys.',
    keywords: 'about Karla Safari Adventures, Kenya safari planner, East Africa safari company',
  },
  contact: {
    title: `Contact ${SITE_NAME} | Plan Your Safari`,
    description:
      'Contact Karla Safari Adventures to plan a private Kenya safari, Masai Mara tour, luxury honeymoon, family trip, or custom East Africa itinerary.',
    keywords: 'contact Karla Safari Adventures, Kenya safari quote, Masai Mara tour planner',
  },
  activities: {
    title: `Safari Activities & Wildlife Experiences | ${SITE_NAME}`,
    description:
      'Explore game drives, hot air balloon safaris, bird watching, cultural visits, beach escapes, gorilla trekking, and custom safari activities.',
    keywords: 'safari activities, wildlife experiences, Kenya game drives, gorilla trekking, balloon safari',
  },
  gallery: {
    title: `African Safari Gallery | ${SITE_NAME}`,
    description:
      'Browse safari photos from wildlife, lodges, beaches, national parks, birding trips, cultural experiences, and African adventure tours.',
    keywords: 'African safari gallery, Kenya wildlife photos, safari lodge photos, Masai Mara images',
  },
  blog: {
    title: `Safari Travel Blog | ${SITE_NAME}`,
    description:
      'Read practical safari planning guides covering Kenya, Tanzania, safari costs, private tours, vehicles, guides, conservation, and travel timing.',
    keywords: 'safari blog, Kenya safari guide, Tanzania safari tips, African travel planning',
  },
  'write-review': {
    title: `Write a Safari Review | ${SITE_NAME}`,
    description:
      'Share your Karla Safari Adventures experience and help future travelers choose the right safari destination, tour, park, or activity.',
    keywords: 'Karla Safari Adventures reviews, safari review, Kenya tour review',
  },
  parks: {
    title: `African Safari Parks & Reserves | ${SITE_NAME}`,
    description:
      'Compare Kenya and East Africa national parks, reserves, conservancies, wildlife highlights, birding, best times to visit, and safari routes.',
    keywords: 'African safari parks, Kenya national parks, Masai Mara, Amboseli, safari reserves',
  },
};

const LEGAL_PAGE_SEO = {
  'privacy-policy': {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: `Read how ${SITE_NAME} handles traveler information, quote requests, reviews, safari planning data, and website privacy.`,
  },
  privacy: {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: `Read how ${SITE_NAME} handles traveler information, quote requests, reviews, safari planning data, and website privacy.`,
  },
  'terms-and-conditions': {
    title: `Terms and Conditions | ${SITE_NAME}`,
    description: `Review the website terms, safari enquiry process, booking responsibilities, supplier terms, and travel conditions for ${SITE_NAME}.`,
  },
  terms: {
    title: `Terms and Conditions | ${SITE_NAME}`,
    description: `Review the website terms, safari enquiry process, booking responsibilities, supplier terms, and travel conditions for ${SITE_NAME}.`,
  },
  'refund-cancellation-policy': {
    title: `Refund & Cancellation Policy | ${SITE_NAME}`,
    description:
      'Understand safari cancellation timing, recoverable refunds, supplier charges, postponements, travel credits, and refund processing.',
  },
  'refund-policy': {
    title: `Refund & Cancellation Policy | ${SITE_NAME}`,
    description:
      'Understand safari cancellation timing, recoverable refunds, supplier charges, postponements, travel credits, and refund processing.',
  },
  'cancellation-policy': {
    title: `Refund & Cancellation Policy | ${SITE_NAME}`,
    description:
      'Understand safari cancellation timing, recoverable refunds, supplier charges, postponements, travel credits, and refund processing.',
  },
  'cookie-policy': {
    title: `Cookie Policy | ${SITE_NAME}`,
    description:
      'Learn how cookies, local storage, analytics tools, forms, and third-party safari planning services may be used on this website.',
  },
  cookies: {
    title: `Cookie Policy | ${SITE_NAME}`,
    description:
      'Learn how cookies, local storage, analytics tools, forms, and third-party safari planning services may be used on this website.',
  },
};

const COUNTRY_SECTION_SEO = {
  overview: {
    title: (country) => `${country.name} Safari Guide | ${SITE_NAME}`,
    description: (country) => country.description || country.overviewContent?.overviewText,
    keywords: (country) => `${country.name} safari, ${country.name} tours, luxury ${country.name} safari`,
  },
  parks: {
    title: (country) => `${country.name} National Parks & Reserves | ${SITE_NAME}`,
    description: (country) =>
      `Explore ${country.name} national parks, reserves, conservancies, wildlife highlights, safari routes, best travel months, and trip ideas.`,
    keywords: (country) => `${country.name} national parks, ${country.name} reserves, ${country.name} safari parks`,
  },
  'things-to-do': {
    title: (country) => `Best Things To Do in ${country.name} | ${SITE_NAME}`,
    description: (country) =>
      country.overviewContent?.thingsToDoPreview?.description ||
      `Discover the best things to do in ${country.name}, from game drives and wildlife safaris to culture, beaches, hiking, birding, and private tours.`,
    keywords: (country) => `things to do in ${country.name}, ${country.name} activities, ${country.name} safari experiences`,
  },
  reviews: {
    title: (country) => `${country.name} Safari Reviews | ${SITE_NAME}`,
    description: (country) =>
      `Read expert and traveler reviews for ${country.name} safaris, parks, wildlife viewing, activities, value, safety, and best travel seasons.`,
    keywords: (country) => `${country.name} safari reviews, ${country.name} travel reviews, ${country.name} tour reviews`,
  },
  wildlife: {
    title: (country) => `${country.name} Wildlife & Animals | ${SITE_NAME}`,
    description: (country) => country.wildlifeContent?.description,
    keywords: (country) => `${country.name} wildlife, ${country.name} animals, ${country.name} Big Five safari`,
  },
  birds: {
    title: (country) => `${country.name} Bird Watching Safaris | ${SITE_NAME}`,
    description: (country) =>
      country.birdsContent?.description ||
      `Plan a ${country.name} bird watching safari with top birding parks, seasonal tips, rare species, and wildlife-focused travel ideas.`,
    keywords: (country) => `${country.name} bird watching, ${country.name} birding safari, birds of ${country.name}`,
  },
  'best-time': {
    title: (country) => `Best Time to Visit ${country.name} | ${SITE_NAME}`,
    description: (country) =>
      country.bestTimeToVisitContent?.description || country.overviewContent?.bestTimePreview?.description,
    keywords: (country) => `best time to visit ${country.name}, ${country.name} safari seasons, ${country.name} weather`,
  },
  weather: {
    title: (country) => `${country.name} Weather & Climate | ${SITE_NAME}`,
    description: (country) => country.weatherAndClimateContent?.description || country.overviewContent?.weatherPreview?.description,
    keywords: (country) => `${country.name} weather, ${country.name} climate, ${country.name} safari weather`,
  },
  routes: {
    title: (country) => `${country.name} Safari Routes | ${SITE_NAME}`,
    description: (country) =>
      `Compare popular ${country.name} safari routes, park combinations, travel circuits, add-ons, flights, road transfers, and itinerary ideas.`,
    keywords: (country) => `${country.name} safari routes, ${country.name} itinerary, ${country.name} safari circuit`,
  },
  'getting-there': {
    title: (country) => `How to Get to ${country.name} | ${SITE_NAME}`,
    description: (country) =>
      country.howToGetThereContent?.description ||
      `Plan flights, road transfers, airstrips, border crossings, and route logistics for a smooth ${country.name} safari.`,
    keywords: (country) => `how to get to ${country.name}, ${country.name} safari flights, ${country.name} transfers`,
  },
  malaria: {
    title: (country) => `${country.name} Malaria & Vaccinations | ${SITE_NAME}`,
    description: (country) => country.malariaAndVaccinationsContent?.description,
    keywords: (country) => `${country.name} malaria, ${country.name} vaccinations, ${country.name} safari health`,
  },
  safety: {
    title: (country) => `${country.name} Safari Safety | ${SITE_NAME}`,
    description: (country) => country.safetyContent?.description,
    keywords: (country) => `${country.name} safari safety, ${country.name} travel safety, ${country.name} wildlife safety`,
  },
};

const PARK_SECTION_SEO = {
  overview: {
    title: (park) => `${park.name} Safari Guide | ${SITE_NAME}`,
    description: (park) => park.overviewContent?.overviewText || park.description,
  },
  reviews: {
    title: (park) => `${park.name} Reviews | ${SITE_NAME}`,
    description: (park) =>
      `Read safari reviews for ${park.name}, including wildlife viewing, scenery, birding, lodges, activities, value, and best travel seasons.`,
  },
  wildlife: {
    title: (park) => `${park.name} Wildlife | ${SITE_NAME}`,
    description: (park) => park.wildlifeContent?.description,
  },
  birds: {
    title: (park) => `${park.name} Bird Watching | ${SITE_NAME}`,
    description: (park) => park.birdsContent?.description,
  },
  'best-time': {
    title: (park) => `Best Time to Visit ${park.name} | ${SITE_NAME}`,
    description: (park) => park.bestTimeToVisitContent?.description || park.overviewContent?.bestTimePreview?.description,
  },
  weather: {
    title: (park) => `${park.name} Weather & Climate | ${SITE_NAME}`,
    description: (park) => park.weatherAndClimateContent?.description,
  },
  'getting-there': {
    title: (park) => `How to Get to ${park.name} | ${SITE_NAME}`,
    description: (park) =>
      `Plan routes, transfers, flights, roads, and safari logistics for visiting ${park.name} in ${park.country || 'East Africa'}.`,
  },
  malaria: {
    title: (park) => `${park.name} Malaria & Safety | ${SITE_NAME}`,
    description: (park) => park.malariaAndVaccinationsContent?.description || park.safetyContent?.description,
  },
};

const normalizeSlug = (value = '') =>
  decodeURIComponent(String(value))
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-');

const cleanText = (value = '') =>
  String(value)
    .replace(/\*\*/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const truncate = (value, maxLength = 158) => {
  const text = cleanText(value);
  if (text.length <= maxLength) return text;
  const clipped = text.slice(0, maxLength - 1);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, lastSpace > 90 ? lastSpace : clipped.length).trim()}.`;
};

const titleCaseFromSlug = (value = '') =>
  normalizeSlug(value)
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getCountryBySlug = (slug) => {
  const target = normalizeSlug(slug);
  return COUNTRIES_DATA.find((country) => normalizeSlug(country.id || country.name) === target);
};

const getTourBySlug = (slug) => {
  const target = normalizeSlug(slug);
  return allToursData.find((tour) => normalizeSlug(tour.id) === target);
};

const getPostBySlug = (slug) => {
  const target = normalizeSlug(slug);
  return allPosts.find((post) => normalizeSlug(post.slug) === target);
};

const getParkBySlug = (slug) => {
  const target = normalizeSlug(slug);
  const direct = PARKS_DATA.find((park) => normalizeSlug(park.id || slugifyParkName(park.name)) === target);
  return direct || findParkBySlug(target, COUNTRIES_DATA)?.park || null;
};

const getCountrySeo = (country, section = 'overview') => {
  const sectionSeo = COUNTRY_SECTION_SEO[section] || COUNTRY_SECTION_SEO.overview;
  return {
    title: sectionSeo.title(country),
    description: truncate(sectionSeo.description(country) || country.description || DEFAULT_SEO.description),
    keywords: sectionSeo.keywords?.(country),
  };
};

const getParkSeo = (park, section = 'overview') => {
  const sectionSeo = PARK_SECTION_SEO[section] || PARK_SECTION_SEO.overview;
  return {
    title: sectionSeo.title(park),
    description: truncate(sectionSeo.description(park) || DEFAULT_SEO.description),
    keywords: `${park.name} safari, ${park.name} wildlife, ${park.country || 'Africa'} national parks`,
  };
};

const getSeoForLocation = ({ pathname, search }) => {
  const segments = pathname.split('/').filter(Boolean);
  const [root, second, third] = segments;

  if (!root) return DEFAULT_SEO;

  if (root === 'tours') {
    if (second) {
      const tour = getTourBySlug(second);
      if (tour) {
        const details = [tour.duration, tour.location].filter(Boolean).join(' ');
        return {
          title: `${tour.title} | ${SITE_NAME}`,
          description: truncate(`${tour.description || tour.mainDescription || ''} ${details ? `${details} safari itinerary.` : ''}`),
          keywords: [tour.location, tour.title, ...(tour.tags || [])].filter(Boolean).join(', '),
        };
      }
    }

    const query = new URLSearchParams(search);
    const searchTerm = query.get('search') || query.get('country');
    if (searchTerm) {
      const label = titleCaseFromSlug(searchTerm);
      return {
        title: `${label} Safari Tours | ${SITE_NAME}`,
        description: `Explore private ${label} safari tours, wildlife trips, luxury lodges, budget options, family itineraries, and custom African safari packages.`,
        keywords: `${label} safari tours, ${label} luxury safari, ${label} wildlife trips`,
      };
    }

    return {
      title: `African Safari Tours & Packages | ${SITE_NAME}`,
      description:
        'Compare private Kenya, Tanzania, Uganda, Rwanda, and South Africa safari tours with wildlife routes, luxury lodges, family trips, and custom itineraries.',
      keywords: 'African safari tours, Kenya safari packages, Tanzania safari, luxury safari trips',
    };
  }

  if (root === 'destinations') {
    if (second) {
      const country = getCountryBySlug(second);
      if (country) return getCountrySeo(country, third || 'overview');
    }

    return {
      title: `Africa Safari Destinations | ${SITE_NAME}`,
      description:
        'Explore safari destinations across Kenya, Tanzania, Uganda, Rwanda, and South Africa with parks, wildlife, birding, weather, safety, and route guides.',
      keywords: 'Africa safari destinations, Kenya safari, Tanzania safari, Uganda safari, Rwanda safari, South Africa safari',
    };
  }

  if (root === 'parks') {
    if (second) {
      const park = getParkBySlug(second);
      if (park) return getParkSeo(park, third || 'overview');
    }

    return STATIC_PAGE_SEO.parks;
  }

  if (root === 'blog') {
    if (second) {
      const post = getPostBySlug(second);
      if (post) {
        return {
          title: `${post.title} | ${SITE_NAME}`,
          description: truncate(post.excerpt || DEFAULT_SEO.description),
          keywords: `${post.category || 'safari planning'}, ${post.title}, Karla Safari Adventures blog`,
        };
      }
    }

    return STATIC_PAGE_SEO.blog;
  }

  if (LEGAL_PAGE_SEO[root]) return LEGAL_PAGE_SEO[root];
  if (STATIC_PAGE_SEO[root]) return STATIC_PAGE_SEO[root];

  return {
    title: `${titleCaseFromSlug(root)} | ${SITE_NAME}`,
    description: DEFAULT_SEO.description,
    keywords: DEFAULT_SEO.keywords,
  };
};

const ensureMeta = (attribute, key, content) => {
  if (!content) return;

  const selector = `meta[${attribute}="${key}"]`;
  let meta = document.head.querySelector(selector);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', cleanText(content));
};

const ensureCanonical = (href) => {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const removeDuplicateDescriptionTags = () => {
  const descriptions = Array.from(document.head.querySelectorAll('meta[name="description"]'));
  descriptions.slice(1).forEach((meta) => meta.remove());
};

function SeoManager() {
  const location = useLocation();

  const seo = useMemo(() => getSeoForLocation(location), [location]);

  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${location.pathname === '/' ? '/' : location.pathname}`;
    const title = cleanText(seo.title || DEFAULT_SEO.title);
    const description = truncate(seo.description || DEFAULT_SEO.description);
    const keywords = cleanText(seo.keywords || DEFAULT_SEO.keywords);

    removeDuplicateDescriptionTags();
    document.title = title;

    ensureMeta('name', 'description', description);
    ensureMeta('name', 'keywords', keywords);
    ensureMeta('name', 'author', SITE_NAME);
    ensureMeta('name', 'robots', 'index, follow');
    ensureMeta('property', 'og:title', title);
    ensureMeta('property', 'og:description', description);
    ensureMeta('property', 'og:type', 'website');
    ensureMeta('property', 'og:url', canonicalUrl);
    ensureMeta('property', 'og:image', DEFAULT_IMAGE);
    ensureMeta('property', 'og:site_name', SITE_NAME);
    ensureMeta('name', 'twitter:card', 'summary_large_image');
    ensureMeta('name', 'twitter:title', title);
    ensureMeta('name', 'twitter:description', description);
    ensureMeta('name', 'twitter:image', DEFAULT_IMAGE);
    ensureCanonical(canonicalUrl);
  }, [location.pathname, seo]);

  return null;
}

export default SeoManager;
