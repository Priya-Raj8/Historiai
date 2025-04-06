import axios from 'axios';

// Base URL for Wikipedia API
const API_BASE_URL = 'https://en.wikipedia.org/w/api.php';

/**
 * Search for topics on Wikipedia
 * @param {string} query - The search query
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise} - Promise resolving to search results
 */
export const searchWikipedia = async (query, limit = 10) => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        origin: '*', // Required for CORS
        srlimit: limit,
      },
    });

    return response.data.query.search;
  } catch (error) {
    console.error('Error searching Wikipedia:', error);
    throw error;
  }
};

/**
 * Get detailed information about a Wikipedia page
 * @param {string} pageId - The Wikipedia page ID
 * @returns {Promise} - Promise resolving to page details
 */
export const getPageDetails = async (pageId) => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        action: 'query',
        pageids: pageId,
        prop: 'extracts|pageimages|info',
        exintro: true, // Only get the intro section
        explaintext: true, // Get plain text instead of HTML
        pithumbsize: 500, // Thumbnail size
        inprop: 'url', // Get the URL of the page
        format: 'json',
        origin: '*', // Required for CORS
      },
    });

    return response.data.query.pages[pageId];
  } catch (error) {
    console.error('Error fetching page details:', error);
    throw error;
  }
};

/**
 * Get the full content of a Wikipedia page
 * @param {string} pageId - The Wikipedia page ID
 * @returns {Promise} - Promise resolving to page content
 */
export const getPageContent = async (pageId) => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        action: 'query',
        pageids: pageId,
        prop: 'extracts|categories|links|images|sections',
        explaintext: true, // Get plain text instead of HTML
        format: 'json',
        origin: '*', // Required for CORS
      },
    });

    return response.data.query.pages[pageId];
  } catch (error) {
    console.error('Error fetching page content:', error);
    throw error;
  }
};

/**
 * Get images from a Wikipedia page
 * @param {string} pageId - The Wikipedia page ID
 * @returns {Promise} - Promise resolving to page images
 */
export const getPageImages = async (pageId) => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        action: 'query',
        pageids: pageId,
        prop: 'images',
        format: 'json',
        origin: '*', // Required for CORS
      },
    });

    const images = response.data.query.pages[pageId].images || [];
    
    // Get actual image URLs for each image title
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        try {
          // Skip non-image files and SVG files (which often cause issues)
          if (!image.title.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/i) || 
              image.title.toLowerCase().includes('.svg')) {
            return null;
          }
          
          const imageInfo = await axios.get(API_BASE_URL, {
            params: {
              action: 'query',
              titles: image.title,
              prop: 'imageinfo',
              iiprop: 'url|size',
              format: 'json',
              origin: '*', // Required for CORS
            },
          });
          
          const pages = imageInfo.data.query.pages;
          const pageId = Object.keys(pages)[0];
          
          // Only return images with valid URLs
          const imageUrl = pages[pageId].imageinfo?.[0]?.url;
          if (imageUrl && !imageUrl.includes('commons-logo') && !imageUrl.includes('wiki-logo')) {
            return imageUrl;
          }
          return null;
        } catch (error) {
          console.error('Error fetching image info:', error);
          return null;
        }
      })
    );
    
    return imageUrls.filter(Boolean); // Remove null values
  } catch (error) {
    console.error('Error fetching page images:', error);
    throw error;
  }
};

/**
 * Get thumbnail image for a topic
 * @param {string} pageId - The Wikipedia page ID
 * @returns {Promise} - Promise resolving to thumbnail URL
 */
export const getTopicThumbnail = async (pageId) => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        action: 'query',
        pageids: pageId,
        prop: 'pageimages',
        piprop: 'thumbnail',
        pithumbsize: 300,
        format: 'json',
        origin: '*', // Required for CORS
      },
    });

    const page = response.data.query.pages[pageId];
    return page.thumbnail?.source || null;
  } catch (error) {
    console.error('Error fetching thumbnail:', error);
    return null;
  }
};

/**
 * Get Wikipedia content in Hindi
 * @param {string} query - The search query
 * @returns {Promise} - Promise resolving to Hindi content
 */
export const getHindiContent = async (query) => {
  try {
    // First search in Hindi Wikipedia
    const response = await axios.get('https://hi.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        origin: '*', // Required for CORS
        srlimit: 1,
      },
    });

    if (response.data.query.search.length === 0) {
      throw new Error('No results found in Hindi Wikipedia');
    }

    const pageId = response.data.query.search[0].pageid;

    // Get the content of the page
    const contentResponse = await axios.get('https://hi.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        pageids: pageId,
        prop: 'extracts|pageimages|info',
        exintro: true, // Only get the intro section
        explaintext: true, // Get plain text instead of HTML
        pithumbsize: 500, // Thumbnail size
        inprop: 'url', // Get the URL of the page
        format: 'json',
        origin: '*', // Required for CORS
      },
    });

    return contentResponse.data.query.pages[pageId];
  } catch (error) {
    console.error('Error fetching Hindi content:', error);
    throw error;
  }
};

export default {
  searchWikipedia,
  getPageDetails,
  getPageContent,
  getPageImages,
  getTopicThumbnail,
  getHindiContent
};
