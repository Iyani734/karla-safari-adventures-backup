const abbreviationExpansions = [
  [/\bn\.?p\.?\b/g, ' national park '],
  [/\bn\.?r\.?\b/g, ' national reserve '],
  [/\bf\.?r\.?\b/g, ' forest reserve '],
];

export const normalizeParkName = (value = '') => {
  let normalized = String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘`]/g, "'")
    .replace(/&/g, ' and ')
    .replace(/\([^)]*\)/g, ' ')
    .toLowerCase();

  abbreviationExpansions.forEach(([pattern, replacement]) => {
    normalized = normalized.replace(pattern, replacement);
  });

  return normalized
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const slugifyParkName = (value = '') =>
  normalizeParkName(value).replace(/\s+/g, '-');

export const isAllParksLink = (value = '') => {
  const normalized = normalizeParkName(value);
  return normalized.startsWith('all ') && normalized.includes('parks');
};

export const getCountrySlug = (countryName = '') =>
  String(countryName).trim().toLowerCase().replace(/\s+/g, '-');

export const getCountryAllParksPath = (countryData) =>
  `/destinations/${getCountrySlug(countryData?.name || '')}/parks`;

const getParkEntries = (countryData) => {
  const entries = new Map();
  const addPark = (park) => {
    if (!park?.name || isAllParksLink(park.name)) return;
    const key = normalizeParkName(park.name);
    entries.set(key, { ...park, ...entries.get(key) });
  };

  countryData?.parksAndReservesContent?.allParks?.forEach(addPark);
  countryData?.parksAndReservesContent?.premierParks?.forEach(addPark);
  countryData?.overviewContent?.premierParks?.forEach(addPark);

  return Array.from(entries.values());
};

export const findParkInCountryData = (parkName, countryData) => {
  if (!parkName || !countryData) return null;

  const target = normalizeParkName(parkName);
  const entries = getParkEntries(countryData);

  return (
    entries.find((park) => normalizeParkName(park.name) === target) ||
    entries.find((park) => {
      const candidate = normalizeParkName(park.name);
      return candidate.includes(target) || target.includes(candidate);
    }) ||
    null
  );
};

export const findParkBySlug = (parkSlug, countries = []) => {
  const target = String(parkSlug || '').trim().toLowerCase();
  if (!target) return null;

  for (const country of countries) {
    for (const park of getParkEntries(country)) {
      const slug = park.id || slugifyParkName(park.name);
      if (slug === target) {
        return { park, country, slug };
      }
    }
  }

  return null;
};

export const getParkSectionSlug = (sectionName = '') => {
  const normalized = normalizeParkName(sectionName);

  if (normalized.includes('wildlife')) return 'wildlife';
  if (normalized.includes('bird')) return 'birds';
  if (normalized.includes('best time')) return 'best-time';
  if (normalized.includes('climate') || normalized.includes('weather')) return 'weather';
  if (normalized.includes('getting') || normalized.includes('route')) return 'getting-there';
  if (normalized.includes('malaria') || normalized.includes('safety')) return 'malaria';

  return 'overview';
};

export const getParkPath = (parkName, countryData, sectionName) => {
  if (isAllParksLink(parkName)) return getCountryAllParksPath(countryData);

  const matchedPark = findParkInCountryData(parkName, countryData);
  const canonicalName = matchedPark?.name || parkName;
  const slug = matchedPark?.id || slugifyParkName(canonicalName);
  const section = sectionName ? `/${sectionName}` : '';

  return `/parks/${slug}${section}`;
};
