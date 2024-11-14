import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
    Search, Filter, Archive, Star, Trash2, MoreHorizontal,
    ChevronDown, MessageSquare, Phone, Video, Link2, Image,
    Send, Smile, Paperclip, Mic, Check, CheckCheck
} from 'lucide-react';

// Mock data
const mockChats = [
    {
        id: '1',
        name: 'Alice Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastMessage: 'Hey, how are you doing?',
        time: '2m ago',
        unread: 3,
        online: true
    },
    {
        id: '2',
        name: 'Web3 Development Team',
        avatar: 'https://i.pravatar.cc/150?img=2',
        lastMessage: 'New smart contract deployed! 🚀',
        time: '5m ago',
        unread: 1,
        isGroup: true,
        members: ['Alice', 'Bob', 'Charlie']
    },
    // Add more mock chats...
];

const mockMessages = [
    {
        id: '1',
        sender: 'Alice Johnson',
        content: 'Hey, how are you doing?',
        time: '2:30 PM',
        status: 'read'
    },
    {
        id: '2',
        sender: 'me',
        content: 'Im good! Just finished reviewing the new smart contract.',
        time: '2:31 PM',
        status: 'read'
    },
    {
        id: '3',
        sender: 'Alice Johnson',
        content: 'Great! Did you check the gas optimization?',
        time: '2:32 PM',
        status: 'received'
    }
];

export default function DashboardMessages() {
    const { currentTheme } = useTheme();
    const [selectedChat, setSelectedChat] = useState(mockChats[0]);
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Chat List */}
            <div className={`w-80 border-r ${currentTheme.border} flex flex-col`}>
                {/* Search Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.iconColor}`} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className={`
                w-full pl-10 pr-4 py-2 rounded-xl
                ${currentTheme.input} ${currentTheme.text}
                focus:outline-none focus:ring-2 focus:ring-blue-500/50
              `}
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {mockChats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={`
                w-full p-4 flex items-center space-x-3
                ${selectedChat.id === chat.id ? currentTheme.activeItem : currentTheme.buttonHover}
                border-b ${currentTheme.border}
                transition-colors duration-200
              `}
                        >
                            <div className="relative">
                                <img
                                    src={chat.avatar}
                                    alt={chat.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                {chat.online && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h3 className={`font-semibold truncate ${currentTheme.text}`}>
                                        {chat.name}
                                    </h3>
                                    <span className={`text-xs ${currentTheme.mutedText}`}>{chat.time}</span>
                                </div>
                                <p className={`text-sm truncate ${currentTheme.mutedText}`}>
                                    {chat.lastMessage}
                                </p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                                    {chat.unread}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className={`p-4 border-b ${currentTheme.border} flex items-center justify-between`}>
                    <div className="flex items-center space-x-4">
                        <img
                            src={selectedChat.avatar}
                            alt={selectedChat.name}
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <h2 className={`font-semibold ${currentTheme.text}`}>{selectedChat.name}</h2>
                            {selectedChat.isGroup ? (
                                <p className={`text-sm ${currentTheme.mutedText}`}>
                                    {selectedChat.members?.join(', ')}
                                </p>
                            ) : (
                                <p className={`text-sm ${currentTheme.mutedText}`}>Online</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button className={`p-2 rounded-lg ${currentTheme.buttonHover}`}>
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className={`p-2 rounded-lg ${currentTheme.buttonHover}`}>
                            <Video className="w-5 h-5" />
                        </button>
                        <button className={`p-2 rounded-lg ${currentTheme.buttonHover}`}>
                            <Search className="w-5 h-5" />
                        </button>
                        <button className={`p-2 rounded-lg ${currentTheme.buttonHover}`}>
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {mockMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`
                  max-w-[70%] rounded-2xl px-4 py-2
                  ${msg.sender === 'me'
                                        ? 'bg-blue-500 text-white'
                                        : `${currentTheme.input} ${currentTheme.text}`
                                    }
                `}
                            >
                                <p>{msg.content}</p>
                                <div className="flex items-center justify-end space-x-1 mt-1">
                                    <span className="text-xs opacity-75">{msg.time}</span>
                                    {msg.sender === 'me' && (
                                        msg.status === 'read' ? (
                                            <CheckCheck className="w-4 h-4 opacity-75" />
                                        ) : (
                                            <Check className="w-4 h-4 opacity-75" />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className={`p-4 border-t ${currentTheme.border}`}>
                    <div className={`flex items-center space-x-2 ${currentTheme.input} rounded-xl p-2`}>
                        <button className={`p-2 rounded-lg ${currentTheme.buttonHover}`}>
                            <Smile className="w-5 h-5" />
                        </button>
                        <button className={`p-2 rounded-lg ${currentTheme.buttonHover}`}>
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent focus:outline-none"
                        />
                        {message ? (
                            <button className="p-2 rounded-lg bg-blue-500 text-white">
                                <Send className="w-5 h-5" />
                            </button>
                        ) : (
                            <button className={`p-2 rounded-lg ${currentTheme.buttonHover}`}>
                                <Mic className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}