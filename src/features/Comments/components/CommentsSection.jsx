import React, { useState } from 'react';
import CommentsModal from './CommentsModal';

const CommentsSection = ({ post, currentUser, token, onCommentCountChange }) => {
    const [showModal, setShowModal] = useState(false);
    const [commentCount, setCommentCount] = useState(
        Array.isArray(post.comments) ? post.comments.length : (post.comments || 0)
    );

    const handleCommentClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCommentCountChange = (count) => {
        setCommentCount(count);
        onCommentCountChange && onCommentCountChange(count);
    };

    return (
        <>
            <div className="flex items-center py-2">
                <button
                    onClick={handleCommentClick}
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm font-semibold"
                >
                    💬 Comment ({commentCount})
                </button>
            </div>

            <CommentsModal
                post={post}
                currentUser={currentUser}
                token={token}
                isOpen={showModal}
                onClose={handleCloseModal}
                onCommentCountChange={handleCommentCountChange}
            />
        </>
    );
};

export default CommentsSection;
