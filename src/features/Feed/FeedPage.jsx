import React, { useState, useEffect } from 'react';
// Adjust the path based on where you place this component relative to postService.js
import { getPublicPosts } from '../../core/services/postService'; 
// Correct import: PostCard is in the same folder
import PostCard from './PostCard'; 
// Import MainNav layout
import { MainNav } from '../../components/layouts/MainNav';

/**
 * The main component for displaying the community post feed.
 * It fetches all public, approved posts from the backend.
 */
const FeedPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Use the public endpoint function from postService
                const data = await getPublicPosts();
                
                if (Array.isArray(data)) {
                    setPosts(data);
                } else {
                    // Handle case where API returns a single object or unexpected non-array data
                    setPosts([]); 
                    console.error("API response was not an array:", data);
                }

            } catch (err) {
                // Catches the error thrown by fetchApi inside postService.js (e.g., Network, 403, 500)
                console.error("Failed to fetch public posts:", err.message);
                setError(err.message || "Could not load posts. Check network connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []); // Empty dependency array ensures this runs only once on mount

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 md:pl-16 lg:pl-20 pb-16">
                <MainNav />
                <div className="flex justify-center items-center h-[calc(100vh-3.5rem)] text-lg">
                    Loading feed...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 md:pl-16 lg:pl-20 pb-16">
                <MainNav />
                <div className="p-4 m-4 text-center text-red-600 bg-red-100 border border-red-400 rounded-md">
                    Error loading feed: {error}
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 md:pl-16 lg:pl-20 pb-16">
                <MainNav />
                <div className="p-4 text-center text-gray-500">No posts available in the feed.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 md:pl-16 lg:pl-20 pb-16">
            <MainNav />
            <div className="feed-container max-w-xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-6">Community Feed</h1>
                {/* Map over the fetched posts and render a PostCard for each */}
                <div className="space-y-6">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeedPost;