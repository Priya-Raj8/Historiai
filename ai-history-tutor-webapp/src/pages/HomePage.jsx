import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchWikipedia, getTopicThumbnail } from '../services/wikipediaService';

const HomePage = () => {
  const [featuredTopics, setFeaturedTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const navigate = useNavigate();

  // Sample featured topics search terms - these will be used to fetch real data
  const featuredTopicSearchTerms = [
    "Ancient Egypt civilization",
    "Roman Empire history",
    "World War II",
    "Renaissance period",
    "French Revolution",
    "Industrial Revolution"
  ];

  // Categories with icons
  const categories = [
    { name: 'Ancient Civilizations', path: '/category/ancient-civilizations', icon: '🏛️' },
    { name: 'Medieval Period', path: '/category/medieval-period', icon: '🏰' },
    { name: 'Modern History', path: '/category/modern-history', icon: '🌆' },
    { name: 'Wars', path: '/category/wars', icon: '⚔️' },
    { name: 'Famous Leaders', path: '/category/famous-leaders', icon: '👑' },
  ];

  useEffect(() => {
    const fetchFeaturedTopics = async () => {
      try {
        setLoadingTopics(true);
        
        // Fetch real topics from Wikipedia
        const topicsPromises = featuredTopicSearchTerms.map(async (term) => {
          const results = await searchWikipedia(term, 1);
          if (results && results.length > 0) {
            const result = results[0];
            const thumbnailUrl = await getTopicThumbnail(result.pageid);
            
            return {
              id: result.pageid,
              title: result.title,
              category: term.split(' ')[0], // Use first word as category
              description: result.snippet.replace(/<\/?span[^>]*>/g, ''),
              image: thumbnailUrl || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(term)}`
            };
          }
          return null;
        });
        
        const topics = (await Promise.all(topicsPromises)).filter(Boolean);
        setFeaturedTopics(topics);
        setLoadingTopics(false);
      } catch (error) {
        console.error('Error fetching featured topics:', error);
        setLoadingTopics(false);
        
        // Fallback to sample data if API fails
        setFeaturedTopics([
          {
            id: '15839',
            title: 'Ancient Egypt',
            category: 'Ancient',
            description: 'One of the most fascinating civilizations that developed along the Nile River, known for pyramids and pharaohs.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Great_Sphinx_of_Giza_-_20080716a.jpg/1200px-Great_Sphinx_of_Giza_-_20080716a.jpg'
          },
          {
            id: '22936',
            title: 'Roman Empire',
            category: 'Ancient',
            description: 'One of the largest empires in world history, known for its military, architecture, and influence on Western civilization.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg/1200px-Colosseum_in_Rome-April_2007-1-_copie_2B.jpg'
          },
          {
            id: '30955',
            title: 'World War II',
            category: 'Modern',
            description: 'Global war that lasted from 1939 to 1945, involving many of the world\'s nations and changing the course of history.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/World_War_II_Casualties.svg/1200px-World_War_II_Casualties.svg.png'
          },
          {
            id: '25034',
            title: 'Renaissance',
            category: 'Medieval',
            description: 'Period of European cultural, artistic, political, and scientific rebirth after the Middle Ages.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1200px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg'
          },
          {
            id: '18748',
            title: 'French Revolution',
            category: 'Modern',
            description: 'Period of radical social and political upheaval in French history that had a lasting impact on French culture.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Eug%C3%A8ne_Delacroix_-_La_libert%C3%A9_guidant_le_peuple.jpg/1200px-Eug%C3%A8ne_Delacroix_-_La_libert%C3%A9_guidant_le_peuple.jpg'
          },
          {
            id: '20522',
            title: 'Industrial Revolution',
            category: 'Modern',
            description: 'Transition to new manufacturing processes in Europe and the United States, from 1760 to about 1820-1840.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Leeds_1847.jpg/1200px-Leeds_1847.jpg'
          }
        ]);
      }
    };
    
    fetchFeaturedTopics();
  }, []);

  const handleTopicClick = (topicId) => {
    navigate(`/topic/${topicId}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] to-transparent z-10"></div>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1200px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg" 
          alt="History Banner" 
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 flex items-center z-20 p-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore History Through Interactive Storytelling
            </h1>
            <p className="text-xl text-gray-200 mb-6">
              Discover the past with our AI-powered history tutor. Learn through engaging narratives, multimedia content, and personalized explanations.
            </p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/category/ancient-civilizations')}
            >
              Start Learning
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.path} 
              to={category.path}
              className="bg-[#1E1E1E] hover:bg-[#2A2A2A] transition-colors p-6 rounded-xl text-center transform hover:-translate-y-1 hover:shadow-lg duration-300"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="text-lg font-medium text-white">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Topics Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Featured Topics</h2>
        {loadingTopics ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTopics.map((topic) => (
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
                <p className="text-gray-400 mb-4">{topic.description}</p>
                <div className="text-accent-primary font-medium inline-flex items-center">
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us Section */}
      <section className="card mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Why Choose Our AI History Tutor?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1E1E1E] p-6 rounded-xl hover:bg-[#2A2A2A] transition-colors transform hover:-translate-y-1 duration-300">
            <div className="text-accent-primary text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-white mb-2">Interactive Learning</h3>
            <p className="text-gray-400">
              Engage with history through interactive conversations, quizzes, and multimedia content.
            </p>
          </div>
          <div className="bg-[#1E1E1E] p-6 rounded-xl hover:bg-[#2A2A2A] transition-colors transform hover:-translate-y-1 duration-300">
            <div className="text-accent-primary text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">Accurate Information</h3>
            <p className="text-gray-400">
              All content is sourced from Wikipedia and other reliable historical sources.
            </p>
          </div>
          <div className="bg-[#1E1E1E] p-6 rounded-xl hover:bg-[#2A2A2A] transition-colors transform hover:-translate-y-1 duration-300">
            <div className="text-accent-primary text-4xl mb-4">🗣️</div>
            <h3 className="text-xl font-bold text-white mb-2">Voice Interaction</h3>
            <p className="text-gray-400">
              Ask questions using your voice and get natural language responses from our AI tutor.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore History?</h2>
        <p className="text-xl text-white mb-6 max-w-2xl mx-auto">
          Start your journey through time with our interactive AI tutor and discover history like never before.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            className="bg-white text-accent-primary hover:bg-white/90 font-medium py-3 px-6 rounded-full transition-all duration-300"
            onClick={() => navigate('/category/ancient-civilizations')}
          >
            Get Started Now
          </button>
          <button 
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium py-3 px-6 rounded-full transition-all duration-300"
            onClick={() => document.querySelector('.fixed.bottom-6.right-6').click()}
          >
            Chat with Tutor
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;