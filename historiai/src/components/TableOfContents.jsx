import React, { useState, useEffect } from 'react';

const TableOfContents = ({ sections, activeSection, onSectionClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle empty or invalid sections
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return (
      <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-4">
        <p className="text-gray-400 text-sm">No sections available</p>
      </div>
    );
  }

  // Calculate reading progress
  const progress = calculateProgress(sections, activeSection);

  return (
    <div className={`${isMobile ? 'sticky top-16 z-20' : 'sticky top-24 self-start'} mb-6`}>
      {isMobile ? (
        <div className="bg-[#1E1E1E] rounded-lg shadow-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-3 bg-[#2A2A2A] text-white"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="font-medium">Table of Contents</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'transform rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
            <nav className="p-3">
              <ul className="space-y-1">
                {sections.map((section, index) => (
                  <li key={index}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-accent-primary text-white'
                          : 'text-gray-300 hover:bg-[#2A2A2A]'
                      }`}
                      onClick={() => {
                        onSectionClick(section.id);
                        setIsExpanded(false);
                      }}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      ) : (
        <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-4">
          <div className="mb-4">
            <h3 className="font-semibold text-white mb-1">Table of Contents</h3>
            <div className="h-1 w-16 bg-accent-primary"></div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 w-full bg-[#2A2A2A] rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <nav>
            <ul className="space-y-1">
              {sections.map((section, index) => (
                <li key={index}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-accent-primary text-white'
                        : 'text-gray-300 hover:bg-[#2A2A2A]'
                    }`}
                    onClick={() => onSectionClick(section.id)}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate reading progress
const calculateProgress = (sections, activeSection) => {
  if (!sections || sections.length === 0 || !activeSection) return 0;
  
  const currentIndex = sections.findIndex(section => section.id === activeSection);
  if (currentIndex === -1) return 0;
  
  return Math.round(((currentIndex + 1) / sections.length) * 100);
};

export default TableOfContents;
