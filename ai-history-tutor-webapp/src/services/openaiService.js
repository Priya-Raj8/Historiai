/**
 * Gemini AI Service
 * 
 * Handles communication with the Google Gemini 2.0 Flash API for generating AI responses
 * in the History Tutor chatbot.
 */

// Cache for storing conversation history to maintain context
const conversationCache = new Map();

/**
 * Sends a message to the Google Gemini API and returns the response
 * @param {string} message - The user's message
 * @param {string} topic - The current history topic (optional)
 * @param {string} mode - The storytelling mode ('detailed' or 'summary')
 * @param {Array} history - Previous conversation history
 * @returns {Promise} - Promise resolving to the AI response
 */
export const sendMessageToOpenAI = async (message, topic = '', mode = 'detailed', history = []) => {
  try {
    // Make an actual API call to Google's Gemini API
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.error('Google API key is missing');
      throw new Error('API key configuration is missing');
    }
    
    // Prepare the conversation history for context
    const conversationHistory = [...history, { role: 'user', content: message }];
    
    // Create the system message based on the mode and topic
    const systemMessage = createSystemMessage(topic, mode);
    
    try {
      // Format conversation history for Gemini API
      const formattedHistory = formatConversationForGemini(conversationHistory, systemMessage);
      
      // Make the API call to Gemini
      let response = await callGeminiAPI(apiKey, formattedHistory);
      
      // If we're in development mode and API fails, fall back to mock
      if (!response && import.meta.env.DEV) {
        console.warn('Falling back to mock response');
        response = await mockGeminiResponse(message, systemMessage, conversationHistory);
      }
      
      // Update conversation cache
      updateConversationCache(topic, [...conversationHistory, { role: 'assistant', content: response }]);
      
      return response;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Fall back to mock in development
      if (import.meta.env.DEV) {
        console.warn('Falling back to mock response due to error');
        const mockResponse = await mockGeminiResponse(message, systemMessage, conversationHistory);
        
        // Update conversation cache with mock response
        updateConversationCache(topic, [...conversationHistory, { role: 'assistant', content: mockResponse }]);
        
        return mockResponse;
      }
      throw error;
    }
  } catch (error) {
    console.error('Error sending message to OpenAI:', error);
    throw new Error('Failed to get response from AI. Please try again later.');
  }
};

/**
 * Creates a system message for the AI based on the topic and mode
 * @param {string} topic - The current history topic
 * @param {string} mode - The storytelling mode
 * @returns {string} - The system message
 */
const createSystemMessage = (topic, mode) => {
  let systemMessage = 'You are a knowledgeable and engaging history tutor named Clio. ';
  
  // Add storytelling approach
  systemMessage += 'You should communicate history in an engaging, narrative style that makes historical events come alive. ';
  systemMessage += 'When discussing historical periods or events, transport the user to that time with vivid descriptions of sights, sounds, and daily life. ';
  
  // Add topic-specific instructions
  if (topic) {
    systemMessage += `The current topic is ${topic}. When discussing this topic, use immersive storytelling techniques to help the user visualize and connect with this period of history. `;
  }
  
  // Add mode-specific instructions
  if (mode === 'detailed') {
    systemMessage += 'Provide detailed, comprehensive responses with dates, key figures, and historical context. Include interesting facts, anecdotes, and connections to broader historical themes. Start with an engaging hook that draws the user in, like "Imagine walking through the streets of ancient Rome..." or "Picture yourself in the war room as Churchill makes his decision...". Use sensory details and narrative techniques to make history memorable.';
  } else if (mode === 'summary') {
    systemMessage += 'Provide concise summaries focusing on the most important points, but still maintain a storytelling approach. Keep responses brief but engaging, highlighting key events and figures with vivid language. Use metaphors and analogies to help modern users relate to historical concepts.';
  }
  
  // Add keyword-triggered storytelling instructions
  systemMessage += ' When specific historical periods are mentioned, adjust your tone and narrative style to match that era. For example, if discussing the Renaissance, take on the tone of a Florentine scholar; if discussing Ancient Egypt, adopt the perspective of a scribe or temple priest.';
  
  // Add accuracy reminder
  systemMessage += ' Always maintain historical accuracy and cite sources when appropriate. If you don\'t know something, admit it rather than making up information.';
  
  return systemMessage;
};

/**
 * Formats conversation history for the Gemini API
 * @param {Array} history - The conversation history
 * @param {string} systemMessage - The system message
 * @returns {Array} - Formatted conversation for Gemini
 */
const formatConversationForGemini = (history, systemMessage) => {
  const formattedHistory = [];
  
  // Add system message as the first message
  formattedHistory.push({
    role: 'user',
    parts: [{ text: `System: ${systemMessage}` }]
  });
  
  // Add AI acknowledgment of system message
  formattedHistory.push({
    role: 'model',
    parts: [{ text: 'I understand. I am Clio, a knowledgeable history tutor. I will follow these guidelines in our conversation.' }]
  });
  
  // Add the rest of the conversation history
  for (let i = 0; i < history.length; i++) {
    const message = history[i];
    const role = message.role === 'user' ? 'user' : 'model';
    
    formattedHistory.push({
      role: role,
      parts: [{ text: message.content }]
    });
  }
  
  return formattedHistory;
};

/**
 * Makes an API call to the Gemini API
 * @param {string} apiKey - The Google API key
 * @param {Array} formattedHistory - The formatted conversation history
 * @returns {Promise<string>} - The AI response
 */
const callGeminiAPI = async (apiKey, formattedHistory) => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the response text from the Gemini API response
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Unexpected response format from Gemini API');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

/**
 * Updates the conversation cache with the latest conversation
 * @param {string} topic - The conversation topic
 * @param {Array} conversation - The conversation history
 */
const updateConversationCache = (topic, conversation) => {
  // Limit conversation history to last 10 messages to prevent token limits
  const limitedConversation = conversation.slice(-10);
  conversationCache.set(topic || 'general', limitedConversation);
};

/**
 * Gets the conversation history for a topic
 * @param {string} topic - The conversation topic
 * @returns {Array} - The conversation history
 */
export const getConversationHistory = (topic) => {
  return conversationCache.get(topic || 'general') || [];
};

/**
 * Clears the conversation history for a topic
 * @param {string} topic - The conversation topic
 */
export const clearConversationHistory = (topic) => {
  conversationCache.delete(topic || 'general');
};

/**
 * Mock implementation of Gemini response for development/fallback
 * @param {string} message - The user's message
 * @param {string} systemMessage - The system message
 * @param {Array} history - The conversation history
 * @returns {Promise<string>} - Promise resolving to the AI response
 */
const mockGeminiResponse = async (message, systemMessage, history) => {
  // Filter for keywords to determine response type
  const lowercaseMessage = message.toLowerCase();
  
  // Check for greetings
  if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hey')) {
    return "Hello! I'm Clio, your AI history tutor. What historical topic would you like to explore today?";
  }
  
  // Check for questions about specific historical periods
  if (lowercaseMessage.includes('world war')) {
    if (lowercaseMessage.includes('world war 2') || lowercaseMessage.includes('world war ii')) {
      return "World War II (1939-1945) was a global conflict that pitted the Allies (including the United States, United Kingdom, and Soviet Union) against the Axis powers (Nazi Germany, Italy, and Japan). It resulted in approximately 70-85 million casualties and shaped the modern world order. What specific aspect of World War II would you like to learn about?";
    } else if (lowercaseMessage.includes('world war 1') || lowercaseMessage.includes('world war i')) {
      return "World War I (1914-1918) began with the assassination of Archduke Franz Ferdinand and escalated into a global conflict due to complex alliances. It introduced modern warfare technologies like tanks and chemical weapons, and resulted in over 16 million deaths. The Treaty of Versailles that ended the war laid groundwork for future conflicts. Would you like to know more about the causes, major battles, or aftermath?";
    }
  }
  
  // Check for questions about ancient civilizations
  if (lowercaseMessage.includes('ancient egypt')) {
    return "Ancient Egyptian civilization flourished along the Nile River from about 3100 BCE to 332 BCE. They're famous for their monumental architecture like the pyramids and sphinx, their complex religious beliefs including mummification for the afterlife, and their hieroglyphic writing system. The civilization was ruled by pharaohs who were considered divine. Would you like to explore their religious practices, architectural achievements, or daily life?";
  }
  
  if (lowercaseMessage.includes('roman empire')) {
    return "The Roman Empire, established in 27 BCE when Octavian became Emperor Augustus, was one of history's largest empires. At its peak under Trajan, it encompassed most of Europe, parts of Africa and Asia. Roman innovations included advanced engineering (roads, aqueducts), a sophisticated legal system, and republican governance before the imperial period. The western empire fell in 476 CE, while the eastern Byzantine Empire continued until 1453. What aspect of Roman history interests you most?";
  }
  
  // Default response for other historical inquiries
  if (lowercaseMessage.includes('who') || 
      lowercaseMessage.includes('what') || 
      lowercaseMessage.includes('when') || 
      lowercaseMessage.includes('where') || 
      lowercaseMessage.includes('why') || 
      lowercaseMessage.includes('how')) {
    return "That's an interesting historical question. To give you the most accurate information, I'd need to research this specific topic. In a full implementation, I would connect to the OpenAI API to provide you with detailed historical information. Is there a particular time period or historical figure you're interested in learning about?";
  }
  
  // General response
  return "I'm here to help you explore history! You can ask me about specific historical events, figures, or time periods. For example, you could ask about Ancient Egypt, the Roman Empire, the Renaissance, World War II, or any other historical topic you're curious about.";
};

/**
 * Filters sensitive or inappropriate keywords from user input
 * @param {string} message - The user's message
 * @returns {string} - Filtered message or null if blocked
 */
export const filterKeywords = (message) => {
  const sensitiveKeywords = [
    'offensive', 'inappropriate', 'hate', 'racist', 'sexist',
    // Add more keywords as needed
  ];
  
  const lowercaseMessage = message.toLowerCase();
  
  // Check if message contains any sensitive keywords
  const containsSensitiveKeywords = sensitiveKeywords.some(keyword => 
    lowercaseMessage.includes(keyword)
  );
  
  if (containsSensitiveKeywords) {
    return null; // Block the message
  }
  
  return message; // Allow the message
};
