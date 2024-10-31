import React, { useEffect, useState } from "react";
import Sidebar from "../containers/ChatPage/Sidebar";
import ChatList from "../containers/ChatPage/ChatList";
import ChatSection from "../containers/ChatPage/ChatSection";
import { getConversationMessages, getConversations, setActiveConversation, sendMessage } from "@/features/chatSlice";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { useSocket } from "@/context/SocketContext"; 

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector((state) => state.chat.conversations);
  const activeConversation = useAppSelector((state) => state.chat.activeConversation);
  const { socketService } = useSocket(); 
  const [typingUser, setTypingUser] = useState<{ id: string; conversationId: string } | null>(null); 
  useEffect(() => {
    console.log('Fetching conversations...');
    dispatch(getConversations());
  }, [dispatch]);

  useEffect(() => {
    if (conversations.length > 0 && !activeConversation) {
      dispatch(setActiveConversation(conversations[0]));
    }
  }, [conversations, activeConversation, dispatch]);

  useEffect(() => {
    if (!socketService) return;

    const handleTypingInfo = (conversationId: string, user: { id: string }) => {
      if (conversationId === activeConversation?.id) {
        setTypingUser({ id: user.id, conversationId }); 
      }
    };

    const handleStopTyping = (conversationId: string) => {
      if (conversationId === activeConversation?.id) {
        setTypingUser(null);
      }
    };

    socketService.onTypingInfo(handleTypingInfo);
    socketService.onStopTyping(handleStopTyping);

    return () => {
      socketService.onStopTypingInfo(handleTypingInfo);
      socketService.onStopTyping  (handleStopTyping);
    };
  }, [socketService, activeConversation]);

  const handleConversationSelect = (conversationId: string) => {
    dispatch(getConversationMessages({ convo_id: conversationId }));
    const selectedConversation = conversations.find(convo => convo.id === conversationId);
    if (selectedConversation) {
      dispatch(setActiveConversation(selectedConversation));
    }
  };

  const handleSendMessage = (content: string) => {
    if (activeConversation) {
      dispatch(sendMessage({ token: 'your_token', message: content, convo_id: activeConversation.id, files: [] }));
    }
  };

  return (
    <div className="flex bg-black font-sans text-white relative">
      <Sidebar />
      <ChatList
        conversations={conversations}
        activeConversationId={activeConversation?.id}
        onSelectConversation={handleConversationSelect}
        typingUser={typingUser} 
      />
      <ChatSection
        conversation={activeConversation}
        onSendMessage={handleSendMessage}
        typingUser={typingUser}
      />
    </div>
  );
}
