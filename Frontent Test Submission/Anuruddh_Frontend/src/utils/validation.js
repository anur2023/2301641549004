import loggingMiddleware from '../services/loggingMiddleware';

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    loggingMiddleware.debug('URL validation failed', { url, error });
    return false;
  }
};

export const isValidShortcode = (shortcode) => {
  // Alphanumeric, 4-20 characters
  const regex = /^[a-zA-Z0-9]{4,20}$/;
  const isValid = regex.test(shortcode);
  
  if (!isValid) {
    loggingMiddleware.debug('Shortcode validation failed', { shortcode });
  }
  
  return isValid;
};

export const isValidValidityMinutes = (minutes) => {
  // Positive integer
  const isValid = Number.isInteger(minutes) && minutes > 0;
  
  if (!isValid) {
    loggingMiddleware.debug('Validity minutes validation failed', { minutes });
  }
  
  return isValid;
};