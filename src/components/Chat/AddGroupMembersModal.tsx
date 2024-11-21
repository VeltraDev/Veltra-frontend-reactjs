import React, { useState, useMemo } from 'react';
import { X, Search, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Conversation, User } from '@/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { motion, AnimatePresence } from 'framer-motion';

interface AddGroupMembersModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userIds: string[]) => void;
    conversation: Conversation;
    isLoading?: boolean;
}

export default function AddGroupMembersModal({
    isOpen,
    onClose,
    onSubmit,
    conversation,
    isLoading = false
}: AddGroupMembersModalProps) {
    const { currentTheme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    // Get current user and all users from Redux store
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const conversations = useSelector((state: RootState) => state.chat.conversations);

    // Get all unique users from conversations
    const allUsers = useMemo(() => {
        const userMap = new Map<string, User>();

        conversations.forEach(conv => {
            conv.users.forEach(user => {
                if (user.id !== currentUser?.id && !userMap.has(user.id)) {
                    userMap.set(user.id, user);
                }
            });
        });

        return Array.from(userMap.values());
    }, [conversations, currentUser]);

    // Filter users based on search and current members
    const filteredUsers = useMemo(() => {
        return allUsers.filter(user => {
            // Check if user is already a member
            const isAlreadyMember = conversation.users.some(member => member.id === user.id);

            // Check if user matches search term
            const matchesSearch =
                user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            // Only show users who are not members and match search
            return !isAlreadyMember && matchesSearch;
        });
    }, [allUsers, conversation.users, searchTerm]);

    const handleSubmit = () => {
        onSubmit(selectedUsers);
        setSelectedUsers([]);
        setSearchTerm('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`${currentTheme.bg} rounded-xl max-w-md w-full overflow-hidden`}
            >
                {/* Header */}
                <div className={`p-4 border-b ${currentTheme.border}`}>
                    <div className="flex items-center justify-between">
                        <h2 className={`text-lg font-semibold ${currentTheme.text}`}>Add Members</h2>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-lg ${currentTheme.buttonHover}`}
                        >
                            <X className={`w-5 h-5 ${currentTheme.iconColor}`} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.iconColor}`} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search users..."
                            className={`
                w-full pl-10 pr-4 py-2 rounded-lg
                ${currentTheme.input} ${currentTheme.text}
                focus:outline-none focus:ring-2 focus:ring-blue-500/50
              `}
                        />
                    </div>

                    {/* Selected Users */}
                    {selectedUsers.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selectedUsers.map(userId => {
                                const user = allUsers.find(u => u.id === userId);
                                if (!user) return null;

                                return (
                                    <motion.div
                                        key={user.id}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className={`
                      flex items-center space-x-2 px-2 py-1 rounded-full
                      ${currentTheme.input} border ${currentTheme.border}
                    `}
                                    >
                                        <img
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}`}
                                            alt={user.firstName}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className={`text-sm ${currentTheme.text}`}>
                                            {user.firstName}
                                        </span>
                                        <button
                                            onClick={() => setSelectedUsers(prev => prev.filter(id => id !== user.id))}
                                            className={`p-1 rounded-full ${currentTheme.buttonHover}`}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* User List */}
                    <div className={`max-h-96 overflow-y-auto scrollbar-custom ${currentTheme.input} rounded-lg`}>
                        <AnimatePresence>
                            {filteredUsers.length === 0 ? (
                                <div className="p-4 text-center">
                                    <p className={currentTheme.mutedText}>No users found</p>
                                </div>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`
                      flex items-center justify-between p-3
                      ${currentTheme.buttonHover} transition-colors
                      ${selectedUsers.includes(user.id) ? 'bg-blue-500/10' : ''}
                    `}
                                    >
                                        
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}`}
                                                alt={user.firstName}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <p className={`font-medium ${currentTheme.text}`}>
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className={`text-sm ${currentTheme.mutedText}`}>
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (selectedUsers.includes(user.id)) {
                                                    setSelectedUsers(prev => prev.filter(id => id !== user.id));
                                                } else {
                                                    setSelectedUsers(prev => [...prev, user.id]);
                                                }
                                            }}
                                            className={`
                        p-2 rounded-lg transition-colors
                        ${selectedUsers.includes(user.id)
                                                    ? 'bg-blue-500 text-white'
                                                    : currentTheme.buttonHover
                                                }
                      `}
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className={`px-4 py-2 rounded-lg ${currentTheme.buttonHover}`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={selectedUsers.length === 0 || isLoading}
                            className={`
                px-4 py-2 rounded-lg bg-blue-500 text-white
                transition-colors
                ${selectedUsers.length === 0 || isLoading
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-blue-600'
                                }
              `}
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Adding...</span>
                                </div>
                            ) : (
                                `Add ${selectedUsers.length} member${selectedUsers.length !== 1 ? 's' : ''}`
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}