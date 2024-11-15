import React, { useRef, useEffect } from 'react';
import { Message } from '@/types';
import MessageItem from './MessageItem';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/contexts/ThemeContext';

interface MessageListProps {
  messages: Message[];
  conversationId: string;
}

export default function MessageList({ messages, conversationId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useTheme();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const typingUsers = useSelector((state: RootState) =>
    state.chat.typingUsers[conversationId] || []
  ).filter(user => user.id !== currentUser?.id); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-1">
        {messages.map((message, index) => {
          const isLastMessageFromSender =
            index === messages.length - 1 ||
            messages[index + 1].sender.id !== message.sender.id;

          const showAvatar = isLastMessageFromSender && message.sender.id !== currentUser?.id;
          const isPrevSenderSame = index > 0 && messages[index - 1].sender.id === message.sender.id;

          return (
            <MessageItem
              key={message.id}
              message={message}
              showAvatar={showAvatar}
              isPrevSenderSame={isPrevSenderSame}
            />
          );
        })}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className={`flex items-center space-x-2 ${currentTheme.input} rounded-xl p-2 w-fit animate-fadeIn`}>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className={`text-sm ${currentTheme.text}`}>
              {typingUsers.length === 1
                ? `${typingUsers[0].firstName} is typing...`
                : `${typingUsers.length} people are typing...`
              }
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}