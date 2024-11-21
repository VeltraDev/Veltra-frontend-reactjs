import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme, themes } from '@/contexts/ThemeContext';
import { X, Search } from 'lucide-react';

interface ForwardMessageDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (conversationId: string) => void;
}

export default function ForwardMessageDialog({
    isOpen,
    onClose,
    onSubmit
}: ForwardMessageDialogProps) {
    const { theme } = useTheme();
    const currentTheme = themes[theme];
    const [searchTerm, setSearchTerm] = useState('');
    const conversations = useSelector((state: RootState) => state.chat.conversations);
    const currentUser = useSelector((state: RootState) => state.auth.user);

    const filteredConversations = conversations.filter(conversation =>
        conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${currentTheme.bg} rounded-2xl w-full max-w-lg animate-fadeInScale`}>
                <div className={`p-6 border-b ${currentTheme.border}`}>
                    <div className="flex items-center justify-between">
                        <h2 className={`text-xl font-semibold ${currentTheme.headerText}`}>Forward Message</h2>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-xl ${currentTheme.buttonHover} transition-all`}
                        >
                            <X className={currentTheme.iconColor} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.iconColor}`} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search conversations..."
                            className={`w-full ${currentTheme.searchBg} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${currentTheme.searchText} ${currentTheme.searchPlaceholder}`}
                        />
                    </div>

                    {/* Conversation List */}
                    <div className={`max-h-96 overflow-y-auto scrollbar-custom ${currentTheme.input} rounded-xl`}>
                        {filteredConversations.length === 0 ? (
                            <div className="p-4 text-center">
                                <p className={currentTheme.mutedText}>No conversations found</p>
                            </div>
                        ) : (
                            filteredConversations.map(conversation => (
                                <button
                                    key={conversation.id}
                                    onClick={() => onSubmit(conversation.id)}
                                    className={`w-full p-4 flex items-center space-x-4 ${currentTheme.buttonHover} transition-colors`}
                                >
                                    <img
                                        src={conversation.picture || `https://ui-avatars.com/api/?name=${conversation.name}`}
                                        alt={conversation.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1 text-left">
                                        <h3 className={`font-semibold truncate ${currentTheme.headerText}`}>
                                            {conversation.name}
                                        </h3>
                                        <p className={`text-sm truncate ${currentTheme.mutedText}`}>
                                            {conversation.users.length} members
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
