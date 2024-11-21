import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/contexts/ThemeContext';
import { useConversation } from '@/hooks/useConversation';
import MessageList from '@/components/Chat/MessageList';
import MessageInput from '@/components/Chat/MessageInput';
import GroupInfoPanel from '@/components/Chat/GroupInfoPanel';
import ThreadPanel from '@/components/Chat/ThreadPanel';
import ForwardMessageDialog from '@/components/chat/ForwardMessageDialog';
import { toast } from 'react-hot-toast';
import { Shield, Users } from 'lucide-react';
import ChatHeader from '@/components/Chat/ChatHeader';
import { Conversation, Message } from '@/types';
import { socketService } from '@/services/socket';

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
          conversation={conversation as Conversation}
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
          typingUser={typingUser}
          onForward={(message : Message) => {
            setMessageToForward(message);
            setShowForwardDialog(true);
          }}
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
            socketService.forwardMessage({
              originalMessageId: messageToForward.id,
              targetConversationId,
            });            
            toast.success('Message forwarded successfully');
            setShowForwardDialog(false);
            setMessageToForward(null);
          }
        }}
      />
    </div>
  );
}