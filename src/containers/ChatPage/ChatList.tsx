import CreateGroupDialog from "@/components/chat/CreateGroupDialog";
import { themes, useTheme } from "@/contexts/ThemeContext";
import { Conversation, getConversationsWithTotal } from "@/redux/chatSlice";
import { RootState } from "@/redux/store";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";

interface ChatListProps {
  activeConversationId: string | undefined;
  onSelectConversation: (id: string) => void;
  isVisible?: boolean;
}

export default function ChatList({
  activeConversationId,
  onSelectConversation,
  isVisible = true,
}: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "groups" | "direct">("all");
  const [showGroupActions, setShowGroupActions] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user?.user);
  const conversations = useSelector((state: RootState) => state.chat.conversations);
  const typingUsers = useSelector((state: RootState) => state.chat.typingUsers);
  const onlineUsers = useSelector((state: RootState) => state.chat.onlineUsers);
  const total = useSelector((state: RootState) => state.chat.total); // Tổng số conversations

  useEffect(() => {
    // Fetch lần đầu tiên
    dispatch(getConversationsWithTotal({ page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    // Nếu page > 1 thì fetch thêm dữ liệu
    if (page > 1) {
      dispatch(getConversationsWithTotal({ page })).then((res: any) => {
        if (conversations.length >= total) {
          setHasMore(false); // Hết dữ liệu
        }
      });
    }
  }, [page, dispatch, conversations.length, total]);

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Tăng số trang
    }
  };

  const getConversationInfo = (conversation: Conversation) => {
    if (!conversation) return { name: "", otherUser: null };

    if (conversation.isGroup) {
      return {
        name: conversation.name || "",
        picture: conversation.picture || "",
        otherUser: null,
      };
    }

    const otherUser = conversation.users?.find((user) => user.id !== currentUser?.id);
    return {
      name: otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "",
      picture: otherUser?.avatar || "",
      otherUser,
    };
  };

  const formatMessageTime = (timestamp: string | undefined) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    try {
      return formatDistanceToNow(date, { addSuffix: false });
    } catch (error) {
      console.error("Error formatting message time:", error);
      return "";
    }
  };

  const isConversationOnline = (conversation: Conversation) => {
    if (!conversation) return false;

    if (!conversation.isGroup) {
      const otherUser = conversation.users.find((u) => u.id !== currentUser?.id);
      return otherUser ? onlineUsers.some((u) => u.id === otherUser.id) : false;
    }

    return conversation.users.some(
      (user) => user.id !== currentUser?.id && onlineUsers.some((u) => u.id === user.id)
    );
  };

  const getOnlineMembersCount = (conversation: Conversation) => {
    if (!conversation.isGroup) return 0;
    return conversation.users.filter(
      (user) => user.id !== currentUser?.id && onlineUsers.some((u) => u.id === user.id)
    ).length;
  };

  const sortedAndFilteredConversations = useMemo(() => {
    return (conversations || [])
      .filter((conversation) => {
        const { name } = getConversationInfo(conversation);
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
          activeFilter === "all" ||
          (activeFilter === "groups" && conversation.isGroup) ||
          (activeFilter === "direct" && !conversation.isGroup);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const timeA = a?.latestMessage?.createdAt
          ? new Date(a.latestMessage.createdAt).getTime()
          : 0;
        const timeB = b?.latestMessage?.createdAt
          ? new Date(b.latestMessage.createdAt).getTime()
          : 0;
        return timeB - timeA;
      });
  }, [conversations, searchTerm, activeFilter, currentUser?.id]);

  const getTypingText = (conversationId: string) => {
    const typingUsersInConvo = typingUsers[conversationId] || [];
    const otherTypingUsers = typingUsersInConvo.filter((user) => user.id !== currentUser?.id);

    if (!otherTypingUsers.length) return null;
    if (otherTypingUsers.length === 1) return `${otherTypingUsers[0].firstName} is typing...`;
    return `${otherTypingUsers.length} people are typing...`;
  };

  return (
    <div
      className={`
        w-full md:w-96 h-screen ${currentTheme.bg} flex flex-col border-r ${currentTheme.border}
        fixed md:relative
        ${isVisible ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        transition-transform duration-300 ease-in-out
        z-20 md:z-auto
      `}
    >
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
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.iconColor}`}
          />
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
      </div>

      {/* Conversations List */}
      <div id="scrollableDiv" className="flex-1 overflow-y-auto scrollbar-custom">
        <InfiniteScroll
          dataLength={conversations.length}
          next={fetchMoreData}
          hasMore={hasMore}
          // loader={<h2 style={{ textAlign: "center" }}>Loading...</h2>}
          scrollableTarget="scrollableDiv"
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>You have seen it all</b>
            </p>
          }
        >
          <AnimatePresence>
            {sortedAndFilteredConversations.map((conversation) => {
              if (!conversation) return null;

              const { name, picture } = getConversationInfo(conversation);
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

                    {conversation.isGroup ? (
                      // Trạng thái cho nhóm
                      <div
                        className={`
      absolute -bottom-1 -right-1 w-4 h-4 flex items-center justify-center
      rounded-full border-2 border-white dark:border-gray-900
      transition-all duration-200
      ${onlineMembersCount > 0 ? 'bg-green-500' : 'bg-gray-400'} // Màu sắc thay đổi theo trạng thái online
    `}
                        title={
                          onlineMembersCount > 0
                            ? `${onlineMembersCount} thành viên online`
                            : 'Không có thành viên nào online'
                        } // Tooltip hiển thị
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-2 h-2 text-white"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 0a4 4 0 1 1 0 8A4 4 0 0 1 8 0zm2 9H6a4 4 0 0 0-4 4v.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V13a4 4 0 0 0-4-4z" />
                        </svg>
                      </div>
                    ) : (
                      // Trạng thái cho cá nhân
                      <div
                        className={`
      absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full
      ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
      border-2 border-white dark:border-gray-900
      transition-all duration-200
    `}
                        title={isOnline ? 'Online' : 'Offline'} // Tooltip cho trạng thái
                      />
                    )}

                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className={`font-semibold truncate max-w-40 ${currentTheme.text}`}>
                        {name}
                      </h3>
                      <h4 className={`text-right text-sm ${currentTheme.text} truncate w-30`}>
                        {conversation.latestMessage?.createdAt
                          ? formatMessageTime(conversation.latestMessage.createdAt)
                          : "No messages"}
                      </h4>
                    </div>
                    <p
                      className={`text-sm truncate ${typingText ? "text-blue-500 font-medium" : currentTheme.mutedText
                        }`}
                    >
                      {typingText ||
                        (conversation.latestMessage?.sender?.id === currentUser?.id
                          ? "You: "
                          : "")}
                      {conversation.latestMessage?.content || "No messages yet"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </InfiniteScroll>
      </div>

      {/* Create Group Dialog */}
      <CreateGroupDialog isOpen={showCreateGroup} onClose={() => setShowCreateGroup(false)} />
    </div>
  );
}
