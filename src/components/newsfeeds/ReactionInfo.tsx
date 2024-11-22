import React, { useState } from 'react';
import {
  MessageCircle,
  Send,
  Bookmark,
  Heart,
} from 'lucide-react';
import ReactionBar from './ReactionBar';
import CommentsModal from './CommentsModal';
import ReactionDetailModal from './ReactionDetailModal';


const ReactionInfo = ({ post, currentTheme, handleReact, userReactions, currentUserId, showReactionBar, setShowReactionBar }) => {
  const [showComments, setShowComments] = useState(false);
  const [showReactionDetail, setShowReactionDetail] = useState(false);

  return (
    <div className="py-2">
      <div className="flex items-center space-x-2 mt-2 mb-3">
        {post.totalReactions > 0 && (
          <div className="flex items-center">
            {(() => {
              const reactionCounts = post.reactions.reduce((acc, reaction) => {
                acc[reaction.reactionType.type] = (acc[reaction.reactionType.type] || 0) + 1;
                return acc;
              }, {});

              const sortedReactions = Object.entries(reactionCounts).sort((a, b) => b[1] - a[1]);
              let topReactions = sortedReactions.slice(0, 2).map(([type]) => type);

              const userReaction = userReactions[post.id]?.reactionType?.type;
              if (userReaction && !topReactions.includes(userReaction)) {
                topReactions.push(userReaction);
              }

              if (topReactions.length > 0) {
                return (
                  <div className="flex items-center">
                    {topReactions.map((type, index) => (
                      <span key={index}>
                        {type === 'like' && (
                          <img src='/emoji/like.png' alt="emoji like" className='w-[17.5px] h-[17.5px]' />
                        )}
                        {type === 'love' && (
                          <img src='/emoji/love.png' alt="emoji love" className='w-[17.5px] h-[17.5px]' />
                        )}
                        {type === 'haha' && (
                          <img src='/emoji/haha.png' alt="emoji laugh" className='w-[17.5px] h-[17.5px]' />
                        )}
                        {type === 'wow' && (
                          <img src='/emoji/wow.png' alt="emoji wow" className='w-[17.5px] h-[17.5px]' />
                        )}
                        {type === 'sad' && (
                          <img src='/emoji/sad.png' alt="emoji sad" className='w-[17.5px] h-[17.5px]' />
                        )}
                        {type === 'angry' && (
                          <img src='/emoji/angry.png' alt="emoji angry" className='w-[17.5px] h-[17.5px]' />
                        )}
                      </span>
                    ))}
                  </div>
                );
              }
              return null;
            })()}
            <span className={`text-[#b0b3b8] text-sm text-center ${currentTheme.text} ml-2 cursor-pointer`}
              onClick={() => setShowReactionDetail(true)}>
              {userReactions[post.id] && post.totalReactions === 1
                ? 'Bạn'
                : userReactions[post.id]
                  ? `Bạn và ${post.totalReactions - 1} người khác`
                  : `${post.totalReactions}`}
            </span>
          </div>
        )}
      </div>

      <div className={`flex items-center justify-between mb-3 border-t ${currentTheme.border2} pt-3`}>
        <div className="flex space-x-4">
          <div
            className="relative mt-2"
            onMouseEnter={() => setShowReactionBar(post.id)}
            onMouseLeave={() => setShowReactionBar(null)}
          >
            <button
              onClick={() => handleReact(post.id, userReactions[post.id] ? userReactions[post.id].reactionType.type : 'love')}
              className={` transform active:scale-125 transition-transform`}
            >
              {userReactions[post.id] && userReactions[post.id].reactedBy.id === currentUserId ? (
                userReactions[post.id].reactionType.type === 'like' ? (
                  <img src='/emoji/like.png' alt="emoji like" className='w-[24px] h-[24px]' />
                ) : userReactions[post.id].reactionType.type === 'love' ? (
                  <img src='/emoji/love.png' alt="emoji love" className='w-[24px] h-[24px]' />
                ) : userReactions[post.id].reactionType.type === 'haha' ? (
                  <img src='/emoji/haha.png' alt="emoji haha" className='w-[24px] h-[24px]' />
                ) : userReactions[post.id].reactionType.type === 'wow' ? (
                  <img src='/emoji/wow.png' alt="emoji wow" className='w-[24px] h-[24px]' />
                ) : userReactions[post.id].reactionType.type === 'sad' ? (
                  <img src='/emoji/sad.png' alt="emoji sad" className='w-[24px] h-[24px]' />
                ) : userReactions[post.id].reactionType.type === 'angry' ? (
                  <img src='/emoji/angry.png' alt="emoji angry" className='w-[24px] h-[24px]' />
                ) : (
                  <Heart className={`w-6 h-6 text-blue-300`} />
                )
              ) : (
                <Heart className={`w-6 h-6 hover:text-gray-400 ${currentTheme.iconColor}`} />
              )}
            </button>

            {showReactionBar === post.id && (
              <ReactionBar onReact={(type) => handleReact(post.id, type)} />
            )}
          </div>

          <button
            className="rounded-full transition-transform"
            onClick={() => setShowComments(true)}
          >
            <MessageCircle className={`w-6 h-6 hover:text-gray-400 ${currentTheme.iconColor}`} />
          </button>

          <button className="rounded-full transition-transform">
            <Send className={`w-6 h-6 hover:text-gray-400 ${currentTheme.iconColor}`} />
          </button>
        </div>

        <button className=" transition-transform mr-[6px]">
          <Bookmark className={`w-6 h-6 hover:text-gray-400 ${currentTheme.iconColor}`} />
        </button>
      </div>

      {showComments && (
        <CommentsModal
          postId={post.id}
          onClose={() => setShowComments(false)}
          currentUserId={currentUserId}
        />
      )}

      {showReactionDetail && (
        <ReactionDetailModal
          postId={post.id}
          onClose={() => setShowReactionDetail(false)}
        />
      )}

    </div>
  );
};

export default ReactionInfo;
