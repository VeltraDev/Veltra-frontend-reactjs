import React, { useState, useEffect } from "react";
import Sidebar from "../containers/ChatPage/Sidebar";
import ChatList from "../containers/ChatPage/ChatList";
import ChatSection from "../containers/ChatPage/ChatSection";
import http from '@/utils/http';
import { Conversation, Message } from "../mockData/chatData";

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]); 
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user'); 
    if (userData) {
      const user = JSON.parse(userData); 
      setLoggedInUserId(user?.id || null); 
    }
  }, []);
 
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await http.get('/conversations?page=1&limit=10&sortBy=createdAt&order=DESC');
        setConversations(response.data.data.results);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách cuộc trò chuyện:', error);
      }
    };
    fetchConversations();
  }, []);

  
  const handleConversationSelect = async (conversationId: string) => {
    try {
      const selectedConversation = conversations.find(conv => conv.id === conversationId);
      if (selectedConversation) {
        setActiveConversation(selectedConversation);

       
        const response = await http.get(`/conversations/${conversationId}`);
        setMessages(response.data.data.messages); 
    
      }
    } catch (error) {
      console.error('Lỗi khi lấy tin nhắn:', error);
    }
  };

  // const handleSendMessage = async (content: string) => {
  //   if (activeConversation) {
  //     const newMessage = {
  //       id: `${Date.now()}`,
  //       content,
  //       sender: { id: 'self', firstName: 'You', lastName: '', avatar: null },
  //       createdAt: new Date().toISOString(),
  //     };

  //     // Gửi tin nhắn đến API (tùy vào backend của bạn)
  //     await http.post(`/conversations/${activeConversation.id}/messages`, { content });

  //     // Cập nhật tin nhắn trong state
  //     setMessages((prev) => [...prev, newMessage]);
  //   }
  // };

  return (
    <div className="flex bg-black font-sans text-white relative">
      <Sidebar />
      <ChatList
        conversations={conversations}
        activeConversationId={activeConversation?.id}
        onSelectConversation={handleConversationSelect}
      />
      <ChatSection
        conversation={activeConversation}
        messages={messages}
        currentUserId={loggedInUserId}
        // onSendMessage={handleSendMessage}
      />
    </div>
  );
}
