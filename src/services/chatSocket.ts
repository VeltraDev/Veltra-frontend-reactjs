import { io, Socket } from "socket.io-client";

import {
  updateMessagesAndConversations,
  removeUserFromConversation,
  addNewConversation,
  getConversations,
  updateOnlineUsers,
  setTypingUser,
  removeTypingUser,
  addMessage,
  updateConversation,
  removeConversation,
  updateGroupMembers,
  removeGroupMembers,
  handleAdminDeleted,
  deleteMessageById,
} from "@/redux/chatSlice";
import { toast } from "react-hot-toast";
import { User } from "@/types/auth";
import { store } from "@/redux/store";

class ChatSocketService {
  public socket: Socket | null = null;
  private readonly url: string = "wss://veltra2.duckdns.org";
  private typingTimeout: Record<string, NodeJS.Timeout> = {};

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
      console.log("Received message:", message);
      store.dispatch(getConversations());
    });

    // Group management events
    this.socket.on("usersAdded", ({ conversation, message, addedUsers }) => {
      store.dispatch(updateGroupMembers({ conversation, addedUsers }));
      console.log("Users added to group:", message, conversation, addedUsers);
      toast.success(message);
      store.dispatch(getConversations());
    });

    this.socket.on("conversationAdminGroupUpdated", ({ conversation, message }) => {
      store.dispatch(updateConversation(conversation));
      toast.success(message);
      store.dispatch(getConversations());
    });

    this.socket.on("conversationGroupInfoUpdated", ({ conversation, message }) => {
      store.dispatch(updateConversation(conversation));
      toast.success(message);
      store.dispatch(getConversations());
    });

    this.socket.on("usersRemovedFromGroup", ({ conversation, message, removedUsers }) => {
      store.dispatch(removeGroupMembers({ conversation, removedUsers }));
      toast.info(message);
      store.dispatch(getConversations());
    });

    this.socket.on("conversationDeleted", ({ conversationId, message }) => {
      store.dispatch(removeConversation(conversationId));
      toast.info(message);
      store.dispatch(getConversations());
    });

    this.socket.on("userLeftConversation", async ({ user, conversation, message }) => {
      store.dispatch(removeUserFromConversation({ conversation, user }));
      console.log("User left conversation:", user, conversation, message);
      toast.success(message);
      await store.dispatch(getConversations());
    });

    this.socket.on("conversationCreated", ({ conversation, message }) => {
      store.dispatch(addNewConversation(conversation));
      toast.success(message);
      store.dispatch(getConversations());
    });

    // Typing events
    this.socket.on("typingInfo", ({ conversationId, user }) => {
      store.dispatch(setTypingUser({ conversationId, user }));
    });

    this.socket.on("stopTypingInfo", ({ conversationId, user }) => {
      store.dispatch(removeTypingUser({ conversationId, userId: user.id }));
    });

    // Deleted message event
    this.socket.on("deletedMessage", ({ deletedMessageInfo, conversationId, message }) => {
      store.dispatch(deleteMessageById({ messageId: deletedMessageInfo.id, conversationId }));
      console.log("Deleted message:", deletedMessageInfo, conversationId, message);
      toast.success(`Tin nhắn đã bị xóa bởi ${deletedMessageInfo.sender.firstName} ${deletedMessageInfo.sender.lastName}`);
      store.dispatch(getConversations());
    });

    // Stop typing by admin deleted event
    this.socket.on("stopTypingByAdminDeleted", ({ conversationId, message }) => {
      console.log("Stop typing by admin deleted:", conversationId, message);
      store.dispatch(handleAdminDeleted({ conversationId }));
      toast.error(message);
      store.dispatch(getConversations());
    });
  }

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
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const chatSocketService = new ChatSocketService();