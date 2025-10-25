import React from 'react';
import PendingPosts from './PendingPosts'; 
// Assuming PendingPosts.jsx is in the same directory: src/features/Admin/
import { useAuth } from '../Auth/useAuth'; 
// Assuming useAuth is in: src/features/Auth/useAuth.js
import AuthLayout from '../../components/layouts/AuthLayout'; 
// Use your specific layout component

const AdminReviewPage = () => {
    const { isAdmin, isLoading, user } = useAuth();
    
    // 1. Loading State
    if (isLoading) {
        // You can use your AutoRickshawLoader here if desired
        return <div className="text-center p-10 text-lg text-indigo-600">Loading user permissions...</div>;
    }

    // 2. Authorization Check
    // If the user is not an admin or not logged in, show an access denied message.
    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-10 bg-white shadow-xl rounded-lg max-w-lg">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">403 Forbidden</h1>
                    <p className="text-gray-700">You do not have the required permissions to access the Admin Review Queue.</p>
                </div>
            </div>
        );
    }

    // 3. Render Admin Content (Layout + PendingPosts)
    return (
        // Wrap the content with your main application layout
        <AuthLayout> 
            <div className="admin-review-page p-4 sm:p-8">
                {/* The core component responsible for fetching and displaying the queue */}
                <PendingPosts /> 
            </div>
        </AuthLayout>
    );
};

export default AdminReviewPage;