const SITE_URL = 'https://karlasafariadventures.com';

const sanitizeFileName = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'karla-safari-image';

const resolveImageUrl = (src) => {
  if (!src && typeof window !== 'undefined') return window.location.href;
  if (/^https?:\/\//i.test(src)) return src;
  if (typeof window === 'undefined') return `${SITE_URL}${src}`;
  return new URL(src, window.location.origin).href;
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image: ${src}`));
    image.src = src;
  });

const createShareFile = async (src, title) => {
  const image = await loadImage(src);
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to prepare image share.');
  ctx.drawImage(image, 0, 0, width, height);

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('Unable to export image share.'))),
      'image/jpeg',
      0.92,
    );
  });

  return new File([blob], `${sanitizeFileName(title)}-karla-safari-adventures.jpg`, { type: 'image/jpeg' });
};

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
};

export const shareImageToSocial = async ({ src, title = 'Karla Safari Adventures image', caption }) => {
  const imageUrl = resolveImageUrl(src);
  const shareText = `${caption || 'Safari image from Karla Safari Adventures.'}\n${imageUrl}`;

  if (navigator.share) {
    if (src) {
      try {
        const file = await createShareFile(src, title);
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title, text: shareText, files: [file] });
          return 'Image ready to share.';
        }
      } catch (error) {
        console.warn('Image file sharing is unavailable; falling back to link share.', error);
      }
    }

    try {
      await navigator.share({ title, text: shareText, url: imageUrl });
      return 'Image link ready to share.';
    } catch (error) {
      if (error?.name === 'AbortError') return '';
    }
  }

  await copyText(`${title}\n${shareText}`);
  return 'Image link copied.';
};
