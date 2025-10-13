// --- Post Service API ---
// src/core/services/postService.js
// Centralizes all post-related API logic for frontend features.

import { BASE_URL } from '../config/api';

const API_BASE = `${BASE_URL}/api/posts`;
const PUBLIC_API_BASE = `${BASE_URL}/api/public/posts`;

// 🧩 Utility for consistent fetch with error handling
async function fetchApi(url, options = {}) {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorBody = await response.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch {
                    return { message: text || 'Unknown error' };
                }
            });
            throw new Error(errorBody.message || `HTTP error! Status: ${response.status}`);
        }

        if (response.status === 204 || response.headers.get('content-length') === '0') return null;
        return response.json();

    } catch (error) {
        console.error('API fetch failed:', error);
        throw error;
    }
}

// =====================
// 🟢 PUBLIC ENDPOINTS
// =====================

// Public: Get all visible/approved posts (community feed)
export async function getPublicPosts() {
    return fetchApi(`${PUBLIC_API_BASE}`);
}

// Public: Get comments for a post
export async function getPublicComments(postId, page = 0, size = 10) {
    return fetchApi(`${PUBLIC_API_BASE}/${postId}/comments?page=${page}&size=${size}`);
}

// Public: Get reactions for a post
export async function getPublicReactions(postId, page = 0, size = 10) {
    return fetchApi(`${PUBLIC_API_BASE}/${postId}/reactions?page=${page}&size=${size}`);
}

// =====================
// 🔒 AUTHENTICATED ENDPOINTS
// =====================

// Get all posts for current user
export async function getMyPosts(userId, token) {
    return fetchApi(`${API_BASE}/my/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

// Admin: Get all pending posts
export async function getPendingPosts(token) {
    return fetchApi(`${API_BASE}/pending`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

// Admin: Approve a post
export async function approvePost(postId, token) {
    return fetchApi(`${API_BASE}/${postId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
    });
}

// Admin: Reject or delete a post
export async function rejectPost(postId, token) {
    return fetchApi(`${API_BASE}/${postId}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
    });
}

// User: Create new post (requires token)
export async function createPost(postData, token) {
    return fetchApi(`${API_BASE}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
    });
}

// Get single post by ID (public if approved, private if user/admin)
export async function getPostById(postId, token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return fetchApi(`${API_BASE}/${postId}`, { headers });
}

// Delete post (user or admin)
export async function deletePost(postId, token) {
    return fetchApi(`${API_BASE}/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
}
