import React, { useState, useEffect, useRef } from 'react';
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
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const shareRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareRef.current && !shareRef.current.contains(event.target)) {
                setShowShareOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        console.log('Clicked reaction:', reactionType);
        console.log('Current userReaction:', userReaction);
        
        if (isLiking || !currentUser?.name) return;
        setIsLiking(true);
        setShowReactions(false);
        
        try {
            if (userReaction === reactionType) {
                console.log('Removing reaction');
                setUserReaction(null);
                setLikeCount((v) => v - 1);
                await unlikePost(post.id, currentUser.name, reactionType);
                onPostUpdate(post.id, { userReaction: null, likes: likeCount - 1 });
            } else {
                console.log('Adding reaction:', reactionType);
                const wasReacted = userReaction !== null;
                setUserReaction(reactionType);
                console.log('Updated userReaction to:', reactionType);
                setLikeCount((v) => wasReacted ? v : v + 1);
                await likePost(post.id, currentUser.name, reactionType);
                onPostUpdate(post.id, { userReaction: reactionType, likes: wasReacted ? likeCount : likeCount + 1 });
            }
        } catch (error) {
            console.error('Reaction failed:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const shareOptions = [
        { 
            name: 'WhatsApp', 
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>,
            color: 'text-green-500', 
            action: (url) => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`) 
        },
        { 
            name: 'Instagram', 
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
            color: 'text-pink-500', 
            action: (url) => { navigator.clipboard.writeText(url); alert('Link copied for Instagram!'); } 
        },
        { 
            name: 'LinkedIn', 
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
            color: 'text-blue-600', 
            action: (url) => window.open(`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`) 
        },
        { 
            name: 'Twitter', 
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>,
            color: 'text-blue-400', 
            action: (url) => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`) 
        },
        { 
            name: 'Facebook', 
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
            color: 'text-blue-600', 
            action: (url) => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`) 
        },
        { 
            name: 'Copy Link', 
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>,
            color: 'text-gray-600', 
            action: (url) => { navigator.clipboard.writeText(url); alert('Link copied!'); } 
        }
    ];

    const handleShare = (platform = null) => {
        if (platform) {
            const shareUrl = contentUrl || `${window.location.origin}/post/${post.id}`;
            platform.action(shareUrl);
            setShareCount((v) => v + 1);
            onPostUpdate(post.id, { userShared: true, shares: shareCount + 1 });
        } else {
            setShowShareOptions(!showShareOptions);
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
                            onClick={() => {
                                console.log('MAIN BUTTON CLICKED!');
                                handleReaction('like');
                            }}
                            onMouseEnter={() => {
                                console.log('HOVER STARTED!');
                                setShowReactions(true);
                            }}
                            onMouseLeave={() => {
                                console.log('HOVER ENDED!');
                                setTimeout(() => setShowReactions(false), 300);
                            }}
                            disabled={isLiking}
                            className={`flex items-center gap-1 text-sm px-3 py-2 rounded-lg ${
                                userReaction ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                            }`}
                        >
                            {userReaction === 'like' ? '👍' : 
                             userReaction === 'love' ? '❤️' : 
                             userReaction === 'haha' ? '😂' : 
                             userReaction === 'wow' ? '😮' : 
                             userReaction === 'sad' ? '😢' : 
                             userReaction === 'angry' ? '😡' : '👍'}
                            {userReaction === 'like' ? 'Like' : 
                             userReaction === 'love' ? 'Love' : 
                             userReaction === 'haha' ? 'Haha' : 
                             userReaction === 'wow' ? 'Wow' : 
                             userReaction === 'sad' ? 'Sad' : 
                             userReaction === 'angry' ? 'Angry' : 'Like'}
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
                                        onClick={() => {
                                            console.log('EMOJI CLICKED:', reaction.type, reaction.emoji);
                                            handleReaction(reaction.type);
                                        }}
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
                        <div className="relative" ref={shareRef}>
                            <button
                                onClick={() => handleShare()}
                                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm px-3 py-2 rounded-lg hover:bg-gray-100"
                            >
                                📤 Share
                            </button>

                            {showShareOptions && (
                                <>
                                    {/* Mobile Bottom Sheet */}
                                    <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowShareOptions(false)}>
                                        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 transform transition-transform duration-300 ease-out">
                                            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Share</h3>
                                            
                                            <div className="grid grid-cols-3 gap-4 mb-6">
                                                {shareOptions.map((option) => (
                                                    <button
                                                        key={option.name}
                                                        onClick={() => {
                                                            handleShare(option);
                                                            setShowShareOptions(false);
                                                        }}
                                                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                                    >
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${option.color} bg-gray-100`}>
                                                            {option.icon}
                                                        </div>
                                                        <span className="text-xs text-gray-700 text-center">{option.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            <button 
                                                onClick={() => setShowShareOptions(false)}
                                                className="w-full py-3 text-center text-gray-600 border-t border-gray-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Desktop Dropdown */}
                                    <div className="hidden md:block absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border p-3 min-w-48 z-20">
                                        <div className="text-xs font-semibold text-gray-500 mb-3 px-1">Share to:</div>
                                        
                                        {shareOptions.map((option) => (
                                            <button
                                                key={option.name}
                                                onClick={() => {
                                                    handleShare(option);
                                                    setShowShareOptions(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <span className={option.color}>{option.icon}</span>
                                                <span className="text-gray-700">{option.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
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