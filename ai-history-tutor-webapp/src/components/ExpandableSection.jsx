import React, { useState, useEffect } from 'react';

const ExpandableSection = ({ id, title, content, highlightTerms = [], keyTerms = [], isActive = false }) => {
  const [isExpanded, setIsExpanded] = useState(isActive);

  // Update expanded state when isActive changes
  useEffect(() => {
    if (isActive) {
      setIsExpanded(true);
    }
  }, [isActive]);

  // Function to highlight terms in text content
  const highlightText = (text) => {
    if ((!highlightTerms || !highlightTerms.length) && (!keyTerms || !keyTerms.length) || typeof text !== 'string') return text;

    // Use highlightTerms if available, otherwise fall back to keyTerms for backward compatibility
    const terms = highlightTerms.length > 0 ? highlightTerms : keyTerms;
    
    let result = text;
    terms.forEach(term => {
      const termText = term.term || term;
      const definition = term.definition || 'Important historical term';
      const regex = new RegExp(`\\b(${termText})\\b`, 'gi');
      result = result.replace(regex, `<span class="bg-accent-primary/20 text-accent-primary px-1 rounded cursor-help" title="${definition}">$1</span>`);
    });

    return result;
  };

  return (
    <div id={id} className="mb-6 bg-[#1E1E1E] rounded-lg overflow-hidden scroll-mt-24">
      <button
        className={`w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-[#3A3A3A] ${isActive ? 'bg-[#3A3A3A]' : 'bg-[#2A2A2A]'}`}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`content-${id}`}
      >
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
      
      <div 
        id={`content-${id}`}
        className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 text-gray-300 leading-relaxed">
          {Array.isArray(content) ? (
            content.map((paragraph, idx) => (
              <p 
                key={idx} 
                className="mb-4"
                dangerouslySetInnerHTML={{ __html: highlightText(paragraph) }}
              />
            ))
          ) : (
            <div dangerouslySetInnerHTML={{ __html: highlightText(content) }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpandableSection;
