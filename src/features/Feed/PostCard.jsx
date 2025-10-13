// src/features/Feed/components/PostCard.jsx (Placeholder)

import React from 'react';
import { Megaphone, Share2 } from 'lucide-react';
import Buttons from '../../components/postcardbuttons/buttons';

const PostCard = ({ post }) => {
    const role = post?.user?.role || 'Member';
    const name = post?.user?.name || post?.user?.username || 'User';
    const username = post?.user?.username || '';
    const avatar = post?.user?.imageUrl || 'default-avatar.png';
    const createdAt = post?.createdAt ? new Date(post.createdAt) : null;
    const dateLabel = createdAt ? createdAt.toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
    const caption = post?.caption || post?.text || post?.description || '';
    const mediaUrl = post?.contentUrl;
    const commentsCount = Array.isArray(post?.comments) ? post.comments.length : 0;
    const reactionsCount = Array.isArray(post?.reactions) ? post.reactions.length : 0;

    return (
        <article className="bg-neutral-900 text-neutral-100 rounded-2xl shadow-xl border border-neutral-800 overflow-hidden">
            {/* Header */}
            <header className="flex items-center gap-3 p-4">
                <img
                    src={avatar}
                    alt={username}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => { e.currentTarget.src = 'default-avatar.png'; }}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold truncate">{name}</span>
                        <span className={`px-2 py-0.5 text-[11px] rounded-full font-semibold ${role === 'ADMIN' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-emerald-500/20 text-emerald-300'}`}>{role === 'ADMIN' ? 'Admin' : 'Member'}</span>
                    </div>
                    {dateLabel && (
                        <div className="text-xs text-neutral-400 mt-0.5">{dateLabel}</div>
                    )}
                </div>
            </header>

            {/* Caption */}
            {caption && (
                <div className="px-4 pb-3 text-neutral-200">
                    <div className="flex items-start gap-2">
                        <Megaphone className="w-4 h-4 mt-1 text-pink-400" />
                        <p className="leading-relaxed whitespace-pre-wrap">
                            {caption}
                        </p>
                    </div>
                </div>
            )}

            {/* Media */}
            {mediaUrl && (
                <div className="bg-neutral-800">
                    <img src={mediaUrl} alt="Post media" className="w-full max-h-[520px] object-cover" />
                </div>
            )}

            {/* Actions */}
            <div className="p-4 border-t border-neutral-800">
                <Buttons
                    currentReaction={null}
                    totalReactions={reactionsCount}
                    commentsCount={commentsCount}
                    disabled={true}
                    onReact={() => console.log('Login required to react')}
                    onComment={() => console.log('Login required to comment')}
                    onShare={() => console.log('Share clicked')}
                />
            </div>

            {/* Footer counts */}
            <footer className="px-4 pb-3 text-sm text-neutral-400 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-pink-400"></span>
                        {reactionsCount}
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-neutral-500"></span>
                        {commentsCount}
                    </span>
                </div>
                <button className="p-2 rounded-lg hover:bg-neutral-800" title="Share">
                    <Share2 className="w-5 h-5" />
                </button>
            </footer>
        </article>
    );
};

export default PostCard;