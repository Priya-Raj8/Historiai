import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { searchWikipedia, getTopicThumbnail } from '../services/wikipediaService';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');
    
    if (!query) {
      navigate('/');
      return;
    }
    
    setSearchQuery(query);
    performSearch(query);
  }, [location.search, navigate]);

  const performSearch = async (query) => {
    try {
      setLoading(true);
      const searchResults = await searchWikipedia(query, 20);
      
      // Fetch thumbnails for each result
      const resultsWithImages = await Promise.all(
        searchResults.map(async (result) => {
          try {
            const thumbnail = await getTopicThumbnail(result.pageid);
            return {
              ...result,
              image: thumbnail || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(result.title)}`
            };
          } catch (err) {
            return {
              ...result,
              image: `https://source.unsplash.com/random/800x600/?${encodeURIComponent(result.title)}`
            };
          }
        })
      );
      
      setResults(resultsWithImages);
      setLoading(false);
    } catch (err) {
      console.error('Error searching Wikipedia:', err);
      setError('Failed to fetch search results. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Search Results</h1>
          <p className="text-gray-400">
            Showing results for <span className="text-accent-primary font-medium">"{searchQuery}"</span>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
            <span className="ml-3 text-lg text-gray-300">Searching...</span>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 text-red-500 p-4 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-[#1E1E1E] p-6 rounded-lg max-w-2xl mx-auto">
              <h2 className="text-xl font-bold text-white mb-4">No Results Found</h2>
              <p className="text-gray-400 mb-6">
                We couldn't find any results matching "{searchQuery}". Try using different keywords or browse our categories.
              </p>
              <Link to="/" className="bg-accent-primary hover:bg-accent-primary/90 text-white py-2 px-6 rounded-full transition-all duration-300">
                Browse Categories
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <Link 
                key={result.pageid} 
                to={`/topic/${result.pageid}`}
                className="bg-[#1E1E1E] rounded-lg overflow-hidden hover:bg-[#2A2A2A] transition-colors duration-300 flex flex-col h-full group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={result.image} 
                    alt={result.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(result.title)}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
                </div>
                <div className="p-4 flex-grow">
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-accent-primary transition-colors">{result.title}</h2>
                  <p className="text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: result.snippet.replace(/<\/?span[^>]*>/g, '') }}></p>
                </div>
                <div className="p-4 pt-0">
                  <div className="flex items-center text-accent-primary group-hover:translate-x-2 transition-transform duration-300">
                    <span className="mr-2">Learn more</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
