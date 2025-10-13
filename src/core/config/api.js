// src/core/config/api.js
import axios from 'axios'; 

export const BASE_URL = 'http://localhost:8080'; // Replace with your actual base URL
export const API_ENDPOINTS = {
    REGISTER: '/api/users/register',
    // ADD THIS NEW LOGIN ENDPOINT
    LOGIN: '/api/auth/login', 
    // If you implemented updateProfile, you should also have its base path here:
    // USER_PROFILE: '/api/users', 
    // ... other endpoints
};

export default BASE_URL;