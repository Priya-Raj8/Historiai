import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getPageDetails, getPageContent, getPageImages, getTopicThumbnail } from '../services/wikipediaService';
import { 
  processContentIntoSections, 
  extractTimelineEvents, 
  extractKeyFigures, 
  extractLocations, 
  extractKeyTerms,
  generateQuizQuestions,
  extractKeyTakeaways,
  findRelatedTopics,
  extractQuickFacts
} from '../services/contentProcessingService';
import InteractiveTimeline from '../components/InteractiveTimeline';
import ExpandableSection from '../components/ExpandableSection';
import ImageGallery from '../components/ImageGallery';
import QuizSection from '../components/QuizSection';
import MediaEnhancement from '../components/MediaEnhancement';
import InteractiveMap from '../components/InteractiveMap';
import TableOfContents from '../components/TableOfContents';
import RelatedTopics from '../components/RelatedTopics';
import KeyTakeaways from '../components/KeyTakeaways';
import QuickFacts from '../components/QuickFacts';

// Enhanced cache for storing topic data to improve performance
const topicCache = new Map();

const TopicDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('english');
  const [images, setImages] = useState([]);
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState('introduction');
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [keyFigures, setKeyFigures] = useState([]);
  const [locations, setLocations] = useState([]);
  const [keyTerms, setKeyTerms] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [keyTakeaways, setKeyTakeaways] = useState([]);
  const [relatedTopics, setRelatedTopics] = useState([]);
  const [quickFacts, setQuickFacts] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  
  const contentRef = useRef(null);
  const prevIdRef = useRef(null);

  // Process topic content when it's available
  const processTopicContent = useCallback((topicData) => {
    if (!topicData?.fullContent) return;
    
    try {
      // Process content into sections
      const processedSections = processContentIntoSections(topicData.fullContent);
      setSections(processedSections);
      
      // Extract timeline events
      const events = extractTimelineEvents(topicData.fullContent);
      setTimelineEvents(events);
      
      // Extract key figures
      const figures = extractKeyFigures(topicData.fullContent);
      setKeyFigures(figures);
      
      // Extract locations
      const extractedLocations = extractLocations(topicData.fullContent);
      setLocations(extractedLocations);
      
      // Extract key terms for highlighting
      const terms = extractKeyTerms(topicData.fullContent);
      setKeyTerms(terms);
      
      // Generate quiz questions
      const questions = generateQuizQuestions(topicData.fullContent, topicData.title);
      setQuizQuestions(questions);
      
      // Extract key takeaways
      const takeaways = extractKeyTakeaways(topicData.fullContent);
      setKeyTakeaways(takeaways);
      
      // Extract quick facts
      const facts = extractQuickFacts(topicData.fullContent, topicData.title);
      setQuickFacts(facts);
      
      // Find related topics
      const related = findRelatedTopics(topicData.fullContent, topicData.title);
      setRelatedTopics(related);
    } catch (err) {
      console.error('Error processing topic content:', err);
      // Continue showing content even if processing fails
    }
  }, []);

  // Fetch topic details with enhanced caching
  const fetchTopicDetails = useCallback(async () => {
    if (!id) {
      setError('No topic ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Check if we have cached data for this topic
      if (topicCache.has(id)) {
        console.log('Using cached data for topic:', id);
        const cachedData = topicCache.get(id);
        setTopic(cachedData.topic);
        setImages(cachedData.images || []);
        setSections(cachedData.sections || []);
        setTimelineEvents(cachedData.timelineEvents || []);
        setKeyFigures(cachedData.keyFigures || []);
        setLocations(cachedData.locations || []);
        setKeyTerms(cachedData.keyTerms || []);
        setQuizQuestions(cachedData.quizQuestions || []);
        setKeyTakeaways(cachedData.keyTakeaways || []);
        setRelatedTopics(cachedData.relatedTopics || []);
        setQuickFacts(cachedData.quickFacts || []);
        setLoading(false);
        return;
      }
      
      // Fetch data if not cached
      const [details, content, imageResults] = await Promise.all([
        getPageDetails(id).catch(err => {
          console.error('Error fetching page details:', err);
          return null;
        }),
        getPageContent(id).catch(err => {
          console.error('Error fetching page content:', err);
          return { extract: '' };
        }),
        getPageImages(id).catch(err => {
          console.error('Error fetching page images:', err);
          return [];
        })
      ]);
      
      if (!details) {
        throw new Error('Failed to fetch topic details');
      }
      
      const topicData = {
        ...details,
        fullContent: content.extract,
        title: details.title,
        extract: details.extract,
        fullurl: details.fullurl
      };
      
      setTopic(topicData);
      
      // Filter and process images
      if (imageResults && imageResults.length > 0) {
        setImages(imageResults);
      }
      
      // Process the content
      processTopicContent(topicData);
      
      // Cache the data immediately with what we have
      const cacheData = {
        topic: topicData,
        images: imageResults || [],
        sections: sections,
        timelineEvents: timelineEvents,
        keyFigures: keyFigures,
        locations: locations,
        keyTerms: keyTerms,
        quizQuestions: quizQuestions,
        keyTakeaways: keyTakeaways,
        relatedTopics: relatedTopics,
        quickFacts: quickFacts
      };
      
      topicCache.set(id, cacheData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching topic details:', err);
      setError('Failed to load topic details. Please try again later.');
      setLoading(false);
      
      // Implement retry logic for transient errors
      if (retryCount < 3) {
        console.log(`Retrying fetch (${retryCount + 1}/3)...`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchTopicDetails();
        }, 1500);
      }
    }
  }, [id, processTopicContent, retryCount]);

  // Update cache with processed data after states are updated
  useEffect(() => {
    if (topic && topicCache.has(id)) {
      const cachedData = topicCache.get(id);
      topicCache.set(id, {
        ...cachedData,
        sections,
        timelineEvents,
        keyFigures,
        locations,
        keyTerms,
        quizQuestions,
        keyTakeaways,
        relatedTopics,
        quickFacts
      });
      console.log('Topic data cache updated:', id);
    }
  }, [id, topic, sections, timelineEvents, keyFigures, locations, keyTerms, quizQuestions, keyTakeaways, relatedTopics, quickFacts]);

  // Fetch data when component mounts or ID changes
  useEffect(() => {
    // Only refetch if the ID has changed
    if (prevIdRef.current !== id) {
      fetchTopicDetails();
      prevIdRef.current = id;
    }
    
    // Scroll to top when navigating to a new topic
    window.scrollTo(0, 0);
    
    return () => {
      // Clean up any pending operations when component unmounts
    };
  }, [id, fetchTopicDetails]);

  // Handle language toggle
  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'hindi' : 'english');
  };

  // Handle section navigation
  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    
    // Scroll to the section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle back navigation
  const handleBackClick = () => {
    // Check if we have a state with a previous path
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  // Find a YouTube video URL based on the topic title
  const getVideoUrl = () => {
    if (!topic?.title) return null;
    
    // This is a placeholder - in a real app, you would search for actual videos
    return `https://www.youtube.com/embed/search?q=${encodeURIComponent(topic.title + ' history')}`;
  };

  // Retry loading if there was an error
  const handleRetry = () => {
    setError(null);
    setRetryCount(0);
    fetchTopicDetails();
  };

  // Show a nice loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-4 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-primary"></div>
        <p className="mt-4 text-xl">Loading topic details...</p>
        <div className="mt-8 max-w-md w-full">
          <div className="h-8 bg-[#2A2A2A] rounded-lg animate-pulse mb-4"></div>
          <div className="h-4 bg-[#2A2A2A] rounded-lg animate-pulse mb-2 w-3/4"></div>
          <div className="h-4 bg-[#2A2A2A] rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 bg-[#2A2A2A] rounded-lg animate-pulse mb-2 w-5/6"></div>
          <div className="h-32 bg-[#2A2A2A] rounded-lg animate-pulse mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-[#2A2A2A] rounded-lg animate-pulse"></div>
            <div className="h-24 bg-[#2A2A2A] rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-4 flex flex-col items-center justify-center">
        <div className="bg-red-500/20 text-red-500 p-4 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
        <div className="mt-6 flex space-x-4">
          <button 
            onClick={handleRetry}
            className="bg-accent-primary hover:bg-accent-primary/90 text-white py-2 px-6 rounded-full transition-all duration-300"
          >
            Retry
          </button>
          <button 
            onClick={handleBackClick}
            className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white py-2 px-6 rounded-full transition-all duration-300"
          >
            Go Back
          </button>
          <Link to="/" className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white py-2 px-6 rounded-full transition-all duration-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!topic) {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-4 flex flex-col items-center justify-center">
        <div className="bg-yellow-500/20 text-yellow-500 p-4 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-2">Topic Not Found</h2>
          <p>We couldn't find the topic you're looking for.</p>
        </div>
        <div className="mt-6 flex space-x-4">
          <button 
            onClick={handleBackClick}
            className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white py-2 px-6 rounded-full transition-all duration-300"
          >
            Go Back
          </button>
          <Link to="/" className="bg-accent-primary hover:bg-accent-primary/90 text-white py-2 px-6 rounded-full transition-all duration-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-12" ref={contentRef}>
      {/* Back button */}
      <div className="fixed top-20 left-4 z-50">
        <button 
          onClick={handleBackClick}
          className="bg-[#2A2A2A]/80 hover:bg-[#3A3A3A] text-white p-2 rounded-full transition-colors backdrop-blur-sm"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>
      
      {/* Hero Section with Main Image */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212]"></div>
        <img
          src={images[0] || `https://source.unsplash.com/random/1200x600/?${encodeURIComponent(topic.title)}`}
          alt={topic.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://source.unsplash.com/random/1200x600/?${encodeURIComponent(topic.title)}`;
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{topic.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <a 
                href={topic.fullurl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-accent-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Wikipedia
              </a>
              <span>•</span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {sections.length} sections
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6">
        {/* Main content layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with Table of Contents */}
          <aside className="md:w-1/4">
            <TableOfContents 
              sections={sections} 
              activeSection={activeSection} 
              onSectionClick={handleSectionClick} 
            />
          </aside>
          
          {/* Main content area */}
          <main className="md:w-3/4">
            {/* Quick Facts Component */}
            <QuickFacts facts={quickFacts} title={topic.title} />
            
            {/* Introduction Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
              <p className="text-gray-300 leading-relaxed">{topic.extract}</p>
            </div>
            
            {/* Content Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <ExpandableSection
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  content={section.content}
                  isActive={activeSection === section.id}
                  highlightTerms={keyTerms}
                />
              ))}
            </div>
            
            {/* Key Takeaways */}
            <KeyTakeaways takeaways={keyTakeaways} title={topic.title} />
            
            {/* Interactive Timeline */}
            {timelineEvents.length > 0 && (
              <InteractiveTimeline events={timelineEvents} title={topic.title} />
            )}
            
            {/* Interactive Map */}
            {locations.length > 0 && (
              <InteractiveMap locations={locations} title={topic.title} />
            )}
            
            {/* Image Gallery */}
            {images.length > 0 && (
              <ImageGallery images={images} title={topic.title} />
            )}
            
            {/* Quiz Section */}
            {quizQuestions.length > 0 && (
              <QuizSection questions={quizQuestions} title={topic.title} />
            )}
            
            {/* Media Enhancement */}
            <MediaEnhancement 
              content={topic.extract} 
              videoUrl={getVideoUrl()} 
              title={topic.title} 
            />
            
            {/* Related Topics */}
            <RelatedTopics topics={relatedTopics} currentTopicId={id} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default TopicDetailPage;
