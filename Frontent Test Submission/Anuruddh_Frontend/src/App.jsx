import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import UrlShortener from './components/UrlShortener';
import Statistics from './components/Statistics';
import Navigation from './components/Navigation';
import RedirectHandler from './components/RedirectHandler';
import loggingMiddleware from './services/loggingMiddleware';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  // Initialize logging
  React.useEffect(() => {
    loggingMiddleware.info('App initialized');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<UrlShortener />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/:shortcode" element={<RedirectHandler />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;