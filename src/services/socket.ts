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
} from "../redux/chatSlice";
import React from "react";
import toast from "react-hot-toast";
import { createRoot } from "react-dom/client";
import CallNotification from "@/components/chat/CallNotification";

interface MessagePayload {
  conversationId: string;
  content: string;
  files?: Array<{
    url: string;
    type: 'image' | 'document';
  }>;
}

class SocketService {
  public socket: Socket | null = null;
  private readonly url: string = "wss://veltra2.duckdns.org";
  private typingTimeout: Record<string, NodeJS.Timeout> = {};
  private callNotificationContainer: HTMLDivElement | null = null;

  constructor() {
      // Create container for call notifications
    this.callNotificationContainer = document.createElement('div');
    this.callNotificationContainer.id = 'call-notifications';
    document.body.appendChild(this.callNotificationContainer);
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
    });
  // Call events
    this.socket.on("receive-call", (data) => {
      console.log('asfasf')
  if (!this.callNotificationContainer) return;

  // Create a root for call notification
  const notificationRoot = createRoot(this.callNotificationContainer);

  // Render the CallNotification component
  notificationRoot.render(
    React.createElement(CallNotification, {
      caller: data.from,
      onAccept: () => {
        store.dispatch(setIncomingCall({ from: data.from, offer: data.offer }));
        notificationRoot.unmount();
      },
      onReject: () => {
        this.socket?.emit('call-rejected', { to: data.from.id });
        notificationRoot.unmount();
      }
    })
  );
    });


    // User status events
    this.socket.on("userOnline", ({ user }) => {
      store.dispatch(updateOnlineUsers({ user, status: "online" }));
    });

    this.socket.on("userOffline", ({ user }) => {
      store.dispatch(updateOnlineUsers({ user, status: "offline" }));
    });

    // Message events
    this.socket.on("receiveMessage", (message) => {
      store.dispatch(addMessage(message));
      // Fetch updated conversations to get latest order
      store.dispatch(getConversations());
    });

    // this.socket.on("messageSent", (message) => {
    //   store.dispatch(addMessage(message));
    //   // Fetch updated conversations to get latest order
    //   store.dispatch(getConversations());
    // });

    // Conversation events
    this.socket.on("joinedConversation", ({ conversation }) => {
      store.dispatch(addNewConversation(conversation));
    });

    this.socket.on("newConversation", (conversation) => {
      store.dispatch(addNewConversation(conversation));
    });

    this.socket.on("userJoined", ({ user, conversationId }) => {
      store.dispatch(getConversations());
    });

    this.socket.on("userLeft", ({ user, conversationId }) => {
      store.dispatch(
        removeUserFromConversation({ conversationId, userId: user.id })
      );
    });

  this.socket.on("call-user", ({ from, offer, conversationId }) => {
    const conversation = store
      .getState()
      .chat.conversations.find((c) => c.id === conversationId);

    if (!conversation) return;

    // Show incoming call notification
    toast(
      React.createElement(
        "div",
        { className: "flex flex-col space-y-2" },
        React.createElement(
          "div",
          { className: "flex items-center space-x-3" },
          React.createElement("img", {
            src:
              from.avatar ||
              `https://ui-avatars.com/api/?name=${from.firstName}`,
            alt: from.firstName,
            className: "w-10 h-10 rounded-full",
          }),
          React.createElement(
            "div",
            null,
            React.createElement(
              "p",
              { className: "font-semibold" },
              `${from.firstName} is calling...`
            ),
            React.createElement(
              "p",
              { className: "text-sm text-gray-500" },
              "Video Call"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "flex justify-end space-x-2" },
          React.createElement(
            "button",
            {
              onClick: () => {
                toast.dismiss();
                this.socket?.emit("reject-call", {
                  to: from.id,
                  conversationId,
                });
              },
              className:
                "px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600",
            },
            "Decline"
          ),
          React.createElement(
            "button",
            {
              onClick: () => {
                toast.dismiss();
                store.dispatch(setIncomingCall({ from: from.id, offer }));
                window.location.href = `/call/${conversationId}`;
              },
              className:
                "px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600",
            },
            "Answer"
          )
        )
      ),
      { duration: 30000, position: "top-center" }
    );
  });
    
      // Group management events
    this.socket.on("usersAdded", ({ conversation, message, addedUsers }: GroupUpdateEvent) => {
      store.dispatch(updateGroupMembers({ conversation, addedUsers }));
      toast.success(message);
    });

    this.socket.on("conversationAdminGroupUpdated", ({ conversation, message }: GroupUpdateEvent) => {
      store.dispatch(updateConversation(conversation));
      toast.success(message);
    });

    this.socket.on("conversationGroupInfoUpdated", ({ conversation, message }: GroupUpdateEvent) => {
      store.dispatch(updateConversation(conversation));
      toast.success(message);
    });

    this.socket.on("stopTypingByAdminDeleted", ({ conversationId }) => {
      toast.error("You have been removed from this group");
      store.dispatch(removeConversation(conversationId));
    });

    this.socket.on("usersRemovedFromGroup", ({ conversation, message, removedUsers }: GroupUpdateEvent) => {
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

    this.socket.on("receive-call", ({ from, offer }) => {
      store.dispatch(setIncomingCall({ from, offer }));
    });

    this.socket.on("call-answered", ({ answer }) => {
      store.dispatch(setCallAnswered(answer));
    });

    this.socket.on("ice-candidate", ({ candidate }) => {
      store.dispatch(addIceCandidate(candidate));
    });

    this.socket.on("call-ended", () => {
      store.dispatch(endCall());
    });
    

  }

  public joinConversation(conversationId: string): void {
    if (this.socket) {
      this.socket.emit("joinConversation", { conversationId });
    }
  }

public async sendMessage(payload: Partial<MessagePayload>): Promise<void> {
  if (!this.socket) return;

  // Kiểm tra payload
  if (!payload.conversationId) {
    console.error('Missing conversationId');
    return;
  }

  // Đảm bảo content và files luôn tồn tại
  const messagePayload = {
    conversationId: payload.conversationId,
    content: payload.content || '',
    files: payload.files || []
  };

  try {
    // Sử dụng callback để xử lý phản hồi từ server
    this.socket.emit("sendMessage", messagePayload, (response: any) => {
      if (response?.id) {
        console.log('Message sent successfully:', response);
      } else {
        console.error('Failed to send message:', response?.message || 'Unknown error');
      }
    });

    // Gửi sự kiện dừng nhập văn bản (stop typing)
    this.sendStopTyping(payload.conversationId);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

  public sendTyping(conversationId: string): void {
    if (!this.socket) return;

    // Clear existing timeout
    if (this.typingTimeout[conversationId]) {
      clearTimeout(this.typingTimeout[conversationId]);
    }

    // Send typing event
    this.socket.emit("typing", { conversationId });

    // Set new timeout to stop typing
    this.typingTimeout[conversationId] = setTimeout(() => {
      this.sendStopTyping(conversationId);
    }, 3000); // Stop typing after 3 seconds of inactivity
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
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
