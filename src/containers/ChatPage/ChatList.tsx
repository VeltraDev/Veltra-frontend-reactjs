import React, { useEffect, useState, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Conversation } from '@/redux/chatSlice';
import { Search, Plus, Settings, Filter, Users, MessageCircle } from 'lucide-react';
import { useTheme, themes } from '@/contexts/ThemeContext';
import GroupActions from '@/components/chat/GroupActions';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import UserStatus from '@/components/chat/UserStatus';
import CreateGroupDialog from '@/components/chat/CreateGroupDialog';

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
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const typingUsers = useSelector((state: RootState) => state.chat.typingUsers);

  // Sort and filter conversations using useMemo to prevent unnecessary recalculations
  const sortedAndFilteredConversations = useMemo(() => {
    return conversations
      .filter(conversation => {
        if (!conversation?.name) return false;

        const matchesSearch = conversation.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'all' ||
          (activeFilter === 'groups' && conversation.isGroup) ||
          (activeFilter === 'direct' && !conversation.isGroup);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        // Sort by latest message timestamp
        const timeA = a.latestMessage?.createdAt ? new Date(a.latestMessage.createdAt).getTime() : 0;
        const timeB = b.latestMessage?.createdAt ? new Date(b.latestMessage.createdAt).getTime() : 0;
        return timeB - timeA;
      });
  }, [conversations, searchTerm, activeFilter]);

  const getTypingText = (conversationId: string) => {
    const typingUsersInConvo = typingUsers[conversationId] || [];
    const otherTypingUsers = typingUsersInConvo.filter(user => user.id !== currentUser?.id);

    if (!otherTypingUsers.length) return null;
    if (otherTypingUsers.length === 1) return `${otherTypingUsers[0].firstName} is typing...`;
    return `${otherTypingUsers.length} people are typing...`;
  };

  const handleFilterClick = (filter: 'all' | 'groups' | 'direct') => {
    setActiveFilter(filter);
    setShowFilters(false);
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
      <div className={`p-4 md:p-6 border-b ${currentTheme.divider} space-y-4`}>
        <div className="flex items-center justify-between">
          <h1 className={`text-xl md:text-2xl font-bold ${currentTheme.headerText}`}>
            Messages
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCreateGroup(true)}
              className={`p-2 ${currentTheme.buttonHover} rounded-xl transition-colors group relative`}
            >
              <Plus className={currentTheme.iconColor} />
              <span className={`absolute right-0 top-full mt-2 px-2 py-1 ${currentTheme.tooltipBg} ${currentTheme.tooltipText} text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                New Chat
              </span>
            </button>
            <button
              className={`p-2 ${currentTheme.buttonHover} rounded-xl transition-colors ${showFilters ? 'bg-blue-500/10' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className={`${currentTheme.iconColor} ${showFilters ? 'text-blue-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme.iconColor}`} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${currentTheme.searchBg} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${currentTheme.searchText} ${currentTheme.searchPlaceholder} border ${currentTheme.border}`}
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'All', icon: MessageCircle },
              { id: 'groups', label: 'Groups', icon: Users },
              { id: 'direct', label: 'Direct', icon: MessageCircle }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterClick(filter.id as 'all' | 'groups' | 'direct')}
                className={`
                  flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm
                  transition-all duration-200
                  ${activeFilter === filter.id
                    ? 'bg-blue-500 text-white'
                    : `${currentTheme.buttonHover} ${currentTheme.text}`
                  }
                `}
              >
                <filter.icon className="w-4 h-4" />
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-custom">
        {sortedAndFilteredConversations.map((conversation) => {
          if (!conversation) return null;

          const isActive = activeConversationId === conversation.id;
          const typingText = getTypingText(conversation.id);

          return (
            <div key={conversation.id} className="relative group">
              <button
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full p-4 flex items-center space-x-4 transition-colors ${isActive ? currentTheme.activeItem : currentTheme.buttonHover
                  }`}
              >
                {/* Avatar and Status */}
                <div className="relative flex-shrink-0">
                  <img
                    src={conversation.picture || `https://ui-avatars.com/api/?name=${conversation.name}`}
                    alt={conversation.name}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ${isActive ? 'ring-2 ring-blue-500' : ''
                      }`}
                  />
                  {!conversation.isGroup && (
                    <UserStatus
                      userId={conversation.users.find(u => u.id !== currentUser?.id)?.id || ''}
                      className="absolute -bottom-1 -right-1"
                    />
                  )}
                  {conversation.isGroup && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                      <Users className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Conversation Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-semibold truncate ${currentTheme.headerText}`}>
                      {conversation.name}
                    </h3>
                    {conversation.latestMessage && (
                      <span className={`text-xs ${currentTheme.mutedText}`}>
                        {formatDistanceToNow(new Date(conversation.latestMessage.createdAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm truncate ${typingText ? 'text-blue-500 font-medium animate-pulse' : currentTheme.mutedText}`}>
                    {typingText || conversation.latestMessage?.content || 'No messages yet'}
                  </p>
                </div>
              </button>

              {/* Group Actions Button */}
              {conversation.isGroup && (
                <button
                  onClick={() => setShowGroupActions(showGroupActions === conversation.id ? null : conversation.id)}
                  className={`
      absolute right-2 top-1/2 -translate-y-1/2
      p-2 rounded-full
      ${currentTheme.buttonHover}
      opacity-0 group-hover:opacity-100
      transition-opacity duration-200
    `}
                >
                  <Settings className={`w-4 h-4 ${currentTheme.iconColor}`} />
                </button>
              )}

              {/* Group Actions Dropdown */}
              {showGroupActions === conversation.id && currentUser && (
                <GroupActions
                  conversation={conversation}
                  currentUser={currentUser}
                  onClose={() => setShowGroupActions(null)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Create Group Dialog */}
      <CreateGroupDialog
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
      />
    </div>
  );
}