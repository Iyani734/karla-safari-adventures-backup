import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { PARKS_DATA } from '../src/lib/parksData.js';

const OUT_DIR = 'public/birds';
const REPORT_DIR = 'reports';
const MAP_FILE = 'src/lib/birdImageMap.js';
const ATTRIBUTION_JSON = 'reports/bird-image-attributions.json';
const ATTRIBUTION_MD = 'reports/bird-image-attributions.md';
const USER_AGENT = 'KarlaSafariAdventuresBirdImageFetcher/1.0';

const queryOverrides = {
  "African Green Broadbill": ["African green broadbill", "Grauer's broadbill"],
  "African crowned eagle": ["Crowned eagle", "African crowned eagle"],
  "Crowned Eagle": ["Crowned eagle", "African crowned eagle"],
  "African white-backed vulture": ["White-backed vulture", "African white-backed vulture"],
  "Bohm's bee-eater": ["Böhm's bee-eater", "Bohm's bee-eater"],
  "Broad-tailed paradise whydah": ["Broad-tailed paradise whydah", "Eastern paradise whydah"],
  "Carmine bee-eater": ["Northern carmine bee-eater", "Carmine bee-eater"],
  "Fischer's turaco": ["Fischer's turaco", "Fischer's turaco bird"],
  "Great Blue Turaco": ["Great blue turaco"],
  "Grauer's Warbler": ["Grauer's warbler", "Grauer's swamp warbler"],
  "Hemprich's hornbill": ["Hemprich's hornbill"],
  "Nahan's Francolin": ["Nahan's partridge", "Nahan's francolin"],
  "Peter's finfoot": ["African finfoot", "Peter's finfoot"],
  "Puvel's Illadopsis": ["Puvel's illadopsis"],
  "Red-faced Barbet": ["Red-faced barbet", "Lybius rubrifacies"],
  "Ross's turaco": ["Ross's turaco", "Musophaga rossae"],
  "Ruaha red-billed hornbill": ["Ruaha red-billed hornbill", "Tanzanian red-billed hornbill"],
  "Ruwenzori Nightjar": ["Ruwenzori nightjar", "Caprimulgus ruwenzorii"],
  "Rwenzori Batis": ["Rwenzori batis", "Batis diops"],
  "Rwenzori Turaco": ["Rwenzori turaco", "Ruwenzori turaco", "Gallirex johnstoni"],
  "Saddle-billed stork": ["Saddle-billed stork", "Ephippiorhynchus senegalensis"],
  "Secretarybird": ["Secretary bird"],
  "Shelley's Crimsonwing": ["Shelley's crimsonwing", "Cryptospiza shelleyi"],
  "Shoebill Stork": ["Shoebill"],
  "Short-tailed Warbler": ["Short-tailed warbler", "Neumann's warbler", "Hemitesia neumanni"],
  "Silvery-cheeked hornbill": ["Silvery-cheeked hornbill", "Bycanistes brevis"],
  "Sokoke pipit": ["Sokoke pipit", "Anthus sokokensis"],
  "Sokoke scops-owl": ["Sokoke scops owl", "Sokoke scops-owl", "Otus ireneae"],
  "Somali bee-eater": ["Somali bee-eater", "Merops revoilii"],
  "Somali ostrich": ["Somali ostrich", "Struthio molybdophanes"],
  "Southern banded snake eagle": ["Southern banded snake eagle"],
  "Spotted ground thrush": ["Spotted ground thrush", "Geokichla guttata"],
  "Stierling's woodpecker": ["Stierling's woodpecker", "Dendropicos stierlingi"],
  "Strange Weaver": ["Strange weaver", "Ploceus alienus"],
  "Taita apalis": ["Taita apalis", "Apalis fuscigularis"],
  "Taita thrush": ["Taita thrush", "Turdus helleri"],
  "Taita white-eye": ["Taita white-eye", "Zosterops silvanus"],
  "Turner's eremomela": ["Turner's eremomela", "Eremomela turneri"],
  "Verreaux's eagle": ["Verreaux's eagle", "Aquila verreauxii"],
  "Verreaux's eagle-owl": ["Verreaux's eagle-owl", "Verreaux's eagle owl", "Bubo lacteus"],
  "Von der Decken's hornbill": ["Von der Decken's hornbill"],
  "Vulturine guineafowl": ["Vulturine guineafowl", "Acryllium vulturinum"],
  "Wattled crane": ["Wattled crane", "Bugeranus carunculatus", "Grus carunculata"],
  "White-crested Turaco": ["White-crested turaco", "Tauraco leucolophus"],
  "White-throated Blue Swallow": ["White-throated blue swallow", "Hirundo megaensis"],
  "Yellow-billed stork": ["Yellow-billed stork", "Mycteria ibis"],
  "Yellow-collared lovebird": ["Yellow-collared lovebird", "Masked lovebird", "Agapornis personatus"],
  "Yellow-eyed Black Flycatcher": ["Yellow-eyed black flycatcher", "Melaenornis ardesiacus"],
  "Yellow-throated longclaw": ["Yellow-throated longclaw", "Macronyx croceus"],
};

const speciesWithoutTrustedCommonsPhoto = new Set([
  "Shelley's Crimsonwing",
  'Short-tailed Warbler',
  "Stierling's woodpecker",
  "Turner's eremomela",
]);

const badFileWords = [
  'range', 'distribution', 'map', 'locator', 'audio', 'song', 'call',
  'sonogram', 'spectrogram', 'egg', 'eggs', 'nest', 'skull', 'skeleton',
  'stamp', 'coat', 'logo', 'drawing', 'plate', 'illustration',
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (url, options = {}, timeoutMs = 20000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
};

const stripHtml = (value = '') => String(value).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const normalizeBirdName = (value = '') =>
  String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2018\u2019`]/g, "'")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const slugify = (value = '') =>
  normalizeBirdName(value).replace(/\s+/g, '-');

const publicFileIndex = () => {
  const files = readdirSync('public', { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);

  const index = new Map();
  for (const file of files) {
    index.set(file.toLowerCase(), file);
  }
  return index;
};

const existingPublicFiles = publicFileIndex();

const findMatchingLocalAsset = (birdName) => {
  const slug = slugify(birdName);
  const candidates = [
    `${slug}.webp`,
    `${slug}.jpg`,
    `${slug}.jpeg`,
    `${slug}.png`,
    `${slug.replace(/-/g, '')}.webp`,
  ];

  for (const candidate of candidates) {
    const actual = existingPublicFiles.get(candidate.toLowerCase());
    if (actual) return `public/${actual}`;
  }

  return '';
};

const uniqueSpecies = () => {
  const species = new Map();
  for (const park of PARKS_DATA) {
    for (const bird of park.birdsContent?.notableBirds || []) {
      const key = normalizeBirdName(bird.name);
      if (!species.has(key)) {
        species.set(key, {
          name: bird.name.trim(),
          normalizedName: key,
          parks: [],
        });
      }
      species.get(key).parks.push(park.name);
    }
  }
  return [...species.values()].sort((a, b) => a.name.localeCompare(b.name));
};

const api = async (host, params) => {
  const url = new URL(`https://${host}/w/api.php`);
  Object.entries({
    format: 'json',
    origin: '*',
    ...params,
  }).forEach(([key, value]) => url.searchParams.set(key, value));

  let lastStatus = '';

  for (let attempt = 1; attempt <= 4; attempt++) {
    const response = await fetchWithTimeout(url, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (response.ok) return response.json();

    lastStatus = `${response.status}`;
    if (response.status === 429 || response.status >= 500) {
      const waitSeconds = Number(response.headers.get('retry-after') || 0);
      await sleep(waitSeconds ? waitSeconds * 1000 : attempt * 3500);
      continue;
    }

    break;
  }

  throw new Error(`${host} ${lastStatus} for ${url}`);
};

const getPageImageInfo = async (title) => {
  const data = await api('en.wikipedia.org', {
    action: 'query',
    redirects: '1',
    titles: title,
    prop: 'pageimages',
    piprop: 'name|thumbnail|original',
    pithumbsize: '1400',
  });

  const page = Object.values(data.query?.pages || {})[0];
  if (!page || page.missing || !page.pageimage) return null;
  return { pageTitle: page.title, fileName: page.pageimage };
};

const searchWikipediaTitles = async (query) => {
  const data = await api('en.wikipedia.org', {
    action: 'query',
    list: 'search',
    srnamespace: '0',
    srlimit: '6',
    srsearch: `${query} bird`,
  });

  return (data.query?.search || []).map((result) => result.title);
};

const getCommonsImageInfo = async (fileNameOrTitle) => {
  const title = fileNameOrTitle.startsWith('File:') ? fileNameOrTitle : `File:${fileNameOrTitle}`;
  const data = await api('commons.wikimedia.org', {
    action: 'query',
    titles: title,
    prop: 'imageinfo',
    iiprop: 'url|mime|extmetadata',
    iiurlwidth: '1400',
  });

  const page = Object.values(data.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;

  return {
    fileTitle: page.title,
    pageUrl: info.descriptionurl,
    imageUrl: info.thumburl || info.url,
    originalUrl: info.url,
    mime: info.mime,
    author: stripHtml(info.extmetadata?.Artist?.value || info.extmetadata?.Credit?.value || ''),
    license: stripHtml(info.extmetadata?.LicenseShortName?.value || info.extmetadata?.UsageTerms?.value || ''),
    licenseUrl: stripHtml(info.extmetadata?.LicenseUrl?.value || ''),
    credit: stripHtml(info.extmetadata?.Credit?.value || ''),
  };
};

const searchCommonsImages = async (query) => {
  const searches = [
    `"${query}" bird`,
    `${query} bird`,
    query,
  ];

  for (const search of searches) {
    const data = await api('commons.wikimedia.org', {
      action: 'query',
      generator: 'search',
      gsrnamespace: '6',
      gsrlimit: '10',
      gsrsearch: search,
      prop: 'imageinfo',
      iiprop: 'url|mime|extmetadata',
      iiurlwidth: '1400',
    });

    const pages = Object.values(data.query?.pages || {});
    const candidates = pages
      .map((page) => {
        const info = page.imageinfo?.[0];
        if (!info) return null;
        return {
          fileTitle: page.title,
          pageUrl: info.descriptionurl,
          imageUrl: info.thumburl || info.url,
          originalUrl: info.url,
          mime: info.mime,
          author: stripHtml(info.extmetadata?.Artist?.value || info.extmetadata?.Credit?.value || ''),
          license: stripHtml(info.extmetadata?.LicenseShortName?.value || info.extmetadata?.UsageTerms?.value || ''),
          licenseUrl: stripHtml(info.extmetadata?.LicenseUrl?.value || ''),
          credit: stripHtml(info.extmetadata?.Credit?.value || ''),
        };
      })
      .filter(Boolean)
      .filter(isUsableCandidate);

    if (candidates.length) return candidates[0];
  }

  return null;
};

const isUsableCandidate = (candidate) => {
  if (!candidate?.imageUrl || !candidate?.mime?.startsWith('image/')) return false;
  if (/svg|gif/i.test(candidate.mime)) return false;
  const title = `${candidate.fileTitle} ${candidate.imageUrl}`;
  return !badFileWords.some((word) => new RegExp(`\\b${word}\\b`, 'i').test(title));
};

const findCandidate = async (speciesName) => {
  const queries = queryOverrides[speciesName] || [speciesName];
  const titles = [];

  for (const query of queries) {
    titles.push(query);
    try {
      titles.push(...await searchWikipediaTitles(query));
    } catch {}
  }

  for (const title of [...new Set(titles)]) {
    try {
      const pageImage = await getPageImageInfo(title);
      if (!pageImage) continue;
      const candidate = await getCommonsImageInfo(pageImage.fileName);
      if (candidate && isUsableCandidate(candidate)) {
        return {
          ...candidate,
          matchedBy: 'wikipedia-pageimage',
          pageTitle: pageImage.pageTitle,
          query: title,
        };
      }
    } catch {}
    await sleep(450);
  }

  for (const query of queries) {
    try {
      const candidate = await searchCommonsImages(query);
      if (candidate) {
        return {
          ...candidate,
          matchedBy: 'commons-search',
          pageTitle: '',
          query,
        };
      }
    } catch {}
    await sleep(450);
  }

  return null;
};

const downloadImage = async (url) => {
  let lastStatus = '';

  for (let attempt = 1; attempt <= 4; attempt++) {
    const response = await fetchWithTimeout(url, {
      headers: { 'User-Agent': USER_AGENT },
    }, 30000);

    if (response.ok) return Buffer.from(await response.arrayBuffer());

    lastStatus = `${response.status}`;
    if (response.status === 429 || response.status >= 500) {
      const waitSeconds = Number(response.headers.get('retry-after') || 0);
      await sleep(waitSeconds ? waitSeconds * 1000 : attempt * 5000);
      continue;
    }

    break;
  }

  throw new Error(`download ${lastStatus} ${url}`);
};

const writeMapFile = (records) => {
  const entries = records
    .filter((record) => ['downloaded', 'exists', 'local-matching-file'].includes(record.status))
    .sort((a, b) => a.normalizedName.localeCompare(b.normalizedName));

  const lines = [
    '// Generated by scripts/fetch-bird-images.mjs',
    'export const normalizeBirdName = (value = \'\') =>',
    '  String(value)',
    '    .normalize(\'NFKD\')',
    '    .replace(/[\\u0300-\\u036f]/g, \'\')',
    '    .replace(/[\\u2018\\u2019`]/g, "\\\'")',
    '    .toLowerCase()',
    '    .replace(/[^a-z0-9]+/g, \' \')',
    '    .trim();',
    '',
    'export const BIRD_IMAGE_MAP = {',
    ...entries.map((record) => `  ${JSON.stringify(record.normalizedName)}: ${JSON.stringify(record.publicPath)},`),
    '};',
    '',
    'export const getBirdImagePath = (birdName, fallback = \'\') =>',
    '  BIRD_IMAGE_MAP[normalizeBirdName(birdName)] || fallback;',
    '',
  ];

  writeFileSync(MAP_FILE, lines.join('\n'));
};

const writeAttributions = (records) => {
  writeFileSync(ATTRIBUTION_JSON, JSON.stringify(records, null, 2));

  const md = [
    '# Bird Image Attributions',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    ...records.map((record) => [
      `## ${record.name}`,
      '',
      `- Local file: ${record.publicPath || 'Not downloaded'}`,
      `- Status: ${record.status}`,
      `- Match method: ${record.matchedBy || 'n/a'}`,
      `- Query: ${record.query || 'n/a'}`,
      `- Source page: ${record.pageUrl || 'n/a'}`,
      `- Original image: ${record.originalUrl || 'n/a'}`,
      `- Author: ${record.author || 'n/a'}`,
      `- License: ${record.license || 'n/a'}`,
      `- License URL: ${record.licenseUrl || 'n/a'}`,
      '',
    ].join('\n')),
  ];

  writeFileSync(ATTRIBUTION_MD, md.join('\n'));
};

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(REPORT_DIR, { recursive: true });

const species = uniqueSpecies();
const records = [];

for (const [index, bird] of species.entries()) {
  const fileName = `${slugify(bird.name)}.webp`;
  const outputPath = join(OUT_DIR, fileName);
  const publicPath = `/birds/${fileName}`;

  if (speciesWithoutTrustedCommonsPhoto.has(bird.name)) {
    records.push({
      ...bird,
      publicPath: '',
      status: 'no-trusted-photo',
    });
    console.warn(`[${index + 1}/${species.length}] skipped ${bird.name}: no trusted Commons photo`);
    continue;
  }

  if (existsSync(outputPath)) {
    records.push({
      ...bird,
      publicPath,
      status: 'exists',
    });
    console.log(`[${index + 1}/${species.length}] exists ${bird.name}`);
    continue;
  }

  const localAsset = findMatchingLocalAsset(bird.name);
  if (localAsset) {
    await sharp(localAsset)
      .rotate()
      .resize({ width: 1100, height: 820, fit: 'cover', position: 'attention' })
      .webp({ quality: 82 })
      .toFile(outputPath);

    records.push({
      ...bird,
      publicPath,
      status: 'local-matching-file',
      localSource: localAsset.replace(/\\/g, '/'),
    });
    console.log(`[${index + 1}/${species.length}] local ${bird.name} -> ${publicPath}`);
    continue;
  }

  console.log(`[${index + 1}/${species.length}] finding ${bird.name}`);
  const candidate = await findCandidate(bird.name);
  if (!candidate) {
    records.push({
      ...bird,
      publicPath: '',
      status: 'not-found',
    });
    console.warn(`  not found: ${bird.name}`);
    continue;
  }

  try {
    const image = await downloadImage(candidate.imageUrl);
    await sharp(image)
      .rotate()
      .resize({ width: 1100, height: 820, fit: 'cover', position: 'attention' })
      .webp({ quality: 82 })
      .toFile(outputPath);

    records.push({
      ...bird,
      ...candidate,
      publicPath,
      status: 'downloaded',
    });
    console.log(`  saved ${publicPath}`);
  } catch (error) {
    records.push({
      ...bird,
      ...candidate,
      publicPath: '',
      status: `failed: ${error.message}`,
    });
    console.warn(`  failed ${bird.name}: ${error.message}`);
  }

  await sleep(1500);
}

writeMapFile(records);
writeAttributions(records);

const summary = {
  species: species.length,
  ready: records.filter((record) => ['downloaded', 'exists', 'local-matching-file'].includes(record.status)).length,
  notFoundOrFailed: records.filter((record) => !['downloaded', 'exists', 'local-matching-file'].includes(record.status)).length,
};

console.log(JSON.stringify(summary, null, 2));
