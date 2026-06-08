import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const USER_AGENT = 'KarlaSafariAdventuresKenyaParkImageFetcher/1.0';
const REPORT_DIR = 'reports/kenya-park-images';
const IMAGE_COUNT = 25;
const CONCURRENCY = 5;

const parks = [
  {
    name: 'Loisaba Conservancy',
    prefix: 'loisaba',
    categories: ['Loisaba Conservancy'],
    searchTerms: ['Loisaba Conservancy Kenya', 'Loisaba Kenya wildlife', 'Loisaba Laikipia'],
  },
  {
    name: 'Mara Naboisho Conservancy',
    prefix: 'naboisho',
    categories: ['Naboisho Conservancy', 'Mara Naboisho Conservancy'],
    searchTerms: ['Mara Naboisho Conservancy Kenya', 'Naboisho Conservancy wildlife', 'Mara Naboisho lion'],
  },
  {
    name: 'Mara North Conservancy',
    prefix: 'maranorth',
    categories: ['Mara North Conservancy'],
    searchTerms: ['Mara North Conservancy Kenya', 'Mara North Conservancy wildlife', 'Mara North Kenya lion'],
  },
  {
    name: 'Marsabit National Park',
    prefix: 'marsabit',
    categories: ['Marsabit National Park'],
    searchTerms: ['Marsabit National Park Kenya', 'Marsabit Kenya wildlife', 'Marsabit National Reserve'],
  },
  {
    name: 'Masai Mara National Reserve',
    prefix: 'mara',
    categories: ['Maasai Mara National Reserve', 'Masai Mara National Reserve'],
    searchTerms: ['Maasai Mara National Reserve Kenya', 'Masai Mara wildlife', 'Maasai Mara lion', 'Maasai Mara wildebeest'],
  },
  {
    name: 'Meru National Park',
    prefix: 'meru',
    categories: ['Meru National Park'],
    searchTerms: ['Meru National Park Kenya', 'Meru Kenya wildlife', 'Meru National Park elephant'],
  },
  {
    name: 'Nairobi National Park',
    prefix: 'nairobi-np',
    categories: ['Nairobi National Park'],
    searchTerms: ['Nairobi National Park Kenya', 'Nairobi National Park wildlife', 'Nairobi National Park rhino'],
  },
  {
    name: 'Ol Pejeta Conservancy',
    prefix: 'olpejeta',
    categories: ['Ol Pejeta Conservancy'],
    searchTerms: ['Ol Pejeta Conservancy Kenya', 'Ol Pejeta wildlife', 'Ol Pejeta rhino', 'Ol Pejeta chimpanzee'],
  },
  {
    name: 'Ruma National Park',
    prefix: 'ruma',
    categories: ['Ruma National Park'],
    searchTerms: ['Ruma National Park Kenya', 'Ruma Kenya wildlife', 'Ruma National Park roan antelope'],
  },
  {
    name: 'Saiwa Swamp National Park',
    prefix: 'saiwa',
    categories: ['Saiwa Swamp National Park'],
    searchTerms: ['Saiwa Swamp National Park Kenya', 'Saiwa Swamp sitatunga', 'Saiwa Swamp wildlife'],
  },
  {
    name: 'Samburu National Reserve',
    prefix: 'samburu',
    categories: ['Samburu National Reserve'],
    searchTerms: ['Samburu National Reserve Kenya', 'Samburu wildlife', 'Samburu elephant', 'Samburu special five'],
  },
  {
    name: 'Shaba National Reserve',
    prefix: 'shaba',
    categories: ['Shaba National Reserve'],
    searchTerms: ['Shaba National Reserve Kenya', 'Shaba Kenya wildlife', 'Shaba National Reserve elephant'],
  },
  {
    name: 'Shimba Hills National Reserve',
    prefix: 'shimba',
    categories: ['Shimba Hills National Reserve'],
    searchTerms: ['Shimba Hills National Reserve Kenya', 'Shimba Hills wildlife', 'Shimba Hills sable antelope'],
  },
  {
    name: 'Solio Ranch',
    prefix: 'solio',
    categories: ['Solio Ranch', 'Solio Game Reserve'],
    searchTerms: ['Solio Ranch Kenya', 'Solio Game Reserve rhino', 'Solio Ranch wildlife'],
  },
  {
    name: 'Taita Hills Wildlife Sanctuary',
    prefix: 'taita',
    categories: ['Taita Hills Wildlife Sanctuary'],
    searchTerms: ['Taita Hills Wildlife Sanctuary Kenya', 'Taita Hills wildlife', 'Taita Hills sanctuary elephant'],
  },
  {
    name: 'Tsavo East National Park',
    prefix: 'tsavoeast',
    categories: ['Tsavo East National Park'],
    searchTerms: ['Tsavo East National Park Kenya', 'Tsavo East elephant', 'Tsavo East wildlife', 'red elephants Tsavo East'],
  },
  {
    name: 'Tsavo West National Park',
    prefix: 'tsavowest',
    categories: ['Tsavo West National Park'],
    searchTerms: ['Tsavo West National Park Kenya', 'Tsavo West wildlife', 'Mzima Springs Tsavo West', 'Tsavo West elephant'],
  },
];

const badTitlePattern = /\b(audio|song|call|sonogram|spectrogram|map|locator|distribution|logo|drawing|diagram|plate|illustration|painting|stamp|poster|book|pdf|djvu|webm|ogv)\b/i;

const stripHtml = (value = '') => String(value).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (url, options = {}, timeoutMs = 30000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT, ...(options.headers || {}) },
    });
  } finally {
    clearTimeout(timeout);
  }
};

const api = async (host, params) => {
  const url = new URL(`https://${host}/w/api.php`);
  Object.entries({ format: 'json', origin: '*', ...params }).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetchWithTimeout(url);
    if (response.ok) return response.json();

    if (response.status === 429 || response.status >= 500) {
      const waitSeconds = Number(response.headers.get('retry-after') || 0);
      await sleep(waitSeconds ? waitSeconds * 1000 : attempt * 2500);
      continue;
    }

    return null;
  }

  return null;
};

const makeCandidate = (page, source, query) => {
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
    source,
    query,
  };
};

const isUsableCandidate = (candidate) => {
  if (!candidate?.imageUrl || !candidate?.mime?.startsWith('image/')) return false;
  if (!/image\/(jpeg|png|webp|tiff)/i.test(candidate.mime)) return false;
  if (badTitlePattern.test(`${candidate.fileTitle} ${candidate.imageUrl}`)) return false;
  return true;
};

const uniqueCandidates = (items) => {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = item.originalUrl || item.fileTitle;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
};

const categoryCandidates = async (category) => {
  const data = await api('commons.wikimedia.org', {
    action: 'query',
    generator: 'categorymembers',
    gcmtitle: `Category:${category}`,
    gcmnamespace: '6',
    gcmlimit: '50',
    prop: 'imageinfo',
    iiprop: 'url|mime|extmetadata',
    iiurlwidth: '1800',
  });

  return Object.values(data?.query?.pages || {})
    .map((page) => makeCandidate(page, 'commons-category', category))
    .filter(isUsableCandidate);
};

const searchCandidates = async (query) => {
  const searches = [`"${query}"`, `${query} Kenya`, `${query} wildlife`, query];
  const candidates = [];

  for (const search of searches) {
    const data = await api('commons.wikimedia.org', {
      action: 'query',
      generator: 'search',
      gsrnamespace: '6',
      gsrlimit: '18',
      gsrsearch: search,
      prop: 'imageinfo',
      iiprop: 'url|mime|extmetadata',
      iiurlwidth: '1800',
    });

    candidates.push(
      ...Object.values(data?.query?.pages || {})
        .map((page) => makeCandidate(page, 'commons-search', search))
        .filter(isUsableCandidate),
    );
  }

  return uniqueCandidates(candidates);
};

const scoreCandidate = (candidate, park) => {
  const haystack = `${candidate.fileTitle} ${candidate.query}`.toLowerCase();
  let score = 0;
  const words = park.name.toLowerCase().split(/\s+/).filter((word) => word.length > 3);
  for (const word of words) {
    if (haystack.includes(word)) score += 5;
  }
  if (candidate.source === 'commons-category') score += 20;
  if (/kenya|maasai|masai|samburu|tsavo|nairobi|meru|mara|laikipia|ol pejeta|solio|shimba|shaba|ruma|saiwa|taita|loisaba|naboisho|marsabit/i.test(haystack)) {
    score += 4;
  }
  if (/lion|elephant|rhino|zebra|giraffe|buffalo|gazelle|antelope|warthog|cheetah|leopard|crane|bird|landscape|sunrise|river|waterfall/i.test(haystack)) {
    score += 2;
  }
  return score;
};

const collectCandidates = async (park) => {
  const categoryResults = [];
  for (const category of park.categories) {
    categoryResults.push(...await categoryCandidates(category));
    await sleep(150);
  }

  const searchResults = [];
  for (const term of park.searchTerms) {
    searchResults.push(...await searchCandidates(term));
    await sleep(150);
  }

  return uniqueCandidates([...categoryResults, ...searchResults])
    .map((candidate) => ({ ...candidate, score: scoreCandidate(candidate, park) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, IMAGE_COUNT);
};

const downloadImage = async (url) => {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetchWithTimeout(url, {}, 45000);
    if (response.ok) return Buffer.from(await response.arrayBuffer());

    if (response.status === 429 || response.status >= 500) {
      const waitSeconds = Number(response.headers.get('retry-after') || 0);
      await sleep(waitSeconds ? waitSeconds * 1000 : attempt * 3500);
      continue;
    }

    throw new Error(`download ${response.status}`);
  }

  throw new Error('download retry limit reached');
};

const processPool = async (items, worker) => {
  const results = new Array(items.length);
  let index = 0;

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await worker(items[current], current);
    }
  }));

  return results;
};

const renderContactSheet = async (park, downloaded) => {
  const tileW = 260;
  const tileH = 220;
  const imgH = 170;
  const cols = 5;
  const rows = Math.ceil(downloaded.length / cols);
  const composites = [];

  for (const [index, record] of downloaded.entries()) {
    const left = (index % cols) * tileW;
    const top = Math.floor(index / cols) * tileH;
    const image = await sharp(`public/${record.file}`).resize(tileW, imgH, { fit: 'cover' }).toBuffer();
    const label = `${park.prefix}${index + 1}`;
    const svg = Buffer.from(`<svg width="${tileW}" height="${tileH - imgH}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111827"/><text x="10" y="24" font-family="Arial" font-size="16" fill="#f9fafb">${label}</text></svg>`);
    composites.push({ input: image, left, top });
    composites.push({ input: svg, left, top: top + imgH });
  }

  await sharp({
    create: {
      width: cols * tileW,
      height: Math.max(rows, 1) * tileH,
      channels: 3,
      background: '#020617',
    },
  })
    .composite(composites)
    .webp({ quality: 88 })
    .toFile(`${REPORT_DIR}/${park.prefix}-contact-sheet.webp`);
};

mkdirSync(REPORT_DIR, { recursive: true });

const allRecords = [];

for (const park of parks) {
  console.log(`\n## ${park.name}`);
  const candidates = await collectCandidates(park);
  console.log(`  candidates: ${candidates.length}`);

  const records = await processPool(candidates, async (candidate, index) => {
    const file = `${park.prefix}${index + 1}.webp`;
    try {
      const image = await downloadImage(candidate.imageUrl);
      await sharp(image)
        .rotate()
        .resize({ width: 1400, height: 950, fit: 'cover', position: 'attention' })
        .webp({ quality: 84 })
        .toFile(`public/${file}`);

      console.log(`  saved ${file}`);
      return {
        park: park.name,
        file,
        publicPath: `/${file}`,
        status: 'downloaded',
        ...candidate,
      };
    } catch (error) {
      console.warn(`  failed ${file}: ${error.message}`);
      return {
        park: park.name,
        file,
        publicPath: '',
        status: `failed: ${error.message}`,
        ...candidate,
      };
    }
  });

  const downloaded = records.filter((record) => record.status === 'downloaded');
  if (downloaded.length) {
    await renderContactSheet(park, downloaded);
  }

  writeFileSync(`${REPORT_DIR}/${park.prefix}-attributions.json`, JSON.stringify(records, null, 2));
  allRecords.push(...records);
  console.log(`  downloaded: ${downloaded.length}/${IMAGE_COUNT}`);
}

writeFileSync(`${REPORT_DIR}/all-kenya-park-image-attributions.json`, JSON.stringify(allRecords, null, 2));

writeFileSync(
  `${REPORT_DIR}/all-kenya-park-image-attributions.md`,
  [
    '# Kenya Park Open Image Attributions',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'Images were downloaded from Wikimedia Commons search/category results, not copied from SafariBookings.',
    '',
    ...allRecords.map((record) => [
      `## ${record.park} - ${record.file}`,
      '',
      `- Local file: ${record.publicPath || 'Not downloaded'}`,
      `- Status: ${record.status}`,
      `- Source: ${record.source || 'n/a'}`,
      `- Query/category: ${record.query || 'n/a'}`,
      `- Source page: ${record.pageUrl || 'n/a'}`,
      `- Original image: ${record.originalUrl || 'n/a'}`,
      `- Author: ${record.author || 'n/a'}`,
      `- License: ${record.license || 'n/a'}`,
      `- License URL: ${record.licenseUrl || 'n/a'}`,
      '',
    ].join('\n')),
  ].join('\n'),
);

const summary = parks.map((park) => ({
  park: park.name,
  prefix: park.prefix,
  downloaded: allRecords.filter((record) => record.park === park.name && record.status === 'downloaded').length,
}));

writeFileSync(`${REPORT_DIR}/summary.json`, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
