React URL Shortener Web App
Overview
This project is a React URL Shortener Web Application designed to provide core URL shortening functionality with analytics and client-side management. The app is built as a fully functional, responsive, and production-ready frontend application meeting robust error handling, high code quality, and UI efficiency standards.

Key features:

Shorten up to 5 URLs at once with optional custom shortcodes and validity periods.

Unique short link generation with client-side management.

Display shortened URLs with expiry dates and analytics.

Click tracking with timestamps, sources, and coarse-grained geographical data.

Comprehensive client-side validation and error handling.

Client-side routing for redirection to original URLs.

Styling using Material UI framework exclusively.

Runs locally at http://localhost:3000.

Extensive mandatory logging middleware integration.

Installation & Setup
Prerequisites
Node.js (>= 16.x recommended)

npm (comes with Node.js) or yarn

Getting Started
Clone the repository:

git clone https://github.com/anur2023/2301641549004/

src/
 ├── components/          # Reusable UI components & pages
 │    ├── UrlShortener.js # Main URL shortener page
 │    ├── StatsPage.js    # URL statistics & analytics page
 │    └── RedirectHandler.js # Handles client-side URL redirection
 ├── hooks/               # Custom React hooks (e.g., logging middleware)
 ├── utils/               # Utility functions (validation, URL generation)
 ├── App.js               # Main app component with routing logic
 ├── index.js             # React DOM rendering
 └── styles/              # Custom CSS if needed with Material UI overrides


Features
URL Shortener Page
Input fields for up to 5 URLs concurrently.

Optional fields for custom shortcode and validity in minutes.

Validates URLs, shortcode format, and input constraints before submission.

On success, displays the shortened URLs with expiry timestamps.

Logs relevant actions using custom logging middleware.

URL Statistics Page
Lists all shortened URLs created in current or persisted session.

Displays each short URL’s create and expiry dates.

Shows total click count and detailed click data with:

Click timestamps

Click sources

Approximate click locations

Redirection Handling
Routes client-side shortened URL paths to the original long URLs.

Performs redirection within the React app using React Router.

Error Handling
Client-side validation for URLs and shortcodes.

User-friendly messages for invalid URLs, shortcode collisions, or operational errors.

Styling & UX
Uses Material UI components and theming exclusively.

Clean, uncluttered UI focusing on usability and highlighting key elements.

Running the Application
App assumes pre-authorized API access (no authentication UI).

Run the app locally on http://localhost:3000.

All data persists on the client-side; no server dependency required.

Logging middleware captures all user interactions and errors.

Notes & Assumptions
No backend server is required; URL shortening, storage, and analytics are handled fully on the client.

Automatically generates unique shortcodes if none is provided.

Shortened URLs expire after a default of 30 minutes if validity is not specified.

The app uses React Router for routing and redirect behavior.

Logging middleware is integrated extensively to replace all console logs.

