// src/components/postcardbuttons/buttons.jsx
// Reusable action bar for a post: reactions (picker), comment, share
// Pure UI with callbacks so it can be reused in Feed, Detail, etc.

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Heart, ThumbsUp, Hand, HandHeart, Lightbulb, Laugh, MessageCircle, Send } from 'lucide-react';

/**
 * Props
 * - currentReaction: 'like' | 'love' | 'happy' | 'sad' | null
 * - totalReactions: number
 * - commentsCount: number
 * - sharesCount?: number
 * - disabled?: boolean
 * - onReact?: (type: 'like' | 'love' | 'happy' | 'sad' | null) => void
 * - onComment?: () => void
 * - onShare?: () => void
 */
export default function Buttons({
  currentReaction = null,
  totalReactions = 0,
  commentsCount = 0,
  sharesCount = 0,
  disabled = false,
  onReact = () => {},
  onComment = () => {},
  onShare = () => {},
}) {
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);

  // Close picker on outside click (mobile friendly)
  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (popRef.current && !popRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  // LinkedIn-like palette: Like, Celebrate, Support, Love, Insightful, Funny
  const reactionDefs = useMemo(() => ([
    { key: 'like', label: 'Like', icon: ThumbsUp, iconColor: 'text-white', bgColor: 'bg-sky-500' },
    { key: 'celebrate', label: 'Celebrate', icon: Hand, iconColor: 'text-white', bgColor: 'bg-green-600' },
    { key: 'support', label: 'Support', icon: HandHeart, iconColor: 'text-white', bgColor: 'bg-violet-500' },
    { key: 'love', label: 'Love', icon: Heart, iconColor: 'text-white', bgColor: 'bg-rose-500' },
    { key: 'insightful', label: 'Insightful', icon: Lightbulb, iconColor: 'text-white', bgColor: 'bg-amber-500' },
    { key: 'funny', label: 'Funny', icon: Laugh, iconColor: 'text-white', bgColor: 'bg-cyan-500' },
  ]), []);

  const activeDef = reactionDefs.find(r => r.key === currentReaction) || null;

  const handleSelect = (type) => {
    if (disabled) return;
    onReact(type);
    setOpen(false);
  };

  return (
    <div className="w-full select-none">
      {/* Buttons Row */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Reaction button with picker */}
        <div className="relative" ref={popRef}>
          <button
            type="button"
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setOpen(v => !v)}
            aria-haspopup="true"
            aria-expanded={open}
          >
            {activeDef ? (
              <activeDef.icon className={`w-5 h-5 ${activeDef.iconColor.replace('text', 'fill')}`} />
            ) : (
              <ThumbsUp className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">
              {activeDef ? activeDef.label : 'Like'}
            </span>
            {typeof totalReactions === 'number' && (
              <span className="text-xs text-gray-500">{totalReactions}</span>
            )}
          </button>

          {/* Picker */}
          {open && !disabled && (
            <div
              className="absolute -top-16 left-0 right-auto bg-white border border-gray-200 rounded-full shadow-2xl px-2 py-1 flex gap-2 z-20"
            >
              {reactionDefs.map(r => (
                <button
                  key={r.key}
                  type="button"
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${r.bgColor} hover:brightness-110 transition ${currentReaction === r.key ? 'ring-2 ring-offset-2 ring-neutral-200' : ''}`}
                  onClick={() => handleSelect(r.key)}
                  title={r.label}
                >
                  <r.icon className={`w-5 h-5 ${r.iconColor}`} />
                </button>
              ))}
              {/* Clear reaction */}
              {currentReaction && (
                <button
                  type="button"
                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => handleSelect(null)}
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Comment */}
        <button
          type="button"
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={onComment}
          disabled={disabled}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Comment</span>
          {typeof commentsCount === 'number' && (
            <span className="text-xs text-gray-500">{commentsCount}</span>
          )}
        </button>

        {/* Share */}
        <button
          type="button"
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={onShare}
          disabled={disabled}
        >
          <Send className="w-5 h-5" />
          <span className="text-sm font-medium">Share</span>
          {typeof sharesCount === 'number' && (
            <span className="text-xs text-gray-500">{sharesCount}</span>
          )}
        </button>
      </div>
    </div>
  );
}
