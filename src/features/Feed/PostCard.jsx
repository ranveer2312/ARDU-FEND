import React, { useState } from 'react';
import { useAuth } from '../Auth/useAuth';
import { addComment } from '../../services/postService';
import { likePost, unlikePost } from '../Auth/services/reactionService';

const PostCard = ({ post, currentUser, onPostUpdate }) => {
    const { token } = useAuth();
    const [userReaction, setUserReaction] = useState(post.userReaction || null);
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [commentCount, setCommentCount] = useState(
        Array.isArray(post.comments) ? post.comments.length : (post.comments || 0)
    );
    const [shareCount, setShareCount] = useState(post.shares || 0);
    const [showComments, setShowComments] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    const reactions = [
        { type: 'like', emoji: '👍', label: 'Like' },
        { type: 'love', emoji: '❤️', label: 'Love' },
        { type: 'haha', emoji: '😂', label: 'Haha' },
        { type: 'wow', emoji: '😮', label: 'Wow' },
        { type: 'sad', emoji: '😢', label: 'Sad' },
        { type: 'angry', emoji: '😡', label: 'Angry' }
    ];

    const contentUrl = post.imageUrl || post.contentUrl || post.videoUrl;

    const formatDate = (date) => {
        try {
            const now = new Date();
            const d = new Date(date);
            if (isNaN(d.getTime())) return 'Recently';
            const diff = Math.floor((now - d) / 1000);
            if (diff < 60) return 'Just now';
            if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
            if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
            return d.toLocaleDateString();
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Recently';
        }
    };





    const handleComment = async () => {
        if (!newComment.trim()) return;
        setIsSubmitting(true);
        try {
            await addComment(post.id, currentUser?.username || currentUser?.name, newComment, token);
            setCommentCount((v) => v + 1);
            setNewComment('');

            onPostUpdate(post.id, { userCommented: true, comments: commentCount + 1 });
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleComments = () => {

        setShowComments(!showComments);
    };

    const handleReaction = async (reactionType) => {
        if (isLiking || !currentUser?.name) return;
        setIsLiking(true);
        setShowReactions(false);
        try {
            if (userReaction === reactionType) {
                await unlikePost(post.id, currentUser.name, reactionType);
                setUserReaction(null);
                setLikeCount((v) => v - 1);
                onPostUpdate(post.id, { userReaction: null, likes: likeCount - 1 });
            } else {
                await likePost(post.id, currentUser.name, reactionType);
                const wasReacted = userReaction !== null;
                setUserReaction(reactionType);
                setLikeCount((v) => wasReacted ? v : v + 1);
                onPostUpdate(post.id, { userReaction: reactionType, likes: wasReacted ? likeCount : likeCount + 1 });
            }
        } catch (error) {
            console.error('Reaction failed:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleShare = async () => {
        try {
            setShareCount((v) => v + 1);
            onPostUpdate(post.id, { userShared: true, shares: shareCount + 1 });
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(window.location.href);
                alert('Post link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing post:', error);
        }
    };

    const renderMedia = () => {
        if (!contentUrl) return null;

        // simple video detection by extension or contentUrl include
        const isVideo = /\.(mp4|webm|ogg)(\?.*)?$/.test(contentUrl) || contentUrl.includes('video') || contentUrl.includes('mp4');

        if (isVideo) {
            return (
                <div className="relative w-full" style={{ maxHeight: '600px' }}>
                    <video
                        src={contentUrl}
                        controls
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-auto max-h-[600px] object-cover"
                    />
                </div>
            );
        }

        return (
            <div className="relative w-full">
                <img
                    src={contentUrl}
                    alt={post.content || 'post media'}
                    className="w-full h-auto max-h-[600px] object-cover"
                />
            </div>
        );
    };



    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-lg mx-auto">
            <div className="p-4 pb-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {(post.userName || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{post.userName || 'Unknown User'}</div>
                    <div className="text-xs text-gray-500">{formatDate(post.createdAt)}</div>
                </div>
            </div>

            <div className="px-4 pb-3 text-gray-900 whitespace-pre-wrap">{String(post.content || post.caption || '')}</div>

            <div className="px-4 pb-3">
                {renderMedia()}
            </div>

            <div className="px-4 py-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="relative">
                        <button 
                            onClick={() => handleReaction('like')}
                            onMouseEnter={() => setShowReactions(true)}
                            onMouseLeave={() => setTimeout(() => setShowReactions(false), 300)}
                            disabled={isLiking}
                            className={`flex items-center gap-1 text-sm px-3 py-2 rounded-lg ${
                                userReaction ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                            }`}
                        >
                            {reactions.find(r => r.type === userReaction)?.emoji || '👍'}
                            {reactions.find(r => r.type === userReaction)?.label || 'Like'}
                            {likeCount > 0 ? ` (${likeCount})` : ''}
                        </button>

                        {showReactions && (
                            <div 
                                className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border p-2 flex gap-1 z-10"
                                onMouseEnter={() => setShowReactions(true)}
                                onMouseLeave={() => setShowReactions(false)}
                            >
                                {reactions.map((reaction) => (
                                    <button
                                        key={reaction.type}
                                        onClick={() => handleReaction(reaction.type)}
                                        className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-lg transition-transform hover:scale-125"
                                        title={reaction.label}
                                    >
                                        {reaction.emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex gap-4">
                        <button
                            onClick={toggleComments}
                            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm"
                        >
                            💬 Comment ({commentCount})
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm"
                        >
                            📤 Share
                        </button>
                    </div>
                </div>
            </div>

            {showComments && (
                <div className="border-t border-gray-100 bg-gray-50 p-4">
                    <div className="flex gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleComment(); } }}
                            />
                            <button 
                                onClick={handleComment} 
                                disabled={!newComment.trim() || isSubmitting} 
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg disabled:opacity-50 hover:bg-blue-700"
                            >
                                {isSubmitting ? '...' : 'Post'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="text-center py-4 text-gray-600">
                        Comments are saved to database. Display feature coming soon!
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;