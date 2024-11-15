import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Message } from '@/types';
import { X } from 'lucide-react';
import MessageInput from './MessageInput';
import { toast } from 'react-hot-toast';

interface ThreadPanelProps {
    message: Message;
    onClose: () => void;
}

export default function ThreadPanel({ message, onClose }: ThreadPanelProps) {
    const { theme } = useTheme();
    const [replies, setReplies] = useState<Message[]>(message.replies || []);

    const handleReply = (content: string) => {
        toast.info('Thread replies coming soon');
    };

    return (
        <div className={`h-full ${currentTheme.bg} border-l ${currentTheme.border} flex flex-col`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Thread</h3>
                <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
            </div>

            {/* Original Message */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-3">
                    <img
                        src={message.sender.avatar || `https://ui-avatars.com/api/?name=${message.sender.firstName}`}
                        alt={message.sender.firstName}
                        className="w-8 h-8 rounded-full"
                    />
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {message.sender.firstName} {message.sender.lastName}
                            </span>
                            <span className="text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">{message.content}</p>
                    </div>
                </div>
            </div>

            {/* Replies */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {replies.map((reply) => (
                    <div key={reply.id} className="flex items-start space-x-3">
                        <img
                            src={reply.sender.avatar || `https://ui-avatars.com/api/?name=${reply.sender.firstName}`}
                            alt={reply.sender.firstName}
                            className="w-8 h-8 rounded-full"
                        />
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {reply.sender.firstName} {reply.sender.lastName}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(reply.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">{reply.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reply Input */}
            <MessageInput onSendMessage={handleReply} onTyping={() => { }} />
        </div>
    );
}