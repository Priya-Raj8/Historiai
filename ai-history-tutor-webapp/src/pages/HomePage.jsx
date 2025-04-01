import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchWikipedia, getTopicThumbnail } from '../services/wikipediaService';

const HomePage = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I\'m your AI History Tutor. Ask me anything about history and I\'ll help you understand it better.'
    }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
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

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  const handleTopicClick = (topicId) => {
    navigate(`/topic/${topicId}`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    // Add user message to chat
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    
    // Simulate AI response (in a real app, this would call an AI API)
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'bot', 
        text: `I'd be happy to tell you about "${userMessage}". This would be a detailed response from the AI tutor about this historical topic.`
      }]);
    }, 1000);
    
    setUserMessage('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessingVoice(true);
        // Create audio blob
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        // In a real app, you would send this to Whisper API for transcription
        // For now, we'll simulate a response after a delay
        setTimeout(() => {
          const simulatedTranscription = "Tell me about Ancient Egypt";
          setUserMessage(simulatedTranscription);
          setIsProcessingVoice(false);
        }, 1500);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Stop recording after 5 seconds
      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 5000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access your microphone. Please check permissions.');
    }
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
            onClick={toggleChatbot}
          >
            Chat with Tutor
          </button>
        </div>
      </section>

      {/* Chatbot Button */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-full p-4 shadow-lg z-50 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        {showChatbot ? 'Close Tutor' : 'Chat with Tutor'}
      </button>

      {/* Chatbot Interface */}
      {showChatbot && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-[#1E1E1E] rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
          <div className="bg-[#2A2A2A] p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white">History Tutor</h3>
                <p className="text-xs text-gray-400">AI-powered assistant</p>
              </div>
            </div>
            <button onClick={toggleChatbot} className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto bg-[#121212]">
            {chatMessages.map((message, index) => (
              <div key={index} className="mb-4">
                {message.sender === 'bot' ? (
                  <div className="flex items-start mb-2">
                    <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center mr-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="bg-[#2A2A2A] rounded-lg p-3 max-w-[80%]">
                      <p className="text-white">{message.text}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-end mb-2">
                    <div className="bg-accent-primary rounded-lg p-3 max-w-[80%]">
                      <p className="text-white">{message.text}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center ml-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-[#2A2A2A]">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                placeholder="Ask about any historical topic..."
                className="flex-grow p-2 rounded-l-full bg-[#3A3A3A] text-white border-none focus:outline-none focus:ring-2 focus:ring-accent-primary"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                disabled={isRecording || isProcessingVoice}
              />
              <button 
                type="submit" 
                className="bg-accent-primary text-white p-2 rounded-r-full"
                disabled={isRecording || isProcessingVoice || !userMessage.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <button 
                className={`hover:text-white transition-colors flex items-center ${isRecording || isProcessingVoice ? 'text-accent-primary animate-pulse' : ''}`}
                onClick={startRecording}
                disabled={isRecording || isProcessingVoice}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                {isRecording ? 'Recording...' : isProcessingVoice ? 'Processing...' : 'Voice Mode'}
              </button>
              <button 
                className="hover:text-white transition-colors"
                onClick={() => alert('Language toggle will be fully implemented in Part 2!')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Switch to Hindi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
