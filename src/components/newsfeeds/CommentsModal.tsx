import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { X } from "lucide-react";
import { formatDistance } from "date-fns";
import { http } from "@/api/http";
import defaultAvatar from "@/images/user/defaultAvatar.png";
import ImageSlider from "./ImageSlider";
import CommentReactionBar from "./CommentReactionBar";
import { useAuth } from '@/contexts/AuthContext';

interface Author {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface Reaction {
  reactedBy: { id: string };
  reactionType: { id: string; type: string };
}

interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  reactions: Reaction[];
  children?: Comment[];
}

interface Post {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  attachments: string[];
}

interface ReactionType {
  id: string;
  type: string;
}

interface CommentsModalProps {
  postId: string;
  onClose: () => void;
  currentUserId: string;
}

export default function CommentsModal({
  postId,
  onClose,
  currentUserId,
}: CommentsModalProps) {
  const { currentTheme } = useTheme();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactionTypes, setReactionTypes] = useState<ReactionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>("");
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [replyingToAuthorName, setReplyingToAuthorName] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [hoveredLikeButtonId, setHoveredLikeButtonId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [expandedContent, setExpandedContent] = useState<{ [key: string]: boolean }>({});
  const [avatar, setAvatar] = useState(defaultAvatar);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        const [postResponse, commentsResponse] = await Promise.all([
          http.get(`/posts/${postId}`),
          http.get(`/posts/${postId}/comments`),
        ]);
        setPost(postResponse.data);
        setComments(commentsResponse.data || []);
      } catch (error) {
        console.error("Error fetching post and comments:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReactionTypes = async () => {
      try {
        const response = await http.get("/reaction-types");
        setReactionTypes(response.data.results || []);
      } catch (error) {
        console.error("Error fetching reaction types:", error);
        setReactionTypes([]);
      }
    };

    fetchPostAndComments();
    fetchReactionTypes();
  }, [postId]);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      console.log('Fetching user avatar...');
      try {
        const accountResponse = await http.get('/auth/account');
        console.log('Account response:', accountResponse);
        const userId = accountResponse.data.user.id;

        if (userId) {
          const userResponse = await http.get(`/users/${userId}`);
          const userData = userResponse.data.avatar;
          setAvatar(userData);
        }
      } catch (error) {
        console.error('Error fetching user avatar:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserAvatar();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleReactToComment = async (commentId: string, reactionType: string) => {
    const reactionTypeData = reactionTypes.find((reaction) => reaction.type === reactionType);

    if (!reactionTypeData) {
      console.error("Invalid reaction type:", reactionType);
      return;
    }


    const comment = findCommentById(comments, commentId);
    if (!comment) {
      console.error("Comment not found with id:", commentId);
      return;
    }
    const userReaction = comment.reactions.find(
      (reaction) => reaction.reactedBy.id === currentUserId
    );

    try {
      if (userReaction) {
        if (userReaction.reactionType.type === reactionType) {
          // Nếu người dùng đã thả cảm xúc giống loại hiện tại, xóa cảm xúc
          await http.delete(`/comments/${commentId}/reactions`);
          setComments((prevComments) =>
            updateComments(prevComments, commentId, (comment) => ({
              ...comment,
              reactions: comment.reactions.filter(
                (reaction) => reaction.reactedBy.id !== currentUserId
              ),
            }))
          );
        } else {
          // Nếu người dùng chọn cảm xúc khác, cập nhật cảm xúc
          await http.delete(`/comments/${commentId}/reactions`);
          const response = await http.post(`/comments/${commentId}/reactions`, {
            reactionTypeId: reactionTypeData.id,
          });
          setComments((prevComments) =>
            updateComments(prevComments, commentId, (comment) => ({
              ...comment,
              reactions: [
                ...comment.reactions.filter(
                  (reaction) => reaction.reactedBy.id !== currentUserId
                ),
                response.data,
              ],
            }))
          );
        }
      } else {

        const response = await http.post(`/comments/${commentId}/reactions`, {
          reactionTypeId: reactionTypeData.id,
        });
        setComments((prevComments) =>
          updateComments(prevComments, commentId, (comment) => ({
            ...comment,
            reactions: [...comment.reactions, response.data],
          }))
        );
      }
    } catch (error) {
      console.error("Error reacting to comment:", error);
    }
  };

  const toggleContentExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  const toggleCommentExpansion = (commentId: string) => {
    setExpandedContent((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      const payload = { content: newComment, parentId: replyParentId };
      const response = await http.post(`/posts/${postId}/comments`, payload);
      const newCommentData = response.data;

      setComments((prevComments) => {
        if (!replyParentId) {
          // Nếu comment không có parentId, thêm vào đầu danh sách
          return [newCommentData, ...prevComments];
        }

        // Nếu comment là phản hồi, tìm và thêm vào danh sách phản hồi của comment cha
        return updateComments(prevComments, replyParentId, (parentComment) => ({
          ...parentComment,
          children: parentComment.children
            ? [...parentComment.children, newCommentData]
            : [newCommentData],
        }));
      });

      if (replyParentId) {
        setExpandedComments((prev) => ({
          ...prev,
          [replyParentId]: true, 
        }));
      }

      setNewComment("");
      setReplyParentId(null);
      setReplyingToAuthorName(null);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };



  function reactionColorClass(type: string): string {
    switch (type) {
      case 'like':
        return 'text-blue-500 capitalize font-semibold';
      case 'love':
        return 'text-red-500 capitalize font-semibold';
      case 'haha':
        return 'text-yellow-500 capitalize font-semibold';
      case 'wow':
        return 'text-yellow-500 capitalize font-semibold';
      case 'sad':
        return 'text-yellow-600 capitalize font-semibold';
      case 'angry':
        return 'text-orange-600 capitalize font-semibold';
      default:
        return 'text-gray-300 capitalize ';
    }
  }
  const toggleShowAllReplies = (commentId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const renderComments = (comments: Comment[]) =>
    comments.map((comment) => {
      const isExpanded = expandedComments[comment.id] || false;
      const hasChildren = comment.children && comment.children.length > 0;
      const isContentExpanded = expandedContent[comment.id] || false;

      const userReaction = Array.isArray(comment.reactions)
        ? comment.reactions.find((reaction) => reaction.reactedBy.id === currentUserId)
        : null;

      return (
        <div key={comment.id} className="relative">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <img
                src={comment.author.avatar || defaultAvatar}
                alt={`${comment.author.firstName} ${comment.author.lastName}`}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className={`py-2 px-3 border ${currentTheme.border2} rounded-2xl`}>
                  <p className="font-bold text-gray-100 text-xs">
                    {comment.author.firstName} {comment.author.lastName}
                  </p>
                  <div className="relative mt-1 text-sm">
                    <p
                      style={{ whiteSpace: "pre-wrap" }}
                      className={`${isContentExpanded ? "line-clamp-none" : "line-clamp-3"
                        } ${currentTheme.textNewsFeeds}`}
                    >
                      {comment.content}
                    </p>
                    {(comment.content.length > 300 || comment.content.split("\n").length > 3) && (
                      <button
                        onClick={() => toggleCommentExpansion(comment.id)}
                        className="mt-1 text-gray-500 text-[14px] hover:underline"
                      >
                        {isContentExpanded ? "Ẩn bớt" : "Xem thêm"}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex space-x-4 mb-2 ml-3">
                  <p
                    className={`${currentTheme.textComment} hover:underline text-xs mt-[4px] mb-1`}
                  >
                    {formatDistance(new Date(comment.createdAt), new Date()).replace("about ", "")}
                  </p>
                  <button
                    className={`${currentTheme.textComment} hover:underline text-xs mt-1 mb-1 relative`}
                    onMouseEnter={() => setHoveredLikeButtonId(comment.id)}
                    onMouseLeave={() => setHoveredLikeButtonId(null)}
                    onClick={() =>
                      handleReactToComment(comment.id, userReaction?.reactionType?.type || "like")
                    }
                  >
                    <span
                      className={`${reactionColorClass(userReaction?.reactionType?.type || "default")
                        } text-xs font-medium px-1 py-0.5 rounded`}
                    >
                      {userReaction ? userReaction.reactionType.type : "Thích"}
                    </span>
                    {hoveredLikeButtonId === comment.id && reactionTypes?.length > 0 && (
                      <div className="absolute left-0 bottom-6 z-10">
                        <CommentReactionBar
                          onReact={(reactionType) =>
                            handleReactToComment(comment.id, reactionType)
                          }
                          reactionTypes={reactionTypes}
                        />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setReplyParentId(comment.id);
                      setReplyingToAuthorName(
                        `${comment.author.firstName} ${comment.author.lastName}`
                      );
                    }}
                    className={`${currentTheme.textComment} text-xs mt-1 mb-1 hover:underline`}
                  >
                    Reply
                  </button>
                  <div className="flex items-center mt-2">
                    {Array.from(
                      new Set(comment.reactions?.map((reaction) => reaction.reactionType.type) || [])
                    ).map((uniqueType, index) => (
                      <img
                        key={index}
                        src={`/emoji/${uniqueType}.png`}
                        alt={uniqueType}
                        className="w-[17.5px] h-[17.5px] "
                      />
                    ))}
                    {comment.reactions?.length > 0 && (
                      <span className="ml-2 text-xs text-gray-500">
                        {comment.reactions.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {hasChildren && (
            <div className="pl-7 text-gray-100 ml-3">
              {isExpanded ? renderComments(comment.children) : null}

              <button
                onClick={() => {
                  toggleShowAllReplies(comment.id);
                }}
                className="mb-2 text-gray-500 text-[14px] hover:underline"
              >
                {isExpanded
                  ? "Ẩn bớt phản hồi"
                  : `Xem tất cả ${comment.children.length} phản hồi`}
              </button>
            </div>
          )}
        </div>
      );
    });

  const findCommentById = (comments: Comment[], commentId: string): Comment | null => {
    for (const comment of comments) {
      if (comment.id === commentId) {
        return comment;
      }
      if (comment.children && comment.children.length > 0) {
        const found = findCommentById(comment.children, commentId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const updateComments = (
    comments: Comment[],
    commentId: string,
    updater: (comment: Comment) => Comment
  ): Comment[] => {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        return updater(comment);
      }
      if (comment.children && comment.children.length > 0) {
        return {
          ...comment,
          children: updateComments(comment.children, commentId, updater),
        };
      }
      return comment;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${currentTheme.bg} rounded-xl max-w-[700px] w-full max-h-[90vh] flex flex-col`}>
        <div className={`p-4 border-b flex justify-between ${currentTheme.border2}`}>
          <h2 className={`text-lg font-semibold mx-auto mt-2 ${currentTheme.text}`}>{post?.author.lastName}'s Post</h2>
          <button onClick={onClose} className={`p-2 rounded-full ${currentTheme.text} ${currentTheme.buttonHover}`}>
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 scrollbar-custom">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {post && (
                <article className={`border-b ${currentTheme.border2} py-4 mb-3 `}>
                  <div className="flex items-center space-x-3 ">
                    <img
                      src={post.author.avatar || defaultAvatar}
                      alt={post.author.firstName}
                      className="w-[32px] h-[32px] rounded-full"
                    />
                    <div>
                      <h3 className={`font-semibold ${currentTheme.textNewsFeeds}`}>
                        {post.author.firstName} {post.author.lastName}
                      </h3>
                      <p className={`text-xs text-gray-500`}>
                        {formatDistance(new Date(post.createdAt), new Date())}
                      </p>
                    </div>
                  </div>
                  <div className="relative mt-2 text-sm my-4">
                    <p
                      style={{ whiteSpace: "pre-wrap" }}
                      className={`${isExpanded ? "line-clamp-none" : "line-clamp-3"} ${currentTheme.textNewsFeeds}`}
                    >
                      {post.content}
                    </p>
                    {post.content.length > 300 && (
                      <button
                        onClick={toggleContentExpansion}
                        className="mt-2 text-gray-500 text-[14px]"
                      >
                        {isExpanded ? "Ẩn bớt" : "Xem thêm"}
                      </button>
                    )}
                  </div>

                  <div className='max-w-[470px] mx-auto'>
                    {post.attachments?.length > 0 && (
                      <ImageSlider
                        attachments={post.attachments}
                        currentIndex={currentImageIndex}
                        onNavigate={(direction) =>
                          setCurrentImageIndex((prev) =>
                            direction === "prev" ? Math.max(0, prev - 1) : Math.min(prev + 1, post.attachments.length - 1)
                          )
                        }
                      />
                    )}
                  </div>
                </article>
              )}
              {comments.length > 0 ? renderComments(comments) : <p>No comments yet.</p>}
            </>
          )}
        </div>
        <div className="flex items-start space-x-3 p-4 bg-gray-800 rounded-lg">
          <img
            src={avatar || defaultAvatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />

          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                replyParentId ? `Replying to ${replyingToAuthorName}...` : "Write a comment..."
              }
              rows={1}
              className="py-3 w-full bg-gray-700 text-gray-200 p-3 rounded-xl outline-none resize-none overflow-auto focus:ring-2 focus:ring-gray-400 max-h-[150px] scrollbar-custom"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 350)}px`;
              }}
            />
          </div>

          <button
            onClick={handlePostComment}
            className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
              <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" 
                stroke="#f5f5f5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
