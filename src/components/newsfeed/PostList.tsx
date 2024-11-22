import React, { useState } from 'react';
import {
    Heart, MessageCircle, Send, Bookmark, MoreHorizontal,
    Smile, Share2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { mockPosts } from '@/mocks/newsfeedData';
import { formatDistanceToNow } from 'date-fns';
import EmojiPicker from '../chat/EmojiPicker';
import PostOptionsModal from './PostOptionsModal';
import PostComments from './PostComments';
import ShareModal from './ShareModal';
import { toast } from 'react-hot-toast';

export default function PostList() {
    const { currentTheme } = useTheme();
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
    const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
    const [comments, setComments] = useState<{ [key: string]: string }>({});
    const [showOptions, setShowOptions] = useState<string | null>(null);
    const [showComments, setShowComments] = useState<string | null>(null);
    const [showShare, setShowShare] = useState<string | null>(null);
    const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number }>({});

    const handleLikePost = (postId: string, isDoubleClick?: boolean) => {
        setLikedPosts(prev => {
            const newLiked = new Set(prev);
            if (!newLiked.has(postId)) {
                newLiked.add(postId);
                if (isDoubleClick) {
                    showHeartAnimation(postId);
                }
                toast.success('Post liked!');
            } else {
                newLiked.delete(postId);
            }
            return newLiked;
        });
    };

    const showHeartAnimation = (postId: string) => {
        const heart = document.createElement('div');
        heart.className = 'heart-animation';
        const post = document.getElementById(`post-${postId}`);
        if (post) {
            post.appendChild(heart);
            setTimeout(() => heart.remove(), 1000);
        }
    };

    const handleSavePost = (postId: string) => {
        setSavedPosts(prev => {
            const newSaved = new Set(prev);
            if (newSaved.has(postId)) {
                newSaved.delete(postId);
                toast.success('Post removed from collection');
            } else {
                newSaved.add(postId);
                toast.success('Post saved to collection!');
            }
            return newSaved;
        });
    };

    const handleAddComment = (postId: string) => {
        const comment = comments[postId]?.trim();
        if (!comment) return;
        toast.success('Comment added successfully!');
        setComments(prev => ({ ...prev, [postId]: '' }));
    };

    const handleEmojiSelect = (postId: string, emoji: string) => {
        setComments(prev => ({
            ...prev,
            [postId]: (prev[postId] || '') + emoji
        }));
        setShowEmojiPicker(null);
    };

    const handleImageNavigation = (postId: string, direction: 'prev' | 'next') => {
        setCurrentImageIndexes(prev => ({
            ...prev,
            [postId]: Math.max(0, Math.min(3, (prev[postId] || 0) + (direction === 'next' ? 1 : -1)))
        }));
    };

    return (
        <div className="space-y-6">
            {mockPosts.map((post) => (
                <article
                    key={post.id}
                    id={`post-${post.id}`}
                    className={`${currentTheme.bg} border ${currentTheme.border} rounded-xl overflow-hidden relative animate-fadeInScale`}
                >
                    {/* Post Header */}
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="relative group cursor-pointer">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 animate-spin-slow opacity-75 group-hover:opacity-100" />
                                <div className="relative">
                                    <img
                                        src={post.userAvatar}
                                        alt={post.username}
                                        className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h3 className={`font-semibold ${currentTheme.text} hover:text-blue-500 transition-colors cursor-pointer`}>
                                        {post.username}
                                    </h3>
                                    {post.isVerified && (
                                        <span className="text-blue-500">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                                {post.location && (
                                    <p className={`text-xs ${currentTheme.mutedText} hover:underline cursor-pointer`}>
                                        {post.location}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowOptions(post.id)}
                            className={`p-2 rounded-full ${currentTheme.buttonHover} transition-transform hover:scale-110`}
                        >
                            <MoreHorizontal className={`w-5 h-5 ${currentTheme.iconColor}`} />
                        </button>
                    </div>

                    {/* Post Image */}
                    <div
                        className="relative aspect-square group"
                        onDoubleClick={() => handleLikePost(post.id, true)}
                    >
                        <img
                            src={post.image}
                            alt="Post content"
                            className="w-full h-full object-cover"
                        />

                        {/* Image Navigation */}
                        {post.hasMultiple && (
                            <>
                                <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-black/50 text-white text-xs backdrop-blur-sm">
                                    {(currentImageIndexes[post.id] || 0) + 1}/4
                                </div>
                                {currentImageIndexes[post.id] > 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleImageNavigation(post.id, 'prev');
                                        }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm hover:bg-black/70"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                )}
                                {currentImageIndexes[post.id] < 3 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleImageNavigation(post.id, 'next');
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm hover:bg-black/70"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                )}
                            </>
                        )}

                        {/* Like Animation Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Heart className="w-0 h-0 text-white transform scale-0 opacity-0 transition-all duration-300 filter drop-shadow-lg heart-overlay" />
                        </div>
                    </div>

                    {/* Post Actions */}
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => handleLikePost(post.id)}
                                    className={`p-2 rounded-full ${currentTheme.buttonHover} transform active:scale-125 transition-transform`}
                                >
                                    {likedPosts.has(post.id) ? (
                                        <Heart className="w-6 h-6 text-red-500 fill-current animate-pop" />
                                    ) : (
                                        <Heart className={`w-6 h-6 ${currentTheme.iconColor}`} />
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowComments(post.id)}
                                    className={`p-2 rounded-full ${currentTheme.buttonHover} transform hover:scale-110 transition-transform`}
                                >
                                    <MessageCircle className={`w-6 h-6 ${currentTheme.iconColor}`} />
                                </button>
                                <button
                                    onClick={() => setShowShare(post.id)}
                                    className={`p-2 rounded-full ${currentTheme.buttonHover} transform hover:scale-110 transition-transform`}
                                >
                                    <Share2 className={`w-6 h-6 ${currentTheme.iconColor}`} />
                                </button>
                            </div>
                            <button
                                onClick={() => handleSavePost(post.id)}
                                className={`p-2 rounded-full ${currentTheme.buttonHover} transform active:scale-125 transition-transform`}
                            >
                                {savedPosts.has(post.id) ? (
                                    <Bookmark className="w-6 h-6 text-yellow-500 fill-current animate-pop" />
                                ) : (
                                    <Bookmark className={`w-6 h-6 ${currentTheme.iconColor}`} />
                                )}
                            </button>
                        </div>

                        {/* Likes */}
                        <div className={`font-semibold ${currentTheme.text} mb-2 animate-fadeIn`}>
                            {(post.likes + (likedPosts.has(post.id) ? 1 : 0)).toLocaleString()} likes
                        </div>

                        {/* Caption */}
                        <div className="mb-2">
                            <span className={`font-semibold ${currentTheme.text} mr-2 hover:underline cursor-pointer`}>
                                {post.username}
                            </span>
                            <span className={currentTheme.text}>{post.caption}</span>
                        </div>

                        {/* Comments Preview */}
                        {post.comments.length > 0 && (
                            <button
                                onClick={() => setShowComments(post.id)}
                                className={`${currentTheme.mutedText} text-sm mb-2 hover:underline`}
                            >
                                View all {post.comments.length} comments
                            </button>
                        )}

                        {/* Timestamp */}
                        <div className={`text-xs ${currentTheme.mutedText} uppercase mb-4 hover:underline cursor-pointer`}>
                            {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                        </div>

                        {/* Comment Input */}
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <button
                                    onClick={() => setShowEmojiPicker(showEmojiPicker === post.id ? null : post.id)}
                                    className={`p-2 rounded-full ${currentTheme.buttonHover} transform hover:scale-110 transition-transform`}
                                >
                                    <Smile className={`w-5 h-5 ${currentTheme.iconColor}`} />
                                </button>
                                {showEmojiPicker === post.id && (
                                    <div className="absolute bottom-full mb-2 z-50">
                                        <EmojiPicker
                                            onSelect={(emoji) => handleEmojiSelect(post.id, emoji)}
                                            onClose={() => setShowEmojiPicker(null)}
                                        />
                                    </div>
                                )}
                            </div>
                            <input
                                type="text"
                                value={comments[post.id] || ''}
                                onChange={(e) => setComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                                placeholder="Add a comment..."
                                className={`flex-1 bg-transparent ${currentTheme.text} placeholder:${currentTheme.mutedText} focus:outline-none`}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddComment(post.id);
                                    }
                                }}
                            />
                            <button
                                onClick={() => handleAddComment(post.id)}
                                disabled={!comments[post.id]?.trim()}
                                className={`font-semibold ${comments[post.id]?.trim()
                                        ? 'text-blue-500 hover:text-blue-600'
                                        : currentTheme.mutedText
                                    } transition-colors`}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </article>
            ))}

            {/* Modals */}
            {showOptions && (
                <PostOptionsModal
                    isOpen={true}
                    onClose={() => setShowOptions(null)}
                    isOwnPost={false}
                />
            )}

            {showComments && (
                <PostComments
                    postId={showComments}
                    comments={mockPosts.find(p => p.id === showComments)?.comments || []}
                    onClose={() => setShowComments(null)}
                />
            )}

            {showShare && (
                <ShareModal
                    isOpen={true}
                    onClose={() => setShowShare(null)}
                    postId={showShare}
                />
            )}

            {/* Animations */}
            <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }

        .heart-animation {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          background: white;
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'%3E%3C/path%3E%3C/svg%3E");
          mask-repeat: no-repeat;
          mask-position: center;
          animation: heart 1s ease-in-out forwards;
          pointer-events: none;
        }

        @keyframes heart {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
          15% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1.2);
          }
          30% {
            transform: translate(-50%, -50%) scale(0.95);
          }
          45%, 80% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
        }

        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .animate-pop {
          animation: pop 0.3s ease-in-out;
        }

        .heart-overlay {
          animation: heart-overlay 0.5s ease-in-out forwards;
        }

        @keyframes heart-overlay {
          0% {
            width: 0;
            height: 0;
            opacity: 0;
            transform: scale(0);
          }
          50% {
            width: 150px;
            height: 150px;
            opacity: 1;
            transform: scale(1);
          }
          100% {
            width: 150px;
            height: 150px;
            opacity: 0;
            transform: scale(1.2);
          }
        }
      `}</style>
        </div>
    );
}