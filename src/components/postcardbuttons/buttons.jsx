import React, { useState } from 'react';
import { likePost, unlikePost, addComment, sharePost } from '../../features/Auth/services/reactionService';

const PostCardButtons = ({ 
    postId,
    isLiked,
    likeCount,
    commentCount,
    shareCount,
    onLike,
    onComment,
    onShare,
    currentUser
}) => {
    const [isLiking, setIsLiking] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    const handleLike = async () => {
        if (isLiking || !currentUser?.name) return;
        setIsLiking(true);
        try {
            if (isLiked) {
                await unlikePost(postId, currentUser.name);
            } else {
                await likePost(postId, currentUser.name);
            }
            onLike();
        } finally {
            setIsLiking(false);
        }
    };

    const handleShare = async () => {
        if (isSharing || !currentUser?.name) return;
        setIsSharing(true);
        try {
            await sharePost(postId, currentUser.name);
            onShare();
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="flex items-center justify-between">
            <button onClick={handleLike} disabled={isLiking} className={`px-3 py-2 rounded-lg text-sm ${isLiked ? 'text-red-600 bg-red-50' : 'text-gray-700 hover:bg-gray-100'}`}>
                {isLiked ? 'Liked' : 'Like'} {likeCount > 0 ? `(${likeCount})` : ''}
            </button>

            <button onClick={onComment} className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                Comment {commentCount > 0 ? `(${commentCount})` : ''}
            </button>

            <button onClick={handleShare} disabled={isSharing} className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                Share {shareCount > 0 ? `(${shareCount})` : ''}
            </button>
        </div>
    );
};

export default PostCardButtons;


