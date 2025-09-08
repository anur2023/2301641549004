import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, CircularProgress, Alert, Button, Box } from '@mui/material';
import { getShortUrl, recordClick } from '../utils/storage';
import loggingMiddleware from '../services/loggingMiddleware';

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [urlData, setUrlData] = useState(null);

  useEffect(() => {
    const handleRedirect = () => {
      try {
        setLoading(true);
        loggingMiddleware.info('Handling redirect', { shortcode });
        
        const data = getShortUrl(shortcode);
        
        if (!data) {
          setError('Short URL not found');
          loggingMiddleware.warn('Short URL not found', { shortcode });
          return;
        }
        
        // Check if URL is expired
        if (new Date(data.expires) < new Date()) {
          setError('This short URL has expired');
          loggingMiddleware.warn('Short URL expired', { shortcode });
          return;
        }
        
        setUrlData(data);
        
        // Record the click
        recordClick(shortcode, 'direct', 'Unknown');
        
        // Redirect to the original URL
        loggingMiddleware.info('Redirecting to original URL', { 
          shortcode, 
          longUrl: data.longUrl 
        });
        
        window.location.href = data.longUrl;
      } catch (error) {
        setError('Failed to process redirect');
        loggingMiddleware.error('Redirect failed', { error, shortcode });
      } finally {
        setLoading(false);
      }
    };

    handleRedirect();
  }, [shortcode, navigate]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Redirecting...</Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" onClick={() => navigate('/')}>
              Create New URL
            </Button>
            <Button variant="outlined" onClick={() => navigate('/statistics')}>
              View Statistics
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Redirecting to:
        </Typography>
        <Typography variant="body1" sx={{ wordBreak: 'break-all', mb: 2 }}>
          {urlData?.longUrl}
        </Typography>
        <CircularProgress />
      </Paper>
    </Container>
  );
};

export default RedirectHandler;