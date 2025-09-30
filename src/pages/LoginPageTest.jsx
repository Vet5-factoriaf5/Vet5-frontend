import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
// MODIFIED: Import the centralized login function
import { login } from '../api/authApi'; 

/**
 * Basic Login Form Component
 * Now uses the centralized 'login' function from authApi.js.
 */
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle the login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      // 2. Making the Request using the centralized login function
      // This is much cleaner and separates concerns.
      const data = await login(username, password);

      // 3. Handling the Successful Response
      setMessage(`Login successful! Welcome, ${data.username || username}.`);
      console.log('Authentication successful. Response data:', data);

      // Reset the Form fields after successful submission for a clean slate.
      setUsername('');
      setPassword('');

    } catch (error) {
      // 4. Handling Errors (Error logic remains in UI for specific display messages)
      if (error.response) {
        // The request was made and the server responded with a status code outside 2xx
        if (error.response.status === 401) {
          setMessage('Login failed: Invalid username or password (401 Unauthorized).');
        } else {
          // General server error
          const errorMessage = error.response.data?.message || error.response.statusText;
          setMessage(`Login failed with status ${error.response.status}: ${errorMessage}`);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., server offline)
        setMessage(`An error occurred: No response received. Check if the backend is running and accessible.`);
      } else {
        // Something happened in setting up the request that triggered an Error
        setMessage(`An unknown client error occurred: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Backend Login Test (Axios Configured)
        </h2>

        {/* Status Message Display */}
        {message && (
          <p className={`p-3 mb-4 rounded-lg text-sm ${
            message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-150 ease-in-out ${
                isLoading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Log In (GET/Basic Auth)'}
            </button>
          </div>
        </form>
        <Link to="/">
          <button>Go Home</button>
        </Link>
        <p className="mt-6 text-xs text-center text-gray-500">
          Request URL: <code className="bg-gray-200 p-1 rounded text-indigo-600 break-all">http://localhost:8080/api/v1/login</code>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;