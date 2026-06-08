import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const REPORT_DIR = 'reports/next-three-park-images';
const USER_AGENT = 'KarlaSafariAdventures/1.0 image curation contact: info@karlasafariadventures.com';

const readRecords = (path) => (existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : []);

const allRecords = [
  ...readRecords('reports/lewa-open-image-attributions.json'),
  ...readRecords('reports/first-three-park-images/first-three-attributions.json'),
  ...readRecords('reports/kenya-park-images/marsabit-attributions.json'),
  ...readRecords('reports/kenya-park-images/mara-attributions.json'),
  ...readRecords('reports/kenya-park-images/meru-attributions.json'),
  ...readRecords('reports/kenya-park-images/naboisho-attributions.json'),
  ...readRecords('reports/kenya-park-images/maranorth-attributions.json'),
  ...readRecords('reports/kenya-park-images/olpejeta-attributions.json'),
];

const recordByFile = new Map();
for (const record of allRecords) {
  if (record.file) recordByFile.set(record.file.toLowerCase(), record);
}

const sources = {
  marsabit: [
    'marsabit1.webp',
    'marsabit2.webp',
    'marsabit3.webp',
    'marsabit4.webp',
    'marsabit5.webp',
    'marsabit6.webp',
    'marsabit7.webp',
    'marsabit9.webp',
    'marsabit11.webp',
    'marsabit12.webp',
    'marsabit13.webp',
    'marsabit15.webp',
    'marsabit16.webp',
    'marsabit18.webp',
    'marsabit20.webp',
    'marsabit22.webp',
    'lewa1.webp',
    'lewa2.webp',
    'lewa5.webp',
    'lewa7.webp',
    'lewa11.webp',
    'lewa12.webp',
    'lewa13.webp',
    'olpejeta3.webp',
    'olpejeta24.webp',
  ],
  mara: [
    'mara1.webp',
    'mara2.webp',
    'mara3.webp',
    'mara4.webp',
    'mara5.webp',
    'mara6.webp',
    'mara8.webp',
    'mara13.webp',
    'mara14.webp',
    'mara15.webp',
    'mara16.webp',
    'mara20.webp',
    'mara21.webp',
    'mara23.webp',
    'mara24.webp',
    'mara25.webp',
    'naboisho1.webp',
    'naboisho2.webp',
    'maranorth2.webp',
    'maranorth3.webp',
    'maranorth8.webp',
    'maranorth9.webp',
    'maranorth10.webp',
    'mara7.webp',
    'mara11.webp',
  ],
  meru: [
    'meru1.webp',
    'meru3.webp',
    'meru4.webp',
    'meru5.webp',
    'meru6.webp',
    'meru7.webp',
    'meru9.webp',
    'meru10.webp',
    'meru11.webp',
    'meru12.webp',
    'meru13.webp',
    'meru14.webp',
    'meru22.webp',
    'meru23.webp',
    'meru24.webp',
    'meru25.webp',
    'lewa1.webp',
    'lewa2.webp',
    'lewa5.webp',
    'lewa7.webp',
    'lewa11.webp',
    'lewa12.webp',
    'lewa13.webp',
    'olpejeta3.webp',
    'olpejeta24.webp',
  ],
};

const parkNames = {
  marsabit: 'Marsabit National Park',
  mara: 'Masai Mara National Reserve',
  meru: 'Meru National Park',
};

const locationNotes = {
  marsabit:
    'This set prioritizes exact Marsabit National Park and Marsabit/Lake Paradise images. The final slots use open-license northern Kenya wildlife from nearby conservancies where exact park photography was limited.',
  mara:
    'This set prioritizes exact Masai/Maasai Mara National Reserve images and uses open-license Greater Mara conservancy wildlife where useful for coverage.',
  meru:
    'This set prioritizes exact Meru National Park images. The final slots use open-license Kenya wildlife from nearby conservancies for broader safari context.',
};

const unique = (items) => [...new Set(items.filter(Boolean))];

const sourcePageFor = (record) => record?.sourcePage || record?.pageUrl || '';
const originalImageFor = (record) => record?.originalImage || record?.originalUrl || record?.imageUrl || '';
const sourceTitleFor = (record) => record?.sourceTitle || record?.fileTitle || '';

const fetchBuffer = async (record, sourceFile) => {
  const urls = unique([record?.imageUrl, record?.originalUrl, record?.originalImage]);

  for (const url of urls) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        console.warn(`Fetch failed ${response.status} for ${sourceFile}: ${url}`);
        continue;
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.startsWith('image/')) {
        console.warn(`Skipping non-image response for ${sourceFile}: ${contentType}`);
        continue;
      }

      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      clearTimeout(timer);
      console.warn(`Fetch error for ${sourceFile}: ${error.message}`);
    }
  }

  throw new Error(`No usable remote image URL for ${sourceFile}`);
};

const loadSourceBuffer = async (sourceFile, record) => {
  const sourcePath = `public/${sourceFile}`;
  const shouldRefresh = Boolean(originalImageFor(record));

  if (!shouldRefresh && existsSync(sourcePath)) {
    return readFileSync(sourcePath);
  }

  try {
    return await fetchBuffer(record, sourceFile);
  } catch (error) {
    if (existsSync(sourcePath)) {
      console.warn(`${error.message}; using existing local file ${sourcePath}`);
      return readFileSync(sourcePath);
    }
    throw error;
  }
};

const renderContactSheet = async (prefix, records) => {
  const tileW = 280;
  const tileH = 240;
  const imgH = 190;
  const cols = 5;
  const rows = Math.ceil(records.length / cols);
  const composites = [];

  for (const [index, record] of records.entries()) {
    const left = (index % cols) * tileW;
    const top = Math.floor(index / cols) * tileH;
    const image = await sharp(`public/${record.file}`).resize(tileW, imgH, { fit: 'cover' }).toBuffer();
    const label = record.file.replace('.webp', '');
    const svg = Buffer.from(`<svg width="${tileW}" height="${tileH - imgH}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111827"/><text x="10" y="24" font-family="Arial" font-size="16" fill="#f9fafb">${label}</text></svg>`);
    composites.push({ input: image, left, top });
    composites.push({ input: svg, left, top: top + imgH });
  }

  await sharp({
    create: {
      width: cols * tileW,
      height: rows * tileH,
      channels: 3,
      background: '#020617',
    },
  })
    .composite(composites)
    .webp({ quality: 88 })
    .toFile(`${REPORT_DIR}/${prefix}-contact-sheet.webp`);
};

mkdirSync(REPORT_DIR, { recursive: true });

const packaged = [];

for (const [prefix, sourceFiles] of Object.entries(sources)) {
  const records = [];

  for (const [index, sourceFile] of sourceFiles.entries()) {
    const outputFile = `${prefix}${index + 1}.webp`;
    const sourceRecord = recordByFile.get(sourceFile.toLowerCase()) || {};
    const inputBuffer = await loadSourceBuffer(sourceFile, sourceRecord);
    const outputImage = await sharp(inputBuffer)
      .rotate()
      .resize({ width: 1400, height: 950, fit: 'cover', position: 'attention' })
      .webp({ quality: 84 })
      .toBuffer();

    writeFileSync(`public/${outputFile}`, outputImage);

    records.push({
      park: parkNames[prefix],
      file: outputFile,
      publicPath: `/${outputFile}`,
      sourceFile,
      locationNote: locationNotes[prefix],
      sourcePage: sourcePageFor(sourceRecord),
      originalImage: originalImageFor(sourceRecord),
      sourceTitle: sourceTitleFor(sourceRecord),
      author: sourceRecord.author || '',
      license: sourceRecord.license || '',
      licenseUrl: sourceRecord.licenseUrl || '',
    });
  }

  await renderContactSheet(prefix, records);
  writeFileSync(`${REPORT_DIR}/${prefix}-attributions.json`, JSON.stringify(records, null, 2));
  packaged.push(...records);
}

writeFileSync(`${REPORT_DIR}/next-three-attributions.json`, JSON.stringify(packaged, null, 2));
writeFileSync(
  `${REPORT_DIR}/next-three-attributions.md`,
  [
    '# Next Three Park Image Attributions',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    ...packaged.map((record) => [
      `## ${record.park} - ${record.file}`,
      '',
      `- Local file: ${record.publicPath}`,
      `- Source file in this workspace: ${record.sourceFile}`,
      `- Location note: ${record.locationNote}`,
      `- Commons/source page: ${record.sourcePage || 'n/a'}`,
      `- Original image: ${record.originalImage || 'n/a'}`,
      `- Source title: ${record.sourceTitle || 'n/a'}`,
      `- Author: ${record.author || 'n/a'}`,
      `- License: ${record.license || 'n/a'}`,
      `- License URL: ${record.licenseUrl || 'n/a'}`,
      '',
    ].join('\n')),
  ].join('\n'),
);

const summary = Object.entries(sources).map(([prefix]) => ({
  park: parkNames[prefix],
  prefix,
  images: packaged.filter((record) => record.park === parkNames[prefix]).length,
  contactSheet: `${REPORT_DIR}/${prefix}-contact-sheet.webp`,
}));

writeFileSync(`${REPORT_DIR}/summary.json`, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
