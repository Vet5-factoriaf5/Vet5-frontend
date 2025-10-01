// src/context/AuthContext.js

import React, { createContext, useState, useContext } from "react";

/**
 * --- AUTHENTICATION CONTEXT ---
 * 
 * This is the central piece for managing the user's login state & role throughout the App.
 * It uses "React's Context API" to provide global access to AUTHENTICATION STATUS (is logged in?)
 * and AUTHORIZATION STATUS (What is the user's role: ADMIN or USER?).
 * 
 * It acts as a "SINGLE SOURCE OF TRUTH" for user data & is essential for implementing
 * Role-Based Access Control (RBAC) on the Frontend.
 *
 * @author gml
 * @version 1.0
 */
const AuthContext = createContext(null);

/**
 * **AuthProvider Component**
 * 
 * This component wraps the entire application (or the part that needs authentication)
 * and holds the authentication state and logic. It makes the user data and functions
 * available to all child components.
 */
export const AuthProvider = ({ children }) => {
  // 1. STATE INITIALIZATION
  // Initialize the 'user' state by checking if user data is already saved in the browser's SESSION STORAGE.
  // This allows the user to stay logged in even after a page refresh.
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    try {
      // If data exists, parse the JSON string back into a JavaScript object.
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      // Handle cases where the stored data might be corrupted.
      console.error("Failed to parse user from sessionStorage", error);
      return null;
    }
  });

  // State to track if an asynchronous operation (like login) is in progress.
  // This helps in showing loading spinners to the user.
  const [isLoading, setIsLoading] = useState(false);


  // 2. CORE AUTHENTICATION FUNCTIONS

  /**
   * **Login function**
   *  
   * Called by the LoginPage component after a successful API login.
   * It processes the user data from the backend to determine the user's primary role.
   *
   * @param {Object} userData - The user data object received from the backend,
   * expected to include the `roles` string (e.g., "ROLE_ADMIN,ROLE_USER").
   */
  const login = (userData) => {
    // Create a new user object that includes the extracted and simplified role (e.g., "ADMIN" or "USER").
    const userWithRole = {
      ...userData,
      // Extract role from roles string (e.g., "ROLE_ADMIN" -> "ADMIN")
      // Use the helper function to simplify the role string.
      role: extractRoleFromResponse(userData.roles),
    };

    // Save the complete user object to the browser's session storage.
    // We use JSON.stringify() because sessionStorage can only store strings.
    sessionStorage.setItem("user", JSON.stringify(userWithRole));
    // Update the React state to immediately reflect the logged-in status.
    setUser(userWithRole);
  };

  /**
   * **Logout function**
   * 
   * Clears the user data from both the state and the session storage, effectively logging the user out.
   */
  const logout = () => {
    // Remove the user key from the browser's session storage.
    sessionStorage.removeItem("user");
    // Clear the user state in the application.
    setUser(null);
  };


  // 3. ROLE MANAGEMENT FUNCTIONS (Authorization Helpers)

  /**
   * **Helper function**
   * 
   * It simplifies the potentially complex role string from the backend.
   * It prioritizes the highest privilege role if multiple are present.
   *
   * @param {string} roles - Roles string from backend (e.g., "ROLE_ADMIN, ROLE_USER")
   * @returns {string} - Primary simplified role ("ADMIN" or "USER")
   */
  const extractRoleFromResponse = (roles) => {
    // Default to standard USER if no roles are found.
    if (!roles) return "USER";

    // Split the comma-separated string into an array and clean up spaces.
    const roleArray = roles.split(",").map((role) => role.trim());

    // Check for the highest-privilege role first (Admin access is higher).
    if (roleArray.includes("ROLE_ADMIN")) return "ADMIN";
    if (roleArray.includes("ROLE_USER")) return "USER";

    return "USER"; // Default fallback
  };

  /**
   * Checks if the currently logged-in user has admin privileges.
   * This is used by components to show or hide administration features.
   *
   * @returns {boolean} - True if the user's role is "ADMIN".
   */
  const isAdmin = () => {
    // Optional chaining (?.) ensures this doesn't crash if 'user' is null (logged out).
    // TODO: Read more about "optional chaining (?.)"
    return user?.role === "ADMIN";
  };

  /**
   * Checks if the currently logged-in user has regular user (client) privileges.
   *
   * @returns {boolean} - True if the user's role is "USER".
   */
  const isUser = () => {
    return user?.role === "USER";
  };

  // 4. CONTEXT VALUE EXPORT
  // This object contains all the state and functions we want to share with the rest of the app.
  const value = {
    user, // The current user object (or null if logged out)
    login, // Function to log in and set user state
    logout, // Function to log out and clear user state
    isAdmin, // Function to check if the user is an admin
    isUser, // Function to check if the user is a regular user
    isLoading, // State to show loading spinners
    setIsLoading, // Function to set the loading state
  };

  // The provider component wraps the children and makes the 'value' accessible via context.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook: `useAuth()`
 * 
 * This is the standard, cleaner way for Components to access the authentication
 * data and functions (like user, login, logout, isAdmin) from the context.
 * 
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
