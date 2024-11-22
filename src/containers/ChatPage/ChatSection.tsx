import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useSocket } from '@/contexts/SocketContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useConversation } from '@/hooks/useConversation';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import GroupInfoPanel from '@/components/chat/GroupInfoPanel';
import ThreadPanel from '@/components/chat/ThreadPanel';
import ForwardMessageDialog from '@/components/chat/ForwardMessageDialog';
import { toast } from 'react-hot-toast';
import {
  Phone, Video, Search, UserPlus, MoreVertical,
  MessageSquare, Star, Archive, Bell, BellOff, Info,
  Share2, Shield, ArrowLeft, Users
} from 'lucide-react';
import ChatHeader from '@/components/chat/ChatHeader';

interface ChatSectionProps {
  conversationId?: string;
  typingUser: { id: string; conversationId: string } | null;
  onToggleSidebar?: () => void;
  onToggleChatList?: () => void;
}

export default function ChatSection({
  conversationId,
  typingUser,
  onToggleSidebar,
  onToggleChatList
}: ChatSectionProps) {
  const { currentTheme } = useTheme();
  const { conversation, isLoading, error } = useConversation(conversationId);
  const messages = useSelector((state: RootState) => state.chat.messages);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [messageToForward, setMessageToForward] = useState<Message | null>(null);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showThreadPanel, setShowThreadPanel] = useState(false);
  const [activeThread, setActiveThread] = useState<Message | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  if (error) {
    return (
      <div className={`flex-1 ${currentTheme.bg} flex items-center justify-center`}>
        <div className="text-center space-y-4">
          <Shield className={`w-16 h-16 ${currentTheme.iconColor} mx-auto`} />
          <h2 className={`text-xl font-semibold ${currentTheme.headerText}`}>
            {error}
          </h2>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className={`flex-1 ${currentTheme.bg} flex items-center justify-center`}>
        <div className="text-center space-y-4">
          <Users className={`w-16 h-16 ${currentTheme.iconColor} mx-auto`} />
          <h2 className={`text-xl font-semibold ${currentTheme.headerText}`}>
            Select a conversation to start chatting
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col h-screen ${currentTheme.bg} relative`}>
        {/* Chat Header */}
        <ChatHeader
          conversation={conversation}
          onToggleChatList={onToggleChatList}
          onToggleGroupInfo={() => setShowGroupInfo(true)}
          onToggleThread={() => setShowThreadPanel(true)}
          isMuted={isMuted}
          isStarred={isStarred}
          isArchived={isArchived}
          onToggleMute={() => setIsMuted(!isMuted)}
          onToggleStar={() => setIsStarred(!isStarred)}
          onToggleArchive={() => setIsArchived(!isArchived)}
        />

        {/* Messages */}
        <MessageList
          messages={messages}
          conversationId={conversation.id}
        />

        {/* Message Input */}
        <MessageInput conversationId={conversation.id} />
      </div>

      {/* Side Panels */}
      {(showGroupInfo || showThreadPanel) && (
        <>
          {/* Overlay for mobile */}
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => {
              setShowGroupInfo(false);
              setShowThreadPanel(false);
              setActiveThread(null);
            }}
          />

          {/* Panel Container */}
          <div className={`
            fixed right-0 top-0 h-full w-80 lg:relative lg:w-80 z-30
            ${currentTheme.bg} border-l ${currentTheme.border}
            transform transition-transform duration-300
            ${showGroupInfo || showThreadPanel ? 'translate-x-0' : 'translate-x-full'}
          `}>
            {showGroupInfo && currentUser && (
              <GroupInfoPanel
                conversation={conversation}
                currentUser={currentUser}
                onClose={() => setShowGroupInfo(false)}
              />
            )}

            {showThreadPanel && activeThread && (
              <ThreadPanel
                message={activeThread}
                onClose={() => {
                  setShowThreadPanel(false);
                  setActiveThread(null);
                }}
              />
            )}
          </div>
        </>
      )}

      {/* Forward Dialog */}
      <ForwardMessageDialog
        isOpen={showForwardDialog}
        onClose={() => {
          setShowForwardDialog(false);
          setMessageToForward(null);
        }}
        onSubmit={(targetConversationId) => {
          if (messageToForward) {
            socketService.forwardMessage(messageToForward.id, targetConversationId);
            toast.success('Message forwarded successfully');
            setShowForwardDialog(false);
            setMessageToForward(null);
          }
        }}
      />
    </div>
  );
}