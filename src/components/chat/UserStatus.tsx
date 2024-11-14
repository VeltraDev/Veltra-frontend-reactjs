import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface UserStatusProps {
    userId: string;
    className?: string;
    showText?: boolean;
}

export default function UserStatus({ userId, className = '', showText = false }: UserStatusProps) {
    const onlineUsers = useSelector((state: RootState) => state.chat.onlineUsers);
    const isOnline = onlineUsers.includes(userId); // Changed from Set.has to array.includes

    return (
        <div className={`flex items-center space-x-1 ${className}`}>
            <div
                className={`
          w-3 h-3 rounded-full 
          ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
          border-2 border-white dark:border-gray-900
        `}
            />
            {showText && (
                <span className="text-sm text-gray-500">
                    {isOnline ? 'Online' : 'Offline'}
                </span>
            )}
        </div>
    );
}