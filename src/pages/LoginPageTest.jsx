// src/components/LoginPageTest.jsx (Updated)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { login } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

/**
 * Enhanced Login Form Component with Role-Based Redirection
 * Authenticates users and redirects to appropriate dashboard based on role
 *
 * @author gml
 * @version 2.0
 */
function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Authenticate with backend
      const userData = await login(username, password);

      // Store user data in context (which handles role extraction)
      authLogin(userData);

      // Determine redirect path based on role
      const redirectPath = userData.roles.includes("ROLE_ADMIN")
        ? "/admin/dashboard"
        : "/user/dashboard";

      setMessage(`Login successful! Redirecting to your dashboard...`);

      // Redirect after short delay to show success message
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1500);
    } catch (error) {
      // Error handling: it remains the same
      if (error.response) {
        if (error.response.status === 401) {
          setMessage(
            "Login failed: Invalid username or password (401 Unauthorized)."
          );
        } else {
          const errorMessage =
            error.response.data?.message || error.response.statusText;
          setMessage(
            `Login failed with status ${error.response.status}: ${errorMessage}`
          );
        }
      } else if (error.request) {
        setMessage(
          `An error occurred: No response received. Check if the backend is running and accessible.`
        );
      } else {
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
          Veterinary Clinic Login
        </h2>

        {/* Status Message Display */}
        {message && (
          <p
            className={`p-3 mb-4 rounded-lg text-sm ${
              message.includes("successful")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Form fields remain the same */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
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
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-500 text-sm"
          >
            ← Back to Home
          </Link>
        </div>

        <p className="mt-6 text-xs text-center text-gray-500">
          Test credentials: daisy/password (Admin) or donald/password (Client)
        </p>
      </div>
    </div>
  );
}

export default LoginPage;