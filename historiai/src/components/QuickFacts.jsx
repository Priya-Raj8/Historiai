import React, { useState } from 'react';

const QuickFacts = ({ facts, title }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Validate facts data
  const validFacts = Array.isArray(facts) 
    ? facts.filter(fact => 
        fact && 
        typeof fact === 'object' && 
        fact.label && 
        fact.value
      )
    : [];
  
  // If no valid facts, don't render the component
  if (validFacts.length === 0) {
    return null;
  }
  
  // Determine how many facts to show initially
  const initialDisplay = 5;
  const hasMore = validFacts.length > initialDisplay;
  const displayedFacts = expanded ? validFacts : validFacts.slice(0, initialDisplay);
  
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-white mb-4">Quick Facts</h3>
      
      <div className="bg-[#1E1E1E] rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-[#2A2A2A] rounded-full p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white">Fast Facts</h4>
            <p className="text-gray-400 text-sm">Key information about {title || 'this topic'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedFacts.map((fact, index) => (
            <div key={index} className="bg-[#2A2A2A] rounded-lg p-4">
              <h5 className="text-accent-primary text-sm font-medium mb-1">{fact.label}</h5>
              <p className="text-white">{fact.value}</p>
            </div>
          ))}
        </div>
        
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 flex items-center text-accent-primary hover:text-accent-primary/80 transition-colors"
          >
            {expanded ? (
              <>
                <span>Show less</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </>
            ) : (
              <>
                <span>Show all {validFacts.length} facts</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuickFacts;
