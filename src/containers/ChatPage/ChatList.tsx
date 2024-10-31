import React from 'react';
import { Edit2Icon, SearchIcon } from 'lucide-react';
import { Conversation } from '../../mockData/chatData';
import ConversationItem from '../../components/Chat/ConversationItem';

interface ChatListProps {
  conversations: Conversation[];
  activeConversationId: string | undefined;
  onSelectConversation: (conversationId: string) => void;
  typingUser: { id: string; conversationId: string } | null; 
}

export default function ChatList({ conversations, activeConversationId, onSelectConversation, typingUser }: ChatListProps) {
  return (
    <div className="flex max-w-[397px] flex-col justify-between border-e border-gray-800 bg-black h-screen overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="text-xl font-bold h-[75px] flex items-center justify-between pt-9 px-6 pb-3">
          young.clement
          <span><Edit2Icon className='size-5' /></span>
        </div>

        <div className="relative px-6">
          <label htmlFor="Search" className="sr-only font-medium">Search</label>
          <input
            type="text"
            id="Search"
            placeholder="Tìm kiếm"
            className="w-full rounded-md bg-[#363636] text-white py-2 pl-4 pe-10 shadow-sm lg:text-base font-light sm:text-sm"
          />
          <span className="absolute inset-y-0 end-6 grid w-10 place-content-center pr-2">
            <button type="button" className="text-white hover:text-white">
              <SearchIcon className='size-5' />
            </button>
          </span>
        </div>

        <div className="mt-6 ">
          <p className='font-semibold mb-3'>Nhóm</p>
          <ul className="space-y-2">
            {conversations?.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onSelect={() => onSelectConversation(conversation.id)}
                typingUser={typingUser} 
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
