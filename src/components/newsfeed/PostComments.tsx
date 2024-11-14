import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Heart, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
    id: string;
    username: string;
    userAvatar: string;
    content: string;
    likes: number;
    timestamp: string;
    replies?: Comment[];
}

interface PostCommentsProps {
    postId: string;
    comments: Comment[];
    onClose: () => void;
}

export default function PostComments({ postId, comments, onClose }: PostCommentsProps) {
    const { currentTheme } = useTheme();
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<string | null>(null);

    const toggleLike = (commentId: string) => {
        const newLikedComments = new Set(likedComments);
        if (newLikedComments.has(commentId)) {
            newLikedComments.delete(commentId);
        } else {
            newLikedComments.add(commentId);
        }
        setLikedComments(newLikedComments);
    };

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        // Handle comment submission
        setNewComment('');
        setReplyTo(null);
    };

    return (
        <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50`}>
            <div className={`${currentTheme.bg} rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col`}>
                {/* Header */}
                <div className={`p-4 border-b ${currentTheme.border} flex items-center justify-between`}>
                    <h2 className={`text-lg font-semibold ${currentTheme.text}`}>Comments</h2>
                    <button onClick={onClose} className={`${currentTheme.buttonHover} p-2 rounded-full`}>
                        ×
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="space-y-2">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    <img
                                        src={comment.userAvatar}
                                        alt={comment.username}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`font-semibold ${currentTheme.text}`}>
                                                {comment.username}
                                            </span>
                                            <span className={`text-xs ${currentTheme.mutedText}`}>
                                                {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className={currentTheme.text}>{comment.content}</p>
                                        <div className="flex items-center space-x-4 mt-1">
                                            <button
                                                onClick={() => toggleLike(comment.id)}
                                                className={`text-xs ${currentTheme.mutedText} hover:text-gray-900 dark:hover:text-gray-100`}
                                            >
                                                {likedComments.has(comment.id) ? 'Unlike' : 'Like'}
                                            </button>
                                            <button
                                                onClick={() => setReplyTo(comment.id)}
                                                className={`text-xs ${currentTheme.mutedText} hover:text-gray-900 dark:hover:text-gray-100`}
                                            >
                                                Reply
                                            </button>
                                            {comment.likes > 0 && (
                                                <span className={`text-xs ${currentTheme.mutedText}`}>
                                                    {comment.likes} likes
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button className={`${currentTheme.buttonHover} p-1 rounded-full`}>
                                    <MoreHorizontal className={`w-4 h-4 ${currentTheme.iconColor}`} />
                                </button>
                            </div>

                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="ml-11 space-y-2">
                                    {comment.replies.map((reply) => (
                                        <div key={reply.id} className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3">
                                                <img
                                                    src={reply.userAvatar}
                                                    alt={reply.username}
                                                    className="w-6 h-6 rounded-full"
                                                />
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`font-semibold ${currentTheme.text}`}>
                                                            {reply.username}
                                                        </span>
                                                        <span className={`text-xs ${currentTheme.mutedText}`}>
                                                            {formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                    <p className={currentTheme.text}>{reply.content}</p>
                                                </div>
                                            </div>
                                            <button className={`${currentTheme.buttonHover} p-1 rounded-full`}>
                                                <MoreHorizontal className={`w-4 h-4 ${currentTheme.iconColor}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleSubmitComment} className={`p-4 border-t ${currentTheme.border}`}>
                    {replyTo && (
                        <div className={`text-xs ${currentTheme.mutedText} mb-2 flex items-center justify-between`}>
                            <span>Replying to comment</span>
                            <button
                                onClick={() => setReplyTo(null)}
                                className={`${currentTheme.buttonHover} p-1 rounded-full`}
                            >
                                ×
                            </button>
                        </div>
                    )}
                    <div className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={replyTo ? 'Write a reply...' : 'Add a comment...'}
                            className={`flex-1 ${currentTheme.input} rounded-full px-4 py-2 ${currentTheme.text} focus:outline-none`}
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className={`font-semibold ${newComment.trim() ? 'text-blue-500 hover:text-blue-600' : currentTheme.mutedText
                                }`}
                        >
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}