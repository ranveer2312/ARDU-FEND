import React, { useState } from 'react';
import PostCardButtons from '../../components/postcardbuttons/buttons';

const PostCard = ({ post, currentUser, onPostUpdate }) => {
    const [isLiked, setIsLiked] = useState(post.userLiked || false);
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [commentCount, setCommentCount] = useState(post.comments || 0);
    const [shareCount, setShareCount] = useState(post.shares || 0);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDate = (date) => {
        const now = new Date();
        const d = new Date(date);
        const diff = Math.floor((now - d) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return d.toLocaleDateString();
    };

    const handleLike = () => {
        if (isLiked) {
            setIsLiked(false);
            setLikeCount((v) => v - 1);
            onPostUpdate(post.id, { userLiked: false, likes: likeCount - 1 });
        } else {
            setIsLiked(true);
            setLikeCount((v) => v + 1);
            onPostUpdate(post.id, { userLiked: true, likes: likeCount + 1 });
        }
    };

    const handleComment = async () => {
        if (!newComment.trim()) return;
        setIsSubmitting(true);
        try {
            setCommentCount((v) => v + 1);
            setNewComment('');
            setShowComments(true);
            onPostUpdate(post.id, { userCommented: true, comments: commentCount + 1 });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleShare = async () => {
        setShareCount((v) => v + 1);
        onPostUpdate(post.id, { userShared: true, shares: shareCount + 1 });
        if (navigator.clipboard) {
            try { await navigator.clipboard.writeText(window.location.href); } catch {}
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 pb-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {(post.userName || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{post.userName || 'Unknown User'}</div>
                    <div className="text-xs text-gray-500">{formatDate(post.createdAt)}</div>
                </div>
            </div>

            <div className="px-4 pb-3 text-gray-900 whitespace-pre-wrap">{post.content}</div>

            {(() => {
                const mediaUrl = typeof post.imageUrl === 'string' ? post.imageUrl : '';
                const host = (() => { try { return new URL(mediaUrl).hostname; } catch { return ''; } })();
                const isPlaceholder = /(^|\.)example\.com$/i.test(host);
                const shouldShowImage = mediaUrl && !isPlaceholder;
                if (shouldShowImage) {
                    return (
                        <div className="px-4 pb-3">
                            <img
                                src={mediaUrl}
                                alt="Post"
                                className="w-full h-auto max-h-96 object-cover rounded-lg"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                        </div>
                    );
                }
                if (mediaUrl) {
                    return (
                        <div className="px-4 pb-3">
                            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 text-gray-600 text-sm px-4 py-3">
                                Attachment unavailable (404). {/* optional simple fallback */}
                            </div>
                        </div>
                    );
                }
                return null;
            })()}

            <div className="px-4 py-2 border-t border-gray-100">
                <PostCardButtons
                    postId={post.id}
                    isLiked={isLiked}
                    likeCount={likeCount}
                    commentCount={commentCount}
                    shareCount={shareCount}
                    onLike={handleLike}
                    onComment={() => setShowComments(!showComments)}
                    onShare={handleShare}
                    currentUser={currentUser}
                />
            </div>

            {showComments && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="flex gap-3">
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
                            <button onClick={handleComment} disabled={!newComment.trim() || isSubmitting} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg disabled:opacity-50">
                                {isSubmitting ? '...' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;