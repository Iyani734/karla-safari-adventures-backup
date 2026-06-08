import React, { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { shareImageToSocial } from '../lib/shareImage';

const ImagePopup = ({ isOpen, onClose, images, currentIndex, onPrevious, onNext, title }) => {
  const [screenW, setScreenW] = useState(window.innerWidth);
  const thumbStripRef = useRef(null);
  const thumbRefs     = useRef([]);
  const touchStartX   = useRef(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  useEffect(() => {
    const handleResize = () => setScreenW(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll thumbnail strip to keep active thumb centered
  useEffect(() => {
    const strip = thumbStripRef.current;
    const thumb = thumbRefs.current[currentIndex];
    if (!strip || !thumb) return;
    const stripRect = strip.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const offset = thumbRect.left - stripRect.left - stripRect.width / 2 + thumbRect.width / 2;
    strip.scrollBy({ left: offset, behavior: 'smooth' });
  }, [currentIndex]);

  if (!isOpen) return null;

  const isMobile = screenW < 768;
  const isLarge  = screenW >= 1600;

  const W        = isMobile ? '100%' : (isLarge ? 1100 : 780);
  const H        = isMobile ? '100%' : (isLarge ? 800  : 600);
  const RADIUS   = isMobile ? 0      : 10;

  const HEADER_H    = isLarge ? 66 : (isMobile ? 52 : 54);
  const THUMB_H     = isLarge ? 96 : (isMobile ? 80 : 76);
  const THUMB_W     = isLarge ? 96 : (isMobile ? 76 : 72);
  const THUMB_IMG_H = isLarge ? 74 : (isMobile ? 58 : 56);
  const ARROW_SIZE  = isLarge ? 56 : (isMobile ? 44 : 46);
  const ARROW_ICON  = isLarge ? 28 : (isMobile ? 22 : 24);
  const TITLE_SIZE  = isLarge ? 24 : (isMobile ? 18 : 20);
  const currentSrc   = images[currentIndex];

  const handleShare = async e => {
    e.stopPropagation();
    setIsSharing(true);
    setShareStatus('Preparing image share...');
    try {
      const status = await shareImageToSocial({
        src: currentSrc,
        title: title || 'Karla Safari Adventures gallery image',
        caption: `${title || 'Karla Safari Adventures gallery'} - image ${currentIndex + 1}`,
      });
      setShareStatus(status);
      if (status) window.setTimeout(() => setShareStatus(''), 2600);
    } catch (error) {
      console.error('Unable to share image', error);
      setShareStatus('Image share unavailable. Link copy failed.');
      window.setTimeout(() => setShareStatus(''), 3200);
    } finally {
      setIsSharing(false);
    }
  };

  const handleTouchStart = e => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = e => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? onNext() : onPrevious();
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        // High z-index so floating buttons (cart, scroll-to-top) are hidden beneath
        zIndex: 99999,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: W,
          height: H,
          borderRadius: RADIUS,
          overflow: 'hidden',
          boxShadow: isMobile ? 'none' : '0 12px 48px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div
          style={{
            background: 'linear-gradient(90deg, #F26A0F 0%, #E84A0C 100%)',
            padding: `0 ${isLarge ? 24 : 18}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            height: HEADER_H,
          }}
        >
          <span style={{
            color: '#fff', fontWeight: 700, fontSize: TITLE_SIZE, letterSpacing: 0.2,
            flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {title}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button
              onClick={handleShare}
              disabled={isSharing}
              aria-label={`Share ${title || 'gallery image'} to social media`}
              title="Share image to social media"
              style={{
                background: 'rgba(255,255,255,0.95)', border: 'none', cursor: isSharing ? 'wait' : 'pointer',
                color: '#1f2937', display: 'flex', alignItems: 'center', gap: 6,
                padding: isMobile ? '7px 10px' : '8px 12px',
                borderRadius: 999,
                fontWeight: 800,
                fontSize: isMobile ? 12 : 13,
                opacity: isSharing ? 0.75 : 1,
                boxShadow: '0 3px 10px rgba(0,0,0,0.25)',
              }}
            >
              <Share2 size={isMobile ? 15 : 16} strokeWidth={2.5} />
              <span>{isSharing ? 'Preparing...' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: '#fff', display: 'flex', alignItems: 'center', padding: 4,
              }}
            >
              <X size={isLarge ? 26 : 22} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ── Image area (swipeable) ── */}
        <div
          style={{ position: 'relative', flex: 1, overflow: 'hidden' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Blurred background layer using the same image */}
          <img
            src={images[currentIndex]}
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'blur(18px)',
              transform: 'scale(1.08)', // prevent blur edge fringing
              opacity: 0.7,
            }}
          />
          {/* Dark tint over the blur */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />

          {/* Main image */}
          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            style={{
              position: 'relative',
              width: '100%', height: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />

          {/* Prev arrow */}
          {images.length > 1 && (
            <button
              onClick={onPrevious}
              style={{
                position: 'absolute', left: isLarge ? 18 : 14, top: '50%', transform: 'translateY(-50%)',
                background: '#E84A0C', border: 'none', borderRadius: '50%',
                width: ARROW_SIZE, height: ARROW_SIZE,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff',
                boxShadow: '0 3px 10px rgba(0,0,0,0.4)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#c93d09')}
              onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
            >
              <ChevronLeft size={ARROW_ICON} strokeWidth={2.5} />
            </button>
          )}

          {/* Next arrow */}
          {images.length > 1 && (
            <button
              onClick={onNext}
              style={{
                position: 'absolute', right: isLarge ? 18 : 14, top: '50%', transform: 'translateY(-50%)',
                background: '#E84A0C', border: 'none', borderRadius: '50%',
                width: ARROW_SIZE, height: ARROW_SIZE,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff',
                boxShadow: '0 3px 10px rgba(0,0,0,0.4)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#c93d09')}
              onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
            >
              <ChevronRight size={ARROW_ICON} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* ── Thumbnail strip ── */}
        {images.length > 1 && (
          <div
            ref={thumbStripRef}
            style={{
              background: '#1a1a1a',
              padding: `0 ${isLarge ? 18 : 14}px`,
              display: 'flex',
              gap: isLarge ? 10 : 8,
              overflowX: 'auto',
              flexShrink: 0,
              height: THUMB_H,
              alignItems: 'center',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {images.map((image, index) => (
              <button
                key={index}
                ref={el => { thumbRefs.current[index] = el; }}
                onClick={() => {
                  const delta = index - currentIndex;
                  if (delta === 0) return;
                  const step = delta > 0 ? onNext : onPrevious;
                  for (let i = 0; i < Math.abs(delta); i++) step();
                }}
                style={{
                  flexShrink: 0,
                  width: THUMB_W,
                  height: THUMB_IMG_H,
                  padding: 0,
                  cursor: 'pointer',
                  borderRadius: 7,
                  border: index === currentIndex ? '2.5px solid #E84A0C' : '2.5px solid transparent',
                  overflow: 'hidden',
                  background: '#333',
                  transition: 'border-color 0.15s, opacity 0.15s',
                  opacity: index === currentIndex ? 1 : 0.65,
                }}
                onMouseEnter={e => { if (index !== currentIndex) e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { if (index !== currentIndex) e.currentTarget.style.opacity = '0.65'; }}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
      {shareStatus && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            bottom: isMobile ? 18 : 24,
            transform: 'translateX(-50%)',
            zIndex: 100000,
            background: '#111827',
            color: '#fff',
            borderRadius: 999,
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 700,
            boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
          }}
        >
          {shareStatus}
        </div>
      )}
    </div>
  );
};

export default ImagePopup;
