import React, { useEffect } from "react";
import Sidebar from "../containers/ChatPage/Sidebar";
import ChatList from "../containers/ChatPage/ChatList";
import ChatSection from "../containers/ChatPage/ChatSection";

export default function ChatPage() {
  useEffect(() => {
    document.title = "Chat";
  }, []);

  return (
      <div className="flex bg-black font-nanum text-white relative">
      <Sidebar />
      <ChatList />
      <ChatSection />   
    </div>
  );
}