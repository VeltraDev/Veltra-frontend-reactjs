import { InfoIcon, PhoneIcon, SmileIcon, VideoIcon } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';
import { Conversation, Message } from '../../mockData/chatData';
import { format } from 'date-fns';

interface ChatSectionProps {
    conversation: Conversation | null;
    messages: Message[];
    onSendMessage: (content: string) => void;
    currentUserId: string | null;
}

export default function ChatSection({ conversation, onSendMessage, messages, currentUserId }: ChatSectionProps) {
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            onSendMessage(inputMessage);
            setInputMessage('');
        }
    };

    const toggleMessageDetails = (messageId: string) => {
        setSelectedMessageId((prevId) => (prevId === messageId ? null : messageId));
    };

    if (!conversation) {
        return <div className="flex-1 flex items-center justify-center">Chọn một cuộc trò chuyện</div>;
    }

    return (
        <div className="flex-1 font-nanum flex flex-col h-screen">
            {/* Header Section */}
            <div className="sticky top-0 z-10 flex sm:items-center justify-between py-2 px-4 border-b-[1px] border-gray-900 bg-black">
                <div className="relative flex items-center space-x-4">
                    <div className="flex items-center space-x-3 p-2 rounded-lg">
                        <img src={conversation.picture} className="w-12 h-12 rounded-full object-cover cursor-pointer" alt="User avatar" />
                        <div className="flex flex-col">
                            <p className="text-[0.9rem] font-semibold leading-5 text-white cursor-pointer">{conversation.name}</p>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                                <p className="text-xs text-gray-400 truncate cursor-pointer">Đang hoạt động</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <PhoneIcon className="size8 text-white hover:bg-gray-300 focus:outline-none" />
                    <VideoIcon className="size8 text-white hover:bg-gray-300 focus:outline-none" />
                    <InfoIcon className="size8 text-white hover:bg-gray-300 focus:outline-none" />
                </div>
            </div>

            {/* Messages Section */}
            <div className="flex-1 justify-end overflow-y-auto px-4 scrollbar-custom">
                <div id="messages" className="flex flex-col space-y-1 p-2">
                    {messages.map((message, index) => {
                        const isSelf = message.sender.id === currentUserId;
                        const isLastMessageFromSender =
                            index === messages.length - 1 || messages[index + 1].sender.id !== message.sender.id;
                        const showAvatar = !isSelf && isLastMessageFromSender;

                        const formattedDate = format(new Date(message.createdAt), 'dd/MM/yyyy HH:mm');

                        return (
                            <div key={message.id} className={`chat-message ${isSelf ? 'flex justify-end' : 'flex'}`}>
                                <div className={`flex ${isSelf ? 'justify-end' : 'items-end'}`}>
                                    {/* Avatar for the other user */}
                                    {!isSelf && (
                                        <div className="w-7 mr-[5px] flex-shrink-0">
                                            {showAvatar && <img src={conversation.picture} alt="User profile" className="w-7 h-7 rounded-full" />}
                                        </div>
                                    )}

                                    {/* Message content */}
                                    <div className={`flex flex-col text-[0.95rem] font-light max-w-[564px] ${!isSelf ? 'ml-[5px]' : ''}`}>
                                        <div className="relative group">
                                            <div
                                                className={`${isSelf
                                                    ? 'bg-[#3797F0] text-white'
                                                    : 'bg-secondary text-white'
                                                    } text-sm px-[0.75rem] py-[0.44rem] rounded-3xl inline-block break-all ${message.content.length > 75 ? 'rounded-[18px_18px_4px]' : ''}`}
                                            >
                                                {message.content}
                                            </div>
                                            <span className="absolute right-1 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                {formattedDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <form onSubmit={handleSendMessage} className="relative flex p-2 px-4 leading-5 mt-2">
                <span className="absolute inset-y-0 flex items-center">
                    <SmileIcon className="size8 left-4 absolute text-white hover:bg-gray-300 focus:outline-none" />
                </span>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Nhắn tin..."
                    className="w-full focus:outline-none focus:placeholder-textSecondary text-white border-secondary border-[2px] placeholder-gray-400 text-sm pl-12 bg-black rounded-3xl py-3"
                />
                <button type="submit" className="absolute right-7 flex items-center inset-y-0 sm:flex">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </form>
        </div>
    );
}
