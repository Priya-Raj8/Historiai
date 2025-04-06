/**
 * Content Processing Service
 * 
 * Provides utilities for processing historical content, extracting key information,
 * generating quizzes, and enhancing the learning experience.
 */

// Cache for extracted data to improve performance
const extractionCache = new Map();

/**
 * Extracts key dates and events from the content
 * @param {string} content - The historical content text
 * @returns {Array} - Array of extracted date events
 */
export const extractTimelineEvents = (content) => {
  if (!content) return [];
  
  // Check cache first
  const cacheKey = `timeline_${content.substring(0, 100)}`;
  if (extractionCache.has(cacheKey)) {
    return extractionCache.get(cacheKey);
  }
  
  // Regular expressions to find dates and years
  const yearPattern = /\b(in|during|around|about|circa|by)?\s?(\d{3,4}(?:\s?(?:BC|BCE|AD|CE))?)\b/gi;
  const datePattern = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/gi;
  
  const events = [];
  let match;
  
  try {
    // Extract year-based events
    const contentByParagraphs = content.split('\n').filter(p => p.trim().length > 0);
    
    contentByParagraphs.forEach(paragraph => {
      // Reset the regex state for each paragraph
      yearPattern.lastIndex = 0;
      datePattern.lastIndex = 0;
      
      // Look for year patterns
      while ((match = yearPattern.exec(paragraph)) !== null) {
        const year = match[2];
        const sentenceStart = paragraph.lastIndexOf('.', match.index) + 1;
        const sentenceEnd = paragraph.indexOf('.', match.index + match[0].length);
        
        if (sentenceEnd !== -1) {
          const description = paragraph.substring(
            sentenceStart, 
            sentenceEnd
          ).trim();
          
          if (description.length > 10 && !events.some(e => e.description === description)) {
            events.push({
              year,
              title: `Event in ${year}`,
              description
            });
          }
        }
      }
      
      // Look for date patterns
      while ((match = datePattern.exec(paragraph)) !== null) {
        const date = match[0];
        const sentenceStart = paragraph.lastIndexOf('.', match.index) + 1;
        const sentenceEnd = paragraph.indexOf('.', match.index + match[0].length);
        
        if (sentenceEnd !== -1) {
          const description = paragraph.substring(
            sentenceStart, 
            sentenceEnd
          ).trim();
          
          if (description.length > 10 && !events.some(e => e.description === description)) {
            events.push({
              year: date,
              title: `Event on ${date}`,
              description
            });
          }
        }
      }
    });
    
    // Limit to the most significant events (max 10)
    const result = events.slice(0, 10);
    
    // Cache the result
    extractionCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Error extracting timeline events:', error);
    return [];
  }
};

/**
 * Extracts key figures (people) mentioned in the content
 * @param {string} content - The historical content text
 * @returns {Array} - Array of key figures
 */
export const extractKeyFigures = (content) => {
  if (!content) return [];
  
  // Check cache first
  const cacheKey = `figures_${content.substring(0, 100)}`;
  if (extractionCache.has(cacheKey)) {
    return extractionCache.get(cacheKey);
  }
  
  try {
    // Common titles and honorifics to help identify people
    const titles = [
      'King', 'Queen', 'Emperor', 'Empress', 'Prince', 'Princess', 'Duke', 'Duchess',
      'Lord', 'Lady', 'Sir', 'Dame', 'President', 'Prime Minister', 'Chancellor',
      'General', 'Admiral', 'Captain', 'Colonel', 'Professor', 'Dr.', 'Saint'
    ];
    
    const figures = [];
    const contentByParagraphs = content.split('\n').filter(p => p.trim().length > 0);
    
    // Pattern for names (simplified - will catch many but not all names)
    const namePattern = new RegExp(`\\b(${titles.join('|')})?\\s?([A-Z][a-z]+(?:\\s[A-Z][a-z]+){1,3})\\b`, 'g');
    
    contentByParagraphs.forEach(paragraph => {
      let match;
      namePattern.lastIndex = 0;
      
      while ((match = namePattern.exec(paragraph)) !== null) {
        const name = match[2];
        
        // Skip common words that might be caught by the pattern
        if (['The', 'This', 'That', 'These', 'Those', 'There', 'Their', 'They'].includes(name.split(' ')[0])) {
          continue;
        }
        
        // Find a sentence that describes this person
        const sentenceStart = paragraph.lastIndexOf('.', match.index) + 1;
        const sentenceEnd = paragraph.indexOf('.', match.index + match[0].length);
        
        if (sentenceEnd !== -1) {
          const description = paragraph.substring(
            sentenceStart, 
            sentenceEnd
          ).trim();
          
          if (description.length > 10 && 
              !figures.some(f => f.name === name) && 
              description.includes(name)) {
            figures.push({
              name,
              description
            });
          }
        }
      }
    });
    
    // Limit to the most significant figures (max 5)
    const result = figures.slice(0, 5);
    
    // Cache the result
    extractionCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Error extracting key figures:', error);
    return [];
  }
};

/**
 * Extracts locations mentioned in the content
 * @param {string} content - The historical content text
 * @returns {Array} - Array of locations
 */
export const extractLocations = (content) => {
  if (!content) return [];
  
  // Check cache first
  const cacheKey = `locations_${content.substring(0, 100)}`;
  if (extractionCache.has(cacheKey)) {
    return extractionCache.get(cacheKey);
  }
  
  try {
    // This is a simplified approach - for a production app, you would use a more sophisticated
    // named entity recognition system or a geography database
    const commonLocations = [
      'Africa', 'America', 'Asia', 'Australia', 'Europe',
      'North America', 'South America', 'Antarctica', 'Middle East',
      'United States', 'Russia', 'China', 'India', 'Brazil', 'Canada',
      'England', 'France', 'Germany', 'Italy', 'Spain', 'Japan',
      'Egypt', 'Greece', 'Rome', 'Athens', 'Sparta', 'Jerusalem',
      'London', 'Paris', 'Berlin', 'Moscow', 'Beijing', 'Tokyo',
      'New York', 'Washington', 'Chicago', 'Los Angeles', 'San Francisco',
      'River', 'Mountain', 'Ocean', 'Sea', 'Lake', 'Gulf', 'Peninsula'
    ];
    
    const locationPattern = new RegExp(`\\b(${commonLocations.join('|')})\\b`, 'gi');
    const locations = [];
    
    const contentByParagraphs = content.split('\n').filter(p => p.trim().length > 0);
    
    contentByParagraphs.forEach(paragraph => {
      let match;
      locationPattern.lastIndex = 0;
      
      while ((match = locationPattern.exec(paragraph)) !== null) {
        const locationName = match[0];
        
        // Find a sentence that describes this location
        const sentenceStart = paragraph.lastIndexOf('.', match.index) + 1;
        const sentenceEnd = paragraph.indexOf('.', match.index + match[0].length);
        
        if (sentenceEnd !== -1) {
          const description = paragraph.substring(
            sentenceStart, 
            sentenceEnd
          ).trim();
          
          if (description.length > 10 && 
              !locations.some(l => l.name === locationName)) {
            
            // For demonstration purposes, generate random coordinates
            // In a real app, you would use a geocoding service
            const lat = (Math.random() * 180) - 90;
            const lng = (Math.random() * 360) - 180;
            
            locations.push({
              name: locationName,
              description,
              lat,
              lng
            });
          }
        }
      }
    });
    
    // Limit to the most significant locations (max 8)
    const result = locations.slice(0, 8);
    
    // Cache the result
    extractionCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Error extracting locations:', error);
    return [];
  }
};

/**
 * Extracts key terms and their definitions from the content
 * @param {string} content - The historical content text
 * @returns {Array} - Array of key terms with definitions
 */
export const extractKeyTerms = (content) => {
  if (!content) return [];
  
  // Check cache first
  const cacheKey = `terms_${content.substring(0, 100)}`;
  if (extractionCache.has(cacheKey)) {
    return extractionCache.get(cacheKey);
  }
  
  try {
    const terms = [];
    const contentByParagraphs = content.split('\n').filter(p => p.trim().length > 0);
    
    // Pattern for terms that might be defined (words followed by "is", "was", "refers to", etc.)
    const termPattern = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+){0,3})\s(?:is|was|were|are|refers to|defined as)\b/g;
    
    contentByParagraphs.forEach(paragraph => {
      let match;
      termPattern.lastIndex = 0;
      
      while ((match = termPattern.exec(paragraph)) !== null) {
        const term = match[1];
        
        // Skip common words that might be caught by the pattern
        if (['The', 'This', 'That', 'These', 'Those', 'There', 'Their', 'They', 'It'].includes(term.split(' ')[0])) {
          continue;
        }
        
        // Find the definition (the sentence containing the term)
        const sentenceStart = paragraph.lastIndexOf('.', match.index) + 1;
        const sentenceEnd = paragraph.indexOf('.', match.index + match[0].length);
        
        if (sentenceEnd !== -1) {
          const definition = paragraph.substring(
            sentenceStart, 
            sentenceEnd
          ).trim();
          
          if (definition.length > 10 && !terms.some(t => t.term === term)) {
            terms.push({
              term,
              definition
            });
          }
        }
      }
    });
    
    // Cache the result
    extractionCache.set(cacheKey, terms);
    
    return terms;
  } catch (error) {
    console.error('Error extracting key terms:', error);
    return [];
  }
};

/**
 * Generates quiz questions based on the content
 * @param {string} content - The historical content text
 * @param {string} title - The topic title
 * @returns {Array} - Array of quiz questions
 */
export const generateQuizQuestions = (content, title) => {
  if (!content) return [];
  
  // Check cache first
  const cacheKey = `quiz_${title}_${content.substring(0, 100)}`;
  if (extractionCache.has(cacheKey)) {
    return extractionCache.get(cacheKey);
  }
  
  try {
    // This is a simplified approach - in a production app, you might use an AI service
    // to generate more sophisticated questions
    
    const questions = [];
    const contentByParagraphs = content.split('\n').filter(p => p.trim().length > 0);
    
    // Look for paragraphs with dates, names, or key facts
    contentByParagraphs.forEach(paragraph => {
      if (paragraph.length < 100) return; // Skip short paragraphs
      
      // Check for dates
      if (/\b\d{4}\b/.test(paragraph)) {
        const match = paragraph.match(/\b(\d{4})\b/);
        if (match) {
          const year = match[1];
          const sentenceStart = paragraph.lastIndexOf('.', match.index) + 1;
          const sentenceEnd = paragraph.indexOf('.', match.index + match[0].length);
          
          if (sentenceEnd !== -1) {
            const sentence = paragraph.substring(sentenceStart, sentenceEnd).trim();
            
            if (sentence.length > 20 && sentence.includes(year)) {
              // Create a question about the year
              const questionText = sentence.replace(year, '______');
              
              questions.push({
                question: `In what year did the following event occur: ${questionText}`,
                options: [
                  year,
                  (parseInt(year) + Math.floor(Math.random() * 10) + 1).toString(),
                  (parseInt(year) - Math.floor(Math.random() * 10) - 1).toString(),
                  (parseInt(year) + Math.floor(Math.random() * 20) + 10).toString()
                ].sort(() => Math.random() - 0.5),
                correctAnswer: 0, // Index of the correct answer after sorting
                explanation: sentence
              });
              
              // Update the correct answer index after sorting
              questions[questions.length - 1].correctAnswer = 
                questions[questions.length - 1].options.indexOf(year);
            }
          }
        }
      }
      
      // Check for key figures or terms
      const keyFigures = extractKeyFigures(paragraph);
      if (keyFigures.length > 0) {
        const figure = keyFigures[0];
        
        questions.push({
          question: `Who was ${figure.name}?`,
          options: [
            figure.description,
            `A fictional character in ${title} literature`,
            `An opponent of the main historical figures in ${title}`,
            `A modern historian who studied ${title}`
          ],
          correctAnswer: 0,
          explanation: figure.description
        });
      }
    });
    
    // Add a general question about the topic
    questions.push({
      question: `Which of the following best describes ${title}?`,
      options: [
        content.split('.')[0].trim(), // First sentence often contains a definition
        `A modern political movement based on historical events`,
        `A fictional story created for entertainment purposes`,
        `A scientific theory proposed in the 21st century`
      ],
      correctAnswer: 0,
      explanation: content.split('.')[0].trim()
    });
    
    // Shuffle and limit questions
    const result = questions.sort(() => Math.random() - 0.5).slice(0, 5);
    
    // Cache the result
    extractionCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    return [];
  }
};

/**
 * Extracts key takeaways from the content
 * @param {string} content - The historical content text
 * @returns {Array} - Array of key takeaways
 */
export const extractKeyTakeaways = (content) => {
  if (!content) return [];
  
  // Check cache first
  const cacheKey = `takeaways_${content.substring(0, 100)}`;
  if (extractionCache.has(cacheKey)) {
    return extractionCache.get(cacheKey);
  }
  
  try {
    const takeaways = [];
    const contentByParagraphs = content.split('\n').filter(p => p.trim().length > 0);
    
    // Look for sentences that might contain key information
    const significancePatterns = [
      /\b(?:significant|important|crucial|critical|essential|key|major|primary|fundamental)\b/i,
      /\b(?:led to|resulted in|caused|influenced|affected|changed|transformed|revolutionized)\b/i,
      /\b(?:first|last|only|largest|smallest|greatest|most|best|worst)\b/i,
      /\b(?:ultimately|eventually|finally|in conclusion|as a result|consequently|therefore)\b/i
    ];
    
    contentByParagraphs.forEach(paragraph => {
      // Split paragraph into sentences
      const sentences = paragraph.split(/(?<=[.!?])\s+/);
      
      sentences.forEach(sentence => {
        // Check if the sentence contains any significance patterns
        const isSignificant = significancePatterns.some(pattern => pattern.test(sentence));
        
        if (isSignificant && sentence.length > 30 && sentence.length < 200) {
          // Avoid duplicates
          if (!takeaways.some(t => t === sentence)) {
            takeaways.push(sentence);
          }
        }
      });
    });
    
    // If we don't have enough takeaways, add some from the beginning and end of the content
    if (takeaways.length < 3) {
      const firstParagraph = contentByParagraphs[0];
      const lastParagraph = contentByParagraphs[contentByParagraphs.length - 1];
      
      if (firstParagraph) {
        const firstSentence = firstParagraph.split('.')[0] + '.';
        if (!takeaways.includes(firstSentence) && firstSentence.length > 30) {
          takeaways.unshift(firstSentence);
        }
      }
      
      if (lastParagraph) {
        const lastSentences = lastParagraph.split(/(?<=[.!?])\s+/);
        const lastSentence = lastSentences[lastSentences.length - 1];
        if (!takeaways.includes(lastSentence) && lastSentence.length > 30) {
          takeaways.push(lastSentence);
        }
      }
    }
    
    // Limit to 5 takeaways
    const result = takeaways.slice(0, 5);
    
    // Cache the result
    extractionCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Error extracting key takeaways:', error);
    return [];
  }
};

/**
 * Processes the content into sections with headings
 * @param {string} content - The raw content text
 * @returns {Array} - Array of sections with ids, titles, and content
 */
export const processContentIntoSections = (content) => {
  if (!content) return [];
  
  // Check cache first
  const cacheKey = `sections_${content.substring(0, 100)}`;
  if (extractionCache.has(cacheKey)) {
    return extractionCache.get(cacheKey);
  }
  
  try {
    const sections = [];
    const paragraphs = content.split('\n').filter(p => p.trim().length > 0);
    
    let currentSection = {
      id: 'introduction',
      title: 'Introduction',
      content: []
    };
    
    paragraphs.forEach((paragraph, index) => {
      // Check if this paragraph might be a heading
      // Headings are typically shorter and don't end with a period
      const isHeading = paragraph.length < 60 && !paragraph.endsWith('.');
      
      if (isHeading && index > 0) {
        // Save the current section if it has content
        if (currentSection.content.length > 0) {
          sections.push({...currentSection});
        }
        
        // Start a new section
        currentSection = {
          id: paragraph.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: paragraph,
          content: []
        };
      } else {
        // Add to the current section
        currentSection.content.push(paragraph);
      }
    });
    
    // Add the last section
    if (currentSection.content.length > 0) {
      sections.push(currentSection);
    }
    
    // If no sections were created (no headings found), create a default structure
    if (sections.length === 0) {
      const midpoint = Math.floor(paragraphs.length / 2);
      
      sections.push({
        id: 'introduction',
        title: 'Introduction',
        content: paragraphs.slice(0, midpoint)
      });
      
      sections.push({
        id: 'details',
        title: 'Historical Details',
        content: paragraphs.slice(midpoint)
      });
    }
    
    // Cache the result
    extractionCache.set(cacheKey, sections);
    
    return sections;
  } catch (error) {
    console.error('Error processing content into sections:', error);
    return [{
      id: 'content',
      title: 'Content',
      content: content.split('\n').filter(p => p.trim().length > 0)
    }];
  }
};

/**
 * Finds related topics based on the content
 * @param {string} content - The content text
 * @param {string} currentTopic - The current topic title
 * @returns {Array} - Array of related topic objects with id, title, and description
 */
export const findRelatedTopics = (content, currentTopic) => {
  if (!content || !currentTopic) return [];
  
  // Check cache first
  const cacheKey = `related_${currentTopic}`;
  if (extractionCache.has(cacheKey)) {
    return extractionCache.get(cacheKey);
  }
  
  try {
    // This is a simplified approach to finding related topics
    // In a production app, you might use a more sophisticated algorithm or API
    
    // Extract potential topic keywords from the content
    const words = content.split(/\s+/);
    const potentialTopics = [];
    
    // Look for capitalized words that might be topics
    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/[.,;:!?()[\]{}'"]/g, '');
      
      // Skip short words, numbers, and the current topic
      if (word.length < 4 || /^\d+$/.test(word) || word.toLowerCase() === currentTopic.toLowerCase()) {
        continue;
      }
      
      // Check if it's a capitalized word (potential proper noun)
      if (/^[A-Z][a-z]+$/.test(word) && !potentialTopics.includes(word)) {
        potentialTopics.push(word);
      }
      
      // Check for multi-word phrases (up to 3 words)
      if (i < words.length - 2 && /^[A-Z][a-z]+$/.test(word)) {
        const nextWord = words[i+1].replace(/[.,;:!?()[\]{}'"]/g, '');
        if (/^[A-Z]?[a-z]+$/.test(nextWord)) {
          const phrase = `${word} ${nextWord}`;
          if (!potentialTopics.includes(phrase)) {
            potentialTopics.push(phrase);
          }
          
          // Try for a 3-word phrase
          if (i < words.length - 3) {
            const thirdWord = words[i+2].replace(/[.,;:!?()[\]{}'"]/g, '');
            if (/^[A-Z]?[a-z]+$/.test(thirdWord)) {
              const longPhrase = `${word} ${nextWord} ${thirdWord}`;
              if (!potentialTopics.includes(longPhrase)) {
                potentialTopics.push(longPhrase);
              }
            }
          }
        }
      }
    }
    
    // Find sentences containing these potential topics
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const topicDescriptions = new Map();
    
    potentialTopics.forEach(topic => {
      for (const sentence of sentences) {
        if (sentence.includes(topic) && !topicDescriptions.has(topic)) {
          topicDescriptions.set(topic, sentence.trim());
          break;
        }
      }
    });
    
    // Convert to array of objects with mock IDs (in a real app, you'd use actual page IDs)
    const relatedTopics = Array.from(topicDescriptions.entries())
      .map(([title, description]) => ({
        id: generateMockId(title),
        title,
        description: description.length > 150 ? description.substring(0, 147) + '...' : description
      }))
      .slice(0, 6); // Limit to 6 related topics
    
    // Cache the result
    extractionCache.set(cacheKey, relatedTopics);
    
    return relatedTopics;
  } catch (error) {
    console.error('Error finding related topics:', error);
    return [];
  }
};

/**
 * Extracts quick facts about the topic
 * @param {string} content - The historical content text
 * @param {string} title - The topic title
 * @returns {Array} - Array of fact objects with label and value
 */
export const extractQuickFacts = (content, title) => {
  if (!content) return [];
  
  // Check cache first
  const cacheKey = `quickfacts_${title}`;
  if (extractionCache.has(cacheKey)) {
    return extractionCache.get(cacheKey);
  }
  
  const facts = [];
  
  try {
    // Extract time period
    const timePeriodRegex = /\b(\d{1,4}(?:st|nd|rd|th)?\s+century|\d{4}s|\d{3,4}\s*(?:BC|BCE|AD|CE)|\d{3,4}-\d{3,4}(?:\s*(?:BC|BCE|AD|CE))?)\b/gi;
    const timePeriodMatch = content.match(timePeriodRegex);
    if (timePeriodMatch && timePeriodMatch.length > 0) {
      facts.push({
        label: "Time Period",
        value: timePeriodMatch[0]
      });
    }
    
    // Extract location/region
    const locationRegex = /\bin\s+(North|South|East|West|Central)?\s*(America|Europe|Asia|Africa|Australia|Antarctica|the\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/i;
    const locationMatch = content.match(locationRegex);
    if (locationMatch && locationMatch.length > 2) {
      facts.push({
        label: "Region",
        value: locationMatch[0].replace(/^in\s+/, '')
      });
    }
    
    // Extract key figures
    const keyFigures = extractKeyFigures(content).slice(0, 2);
    if (keyFigures.length > 0) {
      facts.push({
        label: "Key Figure",
        value: keyFigures[0].name
      });
    }
    
    // Extract significant date
    const dateRegex = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/i;
    const dateMatch = content.match(dateRegex);
    if (dateMatch) {
      facts.push({
        label: "Significant Date",
        value: dateMatch[0]
      });
    }
    
    // Extract duration if applicable
    const durationRegex = /\blasted\s+for\s+(\d+(?:\.\d+)?\s+(?:years|decades|centuries))\b/i;
    const durationMatch = content.match(durationRegex);
    if (durationMatch && durationMatch.length > 1) {
      facts.push({
        label: "Duration",
        value: durationMatch[1]
      });
    }
    
    // Extract outcome or result if applicable
    const outcomeRegex = /\b(?:resulted\s+in|led\s+to|outcome\s+was|ended\s+with|concluded\s+with)\s+([^.]+)/i;
    const outcomeMatch = content.match(outcomeRegex);
    if (outcomeMatch && outcomeMatch.length > 1) {
      facts.push({
        label: "Outcome",
        value: outcomeMatch[1].trim()
      });
    }
    
    // If we don't have enough facts, add some generic ones
    if (facts.length < 3) {
      // Add category
      const categories = [
        "Historical Event", "Historical Period", "Ancient Civilization", 
        "War", "Revolution", "Movement", "Dynasty", "Empire"
      ];
      
      let category = "";
      for (const cat of categories) {
        if (content.toLowerCase().includes(cat.toLowerCase()) || title.toLowerCase().includes(cat.toLowerCase())) {
          category = cat;
          break;
        }
      }
      
      if (category) {
        facts.push({
          label: "Category",
          value: category
        });
      }
      
      // Add significance
      facts.push({
        label: "Significance",
        value: `Important topic in ${title.split(' ')[0]} history`
      });
    }
    
    // Cache the results
    extractionCache.set(cacheKey, facts);
    return facts;
  } catch (error) {
    console.error('Error extracting quick facts:', error);
    return [];
  }
};

/**
 * Generates a mock ID for a topic based on its title
 * In a real app, you would query an API to get the actual page ID
 * @param {string} title - The topic title
 * @returns {string} - A mock ID
 */
const generateMockId = (title) => {
  // Simple hash function to generate a consistent ID from a string
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    const char = title.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString();
};
