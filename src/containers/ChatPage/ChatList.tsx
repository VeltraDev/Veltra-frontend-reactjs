import React from 'react';
import { Edit2Icon, EditIcon, SearchIcon } from 'lucide-react';
import { Conversation } from '../../mockData/chatData';


interface ChatListProps {
  conversations: Conversation[];
  activeConversationId: string | undefined;
  onSelectConversation: (conversationId: string) => void;
}

export default function ChatList({ conversations, activeConversationId, onSelectConversation }: ChatListProps) {
  return (
    <div className="flex max-w-[397px] flex-col justify-between border-e border-gray-800 bg-black h-screen overflow-hidden">
      <div className="flex flex-col h-full ">
        <div className="text-xl font-bold h-[75px] flex items-center justify-between pt-9 px-6 pb-3-">young.clement<span><Edit2Icon className='size-5' /></span></div>

        <div className="mt-[22px] flex-grow overflow-y-auto scrollbar-custom">
          <div className="relative px-6 ">
            <label htmlFor="Search" className="sr-only font-medium"> Search </label>

            <input
              type="text"
              id="Search"
              placeholder="Tìm kiếm"
              className="w-full rounded-md  bg-[#363636] text-white py-2 pl-4 pe-10 shadow-sm lg:text-base font-light sm:text-sm"
            />

            <span className="absolute inset-y-0 end-6 grid w-10 place-content-center pr-2 ">
              <button type="button" className="text-white hover:text-white">
                <span className="sr-only">Search</span>

                <SearchIcon className='size-5 ' />
              </button>
            </span>
          </div>
          <div className="mt-6 px-6">
            <p className='font-semibold mb-3'>Nhóm</p>
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center space-x-3 p-2 rounded-lg bg-secondary hover:bg-gray-700 transition-colors duration-200">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">G</span>
                  </div>
                  <span className="text-white">General</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-se transition-colors duration-200">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">P</span>
                  </div>
                  <span className="text-white">Project A</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-se transition-colors duration-200">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">T</span>
                  </div>
                  <span className="text-white">Team Chat</span>
                </a>
              </li>
            </ul>
          </div>
          <p className='font-semibold mt-[22px] px-6'>Tin nhắn</p>
          <ul className="overflow-y-auto ">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <div
                  className={`flex items-center space-x-3 py-2 px-6 cursor-pointer ${activeConversationId === conversation.id
                      ? 'bg-secondary'
                      : 'hover:bg-[#0a0a0a] transition-colors duration-200'
                    }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <img src={conversation.user.avatar} className='size-14 rounded-full object-cover' alt={`${conversation.user.name}'s avatar`} />
                  <div className='flex flex-col overflow-hidden'>
                    <p className='text-[0.9rem] font-medium text-white truncate'>{conversation.user.name}</p>
                    <p className='text-xs text-[#a8a8a8] w-[397px] truncate' >
                      {conversation.messages[conversation.messages.length - 1]?.sender === 'self'
                        ? `Bạn: ${conversation.messages[conversation.messages.length - 1]?.content}`
                        : conversation.messages[conversation.messages.length - 1]?.content}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
