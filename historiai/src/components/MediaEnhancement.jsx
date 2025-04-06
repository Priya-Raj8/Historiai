import React, { useState, useRef, useEffect } from 'react';

const MediaEnhancement = ({ content, videoUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const audioRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle video errors
  const handleVideoError = () => {
    setVideoError(true);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    const video = document.getElementById('history-video');
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play().catch(error => {
          console.error('Error playing video:', error);
          setVideoError(true);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const speakText = () => {
    if (!content) return;

    // Stop any ongoing speech
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    try {
      // Create a new speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(content.substring(0, 5000)); // Limit to prevent issues
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1;

      // Set up event handlers
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      // Store reference for cleanup
      speechSynthesisRef.current = utterance;

      // Speak the text
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    }
  };

  // If no content or video URL, don't render
  if (!content && !videoUrl) return null;

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-white mb-4">Media Resources</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video Section */}
        {videoUrl && !videoError ? (
          <div className={`bg-[#1E1E1E] rounded-lg overflow-hidden ${videoExpanded ? 'md:col-span-2' : ''}`}>
            <div className="aspect-w-16 aspect-h-9 relative">
              <iframe
                id="history-video"
                src={videoUrl}
                title={`${title || 'Historical'} video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                onError={handleVideoError}
              ></iframe>
              
              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                <button
                  onClick={handlePlayPause}
                  className="bg-accent-primary hover:bg-accent-primary/90 text-white rounded-full p-2 mr-2"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={() => setVideoExpanded(!videoExpanded)}
                  className="bg-accent-primary hover:bg-accent-primary/90 text-white rounded-full p-2"
                  aria-label={videoExpanded ? 'Shrink video' : 'Expand video'}
                >
                  {videoExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="text-lg font-semibold text-white mb-1">{title || 'Historical Overview'}</h4>
              <p className="text-gray-400 text-sm">Video resource to enhance your learning experience</p>
            </div>
          </div>
        ) : videoUrl && videoError ? (
          <div className="bg-[#1E1E1E] rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-lg font-semibold text-white mb-2">Video Unavailable</h4>
            <p className="text-gray-400 mb-4">Sorry, the video content could not be loaded.</p>
            <a 
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' history')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent-primary hover:bg-accent-primary/90 text-white py-2 px-4 rounded-full text-sm transition-colors"
            >
              Search on YouTube
            </a>
          </div>
        ) : null}
        
        {/* Audio Narration Section */}
        {content && (
          <div className="bg-[#1E1E1E] rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-[#2A2A2A] rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Audio Narration</h4>
                <p className="text-gray-400 text-sm">Listen to the content being read aloud</p>
              </div>
            </div>
            
            <button
              onClick={speakText}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-lg transition-colors ${
                isSpeaking 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-accent-primary hover:bg-accent-primary/90 text-white'
              }`}
            >
              {isSpeaking ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                  Stop Narration
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Start Narration
                </>
              )}
            </button>
            
            <div className="mt-4 text-gray-400 text-sm">
              <p>This feature uses your device's text-to-speech capabilities to read the content aloud.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaEnhancement;
