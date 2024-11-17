import React, { useState, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Conversation } from '@/redux/chatSlice';
import { Search, Plus, Settings, Filter, Users, MessageCircle } from 'lucide-react';
import { useTheme, themes } from '@/contexts/ThemeContext';
import GroupActions from '@/components/chat/GroupActions';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import UserStatus from '@/components/chat/UserStatus';
import CreateGroupDialog from '@/components/chat/CreateGroupDialog';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatListProps {
  conversations: Conversation[];
  activeConversationId: string | undefined;
  onSelectConversation: (id: string) => void;
  isVisible?: boolean;
}

export default function ChatList({
  conversations = [],
  activeConversationId,
  onSelectConversation,
  isVisible = true,
}: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'groups' | 'direct'>('all');
  const [showGroupActions, setShowGroupActions] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const currentUser = useSelector((state: RootState) => state.auth.user?.user);
  const typingUsers = useSelector((state: RootState) => state.chat.typingUsers);
  const onlineUsers = useSelector((state: RootState) => state.chat.onlineUsers);

  const getConversationInfo = (conversation: Conversation) => {
    if (!conversation) return { name: '', otherUser: null };

    if (conversation.isGroup) {
      return {
        name: conversation.name || '',
        picture: conversation.picture || '',
        otherUser: null
      };
    }

    // Đối với cuộc trò chuyện 1-1, lấy thông tin của người còn lại
    const otherUser = conversation.users?.find(user => user.id !== currentUser?.id);
    return {
      name: otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : '',
      picture: otherUser?.avatar || '',
      otherUser
    };
  };







  const formatMessageTime = (timestamp: string | undefined) => {
    if (!timestamp) return ''; // Kiểm tra nếu timestamp bị undefined
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return ''; // Kiểm tra nếu date không hợp lệ
    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting message time:", error);
      return '';
    }
  };


  // Check if a conversation has any online users
  const isConversationOnline = (conversation: Conversation) => {
    if (!conversation) return false;

    // For direct chats, check if the other user is online
    if (!conversation.isGroup) {
      const otherUser = conversation.users.find(u => u.id !== currentUser?.id);
      return otherUser ? onlineUsers.some(u => u.id === otherUser.id) : false;
    }

    // For group chats, check if any member (except current user) is online
    return conversation.users.some(user =>
      user.id !== currentUser?.id && onlineUsers.some(u => u.id === user.id)
    );
  };

  // Get online members count for group chats
  const getOnlineMembersCount = (conversation: Conversation) => {
    if (!conversation.isGroup) return 0;
    return conversation.users.filter(user =>
      user.id !== currentUser?.id && onlineUsers.some(u => u.id === user.id)
    ).length;
  };

  const sortedAndFilteredConversations = useMemo(() => {
    return (conversations || [])
      .filter(conversation => {
        if (!conversation) return false;

        const { name } = getConversationInfo(conversation);
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'all' ||
          (activeFilter === 'groups' && conversation.isGroup) ||
          (activeFilter === 'direct' && !conversation.isGroup);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const timeA = a?.latestMessage?.createdAt ? new Date(a.latestMessage.createdAt).getTime() : 0;
        const timeB = b?.latestMessage?.createdAt ? new Date(b.latestMessage.createdAt).getTime() : 0;
        return timeB - timeA;
      });
  }, [conversations, searchTerm, activeFilter, currentUser?.id]);

  const getTypingText = (conversationId: string) => {
    const typingUsersInConvo = typingUsers[conversationId] || [];
    const otherTypingUsers = typingUsersInConvo.filter(user => user.id !== currentUser?.id);

    if (!otherTypingUsers.length) return null;
    if (otherTypingUsers.length === 1) return `${otherTypingUsers[0].firstName} is typing...`;
    return `${otherTypingUsers.length} people are typing...`;
  };

  return (
    <div className={`
      w-full md:w-96 h-screen ${currentTheme.bg} flex flex-col border-r ${currentTheme.border}
      fixed md:relative
      ${isVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      transition-transform duration-300 ease-in-out
      z-20 md:z-auto
    `}>
      {/* Header */}
      <div className={`p-4 md:p-6 border-b ${currentTheme.border} space-y-4`}>
        <div className="flex items-center justify-between">
          <h1 className={`text-xl md:text-2xl font-bold ${currentTheme.headerText}`}>
            Messages
          </h1>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateGroup(true)}
              className={`p-2 ${currentTheme.buttonHover} rounded-xl transition-colors`}
            >
              <Plus className={currentTheme.iconColor} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 ${currentTheme.buttonHover} rounded-xl transition-colors`}
            >
              <Filter className={currentTheme.iconColor} />
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.iconColor}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className={`
              w-full pl-10 pr-4 py-2 rounded-xl
              ${currentTheme.input} ${currentTheme.text}
              focus:outline-none focus:ring-2 focus:ring-blue-500/50
              transition-all duration-200
            `}
          />
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex space-x-2"
            >
              {[
                { id: 'all', label: 'All', icon: MessageCircle },
                { id: 'groups', label: 'Groups', icon: Users },
                { id: 'direct', label: 'Direct', icon: MessageCircle }
              ].map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter.id as 'all' | 'groups' | 'direct')}
                  className={`
                    flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm
                    transition-all duration-200
                    ${activeFilter === filter.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : `${currentTheme.buttonHover} ${currentTheme.text}`
                    }
                  `}
                >
                  <filter.icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {sortedAndFilteredConversations.map((conversation) => {
            if (!conversation) return null;

            const { name, picture, otherUser } = getConversationInfo(conversation);
            const isActive = conversation.id === activeConversationId;
            const typingText = getTypingText(conversation.id);
            const isOnline = isConversationOnline(conversation);
            const onlineMembersCount = getOnlineMembersCount(conversation);

            return (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => onSelectConversation(conversation.id)}
                className={`
        relative p-4 flex items-center space-x-4 cursor-pointer
        ${isActive ? currentTheme.activeItem : currentTheme.buttonHover}
        border-b ${currentTheme.border}
        transition-colors duration-200
      `}
              >
                {/* Avatar */}
                <div className="relative">
                  <div className={`
          relative w-12 h-12 rounded-full overflow-hidden
          ${isActive ? 'ring-2 ring-blue-500' : ''}
          transition-all duration-200
        `}>
                    <img
                      src={picture || `https://ui-avatars.com/api/?name=${name}`}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {!conversation.isGroup && (
                    <div className={`
            absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full
            ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
            border-2 border-white dark:border-gray-900
            transition-all duration-200
          `} />
                  )}

                  {conversation.isGroup && (
                    <div className={`
            absolute -bottom-1 -right-1 bg-blue-500 rounded-full px-1.5 py-0.5
            border-2 border-white dark:border-gray-900
            transition-all duration-200
          `}>
                      <span className="text-xs text-white font-medium">
                        {onlineMembersCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className={`font-semibold truncate ${currentTheme.text}`}>
                      {name}
                    </h3>
                    {conversation.latestMessage?.createdAt
                      ? formatMessageTime(conversation.latestMessage.createdAt)
                      : 'No recent messages'}
                  </div>
                  <p className={`text-sm truncate ${typingText ? 'text-blue-500 font-medium' : currentTheme.mutedText}`}>
                    {typingText || (conversation.latestMessage?.sender?.id === currentUser?.id ? 'You: ' : '')}
                    {conversation.latestMessage?.content || 'No messages yet'}
                  </p>
                </div>
              </motion.div>
            );
          })}

        </AnimatePresence>
      </div>

      {/* Create Group Dialog */}
      <CreateGroupDialog
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
      />
    </div>
  );
}