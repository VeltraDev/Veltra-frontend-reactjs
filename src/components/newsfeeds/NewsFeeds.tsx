import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    MoreHorizontal,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { http } from '@/api/http';
import 'react-loading-skeleton/dist/skeleton.css';
import ReactionInfo from './ReactionInfo';
import ReactionBar from './ReactionBar';
import ImageSlider from './ImageSlider';
import OptionsModal from './OptionsModal';
import defaultAvatar from '@/images/user/defaultAvatar.png'

export default function NewsFeeds({ refreshPosts }: { refreshPosts: boolean }) {
    const { currentTheme } = useTheme();
    const [posts, setPosts] = useState<any[]>([]);
    const [comments, setComments] = useState<{ [key: string]: string }>({});
    const [showOptions, setShowOptions] = useState<string | null>(null);
    const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number }>({});
    const [showReactionBar, setShowReactionBar] = useState<string | null>(null);
    const [userReactions, setUserReactions] = useState<{ [key: string]: any }>({});
    const [reactionTypes, setReactionTypes] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const [totalPosts, setTotalPosts] = useState<number | null>(null);

    const fetchReactionTypes = useCallback(async () => {
        try {
            const response = await http.get('/reaction-types');
            const fetchedReactionTypes = response.data.results.reduce((acc: any, reaction: any) => {
                acc[reaction.type] = reaction.id;
                return acc;
            }, {});
            setReactionTypes(fetchedReactionTypes);
        } catch (error) {
            console.error('Failed to fetch reaction types', error);
            toast.error('Failed to fetch reaction types');
        }
    }, []);



    const fetchPosts = useCallback(async (page: number) => {
        try {
            setLoading(page === 1);
            setLoadingMore(page > 1);
            setError(null);

            const response = await http.get(`/posts?page=${page}&limit=10&sortBy=createdAt&order=desc`);
            const { total, results } = response.data;

            setTotalPosts(total);

            const newPosts = results.map((post: any) => {
                const userReactionDetail = post.reactions?.find(
                    (reaction: any) => reaction.reactedBy.id === currentUserId
                );

                if (userReactionDetail) {
                    setUserReactions((prev) => ({
                        ...prev,
                        [post.id]: userReactionDetail,
                    }));
                }

                return {
                    ...post,
                    userReactionDetail: userReactionDetail || null,
                    totalReactions: post.reactions?.length || 0, 
                };
            });

            setPosts((prevPosts) => (page === 1 ? newPosts : [...prevPosts, ...newPosts]));
        } catch (err) {
            console.error('Fetch Error:', err.response?.data || err.message || err);
            setError(err.message || 'Failed to fetch posts');
            toast.error(err.message || 'Failed to fetch posts');
        } finally {
            setLoading(false);
            setLoadingMore(false);
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
        fetchReactionTypes();
    }, [fetchReactionTypes]);

    useEffect(() => {
        if (currentUserId) {
            fetchPosts(1);
        }
    }, [currentUserId, refreshPosts, fetchPosts]);

    const lastPostElementRef = useCallback(
        (node) => {
            if (loadingMore || (totalPosts !== null && posts.length >= totalPosts)) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        setCurrentPage((prevPage) => {
                            const nextPage = prevPage + 1;
                            fetchPosts(nextPage);
                            return nextPage;
                        });
                    }
                },
                { rootMargin: '500px' }
            );

            if (node) observer.current.observe(node);
        },
        [loadingMore, posts.length, totalPosts, fetchPosts]
    );

    const postReaction = async (postId: string, reactionTypeId: string) => {
        try {
            const response = await http.post(`/posts/${postId}/reactions`, { reactionTypeId });
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
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Error removing reaction from post';
            console.error('API Error:', error);
            toast.error(errorMessage);
            return null;
        }
    };

    const handleReact = async (postId: string, reactionType: string) => {
        const reactionTypeId = reactionTypes[reactionType];

        if (!reactionTypeId) {
            toast.error('Invalid reaction type');
            return;
        }

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
            if (userReactions[postId]) {
                await removeReaction(postId);
            }

            const reactionData = await postReaction(postId, reactionTypeId);

            if (reactionData && reactionData.reactionType && reactionData.reactionType.type) {
                const selectedReaction = reactionData.reactionType.type;

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
                                reactions: post.reactions.some(
                                    (reaction: string) => reaction.reactedBy.id === currentUserId
                                )
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
                                totalReactions: post.reactions.some(
                                    (reaction: any) => reaction.reactedBy.id === currentUserId
                                )
                                    ? post.reactions.length
                                    : post.reactions.length + 1,
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

    useEffect(() => {
        const originalScrollRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = 'manual';

        return () => {
            window.history.scrollRestoration = originalScrollRestoration;
        };
    }, []);

    const handleMoreOptions = (postId: string) => {
    setShowOptions(postId); 
  };

  const handleCloseModal = () => {
    setShowOptions(null); 
  };

    return (
        <div className="space-y-6">
            {loading && (
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex flex-col content-between space-y-3 mt-3">
                            <div className="flex items-center space-x-4">
                                <div className="w-[44px] h-[44px] rounded-full bg-gray-600 animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="w-32 h-4 bg-gray-600 rounded-md animate-pulse"></div>
                                    <div className="w-24 h-3 bg-gray-600 rounded-md animate-pulse"></div>
                                </div>
                            </div>
                            <div className="w-full h-10 bg-gray-600 rounded-md animate-pulse"></div>
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
                posts.map((post, index) => (
                    <article
                        key={post.id}
                        id={`post-${post.id}`}
                        className={`${currentTheme.bg} border-b ${currentTheme.border2} mx-auto overflow-hidden relative animate-fadeInScale`}
                        ref={index === posts.length - 1 ? lastPostElementRef : null}
                    >
                        <div className="py-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">


                                <img
                                    src={post.author.avatar || defaultAvatar}

                                    alt={post.author.firstName}
                                    className="w-[32px] h-[32px] rounded-full"
                                />
                                <div>
                                    <h3 className={`font-semibold ${currentTheme.textNewsFeeds}`}>
                                        {`${post.author.firstName} ${post.author.lastName}`}
                                    </h3>
                                    <p className={`text-xs ${currentTheme.mutedText}`}>
                                        {formatDistanceToNow(new Date(post.createdAt), new Date()).replace("about ", "")}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleMoreOptions(post.id)}
                                className={`p-2 rounded-full ${currentTheme.buttonHover} transition-transform hover:scale-110`}
                            >
                                <MoreHorizontal className={`w-5 h-5 ${currentTheme.iconColor}`} />
                            </button>
                        </div>
                        <div className="py-2 text-[14px]">
                            <p
                                style={{ whiteSpace: 'pre-wrap' }}
                                className={`${currentTheme.textNewsFeeds} ${!post.expanded ? 'line-clamp-3 text-[14px]' : ''}`}>
                                {post.content}
                            </p>
                            {(post.content.length > 100 || post.content.split("\n").length > 3) && (
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

                        <OptionsModal
                            isVisible={!!showOptions}
                            onClose={handleCloseModal}
                            postId={showOptions as string}
                            onPostDelete={(postId) => {
                                setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)); 
                            }}
                            onPostEdit={(postId) => { 
                             console.log(`Editing post with ID: ${postId}`);
                            }}
                            />
                    </article>
                ))}
        </div>
    );
}