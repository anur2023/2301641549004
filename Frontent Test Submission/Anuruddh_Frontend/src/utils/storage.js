import loggingMiddleware from '../services/loggingMiddleware';

// Generate a random shortcode
export const generateShortcode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Check if shortcode is available
export const isShortcodeAvailable = (shortcode) => {
  try {
    const existingUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
    return !existingUrls.some(url => url.shortcode === shortcode);
  } catch (error) {
    loggingMiddleware.error('Failed to check shortcode availability', { error, shortcode });
    return false;
  }
};

// Save short URL to storage
export const saveShortUrl = (urlData) => {
  try {
    const existingUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
    
    // Check if shortcode already exists
    const exists = existingUrls.some(url => url.shortcode === urlData.shortcode);
    if (exists) {
      loggingMiddleware.warn('Shortcode already exists in storage', { shortcode: urlData.shortcode });
      return false;
    }
    
    existingUrls.push(urlData);
    localStorage.setItem('shortenedUrls', JSON.stringify(existingUrls));
    loggingMiddleware.info('Short URL saved to storage', { shortcode: urlData.shortcode });
    return true;
  } catch (error) {
    loggingMiddleware.error('Failed to save short URL to storage', { error, urlData });
    return false;
  }
};

// Get short URL from storage
export const getShortUrl = (shortcode) => {
  try {
    const existingUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
    return existingUrls.find(url => url.shortcode === shortcode);
  } catch (error) {
    loggingMiddleware.error('Failed to get short URL from storage', { error, shortcode });
    return null;
  }
};

// Get all short URLs from storage
export const getAllShortUrls = () => {
  try {
    const existingUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
    return existingUrls;
  } catch (error) {
    loggingMiddleware.error('Failed to get all short URLs from storage', { error });
    return [];
  }
};

// Record a click
export const recordClick = (shortcode, source = 'direct', location = 'Unknown') => {
  try {
    const existingUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
    const urlIndex = existingUrls.findIndex(url => url.shortcode === shortcode);
    
    if (urlIndex !== -1) {
      existingUrls[urlIndex].clicks = (existingUrls[urlIndex].clicks || 0) + 1;
      
      if (!existingUrls[urlIndex].clickData) {
        existingUrls[urlIndex].clickData = [];
      }
      
      existingUrls[urlIndex].clickData.push({
        timestamp: new Date().toISOString(),
        source,
        location
      });
      
      localStorage.setItem('shortenedUrls', JSON.stringify(existingUrls));
      loggingMiddleware.debug('Click recorded successfully', { shortcode });
      return true;
    }
    
    return false;
  } catch (error) {
    loggingMiddleware.error('Failed to record click', { error, shortcode });
    return false;
  }
};