import { InfoIcon, PhoneIcon, SmileIcon, VideoIcon, MoreVertical } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';
import { Conversation, Message } from '../../mockData/chatData';

interface ChatSectionProps {
    conversation: Conversation | null;
    onSendMessage: (content: string) => void;
}

export default function ChatSection({ conversation, onSendMessage }: ChatSectionProps) {
    const [inputMessage, setInputMessage] = React.useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation?.messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            onSendMessage(inputMessage);
            setInputMessage('');
        }
    };

    const toggleMessageDetails = (messageId: string) => {
        setSelectedMessageId(prevId => prevId === messageId ? null : messageId);
    };

    if (!conversation) {
        return <div className="flex-1 p-2 font-normal pl-3 justify-center items-center flex flex-col h-screen">
            <p className="text-gray-400">Select a conversation to start chatting</p>
        </div>;
    }

    return (
        <div className="flex-1  font-nanum  flex flex-col  h-screen">
        
            <div className="sticky top-0 z-10 flex sm:items-center justify-between py-2 px-4 border-b-[1px] border-gray-900 bg-black">
                <div className="relative flex items-center space-x-4 ">
                    <div className='flex items-center space-x-3 p-2 rounded-lg '>
                        <img src={conversation.user.avatar} className='w-12 h-12 rounded-full object-cover cursor-pointer' alt="User avatar" />
                        <div className='flex flex-col'>
                            <p className='text-[0.9rem] font-semibold leading-5 text-white cursor-pointer'>{conversation.user.name}</p>
                            <div className='flex items-center'>
                                <div className='w-2 h-2 rounded-full bg-green-500 mr-1'></div>
                                <p className='text-xs text-gray-400 truncate cursor-pointer'>Đang hoạt động</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <PhoneIcon className='size8 text-white hover:bg-gray-300 focus:outline-none' />
                    <VideoIcon className='size8 text-white hover:bg-gray-300 focus:outline-none' />
                    <InfoIcon className='size8 text-white hover:bg-gray-300 focus:outline-none' />
                </div>
            </div>
            
            <div className="flex-1 justify-end overflow-y-auto px-4 scrollbar-custom">
                
                <div id="messages" className="flex flex-col space-y-1 p-2">
                    {conversation.messages.map((message, index) => {
                        const isLastMessageFromSender = index === conversation.messages.length - 1 ||
                            conversation.messages[index + 1].sender !== message.sender;
                        const showAvatar = message.sender !== 'self' && isLastMessageFromSender;
                        return (
                            <div key={message.id} className={`chat-message ${message.sender === 'self' ? 'flex justify-end' : 'flex'}`}>
                                <div className={`flex ${message.sender === 'self' ? 'justify-end' : 'items-end'}`}>
                                    {message.sender !== 'self' && (
                                        <div className="w-7 mr-[5px] flex-shrink-0">
                                            {showAvatar && <img src={conversation.user.avatar} alt="User profile" className="w-7 h-7 rounded-full" />}
                                        </div>
                                    )}
                                    <div className={`flex flex-col text-[0.95rem] font-light max-w-[564px] ${message.sender !== 'self' ? 'ml-[5px]' : ''}`}>
                                        <div className="relative group">
                                            <div className={`${message.sender === 'self' ? 'bg-[#3797F0]' : 'bg-secondary'} text-sm text-white px-[0.75rem] py-[0.44rem] rounded-3xl inline-block ${message.content.length > 75 ? 'rounded-[18px_18px_4px]' : ''}`}>
                                                {message.content}
                                            </div>
                                         
                                        </div>
                                       
                                    </div>
                                   
                                </div>
                                
                            </div>
                        );
                    })}
                </div>
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="relative flex p-2 px-4 leading-5 mt-2">
                <span className="absolute inset-y-0 flex items-center">
                    <SmileIcon className='size8 left-4 absolute text-white hover:bg-gray-300 focus:outline-none' />
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