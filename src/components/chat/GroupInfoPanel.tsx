import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
    X, Camera, Edit2, UserPlus, UserMinus, Settings,
    LogOut, Trash2, Bell, BellOff, Star, Archive,
    Share2, Shield, MessageCircle, Check
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Conversation, User } from '@/types';
import { toast } from 'react-hot-toast';
import { conversationService } from '@/services/api/conversationService';
import AddGroupMembersModal from './AddGroupMembersModal';
import { fileService } from '@/services/api/fileService';

interface GroupInfoPanelProps {
    conversation: Conversation;
    currentUser: User;
    onClose: () => void;
}

export default function GroupInfoPanel({
    conversation,
    currentUser,
    onClose
}: GroupInfoPanelProps) {
    const dispatch = useDispatch();
    const { currentTheme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [newGroupName, setNewGroupName] = useState(conversation.name);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddMembers, setShowAddMembers] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isStarred, setIsStarred] = useState(false);
    const [isArchived, setIsArchived] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isAdmin = conversation.admin?.id === currentUser.id;

    // Handle group picture update
    const handleUpdateGroupPicture = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setIsLoading(true);
        try {
            const uploadResult = await fileService.upload(file);
            await conversationService.updateGroupInfo(conversation.id, {
                picture: uploadResult.url
            });
            toast.success('Group picture updated successfully');
        } catch (error) {
            toast.error('Failed to update group picture');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle group name update
    const handleUpdateGroupInfo = async () => {
        if (!newGroupName.trim() || newGroupName === conversation.name) return;

        setIsLoading(true);
        try {
            await conversationService.updateGroupInfo(conversation.id, {
                name: newGroupName.trim()
            });
            toast.success('Group name updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update group name');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle adding users
    const handleAddUsers = async (userIds: string[]) => {
        if (userIds.length === 0) return;

        setIsLoading(true);
        try {
            await conversationService.addUsers(conversation.id, { userIds });
            toast.success('Users added successfully');
            setShowAddMembers(false);
        } catch (error) {
            toast.error('Failed to add users');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle removing users
    const handleRemoveUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to remove this user from the group?')) return;

        setIsLoading(true);
        try {
            await conversationService.removeUsers(conversation.id, {
                userIds: [userId]
            });
            toast.success('User removed successfully');
        } catch (error) {
            toast.error('Failed to remove user');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle leaving group
    const handleLeaveGroup = async () => {
        if (!window.confirm('Are you sure you want to leave this group?')) return;

        setIsLoading(true);
        try {
            await conversationService.leaveGroup(conversation.id);
            toast.success('Left group successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to leave group');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle deleting group
    const handleDeleteGroup = async () => {
        if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) return;

        setIsLoading(true);
        try {
            await conversationService.delete(conversation.id);
            toast.success('Group deleted successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to delete group');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle updating admin
    const handleUpdateAdmin = async (newAdminId: string) => {
        if (!window.confirm('Are you sure you want to transfer group ownership?')) return;

        setIsLoading(true);
        try {
            await conversationService.updateGroupAdmin(conversation.id, {
                adminId: newAdminId
            });
            toast.success('Group admin updated successfully');
        } catch (error) {
            toast.error('Failed to update group admin');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`h-full ${currentTheme.bg} flex flex-col`}>
            {/* Header */}
            <div className={`p-4 border-b ${currentTheme.border} flex items-center justify-between`}>
                <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Group Info</h3>
                <button
                    onClick={onClose}
                    className={`p-2 rounded-xl ${currentTheme.buttonHover}`}
                >
                    <X className={`w-5 h-5 ${currentTheme.iconColor}`} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-custom">
                <div className="p-4 space-y-6">
                    {/* Group Picture */}
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <img
                                src={conversation.picture || `https://ui-avatars.com/api/?name=${conversation.name}`}
                                alt={conversation.name}
                                className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-500/20"
                            />
                            {isAdmin && (
                                <button
                                    onClick={handleUpdateGroupPicture}
                                    className={`
                    absolute inset-0 flex items-center justify-center 
                    bg-black/50 rounded-full opacity-0 group-hover:opacity-100 
                    transition-opacity duration-200
                  `}
                                >
                                    <Camera className="w-6 h-6 text-white" />
                                </button>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Group Name */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${currentTheme.text}`}>Group Name</h4>
                            {isAdmin && !isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className={`p-1.5 rounded-lg ${currentTheme.buttonHover}`}
                                >
                                    <Edit2 className={`w-4 h-4 ${currentTheme.iconColor}`} />
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    className={`
                    flex-1 rounded-lg px-3 py-1.5 text-sm
                    ${currentTheme.input} ${currentTheme.text}
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  `}
                                />
                                <button
                                    onClick={handleUpdateGroupInfo}
                                    disabled={isLoading || !newGroupName.trim() || newGroupName === conversation.name}
                                    className={`
                    p-1.5 rounded-lg transition-colors
                    ${isLoading || !newGroupName.trim() || newGroupName === conversation.name
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                        }
                    text-white
                  `}
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setNewGroupName(conversation.name);
                                    }}
                                    className={`p-1.5 rounded-lg ${currentTheme.buttonHover}`}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <p className={`text-sm ${currentTheme.text}`}>{conversation.name}</p>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            {
                                icon: isMuted ? BellOff : Bell,
                                label: isMuted ? 'Unmute' : 'Mute',
                                onClick: () => setIsMuted(!isMuted)
                            },
                            {
                                icon: Star,
                                label: isStarred ? 'Unstar' : 'Star',
                                onClick: () => setIsStarred(!isStarred)
                            },
                            {
                                icon: Archive,
                                label: isArchived ? 'Unarchive' : 'Archive',
                                onClick: () => setIsArchived(!isArchived)
                            },
                            {
                                icon: Share2,
                                label: 'Share Group',
                                onClick: () => toast.info('Share group feature coming soon')
                            },
                            {
                                icon: Shield,
                                label: 'Report',
                                onClick: () => toast.info('Report feature coming soon')
                            },
                            {
                                icon: MessageCircle,
                                label: 'Start Thread',
                                onClick: () => toast.info('Thread feature coming soon')
                            }
                        ].map((action, index) => (
                            <button
                                key={index}
                                onClick={action.onClick}
                                className={`
                  flex items-center space-x-2 p-2 rounded-xl
                  ${currentTheme.buttonHover} transition-all duration-200
                `}
                            >
                                <action.icon className={`w-5 h-5 ${currentTheme.iconColor}`} />
                                <span className={`text-sm ${currentTheme.text}`}>{action.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Members List */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${currentTheme.text}`}>
                                Members ({conversation.users.length})
                            </h4>
                            {isAdmin && (
                                <button
                                    onClick={() => setShowAddMembers(true)}
                                    className={`p-1.5 rounded-lg ${currentTheme.buttonHover} text-blue-500`}
                                    title="Add Members"
                                >
                                    <UserPlus className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className={`space-y-2 rounded-xl ${currentTheme.input} p-2`}>
                            {conversation.users.map(user => (
                                <div
                                    key={user.id}
                                    className={`
                    flex items-center justify-between p-2 rounded-lg
                    ${currentTheme.buttonHover} transition-all duration-200
                  `}
                                >
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}`}
                                            alt={user.firstName}
                                            className="w-8 h-8 rounded-full ring-2 ring-blue-500/20"
                                        />
                                        <div>
                                            <p className={`text-sm font-medium ${currentTheme.text}`}>
                                                {user.firstName} {user.lastName}
                                                {user.id === conversation.admin?.id && (
                                                    <span className="ml-1.5 text-xs text-blue-500">(Admin)</span>
                                                )}
                                            </p>
                                            <p className={`text-xs ${currentTheme.mutedText}`}>
                                                {user.displayStatus || 'No status'}
                                            </p>
                                        </div>
                                    </div>

                                    {isAdmin && user.id !== currentUser.id && user.id !== conversation.admin?.id && (
                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => handleUpdateAdmin(user.id)}
                                                className={`p-1 rounded-lg ${currentTheme.buttonHover} text-blue-500`}
                                                title="Make Admin"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveUser(user.id)}
                                                className={`p-1 rounded-lg ${currentTheme.buttonHover} text-red-500`}
                                                title="Remove from Group"
                                            >
                                                <UserMinus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className={`p-4 border-t ${currentTheme.border}`}>
                {isAdmin ? (
                    <button
                        onClick={handleDeleteGroup}
                        className={`
              w-full flex items-center justify-center space-x-2 px-3 py-2 
              rounded-lg bg-red-500 hover:bg-red-600 text-white
              transition-all duration-200 hover:shadow-lg
            `}
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Group</span>
                    </button>
                ) : (
                    <button
                        onClick={handleLeaveGroup}
                        className={`
              w-full flex items-center justify-center space-x-2 px-3 py-2
              rounded-lg bg-red-500 hover:bg-red-600 text-white
              transition-all duration-200 hover:shadow-lg
            `}
                    >
                        <LogOut className="w-4 h-4" />
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