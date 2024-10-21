import React, { useEffect, useState } from 'react';
import { Edit2Icon, SearchIcon } from 'lucide-react';
import http from '@/utils/http';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

interface Message {
  id: string;
  content: string;
  sender: User;
  createdAt: string;
}

interface Conversation {
  id: string;
  name: string;
  picture: string | null;
  isGroup: boolean;
  users: User[];
  latestMessage?: Message;
}

interface ChatListProps {
  activeConversationId: string | undefined;
  onSelectConversation: (conversationId: string) => void;
  conversations: Conversation[];
}

export default function ChatList({ activeConversationId, onSelectConversation,conversations }: ChatListProps) {
  const [groupConversations, setGroupConversations] = useState<Conversation[]>([]);
  const [privateConversations, setPrivateConversations] = useState<Conversation[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Lấy ID người dùng hiện tại từ localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUserId(user.id);
    }
   
  }, []);

  // Lấy danh sách cuộc trò chuyện từ API
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await http.get('/conversations?page=1&limit=10&sortBy=createdAt&order=DESC');
        const { results } = response.data.data;

        const groups = results.filter((conv: Conversation) => conv.isGroup);
        const privates = results.filter((conv: Conversation) => !conv.isGroup);

        setGroupConversations(groups);
        setPrivateConversations(privates);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách cuộc trò chuyện:', error);
      }
    };

    fetchConversations();
  }, []);

  const getOtherUser = (users: User[]) =>
    users.find((user) => user.id !== currentUserId);

  const formatMessage = (conversation: Conversation) => {
    const latestMessage = conversation.latestMessage;
    if (!latestMessage) return 'Chưa có tin nhắn';

    const isCurrentUserSender = latestMessage.sender.id === currentUserId;
    return isCurrentUserSender
      ? `Bạn: ${latestMessage.content}`
      : latestMessage.content;
  };

  return (
    <div className="flex w-[397px] flex-col justify-between border-e border-gray-800 bg-black h-screen overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="text-xl font-bold h-[75px] flex items-center justify-between pt-9 px-6 pb-3">
          young.clement <Edit2Icon className="size-5" />
        </div>

        <div className="mt-[22px] flex-grow overflow-y-auto scrollbar-custom">
          <div className="relative px-6">
            <label htmlFor="Search" className="sr-only">Search</label>
            <input
              type="text"
              id="Search"
              placeholder="Tìm kiếm"
              className="w-full rounded-md bg-[#363636] text-white py-2 pl-4 pe-10 shadow-sm lg:text-base font-light sm:text-sm"
            />
            <span className="absolute inset-y-0 end-6 grid w-10 place-content-center pr-2">
              <button type="button" className="text-white hover:text-white">
                <SearchIcon className="size-5" />
              </button>
            </span>
          </div>

          {/* Nhóm */}
          <div className="mt-6 px-6">
            <p className="font-semibold mb-3">Nhóm</p>
            <ul className="overflow-y-auto">
              {groupConversations.map((conversation) => (
                <li key={conversation.id}>
                  <div
                    className={`flex items-center space-x-3 py-2 px-6 cursor-pointer ${activeConversationId === conversation.id
                        ? 'bg-secondary'
                        : 'hover:bg-[#0a0a0a] transition-colors duration-200'
                      }`}
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <img
                      src={conversation.picture || '/default-avatar.png'}
                      className="size-14 rounded-full object-cover"
                      alt={`${conversation.name}'s avatar`}
                    />
                    <p className="text-[0.9rem] font-medium text-white truncate">
                      {conversation.name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Tin nhắn riêng */}
          <p className="font-semibold mt-[22px] px-6">Tin nhắn</p>
          <ul className="overflow-y-auto">
            {privateConversations.map((conversation) => {
              const otherUser = getOtherUser(conversation.users);

              return (
                <li key={conversation.id}>
                  <div
                    className={`flex items-center space-x-3 py-2 px-6 cursor-pointer ${activeConversationId === conversation.id
                        ? 'bg-secondary'
                        : 'hover:bg-[#0a0a0a] transition-colors duration-200'
                      }`}
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <img
                      src={otherUser?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrHHYUISImucI3BKzAHDpUUUeBqB4Nis3Adx0qHhJn7aD1iS2ReYyFDr3h9L4TPkhvBpc&usqp=CAU'}
                      className="size-14 rounded-full object-cover"
                      alt={`${otherUser?.firstName} ${otherUser?.lastName}'s avatar`}
                    />
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <p className="text-[0.9rem] font-medium text-white truncate">
                        {otherUser
                          ? `${otherUser.firstName} ${otherUser.lastName}`
                          : 'Người dùng'}
                      </p>
                      <p className="text-xs text-[#a8a8a8] w-[397px] truncate">
                        {formatMessage(conversation)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
