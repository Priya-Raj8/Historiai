import React from 'react';
import { Link } from 'react-router-dom';

const RelatedTopics = ({ topics, currentTopicId }) => {
  // Filter out the current topic and ensure we have valid topics
  const validTopics = Array.isArray(topics) 
    ? topics.filter(topic => 
        topic && 
        typeof topic === 'object' && 
        topic.id && 
        topic.title && 
        topic.id !== currentTopicId
      ).slice(0, 6) // Limit to 6 related topics
    : [];

  if (validTopics.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-white mb-4">Related Topics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {validTopics.map((topic) => (
          <Link 
            key={topic.id} 
            to={`/topic/${topic.id}`}
            className="bg-[#1E1E1E] rounded-lg p-4 hover:bg-[#2A2A2A] transition-colors border border-transparent hover:border-accent-primary/30 group"
          >
            <div className="flex items-start">
              {topic.thumbnail && (
                <div className="w-16 h-16 rounded overflow-hidden mr-3 flex-shrink-0">
                  <img 
                    src={topic.thumbnail} 
                    alt={topic.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://source.unsplash.com/random/100x100/?${encodeURIComponent(topic.title)}`;
                    }}
                  />
                </div>
              )}
              
              <div>
                <h4 className="text-lg font-semibold text-white group-hover:text-accent-primary transition-colors">
                  {topic.title}
                </h4>
                
                {topic.description && (
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {topic.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-3 flex items-center text-sm text-accent-primary">
              <span>Explore topic</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedTopics;
