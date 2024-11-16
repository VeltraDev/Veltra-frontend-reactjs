import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Message } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import MessageActions from './MessageActions';
import MessageReactions from './MessageReactions';
import ReplyThread from './ReplyThread';
import MessageStatus from './MessageStatus';
import { Image, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { RootState } from '@/redux/store';

interface MessageItemProps {
  message: Message;
  showAvatar: boolean;
  isPrevSenderSame: boolean;
  onForward: (message: Message) => void;
}

export default function MessageItem({
  message,
  showAvatar,
  isPrevSenderSame,
  onForward
}: MessageItemProps) {
  const { currentTheme } = useTheme();
  const currentUser = useSelector((state: RootState) => state.auth.user || []);
  const isSelf = message.sender?.id === currentUser.user?.id;
  const [showActions, setShowActions] = React.useState(false);
  const [expandedImage, setExpandedImage] = React.useState<string | null>(null);

  const handleImageClick = (url: string) => {
    setExpandedImage(url);
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  return (
    <>
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
                  onReply={() => { }}
                  onReact={() => { }}
                  onForward={onForward}
                  onEdit={() => { }}
                  onDelete={() => { }}
                  onPin={() => { }}
                  onCopy={() => { }}
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
                    ? `${currentTheme.selfMessage} ${currentTheme.messageTextSelf} rounded-[18px]`
                    : `${currentTheme.otherMessage} rounded-[18px]`
                  }
                  transition-all duration-300
                  hover:shadow-sm
                `}
              >
                {/* Text Content */}
                {message.content && (
                  <p className="leading-relaxed whitespace-pre-wrap break-words mb-2">
                    {message.isRecalled ? (
                      <span className="italic opacity-75">Message has been recalled</span>
                    ) : (
                      message.content
                    )}
                  </p>
                )}

                {/* Files */}
                {message.files && message.files.length > 0 && (
                  <div className="space-y-2">
                    {message.files.map((file, index) => (
                      <div key={index}>
                        {file.type === 'image' ? (
                          <div className="relative group/image">
                            <img
                              src={file.url}
                              alt="Attached image"
                              className="max-w-[300px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => handleImageClick(file.url)}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity rounded-lg">
                              <Image className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDownload(file.url, file.url.split('/').pop() || 'download')}
                            className={`
                              flex items-center space-x-2 p-2 rounded-lg
                              ${currentTheme.input} hover:bg-opacity-80 transition-colors
                            `}
                          >
                            <FileText className="w-5 h-5" />
                            <span className="text-sm truncate max-w-[200px]">
                              {file.url.split('/').pop()}
                            </span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

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
                  onReact={() => { }}
                  currentUserId={currentUser?.id || ''}
                />
              )}

              {/* Reply Thread */}
              {message.replies && message.replies.length > 0 && (
                <ReplyThread
                  replies={message.replies}
                  onViewThread={() => { }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setExpandedImage(null)}
        >
          <img
            src={expandedImage}
            alt="Full size"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </>
  );
}