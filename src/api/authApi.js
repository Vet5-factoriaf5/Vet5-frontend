// src/api/authApi.js

import api from './axiosConfig';

/**
 * Centralized Authentication API Service (Business Logic / Centralization).
 * 
 * This module exports functions for all authentication-related endpoints.
 * It uses the pre-configured `api` instance from `axiosConfig.js`.
 * 
 * This file exports functions (e.g., `login(user, password)`, `register(data)`)
 * that handle endpoint-specific logic like constructing URLs, building headers
 * (like Basic Auth), handling request bodies, and dealing with success/error
 * responses before the data reaches the component.
 * 
 */

// --- LOGIN (GET /login - Basic Auth) ---
export const login = async (username, password) => {
    // 1. Logic to construct the Basic Auth Header Value
    // Format: "username:password" encoded in Base64
    const credentialsBase64 = btoa(`${username}:${password}`);

    // 2. Making the Request using the configured `api` instance.
    // The `baseURL` ('http://localhost:8080/api/v1') is automatically prepended.
    const response = await api.get('/login', {
        headers: {
            // Set the Authoriazation header dynamically for Basic Auth
            'Authorization': `Basic ${credentialsBase64}`,
        },
    });

    // Return the response data (UserDTOResponse)
    return response.data;
};

// --- REGISTRATION (POST /register) ---
/**
 * @param {object} userData - Contains `fullName`, `username`, `email`, `phone`, `password`, and `confirmPassword`.
 */
export const register = async (userData) => {
    // Making the POST Request using the configured `api` instance:
    const response = await api.post('/register', userData);

    // Return the response data (UserDTOResponse)
    return response.data;
};

// TODO: You should add more functions here (e.g., `logout`, `password reset`, etc.)