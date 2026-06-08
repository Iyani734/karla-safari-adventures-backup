import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const USER_AGENT = 'KarlaSafariAdventuresLewaImageFetcher/1.0';
const REPORT_DIR = 'reports';

const shots = [
  { file: 'lewa1.webp', subject: 'Black rhino in Lewa Wildlife Conservancy', fileTitle: 'File:Black Rhinos Kenya.jpg', exactLewa: true },
  { file: 'lewa2.webp', subject: "Grevy's zebra in Lewa Wildlife Conservancy", fileTitle: 'File:Equus grevyi 1.jpg', exactLewa: true },
  { file: 'lewa3.webp', subject: 'White rhino', fileTitle: 'File:White rhinoceros (Ceratotherium simum) juvenile Kruger.jpg' },
  { file: 'lewa4.webp', subject: 'Lion in tall grass', fileTitle: 'File:León (Panthera leo), reserva natural Masái Mara, Kenia, 2024-05-20, DD 28.jpg' },
  { file: 'lewa5.webp', subject: "Grevy's zebra in Lewa Wildlife Conservancy", fileTitle: 'File:The Lewa Zebra - panoramio.jpg', exactLewa: true },
  { file: 'lewa6.webp', subject: 'Common eland', fileTitle: 'File:Eland común (Taurotragus oryx), reserva natural Masái Mara, Kenia, 2024-05-20, DD 08.jpg' },
  { file: 'lewa7.webp', subject: 'Elephant in Lewa Wildlife Conservancy', fileTitle: 'File:Mother Elephant.jpg', exactLewa: true },
  { file: 'lewa8.webp', subject: 'Reticulated giraffe in Lewa Wildlife Conservancy', fileTitle: 'File:Giraffa camelopardalis-Lewa Kenya.jpg', exactLewa: true },
  { file: 'lewa9.webp', subject: 'View of Mt Kenya and Lewa landscape', fileTitle: 'File:Lewa Wildlife Conservancy.jpg', exactLewa: true },
  { file: 'lewa10.webp', subject: 'Plains zebras', searchTerms: ['plains zebra Kenya', 'Equus quagga Kenya'] },
  { file: 'lewa11.webp', subject: 'Male impala in Lewa Wildlife Conservancy', fileTitle: 'File:Impala (32163044688).jpg', exactLewa: true },
  { file: 'lewa12.webp', subject: 'African buffalo', searchTerms: ['African buffalo Kenya', 'Syncerus caffer Kenya'] },
  { file: 'lewa13.webp', subject: 'Elephant herd', searchTerms: ['African elephant Kenya', 'Loxodonta africana Kenya'] },
  { file: 'lewa14.webp', subject: "Grevy's zebra", searchTerms: ["Grevy's zebra Kenya", 'Equus grevyi Kenya'] },
  { file: 'lewa15.webp', subject: 'Mother and baby white rhino', fileTitle: 'File:White rhinoceros (Ceratotherium simum) and calf 6m.jpg' },
  { file: 'lewa16.webp', subject: 'Sunrise in Lewa-style savanna', fileTitle: 'File:East African sunrise, Samburu National Reserve, Kenya.jpg' },
  { file: 'lewa17.webp', subject: 'Buffalo herd', searchTerms: ['African buffalo herd Kenya', 'Cape buffalo herd Kenya'] },
  { file: 'lewa18.webp', subject: 'Defassa waterbuck', searchTerms: ['Defassa waterbuck Kenya', 'Kobus ellipsiprymnus defassa'] },
  { file: 'lewa19.webp', subject: 'Grey crowned cranes', searchTerms: ['grey crowned crane Kenya', 'Balearica regulorum Kenya'] },
  { file: 'lewa20.webp', subject: "Grevy's zebra close view", fileTitle: 'File:Zebra July 2008-1.jpg' },
  { file: 'lewa21.webp', subject: "Grant's gazelle", fileTitle: 'File:Gacela de Grant (Nanger granti), parque nacional de Amboseli, Kenia, 2024-05-22, DD 94.jpg' },
  { file: 'lewa22.webp', subject: 'Blue pansy butterfly', searchTerms: ['blue pansy butterfly Africa', 'Junonia orithya Africa'] },
  { file: 'lewa23.webp', subject: 'Vervet monkey', searchTerms: ['vervet monkey Kenya', 'Chlorocebus pygerythrus Kenya'] },
  { file: 'lewa24.webp', subject: 'Stormy Lewa landscape', fileTitle: 'File:Road to Lewa (Kenya).jpg', exactLewa: true },
  { file: 'lewa25.webp', subject: 'Warthog', fileTitle: 'File:Phacochoerus africanus -Hells Gate National Park, Kenya-8.jpg' },
];

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
      await sleep(waitSeconds ? waitSeconds * 1000 : attempt * 4000);
      continue;
    }

    throw new Error(`${host} ${response.status} for ${url}`);
  }

  throw new Error(`${host} retry limit for ${url}`);
};

const candidateFromImageInfo = (page, matchedBy, query) => {
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
    matchedBy,
    query,
  };
};

const isUsableCandidate = (candidate) => {
  if (!candidate?.imageUrl || !candidate?.mime?.startsWith('image/')) return false;
  if (/svg|gif/i.test(candidate.mime)) return false;
  const title = `${candidate.fileTitle} ${candidate.imageUrl}`;
  return !/\b(range|distribution|map|locator|audio|song|call|sonogram|spectrogram|logo|drawing|plate|diagram|illustration)\b/i.test(title);
};

const getCommonsFile = async (fileTitle) => {
  const data = await api('commons.wikimedia.org', {
    action: 'query',
    titles: fileTitle,
    prop: 'imageinfo',
    iiprop: 'url|mime|extmetadata',
    iiurlwidth: '1800',
  });
  const page = Object.values(data.query?.pages || {})[0];
  const candidate = candidateFromImageInfo(page, 'commons-file', fileTitle);
  return isUsableCandidate(candidate) ? candidate : null;
};

const searchCommons = async (terms) => {
  for (const term of terms) {
    const searches = [`"${term}"`, `"${term}" Kenya`, `${term} wildlife`, term];

    for (const search of searches) {
      const data = await api('commons.wikimedia.org', {
        action: 'query',
        generator: 'search',
        gsrnamespace: '6',
        gsrlimit: '10',
        gsrsearch: search,
        prop: 'imageinfo',
        iiprop: 'url|mime|extmetadata',
        iiurlwidth: '1800',
      });

      const candidates = Object.values(data.query?.pages || {})
        .map((page) => candidateFromImageInfo(page, 'commons-search', search))
        .filter(isUsableCandidate);

      if (candidates.length) return candidates[0];
      await sleep(250);
    }
  }

  return null;
};

const downloadImage = async (url) => {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetchWithTimeout(url, {}, 45000);
    if (response.ok) return Buffer.from(await response.arrayBuffer());

    if (response.status === 429 || response.status >= 500) {
      const waitSeconds = Number(response.headers.get('retry-after') || 0);
      await sleep(waitSeconds ? waitSeconds * 1000 : attempt * 5000);
      continue;
    }

    throw new Error(`download ${response.status} ${url}`);
  }

  throw new Error(`download retry limit ${url}`);
};

mkdirSync(REPORT_DIR, { recursive: true });

const records = [];

for (const [index, shot] of shots.entries()) {
  console.log(`[${index + 1}/${shots.length}] ${shot.subject}`);
  const candidate = shot.fileTitle
    ? await getCommonsFile(shot.fileTitle)
    : await searchCommons(shot.searchTerms || [shot.subject]);

  if (!candidate) {
    records.push({ ...shot, status: 'not-found' });
    console.warn(`  not found: ${shot.subject}`);
    continue;
  }

  try {
    const image = await downloadImage(candidate.imageUrl);
    await sharp(image)
      .rotate()
      .resize({ width: 1400, height: 950, fit: 'cover', position: 'attention' })
      .webp({ quality: 84 })
      .toFile(`public/${shot.file}`);

    records.push({
      ...shot,
      ...candidate,
      publicPath: `/${shot.file}`,
      status: 'downloaded',
    });
    console.log(`  saved /${shot.file} from ${candidate.fileTitle}`);
  } catch (error) {
    records.push({
      ...shot,
      ...candidate,
      status: `failed: ${error.message}`,
    });
    console.warn(`  failed: ${error.message}`);
  }

  await sleep(800);
}

writeFileSync('reports/lewa-open-image-attributions.json', JSON.stringify(records, null, 2));
writeFileSync(
  'reports/lewa-open-image-attributions.md',
  [
    '# Lewa Open Image Attributions',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'SafariBookings was used only as a subject/shot list. These files were downloaded from Wikimedia Commons, not SafariBookings.',
    '',
    ...records.map((record) => [
      `## ${record.file || record.subject}`,
      '',
      `- Subject: ${record.subject}`,
      `- Local file: ${record.publicPath || 'Not downloaded'}`,
      `- Status: ${record.status}`,
      `- Exact Lewa Commons category file: ${record.exactLewa ? 'yes' : 'no'}`,
      `- Source page: ${record.pageUrl || 'n/a'}`,
      `- Original image: ${record.originalUrl || 'n/a'}`,
      `- Author: ${record.author || 'n/a'}`,
      `- License: ${record.license || 'n/a'}`,
      `- License URL: ${record.licenseUrl || 'n/a'}`,
      '',
    ].join('\n')),
  ].join('\n'),
);

const ready = records.filter((record) => record.status === 'downloaded').length;
console.log(JSON.stringify({ requested: shots.length, downloaded: ready }, null, 2));
