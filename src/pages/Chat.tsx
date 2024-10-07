import React, { useState, useEffect } from "react";
import Sidebar from "../containers/ChatPage/Sidebar";
import ChatList from "../containers/ChatPage/ChatList";
import ChatSection from "../containers/ChatPage/ChatSection";
import { Conversation, Message, mockConversations } from "../mockData/chatData";
import { v4 as uuidv4 } from 'uuid';

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    document.title = "Chat";
    if (conversations.length > 0) {
      setActiveConversation(conversations[0]);
    }
  }, []);

  const handleConversationSelect = (conversationId: string) => {
    const selected = conversations.find(conv => conv.id === conversationId);
    if (selected) {
      setActiveConversation(selected);
    }
  };

  const handleSendMessage = (content: string) => {
    if (activeConversation) {
      const newMessage: Message = {
        id: uuidv4(),
        sender: 'self',
        content,
        timestamp: new Date()
      };

      const updatedConversation = {
        ...activeConversation,
        messages: [...activeConversation.messages, newMessage]
      };

      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === activeConversation.id ? updatedConversation : conv
        )
      );

      setActiveConversation(updatedConversation);
    }
  };

  return (
    <div className="flex bg-black font-sans  text-white relative">
      <Sidebar />
      <ChatList
        conversations={conversations}
        activeConversationId={activeConversation?.id}
        onSelectConversation={handleConversationSelect}
      />
      <ChatSection
        conversation={activeConversation}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}