import React, { useState } from 'react';

const InteractiveTimeline = ({ events }) => {
  const [expandedEvent, setExpandedEvent] = useState(null);

  // Handle empty or invalid events
  if (!events || !Array.isArray(events) || events.length === 0) {
    return null;
  }

  // Sort events by year if available, handle potential parsing errors
  const sortedEvents = [...events].sort((a, b) => {
    try {
      // Extract numeric part from year strings like "1500 BC" or "300 CE"
      const yearAMatch = a.year && String(a.year).match(/(\d+)/);
      const yearBMatch = b.year && String(b.year).match(/(\d+)/);
      
      const yearA = yearAMatch ? parseInt(yearAMatch[0]) : 0;
      const yearB = yearBMatch ? parseInt(yearBMatch[0]) : 0;
      
      // Handle BC/BCE dates (negative years)
      const isYearABC = a.year && String(a.year).match(/BC|BCE/i);
      const isYearBBC = b.year && String(b.year).match(/BC|BCE/i);
      
      const adjustedYearA = isYearABC ? -yearA : yearA;
      const adjustedYearB = isYearBBC ? -yearB : yearB;
      
      return adjustedYearA - adjustedYearB;
    } catch (error) {
      console.error('Error sorting timeline events:', error);
      return 0;
    }
  });

  const toggleEvent = (index) => {
    setExpandedEvent(expandedEvent === index ? null : index);
  };

  return (
    <div className="my-8 relative">
      <h3 className="text-2xl font-bold text-white mb-6">Timeline of Key Events</h3>
      
      {/* Timeline line */}
      <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-1 bg-accent-primary h-full"></div>
      
      <div className="space-y-8 relative">
        {sortedEvents.map((event, index) => (
          <div 
            key={index}
            className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center`}
          >
            {/* Timeline dot */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-accent-primary border-4 border-[#1E1E1E] z-10"></div>
            
            {/* Content card */}
            <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} pl-8 md:pl-0`}>
              <div 
                className={`bg-[#2A2A2A] p-4 rounded-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${expandedEvent === index ? 'bg-[#3A3A3A]' : 'hover:bg-[#3A3A3A]'}`}
                onClick={() => toggleEvent(index)}
              >
                <div className="bg-accent-primary/20 text-accent-primary font-bold px-2 py-1 rounded inline-block mb-2">
                  {event.year || 'Unknown date'}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{event.title || `Event ${index + 1}`}</h4>
                <p className="text-gray-300">{event.description || 'No description available'}</p>
                
                {expandedEvent === index && event.additionalInfo && (
                  <div className="mt-3 pt-3 border-t border-[#444444] text-gray-300">
                    <p>{event.additionalInfo}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveTimeline;
