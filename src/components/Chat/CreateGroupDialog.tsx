import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Upload, Users, Search, Image as ImageIcon } from 'lucide-react';
import { useTheme, themes } from '@/contexts/ThemeContext';
import { createConversation } from '@/redux/chatSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { User } from '@/types';
import { fileService } from '@/services/api/fileService';
import { toast } from 'react-hot-toast';

interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGroupDialog({ isOpen, onClose }: CreateGroupDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupPicture, setGroupPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get all unique users from existing conversations
  const conversations = useSelector((state: RootState) => state.chat.conversations || []);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Get unique users, excluding current user
  const allUsers = React.useMemo(() => {
    if (!conversations?.length || !currentUser) return [];

    const userMap = new Map<string, User>();

    conversations.forEach(conv => {
      if (!conv?.users) return; // Skip if users array is undefined

      conv.users.forEach(user => {
        if (user && user.id !== currentUser.id && !userMap.has(user.id)) {
          userMap.set(user.id, user);
        }
      });
    });

    return Array.from(userMap.values());
  }, [conversations, currentUser]);

  // Filter users based on search query
  const filteredUsers = React.useMemo(() => {
    if (!searchQuery.trim()) return allUsers;

    return allUsers.filter(user =>
      !selectedUsers.find(u => u.id === user.id) &&
      (user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allUsers, selectedUsers, searchQuery]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setGroupPicture(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const validateForm = (): boolean => {
    if (selectedUsers.length < 1) {
      setError('Please select at least 1 user');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let pictureUrl: string | undefined;

      // Upload image if selected
      if (groupPicture) {
        try {
          setIsUploading(true);
          const uploadResult = await fileService.upload(groupPicture);
          pictureUrl = uploadResult.data.url;
        } catch (error) {
          console.error('Upload error:', error);
          toast.error('Failed to upload image');
          return;
        } finally {
          setIsUploading(false);
        }
      }

      // Create conversation with correct format
      await dispatch(createConversation({
        users: selectedUsers.map(user => user.id),
        name: selectedUsers.length > 1 ? groupName.trim() || undefined : undefined,
        picture: pictureUrl
      })).unwrap();

      toast.success('Conversation created successfully');
      onClose();
      resetForm();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create conversation';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setGroupName('');
    setSelectedUsers([]);
    setError(null);
    setGroupPicture(null);
    setPreviewUrl(null);
    setSearchQuery('');
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Cleanup preview URL when component unmounts or new file is selected
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${currentTheme.bg} rounded-2xl w-full max-w-lg animate-fadeInScale`}>
        <div className={`p-6 border-b ${currentTheme.border}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold ${currentTheme.headerText}`}>
              {selectedUsers.length > 1 ? 'Create New Group' : 'New Conversation'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl ${currentTheme.buttonHover} transition-all`}
            >
              <X className={currentTheme.iconColor} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Group Picture (Only for group conversations) */}
          {selectedUsers.length > 1 && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Group picture"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-20 h-20 rounded-full ${currentTheme.input} flex items-center justify-center`}>
                    <ImageIcon className={`w-8 h-8 ${currentTheme.iconColor}`} />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className={`
                    absolute bottom-0 right-0 p-1.5 rounded-full
                    ${isUploading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'
                    }
                    text-white transition-colors
                  `}
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div>
                <h3 className={`font-medium ${currentTheme.text}`}>Group Picture</h3>
                <p className={`text-sm ${currentTheme.mutedText}`}>
                  Optional. Max size 5MB
                </p>
              </div>
            </div>
          )}

          {/* Group Name Input (Optional for groups) */}
          {selectedUsers.length > 1 && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${currentTheme.text}`}>
                Group Name (Optional)
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className={`w-full ${currentTheme.input} rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${currentTheme.text}`}
                placeholder="Enter group name"
              />
            </div>
          )}

          {/* Selected Users Count */}
          <div className={`text-sm ${currentTheme.text}`}>
            Selected users: {selectedUsers.length} (minimum 1 required)
          </div>

          {/* User Search */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${currentTheme.text}`}>
              {selectedUsers.length > 1 ? 'Add Members' : 'Select User'}
            </label>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.iconColor}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${currentTheme.searchBg} rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${currentTheme.searchText} ${currentTheme.searchPlaceholder}`}
                placeholder="Search users..."
              />
            </div>

            {/* User List */}
            <div className={`mt-2 ${currentTheme.input} rounded-xl max-h-40 overflow-y-auto scrollbar-custom`}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      setSelectedUsers(prev => [...prev, user]);
                      setSearchQuery('');
                    }}
                    className={`w-full p-2 flex items-center space-x-3 ${currentTheme.buttonHover} transition-all`}
                  >
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}`}
                      alt={user.firstName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className={currentTheme.text}>{user.firstName} {user.lastName}</span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className={currentTheme.mutedText}>
                    {searchQuery ? 'No users found' : 'No users available'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map(user => (
                <div
                  key={user.id}
                  className={`flex items-center space-x-2 ${currentTheme.input} rounded-full pl-2 pr-1 py-1`}
                >
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}`}
                    alt={user.firstName}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className={`text-sm ${currentTheme.text}`}>{user.firstName}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedUsers(prev => prev.filter(u => u.id !== user.id))}
                    className={`p-1 rounded-full ${currentTheme.buttonHover}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={selectedUsers.length === 0 || isLoading || isUploading}
              className={`px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-all
                ${(selectedUsers.length === 0 || isLoading || isUploading) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}
              `}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Conversation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}