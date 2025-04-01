import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { searchWikipedia, getTopicThumbnail } from '../services/wikipediaService';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Format the category name for display
  const formattedCategoryName = categoryName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Category to search term mapping
  const categorySearchTerms = {
    'ancient-civilizations': 'ancient civilization history',
    'medieval-period': 'medieval history middle ages',
    'modern-history': 'modern history',
    'wars': 'major wars in history',
    'famous-leaders': 'famous historical leaders',
  };

  useEffect(() => {
    const fetchCategoryTopics = async () => {
      try {
        setLoading(true);
        
        // Get the search term for this category
        const searchTerm = categorySearchTerms[categoryName] || categoryName.replace('-', ' ');
        
        // Search Wikipedia for topics related to this category
        const results = await searchWikipedia(searchTerm, 15);
        
        // Transform the results into our topics format with proper thumbnails
        const formattedTopicsPromises = results.map(async (result) => {
          // Fetch actual thumbnail from Wikipedia
          const thumbnailUrl = await getTopicThumbnail(result.pageid);
          
          return {
            id: result.pageid,
            title: result.title,
            category: formattedCategoryName,
            description: result.snippet.replace(/<\/?span[^>]*>/g, ''), // Remove HTML tags
            image: thumbnailUrl || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(result.title)}`,
          };
        });
        
        const formattedTopics = await Promise.all(formattedTopicsPromises);
        setTopics(formattedTopics);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching category topics:', err);
        setError('Failed to load topics for this category. Please try again later.');
        setLoading(false);
      }
    };

    fetchCategoryTopics();
  }, [categoryName, formattedCategoryName]);

  const handleTopicClick = (topicId) => {
    navigate(`/topic/${topicId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Category Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">{formattedCategoryName}</h1>
        <p className="text-xl text-gray-400">
          Explore historical topics related to {formattedCategoryName.toLowerCase()}
        </p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {topics.map((topic) => (
          <div 
            key={topic.id} 
            className="card overflow-hidden group hover:bg-[#2A2A2A] cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
            onClick={() => handleTopicClick(topic.id)}
          >
            <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
              <img 
                src={topic.image} 
                alt={topic.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(topic.title)}`;
                }}
              />
              <div className="absolute top-2 right-2 bg-accent-primary px-3 py-1 rounded-full text-sm text-white">
                {topic.category}
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-primary transition-colors">{topic.title}</h3>
            <p className="text-gray-400 mb-4" dangerouslySetInnerHTML={{ __html: topic.description }}></p>
            <div className="text-accent-primary font-medium inline-flex items-center">
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Related Categories */}
      <div className="card mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Explore Other Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(categorySearchTerms)
            .filter(cat => cat !== categoryName)
            .map(cat => {
              const formattedName = cat
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              
              return (
                <Link 
                  key={cat} 
                  to={`/category/${cat}`}
                  className="bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors p-4 rounded-lg text-center transform hover:-translate-y-1 hover:shadow-lg duration-300"
                >
                  <h3 className="text-lg font-medium text-white">{formattedName}</h3>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
