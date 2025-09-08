import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { isValidUrl, isValidShortcode, isValidValidityMinutes } from '../utils/validation';
import { generateShortcode, isShortcodeAvailable, saveShortUrl } from '../utils/storage';
import loggingMiddleware from '../services/loggingMiddleware';

const UrlShortener = () => {
  const [urls, setUrls] = useState([
    { longUrl: '', validityMinutes: '', shortcode: '' }
  ]);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleAddUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validityMinutes: '', shortcode: '' }]);
    }
  };

  const handleRemoveUrl = (index) => {
    if (urls.length > 1) {
      const newUrls = [...urls];
      newUrls.splice(index, 1);
      setUrls(newUrls);
    }
  };

  const handleInputChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
    
    // Clear error for this field
    if (errors[`${index}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${index}-${field}`];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    urls.forEach((url, index) => {
      if (!url.longUrl.trim()) {
        newErrors[`${index}-longUrl`] = 'URL is required';
      } else if (!isValidUrl(url.longUrl)) {
        newErrors[`${index}-longUrl`] = 'Please enter a valid URL';
      }
      
      if (url.validityMinutes && !isValidValidityMinutes(Number(url.validityMinutes))) {
        newErrors[`${index}-validityMinutes`] = 'Please enter a positive integer';
      }
      
      if (url.shortcode && !isValidShortcode(url.shortcode)) {
        newErrors[`${index}-shortcode`] = 'Shortcode must be 4-20 alphanumeric characters';
      } else if (url.shortcode && !isShortcodeAvailable(url.shortcode)) {
        newErrors[`${index}-shortcode`] = 'Shortcode is already in use';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      loggingMiddleware.warn('Form validation failed', { errors });
      return;
    }
    
    setLoading(true);
    setResults([]);
    
    try {
      const newResults = [];
      
      for (const url of urls) {
        try {
          const validity = url.validityMinutes ? parseInt(url.validityMinutes) : 30;
          let shortcode = url.shortcode;
          
          // Generate shortcode if not provided
          if (!shortcode) {
            shortcode = generateShortcode();
            // Ensure uniqueness
            let attempts = 0;
            while (!isShortcodeAvailable(shortcode) && attempts < 5) {
              shortcode = generateShortcode();
              attempts++;
            }
            
            if (attempts >= 5) {
              throw new Error('Could not generate a unique shortcode');
            }
          }
          
          const created = new Date();
          const expires = new Date(created.getTime() + validity * 60000);
          
          const result = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            longUrl: url.longUrl,
            shortcode,
            shortUrl: `http://localhost:3000/${shortcode}`,
            created: created.toISOString(),
            expires: expires.toISOString(),
            clicks: 0,
            clickData: []
          };
          
          // Save to localStorage
          const saved = saveShortUrl(result);
          if (!saved) {
            throw new Error('Failed to save URL');
          }
          
          newResults.push(result);
          loggingMiddleware.info('URL shortened successfully', { shortcode: result.shortcode });
        } catch (error) {
          loggingMiddleware.error('Failed to shorten URL', { error, url });
          newResults.push({ error: error.message });
        }
      }
      
      setResults(newResults);
      
      // Reset form if all requests were successful
      if (newResults.every(result => !result.error)) {
        setUrls([{ longUrl: '', validityMinutes: '', shortcode: '' }]);
      }
    } catch (error) {
      loggingMiddleware.error('Unexpected error during URL shortening', { error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          URL Shortener
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }} align="center">
          Shorten up to 5 URLs at once. Leave validity empty for default 30 minutes.
        </Typography>
        
        <form onSubmit={handleSubmit}>
          {urls.map((url, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Long URL"
                    value={url.longUrl}
                    onChange={(e) => handleInputChange(index, 'longUrl', e.target.value)}
                    error={!!errors[`${index}-longUrl`]}
                    helperText={errors[`${index}-longUrl`]}
                    placeholder="https://example.com"
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Validity (minutes)"
                    type="number"
                    value={url.validityMinutes}
                    onChange={(e) => handleInputChange(index, 'validityMinutes', e.target.value)}
                    error={!!errors[`${index}-validityMinutes`]}
                    helperText={errors[`${index}-validityMinutes`]}
                    placeholder="30 (default)"
                  />
                </Grid>
                
                <Grid item xs={10} sm={5}>
                  <TextField
                    fullWidth
                    label="Custom Shortcode (optional)"
                    value={url.shortcode}
                    onChange={(e) => handleInputChange(index, 'shortcode', e.target.value)}
                    error={!!errors[`${index}-shortcode`]}
                    helperText={errors[`${index}-shortcode`]}
                  />
                </Grid>
                
                <Grid item xs={2} sm={1}>
                  {urls.length > 1 && (
                    <IconButton onClick={() => handleRemoveUrl(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </Box>
          ))}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleAddUrl}
              disabled={urls.length >= 5}
              startIcon={<AddIcon />}
            >
              Add URL
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              size="large"
            >
              {loading ? 'Shortening...' : 'Shorten URLs'}
            </Button>
          </Box>
        </form>
        
        {results.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Results
            </Typography>
            
            {results.map((result, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                {result.error ? (
                  <Alert severity="error">
                    Error shortening URL: {result.error}
                  </Alert>
                ) : (
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Short URL Created
                      </Typography>
                      
                      <Typography variant="body1" gutterBottom>
                        <strong>Original URL:</strong> {result.longUrl}
                      </Typography>
                      
                      <Typography variant="body1" gutterBottom>
                        <strong>Short URL:</strong>{' '}
                        <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
                          {result.shortUrl}
                        </a>
                      </Typography>
                      
                      <Typography variant="body2" color="textSecondary">
                        <strong>Expires:</strong> {new Date(result.expires).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UrlShortener;