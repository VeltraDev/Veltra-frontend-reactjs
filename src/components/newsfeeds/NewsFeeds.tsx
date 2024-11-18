import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    MoreHorizontal,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDistanceToNow } from 'date-fns';
import EmojiPicker from '../chat/EmojiPicker';
import PostOptionsModal from '../newsfeed/PostOptionsModal';
import PostComments from '../newsfeed/PostComments';
import ShareModal from '../newsfeed/ShareModal';
import { toast } from 'react-hot-toast';
import { http } from '@/api/http';
import 'react-loading-skeleton/dist/skeleton.css';
import ReactionInfo from './ReactionInfo';
import ReactionBar from './ReactionBar';
import ImageSlider from './ImageSlider';

export default function NewsFeeds() {

    const { currentTheme } = useTheme();
    const [posts, setPosts] = useState<any[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
    const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
    const [comments, setComments] = useState<{ [key: string]: string }>({});
    const [showOptions, setShowOptions] = useState<string | null>(null);
    const [showComments, setShowComments] = useState<string | null>(null);
    const [showShare, setShowShare] = useState<string | null>(null);
    const [currentImageIndexes, setCurrentImageIndexes] = useState<{
        [key: string]: number;
    }>({});

    const [showReactionBar, setShowReactionBar] = useState<string | null>(null);
    const [reactions, setReactions] = useState<{ [key: string]: string }>({}); // Lưu loại reaction của từng post
    const [userReactions, setUserReactions] = useState<{ [key: string]: any }>({}); // Lưu chi tiết reaction của người dùng

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const [totalPosts, setTotalPosts] = useState<number | null>(null); // Lưu tổng số bài viết từ API

    const fetchPosts = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);

            const response = await http.get(`/posts?page=${page}&limit=10&sortBy=createdAt&order=desc`);

            const { total, results } = response.data; 
            setTotalPosts(total);
            const newResults = results.map((post: any) => ({
                ...post,
                userReactionDetail: post.reactions?.find(
                    (reaction: any) => reaction.reactedBy.id === currentUserId
                ) || null,
                totalReactions: post.reactions?.length || 0,
            }));

            if (newResults.length === 0) {
                console.log("No more posts to fetch");
                setIsFetchingMore(false);
                return;
            }

            setPosts((prevPosts) => (page === 1 ? newResults : [...prevPosts, ...newResults]));
            setUserReactions((prevReactions) =>
                newResults.reduce((acc: any, post: any) => {
                    if (post.userReactionDetail) {
                        acc[post.id] = post.userReactionDetail;
                    }
                    return acc;
                }, { ...prevReactions })
            );
        } catch (err) {
            console.error('Fetch Error:', err.response?.data || err.message || err);
            setError(err.message || 'Failed to fetch posts');
            toast.error(err.message || 'Failed to fetch posts');
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    }, [currentUserId]);


    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await http.get('/auth/account');
                setCurrentUserId(response.data?.user?.id);
            } catch (err) {
                console.error('Failed to fetch user info', err);
                toast.error('Failed to fetch user info');
            }
        };
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUserId) {
            fetchPosts(1);
        }
    }, [currentUserId, fetchPosts]);

    useEffect(() => {
        console.log('Posts:', posts); 
    }, [posts]);

    const lastPostElementRef = useCallback((node) => {
        if (loading || isFetchingMore || (totalPosts !== null && posts.length >= totalPosts)) return; // Dừng nếu đã tải hết

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setIsFetchingMore(true);
                setCurrentPage((prevPage) => {
                    const nextPage = prevPage + 1;
                    fetchPosts(nextPage);
                    return nextPage;
                });
            }
        }, { rootMargin: '500px' });

        if (node) observer.current.observe(node);
    }, [loading, isFetchingMore, posts.length, totalPosts, fetchPosts]);




    const postReaction = async (postId: string, reactionTypeId: string) => {
        try {
            const response = await http.post(`/posts/${postId}/reactions`, {
                reactionTypeId,
            });

            if (!response || !response.data) {
                console.error('API response is empty or undefined');
                toast.error('No data received from API');
                return null;
            }

            console.log('Reaction API Response:', response.data); 

            return response.data; 
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Error reacting to post';
            console.error('API Error:', error);
            toast.error(errorMessage);
            return null;
        }
    };

    const removeReaction = async (postId: string) => {
        try {
            const response = await http.delete(`/posts/${postId}/reactions`);

            if (!response || !response.data) {
                console.error('API response is empty or undefined');
                return null;
            }

            console.log('Remove Reaction API Response:', response.data); 

            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Error removing reaction from post';
            console.error('API Error:', error);
            toast.error(errorMessage);
            return null;
        }
    };

    const handleReact = async (postId: string, reactionType: string) => {
        if (
            userReactions[postId] &&
            userReactions[postId].reactedBy.id === currentUserId &&
            userReactions[postId].reactionType.type === reactionType
        ) {

            await removeReaction(postId);

            setUserReactions((prev) => {
                const updatedReactions = { ...prev };
                delete updatedReactions[postId];
                return updatedReactions;
            });

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            reactions: post.reactions.filter(
                                (reaction: any) => reaction.reactedBy.id !== currentUserId
                            ),
                            totalReactions: post.totalReactions - 1,
                        }
                        : post
                )
            );
        } else {
            const reactionTypeIdMap: { [key: string]: string } = {
                like: 'dd8ad4b3-5ebe-4b50-b01e-8688e8a1f84d',
                love: 'fd9c6de1-24ce-4dcc-8975-ea26efe09e60',
                haha: '56f763de-2f66-420a-bd28-81cadfe0319f',
                wow: '9f03dd40-6033-4174-b55e-5d464185b325',
                sad: '9b18d3e6-88c5-4f86-bc26-dc12fdf92b9f',
                angry: '29867226-d2f8-4081-8b28-fa3991aaf30b',
            };

            const reactionTypeId = reactionTypeIdMap[reactionType];

            if (!reactionTypeId) {
                toast.error('Invalid reaction type');
                return;
            }

            if (userReactions[postId]) {
                await removeReaction(postId);
            }

            const reactionData = await postReaction(postId, reactionTypeId);

            console.log('Full Reaction Data:', reactionData); 

            if (reactionData && reactionData.reactionType && reactionData.reactionType.type) {
                const selectedReaction = reactionData.reactionType.type;
                console.log('Selected Reaction:', selectedReaction); 

                setUserReactions((prev) => ({
                    ...prev,
                    [postId]: {
                        reactedBy: { id: currentUserId, firstName: 'Bạn' }, 
                        reactionType: { type: selectedReaction },
                    },
                }));

                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === postId
                            ? {
                                ...post,
                                reactions: post.reactions.some((reaction: string) => reaction.reactedBy.id === currentUserId)
                                    ? post.reactions.map((reaction: any) =>
                                        reaction.reactedBy.id === currentUserId
                                            ? { ...reaction, reactionType: { type: selectedReaction } }
                                            : reaction
                                    )
                                    : [
                                        ...post.reactions,
                                        {
                                            reactedBy: { id: currentUserId, firstName: 'Bạn' },
                                            reactionType: { type: selectedReaction },
                                        },
                                    ],
                                totalReactions: post.reactions.some((reaction: any) => reaction.reactedBy.id === currentUserId) ? post.reactions.length : post.reactions.length + 1,
                            }
                            : post
                    )
                );

                setShowReactionBar(null); 
            } else {
                console.error('Invalid reaction data structure:', reactionData); 
                toast.error('Invalid reaction data from server');
            }
        }
    };

    const handleSavePost = (postId: string) => {
        setSavedPosts((prev) => {
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
        setComments((prev) => ({ ...prev, [postId]: '' }));
    };

    const handleEmojiSelect = (postId: string, emoji: string) => {
        setComments((prev) => ({
            ...prev,
            [postId]: (prev[postId] || '') + emoji,
        }));
        setShowEmojiPicker(null);
    };

const handleImageNavigation = (postId: string, direction: 'prev' | 'next') => {
    setCurrentImageIndexes((prev) => {
        const currentIndex = prev[postId] || 0;
        const attachments = posts.find((post) => post.id === postId)?.attachments;

        if (!attachments || !Array.isArray(attachments)) {
            console.error('Attachments not found or invalid for postId:', postId);
            return prev;
        }

        const newIndex =
            direction === 'next'
                ? Math.min(currentIndex + 1, attachments.length - 1)
                : Math.max(currentIndex - 1, 0);

        return {
            ...prev,
            [postId]: newIndex,
        };
    });
};

    const handleExpandContent = (postId: string) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId
                    ? {
                        ...post,
                        expanded: !post.expanded,
                    }
                    : post
            )
        );
    };

    return (
        <div className="space-y-6">
            {isFetchingMore && (
                <div className="space-y-4">
                    {[...Array(2)].map((_, index) => (
                        <div key={index} className="flex flex-col content-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-[44px] h-[44px] rounded-full bg-gray-600 animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="w-32 h-4 bg-gray-600 rounded-md animate-pulse"></div>
                                    <div className="w-24 h-3 bg-gray-600 rounded-md animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex space-x-4 mt-10">
                                <div className="w-4 h-4 bg-gray-600 rounded-full animate-pulse"></div>
                                <div className="w-4 h-4 bg-gray-600 rounded-full animate-pulse"></div>
                                <div className="w-4 h-4 bg-gray-600 rounded-full animate-pulse"></div>
                            </div>
                            
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="text-red-500">{error}</p>}
            {!loading &&
                !error &&
                posts.map((post, index) => (
                    <article
                        key={post.id}
                        id={`post-${post.id}`}
                        className={`${currentTheme.bg} max-w-[470px] border-b ${currentTheme.border2} mx-auto overflow-hidden relative animate-fadeInScale`}
                        ref={index === posts.length - 1 ? lastPostElementRef : null}
                    >
                        <div className="py-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={post.author.avatar || 'https://avatar.iran.liara.run/public'}
                                    alt={post.author.firstName}
                                    className="w-[32px] h-[32px] rounded-full"
                                />
                                <div>
                                    <h3 className={`font-semibold ${currentTheme.textNewsFeeds}`}>
                                        {`${post.author.firstName} ${post.author.lastName}`}
                                    </h3>
                                    <p className={`text-xs ${currentTheme.mutedText}`}>
                                        {formatDistanceToNow(new Date(post.createdAt), {
                                            addSuffix: true,
                                        })}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowOptions(post.id)}
                                className={`p-2 rounded-full ${currentTheme.buttonHover} transition-transform hover:scale-110`}
                            >
                                <MoreHorizontal className={`w-5 h-5 ${currentTheme.iconColor}`} />
                            </button>
                        </div>
                        <div className="py-2 text-[14px]">
                            <p className={`${currentTheme.textNewsFeeds} ${!post.expanded ? 'line-clamp-2 text-[14px]' : ''}`}>
                                {post.content}
                            </p>
                            {post.content.length > 100 && (
                                <button
                                    onClick={() => handleExpandContent(post.id)}
                                    className="text-gray-500 text-[14px]"
                                >
                                    {post.expanded ? 'Ẩn bớt' : 'Xem thêm'}
                                </button>
                            )}
                        </div>

                        {post.attachments && post.attachments.length > 0 && (
                            <ImageSlider
                                attachments={post.attachments}
                                currentIndex={currentImageIndexes[post.id] || 0}
                                onNavigate={(direction) => handleImageNavigation(post.id, direction)}
                                isSliding={false}
                            />
                        )}

                        <ReactionInfo
                            post={post}
                            currentTheme={currentTheme}
                            handleReact={handleReact}
                            userReactions={userReactions}
                            currentUserId={currentUserId}
                            showReactionBar={showReactionBar}
                            setShowReactionBar={setShowReactionBar}
                        />
                        

                        {showReactionBar === post.id && (
                            <ReactionBar onReact={(type) => handleReact(post.id, type)} />
                        )}
                    </article>
                ))}
        </div>
    );
}