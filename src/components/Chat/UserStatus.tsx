import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface UserStatusProps {
    userId: string;
    className?: string;
    showText?: boolean;
}

export default function UserStatus({ userId, className = '', showText = false }: UserStatusProps) {
    // Lấy danh sách người dùng online từ Redux store
    const onlineUsers = useSelector((state: RootState) => state.chat.onlineUsers);

    // Kiểm tra nếu người dùng hiện tại đang online
    const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(userId);

    return (
        <div className={`flex items-center space-x-1 ${className}`}>
            {/* Biểu tượng trạng thái online */}
            <div
                className={`
          w-3 h-3 rounded-full 
          ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
          border-2 border-white dark:border-gray-900
        `}
            />
            {/* Hiển thị văn bản nếu cần */}
            {showText && (
                <span className="text-sm text-gray-500">
                    {isOnline ? 'Online' : 'Offline'}
                </span>
            )}
        </div>
    );
}
