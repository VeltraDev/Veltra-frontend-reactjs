import React, { useRef, useEffect } from 'react';
import { Message } from '../../mockData/chatData';
import MessageItem from './MessageItem';
import { useAppSelector } from '@/app/store';

interface MessageListProps {
    avatarUrl?: string;
    typingUser?: any;
}

export default function MessageList({ avatarUrl, typingUser }: MessageListProps) {
    const messages = useAppSelector((state) => state.chat.messages?.data?.messages);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, typingUser]);

    return (
        <div className="flex-1 justify-end overflow-y-auto px-4 scrollbar-custom">
            <div id="messages" className="flex flex-col space-y-1 p-2">
                {messages?.map((message, index) => {
                    const isLastMessageFromSender =
                        index === messages.length - 1 || messages[index + 1].sender.id !== message.sender.id;
                    const showAvatar = isLastMessageFromSender && message.sender.id !== 'self';
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
           
                {typingUser && typingUser.id !== currentUser.id && (
                    <div className="text-gray-500 italic">{typingUser.firstName} Đang nhập...</div>
                )}
            </div>
            <div ref={messagesEndRef} />
        </div>
    );
}
