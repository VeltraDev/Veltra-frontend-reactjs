import { io, Socket } from "socket.io-client";
import { store } from "../redux/store";
import {
  updateMessagesAndConversations,
  removeUserFromConversation,
  addNewConversation,
  getConversations,
  updateOnlineUsers,
  setTypingUser,
  removeTypingUser,
  addMessage,
  setCallAnswered,
  setIncomingCall,
  endCall,
  addIceCandidate,
  updateConversation,
  removeConversation,
  updateGroupMembers,
  removeGroupMembers,
  User,
} from "../redux/chatSlice";
import { toast } from "react-hot-toast";
import React from "react";
import { createRoot } from 'react-dom/client';
import CallNotification from "../components/chat/CallNotification";
import { ThemeProvider } from "../contexts/ThemeContext";

class SocketService {
  public socket: Socket | null = null;
  private readonly url: string = "wss://veltra2.duckdns.org";
  private typingTimeout: Record<string, NodeJS.Timeout> = {};
  private notificationRoot: ReturnType<typeof createRoot> | null = null;
  private notificationContainer: HTMLDivElement | null = null;

  private createNotificationContainer() {
    if (!this.notificationContainer) {
      this.notificationContainer = document.createElement('div');
      this.notificationContainer.style.position = 'fixed';
      this.notificationContainer.style.top = '20px';
      this.notificationContainer.style.right = '20px';
      this.notificationContainer.style.zIndex = '9999';
      document.body.appendChild(this.notificationContainer);
      this.notificationRoot = createRoot(this.notificationContainer);
    }
  }

  private cleanupNotification() {
    if (this.notificationRoot) {
      this.notificationRoot.unmount();
      this.notificationRoot = null;
    }
    if (this.notificationContainer) {
      document.body.removeChild(this.notificationContainer);
      this.notificationContainer = null;
    }
  }

  public connect(): void {
    if (this.socket?.connected) return;

    const token = store.getState().auth.accessToken;
    if (!token) {
      console.warn("No access token found. Cannot connect to socket.");
      return;
    }

    this.socket = io(this.url, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on("connect", () => {
      console.log("Connected to chat server");
      store.dispatch(getConversations());
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
      this.cleanupNotification();
    });

    // Online users events
    this.socket.on("onlineUsers", (data: { users: User[] }) => {
      console.log("Received initial online users:", data.users);
      store.dispatch(updateOnlineUsers(data.users));
    });
this.socket.on("userOnline", (data: { user: User }) => {
      console.log("User connected:", data.user);
      store.dispatch(updateOnlineUsers({ user: data.user, status: 'online' }));
    });

    this.socket.on("userOffline", (data: { user: User }) => {
      console.log("User disconnected:", data.user);
      store.dispatch(updateOnlineUsers({ user: data.user, status: 'offline' }));
    });

    // Message events
    this.socket.on("receiveMessage", (message) => {
      store.dispatch(addMessage(message));
      store.dispatch(getConversations());
    });

    // Call events
 this.socket.on("receive-call", (data) => {
  console.log("Received call:", data);
  const { from, conversationId, offer } = data;

  // Cập nhật Redux để lưu trạng thái cuộc gọi đến
  store.dispatch(setIncomingCall({ from, conversationId, offer }));

  // Hiển thị thông báo cuộc gọi
  this.showCallNotification({
    from,
    conversationId,
    offer,
    message: `${from.firstName} ${from.lastName} is calling you...`
  });
});


    this.socket.on("call-answered", (data) => {
      console.log('hehe')
      store.dispatch(setCallAnswered(data.answer));
    });

    this.socket.on("ice-candidate", (data) => {
    
      store.dispatch(addIceCandidate(data.candidate));
    });

    this.socket.on("call-ended", () => {
    
      store.dispatch(endCall());
      this.cleanupNotification();
      toast.info("Call ended");
    });

    this.socket.on("call-rejected", () => {
    
      store.dispatch(endCall());
      this.cleanupNotification();
      toast.error("Call rejected");
    });

    // Group management events
    this.socket.on("usersAdded", ({ conversation, message, addedUsers }) => {
      store.dispatch(updateGroupMembers({ conversation, addedUsers }));
      toast.success(message);
    });

    this.socket.on("conversationAdminGroupUpdated", ({ conversation, message }) => {
      store.dispatch(updateConversation(conversation));
      toast.success(message);
    });

    this.socket.on("conversationGroupInfoUpdated", ({ conversation, message }) => {
      store.dispatch(updateConversation(conversation));
      toast.success(message);
    });

    this.socket.on("usersRemovedFromGroup", ({ conversation, message, removedUsers }) => {
      store.dispatch(removeGroupMembers({ conversation, removedUsers }));
      toast.info(message);
    });

    this.socket.on("conversationDeleted", ({ conversationId, message }) => {
      store.dispatch(removeConversation(conversationId));
      toast.info(message);
    });

    this.socket.on("userLeftConversation", ({ userId, conversationId, message }) => {
      store.dispatch(removeUserFromConversation({ conversationId, userId }));
      toast.info(message);
    });

    this.socket.on("conversationCreated", ({ conversation, message }) => {
      store.dispatch(addNewConversation(conversation));
      toast.success(message);
    });

    // Typing events
this.socket.on("typingInfo", ({ conversationId, user }) => {
      store.dispatch(setTypingUser({ conversationId, user }));
    });

    this.socket.on("stopTypingInfo", ({ conversationId, user }) => {
      store.dispatch(removeTypingUser({ conversationId, userId: user.id }));
    });
  }

private showCallNotification(data: { 
  from: any; 
  conversationId: string; 
  offer: RTCSessionDescriptionInit;
  message: string;
}) {
  console.log("Showing call notification:", data);
  
  this.createNotificationContainer();

  if (this.notificationRoot) {
    this.notificationRoot.render(
      React.createElement(ThemeProvider, null,
        React.createElement(CallNotification, {
          caller: data.from,
          conversationId: data.conversationId,
          onAccept: () => {
            store.dispatch(setIncomingCall({
              from: data.from,
              conversationId: data.conversationId,
              offer: data.offer
            }));
            window.location.href = `/call/${data.conversationId}`;
            this.cleanupNotification();
          },
          onReject: () => {
            if (this.socket) {
              this.socket.emit('call-rejected', { conversationId: data.conversationId, to: data.from.id });
              store.dispatch(endCall());
              this.cleanupNotification();
            }
          }
        })
      )
    );

    // Tự động tắt thông báo sau 30 giây
    setTimeout(() => {
      this.cleanupNotification();
    }, 30000);
  }
}


 
public callUser(conversationId: string, toUserId: string, offer: RTCSessionDescriptionInit): void {
  if (!this.socket) return;

  console.log("Calling user with conversation:", { conversationId, toUserId, offer });
  
  // Gửi yêu cầu gọi với conversationId và offer
  this.socket.emit('call-user', {
    conversationId,
    to: toUserId,
    offer
  });
}

public answerCall(conversationId: string, fromUserId: string, answer: RTCSessionDescriptionInit): void {
  if (!this.socket) return;

  console.log("Answering call:", { conversationId, fromUserId, answer });
  
  // Gửi trả lời với conversationId và answer
  this.socket.emit('answer-call', {
    conversationId,
    to: fromUserId,
    answer
  });
}


  public sendIceCandidate(conversationId: string, toUserId: string, candidate: RTCIceCandidate): void {
  if (!this.socket) return;

  console.log("Sending ICE candidate:", { conversationId, toUserId, candidate });
  
  // Gửi ICE candidate cùng conversationId
  this.socket.emit('send-ice-candidate', {
    conversationId,
    to: toUserId,
    candidate
  });
}


public endCall(conversationId: string, toUserId: string): void {
  if (!this.socket) return;

  console.log("Ending call for conversation:", conversationId);
  
  // Gửi yêu cầu kết thúc cuộc gọi với conversationId
  this.socket.emit('end-call', { conversationId, to: toUserId });
}


  // Message methods
  public async sendMessage(payload: { 
    conversationId: string; 
    content: string; 
    files?: Array<{ url: string; type: 'image' | 'document' }> 
  }): Promise<void> {
    if (!this.socket) return;

    try {
      this.socket.emit("sendMessage", payload, (response: any) => {
        if (response?.id) {
console.log('Message sent successfully:', response);
        } else {
          console.error('Failed to send message:', response?.message || 'Unknown error');
        }
      });

      this.sendStopTyping(payload.conversationId);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Typing methods
  public sendTyping(conversationId: string): void {
    if (!this.socket) return;

    if (this.typingTimeout[conversationId]) {
      clearTimeout(this.typingTimeout[conversationId]);
    }

    this.socket.emit("typing", { conversationId });

    this.typingTimeout[conversationId] = setTimeout(() => {
      this.sendStopTyping(conversationId);
    }, 3000);
  }

  public sendStopTyping(conversationId: string): void {
    if (!this.socket) return;

    if (this.typingTimeout[conversationId]) {
      clearTimeout(this.typingTimeout[conversationId]);
      delete this.typingTimeout[conversationId];
    }

    this.socket.emit("stopTyping", { conversationId });
  }

  public disconnect(): void {
    this.cleanupNotification();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();