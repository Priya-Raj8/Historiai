import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { sendMessageToOpenAI, filterKeywords } from '../services/openaiService';

const ChatBot = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I\'m Celio, your AI History Tutor. Ask me anything about history and I\'ll help you understand it better.'
    }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const recognitionRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [storytellingMode, setStorytellingMode] = useState('detailed'); // 'detailed' or 'summary'
  const [isLargeSize, setIsLargeSize] = useState(false); // Toggle for chatbot size
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    'Tell me about Ancient Egypt',
    'What happened during World War II?',
    'Who was Julius Caesar?'
  ]);
  const chatEndRef = useRef(null);
  const location = useLocation();
  
  // Extract current topic from URL if on a topic page
  const getCurrentTopic = () => {
    const path = location.pathname;
    if (path.includes('/topic/')) {
      // Get the topic title from the page if available
      const pageTitle = document.title;
      if (pageTitle && !pageTitle.includes('Celio')) {
        return pageTitle.replace(' - Celio', '');``
      }
    }
    return '';
  };

  useEffect(() => {
    // Scroll to the bottom of the chat when new messages are added
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userMessage.trim() || isLoading) return;

    // Filter message for inappropriate content
    const filteredMessage = filterKeywords(userMessage);
    if (!filteredMessage) {
      setError('Your message contains inappropriate content. Please rephrase your question.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Add user message to chat
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    
    // Clear input and show loading state
    setUserMessage('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Format previous messages for context (excluding the initial greeting)
      const previousMessages = chatMessages.length > 1 
        ? chatMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        : [];
      
      // Get current topic from URL if on a topic page
      const currentTopic = getCurrentTopic();
      
      // Send message to Gemini AI
      const response = await sendMessageToOpenAI(
        userMessage,
        currentTopic, // Pass current topic if available
        storytellingMode,
        previousMessages
      );
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, { 
        sender: 'bot', 
        text: response
      }]);
      
      // Generate follow-up questions based on the conversation
      generateSuggestedQuestions(userMessage, response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setChatMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'I apologize, but I encountered an error processing your request. Please try again.'
      }]);
      setError('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate suggested follow-up questions based on the conversation
  const generateSuggestedQuestions = (userMessage, aiResponse) => {
    // Extract keywords from the user message and AI response
    const combinedText = userMessage + ' ' + aiResponse;
    const keywords = extractKeywords(combinedText);
    
    // Generate questions based on keywords and historical periods/events
    const questions = [];
    
    // Historical periods detection
    const periods = {
      'ancient': ['ancient egypt', 'ancient greece', 'ancient rome', 'mesopotamia', 'babylon', 'sumer', 'indus valley'],
      'medieval': ['middle ages', 'medieval', 'dark ages', 'feudal', 'crusades', 'knights', 'castles'],
      'renaissance': ['renaissance', 'reformation', 'humanism', 'medici', 'leonardo', 'michelangelo'],
      'enlightenment': ['enlightenment', 'reason', 'voltaire', 'rousseau', 'locke', 'scientific revolution'],
      'industrial': ['industrial revolution', 'steam engine', 'factories', 'urbanization'],
      'modern': ['world war', 'cold war', 'civil rights', 'decolonization', 'globalization']
    };
    
    // Check for historical periods in the conversation
    for (const [period, terms] of Object.entries(periods)) {
      if (terms.some(term => combinedText.toLowerCase().includes(term))) {
        switch(period) {
          case 'ancient':
            questions.push('What was daily life like for ordinary people in this civilization?');
            questions.push('How did their religious beliefs shape their society?');
            questions.push('What architectural or artistic achievements defined this culture?');
            break;
          case 'medieval':
            questions.push('How did the feudal system work in this period?');
            questions.push('What role did the Church play in medieval society?');
            questions.push('How did trade and commerce develop during this time?');
            break;
          case 'renaissance':
            questions.push('How did Renaissance art differ from medieval art?');
            questions.push('What scientific discoveries were made during this period?');
            questions.push('How did the printing press change European society?');
            break;
          case 'enlightenment':
            questions.push('How did Enlightenment ideas influence political revolutions?');
            questions.push('Which Enlightenment thinker had the most lasting impact?');
            questions.push('How did the Scientific Revolution change how people viewed the world?');
            break;
          case 'industrial':
            questions.push('How did the Industrial Revolution change working conditions?');
            questions.push('What were the environmental impacts of industrialization?');
            questions.push('How did transportation innovations change society?');
            break;
          case 'modern':
            questions.push('How did this event reshape international relations?');
            questions.push('What technological innovations emerged from this period?');
            questions.push('How did this affect ordinary citizens\'s daily lives?');
            break;
        }
        // If we found a matching period, we have specific questions already
        if (questions.length > 0) break;
      }
    }
    
    // Check for specific historical elements if no period was matched
    if (questions.length === 0) {
      // War and conflict related questions
      if (keywords.includes('war') || keywords.includes('battle') || keywords.includes('conflict')) {
        questions.push('What were the major causes of this conflict?');
        questions.push('How did this war change the balance of power?');
        questions.push('What were the experiences of soldiers and civilians?');
      }
      
      // Leadership related questions
      if (keywords.includes('leader') || keywords.includes('king') || keywords.includes('queen') || 
          keywords.includes('emperor') || keywords.includes('president') || keywords.includes('prime minister')) {
        questions.push('What was their leadership style and major achievements?');
        questions.push('How did they come to power and how did their rule end?');
        questions.push('How did they handle major crises during their time?');
      }
      
      // Social change related questions
      if (keywords.includes('revolution') || keywords.includes('movement') || 
          keywords.includes('reform') || keywords.includes('rights')) {
        questions.push('What were the social impacts of this event?');
        questions.push('Who were the key figures leading this movement?');
        questions.push('How did this change affect different social classes?');
      }
      
      // Cultural and intellectual history
      if (keywords.includes('art') || keywords.includes('literature') || 
          keywords.includes('philosophy') || keywords.includes('music')) {
        questions.push('How did this cultural movement reflect the society of its time?');
        questions.push('Who were the most influential figures in this field?');
        questions.push('How has this influenced modern culture and thinking?');
      }
      
      // Technology and science
      if (keywords.includes('invention') || keywords.includes('technology') || 
          keywords.includes('discovery') || keywords.includes('science')) {
        questions.push('How did this innovation change everyday life?');
        questions.push('What earlier developments made this possible?');
        questions.push('What were the social or ethical implications of this advance?');
      }
    }
    
    // If we still couldn't generate specific questions, use contextual generic ones
    if (questions.length === 0) {
      // Extract potential historical entities from the conversation
      const potentialEntities = combinedText.match(/\b[A-Z][a-z]+(\s+[A-Z][a-z]+)*\b/g) || [];
      const entity = potentialEntities.length > 0 ? potentialEntities[0] : 'this topic';
      
      questions.push(`What are the most significant impacts of ${entity} on world history?`);
      questions.push(`How did ${entity} compare to similar historical developments?`);
      questions.push(`What are some lesser-known facts about ${entity}?`);
    }
    
    // Limit to 3 questions and ensure no duplicates
    const uniqueQuestions = [...new Set(questions)].slice(0, 3);
    setSuggestedQuestions(uniqueQuestions);
  };
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserMessage(transcript);
        setIsProcessingVoice(false);
        setIsRecording(false);
        
        // Auto-submit after a short delay to allow user to see what was transcribed
        setTimeout(() => {
          handleSendMessage({ preventDefault: () => {} });
        }, 1000);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsProcessingVoice(false);
        setIsRecording(false);
        setError('Could not recognize speech. Please try again or type your question.');
        setTimeout(() => setError(null), 3000);
      };
      
      recognitionRef.current.onend = () => {
        if (isRecording) {
          setIsProcessingVoice(true);
        }
      };
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
      }
    };
  }, []);
  
  // Simple keyword extraction function
  const extractKeywords = (text) => {
    const lowercaseText = text.toLowerCase();
    const keywords = [];
    
    // List of historical keywords to check for
    const historicalKeywords = [
      'war', 'battle', 'revolution', 'ancient', 'medieval', 'modern',
      'king', 'queen', 'emperor', 'leader', 'civilization', 'empire',
      'movement', 'dynasty', 'conquest', 'discovery', 'invention',
      'treaty', 'religion', 'culture', 'art', 'science', 'technology'
    ];
    
    historicalKeywords.forEach(keyword => {
      if (lowercaseText.includes(keyword)) {
        keywords.push(keyword);
      }
    });
    
    return keywords;
  };
  
  // Handle clicking on a suggested question
  const handleSuggestedQuestionClick = (question) => {
    setUserMessage(question);
  };

  const startRecording = async () => {
    try {
      // Check if browser supports speech recognition
      if (!recognitionRef.current) {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.lang = 'en-US';
          
          recognitionRef.current.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setUserMessage(transcript);
            setIsProcessingVoice(false);
            setIsRecording(false);
            
            // Auto-submit after a short delay
            setTimeout(() => {
              handleSendMessage({ preventDefault: () => {} });
            }, 1000);
          };
          
          recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsProcessingVoice(false);
            setIsRecording(false);
            setError('Could not recognize speech. Please try again or type your question.');
            setTimeout(() => setError(null), 3000);
          };
          
          recognitionRef.current.onend = () => {
            if (isRecording) {
              setIsProcessingVoice(true);
              // Small delay before setting processing to false if no result came in
              setTimeout(() => {
                setIsProcessingVoice(false);
                setIsRecording(false);
              }, 2000);
            }
          };
        } else {
          throw new Error('Speech recognition not supported in this browser');
        }
      }
      
      setIsRecording(true);
      recognitionRef.current.start();
      
      // Safety timeout to stop recording after 10 seconds if it doesn't stop itself
      setTimeout(() => {
        if (isRecording) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.log('Recognition already stopped');
          }
          setIsRecording(false);
          setIsProcessingVoice(false);
        }
      }, 10000);
      
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setError("Could not access your microphone or speech recognition is not supported. Please check your permissions or try another browser.");
      setTimeout(() => setError(null), 3000);
      setIsRecording(false);
      setIsProcessingVoice(false);
    }
  };

  return (
    <>
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
        <div 
          className={`fixed ${isLargeSize ? 'bottom-10 right-10 w-[700px] h-[600px]' : 'bottom-24 right-6 w-96 h-[500px]'} bg-[#1E1E1E] rounded-lg shadow-xl z-50 overflow-hidden flex flex-col transition-all duration-300 ease-in-out`}>
          <div className="bg-[#2A2A2A] p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white">Clieo</h3>
                <p className="text-xs text-gray-400">
                  Mode: {storytellingMode === 'detailed' ? 'Detailed' : 'Summary'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              {/* Mode toggle */}
              <div className="mr-3">
                <button 
                  onClick={() => setStorytellingMode(mode => mode === 'detailed' ? 'summary' : 'detailed')}
                  className="text-xs bg-[#3A3A3A] hover:bg-[#4A4A4A] text-white px-2 py-1 rounded-full transition-colors"
                >
                  {storytellingMode === 'detailed' ? 'Switch to Summary' : 'Switch to Detailed'}
                </button>
              </div>
              {/* Size toggle button */}
              <div className="mr-3">
                <button
                  onClick={() => setIsLargeSize(!isLargeSize)}
                  className="text-xs bg-[#3A3A3A] hover:bg-[#4A4A4A] text-white p-2 rounded-full transition-colors"
                  title={isLargeSize ? "Minimize" : "Maximize"}
                >
                  {isLargeSize ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707z"/>
                    </svg>
                  )}
                </button>
              </div>
              {/* Close button */}
              <button onClick={toggleChatbot} className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="px-4 py-2 bg-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}
          
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
                      <p className="text-white whitespace-pre-line">{message.text}</p>
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
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start mb-2">
                <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="bg-[#2A2A2A] rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Suggested questions */}
            {!isLoading && chatMessages.length > 1 && suggestedQuestions.length > 0 && (
              <div className="mt-4 mb-2">
                <p className="text-xs text-gray-400 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white text-xs py-1 px-3 rounded-full transition-colors"
                      onClick={() => handleSuggestedQuestionClick(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Invisible element for auto-scrolling */}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-4 bg-[#2A2A2A]">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                placeholder="Ask about any historical topic..."
                className="flex-grow p-2 rounded-l-full bg-[#3A3A3A] text-white border-none focus:outline-none focus:ring-2 focus:ring-accent-primary"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                disabled={isRecording || isProcessingVoice || isLoading}
              />
              <button 
                type="submit" 
                className="bg-accent-primary text-white p-2 rounded-r-full"
                disabled={isRecording || isProcessingVoice || isLoading || !userMessage.trim()}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </form>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <button 
                className={`hover:text-white transition-colors flex items-center ${isRecording || isProcessingVoice ? 'text-accent-primary animate-pulse' : ''}`}
                onClick={startRecording}
                disabled={isRecording || isProcessingVoice || isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                {isRecording ? 'Recording...' : isProcessingVoice ? 'Processing...' : 'Voice Mode'}
              </button>
              <span className="text-xs text-gray-400">
                {storytellingMode === 'detailed' ? 'Detailed mode' : 'Summary mode'}
              </span>
              <button 
                className="hover:text-white transition-colors"
                onClick={() => alert('Language toggle will be fully implemented in Part 2!')}
              >
                <span className="mr-1">🌐</span>
                EN
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
