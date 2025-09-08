import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { Visibility as ViewIcon } from '@mui/icons-material';
import { getAllShortUrls } from '../utils/storage';
import loggingMiddleware from '../services/loggingMiddleware';

const Statistics = () => {
  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUrls();
  }, []);

  const loadUrls = () => {
    try {
      setLoading(true);
      const data = getAllShortUrls();
      setUrls(data);
      loggingMiddleware.info('Loaded URL statistics', { count: data.length });
    } catch (error) {
      loggingMiddleware.error('Failed to load URL statistics', { error });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (url) => {
    setSelectedUrl(url);
    setDialogOpen(true);
    loggingMiddleware.info('Viewed URL details', { shortcode: url.shortcode });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUrl(null);
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          URL Statistics
        </Typography>
        
        {urls.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ mt: 4 }}>
            No shortened URLs found. Create some URLs on the Shortener page.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell>Clicks</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {urls.map((url) => (
                  <TableRow key={url.id}>
                    <TableCell>
                      <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                        {url.shortUrl}
                      </a>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Box
                        component="div"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {url.longUrl}
                      </Box>
                    </TableCell>
                    <TableCell>{new Date(url.created).toLocaleString()}</TableCell>
                    <TableCell>{new Date(url.expires).toLocaleString()}</TableCell>
                    <TableCell>{url.clicks || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={isExpired(url.expires) ? 'Expired' : 'Active'}
                        color={isExpired(url.expires) ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleViewDetails(url)}
                        size="small"
                      >
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedUrl && (
          <>
            <DialogTitle>URL Details: {selectedUrl.shortcode}</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Original URL:</strong> {selectedUrl.longUrl}
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Short URL:</strong> {selectedUrl.shortUrl}
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Created:</strong> {new Date(selectedUrl.created).toLocaleString()}
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Expires:</strong> {new Date(selectedUrl.expires).toLocaleString()}
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Total Clicks:</strong> {selectedUrl.clicks || 0}
                </Typography>
                
                {selectedUrl.clickData && selectedUrl.clickData.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                      Click Details
                    </Typography>
                    
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>Location</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedUrl.clickData.map((click, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {new Date(click.timestamp).toLocaleString()}
                              </TableCell>
                              <TableCell>{click.source}</TableCell>
                              <TableCell>{click.location}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Statistics;