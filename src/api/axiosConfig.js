import axios from 'axios';

/**
 * Axios Configuration
 * This file creates and exports a pre-configured Axios instance.
 * All API calls should use this 'api' instance instead of the global 'axios'.
 * This centralizes configuration like the base URL and session handling.
 * 
 * This file should only create & export the "base Axios instance (api)".
 * It sets global rules like the `baseURL`, `withCredentials`, 
 * and default `headers`.
 */

// Define the base URL for the backend API.
// Based on my successful login endpoint: http://localhost:8080/api/v1/login
// The base URL should be the part before the specific endpoint (/login).
const BASE_URL = 'http://localhost:8080/api/v1'; 

// Create the custom Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  
  // CRITICAL for Spring Security Basic Auth / Sessions
  // This tells the browser to include cookies (like JSESSIONID) and authentication headers
  // when making cross-origin requests.
  withCredentials: true, 
  
  headers: {
    // We are currently using Basic Auth for login, which requires the Authorization header
    // to be set on a per-request basis in the component, but we can set defaults here.
    'Content-Type': 'application/json',
  },
});

export default api;
