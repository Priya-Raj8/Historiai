import React, { useState } from 'react';

const KeyTakeaways = ({ takeaways, title }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Validate takeaways data
  const validTakeaways = Array.isArray(takeaways) 
    ? takeaways.filter(item => item && typeof item === 'string')
    : [];
  
  // If no valid takeaways, don't render the component
  if (validTakeaways.length === 0) {
    return null;
  }
  
  // Determine how many takeaways to show initially
  const initialDisplay = 3;
  const hasMore = validTakeaways.length > initialDisplay;
  const displayedTakeaways = expanded ? validTakeaways : validTakeaways.slice(0, initialDisplay);
  
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-white mb-4">Key Takeaways</h3>
      
      <div className="bg-[#1E1E1E] rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-[#2A2A2A] rounded-full p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white">Essential Points</h4>
            <p className="text-gray-400 text-sm">The most important concepts from {title || 'this topic'}</p>
          </div>
        </div>
        
        <ul className="space-y-3 mb-4">
          {displayedTakeaways.map((takeaway, index) => (
            <li key={index} className="flex items-start">
              <div className="bg-accent-primary/20 rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-300">{takeaway}</p>
            </li>
          ))}
        </ul>
        
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center text-accent-primary hover:text-accent-primary/80 transition-colors"
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
                <span>Show all {validTakeaways.length} takeaways</span>
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

export default KeyTakeaways;
