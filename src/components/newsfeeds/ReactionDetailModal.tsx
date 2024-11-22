import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { http } from '@/api/http';
import { useTheme } from '@/contexts/ThemeContext';
import defaultAvatar from '@/images/user/defaultAvatar.png';

interface ReactionDetailModalProps {
    postId: string;
    onClose: () => void;
}

export default function ReactionDetailModal({ postId, onClose }: ReactionDetailModalProps) {
    const { currentTheme } = useTheme();
    const [reactions, setReactions] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReactions = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await http.get(`/posts/${postId}`);
                setReactions(response.data.reactions || []);
            } catch (err: any) {
                setError(err.message || 'Failed to load reactions');
            } finally {
                setLoading(false);
            }
        };
        fetchReactions();
    }, [postId]);

    const reactionTypes = Array.from(
        new Set(reactions.map((reaction) => reaction.reactionType.type))
    );

    const filteredReactions =
        activeTab === 'all'
            ? reactions
            : reactions.filter((reaction) => reaction.reactionType.type === activeTab);

    const getReactionCount = (type: string) => {
        return reactions.filter((reaction) => reaction.reactionType.type === type).length;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div
                className={`rounded-lg w-[550px] ${currentTheme.bg} ${currentTheme.textNewsFeeds}`}
                style={{ height: '440px' }}
            >
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`relative flex items-center px-4 py-2 ${
                                    activeTab === 'all'
                                        ? 'text-blue-500 border-b-2 border-blue-500'
                                        : 'text-gray-500'
                                }`}
                            >
                                <span className="text-sm font-semibold">All</span>
                            </button>

                            {reactionTypes.map((type) => {
                                const count = getReactionCount(type);
                                return (
                                    <button
                                        key={type}
                                        onClick={() => setActiveTab(type)}
                                        className={`relative flex items-center px-4 py-2 ${
                                            activeTab === type
                                                ? 'text-blue-500 border-b-2 border-blue-500'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        <img
                                            src={`/emoji/${type}.png`}
                                            alt={type}
                                            className="w-6 h-6 mr-2"
                                        />
                                        <span className="text-sm font-medium">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            className={`p-2 rounded-full hover:bg-gray-200 ${currentTheme.buttonHover}`}
                            onClick={onClose}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto scrollbar-custom" style={{ maxHeight: '340px' }}>
                    {loading ? (
                        <ul className="space-y-4">
                            {[...Array(6)].map((_, index) => (
                                <li key={index} className="flex items-center justify-between animate-pulse">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-600 rounded-full"></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="w-32 h-4 bg-gray-700 rounded-full"></div>
                                            <div className="w-20 h-3 bg-gray-600 rounded-full mt-1"></div>
                                        </div>
                                    </div>
                                    <div className="ml-auto px-4 py-2 bg-gray-700 rounded w-[100px] h-8"></div>
                                </li>
                            ))}
                        </ul>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : filteredReactions.length > 0 ? (
                        <ul className="space-y-4">
                            {filteredReactions.map((reaction) => (
                                <li key={reaction.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <img
                                                src={reaction.reactedBy.avatar || defaultAvatar}
                                                alt={reaction.reactedBy.firstName}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <img
                                                src={`/emoji/${reaction.reactionType.type}.png`}
                                                alt={reaction.reactionType.type}
                                                className="absolute bottom-0 right-0 w-4 h-4 rounded-full"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#f5f5f5]">
                                                {`${reaction.reactedBy.firstName} ${reaction.reactedBy.lastName}`}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="ml-auto px-4 py-1 bg-[#3B3D3E] text-[#f5f5f5] rounded-[12px]">
                                        <div className="flex justify-between w-[100px]">
                                            <div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20px"
                                                    height="20px"
                                                    viewBox="0 0 64 64"
                                                    strokeWidth="3"
                                                    stroke="#f5f5f5"
                                                    fill="none"
                                                >
                                                    <circle cx="29.22" cy="16.28" r="11.14" />
                                                    <path d="M41.32,35.69c-2.69-1.95-8.34-3.25-12.1-3.25h0A22.55,22.55,0,0,0,6.67,55h29.9" />
                                                    <circle cx="45.38" cy="46.92" r="11.94" />
                                                    <line x1="45.98" y1="39.8" x2="45.98" y2="53.8" />
                                                    <line x1="38.98" y1="46.8" x2="52.98" y2="46.8" />
                                                </svg>
                                            </div>
                                            <div className="text-sm">Add Friend</div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No reactions found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
