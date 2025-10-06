// src/features/Auth/services/authService.js

import axios from 'axios';
// This path is correct for the exact path: src/core/config/api.js
import { BASE_URL, API_ENDPOINTS } from '../../../core/config/api'; 

// 🎯 FIX: This line MUST be present to define 'api'
const api = axios.create({
    baseURL: BASE_URL,
});

/**
 * Handles the user registration API call.
 * @param {object} userData - The user registration data.
 * @returns {Promise<object>} The response data upon successful registration.
 */
export const registerUser = async (userData) => {
    try {
        // 'api' is used here
        const response = await api.post(API_ENDPOINTS.REGISTER, userData); 
        return response.data;
    } catch (error) {
        // Log the error for debugging
        console.error('Registration failed:', error.response?.data || error.message);
        // Throw an error with a message we can display to the user
        throw new Error(error.response?.data?.message || 'Registration failed due to a server error.');
    }
};