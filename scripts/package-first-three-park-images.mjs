import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const REPORT_DIR = 'reports/first-three-park-images';

const readRecords = (path) => (existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : []);

const allRecords = [
  ...readRecords('reports/lewa-open-image-attributions.json'),
  ...readRecords('reports/kenya-park-images/naboisho-attributions.json'),
  ...readRecords('reports/kenya-park-images/maranorth-attributions.json'),
  ...readRecords('reports/kenya-park-images/mara-attributions.json'),
  ...readRecords('reports/kenya-park-images/olpejeta-attributions.json'),
];

const recordByFile = new Map();
for (const record of allRecords) {
  if (record.file) recordByFile.set(record.file.toLowerCase(), record);
}

const sources = {
  loisaba: [
    'lewa1.webp', 'lewa2.webp', 'lewa3.webp', 'lewa4.webp', 'lewa5.webp',
    'lewa7.webp', 'lewa8.webp', 'lewa9.webp', 'lewa11.webp', 'lewa12.webp',
    'lewa13.webp', 'lewa15.webp', 'lewa16.webp', 'lewa17.webp', 'lewa19.webp',
    'lewa20.webp', 'lewa21.webp', 'lewa22.webp', 'lewa23.webp', 'lewa24.webp',
    'lewa25.webp', 'lewa6.webp', 'olpejeta3.webp', 'olpejeta18.webp', 'olpejeta24.webp',
  ],
  naboisho: [
    'naboisho1.webp', 'naboisho2.webp', 'mara1.webp', 'mara4.webp', 'mara15.webp',
    'mara20.webp', 'mara25.webp', 'maranorth2.webp', 'maranorth3.webp', 'maranorth8.webp',
    'maranorth9.webp', 'maranorth10.webp', 'lewa4.webp', 'lewa6.webp', 'lewa10.webp',
    'lewa12.webp', 'lewa13.webp', 'lewa16.webp', 'lewa18.webp', 'lewa19.webp',
    'lewa21.webp', 'lewa23.webp', 'lewa25.webp', 'lewa7.webp', 'lewa11.webp',
  ],
  maranorth: [
    'maranorth2.webp', 'maranorth3.webp', 'maranorth8.webp', 'maranorth9.webp', 'maranorth10.webp',
    'mara1.webp', 'mara4.webp', 'mara15.webp', 'mara20.webp', 'mara25.webp',
    'naboisho1.webp', 'naboisho2.webp', 'lewa4.webp', 'lewa6.webp', 'lewa10.webp',
    'lewa12.webp', 'lewa13.webp', 'lewa16.webp', 'lewa18.webp', 'lewa19.webp',
    'lewa21.webp', 'lewa23.webp', 'lewa25.webp', 'lewa7.webp', 'lewa11.webp',
  ],
};

const parkNames = {
  loisaba: 'Loisaba Conservancy',
  naboisho: 'Mara Naboisho Conservancy',
  maranorth: 'Mara North Conservancy',
};

const locationNotes = {
  loisaba: 'Exact open Commons images for Loisaba are scarce; this set uses open-license Laikipia/northern Kenya wildlife and landscape images from nearby conservancies and reserves.',
  naboisho: 'This set combines exact Naboisho images where available with open-license Greater Mara wildlife images.',
  maranorth: 'This set combines exact Mara North images where available with open-license Greater Mara wildlife images.',
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
    const sourcePath = `public/${sourceFile}`;
    if (!existsSync(sourcePath)) {
      throw new Error(`Missing source image: ${sourcePath}`);
    }

    if (sourceFile.toLowerCase() !== outputFile.toLowerCase()) {
      const outputImage = await sharp(sourcePath)
        .rotate()
        .resize({ width: 1400, height: 950, fit: 'cover', position: 'attention' })
        .webp({ quality: 84 })
        .toBuffer();

      await sharp(outputImage).toFile(`public/${outputFile}`);
    }

    const sourceRecord = recordByFile.get(sourceFile.toLowerCase()) || {};
    records.push({
      park: parkNames[prefix],
      file: outputFile,
      publicPath: `/${outputFile}`,
      sourceFile,
      locationNote: locationNotes[prefix],
      sourcePage: sourceRecord.pageUrl || '',
      originalImage: sourceRecord.originalUrl || '',
      sourceTitle: sourceRecord.fileTitle || '',
      author: sourceRecord.author || '',
      license: sourceRecord.license || '',
      licenseUrl: sourceRecord.licenseUrl || '',
    });
  }

  await renderContactSheet(prefix, records);
  writeFileSync(`${REPORT_DIR}/${prefix}-attributions.json`, JSON.stringify(records, null, 2));
  packaged.push(...records);
}

writeFileSync(`${REPORT_DIR}/first-three-attributions.json`, JSON.stringify(packaged, null, 2));
writeFileSync(
  `${REPORT_DIR}/first-three-attributions.md`,
  [
    '# First Three Park Image Attributions',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    ...packaged.map((record) => [
      `## ${record.park} - ${record.file}`,
      '',
      `- Local file: ${record.publicPath}`,
      `- Source file in this workspace: ${record.sourceFile}`,
      `- Location note: ${record.locationNote}`,
      `- Commons source page: ${record.sourcePage || 'n/a'}`,
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
