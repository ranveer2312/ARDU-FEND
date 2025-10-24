import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../features/Auth/AuthContext';

const PendingPosts = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // Track which post is being processed

    const fetchPendingPosts = useCallback(async () => {
        try {
            console.log('Fetching posts with token:', token?.slice(0, 20));
            
            const response = await fetch('http://localhost:8080/api/posts/pending', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('Fetched posts:', data); // Debug log
            setPosts(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to load posts');
        } finally {
            setLoading(false);
        }
    }, [token]); // Add token as dependency

    const handlePostAction = async (postId, action) => {
        setActionLoading(postId);
        try {
            // Use the correct endpoint that matches your backend controller
            const endpoint = `http://localhost:8080/api/posts/${postId}/${action}`;

            console.log('Making request:', {
                url: endpoint,
                action,
                postId,
                token: token?.slice(0, 20) + '...'
            });

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to ${action} post: ${errorText || response.statusText}`);
            }

            // Remove the post from the list after successful action
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
            
            // Show success message
            setError(null);
            
        } catch (err) {
            console.error(`Error ${action}ing post:`, err);
            setError(`Failed to ${action} post. Please try again.`);
        } finally {
            setActionLoading(null);
        }
    };

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchPendingPosts();
        }
    }, [isAuthenticated, token, fetchPendingPosts]); // Added fetchPendingPosts to dependencies

    if (loading) {
        return <div className="p-4">Loading posts...</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-[470px]">
            <h1 className="text-2xl font-bold mb-4">Pending Posts</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                {posts.map(post => (
                    <div key={post.id} className="border rounded-lg bg-white shadow">
                        <div className="flex items-center p-3 border-b">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                {post.user?.name?.[0]}
                            </div>
                            <span className="ml-2 font-semibold">{post.user?.name}</span>
                        </div>

                        {post.contentUrl && (
                            <div className="relative w-full">
                                {post.contentUrl.includes('video') ? (
                                    <div className="w-full" style={{ maxHeight: '587px' }}>
                                        <video 
                                            src={post.contentUrl} 
                                            controls 
                                            className="w-full h-full object-contain"
                                            style={{ maxHeight: '587px' }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full" style={{ maxHeight: '587px' }}>
                                        <img 
                                            src={post.contentUrl} 
                                            alt="Post content" 
                                            className="w-full h-auto object-contain"
                                            style={{ maxHeight: '587px' }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="p-3 border-t">
                            <div className="text-xs text-gray-500 mb-2">
                                {new Date(post.createdAt).toLocaleString()}
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handlePostAction(post.id, 'approve')}
                                    disabled={actionLoading === post.id}
                                    className={`flex-1 px-4 py-2 rounded-full transition
                                        ${actionLoading === post.id 
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-500 hover:bg-green-600'} 
                                        text-white`}
                                >
                                    {actionLoading === post.id ? 'Processing...' : 'Approve'}
                                </button>
                                <button 
                                    onClick={() => handlePostAction(post.id, 'reject')}
                                    disabled={actionLoading === post.id}
                                    className={`flex-1 px-4 py-2 rounded-full transition
                                        ${actionLoading === post.id 
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-red-500 hover:bg-red-600'} 
                                        text-white`}
                                >
                                    {actionLoading === post.id ? 'Processing...' : 'Reject'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingPosts;