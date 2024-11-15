import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Message, recallMessage } from '@/redux/chatSlice';
import { useTheme, themes } from '@/contexts/ThemeContext';
import MessageActions from './MessageActions';
import MessageReactions from './MessageReactions';
import ReplyThread from './ReplyThread';
import MessageStatus from './MessageStatus';
import { toast } from 'react-hot-toast';
import { RootState } from '@/redux/store';

interface MessageItemProps {
  message: Message;
  showAvatar: boolean;
  isPrevSenderSame: boolean;
  onForward: (message: Message) => void;
}

export default function MessageItem({ message, showAvatar, isPrevSenderSame, onForward }: MessageItemProps) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const currentUser = useSelector((state: RootState) => state.auth.user || []);
  const isSelf = message.sender?.id === currentUser.user?.id;

  const [showActions, setShowActions] = React.useState(false);

  const handleReply = () => {
    // Will be implemented when reply feature is added
    toast.info('Reply feature coming soon');
  };

  const handleReact = () => {
    // Will be implemented when reactions feature is added
    toast.info('Reactions feature coming soon');
  };

  const handleEdit = async () => {
    // Will be implemented when edit feature is added
    toast.info('Edit feature coming soon');
  };

  const handlePin = () => {
    // Will be implemented when pin feature is added
    toast.info('Pin feature coming soon');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success('Message copied to clipboard');
  };

  const handleViewThread = () => {
    // Will be implemented when threading feature is added
    toast.info('Thread view feature coming soon');
  };

  const handleDelete = async () => {
    try {
      await dispatch(recallMessage(message.id)).unwrap();
      toast.success('Message recalled successfully');
    } catch (error) {
      toast.error('Failed to recall message');
    }
  };

  return (
    <div
      className={`chat-message ${isSelf ? 'flex justify-end ' : 'flex '} group/message`}
      style={{ marginTop: isPrevSenderSame ? '4px' : '17px' }}
    >
      <div className={`flex ${isSelf ? 'justify-end' : 'items-end'} max-w-[564px] relative`}>
        {/* Avatar */}
        {!isSelf && showAvatar && (
          <div className="w-7 flex-shrink-0 mr-[5px]">
            <div className="relative">
              <img
                src={message.sender.avatar || `https://ui-avatars.com/api/?name=${message.sender.firstName}`}
                alt={message.sender.firstName}
                className="w-7 h-7 rounded-full object-cover transition-transform duration-300 group-hover/message:scale-105"
              />
            </div>
          </div>
        )}

        <div
          className={`message-content-wrapper relative ${isSelf ? '' : showAvatar ? '' : 'ml-[33px]'
            }`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {/* Sender Name */}
          {!isSelf && !isPrevSenderSame && (
            <span className={`text-sm ${currentTheme.mutedText} ml-1 mb-1 block font-medium`}>
              {message.sender.firstName}
            </span>
          )}

          <div className="relative group/content">
            {/* Message Actions */}
            {showActions && !message.isRecalled && (
              <MessageActions
                message={message}
                onReply={handleReply}
                onReact={handleReact}
                onForward={onForward}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPin={handlePin}
                onCopy={handleCopy}
                isOwner={isSelf}
              />
            )}

            {/* Message Content */}
            <div
              className={`
                relative
                px-3 py-[0.44rem] text-[0.95rem]
                rounded-[18px]
                ${isSelf
                  ? `${currentTheme.selfMessage}   ${currentTheme.messageTextSelf} rounded-[18px]`
                  : `${currentTheme.otherMessage} rounded-[18px]`
                }
                transition-all duration-300
                hover:shadow-sm
              `}
            >
              <p className="leading-relaxed whitespace-pre-wrap break-words">
                {message.isRecalled ? (
                  <span className="italic opacity-75">Message has been recalled</span>
                ) : (
                  message.content
                )}
              </p>

              {/* Message Status */}
              <MessageStatus
                status={message.status || 'sent'}
                timestamp={message.createdAt}
                className={`
                  flex justify-end mt-1 
                  text-xs
                  ${isSelf ? 'text-white/75' : currentTheme.mutedText}
                  opacity-60 
                  group-hover/content:opacity-100 
                  transition-opacity
                `}
              />
            </div>

            {/* Message Reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <MessageReactions
                reactions={message.reactions}
                onReact={handleReact}
                currentUserId={currentUser.id}
              />
            )}

            {/* Reply Thread */}
            {message.replies && message.replies.length > 0 && (
              <ReplyThread
                replies={message.replies}
                onViewThread={handleViewThread}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}