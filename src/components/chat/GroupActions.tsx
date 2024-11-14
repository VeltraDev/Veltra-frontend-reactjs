import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Settings, Users, UserPlus, UserMinus, LogOut, Trash2,
    Edit2, Camera, ChevronDown, Check, X
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Conversation, User } from '@/types';
import { toast } from 'react-hot-toast';
import { conversationService } from '@/services/api/conversationService';
import AddGroupMembersModal from './AddGroupMembersModal';

interface GroupActionsProps {
    conversation: Conversation;
    currentUser: User;
    onClose: () => void;
}

export default function GroupActions({ conversation, currentUser, onClose }: GroupActionsProps) {
    const dispatch = useDispatch();
    const { currentTheme } = useTheme();
    const [showAddMembers, setShowAddMembers] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isAdmin = conversation.admin?.id === currentUser.id;

    const handleAddUsers = async (userIds: string[]) => {
        if (!userIds.length) return;

        setIsLoading(true);
        try {
            await conversationService.addUsers(conversation.id, { userIds });
            toast.success('Users added successfully');
            setShowAddMembers(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to add users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to remove this user from the group?')) return;

        setIsLoading(true);
        try {
            await conversationService.removeUsers(conversation.id, { userIds: [userId] });
            toast.success('User removed successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to remove user');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLeaveGroup = async () => {
        if (!window.confirm('Are you sure you want to leave this group?')) return;

        setIsLoading(true);
        try {
            await conversationService.leaveGroup(conversation.id);
            toast.success('Left group successfully');
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to leave group');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteGroup = async () => {
        if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) return;

        setIsLoading(true);
        try {
            await conversationService.delete(conversation.id);
            toast.success('Group deleted successfully');
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete group');
        } finally {
            setIsLoading(false);
        }
    };
    if (!conversation.isGroup) {
        return null;
    }
    return (
        <div className={`
      absolute right-0 top-full mt-2 w-64 
      ${currentTheme.bg} rounded-xl shadow-lg 
      border ${currentTheme.border} z-50
    `}>
            <div className="p-4 space-y-2">
                {/* Add Members */}
                <button
                    onClick={() => setShowAddMembers(true)}
                    className={`
            w-full flex items-center space-x-3 p-3 rounded-lg
            ${currentTheme.buttonHover} transition-colors
          `}
                >
                    <UserPlus className={`w-5 h-5 ${currentTheme.iconColor}`} />
                    <span className={currentTheme.text}>Add Members</span>
                </button>

                {/* Member List */}
                <div className={`space-y-2 rounded-lg ${currentTheme.input} p-2`}>
                    {conversation.users.map(user => (
                        <div
                            key={user.id}
                            className={`
                flex items-center justify-between p-2 rounded-lg
                ${currentTheme.buttonHover} transition-colors
              `}
                        >
                            <div className="flex items-center space-x-3">
                                <img
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}`}
                                    alt={user.firstName}
                                    className="w-8 h-8 rounded-full"
                                />
                                <div>
                                    <p className={`text-sm font-medium ${currentTheme.text}`}>
                                        {user.firstName} {user.lastName}
                                        {user.id === conversation.admin?.id && (
                                            <span className="ml-1.5 text-xs text-blue-500">(Admin)</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {isAdmin && user.id !== currentUser.id && (
                                <button
                                    onClick={() => handleRemoveUser(user.id)}
                                    className={`p-1.5 rounded-lg ${currentTheme.buttonHover} text-red-500`}
                                    title="Remove from Group"
                                >
                                    <UserMinus className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Leave/Delete Group */}
                {isAdmin ? (
                    <button
                        onClick={handleDeleteGroup}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                        <span>Delete Group</span>
                    </button>
                ) : (
                    <button
                        onClick={handleLeaveGroup}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Leave Group</span>
                    </button>
                )}
            </div>

            {/* Add Members Modal */}
            <AddGroupMembersModal
                isOpen={showAddMembers}
                onClose={() => setShowAddMembers(false)}
                onSubmit={handleAddUsers}
                conversation={conversation}
                isLoading={isLoading}
            />
        </div>
    );
}