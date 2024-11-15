import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getConversations, getConversationMessages, setActiveConversation } from '@/redux/chatSlice';

import Sidebar from '@/containers/ChatPage/Sidebar';
import ChatList from '@/containers/ChatPage/ChatList';
import ChatSection from '@/containers/ChatPage/ChatSection';
import { useSocket } from '@/contexts/SocketContext';

export default function ChatPage() {
  const dispatch = useDispatch<AppDispatch>();
  const conversations = useSelector((state: RootState) => state.chat.conversations);
  const activeConversation = useSelector((state: RootState) => state.chat.activeConversation);
  const { socketService } = useSocket();
  const [typingUser, setTypingUser] = useState<{ id: string; conversationId: string } | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showChatList, setShowChatList] = useState(false);

  useEffect(() => {
    // Dispatch to fetch conversations when component mounts
    dispatch(getConversations());
  }, [dispatch]);

  useEffect(() => {
    // Set the first conversation as active if no conversation is active
    if (conversations?.length > 0 && !activeConversation) {
      dispatch(setActiveConversation(conversations[0]));
    }
  }, [conversations, activeConversation, dispatch]);

  useEffect(() => {
    if (!socketService?.socket) return;

    // Socket events for typing indicators
    const handleTyping = ({ conversationId, user }: { conversationId: string; user: { id: string } }) => {
      if (conversationId === activeConversation?.id) {
        setTypingUser({ id: user.id, conversationId });
      }
    };

    const handleStopTyping = ({ conversationId }: { conversationId: string }) => {
      if (conversationId === activeConversation?.id) {
        setTypingUser(null);
      }
    };

    socketService.socket.on('typingInfo', handleTyping);
    socketService.socket.on('stopTypingInfo', handleStopTyping);

    return () => {
      socketService.socket?.off('typingInfo', handleTyping);
      socketService.socket?.off('stopTypingInfo', handleStopTyping);
    };
  }, [socketService, activeConversation]);

  const handleConversationSelect = (conversationId: string) => {
    const selectedConversation = conversations.find(convo => convo.id === conversationId);
    if (selectedConversation) {
      // Dispatches to set the active conversation and fetch its messages
      dispatch(setActiveConversation(selectedConversation));
      dispatch(getConversationMessages(conversationId));
      setShowChatList(false); // Close mobile chat list after selection
    }
  };

  return (
    <div className="flex bg-black font-sans text-white h-screen overflow-hidden">
      {/* Overlay for mobile when sidebar/chat list is open */}
      {(showSidebar || showChatList) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => {
            setShowSidebar(false);
            setShowChatList(false);
          }}
        />
      )}

      {/* Sidebar */}
      <Sidebar isVisible={showSidebar} />

      {/* Chat List */}
      <ChatList
        conversations={conversations}
        activeConversationId={activeConversation?.id}
        onSelectConversation={handleConversationSelect}
        typingUser={typingUser}
        isVisible={showChatList}
      />

      {/* Chat Section */}
      <ChatSection
        conversation={activeConversation}
        typingUser={typingUser}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onToggleChatList={() => setShowChatList(!showChatList)}
      />
    </div>
  );
}
