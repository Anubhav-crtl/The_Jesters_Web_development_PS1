import React, { useState } from 'react';

export default function Slideshow({ media_urls = [], title = 'Post image', placeholderEmoji = '🎗️' }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = Array.isArray(media_urls)
    ? media_urls.filter((url) => typeof url === 'string' && url.trim().length > 0)
    : [];

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  if (images.length === 0) {
    return (
      <div className="post-card-media">
        <div className="post-slideshow-placeholder">
          <span>{placeholderEmoji}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.4rem', fontWeight: 500 }}>
            Verified Ground Seva
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="post-card-media">
      <img
        src={images[currentIndex]}
        alt={`${title} - photo ${currentIndex + 1}`}
        className="post-slideshow-img"
        loading="lazy"
        onError={(e) => {
          // If image fails to load, gracefully fall back
          e.target.style.display = 'none';
        }}
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="slideshow-nav-btn prev"
            onClick={handlePrev}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            className="slideshow-nav-btn next"
            onClick={handleNext}
            aria-label="Next image"
          >
            ›
          </button>
          <div className="slideshow-dots">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`slideshow-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={(e) => handleDotClick(idx, e)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
