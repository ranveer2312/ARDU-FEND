// src/core/config/api.js
import axios from 'axios'; 

export const BASE_URL = 'http://localhost:8080'; // Replace with your actual base URL
export const API_ENDPOINTS = {
    REGISTER: '/api/users/register',
    // ... other endpoints
};

export default BASE_URL;