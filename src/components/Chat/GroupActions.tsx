import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Conversation, User } from '@/types';
import { conversationService } from '@/services/api/conversationService';
import { fileService } from '@/services/api/fileService';
import { toast } from 'react-hot-toast';
import {
    Settings,
    Users,
    Camera,
    UserPlus,
    Shield,
    BellOff,
    Star,
    Archive,
    LogOut,
    Trash2,
    Check,
    Pencil
} from 'lucide-react';
import AddGroupMembersModal from './AddGroupMembersModal';

interface GroupActionsProps {
    conversation: Conversation;
    currentUser: User;
    onClose: () => void;
}

export default function GroupActions({
    conversation,
    currentUser,
    onClose
}: GroupActionsProps) {
    const { currentTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [showAddMembers, setShowAddMembers] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newGroupName, setNewGroupName] = useState(conversation.name);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isAdmin = conversation.admin?.id === currentUser.id;

    const handleUpdateGroupName = async () => {
        if (!newGroupName.trim() || newGroupName === conversation.name) {
            setIsEditing(false);
            return;
        }

        setIsLoading(true);
        try {
            await conversationService.updateGroupInfo(conversation.id, {
                name: newGroupName.trim()
            });
            toast.success('Group name updated successfully');
            setIsEditing(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to update group name');
            setNewGroupName(conversation.name);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateGroupPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        try {
            fileService.validateFile(file);
            const uploadResult = await fileService.upload(file);
            await conversationService.updateGroupInfo(conversation.id, {
                picture: uploadResult.url
            });
            toast.success('Group picture updated successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update group picture');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddMembers = async (userIds: string[]) => {
        if (userIds.length === 0) return;

        setIsLoading(true);
        try {
            await conversationService.addUsers(conversation.id, { userIds });
            toast.success('Members added successfully');
            setShowAddMembers(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to add members');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateAdmin = async (newAdminId: string) => {
        if (!window.confirm('Are you sure you want to transfer group ownership?')) return;

        setIsLoading(true);
        try {
            await conversationService.updateGroupAdmin(conversation.id, {
                adminId: newAdminId
            });
            toast.success('Group admin updated successfully');
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update group admin');
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

    const items = [
        {
            icon: Users,
            name: 'View Members',
            onClick: () => setShowAddMembers(true)
        },
        {
            icon: Pencil,
            name: 'Update Name',
            onClick: () => setIsEditing(true),
            adminOnly: true
        },
        {
            icon: Camera,
            name: 'Update Picture',
            onClick: () => fileInputRef.current?.click(),
            adminOnly: true
        },
        {
            icon: UserPlus,
            name: 'Add Members',
            onClick: () => setShowAddMembers(true),
            adminOnly: true
        },
        {
            icon: Shield,
            name: 'Update Admin',
            onClick: () => {
                const newAdmin = conversation.users.find(u => u.id !== currentUser.id);
                if (newAdmin) {
                    handleUpdateAdmin(newAdmin.id);
                }
            },
            adminOnly: true
        },
        {
            icon: BellOff,
            name: 'Mute Notifications',
            onClick: () => toast.info('Mute notifications coming soon')
        },
        {
            icon: Star,
            name: 'Star Conversation',
            onClick: () => toast.info('Star conversation coming soon')
        },
        {
            icon: Archive,
            name: 'Archive',
            onClick: () => toast.info('Archive coming soon')
        },
        isAdmin ? {
            icon: Trash2,
            name: 'Delete Group',
            onClick: handleDeleteGroup,
            customStyle: 'text-red-500 hover:bg-red-500/10'
        } : {
            icon: LogOut,
            name: 'Leave Group',
            onClick: handleLeaveGroup,
            customStyle: 'text-red-500 hover:bg-red-500/10'
        }
    ].filter(item => !item.adminOnly || isAdmin);

    const list = {
        visible: {
            clipPath: "inset(0% 0% 0% 0% round 12px)",
            transition: {
                type: "spring",
                bounce: 0,
                duration: 0.3
            }
        },
        hidden: {
            clipPath: "inset(10% 50% 90% 50% round 12px)",
            transition: {
                type: "spring",
                bounce: 0,
                duration: 0.3
            }
        }
    };

    const itemVariants = {
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                duration: 0.2,
                delay: i * 0.1
            }
        }),
        hidden: {
            opacity: 0,
            scale: 0.3,
            filter: "blur(20px)"
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={list}
                    className={`${currentTheme.bg} rounded-xl max-w-xs w-full overflow-hidden border ${currentTheme.border}`}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            className="w-full flex items-center justify-between"
                            onClick={onClose}
                        >
                            <div className="flex flex-col items-start">
                                <span className={`text-lg font-semibold ${currentTheme.text}`}>
                                    Group Settings
                                </span>
                                <span className={`text-sm ${currentTheme.mutedText}`}>
                                    {conversation.name}
                                </span>
                            </div>
                            <Settings className={`w-5 h-5 ${currentTheme.iconColor}`} />
                        </motion.button>
                    </div>

                    {/* Group Name Edit */}
                    {isEditing && (
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    className={`
                    flex-1 px-3 py-1.5 rounded-lg text-sm
                    ${currentTheme.input} ${currentTheme.text}
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  `}
                                    placeholder="Enter new group name"
                                />
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleUpdateGroupName}
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
                                </motion.button>
                            </div>
                        </div>
                    )}

                    {/* Actions List */}
                    <div className="p-2">
                        <AnimatePresence>
                            {items.map((item, index) => (
                                <motion.button
                                    key={item.name}
                                    custom={index}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    onClick={item.onClick}
                                    disabled={isLoading}
                                    className={`
                    w-full p-3 rounded-lg flex items-center space-x-3
                    ${currentTheme.buttonHover} ${item.customStyle || currentTheme.text}
                    group transition-colors duration-200
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="flex-1 text-left text-sm font-medium">{item.name}</span>
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Cancel Button */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={onClose}
                            disabled={isLoading}
                            className={`
                w-full p-2 rounded-lg ${currentTheme.buttonHover} ${currentTheme.text} 
                font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
                        >
                            Cancel
                        </motion.button>
                    </div>

                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUpdateGroupPicture}
                        className="hidden"
                    />
                </motion.div>
            </div>

            {/* Add Members Modal */}
            <AddGroupMembersModal
                isOpen={showAddMembers}
                onClose={() => setShowAddMembers(false)}
                onSubmit={handleAddMembers}
                conversation={conversation}
                isLoading={isLoading}
            />
        </>
    );
}