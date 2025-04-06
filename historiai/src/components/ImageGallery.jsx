import React, { useState, useEffect } from 'react';

const ImageGallery = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [validImages, setValidImages] = useState([]);

  // Filter and validate images on component mount or when images prop changes
  useEffect(() => {
    if (!images || !Array.isArray(images)) {
      setValidImages([]);
      return;
    }

    // Filter out invalid image URLs
    const filtered = images.filter(img => 
      img && typeof img === 'string' && 
      !img.includes('svg') && 
      !img.includes('Special:') && 
      !img.includes('Commons:')
    );
    
    setValidImages(filtered);
    // Reset active index when images change
    setActiveIndex(0);
  }, [images]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowRight' && validImages.length > 1) {
        setActiveIndex((prevIndex) => (prevIndex + 1) % validImages.length);
      } else if (e.key === 'ArrowLeft' && validImages.length > 1) {
        setActiveIndex((prevIndex) => (prevIndex - 1 + validImages.length) % validImages.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, validImages.length]);

  const nextImage = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % validImages.length);
  };

  const prevImage = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + validImages.length) % validImages.length);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Don't render if no valid images
  if (!validImages || validImages.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 relative">
      <h3 className="text-2xl font-bold text-white mb-4">Image Gallery</h3>
      
      {/* Main Image Display */}
      <div 
        className={`relative rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-black flex items-center justify-center' : ''}`}
      >
        <img 
          src={validImages[activeIndex]} 
          alt={`${title || 'Topic'} - Image ${activeIndex + 1}`} 
          className={`${isFullscreen ? 'max-h-screen max-w-full object-contain' : 'w-full h-[400px] object-cover'}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(title || 'history')}`;
          }}
        />
        
        {/* Navigation arrows */}
        {validImages.length > 1 && (
          <>
            <button 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              onClick={nextImage}
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Fullscreen toggle */}
        <button 
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        {/* Image counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {activeIndex + 1} / {validImages.length}
          </div>
        )}
      </div>
      
      {/* Thumbnail navigation */}
      {validImages.length > 1 && (
        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
          {validImages.map((img, index) => (
            <button
              key={index}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                index === activeIndex ? 'border-accent-primary' : 'border-transparent hover:border-gray-400'
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://source.unsplash.com/random/100x100/?${encodeURIComponent(title || 'history')}`;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
