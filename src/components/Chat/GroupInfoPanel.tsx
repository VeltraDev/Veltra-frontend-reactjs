import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  X, Camera, Edit2, UserPlus, UserMinus, Settings,
  LogOut, Trash2, Bell, BellOff, Star, Archive,
  Share2, Shield, MessageCircle, Check, Users
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { getConversations } from '@/redux/chatSlice';
import { Conversation, User } from '@/types';
import { toast } from 'react-hot-toast';
import { conversationService } from '@/services/api/conversationService';
import AddGroupMembersModal from './AddGroupMembersModal';
import { fileService } from '@/services/api/fileService';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '@/redux/store';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface GroupInfoPanelProps {
    onClose: () => void;
}

export default function GroupInfoPanel({ onClose }: GroupInfoPanelProps) {
  const dispatch = useDispatch();
  const { currentTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [showConfirmTransferAdmin, setShowConfirmTransferAdmin] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [newAdminId, setNewAdminId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user?.user?.id);
  const conversation = useSelector((state: RootState) => state.chat?.activeConversation || {});

  const isAdmin = conversation?.admin?.id === currentUser;

  const handleUpdateGroupPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      fileService.validateFile(file);
      const uploadResult = await fileService.upload(file);
      console.log(uploadResult);
      await conversationService.updateGroupInfo(conversation.id, {
        picture: uploadResult.data.url
      });
      toast.success('Group picture updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update group picture');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleRemoveUser = (userId: string) => {
    setUserToDelete(conversation.users.find(user => user.id === userId) || null);
    setShowConfirmDelete(true);
  };

  const confirmRemoveUser = async () => {
    if (!userToDelete) return;

    setIsLoading(true);
    try {
      await conversationService.removeUsers(conversation.id, {
        userIds: [userToDelete.id]
      });
      toast.success('User removed successfully');
      setShowConfirmDelete(false);
      setUserToDelete(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAdmin = (newAdminId: string) => {
    setNewAdminId(newAdminId);
    setShowConfirmTransferAdmin(true);
  };

  const confirmUpdateAdmin = async () => {
    if (!newAdminId) return;

    setIsLoading(true);
    try {
      await conversationService.updateGroupAdmin(conversation.id, {
        adminId: newAdminId
      });
      toast.success('Group admin updated successfully');
      setShowConfirmTransferAdmin(false);
      setNewAdminId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update group admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveGroup = () => {
    setShowConfirmLeave(true);
  };

  const confirmLeaveGroup = async () => {
    setIsLoading(true);
    try {
      await conversationService.leaveGroup(conversation.id);
      toast.success('Left group successfully');
      dispatch(getConversations());
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to leave group');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = () => {
    setShowConfirmDelete(true);
  };

  const confirmDeleteGroup = async () => {
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

  useEffect(() => {
    if (conversation?.name) {
      setNewGroupName(conversation.name);
    }
  }, [conversation]);

  if (!conversation) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={`h-full ${currentTheme.bg} flex flex-col`}>
        {/* Header */}
        <div className={`p-5 border-b ${currentTheme.border} flex items-center justify-between`}>
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
                    onClick={() => fileInputRef.current?.click()}
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
                  onChange={handleUpdateGroupPicture}
                  className="hidden"
                />
              </div>
            </div>

            {/* Group Name */}
            <div className="space-y-2">
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
                <div className="flex items-center justify-between">
                  <h4
                    className={`font-medium ${currentTheme.text} max-w-60 overflow-hidden text-ellipsis whitespace-nowrap`}>
                    {conversation.name}
                  </h4>
                  {isAdmin && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`p-1.5 rounded-lg ${currentTheme.buttonHover}`}
                    >
                      <Edit2 className={`w-4 h-4 ${currentTheme.iconColor}`} />
                    </button>
                  )}
                </div>
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
                <AnimatePresence>
                  {conversation.users.map(user => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
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
                            {user.id === currentUser.id && (
                              <span className="ml-1.5 text-xs text-green-500">(You)</span>
                            )}
                          </p>
                          <p className={`text-xs ${currentTheme.mutedText}`}>
                            {user.displayStatus || 'No status'}
                          </p>
                        </div>
                      </div>

                      {isAdmin && user.id !== currentUser.id && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleUpdateAdmin(user.id)}
                            className={`p-1 rounded-lg ${currentTheme.buttonHover} text-blue-500`}
                            title="Make Admin"
                          >
                            <Shield className="w-4 h-4" />
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
                    </motion.div>
                  ))}
                </AnimatePresence>
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
      </div>

      {/* Add Members Modal */}
      <AddGroupMembersModal
        isOpen={showAddMembers}
        onClose={() => setShowAddMembers(false)}
        onSubmit={handleAddMembers}
        conversation={conversation}
        isLoading={isLoading}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={confirmRemoveUser}
        title="Confirm Delete"
        description={`Are you sure you want to remove ${userToDelete?.firstName} ${userToDelete?.lastName} from the group?`}
      />

      {/* Confirm Leave Group Modal */}
      <ConfirmDeleteModal
        isOpen={showConfirmLeave}
        onClose={() => setShowConfirmLeave(false)}
        onConfirm={confirmLeaveGroup}
        title="Leave Group"
        description="Are you sure you want to leave this group?"
      />

      {/* Confirm Transfer Admin Modal */}
      <ConfirmDeleteModal
        isOpen={showConfirmTransferAdmin}
        onClose={() => setShowConfirmTransferAdmin(false)}
        onConfirm={confirmUpdateAdmin}
        title="Transfer Admin"
        description="Are you sure you want to transfer group ownership?"
      />
    </>
  );
}