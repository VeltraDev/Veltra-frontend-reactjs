import React from 'react';
import { Message } from '../../mockData/chatData';

interface MessageItemProps {
    message: Message;
    showAvatar: boolean;
    isPrevSenderSame: boolean;
}

export default function MessageItem({ message, showAvatar, isPrevSenderSame }: MessageItemProps) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isSelf = message.sender.id === user.id;

    return (
        <div
            key={message.id}
            className={`chat-message ${isSelf ? 'flex justify-end' : 'flex'}`}
            style={{ marginTop: isPrevSenderSame ? '4px' : '17px' }}
        >
            <div className={`flex ${isSelf ? 'justify-end' : 'items-end'}`}>
           
                {message.sender.id !== user.id && showAvatar && (
                    <div className="w-7 flex-shrink-0">
                        <img src={message.senderAvatar} alt="User profile" className="w-7 h-7 rounded-full" />
                    </div>
                )}

                <div
                    className={`flex flex-col text-[0.95rem] font-light max-w-[564px] ${isSelf ? '' : showAvatar ? 'ml-[5px]' : 'ml-[33px]'
                        }`}
                >
                    <div className="relative group">
                        <div
                            className={`${isSelf ? 'bg-[#3797F0]' : 'bg-secondary'} text-sm text-white px-[0.75rem] py-[0.44rem] rounded-3xl inline-block ${message.content.length > 75 ? 'rounded-[18px_18px_4px]' : ''
                                }`}
                        >
                            {message.content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
