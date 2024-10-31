import React from 'react';
import { Conversation } from '../../mockData/chatData';

interface ConversationItemProps {
    conversation: Conversation;
    isActive: boolean;
    onSelect: () => void;
    typingUser: { id: string; conversationId: string } | null;

}

export default function ConversationItem({ conversation, isActive, onSelect, typingUser }: ConversationItemProps) {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');


    const isTyping = typingUser && typingUser.conversationId === conversation.id && typingUser.id !== currentUser.id;

    return (
        <li>
            <div
                className={`flex items-center space-x-3 py-2 px-6 cursor-pointer ${isActive ? 'bg-secondary' : 'hover:bg-[#0a0a0a] transition-colors duration-200'}`}
                onClick={onSelect}
            >
                <img
                    src={conversation?.picture || 'https://haycafe.vn/wp-content/uploads/2022/01/Hinh-nen-Minecraft-dep-nhat-the-gioi.jpg'}
                    className='size-14 rounded-full object-cover'
                    alt={`${conversation?.name}'s avatar`}
                />
                <div className='flex flex-col overflow-hidden'>
                    <p className='text-[0.9rem] font-medium text-white truncate'>{conversation?.name}</p>
                    <p className='text-xs text-[#a8a8a8] w-[397px] truncate'>
                        {conversation?.latestMessage ? (
                            conversation.latestMessage.sender.id === currentUser.id 
                                ? `Bạn: ${conversation.latestMessage.content}`
                                : conversation.latestMessage.content
                        ) : (
                            "Chưa có tin nhắn nào"
                        )}

                    </p>
                    {isTyping && <p className='text-xs text-[#a8a8a8]'>Đang nhập...</p>}
                </div>
            </div>
        </li>
    );
}
